import csv,pathlib,json
from PIL import Image,ImageDraw
base=pathlib.Path(r'D:\etymolingo\work\etymopedia'); n=22; p=base/'codex'/f'prompt_rows_{n:03}.csv'; folder=base/'_illust'/f'prompt_rows_{n:03}'
with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
items=[]
for r in rows:
 if r.get('制作状態','') in ('','generated') and (folder/r['ファイル名']).exists():
  items.append({'file':r['ファイル名'],'target':r['対象語義'],'prompt':r['画像生成プロンプト']})
  if len(items)>=12: break
json.dump(items,open(base/'codex'/'_tmp_contact_items.json','w',encoding='utf-8'),ensure_ascii=False)
w,h=180,210; sheet=Image.new('RGB',(720,630),'white'); d=ImageDraw.Draw(sheet)
for i,r in enumerate(items):
 im=Image.open(folder/r['file']).convert('RGBA'); im.thumbnail((160,160),Image.Resampling.LANCZOS); tile=Image.new('RGBA',(160,160),'white'); tile.alpha_composite(im,((160-im.width)//2,(160-im.height)//2)); x=(i%4)*w+10; y=(i//4)*h+5; sheet.paste(tile.convert('RGB'),(x,y)); d.text((x,y+165),r['file'][:24],fill='black')
sheet.save(base/'codex'/'_tmp_contact22.jpg',quality=90)
print([r['file'] for r in items])
