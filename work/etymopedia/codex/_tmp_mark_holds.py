import csv,json,pathlib,sys
sys.path.insert(0,r'D:\etymon-source\tools'); import illustration_scenes as scenes
base=pathlib.Path(r'D:\etymolingo\work\etymopedia'); srcp=pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv')
with srcp.open(encoding='utf-8-sig',newline='') as f: src={r['ファイル名']:r for r in csv.DictReader(f)}
items=[('021','footman.png','対象語義「従僕」と正本第一英語義「a traveler on foot : pedestrian」が一致しない。意味を確定するまで保留。'),('022','deep-seated.png','対象の「深い座り心地」と正本第一英語義「situated far below the surface」が一致しない。語義を確認するまで保留。')]
for batch,filename,reason in items:
 p=base/'codex'/f'prompt_rows_{batch}.csv'
 with p.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
 can=src[filename]; r=next(x for x in rows if x['ファイル名']==filename)
 roots=[x.strip() for x in can['語根'].split('+') if x.strip()]; en=scenes.first_senses({'ja':can['語義'],'en':can['英語']})[1]
 r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,can['語義'],en),'制作状態':'needs_revision','要確認理由':reason,'検品メモ':'正本の第一英語義と対象語義の意味不一致を確認。画像生成と解説追加は保留。'})
 with p.open('w',encoding='utf-8-sig',newline='') as f: w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
ledger=base/'prompt_review_pending.csv'
with ledger.open(encoding='utf-8-sig',newline='') as f: rd=csv.DictReader(f); lf=rd.fieldnames; lrows=list(rd)
for batch,filename,reason in items:
 if not any(x['ファイル名']==filename and x['発見バッチ']==f'prompt_rows_{batch}' for x in lrows):
  lrows.append({'ファイル名':filename,'単語':src[filename]['単語'],'問題':reason,'発見バッチ':f'prompt_rows_{batch}','状態':'要確認'})
with ledger.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=lf,extrasaction='ignore');w.writeheader();w.writerows(lrows)
print('recorded 2 semantic holds in CSV and shared ledger')
