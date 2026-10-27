import pathlib,sys,json
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_1000_with_priority_fixes_20261026.csv'
_,_,rows=w.read_csv(c)
bad=[]
for r in rows:
 if r['制作状態']!='prompt_ready':continue
 try:w.canonical(r)
 except ValueError as e:bad.append({'filename':r['ファイル名'],'reason':str(e)})
(p/'.workflow/next_sense_conflicts_20261027.json').write_text(json.dumps(bad,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'conflicts':len(bad),'items':bad},ensure_ascii=False))
