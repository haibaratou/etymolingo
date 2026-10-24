import pathlib,importlib.util,json,csv
H=pathlib.Path(r'D:\Projects\etymolingo\work\etymopedia\.workflow\weblio-low500-20261024');H.mkdir(parents=True,exist_ok=True)
C=H.parent.parent/'prompt_rows_weblio_missing_low500_20261024.csv'
old=pathlib.Path(r'D:\Projects\etymolingo\work\word-art-learning-level-20261021\format-correction-v12\.workflow\produce.py').read_text(encoding='utf-8')
old=old.replace("H=pathlib.Path(__file__).resolve().parent; C=H.parent/'prompt_rows.csv';", "H=pathlib.Path(__file__).resolve().parent; C=H.parent.parent/'prompt_rows_weblio_missing_low500_20261024.csv';")
old=old.replace("r.update({'解説英語':j['en']", "r.update({'画像生成プロンプト':j['prompt'],'語義SHA256':w.canonical(r)[4],'解説英語':j['en']")
(H/'produce.py').write_text(old,encoding='utf-8')
spec=importlib.util.spec_from_file_location('w',r'D:\Projects\etymolingo\work\etymopedia\workflow_io.py');w=importlib.util.module_from_spec(spec);spec.loader.exec_module(w)
raw,fields,rs=w.read_csv(C);(H/'original.csv.bak').write_bytes(raw)
pub=json.loads(pathlib.Path(r'D:\Projects\etymolingo\app\data\generated-etymon\words.json').read_bytes());idx={}
for x in pub:idx.setdefault((x['w'],tuple(x.get('p',[]))),[]).append(x)
w.current_words=lambda source=w.SOURCE:(idx,'public')
bad=[]
for r in rs:
 try:w.canonical(r)
 except Exception as e:bad.append([r['単語'],str(e)])
print(json.dumps({'rows':len(rs),'bad':bad},ensure_ascii=False))
state=w.begin(C,'works',w.sha(raw))
with w.operation(C):
 op,oraw,st=w.owned(C,state['token'],'works')
 for r in rs:
  if r['単語'] in {x[0] for x in bad}:r.update({'制作状態':'needs_revision','プロンプト準備状況':'要確認','要確認理由':'現行公開辞書の見出し語・順序付き語根・第一語義と一致せず。原本を変更せず生成保留。'})
 w.save_rows(C,fields,rs,raw,op,oraw,st)
(H/'run.json').write_text(json.dumps({'state':state,'csv':str(C),'total':len(rs),'held':bad,'status':'active'},indent=2),encoding='utf-8')
print('Owner acquired')
