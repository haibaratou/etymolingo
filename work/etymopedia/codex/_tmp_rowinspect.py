import csv,json,pathlib
for b,names in [(24,['splint.png']),(26,['bushel.png','Cree.png'])]:
 p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex')/f'prompt_rows_{b:03}.csv'
 with p.open(encoding='utf-8-sig',newline='') as f: rows={r['ファイル名']:r for r in csv.DictReader(f)}
 for name in names: print(json.dumps({'batch':b,'file':name,'row':rows.get(name)},ensure_ascii=True))
