import csv,hashlib,json,datetime
from pathlib import Path
from PIL import Image
import sys
sys.path.insert(0,r'D:\etymon-source\tools'); import illustration_scenes as scenes
folder=Path(r'C:\Users\haiba\.codex\generated_images\01a10a9f-1490-7443-84a9-dfee6c30fde9'); src=max(folder.glob('exec-*.png'),key=lambda x:x.stat().st_mtime)
n=27; filename='deadlock.png'; base=Path(r'D:\etymolingo\work\etymopedia'); tgt=base/'_illust'/f'prompt_rows_{n:03}'/filename; p=base/'codex'/f'prompt_rows_{n:03}.csv'; assert not tgt.exists()
with Image.open(src) as im: im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS); assert im.getchannel('A').getextrema()==(0,255); im.save(tgt,'PNG')
with p.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: can=next(r for r in csv.DictReader(f) if r['ファイル名']==filename)
r=next(r for r in rows if r['ファイル名']==filename); roots=[x.strip() for x in can['語根'].split('+') if x.strip()]; ja=can['語義']; en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]
prompt='Create a transparent-background 512x512 dictionary illustration for “deadlock,” meaning an impasse. Show two adult delivery workers facing one another in a narrow corridor, each pushing a broad loaded handcart. The carts\' front corners meet and wedge tightly in the middle, so neither cart can pass and both workers have stopped with hands on the handles. Make the blockage immediately clear through the cart positions. Give both workers natural proportions, normally sized heads, short visible necks and shoulders. Match the attached invidious.png style only: friendly hand-drawn 2D cartoon, thick rounded dark-brown outlines, simplified rounded forms, warm restrained colors, subtle shading. Entire compact scene visible, fully transparent background, no checkerboard, text, logos, or watermark.'
b=tgt.read_bytes(); r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,ja,en),'実行プロンプト':prompt,'解説英語':'A deadlock stops both delivery workers as their loaded carts meet head-on.','解説日本語':'荷物を積んだ台車が正面でぶつかり、配達員二人が立ち往生している。','制作状態':'reviewed','要確認理由':'','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'実画像・英日解説・512×512 RGBAと実アルファを確認。第一語義「impasse」に一致。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print('saved deadlock.png from '+src.name)
