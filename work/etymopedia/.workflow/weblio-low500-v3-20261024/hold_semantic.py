import runpy,sys,json
args=sys.argv[1:];sys.argv=['produce.py','noop'];m=runpy.run_path('produce.py');w=m['w'];C=m['C'];H=m['H']
with w.operation(C):
 op,oraw,state=w.owned(C,m['owner'](),'works');raw,fields,rs=m['rows']();(H/('before-'+w.sha(raw)+'.csv.bak')).write_bytes(raw)
 for word,reason in zip(args[::2],args[1::2]):
  r=next(r for r in rs if r['単語']==word);assert r['制作状態']=='prompt_ready';r.update({'制作状態':'needs_revision','プロンプト準備状況':'要確認','要確認理由':reason})
 w.save_rows(C,fields,rs,raw,op,oraw,state)
print('held',','.join(args[::2]))
