import pathlib,sys,json,csv,io
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_1000_with_priority_fixes_20261026.csv'
conflicts=json.loads((p/'.workflow/next_sense_conflicts_20261027.json').read_text(encoding='utf-8'))
held=[]
with w.operation(c):
 state=json.loads(w.state_path(c).read_bytes())
 op,raw,state=w.owned(c,state['token'],'works')
 old,fields,rows=w.read_csv(c)
 for item in conflicts:
  r=next(r for r in rows if r['ファイル名']==item['filename'])
  if r['制作状態']!='prompt_ready':continue
  try:w.canonical(r)
  except ValueError:
   r['制作状態']='needs_revision'
   r['検品メモ']='現行正本との見出し語・順序付き語根・第一語義の照合不一致。画像未生成。語義再照合待ち。'
   held.append({'ファイル名':r['ファイル名'],'単語':r['単語'],'問題':r['検品メモ'],'発見バッチ':'next1000_20261027','状態':'要確認'})
 w.save_rows(c,fields,rows,old,op,raw,state)
held.append({'ファイル名':'viola.png','単語':'viola','問題':'現行正本との語義照合不一致。生成3回とも弦が3本のため未採用。4弦仕様への修正と語義再照合待ち。','発見バッチ':'next1000_20261027','状態':'要確認'})
ledger=p/'prompt_review_pending.csv'
with w.operation(ledger):
 old=ledger.read_bytes()
 text=old.decode('utf-8-sig')
 existing=list(csv.DictReader(io.StringIO(text)))
 identities={(r['ファイル名'],r['発見バッチ']) for r in existing}
 out=io.StringIO(newline='')
 out.write(text)
 if not text.endswith('\n'):out.write('\r\n')
 writer=csv.DictWriter(out,fieldnames=['ファイル名','単語','問題','発見バッチ','状態'],lineterminator='\r\n')
 for r in held:
  if (r['ファイル名'],r['発見バッチ']) not in identities:writer.writerow(r)
 w.atomic(ledger,out.getvalue().encode('utf-8-sig'),old)
print(json.dumps({'new_sense_holds':len(held)-1,'pending_ledger_recorded':len(held)},ensure_ascii=False))
