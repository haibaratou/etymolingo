import csv,hashlib,json,os,sys,datetime
from pathlib import Path
from PIL import Image
sys.path.insert(0,r'D:/etymon-source/tools')
import illustration_scenes as scenes
base=Path(r'D:/etymolingo/work/etymopedia')
cfg=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
n=cfg['batch']; path=base/'codex2'/f'prompt_rows_{n:03}.csv'
with path.open(encoding='utf-8-sig',newline='') as f:
 rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
r=next(x for x in rows if x['ファイル名']==cfg['file'])
assert r['制作状態'] in ('prompt_ready','generated','reviewed')
assert r['単語']==cfg['word'] and json.loads(r['語根ID_JSON'])==cfg['roots']
canonfile=Path(r'D:/etymon-source/tools/word-art-todo.csv')
with canonfile.open(encoding='utf-8-sig',newline='') as f: canonical=list(csv.DictReader(f))
hits=[]
for x in canonical:
 if x['単語'].casefold()!=cfg['word'].casefold(): continue
 roots=[v.strip() for v in x['語根'].split('+') if v.strip()]
 if roots==cfg['roots']:
  ja,en=scenes.first_senses({'ja':x['語義'],'en':x['英語']})
  if ja==r['対象語義'] and en==r['第一英語義']: hits.append((x,roots))
assert len(hits)==1,(cfg['file'],len(hits))
x,roots=hits[0]
assert scenes.sense_digest(cfg['word'],roots,x['語義'],r['第一英語義'])
dst=base/'_illust'/f'prompt_rows_{n:03}'/cfg['file']
assert not dst.exists() or cfg.get("overwrite", False)
with Image.open(cfg['source']) as im:
 im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS)
 assert im.getchannel('A').getextrema()==(0,255)
 im.save(dst,'PNG')
data=dst.read_bytes()
r.update({'語義SHA256':scenes.sense_digest(cfg['word'],roots,x['語義'],r['第一英語義']),
'実行プロンプト':cfg['prompt'],'解説英語':cfg['en'],'解説日本語':cfg['ja'],
'制作状態':'reviewed','画像SHA256':hashlib.sha256(data).hexdigest(),
'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(data)).encode()+b'\\0'+data).hexdigest(),
'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),
'検品メモ':'実画像・第一語義・英日解説・透過の縁と512×512 RGBAを確認。生成元: '+cfg['source']})
tmp=path.with_suffix('.resume.tmp')
with tmp.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
with tmp.open(encoding='utf-8-sig',newline='') as f:assert list(csv.DictReader(f))==rows
os.replace(tmp,path)
print(dst)

