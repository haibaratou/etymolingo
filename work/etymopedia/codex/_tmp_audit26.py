import csv,collections,pathlib,json
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_026.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
print(collections.Counter(r['制作状態'] for r in rows))
print('blank rows:')
for r in rows:
 if r['制作状態'] in ('','generated'): print(r['ファイル名'],r['単語'],r['対象語義'],r['第一英語義'])
print('caption gaps:',sum(1 for r in rows if r['制作状態']=='reviewed' and (not r['解説英語'] or not r['解説日本語'])))
