import csv,json,pathlib
for n in range(20,28):
 p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex')/f'prompt_rows_{n:03}.csv'
 with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
 b=[r for r in rows if r.get('制作状態','') in ('','generated')]
 print('BATCH',n,'todo',len(b))
 if b: print(json.dumps({'file':b[0]['ファイル名'],'target':b[0]['対象語義'],'prompt':b[0]['画像生成プロンプト']},ensure_ascii=True))
