import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import pathlib,json
import workflow_io as w
rs=w.read_csv(w.DEFAULT_CSV)[2]
out={'validated':0,'relocated':0,'missing':[],'invalid':[]}
for r in rs:
 if r['制作状態']!='reviewed':continue
 p=pathlib.Path(r['画像保存先'])
 if not p.exists():
  candidates=[w.HERE/'_illust'/d/r['filename'] for d in ['261017','261019']]
  found=[q for q in candidates if q.exists()]
  if not found:out['missing'].append(r['filename']);continue
  r=r|{'画像保存先':str(found[0])};out['relocated']+=1
 try:w.entry_for(r);out['validated']+=1
 except Exception as e:out['invalid'].append([r['filename'],str(e)])
print(json.dumps(out,ensure_ascii=True))

