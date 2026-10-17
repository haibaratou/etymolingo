import csv,hashlib,json,sys,datetime
from pathlib import Path
from PIL import Image
sys.path.insert(0,r'D:\etymon-source\tools');import illustration_scenes as scenes
cfg=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')); n=cfg['batch']; filename=cfg['file']
base=Path(r'D:\etymolingo\work\etymopedia'); folder=base/'_illust'/f'prompt_rows_{n:03}'; tgt=folder/filename; assert not tgt.exists(),tgt
srcdir=Path(r'C:\Users\haiba\.codex\generated_images\01a10a9f-1490-7443-84a9-dfee6c30fde9'); src=max(srcdir.glob('exec-*.png'),key=lambda x:x.stat().st_mtime)
with Image.open(src) as im: im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS); assert im.getchannel('A').getextrema()==(0,255);im.save(tgt,'PNG')
p=base/'codex'/f'prompt_rows_{n:03}.csv'
with p.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
with Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: can=next(r for r in csv.DictReader(f) if r['ファイル名']==filename)
r=next(r for r in rows if r['ファイル名']==filename); roots=[x.strip() for x in can['語根'].split('+') if x.strip()]; ja=can['語義']; en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]
b=tgt.read_bytes();r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,ja,en),'実行プロンプト':cfg['prompt'],'解説英語':cfg['en'],'解説日本語':cfg['ja'],'制作状態':'reviewed','要確認理由':'','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':cfg['note']+' 実画像・英日解説・512×512 RGBAと実アルファを確認。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print(f'saved {filename}; image_source={src.name}')
