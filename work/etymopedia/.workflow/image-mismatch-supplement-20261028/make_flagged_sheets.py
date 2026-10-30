import pathlib,json,csv,collections,hashlib,re
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';SOURCE=pathlib.Path(r'D:\Projects\etymon-source');OUT=HERE/'.workflow/image-mismatch-supplement-20261028'
def load(p):return json.loads(p.read_bytes())
def readcsv(p):return list(csv.DictReader(p.open(encoding='utf-8-sig',newline='')))
words=load(ROOT/'app/data/generated-etymon/words.json');t=(ROOT/'assets/word/illustration-index.js').read_text(encoding='utf-8');index=json.loads(t[t.index('{'):].rstrip().removesuffix(';'))
refs=collections.defaultdict(list);issues=load(ROOT/'app/data/generated-image-issues.json')
for i,r in enumerate(issues['issues']):refs[r['art']+'.png'].append({'source':'generated-image-issues.json','record':i+1,'data':r})
for i,r in enumerate(readcsv(HERE/'prompt_review_pending.csv')):refs[r['ファイル名']].append({'source':'prompt_review_pending.csv','record':i+1,'data':r})
t=(ROOT/'app/data/generated-etymon/illustration-review-status.js').read_text(encoding='utf-8')
for i,r in enumerate(json.loads(t[t.index('{'):].rstrip().removesuffix(';'))['entries']):refs[r['art']+'.png'].append({'source':'illustration-review-status.js','record':i+1,'data':r})
todo=readcsv(SOURCE/'tools/word-art-todo.csv');literal=collections.defaultdict(set)
for i,r in enumerate(todo):
 roots=r.get('語根','').split('+')if r.get('語根')else[];literal[(r['単語'],tuple(roots))].add(r['ファイル名'])
 if r.get('画像目視確認')=='実施済み'and re.search(r'mismatch|wrong|incorrect|absent|unrelated|not match|not support|unsupported|incompatible|not the|different sense|noun.+verb|verb.+noun',r.get('絵と語義の整合性','')+' '+r.get('具体的な改善案',''),re.I):refs[r['ファイル名']].append({'source':'word-art-todo.csv','record':i+1,'data':{k:r.get(k)for k in['単語','語根','語義','絵と語義の整合性','目視所見','品質判定根拠','具体的な改善案']}})
bound=collections.defaultdict(list)
for i,w in enumerate(words):
 key=json.dumps([w['w'],'+'.join(w.get('p',[]))]+([w['etymology_id']]if w.get('etymology_id')else[]),ensure_ascii=False,separators=(',',':'));stem=index.get(key)or w.get('pica');names=[stem+'.png']if stem else list(literal[(w['w'],tuple(w.get('p',[])))])if w.get('pic')else[]
 for name in names:
  if name in refs and(ROOT/'assets/word'/name).exists():bound[name].append({k:w.get(k)for k in['w','p','etymology_id','ja','en','pos']})
cases=[]
for name,ww in sorted(bound.items(),key=lambda x:(x[0]!='board.png',x[0].casefold())):
 p=ROOT/'assets/word'/name;b=p.read_bytes();cases.append({'case':len(cases)+1,'filename':name,'current_words':ww,'image_sha256':hashlib.sha256(b).hexdigest(),'image_git_blob_sha':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'references':refs[name]})
(OUT/'flagged-cases.json').write_text(json.dumps({'cases':cases,'register_filenames':len(refs),'unreferenced_or_no_current_image':[{'filename':n,'references':rr}for n,rr in refs.items()if n not in bound]},ensure_ascii=False,indent=2),encoding='utf-8')
font=ImageFont.truetype(r'C:\Windows\Fonts\meiryo.ttc',14);big=ImageFont.truetype(r'C:\Windows\Fonts\meiryo.ttc',18)
sheetdir=OUT/'contact';sheetdir.mkdir(exist_ok=True)
for offset in range(0,len(cases),32):
 chunk=cases[offset:offset+32];sheet=Image.new('RGB',(2048,1280),'#eceee8');draw=ImageDraw.Draw(sheet)
 for j,c in enumerate(chunk):
  x=j%8*256;y=j//8*320;pic=Image.open(ROOT/'assets/word'/c['filename']).convert('RGBA');pic.thumbnail((234,234));sheet.paste(pic,(x+(256-pic.width)//2,y+4),pic)
  w=c['current_words'][0];draw.text((x+4,y+241),str(c['case'])+' '+w['w'][:25],font=big,fill='#151515');ja=w['ja'].split('、')[0];draw.text((x+4,y+270),ja[:15],font=big,fill='#151515');roots='+'.join(w.get('p')or[])or'[]';draw.text((x+4,y+297),roots[:28],font=font,fill='#333333')
 path=sheetdir/f'flagged-{offset//32+1:02}.png';sheet.save(path)
print(json.dumps({'cases':len(cases),'sheets':(len(cases)+31)//32,'flagged_without_current_bound_image':len(refs)-len(bound)},ensure_ascii=False))
