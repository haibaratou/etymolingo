import pathlib,runpy,sys,json
OLD=pathlib.Path(r'D:\Projects\etymolingo\work\etymopedia\.workflow\weblio-low500-20261024')
sys.argv=['produce.py','audit'];n=runpy.run_path(str(OLD/'produce.py'));w=n['w'];C=n['C']
token=json.loads((OLD/'run.json').read_text())['state']['token'];w.end(C,token)
d=json.loads((OLD/'run.json').read_text());d.update(status='superseded_by_v3',saved=3);(OLD/'run.json').write_text(json.dumps(d,indent=2),encoding='utf-8')
H=OLD.with_name('weblio-low500-v3-20261024');H.mkdir(exist_ok=True)
code=(OLD/'produce.py').read_text(encoding='utf-8').replace('prompt_rows_weblio_missing_low500_20261024.csv','prompt_rows_weblio_missing_low500_redone_20261024_v3.csv')
code=code.replace("'画像生成プロンプト':j['prompt'],","")
(H/'produce.py').write_text(code,encoding='utf-8')
C=H.parent.parent/'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv';raw,fields,rs=w.read_csv(C);(H/'original.csv.bak').write_bytes(raw)
bad=[]
for r in rs:
 try:w.canonical(r)
 except Exception as e:bad.append([r['単語'],str(e)])
print(json.dumps({'total':len(rs),'canonical_mismatches':bad},ensure_ascii=False))
state=w.begin(C,'works',w.sha(raw))
oldrows=w.read_csv(n['C'])[2];lookup={r['ファイル名']:r for r in oldrows if r['制作状態']=='reviewed'}
with w.operation(C):
 op,oraw,st=w.owned(C,state['token'],'works')
 for r in rs:
  if r['ファイル名'] in lookup:
   prior=lookup[r['ファイル名']]
   for k in ['実行プロンプト','解説英語','解説日本語','制作状態','画像SHA256','画像GitBlobSHA','検品日時','検品メモ','語義SHA256']:r[k]=prior[k]
  if r['単語'] in {b[0] for b in bad}:r.update({'制作状態':'needs_revision','プロンプト準備状況':'要確認','要確認理由':'公開辞書の見出し語・順序付き語根・第一語義と一致しないため照合待ち。'})
 w.save_rows(C,fields,rs,raw,op,oraw,st)
(H/'run.json').write_text(json.dumps({'csv':str(C),'total':len(rs),'state':state,'held':bad,'status':'active'},ensure_ascii=False,indent=2),encoding='utf-8')
print('saved reused',len([r for r in rs if r['制作状態']=='reviewed']))
