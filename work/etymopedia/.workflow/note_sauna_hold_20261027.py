import pathlib,sys,json,csv,io
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_1000_with_priority_fixes_20261026.csv'
note='現行正本との第一語義照合不一致。生成画像は .workflow/sense_hold_images_20261027/sauna.png に保全し未採用。語義再照合待ち。'
with w.operation(c):
 state=json.loads(w.state_path(c).read_bytes());op,raw,state=w.owned(c,state['token'],'works')
 old,fields,rows=w.read_csv(c)
 next(r for r in rows if r['ファイル名']=='sauna.png')['検品メモ']=note
 w.save_rows(c,fields,rows,old,op,raw,state)
ledger=p/'prompt_review_pending.csv'
with w.operation(ledger):
 old=ledger.read_bytes();reader=csv.DictReader(io.StringIO(old.decode('utf-8-sig')));fields=reader.fieldnames;rows=list(reader)
 for r in rows:
  if r['ファイル名']=='sauna.png' and r['発見バッチ']=='next1000_20261027':r['問題']=note
 out=io.StringIO(newline='');writer=csv.DictWriter(out,fieldnames=fields,lineterminator='\r\n');writer.writeheader();writer.writerows(rows)
 w.atomic(ledger,out.getvalue().encode('utf-8-sig'),old)
print('sauna preservation noted')
