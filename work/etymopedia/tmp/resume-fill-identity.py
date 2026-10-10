import csv,json,sys,os
from pathlib import Path
sys.path.insert(0,'D:/etymon-source/tools')
import illustration_scenes as s
b=Path('D:/etymolingo/work/etymopedia')
p=b/'codex/prompt_rows_027.csv'
with p.open(encoding='utf-8-sig',newline='') as f:
 rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
cs={r['ファイル名']:r for r in csv.DictReader(Path('D:/etymon-source/tools/word-art-todo.csv').open(encoding='utf-8-sig'))}
n=0
for r in rows:
 if r['単語'] or r['制作状態']!='reviewed':continue
 assert (b/'_illust/prompt_rows_027'/r['ファイル名']).exists()
 c=cs[r['ファイル名']];ja,en=s.first_senses({'ja':c['語義'],'en':c['英語']})
 assert r['対象語義']==ja,(r['ファイル名'],r['対象語義'],ja)
 roots=[x.strip() for x in c['語根'].split('+') if x.strip()]
 r.update({'単語':c['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':s.sense_digest(c['単語'],roots,c['語義'],en)})
 n+=1
tmp=p.with_suffix('.resume.tmp')
with tmp.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
os.replace(tmp,p)
print('Filled canonical identity fields:',n)
