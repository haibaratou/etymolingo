import csv,pathlib,json
for n in [20,21,22,23,24,25,27]:
 p=pathlib.Path(r'D:\etymolingo\work\etymopedia\codex')/f'prompt_rows_{n:03}.csv'
 with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
 for i,r in enumerate(rows):
  if r.get('制作状態','') in ('','generated'):
   print(json.dumps({'batch':n,'i':i,'filename':r.get('ファイル名'),'word':r.get('単語'),'sense':r.get('対象語義'),'gloss':r.get('第一英語義'),'prompt':r.get('画像生成プロンプト'),'exec':r.get('実行プロンプト')},ensure_ascii=True)); break
