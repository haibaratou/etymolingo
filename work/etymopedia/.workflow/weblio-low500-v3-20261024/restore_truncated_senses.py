import runpy,sys,json,collections
sys.argv=['produce.py','noop'];m=runpy.run_path('produce.py');w=m['w'];d=m['d'];C=m['C'];H=m['H'];idx=m['idx'];restored=[];held=[]
with w.operation(C):
 op,oraw,state=w.owned(C,m['owner'](),'works');raw,fields,rs=m['rows']();(H/('before-'+w.sha(raw)+'.csv.bak')).write_bytes(raw)
 for r in rs:
  if r['制作状態']!='needs_revision':continue
  v=w.view(r);ss=set(d.first_senses(x) for x in idx.get((v['word'],tuple(v['roots'])),[]));old=d.first_senses({'ja':v['ja'],'en':v['en']})
  if len(ss)==1:
   ja,en=next(iter(ss))
   if ja==old[0] and en and en.startswith(old[1]) and old[1]:
    r.update({'第一英語義':en,'語義SHA256':'','制作状態':'prompt_ready','プロンプト準備状況':'作成済み','要確認理由':''});w.canonical(r);restored.append({'word':v['word'],'before':old[1],'after':en});continue
  held.append(v['word'])
 w.save_rows(C,fields,rs,raw,op,oraw,state)
(H/'restored-truncated-senses.json').write_text(json.dumps(restored,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'restored':len(restored),'held':held},ensure_ascii=False))
