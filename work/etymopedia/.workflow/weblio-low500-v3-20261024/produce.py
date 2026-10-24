import sys,json,pathlib,importlib.util,collections,datetime,hashlib
from PIL import Image
H=pathlib.Path(__file__).resolve().parent; C=H.parent.parent/'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv'; OUT=pathlib.Path(r'D:\Projects\etymolingo\work\etymopedia\_illust')
spec=importlib.util.spec_from_file_location('workflow_io',r'D:\Projects\etymolingo\work\etymopedia\workflow_io.py');w=importlib.util.module_from_spec(spec);spec.loader.exec_module(w)
d=w.definitions(); pub=pathlib.Path(r'D:\Projects\etymolingo\app\data\generated-etymon\words.json'); words=json.loads(pub.read_bytes()); idx={}
original_atomic=w.atomic
def atomic_with_locked_destination(path,data,expected):
 try:return original_atomic(path,data,expected)
 except PermissionError:
  if path!=C:raise
  assert path.read_bytes()==expected,'Concurrent edit before in-place save'
  (H/('pending-'+w.sha(data)+'.json')).write_text(json.dumps({'before':w.sha(expected),'after':w.sha(data),'reason':'Windows denies replacement; backed up and exclusively guarded in-place write'}),encoding='utf-8')
  import os
  with path.open('r+b') as f:
   assert f.read()==expected,'Concurrent edit on open'
   f.seek(0);f.write(data);f.truncate();f.flush();os.fsync(f.fileno())
  assert path.read_bytes()==data,'Read-back mismatch'
w.atomic=atomic_with_locked_destination
for x in words:idx.setdefault((x['w'],tuple(x.get('p',[]))),[]).append(x)
pub_hash=w.sha(pub.read_bytes())
w.current_words=lambda source=w.SOURCE:(idx,pub_hash)
def rows():return w.read_csv(C)
def owner():return json.loads(w.state_path(C).read_bytes())['token']
a=sys.argv[1]
if a=='next':
 raw,fields,rs=rows(); ready=[r for r in rs if r['プロンプト準備状況']=='作成済み' and (r['制作状態']=='prompt_ready' or (r['ファイル名']=='la.png' and r['制作状態']=='error'))]
 for r in ready:w.canonical(r)
 print(json.dumps({'reviewed':sum(r['制作状態']=='reviewed' for r in rs),'remaining':len(ready),'rows':ready[:4]},ensure_ascii=True))
elif a=='prepare':
 jobs=json.loads(pathlib.Path(sys.argv[2]).read_text(encoding='utf-8')); panels=[]
 for j in jobs:
  p=OUT/j['filename'];assert not p.exists(),str(p)
  im=Image.open(j['source']).convert('RGBA');im.thumbnail((512,512),Image.Resampling.LANCZOS);c=Image.new('RGBA',(512,512));c.alpha_composite(im,((512-im.width)//2,(512-im.height)//2));c.save(p);w.png_bytes(p)
  panel=Image.new('RGB',(1536,512))
  for i,col in enumerate(['white','#15243b','#ff9dbc']):
   bg=Image.new('RGBA',c.size,col);bg.alpha_composite(c);panel.paste(bg.convert('RGB'),(512*i,0))
  panels.append(panel)
 contact=Image.new('RGB',(1536,512*len(panels)))
 for i,p in enumerate(panels):contact.paste(p,(0,512*i))
 contact.save(pathlib.Path(sys.argv[2]).with_suffix('.review.png'));print('prepared',len(jobs))
elif a=='record':
 jobs=json.loads(pathlib.Path(sys.argv[2]).read_text(encoding='utf-8'))
 with w.operation(C):
  op,oraw,state=w.owned(C,owner(),'works');raw,fields,rs=rows();(H/('before-'+w.sha(raw)+'.csv.bak')).write_bytes(raw)
  for j in jobs:
   r=next(r for r in rs if r['ファイル名']==j['filename']);assert r['制作状態']in ('prompt_ready','error');w.canonical(r)
   p=OUT/j['filename'];b=w.png_bytes(p);assert d.english_word_count(j['en'])<=18 and d.includes_headword(j['en'],r['単語']);assert j['ja'] and j['prompt']
   r.update({'画像生成プロンプト':j['prompt'],'語義SHA256':w.canonical(r)[4],'解説英語':j['en'],'解説日本語':j['ja'],'実行プロンプト':j['prompt'],'制作状態':'reviewed','画像SHA256':w.sha(b),'画像GitBlobSHA':w.blob(b),'検品日時':w.now(),'検品メモ':'完成PNGを白・濃紺・ピンク背景で開き、語義・人体・輪郭・透過を確認。'+j.get('notes','')})
  w.save_rows(C,fields,rs,raw,op,oraw,state)
 run_path=H/'run.json';run=json.loads(run_path.read_bytes());run.update({'counts':dict(collections.Counter(r['制作状態'] for r in rs)),'held':[[r['単語'],r['要確認理由']]for r in rs if r['制作状態']=='needs_revision'],'state':json.loads(w.state_path(C).read_bytes()),'updated_at':w.now()});run_path.write_text(json.dumps(run,ensure_ascii=False,indent=2),encoding='utf-8')
 print('recorded',len(jobs))
elif a=='audit':
 raw,fields,rs=rows();result={'counts':dict(collections.Counter(r['制作状態'] for r in rs)),'invalid':[]}
 for r in rs:
  if r['制作状態']!='reviewed':continue
  try:
   b=w.png_bytes(OUT/r['ファイル名']);assert w.sha(b)==r['画像SHA256'] and w.blob(b)==r['画像GitBlobSHA'];w.canonical(r);assert d.english_word_count(r['解説英語'])<=18 and d.includes_headword(r['解説英語'],r['単語']);assert all(r[k] for k in ['解説日本語','実行プロンプト','検品日時','検品メモ'])
  except Exception as e:result['invalid'].append([r['ファイル名'],str(e)])
 print(json.dumps(result,ensure_ascii=True))


