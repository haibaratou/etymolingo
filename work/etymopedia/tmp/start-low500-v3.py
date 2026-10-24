import pathlib,runpy,sys,json
BASE=pathlib.Path(r'D:\Projects\etymolingo\work\etymopedia');OLD=BASE/'.workflow/weblio-low500-20261024';H=BASE/'.workflow/weblio-low500-v3-20261024';H.mkdir(exist_ok=True)
code=(OLD/'produce.py').read_text(encoding='utf-8').replace('prompt_rows_weblio_missing_low500_20261024.csv','prompt_rows_weblio_missing_low500_redone_20261024_v3.csv').replace("'画像生成プロンプト':j['prompt'],","")
(H/'produce.py').write_text(code,encoding='utf-8')
sys.argv=['produce.py','noop'];n=runpy.run_path(str(H/'produce.py'));w=n['w'];C=n['C'];raw,fields,rs=w.read_csv(C);(H/'original.csv.bak').write_bytes(raw)
bad=[]
for r in rs:
 try:w.canonical(r)
 except Exception as e:bad.append([r['単語'],str(e)])
print(json.dumps({'total':len(rs),'canonical_mismatches':bad},ensure_ascii=False))
state=w.begin(C,'works',w.sha(raw));jobs=json.loads((OLD/'batch-001.json').read_text(encoding='utf-8'));lookup={j['filename']:j for j in jobs}
with w.operation(C):
 op,oraw,st=w.owned(C,state['token'],'works')
 for r in rs:
  if r['ファイル名'] in lookup:
   j=lookup[r['ファイル名']];b=w.png_bytes(BASE/'_illust'/j['filename'])
   r.update({'実行プロンプト':j['prompt'],'解説英語':j['en'],'解説日本語':j['ja'],'制作状態':'reviewed','画像SHA256':w.sha(b),'画像GitBlobSHA':w.blob(b),'検品日時':w.now(),'検品メモ':'ユーザー承認によりv3切替前の画像をそのまま採用。白・濃紺・ピンク背景で確認。','語義SHA256':w.canonical(r)[4]})
  if r['単語'] in {b[0] for b in bad}:r.update({'制作状態':'needs_revision','プロンプト準備状況':'要確認','要確認理由':'公開辞書の見出し語・順序付き語根・第一語義と一致しないため照合待ち。'})
 w.save_rows(C,fields,rs,raw,op,oraw,st)
(H/'run.json').write_text(json.dumps({'csv':str(C),'total':len(rs),'state':state,'held':bad,'status':'active','retainedOutsideCsv':['fell.png']},ensure_ascii=False,indent=2),encoding='utf-8')
print('reused',sum(r['制作状態']=='reviewed' for r in rs))
