import csv,json,pathlib,sys
sys.path.insert(0,r'D:\etymon-source\tools');import illustration_scenes as s
p=pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv')
with p.open(encoding='utf-8-sig',newline='') as f:c=next(x for x in csv.DictReader(f) if x['ファイル名']=='desist.png')
with pathlib.Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_027.csv').open(encoding='utf-8-sig',newline='') as f:r=next(x for x in csv.DictReader(f) if x['ファイル名']=='desist.png')
print(json.dumps({'word':c['単語'],'ja':c['語義'],'en':s.first_senses({'ja':c['語義'],'en':c['英語']})[1],'roots':c['語根'],'target':r['対象語義']},ensure_ascii=True))
