import csv,json,hashlib,pathlib,collections,concurrent.futures,datetime,re,sys
ROOT=pathlib.Path(r'D:\Projects\etymolingo');SOURCE=pathlib.Path(r'D:\Projects\etymon-source');HERE=ROOT/'work/etymopedia';OUT=HERE/'.workflow/image-mismatch-supplement-20261028'
def sha(b):return hashlib.sha256(b).hexdigest()
def load(p):return json.loads(p.read_bytes())
def key(w,p,origin=''):return json.dumps([w,p,origin],ensure_ascii=False,separators=(',',':'))
def readcsv(p):return list(csv.DictReader(p.open(encoding='utf-8-sig',newline='')))
sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses
wp=ROOT/'app/data/generated-etymon/words.json';raw=wp.read_bytes();words=json.loads(raw)
todo=readcsv(SOURCE/'tools/word-art-todo.csv');literals=collections.defaultdict(set);todo_byname=collections.defaultdict(list)
for r in todo:
 roots=json.loads(r['語根ID_JSON'])if r.get('語根ID_JSON')else r.get('語根','').split('+')if r.get('語根')else[]
 literals[key(r['単語'],roots)].add(r['ファイル名']);todo_byname[r['ファイル名']].append(r)
paths=list((ROOT/'assets/word').glob('*.png'))
def fingerprint(p):
 b=p.read_bytes();return p.name,{'sha256':sha(b),'git_blob_sha':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),'bytes':len(b)}
cache=OUT/'current-image-population.json'
if cache.exists():images=load(cache)['all_PNG_fingerprints']
else:
 with concurrent.futures.ThreadPoolExecutor(max_workers=8)as pool:images=dict(pool.map(fingerprint,paths))
indextext=(ROOT/'assets/word/illustration-index.js').read_text(encoding='utf-8');artindex=json.loads(indextext[indextext.index('{'):].rstrip().removesuffix(';'))
scenes=load(ROOT/'app/data/generated-etymon/illustration-scenes.json')['entries'];scene_bykey=collections.defaultdict(list)
for e in scenes:scene_bykey[key(e['w'],e.get('p',[]),e.get('etymology_id',''))].append(e)
issues=load(ROOT/'app/data/generated-image-issues.json');audit=readcsv(SOURCE/'tools/dictionary-audit-20261027/image-quality-audit.csv')
warnings_text=(ROOT/'app/data/generated-etymon/illustration-review-status.js').read_text(encoding='utf-8');warnings=json.loads(warnings_text[warnings_text.index('{'):].rstrip().removesuffix(';'))['entries']
pending=readcsv(HERE/'prompt_review_pending.csv');flag_names={x.get('art','')+'.png'for x in issues['issues']+warnings}|{x['ファイル名']for x in pending}
records=[];unbound=[]
for i,w in enumerate(words):
 k=key(w['w'],w.get('p',[]),w.get('etymology_id',''));ak=json.dumps([w['w'],'+'.join(w.get('p',[]))]+([w['etymology_id']]if w.get('etymology_id')else[]),ensure_ascii=False,separators=(',',':'))
 stem=artindex.get(ak)or w.get('pica');filename=stem+'.png'if stem else'';runtime_referenced=bool(filename)
 if not filename:
  candidates=[n for n in literals.get(k,set())if n in images]
  if len(candidates)==1:filename=candidates[0];runtime_referenced=bool(w.get('pic'))
  elif w.get('pic'):unbound.append({'source_record':i,'w':w['w'],'p':w.get('p',[]),'reason':'pic true without exact resolved file','literal_candidates':sorted(literals.get(k,set()))})
 if filename not in images:continue
 ja,en=first_senses(w);image=images[filename]
 approved=[e for e in scene_bykey[k]if e.get('art','')+'.png'==filename and e.get('image',{}).get('sha256')==image['sha256'] and first_senses({'ja':e.get('sense',{}).get('ja','')})[0]==ja and(e.get('review',{}).get('status')=='reviewed'or e.get('status')=='reviewed')]
 prior=[]
 for old in todo_byname[filename]:
  if old['単語']!=w['w']:continue
  m=re.search(r'asset SHA ([0-9a-f]{40})',old.get('品質判定根拠',''))
  if m and m[1]==image['git_blob_sha']and first_senses({'ja':old['語義']})[0]==ja and old.get('画像目視確認')=='実施済み':prior.append({'observation':old.get('目視所見'),'assessment':old.get('絵と語義の整合性'),'priority':old.get('品質確認優先度')})
 records.append({'key':k,'source_record':i,'w':w['w'],'p':w.get('p',[]),'etymology_id':w.get('etymology_id',''),'ja':w['ja'],'first_ja':ja,'en_snapshot':en,'pos':w.get('pos',''),'filename':filename,'runtime_referenced':runtime_referenced,'literal_names':sorted(literals.get(key(w['w'],w.get('p',[])),set())),'image':image,'exact_reviewed_caption_records':len(approved),'caption_samples':[e.get('scene',{})for e in approved[:1]],'exact_historical_pixel_reviews':prior,'flagged_by_any_register':filename in flag_names})
represented={r['filename']for r in records};counts={'current_words':len(words),'formal_PNG_files':len(images),'current_imaged_word_IDs':len(records),'current_referenced_PNGs':len(represented),'runtime_referenced_word_rows':sum(r['runtime_referenced']for r in records),'literal_worklist_owned_but_not_runtime_referenced_rows':sum(not r['runtime_referenced']for r in records),'unreferenced_PNGs':len(set(images)-represented),'unresolved_runtime_bindings':len(unbound),'exact_reviewed_caption_rows':sum(bool(r['exact_reviewed_caption_records'])for r in records),'exact_historical_pixel_review_rows':sum(bool(r['exact_historical_pixel_reviews'])for r in records),'no_reusable_visual_evidence_rows':sum(not(r['exact_reviewed_caption_records']or r['exact_historical_pixel_reviews'])for r in records),'register_flagged_current_rows':sum(r['flagged_by_any_register']for r in records),'audit_rows':len(audit),'issue_rows':len(issues['issues']),'runtime_warning_rows':len(warnings),'pending_rows':len(pending)}
data={'captured_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'words_path':str(wp),'words_sha256':sha(raw),'counts':counts,'records':records,'unresolved_bindings':unbound,'all_PNG_fingerprints':images,'unreferenced_PNGs':sorted(set(images)-represented),'read_only_sources':[str(SOURCE/'tools/word-art-todo.csv'),str(ROOT/'app/data/generated-image-issues.json'),str(ROOT/'app/data/generated-etymon/illustration-scenes.json'),str(HERE/'prompt_review_pending.csv')]}
(OUT/'current-image-population.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(counts,ensure_ascii=False,indent=2))
