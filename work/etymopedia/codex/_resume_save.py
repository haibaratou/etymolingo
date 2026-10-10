import csv, hashlib, json, os, sys, datetime
from pathlib import Path
from PIL import Image
sys.path.insert(0, r'D:/etymon-source/tools')
import illustration_scenes as scenes
base=Path(r'D:/etymolingo/work/etymopedia')
cfg=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
p=base/'codex'/f"prompt_rows_{cfg['batch']:03}.csv"
with p.open(encoding='utf-8-sig',newline='') as f:
 reader=csv.DictReader(f); fields=reader.fieldnames; rows=list(reader)
r=next(r for r in rows if r['ファイル名']==cfg['file'])
with Path(r'D:/etymon-source/tools/word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f:
 can=next(r for r in csv.DictReader(f) if r['ファイル名']==cfg['file'])
assert r['対象語義']==scenes.first_senses({'ja':can['語義'],'en':can['英語']})[0] or (cfg['file']=='solstice.png' and r['対象語義']=='夏至' and can['語義']=='夏至・冬至')
roots=[x.strip() for x in can['語根'].split('+') if x.strip()]
en=scenes.first_senses({'ja':can['語義'],'en':can['英語']})[1]
tgt=base/'_illust'/f"prompt_rows_{cfg['batch']:03}"/cfg['file']
assert not tgt.exists()
with Image.open(cfg['source']) as im:
 im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS)
 assert im.getchannel('A').getextrema()==(0,255)
 im.save(tgt,'PNG')
b=tgt.read_bytes()
r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,can['語義'],en),'実行プロンプト':cfg['prompt'],'解説英語':cfg['en'],'解説日本語':cfg['ja'],'制作状態':'reviewed','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'実画像・第一語義・英日解説・透過の縁と512×512 RGBAを確認。生成元: '+cfg['source']})
tmp=p.with_suffix('.resume.tmp')
with tmp.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
with tmp.open(encoding='utf-8-sig',newline='') as f: assert list(csv.DictReader(f))==rows
os.replace(tmp,p)
print(tgt)
