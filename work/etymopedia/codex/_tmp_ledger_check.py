from pathlib import Path
p=Path(r'D:\etymolingo\work\etymopedia\prompt_review_pending.csv')
print('exists',p.exists())
if p.exists():
 print('bytes',p.stat().st_size)
 print(p.read_text(encoding='utf-8-sig')[:2500])
