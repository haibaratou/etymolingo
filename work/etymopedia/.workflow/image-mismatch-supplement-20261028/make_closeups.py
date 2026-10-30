import pathlib,json,math
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(r'D:\Projects\etymolingo');OUT=pathlib.Path(__file__).parent
flag=json.loads((OUT/'flagged-cases.json').read_bytes())['cases'];ind=json.loads((OUT/'unreviewed-cases.json').read_bytes())['cases']
pending_ind=[3,97,103,242,316,441,811,1306,1449,1524,1611,1933,2181,2225,2354,2536,2547,2613,2716,2743,2845,2995,3163,3460,3566,3815,3824,3834,3897,3961,4257,4276,4421,4991,5038,5172,5346,5366,5387,5700,6278,6387,6899,7676,7897,8004,8072,8137,8525,8943]
pending_flag=[117,142,169,176,187,207,290,311,348,472]
cases=[{'n':100000+x['scan'],'filename':x['filename'],'words':x['rows']} for x in ind if x['scan'] in pending_ind]+[{'n':x['case'],'filename':x['filename'],'words':x['current_words']} for x in flag if x['case'] in pending_flag]
(OUT/'closeup-cases.json').write_text(json.dumps(cases,ensure_ascii=False),encoding='utf-8')
dest=OUT/'closeups';dest.mkdir(exist_ok=True);font=ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc',16)
for start in range(0,len(cases),4):
 canvas=Image.new('RGB',(1024,1160),'#eee');draw=ImageDraw.Draw(canvas)
 for i,c in enumerate(cases[start:start+4]):
  x=(i%2)*512;y=(i//2)*580;im=Image.open(ROOT/'assets/word'/c['filename']).convert('RGBA');canvas.paste(im,(x,y),im)
  w=c['words'][0];draw.text((x+5,y+512),f"{c['n']} {c['filename']}\n{w.get('first_ja',w['ja'].split('、')[0])}"[:95],font=font,fill='black')
 canvas.save(dest/f'close-{start//4+1:02}.jpg',quality=94)
print('cases',len(cases),'sheets',math.ceil(len(cases)/4))
