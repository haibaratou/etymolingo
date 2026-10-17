import csv,pathlib
p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex\prompt_rows_027.csv')
with p.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
r=next(x for x in rows if x['ファイル名']=='ling.png');r['解説日本語']='タラの仲間の魚が、岩場の海底近くを泳いでいる。'
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
print('revised ling Japanese caption')
