import pathlib,json
from PIL import Image,ImageDraw,ImageFont
OUT=pathlib.Path(__file__).parent;ROOT=pathlib.Path(r'D:\Projects\etymolingo')
cases=json.loads((OUT/'prompt-selection.json').read_bytes())['selection'];dest=OUT/'selected-review';dest.mkdir(exist_ok=True);font=ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc',17)
for start in range(0,len(cases),8):
 canvas=Image.new('RGB',(2048,1180),'#eee');d=ImageDraw.Draw(canvas)
 for i,c in enumerate(cases[start:start+8]):
  x=i%4*512;y=i//4*590;im=Image.open(ROOT/'assets/word'/c['filename']).convert('RGBA');canvas.paste(im,(x,y),im);d.text((x+5,y+512),f"{c['case']} {c['filename']}\n{c['first_ja']}"[:100],font=font,fill='black')
 canvas.save(dest/f'selected-{start//8+1:02}.jpg',quality=94)
print('selected_sheets',(len(cases)+7)//8)
