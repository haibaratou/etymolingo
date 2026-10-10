from PIL import Image,ImageDraw
from pathlib import Path
import json
b=Path('D:/etymolingo/work/etymopedia')
names=['beastly','camper','edgy','fanfare','inundation','locust','originator','strident','blue-eyed','disapprove','light-hearted','potable','alligator','latte','verdant','quaternary','meteor','oration','sag','lube','germinate','myopia','interpretable','scavenger','zygote','Pallas']
names += ['geophysical','hydro-','liberality','melodious','ardour','axiomatic','molybdenum','nebulous','buffering','circularity','couplet','flashback','glorification','gunman','hippie','inhumane','loudness','luminescent','melanin','accrual']
for start in range(0,len(names),6):
 chunk=names[start:start+6];out=Image.new('RGB',(768,len(chunk)*276),'white');draw=ImageDraw.Draw(out)
 for i,n in enumerate(chunk):
  im=Image.open(b/'_illust/prompt_rows_027'/f'{n}.png').convert('RGBA').resize((256,256),Image.Resampling.LANCZOS)
  for j,col in enumerate(['white','#19263a','#ec84b5']):
   bg=Image.new('RGBA',(256,256),col);bg.alpha_composite(im);out.paste(bg.convert('RGB'),(j*256,i*276+20))
  draw.text((5,i*276+3),n,fill='black')
 out.save(b/'tmp'/f'resume-extra-qa-{start//6}.png')
print(len(names),'background checks in', (len(names)+5)//6,'sheets')
