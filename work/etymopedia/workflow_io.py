"""Single-CSV handoff, production recording and guarded reviewed-pair import.

No operation reads the retired date table. CLI defaults to read-only inspection.
Writes require an explicitly acquired owner token and a current input hash.
"""
from __future__ import annotations
import argparse,contextlib,copy,csv,datetime,hashlib,importlib.util,io,json,os,pathlib,re,sys,uuid
from PIL import Image

HERE=pathlib.Path(__file__).resolve().parent
DEFAULT_CSV=pathlib.Path(r'D:\Projects\dot-image-review\ready_union_scopes_20261015.csv')
SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
PUBLIC=HERE.parents[1]
PRODUCTION=('実行プロンプト','解説英語','解説日本語','制作状態','画像SHA256','画像GitBlobSHA','検品日時','検品メモ','画像保存先','検品方法','生成要求ID','生成結果ID','生成保存日時','語義SHA256')
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(data):return hashlib.sha256(data).hexdigest()
def blob(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
def compact(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def read_csv(path):
 data=path.read_bytes();reader=csv.DictReader(io.StringIO(data.decode('utf-8-sig'),newline=''));rows=list(reader);fields=reader.fieldnames
 if not fields or len(fields)!=len(set(fields))or any(None in r for r in rows):raise ValueError('Malformed CSV/header')
 return data,fields,rows
def definitions(source=SOURCE):
 directory=pathlib.Path(source)/'tools';spec=importlib.util.spec_from_file_location('illustration_scene_definitions',directory/'illustration_scenes.py');m=importlib.util.module_from_spec(spec)
 # Current scene validation imports its sibling non-PIE identity definitions.
 sys.path.insert(0,str(directory))
 try:spec.loader.exec_module(m)
 finally:sys.path.pop(0)
 return m
def filename(value):
 if pathlib.PureWindowsPath(value).name!=value or not value.endswith('.png')or re.search(r'[<>:"/\\|?*\x00-\x1f]',value):raise ValueError('Unsafe image filename')
 return value
def view(row):
 def pick(a,b):return row[a]if a in row else row.get(b,'')
 roots=json.loads(row['語根ID_JSON'])if row.get('語根ID_JSON')else (row.get('roots','').split('+')if row.get('roots')else [])
 if not isinstance(roots,list)or any(not isinstance(x,str)or not x for x in roots):raise ValueError('Invalid ordered roots')
 return {'word':pick('単語','word'),'roots':roots,'filename':filename(pick('ファイル名','filename')),'ja':pick('語義','ja'),'en':pick('第一英語義','en'),'prompt':pick('画像生成プロンプト','prompt')}
def key(row):
 v=view(row);return json.dumps([v['word'],v['roots'],v['filename']],ensure_ascii=False,separators=(',',':'))
def check_rows(rows):
 keys=[key(r)for r in rows];names=[view(r)['filename'].casefold()for r in rows]
 if len(set(keys))!=len(keys)or len(set(names))!=len(names):raise ValueError('Duplicate sense/name or Windows filename collision')
def atomic(path,data,expected):
 current=path.read_bytes()if path.exists()else None
 if current!=expected:raise RuntimeError('Concurrent edit: '+str(path))
 path.parent.mkdir(parents=True,exist_ok=True);tmp=path.with_name('.'+path.name+'.'+uuid.uuid4().hex+'.tmp')
 try:
  with tmp.open('xb')as f:f.write(data);f.flush();os.fsync(f.fileno())
  if tmp.read_bytes()!=data:raise IOError('Temporary read-back failed')
  if (path.read_bytes()if path.exists()else None)!=expected:raise RuntimeError('Concurrent edit before replacement')
  os.replace(tmp,path)
  if path.read_bytes()!=data:raise RuntimeError('Concurrent edit after replacement')
 finally:
  if tmp.exists():tmp.unlink()
def state_path(csv_path):return csv_path.with_name(csv_path.name+'.owner.json')
@contextlib.contextmanager
def operation(csv_path):
 lock=csv_path.with_name(csv_path.name+'.write-lock')
 marker=uuid.uuid4().hex.encode()
 try:fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
 except FileExistsError:raise RuntimeError('Another cooperating writer holds this CSV')
 try:os.write(fd,marker);os.close(fd);yield
 finally:
  if lock.exists()and lock.read_bytes()==marker:lock.unlink()
def begin(csv_path,owner,expected_sha):
 if owner not in ('dot','works','importer'):raise ValueError('Unknown owner')
 with operation(csv_path):
  data,_,rows=read_csv(csv_path);check_rows(rows)
  if sha(data)!=expected_sha:raise RuntimeError('Input changed since handoff inspection')
  path=state_path(csv_path)
  if path.exists():raise RuntimeError('Ownership already assigned; do not take over another process')
  token=uuid.uuid4().hex;state={'schema':1,'owner':owner,'token':token,'csv_sha256':sha(data),'started_at':now()};atomic(path,compact(state),None);return state
def owned(csv_path,token,owner):
 path=state_path(csv_path);raw=path.read_bytes();state=json.loads(raw)
 if state['token']!=token or state['owner']!=owner:raise PermissionError('Wrong owner/token')
 if sha(csv_path.read_bytes())!=state['csv_sha256']:raise RuntimeError('Uncoordinated CSV edit; reconcile without overwriting')
 return path,raw,state
def end(csv_path,token):
 with operation(csv_path):
  p=state_path(csv_path);s=json.loads(p.read_bytes())
  owned(csv_path,token,s['owner']);p.unlink()
def handoff_to_works(csv_path,token):
 """Freeze dot writes by transferring the current CSV assignment to Works."""
 with operation(csv_path):
  path,raw,state=owned(csv_path,token,'dot')
  state.update(owner='works',token=uuid.uuid4().hex,handed_off_at=now(),dot_writes_frozen=True)
  atomic(path,compact(state),raw)
 return {'owner':'works','csv_sha256':state['csv_sha256'],'dot_writes_frozen':True}

def select_candidates(rows,source=SOURCE):
 selected=[]
 for row in rows:
  if 'generation_eligible'in row and row['generation_eligible']!='True':continue
  if row.get('制作状態')in ('generated','reviewed','applied','needs_revision','error'):continue
  if row.get('generation_need_status')=='date_review_required_not_confirmed_regeneration':continue
  v,_,ja,_,_=canonical(row,source)
  if not ja or not v['prompt']:continue
  selected.append(row)
 return selected

def save_rows(csv_path,fields,rows,old,owner_path,owner_raw,state):
 check_rows(rows);stream=io.StringIO(newline='');w=csv.DictWriter(stream,fieldnames=fields,extrasaction='raise',lineterminator='\r\n');w.writeheader();w.writerows(rows);new=b'\xef\xbb\xbf'+stream.getvalue().encode()
 atomic(csv_path,new,old);state['csv_sha256']=sha(new);state['saved_at']=now();atomic(owner_path,compact(state),owner_raw)
_WORDS_CACHE={}
def current_words(source=SOURCE):
 """Index the current private canonical words by stable (word, ordered roots).

 The retired QA export and positional source_row are never authorities.
 """
 path=pathlib.Path(source)/'app/data/pie/words.json'
 def signature():
  st=path.stat();return (st.st_dev,st.st_ino,st.st_size,st.st_mtime_ns,st.st_ctime_ns)
 fingerprint=signature();cached=_WORDS_CACHE.get(str(path.resolve()))
 if cached and cached[0]==fingerprint:return cached[1],cached[2]
 raw=path.read_bytes()
 if signature()!=fingerprint:raise RuntimeError('Canonical words changed while reading')
 words=json.loads(raw)
 if not isinstance(words,list):raise ValueError('Canonical words must be a list')
 index={}
 for word in words:
  identity=(word['w'],tuple(word.get('p',[])))
  index.setdefault(identity,[]).append(word)
 digest=sha(raw);_WORDS_CACHE[str(path.resolve())]=(fingerprint,index,digest)
 return index,digest

def canonical(row,source=SOURCE):
 v=view(row);d=definitions(source);ja,en=d.first_senses({'ja':v['ja'],'en':v['en']});index,_=current_words(source)
 matches=index.get((v['word'],tuple(v['roots'])),[])
 senses={d.first_senses(word)[0]for word in matches}
 if len(matches)!=1 or senses!={ja}:raise ValueError('Current canonical first sense missing, ambiguous or changed')
 # en is an independent paraphrase snapshot. Preserve its recorded digest for
 # provenance; a later paraphrase edit does not invalidate this image review.
 digest=d.sense_digest(v['word'],v['roots'],ja,en)
 if row.get('語義SHA256')and row['語義SHA256']!=digest:raise ValueError('Stale sense digest')
 return v,d,ja,en,digest

def png_bytes(path):
 data=path.read_bytes()
 with Image.open(io.BytesIO(data))as im:
  if im.format!='PNG'or im.mode!='RGBA'or im.size!=(512,512)or im.getchannel('A').getextrema()[0]==255:raise ValueError('Expected 512x512 RGBA PNG with actual transparency')
 return data
def entry_for(row,source=SOURCE):
 v,d,ja,en,digest=canonical(row,source)
 if not ja:raise ValueError('Current canonical Japanese first sense is empty; binding matches but review cannot be completed')
 if row.get('制作状態')!='reviewed':raise ValueError('Row not reviewed')
 if not row.get('実行プロンプト')and '既存画像への解説追加・実行プロンプト不明'not in row.get('検品メモ',''):raise ValueError('Executed prompt missing')
 stamp=datetime.datetime.fromisoformat(row['検品日時'].replace('Z','+00:00'))
 if not stamp.tzinfo:raise ValueError('Review time requires timezone')
 path=pathlib.Path(row['画像保存先'])
 if path.name!=v['filename']:raise ValueError('Saved PNG basename must match literal CSV filename')
 data=png_bytes(path)
 if sha(data)!=row.get('画像SHA256')or blob(data)!=row.get('画像GitBlobSHA'):raise ValueError('Actual PNG changed')
 entry={'w':v['word'],'p':v['roots'],'art':v['filename'][:-4],'sense':{'index':0,'ja':ja,'en':en,'sha256':digest},'scene':{'en':row.get('解説英語',''),'ja':row.get('解説日本語','')},'image':{'path':'assets/word/'+v['filename'],'sha256':sha(data),'git_blob_sha':blob(data)},'review':{'status':'reviewed','reviewed_at':row['検品日時'],'method':row.get('検品方法',''),'notes':row.get('検品メモ','')}}
 d.validate_entry(entry);return entry,data
def record(csv_path,token,identity,values,source=SOURCE):
 if set(values)-set(PRODUCTION):raise ValueError('Cannot change input/unknown columns through record')
 with operation(csv_path):
  op,original_state,state=owned(csv_path,token,'works');old,fields,rows=read_csv(csv_path)
  matches=[i for i,r in enumerate(rows)if r.get('identity',key(r))==identity]
  if len(matches)!=1:raise ValueError('Exact stable identity required')
  i=matches[0];prior=rows[i].copy()
  if 'generation_eligible'in prior and prior['generation_eligible']!='True':raise ValueError('Generation held: '+prior.get('generation_hold_reason','not eligible'))
  v,d,ja,en,digest=canonical(prior,source);row=prior|values;row['語義SHA256']=digest
  if row.get('制作状態')not in ('generated','reviewed','needs_revision','error'):raise ValueError('Invalid Works production state')
  if row['制作状態']in ('generated','reviewed'):
   image_path=pathlib.Path(row['画像保存先'])
   if image_path.name!=v['filename']:raise ValueError('Saved PNG basename must match literal CSV filename')
   if pathlib.Path(source).resolve()==SOURCE.resolve() and not image_path.resolve().is_relative_to(HERE/'_illust'):raise ValueError('Works output must be under _illust')
   data=png_bytes(image_path)
   if row.get('画像SHA256')!=sha(data)or row.get('画像GitBlobSHA')!=blob(data):raise ValueError('Image hash must describe actual saved PNG')
  if row['制作状態']=='reviewed':entry_for(row,source)
  elif prior.get('制作状態')in ('reviewed','applied')and any(row.get(c)!=prior.get(c)for c in ('解説英語','解説日本語','画像SHA256','実行プロンプト')):
   row['検品メモ']=(row.get('検品メモ','')+' | changed image/caption requires fresh review').strip(' |')
  rows[i]=row;new_fields=fields+[c for c in PRODUCTION if c not in fields]
  rows=[{c:r.get(c,'')for c in new_fields}for r in rows]
  save_rows(csv_path,new_fields,rows,old,op,original_state,state);return {'identity':identity,'state':row['制作状態'],'csv_sha256':state['csv_sha256']}
def append(csv_path,token,new_rows):
 with operation(csv_path):
  op,raw,state=owned(csv_path,token,'dot');old,fields,rows=read_csv(csv_path)
  for r in new_rows:
   if any(r.get(c)for c in PRODUCTION if c!='制作状態')or r.get('制作状態','prompt_ready')!='prompt_ready':raise ValueError('Dot cannot append fabricated production evidence')
  combined=rows+new_rows;check_rows(combined);all_fields=list(dict.fromkeys(fields+[c for r in new_rows for c in r]));combined=[{c:r.get(c,'')for c in all_fields}for r in combined]
  save_rows(csv_path,all_fields,combined,old,op,raw,state);return {'appended':len(new_rows)}
def scene_key(entry):return json.dumps([entry['w'],entry['p'],entry['art']],ensure_ascii=False,separators=(',',':'))
def load_canonical(path):
 raw=path.read_bytes()if path.exists()else None;data=json.loads(raw)if raw else {'schema':1,'entries':[]}
 if data.get('schema')!=1 or not isinstance(data.get('entries'),list):raise ValueError('Unsupported canonical scene schema')
 keys=[scene_key(e)for e in data['entries']]
 if len(keys)!=len(set(keys)):raise ValueError('Duplicate canonical scene key')
 return raw,data
def baseline(csv_path,canonical_path,assets):
 _,data=load_canonical(canonical_path);entries={scene_key(e):e for e in data['entries']};_,_,rows=read_csv(csv_path);out={}
 for r in rows:
  v=view(r);k=json.dumps([v['word'],v['roots'],v['filename'][:-4]],ensure_ascii=False,separators=(',',':'));image=assets/v['filename'];out[k]={'record_sha256':sha(compact(entries[k]))if k in entries else None,'image_sha256':sha(image.read_bytes())if image.exists()else None}
 return {'schema':1,'captured_at':now(),'records':out}
def merge_entry(prior,entry):
 """Update owned fields only; preserve unknown metadata and append history."""
 if prior is None:return copy.deepcopy(entry)
 merged=copy.deepcopy(prior)
 for field in ('w','p','art'):merged[field]=copy.deepcopy(entry[field])
 for field in ('sense','scene','image','review'):
  original=prior.get(field,{})
  if not isinstance(original,dict):raise ValueError('Existing entry has invalid '+field+'; preserve for reconciliation')
  merged[field]=copy.deepcopy(original)
  merged[field].update(copy.deepcopy(entry[field]))
 if merged!=prior:
  history=merged.get('review_history',[])
  if not isinstance(history,list):raise ValueError('Existing review_history is not a list; do not replace it')
  snapshot={k:copy.deepcopy(v)for k,v in prior.items()if k!='review_history'}
  merged['review_history']=history+[{'superseded_at':now(),'reason':'reviewed_caption_adoption_after_user_image_copy','previous_record':snapshot}]
 return merged

def apply_reviewed(csv_path,token,canonical_path,assets,expected,manifest_path,source=SOURCE):
 """Adopt captions only after the user manually copies the reviewed PNG.

 No public export, Git command or automatic generation occurs here.
 """
 results=[]
 with operation(csv_path):
  op,owner_raw,state=owned(csv_path,token,'importer');csv_old,fields,rows=read_csv(csv_path)
  manifest_old=manifest_path.read_bytes()if manifest_path.exists()else None;manifest=json.loads(manifest_old)if manifest_old else {'schema':1,'events':[]}
  for row in rows:
   if row.get('制作状態')!='reviewed':continue
   try:
    entry,image=entry_for(row,source);k=scene_key(entry);before,canonical_data=load_canonical(canonical_path);matches=[i for i,e in enumerate(canonical_data['entries'])if scene_key(e)==k];prior=canonical_data['entries'][matches[0]]if matches else None;target=assets/view(row)['filename'];old_image=target.read_bytes()if target.exists()else None
    merged=merge_entry(prior,entry)
    if prior==merged and old_image==image:row['制作状態']='applied';results.append({'key':k,'status':'already_applied'});continue
    if old_image != image:raise RuntimeError('Awaiting user inspection and manual copy: official PNG must match reviewed staging SHA256')
    guard=expected.get('records',{}).get(k)
    if guard is None or guard.get('record_sha256')!=(sha(compact(prior))if prior else None)or guard.get('image_sha256')!=(sha(old_image)if old_image is not None else None):raise RuntimeError('Baseline missing or another editor changed image/record')
    backup=manifest_path.parent/'backups'/uuid.uuid4().hex;backup.mkdir(parents=True)
    if before is not None:(backup/'canonical.before.json').write_bytes(before)
    if old_image is not None:(backup/'image.before.png').write_bytes(old_image)
    transaction={'key':k,'status':'prepared','backup':str(backup),'image_sha256':sha(image),'canonical_before_sha256':sha(before)if before else None,'at':now()};manifest['events'].append(transaction);atomic(manifest_path,compact(manifest),manifest_old);manifest_old=manifest_path.read_bytes()
    if matches:canonical_data['entries'][matches[0]]=merged
    else:canonical_data['entries'].append(merged)
    # Official PNGs are read-only: the user alone performs the copy.
    if target.read_bytes()!=image:raise RuntimeError('Official PNG changed before caption adoption')
    atomic(canonical_path,compact(canonical_data),before)
    if json.loads(canonical_path.read_bytes())!=canonical_data or target.read_bytes()!=image:raise RuntimeError('Pair read-back mismatch')
    transaction['status']='applied';transaction['record_sha256']=sha(compact(merged));atomic(manifest_path,compact(manifest),manifest_old);manifest_old=manifest_path.read_bytes();row['制作状態']='applied';results.append({'key':k,'status':'applied'})
   except (ValueError,KeyError,RuntimeError,OSError)as exc:results.append({'identity':row.get('identity'),'status':'skipped','reason':str(exc)})
  new_fields=fields+['制作状態']if '制作状態'not in fields else fields;save_rows(csv_path,new_fields,[{c:r.get(c,'')for c in new_fields}for r in rows],csv_old,op,owner_raw,state)
 return results
def main():
 if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('action',choices=['inspect','candidates','begin','end','handoff','record','append','baseline','apply']);p.add_argument('--csv',type=pathlib.Path,default=DEFAULT_CSV);p.add_argument('--owner',choices=['dot','works','importer']);p.add_argument('--offset',type=int,default=0);p.add_argument('--limit',type=int,default=25);p.add_argument('--expected-sha256');p.add_argument('--token');p.add_argument('--identity');p.add_argument('--values',type=pathlib.Path);p.add_argument('--source',type=pathlib.Path,default=SOURCE);p.add_argument('--canonical',type=pathlib.Path,default=SOURCE/'app/data/pie/word_illustration_scenes.json');p.add_argument('--assets',type=pathlib.Path,default=PUBLIC/'assets/word');p.add_argument('--baseline',type=pathlib.Path);p.add_argument('--manifest',type=pathlib.Path,default=HERE/'.workflow/import_manifest.json');a=p.parse_args()
 if a.action=='inspect':
  b,fields,rows=read_csv(a.csv);check_rows(rows);result={'path':str(a.csv),'rows':len(rows),'sha256':sha(b),'columns':fields,'owner_file_exists':state_path(a.csv).exists(),'owner':json.loads(state_path(a.csv).read_bytes()).get('owner')if state_path(a.csv).exists()else None,'generation_eligible':sum(r.get('generation_eligible')=='True'for r in rows),'generation_held':sum(r.get('generation_eligible')=='False'for r in rows)}
 elif a.action=='candidates':
  _,_,rows=read_csv(a.csv);selected=select_candidates(rows,a.source);result={'eligible_remaining':len(selected),'offset':max(a.offset,0),'rows':selected[max(a.offset,0):max(a.offset,0)+min(max(a.limit,1),100)]}
 elif a.action=='handoff':result=handoff_to_works(a.csv,a.token)
 elif a.action=='begin':result=begin(a.csv,a.owner,a.expected_sha256)
 elif a.action=='end':end(a.csv,a.token);result={'released':True}
 elif a.action=='record':result=record(a.csv,a.token,a.identity,json.loads(a.values.read_text(encoding='utf-8')),a.source)
 elif a.action=='append':result=append(a.csv,a.token,json.loads(a.values.read_text(encoding='utf-8')))
 elif a.action=='baseline':
  if not a.baseline:p.error('--baseline output is required')
  result=baseline(a.csv,a.canonical,a.assets);atomic(a.baseline,compact(result),None)
 else:
  if not a.baseline:p.error('--baseline is required')
  result=apply_reviewed(a.csv,a.token,a.canonical,a.assets,json.loads(a.baseline.read_text(encoding='utf-8')),a.manifest,a.source)
 print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':main()
