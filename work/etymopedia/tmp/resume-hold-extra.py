import csv,json,os
from pathlib import Path
b=Path('D:/etymolingo/work/etymopedia')
problems=json.loads((b/'tmp/resume-holds-extra.json').read_text(encoding='utf-8'))
p=b/'codex/prompt_rows_027.csv'; lp=b/'prompt_review_pending.csv'
def read(p):
 with p.open(encoding='utf-8-sig',newline='') as f:
  rd=csv.DictReader(f);return rd.fieldnames,list(rd)
fields,rows=read(p);lf,ledger=read(lp)
cs={r['ファイル名']:r for r in csv.DictReader(Path('D:/etymon-source/tools/word-art-todo.csv').open(encoding='utf-8-sig'))}
for r in rows:
 name=r['ファイル名']
 if name not in problems:continue
 assert not (b/'_illust/prompt_rows_027'/name).exists()
 r['制作状態']='needs_revision';r['要確認理由']=problems[name]+'。正本の語義整合確認待ち';r['検品メモ']='未生成・語義不一致のため保留'
 if not any(x['ファイル名']==name and x['状態']!='解決済み' for x in ledger):ledger.append({'ファイル名':name,'単語':cs[name]['単語'],'問題':r['要確認理由'],'発見バッチ':'prompt_rows_027画像生成引継ぎ時','状態':'未解決'})
for path,cols,data in [(p,fields,rows),(lp,lf,ledger)]:
 tmp=path.with_suffix('.resume.tmp')
 with tmp.open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(data)
 os.replace(tmp,path)
print('Registered',len(problems),'semantic holds')
