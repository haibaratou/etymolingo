import pathlib,json,sys
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/"prompt_rows_1000_with_priority_fixes_20261026.csv"
_,_,rows=w.read_csv(c)
r=next(r for r in rows if r["ファイル名"]=="viola.png")
s=json.loads(w.state_path(c).read_bytes())
v=json.loads((p/".workflow/viola_hold_values_20261027.json").read_text(encoding="utf-8"))
try:
 print(json.dumps(w.record(c,s["token"],w.key(r),v),ensure_ascii=False))
except ValueError as e:
 if 'canonical first sense' not in str(e):raise
 with w.operation(c):
  op,raw,state=w.owned(c,s['token'],'works')
  old,fields,rows=w.read_csv(c)
  r=next(r for r in rows if r['ファイル名']=='viola.png')
  v['検品メモ']+=' 現行正本との第一語義照合も不一致のため再照合待ち。'
  r.update(v)
  new_fields=fields+[k for k in v if k not in fields]
  w.save_rows(c,new_fields,rows,old,op,raw,state)
 print(json.dumps({'filename':'viola.png','state':'needs_revision','reason':'strings and canonical sense conflict'},ensure_ascii=False))
