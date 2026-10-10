import csv,json
from pathlib import Path
from collections import Counter
b=Path('D:/etymolingo/work/etymopedia')
for i in range(25,28):
 rs=list(csv.DictReader((b/f'codex/prompt_rows_{i:03}.csv').open(encoding='utf-8-sig')))
 print(json.dumps({'batch':i,'states':dict(Counter(r['制作状態'] for r in rs)),'unstarted_missing':[r['ファイル名'] for r in rs if not (b/f'_illust/prompt_rows_{i:03}'/r['ファイル名']).exists() and not r['制作状態']]},ensure_ascii=False))
