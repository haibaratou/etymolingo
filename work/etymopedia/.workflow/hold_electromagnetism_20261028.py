import pathlib,sys,json
p=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(p))
import workflow_io as w
c=p/'prompt_rows_difficulty_low_missing_20261027.csv'
s=json.loads(w.state_path(c).read_bytes())
with w.operation(c):
 op,raw,state=w.owned(c,s['token'],'works')
 old,fields,rows=w.read_csv(c)
 for r in rows:
  if r['ファイル名']=='electromagnetism.png':
   r['制作状態']='needs_revision'
   r['検品メモ']='未生成で保留: 電池とコイルの教育図を2回試行したが画像生成側の出力安全判定(violence)で拒否。request IDs: 7e957b03-8085-4794-9ec3-39abc9e802d1, 6eae5140-220d-4f10-a54f-73b264e2c031。語義不一致ではない。'
 w.save_rows(c,fields,rows,old,op,raw,state)
print('electromagnetism held; no image saved')
