import sys,pathlib,json
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_difficulty_low_missing_20261027.csv'
data,fields,rows=w.read_csv(c)
w.check_rows(rows)
existing=[r['ファイル名'] for r in rows if (p/'_illust'/r['ファイル名']).is_file()]
conflicts=[]
for r in rows:
 if r['ファイル名'] in existing:continue
 try:w.canonical(r)
 except Exception as e:conflicts.append({'filename':r['ファイル名'],'reason':str(e)})
if not w.state_path(c).exists():w.begin(c,'works',w.sha(data))
out={'total':len(rows),'existing':existing,'conflicts':conflicts}
(p/'.workflow/difficulty_inventory_20261027.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'total':len(rows),'existing':len(existing),'conflicts':len(conflicts)},ensure_ascii=False))
