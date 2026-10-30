from PIL import Image
import pathlib,collections,json
OUT=pathlib.Path(__file__).parent;ROOT=pathlib.Path(r'D:\Projects\etymolingo\assets\word')
def regions(name,mode):
 im=Image.open(ROOT/name).convert('RGBA');pix=im.load();mask=set()
 for y in range(512):
  for x in range(512):
   r,g,b,a=pix[x,y]
   good=(r>240 and 170<g<245 and 60<b<185) if mode=='yellow' else (r>160 and g<100 and b<110) if mode=='red' else (r>220 and g>180 and 110<b<215 and r-g<55)
   if a>240 and good:mask.add((x,y))
 cs=[]
 while mask:
  start=mask.pop();q=[start];pts=[]
  while q:
   x,y=q.pop();pts.append((x,y))
   for v in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
    if v in mask:mask.remove(v);q.append(v)
  if len(pts)>12:cs.append({'area':len(pts),'x':round(sum(x for x,y in pts)/len(pts),1),'y':round(sum(y for x,y in pts)/len(pts),1)})
 return sorted(cs,key=lambda v:(v['y'],v['x']))
data={n:regions(n,m) for n,m in [('CD.png','yellow'),('forty.png','red'),('seventy.png','cream'),('LXX.png','cream')]}
(OUT/'count-components.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
for n,c in data.items():print(n,len(c),c[:15])
im=Image.open(ROOT/'LXX.png');im.crop((15,35,140,145)).resize((750,660)).save(OUT/'bundle-detail.png')
