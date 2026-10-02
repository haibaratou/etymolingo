import http.server
import json
import mimetypes
import os
import socketserver
import urllib.parse
import webbrowser
from pathlib import Path

APP_DIR = Path(r"D:\etymolingo\work\etymopedia")
DEFAULT_ROOT = Path(r"D:\etymolingo\work\etymopedia\_illust\260925")
SETTINGS_FILE = APP_DIR / "image_viewer_paths.json"
PORT = 8765
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}

def norm_path(value):
    return str(Path(value).expanduser().resolve())

def load_settings():
    data = {"current": norm_path(DEFAULT_ROOT), "saved": [norm_path(DEFAULT_ROOT)]}
    if SETTINGS_FILE.exists():
        try:
            raw = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
            current = raw.get("current")
            saved = raw.get("saved", [])
            if isinstance(current, str):
                data["current"] = current
            if isinstance(saved, list):
                data["saved"] = [x for x in saved if isinstance(x, str)]
        except Exception:
            pass
    if data["current"] not in data["saved"]:
        data["saved"].insert(0, data["current"])
    return data

SETTINGS = load_settings()

def save_settings():
    SETTINGS_FILE.write_text(
        json.dumps(SETTINGS, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

def current_root():
    return Path(SETTINGS["current"])

def list_images():
    root = current_root()
    if not root.exists() or not root.is_dir():
        return []
    out = []
    for p in root.iterdir():
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
            try:
                st = p.stat()
                out.append({
                    "name": p.name,
                    "mtime": st.st_mtime,
                    "mtimeText": __import__("datetime").datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    "size": st.st_size,
                })
            except OSError:
                pass
    return out

HTML = r'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Etymopedia Image Viewer</title>
<style>
:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#222;--thumb:150px}
*{box-sizing:border-box}
body{margin:0;background:#f5f5f5}
header{position:sticky;top:0;z-index:20;background:white;border-bottom:1px solid #ddd;padding:10px 14px}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.row+.row{margin-top:8px}
input[type=text],select,textarea{font:inherit;border:1px solid #bbb;border-radius:6px;background:white}
input[type=text]{padding:8px 10px}
#path{flex:1;min-width:420px}
#savedPaths{min-width:330px;max-width:46vw;padding:7px}
#q{flex:1;min-width:260px;font-size:17px}
textarea{width:100%;min-height:78px;padding:8px 10px;resize:vertical;font-size:14px;line-height:1.35}
button{padding:8px 12px;cursor:pointer;border:1px solid #aaa;border-radius:6px;background:#fafafa}
button:hover{background:#eee}
button.danger{color:#a11}
#count{margin-left:auto;min-width:130px;text-align:right;color:#555}
#status{font-size:12px;color:#666;white-space:nowrap}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--thumb),1fr));gap:10px;padding:12px}
.card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:8px;cursor:pointer;overflow:hidden}
.card:hover{outline:2px solid #4a90e2}
.card img{width:100%;aspect-ratio:1/1;object-fit:contain;background:linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%);background-size:18px 18px;background-position:0 0,0 9px,9px -9px,-9px 0}
.name{font-size:13px;margin-top:6px;word-break:break-all}
.meta{font-size:11px;color:#777;margin-top:2px}
.missing{padding:8px 12px;background:#fff3cd;border-bottom:1px solid #e0cf91;color:#694f00;display:none}
#modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:50;align-items:center;justify-content:center}
#modal.open{display:flex}
#modal img{max-width:86vw;max-height:82vh;background:white}
#caption{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:#111;color:white;padding:8px 12px;border-radius:6px;font-size:16px;max-width:90vw}
.small{font-size:12px;color:#666}
</style>
</head>
<body>
<header>
  <div class="row">
    <select id="savedPaths"></select>
    <input id="path" type="text" placeholder="画像フォルダのフルパス">
    <button id="switchPath">このパスに切替</button>
    <button id="savePath">保存</button>
    <button id="deletePath" class="danger">保存パス削除</button>
    <span id="status"></span>
  </div>
  <div class="row">
    <input id="q" type="text" placeholder="通常検索（複数は改行 / カンマ / 空白区切り）">
    <select id="matchMode">
      <option value="partial">部分一致</option>
      <option value="exact">完全一致</option>
    </select>
    <select id="sort">
      <option value="name-asc">名前 ↑</option>
      <option value="name-desc">名前 ↓</option>
      <option value="mtime-desc">更新日時 新しい順</option>
      <option value="mtime-asc">更新日時 古い順</option>
    </select>
    <label>大きさ <input id="size" type="range" min="90" max="280" value="150"></label>
    <button id="clear">検索クリア</button>
    <div id="count"></div>
  </div>
  <div class="row">
    <textarea id="bulk" placeholder="ここにファイル名を一括貼り付け（1行1件）&#10;alert.png&#10;account_for.png&#10;at_hand.png"></textarea>
  </div>
  <div class="row">
    <button id="showBulk">貼り付けた画像だけ表示</button>
    <button id="clearBulk">一括指定を解除</button>
    <span class="small">完全一致（大文字小文字は無視）。空行は無視します。</span>
  </div>
</header>
<div id="missing" class="missing"></div>
<div id="grid"></div>
<div id="modal"><img id="big"><div id="caption"></div></div>
<script>
let files=[], filtered=[], current=-1, bulkActive=false, missingNames=[];
const q=document.getElementById('q'), bulk=document.getElementById('bulk'), grid=document.getElementById('grid');
const count=document.getElementById('count'), sort=document.getElementById('sort'), matchMode=document.getElementById('matchMode');
const modal=document.getElementById('modal'), big=document.getElementById('big'), caption=document.getElementById('caption');
const pathBox=document.getElementById('path'), savedPaths=document.getElementById('savedPaths'), status=document.getElementById('status');
const missingBox=document.getElementById('missing');

async function api(url, opts){
  const r=await fetch(url, opts);
  let data={};
  try{data=await r.json()}catch{}
  if(!r.ok) throw new Error(data.error||('HTTP '+r.status));
  return data;
}
async function loadState(){
  const s=await api('/api/state');
  pathBox.value=s.current;
  savedPaths.innerHTML='';
  for(const p of s.saved){
    const o=document.createElement('option');o.value=p;o.textContent=p;
    if(p===s.current)o.selected=true;
    savedPaths.append(o);
  }
}
async function loadFiles(){
  files=await api('/api/files');
  apply();
}
async function refreshAll(){
  await loadState();
  await loadFiles();
}
function bulkNames(){
  const seen=new Set(), out=[];
  for(const raw of bulk.value.split(/\r?\n/)){
    const n=raw.trim();
    if(!n)continue;
    const k=n.toLowerCase();
    if(!seen.has(k)){seen.add(k);out.push(n)}
  }
  return out;
}
function sortFiles(arr){
  const [key,dir]=sort.value.split('-');
  const sign=dir==='asc'?1:-1;
  return arr.sort((a,b)=>{
    if(key==='name') return a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'})*sign;
    return (a.mtime-b.mtime)*sign || a.name.localeCompare(b.name)*1;
  });
}
function searchTerms(){
  const raw=q.value.trim();
  if(!raw)return [];
  const seen=new Set(), out=[];
  for(const part of raw.split(/[\s,、]+/)){
    const t=part.trim().toLowerCase();
    if(!t||seen.has(t))continue;
    seen.add(t);out.push(t);
  }
  return out;
}
function matchesSearch(name, terms){
  if(!terms.length)return true;
  const n=name.toLowerCase();
  if(matchMode.value==='exact'){
    return terms.some(t=>n===t);
  }
  return terms.some(t=>n.includes(t));
}
function apply(){
  let arr=[...files];
  const terms=searchTerms();
  if(terms.length) arr=arr.filter(x=>matchesSearch(x.name,terms));

  missingNames=[];
  if(bulkActive){
    const wanted=bulkNames();
    const map=new Map(files.map(x=>[x.name.toLowerCase(),x]));
    const picked=[];
    for(const n of wanted){
      const hit=map.get(n.toLowerCase());
      if(hit) picked.push(hit); else missingNames.push(n);
    }
    arr=picked;
    if(terms.length) arr=arr.filter(x=>matchesSearch(x.name,terms));
  }

  filtered=sortFiles(arr);
  count.textContent=filtered.length+' / '+files.length+' 枚';
  if(missingNames.length){
    missingBox.style.display='block';
    missingBox.textContent='見つからないファイル: '+missingNames.join(', ');
  }else missingBox.style.display='none';

  grid.innerHTML='';
  const frag=document.createDocumentFragment();
  for(const [i,f] of filtered.entries()){
    const c=document.createElement('div'); c.className='card';
    const img=document.createElement('img'); img.loading='lazy'; img.src='/img/'+encodeURIComponent(f.name)+'?v='+encodeURIComponent(f.mtime);
    const n=document.createElement('div'); n.className='name'; n.textContent=f.name; n.title='クリックでファイル名をコピー';
    const m=document.createElement('div'); m.className='meta'; m.textContent=f.mtimeText;
    n.onclick=(e)=>{e.stopPropagation();navigator.clipboard?.writeText(f.name);const old=n.textContent;n.textContent='コピー: '+f.name;setTimeout(()=>n.textContent=old,700)};
    c.onclick=()=>openAt(i);
    c.append(img,n,m);frag.append(c);
  }
  grid.append(frag);
}
function openAt(i){
  if(!filtered.length)return;
  current=(i+filtered.length)%filtered.length;
  const f=filtered[current];
  big.src='/img/'+encodeURIComponent(f.name)+'?v='+encodeURIComponent(f.mtime);
  caption.textContent=f.name+' — '+f.mtimeText+'  ('+(current+1)+'/'+filtered.length+')';
  modal.classList.add('open');
}
async function setPath(path, save=false){
  status.textContent='切替中…';
  try{
    const s=await api('/api/path',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,save})});
    status.textContent='OK';
    await refreshAll();
  }catch(e){status.textContent='エラー: '+e.message}
}
savedPaths.onchange=()=>{pathBox.value=savedPaths.value;setPath(savedPaths.value,false)};
document.getElementById('switchPath').onclick=()=>setPath(pathBox.value,false);
document.getElementById('savePath').onclick=()=>setPath(pathBox.value,true);
document.getElementById('deletePath').onclick=async()=>{
  const p=savedPaths.value||pathBox.value;
  if(!p)return;
  if(!confirm('保存パスから削除しますか？\n'+p))return;
  try{
    await api('/api/path',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:p})});
    status.textContent='削除しました';
    await loadState();
  }catch(e){status.textContent='エラー: '+e.message}
};
document.getElementById('showBulk').onclick=()=>{bulkActive=true;apply()};
document.getElementById('clearBulk').onclick=()=>{bulkActive=false;bulk.value='';apply()};
q.addEventListener('input',apply);
matchMode.addEventListener('change',apply);
sort.addEventListener('change',apply);
document.getElementById('clear').onclick=()=>{q.value='';apply();q.focus()};
document.getElementById('size').oninput=e=>document.documentElement.style.setProperty('--thumb',e.target.value+'px');
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')modal.classList.remove('open');
  if(modal.classList.contains('open')&&e.key==='ArrowRight')openAt(current+1);
  if(modal.classList.contains('open')&&e.key==='ArrowLeft')openAt(current-1);
});
refreshAll().catch(e=>status.textContent='起動エラー: '+e.message);
</script>
</body>
</html>'''

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        return

    def send_json(self, obj, status=200):
        data=json.dumps(obj,ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Content-Length",str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def read_json(self):
        length=int(self.headers.get("Content-Length","0") or 0)
        raw=self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def do_GET(self):
        parsed=urllib.parse.urlparse(self.path)
        if parsed.path=="/":
            data=HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type","text/html; charset=utf-8")
            self.send_header("Content-Length",str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        if parsed.path=="/api/state":
            self.send_json({"current":SETTINGS["current"],"saved":SETTINGS["saved"]})
            return
        if parsed.path=="/api/files":
            root=current_root()
            if not root.exists() or not root.is_dir():
                self.send_json({"error":"フォルダが存在しません: "+str(root)},400)
                return
            self.send_json(list_images())
            return
        if parsed.path.startswith("/img/"):
            name=urllib.parse.unquote(parsed.path[len("/img/"):])
            root=current_root().resolve()
            target=(root/name).resolve()
            if target.parent!=root or not target.exists() or not target.is_file():
                self.send_error(404);return
            data=target.read_bytes()
            ctype=mimetypes.guess_type(str(target))[0] or "application/octet-stream"
            self.send_response(200)
            self.send_header("Content-Type",ctype)
            self.send_header("Cache-Control","no-cache")
            self.send_header("Content-Length",str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        self.send_error(404)

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path!="/api/path":
            self.send_error(404);return
        try:
            body=self.read_json()
            raw=str(body.get("path","")).strip().strip('"')
            if not raw:
                self.send_json({"error":"パスが空です"},400);return
            p=Path(raw).expanduser()
            if not p.exists() or not p.is_dir():
                self.send_json({"error":"フォルダが存在しません: "+raw},400);return
            normalized=norm_path(p)
            SETTINGS["current"]=normalized
            if body.get("save") and normalized not in SETTINGS["saved"]:
                SETTINGS["saved"].append(normalized)
            save_settings()
            self.send_json({"ok":True,"current":normalized,"saved":SETTINGS["saved"]})
        except Exception as e:
            self.send_json({"error":str(e)},400)

    def do_DELETE(self):
        if urllib.parse.urlparse(self.path).path!="/api/path":
            self.send_error(404);return
        try:
            body=self.read_json()
            target=str(body.get("path",""))
            SETTINGS["saved"]=[p for p in SETTINGS["saved"] if p!=target]
            if not SETTINGS["saved"]:
                SETTINGS["saved"]=[SETTINGS["current"]]
            save_settings()
            self.send_json({"ok":True,"saved":SETTINGS["saved"]})
        except Exception as e:
            self.send_json({"error":str(e)},400)

class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address=True

if __name__=="__main__":
    APP_DIR.mkdir(parents=True,exist_ok=True)
    save_settings()

    # 8765 が使用中・予約済み・セキュリティソフト等で拒否された場合は、
    # OS に空きポートを自動選択させる。
    try:
        httpd = Server(("127.0.0.1", PORT), Handler)
    except OSError as e:
        print(f"ポート {PORT} を使用できませんでした: {e}")
        print("空いているポートへ自動切替します。")
        httpd = Server(("127.0.0.1", 0), Handler)

    actual_port = httpd.server_address[1]
    url=f"http://127.0.0.1:{actual_port}/"
    print("Etymopedia Image Viewer")
    print("現在:", SETTINGS["current"])
    print(url)
    print("終了: このウィンドウで Ctrl+C")
    webbrowser.open(url)
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()
