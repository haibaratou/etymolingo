import csv,collections,pathlib
base=pathlib.Path(r'D:\etymolingo\work\etymopedia')
for n in range(20,28):
 with (base/'codex'/f'prompt_rows_{n:03}.csv').open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
 print(f'{n:03}',dict(collections.Counter(r.get('制作状態','') for r in rows)),'caption gaps',sum(r.get('制作状態')=='reviewed' and (not r.get('解説英語','').strip() or not r.get('解説日本語','').strip()) for r in rows))
