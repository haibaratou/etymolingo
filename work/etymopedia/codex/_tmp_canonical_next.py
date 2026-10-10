import csv,json,pathlib
names=['ascension.png','balm.png','bilirubin.png']
with pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: src={r['ファイル名']:r for r in csv.DictReader(f)}
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_020.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rows={r['ファイル名']:r for r in csv.DictReader(f)}
for n in names: print(n,json.dumps({'word':src[n]['単語'],'ja':src[n]['語義'],'en':src[n]['英語'],'target':rows[n]['対象語義']},ensure_ascii=True))
