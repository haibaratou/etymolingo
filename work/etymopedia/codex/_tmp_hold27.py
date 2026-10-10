import csv,json,pathlib,sys
sys.path.insert(0,r'D:\etymon-source\tools');import illustration_scenes as s
base=pathlib.Path(r'D:\etymolingo\work\etymopedia');fname='finesse.png';batch='027';reason='対象語義「策略」と正本第一英語義「refinement or delicacy of workmanship, structure, or texture」が不一致。語義確認まで生成を保留。'
with pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv').open(encoding='utf-8-sig',newline='') as f:can=next(x for x in csv.DictReader(f) if x['ファイル名']==fname)
p=base/'codex'/f'prompt_rows_{batch}.csv'
with p.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
r=next(x for x in rows if x['ファイル名']==fname);roots=[x.strip() for x in can['語根'].split('+') if x.strip()];en=s.first_senses({'ja':can['語義'],'en':can['英語']})[1]
r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':s.sense_digest(can['単語'],roots,can['語義'],en),'制作状態':'needs_revision','要確認理由':reason,'検品メモ':'対象語義と正本第一英語義が一致しないため、画像生成と解説を保留。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
l=base/'prompt_review_pending.csv'
with l.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);lf=rd.fieldnames;entries=list(rd)
if not any(x['ファイル名']==fname and x['発見バッチ']=='prompt_rows_027' for x in entries):entries.append({'ファイル名':fname,'単語':can['単語'],'問題':reason,'発見バッチ':'prompt_rows_027','状態':'要確認'})
with l.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=lf);w.writeheader();w.writerows(entries)
print('held finesse.png in CSV and shared ledger')
