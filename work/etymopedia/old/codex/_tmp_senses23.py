import csv,json,pathlib,sys
sys.path.insert(0,r'D:\etymon-source\tools');import illustration_scenes as s
base=pathlib.Path(r'D:\etymolingo\work\etymopedia');items=json.load(open(base/'codex'/'_tmp_contact_items.json',encoding='utf-8'))
with pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f: src={r['ファイル名']:r for r in csv.DictReader(f)}
with (base/'codex'/'prompt_rows_023.csv').open(encoding='utf-8-sig',newline='') as f: rows={r['ファイル名']:r for r in csv.DictReader(f)}
for i in items:
 c=src.get(i['file']);r=rows[i['file']]
 print(json.dumps({'file':i['file'],'word':c['単語'] if c else None,'target':r['対象語義'],'first':s.first_senses({'ja':c['語義'],'en':c['英語']})[1] if c else None},ensure_ascii=True))
