import csv,hashlib,json,sys,datetime
from pathlib import Path
sys.path.insert(0,r'D:\etymon-source\tools')
import illustration_scenes as scenes
cfg=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
csvp=Path(r'D:\etymolingo\work\etymopedia\codex')/f"prompt_rows_{cfg['batch']:03}.csv"
outdir=Path(r'D:\etymolingo\work\etymopedia\_illust')/f"prompt_rows_{cfg['batch']:03}"
srcp=Path(r'D:\etymon-source\tools\word-art-todo.csv')
with csvp.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with srcp.open(encoding='utf-8-sig',newline='') as f: source={r['ファイル名']:r for r in csv.DictReader(f)}
for c in cfg['items']:
 p=outdir/c['file']; assert p.exists()
 row=next(r for r in rows if r['ファイル名']==c['file']); can=source[c['file']]
 raw=p.read_bytes(); import PIL.Image as PI
 with PI.open(p) as im: assert im.size==(512,512) and im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255)
 word=can['単語']; ja=can['語義']; en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]; roots=[x.strip() for x in can['語根'].split('+') if x.strip()]
 row.update({'単語':word,'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(word,roots,ja,en),'実行プロンプト':'','解説英語':c['en'],'解説日本語':c['ja'],'制作状態':'reviewed','画像SHA256':hashlib.sha256(raw).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'既存PNGを実画像で確認し日英解説を追加。過去の実行プロンプト記録がないため空欄（推測で補わない）。'+c['note']})
with csvp.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print('reviewed',', '.join(c['file'] for c in cfg['items']))
