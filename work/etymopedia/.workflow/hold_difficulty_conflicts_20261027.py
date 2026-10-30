import pathlib,sys,json
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_difficulty_low_missing_20261027.csv'
conf={v['filename']:v['reason'] for v in json.loads((p/'.workflow/difficulty_inventory_20261027.json').read_text(encoding='utf-8'))['conflicts']}
s=json.loads(w.state_path(c).read_bytes())
with w.operation(c):
 op,raw,state=w.owned(c,s['token'],'works')
 old,fields,rows=w.read_csv(c)
 for r in rows:
  if r['ファイル名'] in conf:
   r['制作状態']='needs_revision'
   r['検品メモ']='現行正本との語義照合不一致。未生成で保留: '+conf[r['ファイル名']]
 w.save_rows(c,fields,rows,old,op,raw,state)
print(len(conf))
