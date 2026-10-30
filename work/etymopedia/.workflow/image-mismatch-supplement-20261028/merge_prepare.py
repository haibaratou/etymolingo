import csv,json,pathlib,hashlib,collections,sys,re,datetime
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=pathlib.Path(__file__).parent;SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
sys.path.insert(0,str(HERE));import workflow_io as wf
sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses,sense_digest
def sha(data):return hashlib.sha256(data).hexdigest()
def key(w,p,o=''):return json.dumps([w,p,o or ''],ensure_ascii=False,separators=(',',':'))
paths=[HERE/n for n in ['prompt_rows_image_mismatch_supplement_20261028.csv','prompt_rows_image_mismatch_followup_20261028.csv','prompt_rows_image_meaning_fixes_20261027.csv']]
inputs=[wf.read_csv(p)for p in paths];fields=inputs[0][1];rows=sum([r[2]for r in inputs],[])
assert [len(r[2])for r in inputs]==[152,2,4]and len(fields)==19 and all(x[1]==fields for x in inputs)
assert all(not wf.state_path(p).exists()for p in paths),'An input has an active owner; stop.'
original=(OUT/'followup/original_149_rows.csv').read_bytes();assert inputs[0][0].startswith(original);wf.check_rows(rows)
assert [r['単語']for r in rows[-6:]]==['Phillip','Gregory','gemstone','biker','plugin','coupe']and not any(r['単語']=='epithet'for r in rows)
words_path=ROOT/'app/data/generated-etymon/words.json';words_raw=words_path.read_bytes();words=json.loads(words_raw);pool=collections.defaultdict(list)
for w in words:pool[key(w['w'],w.get('p',[]),w.get('etymology_id'))].append(w)
inventory=json.loads((OUT/'current-image-population.json').read_bytes());old={r['key']:r for r in inventory['records']}
todo=list(csv.DictReader((SOURCE/'tools/word-art-todo.csv').open(encoding='utf-8-sig',newline='')));literal=collections.defaultdict(set)
for r in todo:
 p=json.loads(r['語根ID_JSON'])if r.get('語根ID_JSON')else(r.get('語根','').split('+')if r.get('語根')else[]);literal[key(r['単語'],p)].add(r['ファイル名'])
index_path=ROOT/'assets/word/illustration-index.js';index_raw=index_path.read_bytes();s=index_raw.decode('utf-8');index=json.loads(s[s.index('{'):].rstrip().removesuffix(';'));image_names={p.name.casefold()for p in(ROOT/'assets/word').glob('*.png')};owners=collections.defaultdict(list)
for w in words:
 k=key(w['w'],w.get('p',[]),w.get('etymology_id'));ak=json.dumps([w['w'],'+'.join(w.get('p',[]))]+([w['etymology_id']]if w.get('etymology_id')else[]),ensure_ascii=False,separators=(',',':'));stem=index.get(ak)or w.get('pica');name=stem+'.png'if stem else''
 if not name:
  matches=[n for n in literal[key(w['w'],w.get('p',[]))]if n.casefold()in image_names]
  if len(matches)==1:name=matches[0]
 if name.casefold()in image_names:owners[name.casefold()].append(k)
