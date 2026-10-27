import csv, hashlib, json, pathlib, sys
from PIL import Image
p=pathlib.Path(__file__).resolve().parents[1]
c=p/'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv'
if len(sys.argv)>1:c=pathlib.Path(sys.argv[1]).resolve()
rows=list(csv.DictReader(c.open(encoding='utf-8-sig',newline='')))
issues=[]
for r in rows:
 if r['制作状態']!='reviewed':continue
 f=p/'_illust'/r['ファイル名']
 if not f.is_file():issues.append([f.name,'missing']);continue
 with Image.open(f) as im:
  if im.size!=(512,512) or im.mode!='RGBA' or im.getchannel('A').getextrema()!=(0,255):issues.append([f.name,'format/alpha'])
 if hashlib.sha256(f.read_bytes()).hexdigest()!=r['画像SHA256']:issues.append([f.name,'hash'])
 if not r['解説英語'].strip() or not r['解説日本語'].strip():issues.append([f.name,'caption'])
out={'reviewed':sum(r['制作状態']=='reviewed' for r in rows),'existing_kept':[r['ファイル名'] for r in rows if r['制作状態']=='prompt_ready' and (p/'_illust'/r['ファイル名']).is_file()],'missing_ready':[r['ファイル名'] for r in rows if r['制作状態']=='prompt_ready' and not (p/'_illust'/r['ファイル名']).is_file()],'held':sum(r['制作状態']=='needs_revision' for r in rows),'issues':issues}
(p/('.workflow/audit_next1000_20261027.json' if len(sys.argv)>1 else '.workflow/audit_low500_20261026.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(out,ensure_ascii=False))
if issues:sys.exit(1)
