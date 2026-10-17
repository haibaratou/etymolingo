import sys,json,pathlib
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]))
import workflow_io as w
from PIL import Image
SUFFIX='\nUse reference only for visual style. For human figures only: exactly two anatomically coherent naturally attached arms and two hands, normal arm lengths and connected shoulders/elbows/wrists. Do not add faces or limbs to nonhuman objects.'
action,filename,source,*args=sys.argv[1:]
row=next(r for r in w.read_csv(w.DEFAULT_CSV)[2] if r['filename']==filename)
p=w.HERE/'_illust'/filename
if action=='prepare':
 assert row['generation_eligible']=='True' and row['制作状態']=='prompt_ready'
 assert not p.exists(),str(p)
 with Image.open(source) as im:
  im=im.convert('RGBA');im.thumbnail((512,512),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',(512,512));canvas.alpha_composite(im,((512-im.width)//2,(512-im.height)//2));canvas.save(p)
 with Image.open(p) as im:
  print(im.size,im.mode,im.getchannel('A').getextrema())
  out=Image.new('RGB',(1536,512))
  for i,c in enumerate(['white','#15243b','#ff9dbc']):
   bg=Image.new('RGBA',im.size,c);bg.alpha_composite(im);out.paste(bg.convert('RGB'),(i*512,0))
  out.save(w.HERE/'tmp/session-review.png')
elif action=='record':
 en,ja,notes=args[:3];data=p.read_bytes();stamp=w.now()
 v={'実行プロンプト':row['prompt']+SUFFIX,'解説英語':en,'解説日本語':ja,'制作状態':'reviewed','画像SHA256':w.sha(data),'画像GitBlobSHA':w.blob(data),'検品日時':stamp,'検品メモ':notes+' 512x512 RGBA、alpha 0-255。','画像保存先':str(p),'検品方法':'完成PNGを開き、白・濃紺・ピンク背景で語義・腕と手のつながり・輪郭・透過・構図を目視確認','生成要求ID':pathlib.Path(source).stem,'生成結果ID':source,'生成保存日時':stamp}
 if len(args)>3:v['実行プロンプト']+='\nEDIT: '+pathlib.Path(args[3]).read_text(encoding='utf-8').strip()
 print(w.record(w.DEFAULT_CSV,json.loads(w.state_path(w.DEFAULT_CSV).read_text())['token'],row['identity'],v))
 rows=w.read_csv(w.DEFAULT_CSV)[2]
 candidates=[r for r in rows if r['generation_eligible']=='True' and r['制作状態']=='prompt_ready']
 print(json.dumps({'remaining':len(candidates),'next':[{k:r[k] for k in ['identity','word','ja','filename','prompt']} for r in candidates[:1]]},ensure_ascii=False))