checks=[];compositions=set();target_names=set()
for row in rows:
 v=wf.view(row);k=key(v['word'],v['roots']);assert len(pool[k])==1;w=pool[k][0];ja,en=first_senses(w)
 assert row['対象語義']==ja and row['語義']==w['ja'] and row['第一英語義']==en and row['語義SHA256']==sense_digest(w['w'],w.get('p',[]),ja,en)
 assert row['ファイル名']in literal[k]and owners[row['ファイル名'].casefold()]==[k]
 assert row['制作状態']=='prompt_ready'and row['プロンプト準備状況']=='作成済み'and row['画風参照画像']=='references/invidious.png'
 assert all(not row[c]for c in ['要確認理由','実行プロンプト','解説英語','解説日本語','画像SHA256','画像GitBlobSHA','検品日時','検品メモ'])
 assert re.findall(r'(?m)^(Subject|Composition|Style|Framing|Output):',v['prompt'])==['Subject','Composition','Style','Framing','Output']
 comp=v['prompt'].split('Composition: ',1)[1].split('\n\nStyle:',1)[0];assert comp not in compositions and len(comp.split())>=20;compositions.add(comp)
 image_sha=sha((ROOT/'assets/word'/v['filename']).read_bytes());assert image_sha==old[k]['image']['sha256'],('Image changed; inspect before merging',v['filename'])
 checks.append({'key':k,'filename':v['filename'],'first_ja':ja,'image_sha256':image_sha,'sense_digest':row['語義SHA256'],'state':'prompt_ready'});target_names.add(v['filename'].casefold())
staging=[]
for p in(HERE/'_illust').rglob('*.png'):
 if p.name.casefold()in target_names:
  h=sha(p.read_bytes());formal_sha=next(r['image_sha256']for r in checks if r['filename'].casefold()==p.name.casefold());assert h==formal_sha,('Different staging output; inspect before queueing',str(p));staging.append({'path':str(p),'sha256':h,'same_as_current_formal':True})
overlaps=[];other_inputs=[]
for path in sorted(HERE.glob('prompt*.csv'))+[pathlib.Path(r'D:\Projects\dot-image-review\ready_union_scopes_20261015.csv')]:
 if path in paths:continue
 data,_,prior=wf.read_csv(path);other_inputs.append({'path':str(path),'sha256':sha(data)})
 for n,r in enumerate(prior,2):
  name=r.get('ファイル名')or r.get('filename')or''
  if name.casefold()in target_names:overlaps.append({'path':str(path),'record':n,'filename':name,'state':r.get('制作状態')or r.get('state')or''})
active=[r for r in overlaps if r['state']in {'prompt_ready','generating','generation_requested','requested','image_received','generated','generated_unreviewed'}];assert not active,active
assert words_path.read_bytes()==words_raw and index_path.read_bytes()==index_raw,'Source changed while preparing; repeat read-only validation.'
folder=OUT/('merge-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'));folder.mkdir();(folder/'inputs').mkdir()
for path,(data,_,_)in zip(paths,inputs):(folder/'inputs'/path.name).write_bytes(data)
author={'fields':fields,'rows':rows};(folder/'authoring.json').write_text(json.dumps(author,ensure_ascii=False),encoding='utf-8')
manifest={'prepared_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'directory':str(folder),'inputs':[{'path':str(p),'sha256':sha(data),'rows':len(rs),'backup':str(folder/'inputs'/p.name)}for p,(data,_,rs)in zip(paths,inputs)],'output_path':str(paths[0]),'output_rows':158,'original_149_sha256':sha(original),'public_words_sha256':sha(words_raw),'public_image_index_sha256':sha(index_raw),'checks':checks,'staging_matches':staging,'other_prompt_inputs':other_inputs,'historical_overlaps':overlaps,'active_other_queue_overlaps':active,'old_four_current_pixel_review':{'gemstone':'Current image is cut gems in a case; target is uncut gemstone rough.','biker':'Current image is bicycle rider; target first meaning is motorcycle rider.','plugin':'Current image is physical circuit board; target is software extension.','coupe':'Current image is a drinking glass; target is fixed-roof coupe car.'},'already_fixed_exclusions':[],'authorization_evidence':'User says csv closed and explicitly authorizes merge plus deletion of now-unneeded CSVs to recoverable trash. This is new evidence after the earlier atomic replacement refusal.','epithet':'Not added; no confirmed new first meaning received.'}
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');(OUT/'latest-merge-path.txt').write_text(str(folder),encoding='utf-8');print(json.dumps({'folder':str(folder),'rows':158,'appended_to_152':6,'already_fixed_exclusions':0,'active_other_queue_overlaps':0},ensure_ascii=False))
