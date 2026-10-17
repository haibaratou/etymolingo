import csv,hashlib,json,datetime,sys
from pathlib import Path
from PIL import Image
sys.path.insert(0,r'D:\etymon-source\tools'); import illustration_scenes as scenes
n=25; filename='cypress.png'; src=Path(r'C:\Users\haiba\.codex\generated_images\01a10a9f-1490-7443-84a9-dfee6c30fde9\exec-e5183363-5232-446f-9041-79187ab205b4.png')
base=Path(r'D:\etymolingo\work\etymopedia'); tgt=base/'_illust'/f'prompt_rows_{n:03}'/filename; p=base/'codex'/f'prompt_rows_{n:03}.csv'
assert src.exists() and not tgt.exists()
with Image.open(src) as im:
 im=im.convert('RGBA').resize((512,512),Image.Resampling.LANCZOS); assert im.getchannel('A').getextrema()==(0,255); im.save(tgt,'PNG')
with p.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: can=next(r for r in csv.DictReader(f) if r['ファイル名']==filename)
r=next(r for r in rows if r['ファイル名']==filename); roots=[x.strip() for x in can['語根'].split('+') if x.strip()]; ja=can['語義']; en=scenes.first_senses({'ja':ja,'en':can['英語']})[1]
prompt='Create a transparent-background 512x512 dictionary illustration of a cypress tree. Show one tall Mediterranean evergreen with a narrow, tightly tapered crown, dense dark-green scale-like branchlets, and a few small round woody cones among its lower branches. Include only a small patch of soil under the trunk. Keep the whole tree visible, simple and clearly recognizable, with no landscape backdrop. Match the attached invidious.png style only: friendly hand-drawn 2D cartoon, thick rounded dark-brown outlines, simplified rounded shapes, warm restrained colors, subtle shading. Fully transparent background, no checkerboard, text, labels, logo, or watermark.'
b=tgt.read_bytes(); r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,ja,en),'実行プロンプト':prompt,'解説英語':'A cypress rises in a narrow green crown, with woody cones among its branches.','解説日本語':'糸杉が細長い緑の樹冠を伸ばし、枝の間に木質の球果を付けている。','制作状態':'reviewed','要確認理由':'','画像SHA256':hashlib.sha256(b).hexdigest(),'画像GitBlobSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'検品メモ':'新規画像の実物・英日解説・512×512 RGBAと実アルファを確認。第一語義に一致。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
print('saved and reviewed cypress.png')
