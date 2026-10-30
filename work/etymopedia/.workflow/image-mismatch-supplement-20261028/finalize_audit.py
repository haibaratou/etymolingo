import pathlib,json,csv,hashlib,sys,re,collections,datetime,subprocess
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=pathlib.Path(__file__).parent;SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses,sense_digest
def load(n):return json.loads((OUT/n).read_bytes())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def key(w,p,o=''):return json.dumps([w,p,o or ''],ensure_ascii=False,separators=(',',':'))
inventory=load('current-image-population.json');records=inventory['records'];flagged=load('flagged-cases.json');ind=load('unreviewed-cases.json')['cases'];selection=load('prompt-selection.json')['selection'];selected={x['case']:x for x in selection};overrides=load('final-overrides.json');closeups=load('closeup-decisions.json')
target=HERE/'prompt_rows_image_mismatch_supplement_20261028.csv';payload=target.read_bytes();rows=list(csv.DictReader(payload.decode('utf-8-sig').splitlines(keepends=True)));fields=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')))
assert len(rows)==len(selection)==149,(len(rows),len(selection))
assert payload.startswith(b'\xef\xbb\xbf') and b'\r\n' in payload
assert list(rows[0])==fields and len(fields)==19
words=json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes());pool=collections.defaultdict(list)
for w in words:pool[key(w['w'],w.get('p',[]),w.get('etymology_id'))].append(w)
byrecord={r['key']:r for r in records};seenkeys=set();seenfiles=set();comps=set();checks=[]
for row,s in zip(rows,selection):
 assert row['ファイル名']==s['filename'] and row['単語']==s['w']
 roots=json.loads(row['語根ID_JSON']);k=key(row['単語'],roots);assert len(pool[k])==1;w=pool[k][0];ja,en=first_senses(w)
 assert row['対象語義']==ja and row['語義']==w['ja'] and row['第一英語義']==en
 assert row['語義SHA256']==sense_digest(w['w'],roots,ja,en)
 assert k not in seenkeys and row['ファイル名'] not in seenfiles;seenkeys.add(k);seenfiles.add(row['ファイル名'])
 assert row['ファイル名'] in byrecord[k]['literal_names'],('not approved literal filename',row['ファイル名'])
 owners=[r for r in records if r['filename']==row['ファイル名']];assert len(owners)==1 and owners[0]['key']==k,('shared owner',row['ファイル名'])
 assert row['制作状態']=='prompt_ready' and row['プロンプト準備状況']=='作成済み'
 assert row['画風参照画像']=='references/invidious.png'
 assert all(not row[f] for f in ['要確認理由','実行プロンプト','解説英語','解説日本語','画像SHA256','画像GitBlobSHA','検品日時','検品メモ'])
 prompt=row['画像生成プロンプト'];assert re.findall(r'(?m)^(Subject|Composition|Style|Framing|Output):',prompt)==['Subject','Composition','Style','Framing','Output']
 comp=prompt.split('Composition: ',1)[1].split('\n\nStyle:',1)[0];assert comp==s['composition'] and comp not in comps and len(comp.split())>=20;comps.add(comp)
 assert not re.search(r'Show a (?:visual|concrete|natural) example|representing '+re.escape(w['w']),comp,re.I)
 current_sha=sha(ROOT/'assets/word'/row['ファイル名']);assert current_sha==s['current_image_sha256']
 checks.append({'case':s['case'],'key':k,'filename':row['ファイル名'],'first_ja':ja,'image_sha256':current_sha,'full_sense_digest':row['語義SHA256']})
assert rows[0]['単語']=='board'
prior_matches=[];input_hashes=[]
for p in sorted(HERE.glob('prompt*.csv')):
 if p==target:continue
 input_hashes.append({'path':str(p),'sha256':sha(p)})
 for line,r in enumerate(csv.DictReader(p.open(encoding='utf-8-sig',newline='')),2):
  try:roots=json.loads(r.get('語根ID_JSON')or'[]')
  except Exception:continue
  k=key(r.get('単語',''),roots)
  if k in seenkeys and r.get('ファイル名') in seenfiles:prior_matches.append({'path':str(p),'record':line,'key':k,'filename':r['ファイル名'],'state':r.get('制作状態',''),'image_sha256':r.get('画像SHA256',''),'target_ja':r.get('対象語義','')})
