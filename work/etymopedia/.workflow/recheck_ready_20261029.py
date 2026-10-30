import sys,pathlib,json,shutil
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_difficulty_low_missing_20261027.csv'
s=json.loads(w.state_path(c).read_bytes())
held=[]
with w.operation(c):
 op,raw,state=w.owned(c,s['token'],'works')
 old,fields,rows=w.read_csv(c)
 for r in rows:
  if r['制作状態']!='prompt_ready':continue
  try:w.canonical(r)
  except Exception as e:
   fn=r['ファイル名']
   if fn=='cay.png':
    original=p/'_illust'/fn
    dest=p/'.workflow/sense_hold_images_20261029'/fn
    if original.exists():
     dest.parent.mkdir(parents=True,exist_ok=True)
     if dest.exists():raise RuntimeError('Backup already exists')
     shutil.move(str(original),str(dest))
   r['制作状態']='needs_revision'
   r['検品メモ']='現行正本との語義照合不一致のため保留: '+str(e)+('。生成済み候補は .workflow/sense_hold_images_20261029/cay.png に保全。' if fn=='cay.png' else '')
   held.append(fn)
 w.save_rows(c,fields,rows,old,op,raw,state)
print(json.dumps(held,ensure_ascii=False))
