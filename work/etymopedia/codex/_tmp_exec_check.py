import csv,pathlib,json
base=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex');items=json.load(open(base/'_tmp_contact_items.json',encoding='utf-8'))
p=base/'prompt_rows_024.csv'
with p.open(encoding='utf-8-sig',newline='') as f: rows={r['ファイル名']:r for r in csv.DictReader(f)}
for it in items:print(it['file'],'status=',rows[it['file']]['制作状態'],'exec=',bool(rows[it['file']]['実行プロンプト']),'caption=',bool(rows[it['file']]['解説英語']))
