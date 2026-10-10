import csv,json,os,re
from pathlib import Path
b=Path('D:/etymolingo/work/etymopedia');changes=json.loads((b/'tmp/resume-caption-fixes.json').read_text(encoding='utf-8'));n=0
for i in range(25,28):
 p=b/'codex'/f'prompt_rows_{i:03}.csv'
 with p.open(encoding='utf-8-sig',newline='') as f:
  rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
 for r in rows:
  if r['ファイル名'] in changes:
   en=changes[r['ファイル名']];assert len(en.split())<=18;assert re.search(r'(?<![\w-])'+re.escape(r['単語'])+r'(?![\w-])',en,re.I)
   r['解説英語']=en;r['検品メモ']+=' 見出し語そのものを含むよう英語解説の文法を補正。画像・語義は変更なし。';n+=1
 tmp=p.with_suffix('.resume.tmp')
 with tmp.open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
 os.replace(tmp,p)
print('Caption grammar corrections:',n)