(OUT/'prior-generation-record-matches.json').write_text(json.dumps(prior_matches,ensure_ascii=False,indent=2),encoding='utf-8')
reasons={}
for n in ['visual-01.json','visual-02.json','visual-03.json','visual-04.json','visual-05-to-19.json']:
 d=load(n)
 for name in ['major_mismatch','major']:
  reasons.update(d.get(name,{}))
for p in OUT.glob('independent-visual-*.json'):
 for n,v in json.loads(p.read_bytes()).get('major',{}).items():reasons[str(100000+int(n))]=v
reasons.update(closeups)
held={21:'Anastasia proper-name identity not disambiguated',176:'epithet current Japanese 形容詞 requires source clarification',385:'Phillip proper-name identity not disambiguated',453:'Santa identity not disambiguated',587:'Veronica plant/person identity not disambiguated',592:'Wellington city/person/boots identity not disambiguated',103423:'which Saint Gregory is not established by current Japanese',103460:'Guinness actor/name/brewery identity not disambiguated',103566:'Harvard name/institution identity not disambiguated',105172:'Moses identity not established by current Japanese',106278:'Princeton name/institution identity not disambiguated'}
def historical_image_hashes(refs):
 values=set()
 for ref in refs:
  d=ref.get('data',{})
  for k,v in d.items():
   if isinstance(v,str) and 'sense' not in k.lower() and ('image' in k.lower() or '画像' in k) and ('sha' in k.lower() or 'hash' in k.lower()) and re.fullmatch('[0-9a-f]{40}|[0-9a-f]{64}',v):values.add(v)
  for v in d.values():
   if isinstance(v,str):values.update(re.findall(r'(?:GitBlobSHA=|画像Git\s*blob[=:＝]?\s*)([0-9a-f]{40})',v,re.I))
 return sorted(values)
audit=[]
def add_case(c,n,method):
 w=(c.get('current_words')or c.get('rows'))[0];filename=c['filename'];finger=c.get('image_sha256')or w['image']['sha256'];blob=c.get('image_git_blob_sha')or w.get('image',{}).get('git_blob_sha');refs=c.get('references',[]);oldhashes=historical_image_hashes(refs);override=overrides.get(str(n));decision='';reason=''
 if n in selected:decision='additional_prompt_ready';reason=reasons.get(str(n),'Current first Japanese meaning and current pixels conflict; independently designed corrective composition')
 elif n in held:decision='hold_identity_or_source';reason=held[n]
 elif override:decision=override['decision'];reason=override['reason']
 elif oldhashes and any(h not in [finger,blob] for h in oldhashes):decision='excluded_current_compatible_after_image_change';reason='Current pixels fit current first Japanese meaning; at least one old recorded image hash is different. Excluded only after current visual review, not from hash change alone.'
 else:decision='excluded_no_major_current_mismatch';reason=reasons.get(str(n),'Current labelled pixels show no complete incompatibility with the current first Japanese meaning. Nonunique abstract proxies, paraphrase-only changes and minor style differences do not justify regeneration.')
 audit.append({'case':n,'word':w['w'],'ordered_root_ids':json.dumps(w.get('p',[]),ensure_ascii=False,separators=(',',':')),'etymology_id':w.get('etymology_id')or'','first_japanese_meaning':first_senses(w)[0],'current_filename':filename,'current_image_sha256':finger,'decision':decision,'reason':reason,'review_method':method,'old_image_hashes':json.dumps(oldhashes,separators=(',',':')),'reference_records':json.dumps([{'source':r['source'],'record':r.get('record')}for r in refs],ensure_ascii=False,separators=(',',':'))})
for c in flagged['cases']:add_case(c,c['case'],'current flagged contact sheet; selected rows and unclear cases reopened at larger resolution')
for c in ind:add_case(c,100000+c['scan'],'current first-Japanese-sense-labelled independent contact sheet; unclear/candidate rows reopened at larger resolution')
walker=byrecord[key('walker',['wel-3'])]
add_case({'filename':walker['filename'],'rows':[walker]},200001,'full-size current Walker.png pixels after Windows filename-case binding review')
for c in flagged['unreferenced_or_no_current_image']:
 refs=c['references'];names={r.get('data',{}).get('w')or r.get('data',{}).get('単語') for r in refs};candidates=[{'key':r['key'],'filename':r['filename'],'first_ja':r['first_ja']}for r in records if r['w'] in names]
 audit.append({'case':'unbound:'+c['filename'],'current_filename':c['filename'],'decision':'excluded_old_filename_not_currently_bound','reason':'Old ledger filename has no current word-image owner in this population. Do not recreate a stale shared filename; current candidates are '+json.dumps(candidates,ensure_ascii=False,separators=(',',':')),'reference_records':json.dumps([{'source':r['source'],'record':r.get('record')}for r in refs],ensure_ascii=False,separators=(',',':'))})
