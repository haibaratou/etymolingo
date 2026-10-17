import csv,json,pathlib
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_020.csv')
with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
for r in rows:
 if r['制作状態'] in ('','generated'):
  print(json.dumps({'file':r['ファイル名'],'target':r['対象語義'],'candidate':r['画像生成プロンプト']},ensure_ascii=True));break
