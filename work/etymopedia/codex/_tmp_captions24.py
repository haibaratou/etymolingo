import csv,pathlib,json
base=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex');items=json.load(open(base/'_tmp_contact_items.json',encoding='utf-8'))
with (base/'prompt_rows_024.csv').open(encoding='utf-8-sig',newline='') as f: rows={r['ファイル名']:r for r in csv.DictReader(f)}
for it in items:
 r=rows[it['file']]; print(json.dumps({'file':it['file'],'en':r['解説英語'],'ja':r['解説日本語'],'prompt':r['実行プロンプト']},ensure_ascii=True))
