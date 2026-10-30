import pathlib,json,collections
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(r'D:\Projects\etymolingo');OUT=ROOT/'work/etymopedia/.workflow/image-mismatch-supplement-20261028'
data=json.loads((OUT/'current-image-population.json').read_bytes());flags={c['filename']for c in json.loads((OUT/'flagged-cases.json').read_bytes())['cases']};pool=collections.defaultdict(list)
for r in data['records']:
 if not r['exact_reviewed_caption_records']and r['filename']not in flags:pool[r['filename']].append(r)
items=[{'scan':i+1,'filename':n,'rows':rr}for i,(n,rr)in enumerate(sorted(pool.items(),key=lambda x:x[0].casefold()))]
(OUT/'unreviewed-cases.json').write_text(json.dumps({'cases':items,'policy':'Current identity+first-JA+PNG-hash reviewed bilingual scene evidence may be reused; legacy master QA alone is not used to skip pixels. All current images without that evidence, excluding the separately inspected flagged set, appear here.'},ensure_ascii=False,indent=2),encoding='utf-8')
font=ImageFont.truetype(r'C:\Windows\Fonts\meiryo.ttc',14);big=ImageFont.truetype(r'C:\Windows\Fonts\meiryo.ttc',18);out=OUT/'unreviewed-contact';out.mkdir(exist_ok=True)
for offset in range(0,len(items),64):
 chunk=items[offset:offset+64];sheet=Image.new('RGB',(2048,2560),'#eceee8');draw=ImageDraw.Draw(sheet)
 for j,c in enumerate(chunk):
  x=j%8*256;y=j//8*320;pic=Image.open(ROOT/'assets/word'/c['filename']).convert('RGBA');pic.thumbnail((234,234));sheet.paste(pic,(x+(256-pic.width)//2,y+4),pic)
  w=c['rows'][0];draw.text((x+4,y+241),str(c['scan'])+' '+w['w'][:24],font=big,fill='#151515');draw.text((x+4,y+270),w['first_ja'][:15],font=big,fill='#151515');draw.text((x+4,y+297),('+'.join(w['p'])or'[]')[:28],font=font,fill='#333333')
 path=out/f'unreviewed-{offset//64+1:03}.jpg';sheet.save(path,quality=91,subsampling=0)
 if offset%512==0:print('saved_sheets',offset//64+1,'of',(len(items)+63)//64,flush=True)
print('complete_images',len(items),'sheets',(len(items)+63)//64,flush=True)
