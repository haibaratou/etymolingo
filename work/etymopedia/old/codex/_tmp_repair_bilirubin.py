import csv,hashlib,json,sys,datetime,shutil
from pathlib import Path
from PIL import Image
sys.path.insert(0,r'D:\etymon-source\tools'); import illustration_scenes as scenes
src=Path(r'C:\Users\haiba\.codex\generated_images\01a10a9f-1490-7443-84a9-dfee6c30fde9\exec-ce1177d3-6272-457f-bb3f-2272879dbcd2.png')
tgt=Path(r'D:\etymolingo\work\etymopedia\_illust\prompt_rows_020\bilirubin.png')
backup=Path(r'D:\etymolingo\work\etymopedia\codex\_backup_bilirubin_020.png')
shutil.copy2(tgt,backup)
with Image.open(src) as im:
 im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS)
 assert im.getchannel('A').getextrema()==(0,255)
 im.save(tgt,'PNG')
p=Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_020.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: can=next(r for r in csv.DictReader(f) if r['ファイル名']=='bilirubin.png')
r=next(r for r in rows if r['ファイル名']=='bilirubin.png'); roots=[x.strip() for x in can['語根'].split('+') if x.strip()]; ja=can['語義']; en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]
prompt='Create a transparent-background 512x512 dictionary illustration for bilirubin, a bile pigment. Show a small clear laboratory vial containing a vivid golden-orange pigment beside a shallow glass dish with a few drops of the same color. A blue-gloved hand gently holds the vial. Use a simple educational medical illustration, no body parts or patient symptoms. Match the attached invidious.png style only: friendly hand-drawn 2D cartoon, thick rounded dark-brown outlines, simplified rounded forms, warm restrained colors, subtle shading. The vial and dish must have completely blank surfaces: absolutely no formula, text, letters, numbers, labels, symbols, or watermark. Fully transparent background with no checkerboard.'
b=tgt.read_bytes(); r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,ja,en),'実行プロンプト':prompt,'解説英語':'Bilirubin is shown as golden-orange pigment in a vial and glass dish.','解説日本語':'ビリルビンが、瓶とガラス皿の中の黄金色の色素として描かれている。','制作状態':'reviewed','要確認理由':'','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'既存画像の瓶に禁止された文字・化学式があったため修正生成。修正版の実画像、英日解説、512×512 RGBAと実アルファを確認。'})
with p.open('w',encoding='utf-8-sig',newline='') as f: w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print('replaced bilirubin.png; prior image backed up; sha='+r['画像SHA256'])
