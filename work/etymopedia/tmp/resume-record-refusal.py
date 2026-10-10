import csv,json,os,datetime
from pathlib import Path
b=Path('D:/etymolingo/work/etymopedia')
def read(p):
 with p.open(encoding='utf-8-sig',newline='') as f:
  rd=csv.DictReader(f);return rd.fieldnames,list(rd)
p=b/'codex/prompt_rows_027.csv';lp=b/'prompt_review_pending.csv'
fields,rows=read(p);lf,ledger=read(lp)
r=next(x for x in rows if x['ファイル名']=='labia.png')
assert not (b/'_illust/prompt_rows_027/labia.png').exists()
reason='画像生成ツールの安全判定で入力拒否（moderation_blocked、request ID fd1063c7-0b7a-43d3-8554-418dbfb1c90b）'
r.update({'制作状態':'error','実行プロンプト':r['画像生成プロンプト'],'要確認理由':reason,'検品メモ':'PNG未生成。生成拒否を記録し、再試行なし。','検品日時':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds')})
if not any(x['ファイル名']=='labia.png' and x['状態']!='解決済み' for x in ledger):
 ledger.append({'ファイル名':'labia.png','単語':'labia','問題':reason,'発見バッチ':'prompt_rows_027画像生成引継ぎ時','状態':'未解決'})
for path,cols,data in [(p,fields,rows),(lp,lf,ledger)]:
 tmp=path.with_suffix('.resume.tmp')
 with tmp.open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(data)
 with tmp.open(encoding='utf-8-sig',newline='') as f:assert list(csv.DictReader(f))==data
 os.replace(tmp,path)
print('Recorded labia generation refusal')
