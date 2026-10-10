import csv,hashlib,json,sys,datetime
from pathlib import Path
from PIL import Image
sys.path.insert(0,r'D:\etymon-source\tools')
import illustration_scenes as scenes
cfg=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
csvp=Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_026.csv'); outdir=Path(r'D:\etymolingo\work\etymopedia\_illust\prompt_rows_026')
srcp=Path(r'D:\etymon-source\tools\word-art-todo.csv')
with csvp.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with srcp.open(encoding='utf-8-sig',newline='') as f: source={r['ファイル名']:r for r in csv.DictReader(f)}
for c in cfg:
 target=outdir/c['file']; original=Path(c['image']); assert original.exists() and not target.exists(),(original,target)
 with Image.open(original) as im:
  im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS)
  assert im.getchannel('A').getextrema()==(0,255),im.getchannel('A').getextrema()
  im.save(target,'PNG')
 row=next(r for r in rows if r['ファイル名']==c['file']); canon=source[c['file']]
 word=canon['単語']; ja_sense=canon['語義']; en_sense=scenes.first_senses({'ja':ja_sense,'en':canon['英語']})[1]
 roots=[x.strip() for x in canon['語根'].split('+') if x.strip()]
 content=target.read_bytes(); sha=hashlib.sha256(content).hexdigest(); blob=hashlib.sha1(b'blob '+str(len(content)).encode()+b'\0'+content).hexdigest()
 row.update({'単語':word,'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en_sense,'語義SHA256':scenes.sense_digest(word,roots,ja_sense,en_sense),'実行プロンプト':c['prompt'],'解説英語':c['en'],'解説日本語':c['ja'],'制作状態':'reviewed','画像SHA256':sha,'画像GitBlobSHA':blob,'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':c['note']})
with csvp.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(rows)
print('saved '+', '.join(c['file'] for c in cfg))
