"""Build one conservative, image-complete catalog for both public applications.

Ownership is independent of captions, answer language, date, POS and rarity.
Only current public canonical data and observed PNG bytes are inputs.
"""
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime, timezone
import base64, copy, csv, hashlib, importlib.util, json, re, sys, unicodedata
from generated_image_resolver import resolve_bindings, identity_key

ROOT=Path(__file__).resolve().parents[2]
GEN=Path('app/data/generated-etymon')
GAME=Path('app/games/picture-words')

def compact(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def issue_digest(issue):return digest(json.dumps(issue,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def normalize(x):return ' '.join(unicodedata.normalize('NFKC',str(x or '')).translate(str.maketrans({'’':"'",'‘':"'",'‐':'-','‑':'-'})).split())
def first_senses(w):return normalize(w.get('ja','').split('、')[0]),normalize(w.get('en','').split(' / ')[0])
def sense_of(w):
 ja,en=first_senses(w)
 return {'index':0,'ja':ja,'en':en,'sha256':digest(compact([normalize(w['w']),w.get('p',[]),ja,en]).encode())}
def load_module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def after_cutoff(dates):
 for date in dates:
  try:
   stamp=datetime.fromisoformat(date.replace('Z','+00:00'))
   if stamp.tzinfo and stamp>=datetime(2026,9,10,15,tzinfo=timezone.utc):return True
  except (ValueError,TypeError):pass
 return False

def scan_inventory(root):
 out={}
 for p in sorted((root/'assets/word').glob('*.png')):
  if re.search(r'[\x00-\x1f/\\?#]',p.stem) or p.stem in {'.','..'}:raise ValueError('Unsafe PNG stem: '+p.name)
  b=p.read_bytes()
  if not b.startswith(b'\x89PNG\r\n\x1a\n') or b[12:16]!=b'IHDR' or len(b)<24:raise ValueError('Invalid PNG: '+p.name)
  out[p.stem]={'path':'assets/word/'+p.name,'sha256':digest(b),'git_blob_sha':blob(b),'bytes':len(b),'width':int.from_bytes(b[16:20],'big'),'height':int.from_bytes(b[20:24],'big')}
 return out

def validate_caption(entry,word,art,image):
 if not entry:return None,'missing','caption_not_created'
 if entry.get('status',entry.get('review',{}).get('status'))!='reviewed' or entry.get('review',{}).get('status')!='reviewed':return None,'held','caption_not_reviewed'
 expected=sense_of(word)
 if any(entry.get('sense',{}).get(k)!=v for k,v in expected.items()):return None,'stale','first_sense_changed'
 if any(entry.get('image',{}).get(k)!=image[k] for k in ['path','sha256','git_blob_sha']):return None,'stale','image_changed'
 en=normalize(entry.get('scene',{}).get('en'));ja=normalize(entry.get('scene',{}).get('ja'));head=normalize(word['w'])
 if not en or not ja:return None,'missing','caption_language_missing'
 if not re.search(r'(?<!\w)'+re.escape(head).replace(r'\ ',r'\s+')+r'(?!\w)',en,re.I):return None,'held','caption_headword_missing'
 if len(re.findall(r"[\w]+(?:['-][\w]+)*",en))>18:return None,'held','caption_too_long'
 bare=re.sub(r'[.!?]+$','',en).strip().casefold();h=head.casefold()
 if bare in {h,'a '+h,'an '+h,'the '+h,'this is '+h,'this is a '+h,'this is an '+h}:return None,'held','caption_has_no_visual_detail'
 result={'schema':1,'status':'reviewed','w':word['w'],'p':word.get('p',[]),'art':art,'sense':expected,'scene':{'en':en,'ja':ja},'image':{k:image[k] for k in ['path','sha256','git_blob_sha']}}
 return result,'reviewed',''

def kana(s):return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in normalize(s))
def japanese_answer(word,prior):
 first=first_senses(word)[0]
 if prior and prior.get('w') and prior.get('sceneBinding')=={k:word.get(k,[] if k=='p' else '') for k in ['w','p','ja','en']}:
  return prior['w'],'verified_existing_exact_game_answer'
 rows=word.get('ja_readings') or []
 if rows and normalize(rows[0].get('gloss'))==first and rows[0].get('status')=='reviewed' and rows[0].get('kana'):
  return rows[0]['kana'],'reviewed_first_reading'
 literal=kana(first)
 if re.fullmatch('[ぁ-ゔー]+',literal):return literal,'literal_kana_first_gloss'
 return '', 'reading_'+(rows[0].get('status','missing') if rows else 'missing')

def build_catalog_rows(root=ROOT,include_packs=True):
 root=Path(root);words_raw=(root/GEN/'words.json').read_bytes();scenes_raw=(root/GEN/'illustration-scenes.json').read_bytes();index_raw=(root/'assets/word/illustration-index.js').read_bytes()
 for b in [words_raw,scenes_raw,index_raw]:
  if b'\r\n' in b:raise ValueError('Hash-bound source input has CRLF; preserve LF bytes')
 words=json.loads(words_raw);payload=json.loads(scenes_raw);manifest=read(root/GEN/'manifest.json')
 for name,b in [('words',words_raw),('illustration_scenes',scenes_raw)]:
  if manifest['files'][name]['sha256']!=digest(b):raise ValueError('Stale source manifest: '+name)
 index=json.loads(index_raw[index_raw.index(b'{'):index_raw.rindex(b'}')+1]);inv=scan_inventory(root)
 legacy=load_module('legacy_image_names',root/GAME/'build_catalog.py')
 ledger=read(root/GAME/'updated-art.json')+[{'w':w,'roots':p,'file':f,'source':'published_exceptional_tuple','priority':3} for w,p,f in legacy.LEDGER_SENSE_ART]
 resolved=resolve_bindings(words,inv,index,ledger,payload)
 date_path=root/'work/etymopedia/png_creation_dates.csv';date_rows={}
 if date_path.is_file():
  for item in csv.DictReader(date_path.open(encoding='utf-8-sig',newline='')):
   name=item.get('FileName','');stamp=item.get('LatestUpdatedAtJST','')
   try:
    parsed=datetime.fromisoformat(stamp)
    if parsed.tzinfo and name.endswith('.png') and Path(name).name==name:date_rows[name[:-4]]=item
   except (ValueError,TypeError):pass
 for asset in resolved['assets']:
  if asset['art'] in date_rows:asset['recordedUpdatedAt']=[date_rows[asset['art']]['LatestUpdatedAtJST']]
 seeds=read(root/'app/data/generated-image-legacy-ids.json')['rows'];prior={}
 for r in seeds:
  roots=r.get('roots',r.get('sceneBinding',{}).get('p',[]));prior[(r['en'],tuple(roots),r['pic'])]=r
 scene_map={}
 for e in payload['entries']:
  key=(e['w'],tuple(e.get('p',[])),e['art'])
  if key in scene_map:raise ValueError('Duplicate scene identity')
  scene_map[key]=e
 issue_data=read(root/'app/data/generated-image-issues.json');known=issue_data.get('issues',[]);resolutions=issue_data.get('resolutions',[]);issues=defaultdict(list)
 for issue in known:issues[(issue['w'],tuple(issue['p']),issue['art'])].append(issue)
 owned={r['art']:r for r in resolved['safe_primary']};assets={r['art']:r for r in resolved['assets']};rows=[];used_ids=set();packs={}
 seed_ids={r['id'] for r in seeds};legacy_ids={pic for _,pic in legacy.LEGACY_CHOICES};reserved=seed_ids|legacy_ids
 for art,binding in owned.items():
  word=words[binding['dictionaryIndex']];key=(word['w'],tuple(word.get('p',[])),art);old=prior.get(key);meta=assets[art];image={k:inv[art][k] for k in ['path','sha256','git_blob_sha']};sense=sense_of(word)
  candidate=old['id'] if old else ('mortar' if key==('mortar',('mer-2',),'mortar@construction') else art)
  if candidate in used_ids:raise ValueError('Duplicate stable ID: '+candidate)
  used_ids.add(candidate)
  active=[]
  relevant_issues=[issue for issue in known if issue['art']==art or (issue['w']==word['w'] and issue['p']==word.get('p',[]))]
  for issue in relevant_issues:
   cleared=any((x['w'],tuple(x['p']),x['art'])==key and x['imageSha256']==image['sha256'] and x['senseSha256']==sense['sha256'] and x.get('reviewed_at') and x.get('reason') and issue_digest(issue) in x.get('resolvesIssueSha256',[]) for x in resolutions)
   if cleared:continue
   exact=issue['imageSha256']==image['sha256'] and issue['senseSha256']==sense['sha256']
   active += [{'code':c if exact else 'known_issue_needs_review','detail':issue['detail'] if exact else 'Previously held image/sense changed; a fresh explicit resolution is required. '+issue['detail'],'imageSha256':image['sha256']} for c in issue['codes']]
  reviewed,status,reason=validate_caption(scene_map.get(key),word,art,image)
  if active:
   reviewed=None;status='held';reason=active[0]['code']
  answer,evidence=japanese_answer(word,old);ja_ok=bool(re.fullmatch('[ぁ-ゔー]{1,14}',answer) and re.search('[ぁ-ゔ]',answer))
  en_ok=bool(re.fullmatch('[A-Za-z]{1,14}',word['w']))
  en_reason=active[0]['code'] if active else '' if en_ok else 'unsupported_english_answer_format'
  ja_reason=active[0]['code'] if active else '' if ja_ok else evidence if not answer else 'unsupported_japanese_answer_length'
  description={'status':status,'en':reviewed['scene']['en'] if reviewed else '', 'ja':reviewed['scene']['ja'] if reviewed else '', 'reason':reason,'ttsAllowed':bool(reviewed)}
  dates=meta['recordedUpdatedAt'];row={'id':candidate,'pic':art,'en':word['w'],'w':answer if ja_ok else '', 'ja':sense['ja'],'roots':word.get('p',[]),'dictionaryIndex':binding['dictionaryIndex'],'rank':word.get('r') or 99999,'generatedImage':True,'updatedArt':after_cutoff(dates),'bindingStatus':'bound','image':image,'sense':sense,'sceneBinding':{k:word.get(k,[] if k=='p' else '') for k in ['w','p','ja','en']},'description':description,'availability':{'en':{'playable':en_ok and not active,'answer':word['w'],'reason':en_reason},'ja':{'playable':ja_ok and not active,'answer':answer if ja_ok else '', 'reason':ja_reason}},'issues':active,'recordedUpdatedAt':max(dates) if dates else None,'readingEvidence':evidence,'imageDateProvenance':{'source':'published_image_date_ledger','commit':date_rows[art].get('LatestUpdatedCommit'),'createdAt':date_rows[art].get('CreatedAtJST')} if art in date_rows else {'source':'recorded_exact_tuple' if dates else 'unknown'},'pos':word.get('pos','')}
  if word.get('tags') is not None:row['tags']=word['tags']
  if old and old.get('challengeBand'):row['challengeBand']=old['challengeBand']
  if reviewed:
   row['reviewedScene']=reviewed
   name=art+'@'+image['sha256']+'.js';row['sceneAsset']='picture-words/scene-assets/'+name
   if include_packs:
    packed={'mime':'image/png','base64':base64.b64encode((root/image['path']).read_bytes()).decode('ascii')}
    packs['scene-assets/'+name]=('(window.PICTURE_WORDS_SCENE_ASSETS ||= {})['+json.dumps(image['sha256'])+'] = '+json.dumps(packed,separators=(',',':'))+';\n').encode()
  rows.append(row)
 # Every remaining physical PNG stays visible without inventing an English meaning.
 for art,meta in sorted(assets.items()):
  if art in owned:continue
  candidate=art if art in legacy_ids and art not in used_ids else 'asset:'+art
  if candidate in used_ids:raise ValueError('Duplicate asset ID')
  used_ids.add(candidate);role=meta['assetRole'];status='alternate' if meta['canonicalOwner'] else 'ownership_pending';reason=meta['reason'] or role;dates=meta['recordedUpdatedAt'];image={k:inv[art][k] for k in ['path','sha256','git_blob_sha']}
  rows.append({'id':candidate,'pic':art,'en':'','w':'','ja':'','roots':[],'dictionaryIndex':None,'rank':99999,'generatedImage':True,'updatedArt':after_cutoff(dates),'bindingStatus':status,'assetRole':role,'primaryArt':meta['primaryArt'],'image':image,'description':{'status':'missing','en':'','ja':'','reason':'ownership_pending' if status=='ownership_pending' else 'alternate_image','ttsAllowed':False},'availability':{l:{'playable':False,'answer':'','reason':reason} for l in ['en','ja']},'issues':[{'code':reason,'detail':'画像の対応確認中' if status=='ownership_pending' else '別の画像・旧版','imageSha256':image['sha256']}],'recordedUpdatedAt':max(dates) if dates else None,'imageDateProvenance':{'source':'published_image_date_ledger','commit':date_rows[art].get('LatestUpdatedCommit'),'createdAt':date_rows[art].get('CreatedAtJST')} if art in date_rows else {'source':'recorded_exact_tuple' if dates else 'unknown'},'pos':''})
 # Freeze existing sequence before adding new entries. No spelling-based deduplication.
 order={r['id']:n for n,r in enumerate(seeds)};rows.sort(key=lambda r:(0,order[r['id']]) if r['id'] in order else (1,r['rank'],r['en'],r['pic']))
 if len(rows)!=len(inv) or len(used_ids)!=len(inv):raise ValueError('Every physical PNG must appear exactly once')
 if not seed_ids.issubset(used_ids):raise ValueError('Existing catalog IDs disappeared')
 if not legacy_ids.issubset(used_ids):raise ValueError('Legacy IDs disappeared')
 meta={'schema':2,'sourceWordsSha256':digest(words_raw),'scenesSha256':digest(scenes_raw),'indexSha256':digest(index_raw),'imageDatesSha256':digest(date_path.read_bytes()) if date_path.is_file() else None,'count':len(rows),'wordEntryCount':len(owned),'ownershipPendingCount':sum(r['bindingStatus']=='ownership_pending' for r in rows),'descriptionCounts':dict(Counter(r['description']['status'] for r in rows)),'playableCounts':{l:sum(bool(r['availability'][l]['playable']) for r in rows) for l in ['en','ja']}}
 report={'schema':2,'meta':meta,'ownership':resolved['summary'],'sceneEntries':len(payload['entries']),'existingIdsPreserved':len(seed_ids),'legacyIdsPreserved':len(legacy_ids),'imageBytes':sum(r['bytes'] for r in inv.values()),'emittedRows':len(rows),'lazyAssets':len(packs),'lazyAssetBytes':sum(len(b) for b in packs.values()),'inventoryNamesSha256':digest(compact(sorted(inv)).encode()),'inclusionPolicy':'all_observed_generated_PNGs','dateGateApplied':False,'captionGateApplied':False,'posGateApplied':False,'exclusionCounts':{},'inputHashes':{p:digest((root/p).read_bytes()) for p in ['app/data/generated-image-issues.json','app/data/generated-image-legacy-ids.json','app/data/generated_image_resolver.py','app/data/build_generated_image_catalog.py','app/games/picture-words/updated-art.json','app/games/picture-words/build_catalog.py']},'ownershipPending':[{k:r.get(k) for k in ['art','path','reason','candidateIdentities']} for r in resolved['assets'] if r['bindingStatus']=='ownership_pending'],'issues':[{k:r[k] for k in ['id','pic','issues']} for r in rows if r['issues']]}
 return rows,meta,packs,report
