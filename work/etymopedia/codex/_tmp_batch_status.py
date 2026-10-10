import csv,collections,pathlib,json
base=pathlib.Path(r'D:\etymolingo\work\etymopedia')
for n in range(20,28):
 p=base/'codex'/f'prompt_rows_{n:03}.csv'; folder=base/'_illust'/f'prompt_rows_{n:03}'
 with p.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
 cnt=collections.Counter(r.get('制作状態','') for r in rows)
 blank=[r for r in rows if r.get('制作状態','') in ('','generated')]
 gaps=[r for r in rows if r.get('制作状態')=='reviewed' and (not r.get('解説英語','').strip() or not r.get('解説日本語','').strip())]
 print(n,'rows',len(rows),'counts',dict(cnt),'pngs',len(list(folder.glob('*.png'))) if folder.exists() else 0,'blank',len(blank),'caption_gaps',len(gaps))
 for r in blank[:6]: print(' ',r.get('ファイル名'),r.get('単語'),r.get('対象語義'),r.get('第一英語義'), 'promptstat='+str(r.get('プロンプト準備状況')))
