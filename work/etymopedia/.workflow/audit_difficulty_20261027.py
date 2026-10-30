import pathlib,csv,hashlib,json,re
from PIL import Image
p=pathlib.Path(__file__).resolve().parents[1]
c=p/'prompt_rows_difficulty_low_missing_20261027.csv'
rows=list(csv.DictReader(c.open(encoding='utf-8-sig',newline='')))
issues=[]
for r in rows:
 if r['制作状態']!='reviewed':continue
 f=p/'_illust'/r['ファイル名']
 if not f.is_file():issues.append([f.name,'missing']);continue
 with Image.open(f) as im:
  if im.size!=(512,512) or im.mode!='RGBA' or im.getchannel('A').getextrema()!=(0,255):issues.append([f.name,'format/alpha'])
 if hashlib.sha256(f.read_bytes()).hexdigest()!=r['画像SHA256']:issues.append([f.name,'hash'])
 if not r['解説日本語'].strip() or not r['解説英語'].strip():issues.append([f.name,'caption missing'])
 if len(r['解説英語'].split())>18:issues.append([f.name,'caption >18 words'])
out={'total':len(rows),'reviewed':sum(r['制作状態']=='reviewed' for r in rows),'held':sum(r['制作状態']=='needs_revision' for r in rows),'missing_ready':sum(r['制作状態']=='prompt_ready' and not (p/'_illust'/r['ファイル名']).is_file() for r in rows),'issues':issues}
(p/'.workflow/audit_difficulty_20261027.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(out,ensure_ascii=False))
if issues:raise SystemExit(1)