auditpath=HERE/'image_mismatch_decisions_20261028.csv';auditfields=['case','word','ordered_root_ids','etymology_id','first_japanese_meaning','current_filename','current_image_sha256','decision','reason','review_method','old_image_hashes','reference_records']
with auditpath.open('w',encoding='utf-8-sig',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=auditfields,lineterminator='\r\n');writer.writeheader();writer.writerows(audit)
allfresh={c['filename']for c in flagged['cases']}|{c['filename']for c in ind}|{x['actual_filename']for x in load('case-insensitive-bindings.json')};proof={r['filename']for r in records if r['exact_reviewed_caption_records']};represented={r['filename']for r in records};assert allfresh|proof==represented,(len(allfresh|proof),len(represented),represented-(allfresh|proof),(allfresh|proof)-represented)
bindings=[]
for w,p in [('mental',['men-2']),('ounce',['leuk-']),('rank',['(s)ker-3'])]:
 r=byrecord[key(w,p)];alt=r['literal_names'][0];bindings.append({'key':r['key'],'first_ja':r['first_ja'],'displayed_filename':r['filename'],'displayed_sha256':r['image']['sha256'],'existing_correct_literal_filename':alt,'existing_correct_sha256':sha(ROOT/'assets/word'/alt),'decision':'reuse existing correct PNG; do not regenerate; binding change is outside this read-only task'})
(OUT/'reference-only-fixes.json').write_text(json.dumps(bindings,ensure_ascii=False,indent=2),encoding='utf-8')
stats=collections.Counter(x['decision']for x in audit);prior_four=HERE/'prompt_rows_image_meaning_fixes_20261027.csv';assert sha(prior_four)==load('baseline.json')['read_only_inputs'][1]['sha256']
summary={'completed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'new_prompt_csv':str(target),'new_prompt_rows':len(rows),'new_prompt_sha256':sha(target),'columns':fields,'all_rows_status':'prompt_ready','new_prompt_order':'board first, then stable review case order','audit_csv':str(auditpath),'audit_rows':len(audit),'audit_sha256':sha(auditpath),'audit_decisions':dict(stats),'current_population':inventory['counts'],'coverage':{'current_owned_PNGs':len(represented),'fresh_current_pixel_PNGs':len(allfresh),'exact_current_hash_and_first_Japanese_sense_reviewed_caption_PNGs':len(proof),'fresh_and_prior_proof_overlap':len(allfresh&proof),'uncovered_owned_PNGs':sorted(represented-(allfresh|proof)),'alternate_literal_PNG_pairs_freshly_checked':18,'method_limit':'12,147 word-ID rows rely on exact-current-image-hash + exact-first-Japanese-sense retained reviewed-caption evidence; these were not all freshly reopened. Fresh contact review cannot certify every fine anatomical/chemical detail or ambiguous proper-name identity. Unbound images are not asserted semantically correct.'},'existing_four_ready_csv':str(prior_four),'existing_four_sha256':sha(prior_four),'existing_four_rows':4,'total_confirmed_regeneration_rows_across_nonoverlapping_new_and_prior_CSVs':153,'reference_only_fixes':bindings,'held_case_ids':sorted(held),'verified_current_prompt_rows':checks,'read_only_input_hashes_now':input_hashes,'current_words_sha256':sha(ROOT/'app/data/generated-etymon/words.json'),'source_heads_now':{str(p):subprocess.check_output(['git','-C',str(p),'rev-parse','HEAD'],text=True).strip() for p in [ROOT,SOURCE]},'image_hash_recheck':load('final-all-image-hash-check.json'),'not_performed':['image generation','image replacement','canonical/mother edits','shared-ledger edits','git pull','git commit','git push','publication']}
(OUT/'final-verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in summary.items()if k not in ['verified_current_prompt_rows','columns','read_only_input_hashes_now','reference_only_fixes']},ensure_ascii=False,indent=2))
