import csv,pathlib,json
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\prompt_review_pending.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
for n in ['footman.png','deep-seated.png']:
 print(n,[json.dumps(r,ensure_ascii=True) for r in rows if r['ファイル名']==n and r['発見バッチ'] in ('prompt_rows_021','prompt_rows_022')])
