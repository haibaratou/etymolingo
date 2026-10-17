import csv,pathlib,json
for batch,filename in [(20,'ascension.png'),(21,'footman.png'),(22,'deep-seated.png'),(23,'vanguard.png'),(24,'splint.png'),(25,'cypress.png'),(27,'deadlock.png')]:
 base=pathlib.Path(r'D:\etymolingo\work\etymopedia')
 with (base/'codex'/f'prompt_rows_{batch:03}.csv').open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
 r=next((x for x in rows if x['ファイル名']==filename),None)
 with (pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv')).open(encoding='utf-8-sig',newline='') as f: src=next(x for x in csv.DictReader(f) if x['ファイル名']==filename)
 print(batch,filename,'row=',r.get('制作状態'), 'png=',(base/'_illust'/f'prompt_rows_{batch:03}'/filename).exists(), 'canonical=',json.dumps({'w':src['単語'],'ja':src['語義'],'en':src['英語']},ensure_ascii=True))
