"""Select image-missing identities; meanings come from the current runtime snapshot.

The approved work-list CSV is used for literal filenames only. Never read the
retired creation-date table or any private PIE JSON.
"""
import collections,csv,hashlib,json,pathlib,sys
ROOT=pathlib.Path(r'D:\Projects\etymolingo');SOURCE=pathlib.Path(r'D:\Projects\etymon-source');HERE=ROOT/'work/etymopedia';OUT=HERE/'.workflow/difficulty-prompts-20261027';OUT.mkdir(exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def identity(w,p):return (w,tuple(p))
def roots(r):
 value=r.get('語根ID_JSON')
 if value:return json.loads(value)
 return (r.get('roots')or r.get('語根')or'').split('+')if(r.get('roots')or r.get('語根'))else[]
words_path=ROOT/'app/data/generated-etymon/words.json';words=json.loads(words_path.read_bytes());counts=collections.Counter(identity(w['w'],w.get('p',[]))for w in words)
names=collections.defaultdict(set);todo=SOURCE/'tools/word-art-todo.csv'
with todo.open(encoding='utf-8-sig',newline='')as stream:
 for r in csv.DictReader(stream):names[identity(r['単語'],roots(r))].add(r['ファイル名'])
official={p.name.casefold()for p in(ROOT/'assets/word').glob('*.png')};staging={p.name.casefold()for p in(HERE/'_illust').rglob('*.png')}
text=(ROOT/'assets/word/illustration-index.js').read_text(encoding='utf-8');mapping=json.loads(text.removeprefix('globalThis.ETYMON_WORD_ART = ').strip().removesuffix(';'))
queued=set();queued_names=set();csv_sources=[]
paths=list(HERE.glob('prompt_rows_*.csv'))+[pathlib.Path(r'D:\Projects\dot-image-review\ready_union_scopes_20261015.csv')]+list((HERE/'old').rglob('prompt_rows_*.csv'))+list((HERE/'old').glob('generated_prompt_rows_*.csv'))
for path in paths:
 with path.open(encoding='utf-8-sig',newline='')as stream:
  reader=csv.DictReader(stream);fields=reader.fieldnames or[]
  if not {'prompt','画像生成プロンプト'}.intersection(fields):continue
  rows=list(reader);included=0
  for r in rows:
   fname=r.get('ファイル名')or r.get('filename');word=r.get('単語')or r.get('word')
   if fname:queued_names.add(fname.casefold());included+=1
   if word:
    try:queued.add(identity(word,roots(r)))
    except(ValueError,TypeError):pass
  csv_sources.append({'path':str(path),'sha256':sha(path),'records':len(rows),'excluded_filename_records':included})
excluded=collections.Counter();candidates=[];seen_names=set()
for number,w in enumerate(words):
 key=identity(w['w'],w.get('p',[]));first=w.get('ja','').split('、')[0].strip();literal=names.get(key,set())
 reason=None
 if counts[key]!=1 or w.get('etymology_id'):reason='ambiguous_or_explicit_origin_not_representable_in_formal_19_columns'
 elif not first:reason='missing_first_Japanese_meaning'
 elif len(literal)!=1:reason='literal_filename_missing_or_ambiguous_in_approved_work_list'
 else:
  filename=next(iter(literal));artkey=json.dumps([w['w'],'+'.join(w.get('p',[]))],ensure_ascii=False,separators=(',',':'));art=mapping.get(artkey);formal_names={filename.casefold()}
  if art:formal_names.add((art+'.png').casefold())
  if any(n in official for n in formal_names):reason='official_PNG_exists'
  elif any(n in staging for n in formal_names):reason='generated_staging_PNG_exists'
  elif key in queued or filename.casefold()in queued_names:reason='existing_generation_CSV_record'
  elif filename.casefold()in seen_names:reason='Windows_filename_collision'
  elif pathlib.PureWindowsPath(filename).name!=filename or not filename.endswith('.png'):reason='unsafe_literal_filename'
  else:
   seen_names.add(filename.casefold());candidates.append({'source_record':number,'filename':filename,'w':w['w'],'p':w.get('p',[]),'ja':w.get('ja',''),'first_ja':first,'en':w.get('en',''),'pos':w.get('pos',''),'r':w.get('r')})
 if reason:excluded[reason]+=1
result={'schema':1,'words_source':{'path':str(words_path),'sha256':sha(words_path),'records':len(words)},'filename_source':{'path':str(todo),'sha256':sha(todo),'use':'literal filenames only; no old meanings or rarity used'},'formal_PNG_filenames':len(official),'generated_PNG_filenames':len(staging),'existing_generation_csvs':csv_sources,'exclusions':dict(excluded),'candidates':candidates}
(OUT/'image-missing-candidates.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in result.items()if k not in ('candidates','existing_generation_csvs')},ensure_ascii=False,indent=2));print('candidates_before_difficulty',len(candidates),'generation_CSVs',len(csv_sources))
