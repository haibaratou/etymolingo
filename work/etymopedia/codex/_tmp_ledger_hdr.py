import csv,pathlib,json
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\prompt_review_pending.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); print(json.dumps(rd.fieldnames,ensure_ascii=True)); rows=list(rd)
print('total',len(rows)); print('matches',sum(1 for x in rows if x.get('発見バッチ') in [f'prompt_rows_{n:03}' for n in range(20,28)]))
