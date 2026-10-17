import csv,json,pathlib,sys
sys.path.insert(0,r'D:\etymon-source\tools'); import illustration_scenes as scenes
base=pathlib.Path(r'D:\etymolingo\work\etymopedia');srcp=pathlib.Path(r'D:\etymon-source\tools\word-art-todo.csv')
with srcp.open(encoding='utf-8-sig',newline='') as f: src={r['ファイル名']:r for r in csv.DictReader(f)}
items=[('Corinthian.png','正本第一英語義はコリントの住民を指すが、対象語義と画像はコリント式建築の柱頭を示しており不一致。'),('McFarland.png','正本の第一英語義が空欄で、固有名詞と既存画像の人物との対応を確認できない。')]
p=base/'codex'/'prompt_rows_023.csv'
with p.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=list(rd)
for name,reason in items:
 can=src[name];r=next(x for x in rows if x['ファイル名']==name);roots=[x.strip() for x in can['語根'].split('+') if x.strip()];en=scenes.first_senses({'ja':can['語義'],'en':can['英語']})[1]
 r.update({'単語':can['単語'],'語根ID_JSON':json.dumps(roots,ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':scenes.sense_digest(can['単語'],roots,can['語義'],en),'制作状態':'needs_revision','要確認理由':reason,'検品メモ':'正本の語義と画像の対応に不整合または不足があるため、解説追加を保留。'})
with p.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
ledger=base/'prompt_review_pending.csv'
with ledger.open(encoding='utf-8-sig',newline='') as f:rd=csv.DictReader(f);lf=rd.fieldnames;entries=list(rd)
for name,reason in items:
 if not any(x['ファイル名']==name and x['発見バッチ']=='prompt_rows_023' for x in entries): entries.append({'ファイル名':name,'単語':src[name]['単語'],'問題':reason,'発見バッチ':'prompt_rows_023','状態':'要確認'})
with ledger.open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=lf);w.writeheader();w.writerows(entries)
print('held Corinthian and McFarland in CSV and shared ledger')
