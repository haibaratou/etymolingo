import csv,hashlib,json,datetime,shutil
from pathlib import Path
from PIL import Image
import sys
sys.path.insert(0,r'D:\etymon-source\tools');import illustration_scenes as scenes
src=Path(r'C:\Users\haiba\.codex\generated_images\01a10a9f-1490-7443-84a9-dfee6c30fde9\exec-ca892d9d-0810-4e92-bb05-a60f0f017ce7.png')
base=Path(r'D:\etymolingo\work\etymopedia');tgt=base/'_illust'/'prompt_rows_022'/'liter.png';backup=base/'codex'/'_backup_liter_022.png';shutil.copy2(tgt,backup)
with Image.open(src) as im:im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS);assert im.getchannel('A').getextrema()==(0,255);im.save(tgt,'PNG')
p=base/'codex'/'prompt_rows_022.csv'
with p.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
with Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f:can=next(r for r in csv.DictReader(f) if r['ファイル名']=='liter.png')
r=next(r for r in rows if r['ファイル名']=='liter.png');roots=[x.strip() for x in can['語根'].split('+') if x.strip()];ja=can['語義'];en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]
prompt='Create a transparent-background 512x512 dictionary illustration for “liter,” a unit of volume equal to a cubic decimeter. Show a clear, unmarked cubic measuring vessel filled with blue water to its rim, with all three visible sides equal in width and height. An adult carefully pours the last stream of water from a small pitcher into the cube. Keep the vessel\'s cube shape unmistakable, with no scale marks or printed information. Match the attached invidious.png style only: friendly hand-drawn 2D cartoon, thick rounded dark-brown outlines, simplified rounded forms, warm restrained colors, subtle shading. The vessel must have no text, numerals, labels, symbols, or watermark. Fully transparent background, no checkerboard.'
b=tgt.read_bytes();r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,ja,en),'実行プロンプト':prompt,'解説英語':'A liter of water fills a clear cubic vessel as the final stream pours in.','解説日本語':'最後の水が注がれ、透明な立方容器が一リットルの水で満たされていく。','制作状態':'reviewed','要確認理由':'','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'旧画像に禁止された寸法文字があったため置換。修正版の実画像・英日解説・512×512 RGBAと実アルファを確認。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print('replaced and reviewed liter.png')
