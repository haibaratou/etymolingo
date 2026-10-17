import csv,json,pathlib
with pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f:r=next(x for x in csv.DictReader(f) if x['ファイル名']=='cashier.png')
print(json.dumps({'word':r['単語'],'ja':r['語義'],'en':r['英語']},ensure_ascii=True))
