import pathlib,csv,json,hashlib,sys,collections,re,datetime,subprocess,io
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=pathlib.Path(__file__).parent;F=OUT/'followup';SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses,sense_digest
sys.path.insert(0,str(HERE));import workflow_io as workflow
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def key(w,p,owner=''):return json.dumps([w,p,owner or ''],ensure_ascii=False,separators=(',',':'))
def exclusive_json(path,value):
 with path.open('x',encoding='utf-8')as f:json.dump(value,f,ensure_ascii=False,indent=2)
primary=HERE/'prompt_rows_image_mismatch_supplement_20261028.csv';extra=HERE/'prompt_rows_image_mismatch_followup_20261028.csv';stage=primary.with_name(primary.name+'.stage-tmp')
original=(F/'original_149_rows.csv').read_bytes();base=primary.read_bytes();assert base.startswith(original)
bp,bf,br=workflow.read_csv(primary);ep,ef,er=workflow.read_csv(extra);sp,sf,sr=workflow.read_csv(stage)
template=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')))
assert bf==ef==sf==template and len(template)==19 and len(br)==152 and len(er)==2 and len(sr)==154
rows=br+er;assert rows==sr;workflow.check_rows(rows)
assert [r['単語']for r in rows[149:]]==['Santa','Veronica','Princeton','Phillip','Gregory']
for payload in [bp,ep,sp]:assert payload.startswith(b'\xef\xbb\xbf') and b'\r\n' in payload
words_path=ROOT/'app/data/generated-etymon/words.json';words_raw=words_path.read_bytes();words=json.loads(words_raw);pool=collections.defaultdict(list)
for w in words:pool[key(w['w'],w.get('p',[]),w.get('etymology_id'))].append(w)
inventory=json.loads((OUT/'current-image-population.json').read_bytes());byrecord={r['key']:r for r in inventory['records']}
selection=json.loads((OUT/'prompt-selection.json').read_bytes())['selection']+json.loads((F/'append-compositions.json').read_bytes())
assert len(selection)==154
literal=list(csv.DictReader((SOURCE/'tools/word-art-todo.csv').open(encoding='utf-8-sig',newline='')))
index_path=ROOT/'assets/word/illustration-index.js';index_text=index_path.read_text(encoding='utf-8');artindex=json.loads(index_text[index_text.index('{'):].rstrip().removesuffix(';'))
literal_by_key=collections.defaultdict(set)
for z in literal:
 zp=json.loads(z['語根ID_JSON'])if z.get('語根ID_JSON')else(z.get('語根','').split('+')if z.get('語根')else[])
 literal_by_key[key(z['単語'],zp)].add(z['ファイル名'])
formal_names={p.name.casefold()for p in(ROOT/'assets/word').glob('*.png')};current_binding_owners=collections.defaultdict(list)
for z in words:
 zk=key(z['w'],z.get('p',[]),z.get('etymology_id'));ak=json.dumps([z['w'],'+'.join(z.get('p',[]))]+([z['etymology_id']]if z.get('etymology_id')else[]),ensure_ascii=False,separators=(',',':'))
 stem=artindex.get(ak)or z.get('pica');zn=stem+'.png'if stem else''
 if not zn:
  candidates=[n for n in literal_by_key[key(z['w'],z.get('p',[]))]if n.casefold()in formal_names]
  if len(candidates)==1:zn=candidates[0]
 if zn.casefold()in formal_names:current_binding_owners[zn.casefold()].append(zk)
checks=[];comps=set();filename_set=set();identity_set=set()
for row,s in zip(rows,selection):
 v=workflow.view(row);roots=v['roots'];k=key(v['word'],roots);assert len(pool[k])==1;w=pool[k][0];ja,en=first_senses(w);r=byrecord[k]
 assert row['単語']==s['w'] and row['ファイル名']==s['filename']
 assert row['対象語義']==ja and row['語義']==w['ja'] and row['第一英語義']==en
 assert row['語義SHA256']==sense_digest(w['w'],roots,ja,en)
 names={z['ファイル名']for z in literal if z['単語']==w['w'] and ((z.get('語根')or'').split('+')if z.get('語根')else[])==roots};assert row['ファイル名']in names
 owners=[z for z in inventory['records']if z['filename'].casefold()==v['filename'].casefold()];assert len(owners)==1 and owners[0]['key']==k
 assert current_binding_owners[v['filename'].casefold()]==[k],('current binding owners',v['filename'],current_binding_owners[v['filename'].casefold()])
 assert row['制作状態']=='prompt_ready' and row['プロンプト準備状況']=='作成済み' and row['画風参照画像']=='references/invidious.png'
 assert all(not row[f]for f in ['要確認理由','実行プロンプト','解説英語','解説日本語','画像SHA256','画像GitBlobSHA','検品日時','検品メモ'])
 prompt=row['画像生成プロンプト'];assert re.findall(r'(?m)^(Subject|Composition|Style|Framing|Output):',prompt)==['Subject','Composition','Style','Framing','Output']
 comp=prompt.split('Composition: ',1)[1].split('\n\nStyle:',1)[0];assert comp==s['composition']and comp not in comps and len(comp.split())>=20;comps.add(comp)
 imsha=sha(ROOT/'assets/word'/v['filename']);assert imsha==r['image']['sha256']
 checks.append({'key':k,'filename':v['filename'],'current_first_ja':ja,'image_sha256':imsha,'CSV_full_sense_digest':row['語義SHA256']});filename_set.add(v['filename'].casefold());identity_set.add(k)
assert len(filename_set)==len(identity_set)==154
append_names={r['ファイル名'].casefold()for r in rows[149:]};staging=[{'path':str(p),'sha256':sha(p),'matches_current_formal':sha(p)==sha(ROOT/'assets/word'/p.name)}for p in (HERE/'_illust').rglob('*.png')if p.name.casefold()in append_names];assert not staging,staging
prior_four=HERE/'prompt_rows_image_meaning_fixes_20261027.csv';four=list(csv.DictReader(prior_four.open(encoding='utf-8-sig',newline='')));assert not filename_set&{r['ファイル名'].casefold()for r in four};assert sha(prior_four)=='dda1be8416b4d2ae41f9fa20116e0218e85437bcd61a3116956857c6c2f2b3af'
overlaps=[];input_hashes=[]
sources=sorted(HERE.glob('prompt*.csv'))+[pathlib.Path(r'D:\Projects\dot-image-review\ready_union_scopes_20261015.csv')]
for path in sources:
 if path in [primary,extra]:continue
 input_hashes.append({'path':str(path),'sha256':sha(path)})
 for line,row in enumerate(csv.DictReader(path.open(encoding='utf-8-sig',newline='')),2):
  filename=row.get('ファイル名')or row.get('filename')or''
  if filename.casefold()not in filename_set:continue
  state=row.get('制作状態')or row.get('state')or''
  overlaps.append({'path':str(path),'record':line,'filename':filename,'state':state,'target_ja':row.get('対象語義',''),'image_sha256':row.get('画像SHA256','')})
active_states={'prompt_ready','generating','generation_requested','requested','image_received','generated','generated_unreviewed'}
active=[x for x in overlaps if x['state']in active_states];assert not active,active
audit_path=HERE/'image_mismatch_decisions_20261028.csv';_,audit_fields,audit=workflow.read_csv(audit_path);before=json.loads((OUT/'final-verification.json').read_bytes());assert sha(audit_path)==before['audit_sha256']
corrections=json.loads((F/'followup-decisions.json').read_bytes());updates={str(x['case']):x for x in corrections['cases']};delta=[]
for row in audit:
 if row['case']not in updates:continue
 x=updates[row['case']];assert row['word']==x['word'] and row['ordered_root_ids']==json.dumps(x['ordered_root_ids'],ensure_ascii=False,separators=(',',':'))and row['current_image_sha256']==x['current_image_sha256']
 row['decision']=x['decision'];row['reason']=x['reason'];row['review_method']+='; follow-up full current b/adopted detail and targeted pixel recheck 2026-10-28';delta.append(row.copy())
assert len(delta)==12
delta_path=F/'decision-corrections.csv'
delta_buffer=io.StringIO(newline='');writer=csv.DictWriter(delta_buffer,fieldnames=audit_fields,lineterminator='\r\n');writer.writeheader();writer.writerows(delta);delta_bytes=delta_buffer.getvalue().encode('utf-8-sig')
if delta_path.exists():assert delta_path.read_bytes()==delta_bytes,'Existing correction artifact differs; preserve it.'
else:
 with delta_path.open('xb')as f:f.write(delta_bytes)
counts=dict(collections.Counter(r['decision']for r in audit));assert counts['additional_prompt_ready']==154 and counts.get('hold_identity_or_source',0)==0
population_changes=[]
baseline_multiplicity=collections.Counter(r['key']for r in inventory['records'])
for r in inventory['records']:
 candidates=pool[r['key']]
 if len(candidates)!=baseline_multiplicity[r['key']] or any(first_senses(w)[0]!=r['first_ja']for w in candidates):population_changes.append({'key':r['key'],'old_first_ja':r['first_ja'],'baseline_multiplicity':baseline_multiplicity[r['key']],'new_candidates':[first_senses(w)[0]for w in candidates]})
assert not population_changes,population_changes[:10]
assert words_path.read_bytes()==words_raw,'Public words changed during validation; read-only verification must be repeated.'
result={'completed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'delivery':{'primary_csv':str(primary),'primary_rows':152,'primary_sha256':sha(primary),'extra_two_csv':str(extra),'extra_two_rows':2,'extra_two_sha256':sha(extra),'combined_nonoverlapping_prompt_rows':154,'combined_with_unchanged_prior_four':158,'appended_to_primary':['Santa','Veronica','Princeton'],'extra_two':['Phillip','Gregory'],'original_149_byte_prefix_unchanged':True,'original_149_sha256':hashlib.sha256(original).hexdigest(),'combined_staged_154_path':str(stage),'combined_staged_154_sha256':sha(stage),'staged_154_is_not_an_additional_generation_queue':True},'blocked_action':{'operation':'atomic replacement of 152-row primary CSV with verified 154-row version','target':str(primary),'status':'denied_by_Windows_filesystem','first_error':'Node EPERM during rename of .csv.stage-tmp','retry':'One guarded retry after checking original remained 152 rows and no owner; Python os.replace returned WinError 5 access denied. No more retries or in-place overwrite.','execution_state':'Confirmed primary remains 152 rows; staged version and separate two-row CSV retain the additions.','lock_diagnostic':'Windows Restart Manager RmStartSession returned 29; no lock owner could be established. No process was stopped.','automatic_approval_review_rejection_observed':False},'corrected_original_eleven':{'new_prompts':5,'regeneration_excluded':5,'actual_meaning_conflict_hold':1,'hold_word':'epithet'},'audit_overlay':{'base_csv':str(audit_path),'base_csv_sha256':sha(audit_path),'corrections_csv':str(delta_path),'correction_rows':12,'effective_counts_after_overlay':counts,'detailed_evidence':str(F/'followup-decisions.json'),'original_audit_retained_unchanged':True},'narrow_b_recheck':{'candidates':357,'sheets':18,'additional_mismatches_beyond_original_eleven':0,'details':str(F/'targeted-b-review-results.json')},'validation':{'formal_parser':'workflow_io.read_csv, check_rows, view','exact_columns':19,'five_sections_every_row':True,'UTF8_BOM_and_CRLF':True,'unique_sense_IDs_and_casefolded_save_names':154,'current_first_Japanese_meaning_and_full_sense_digest':154,'current_unique_image_owner_and_literal_todo_filename':154,'current_PNG_SHA256_unchanged_vs_audit':154,'new_five_already_generated_staging_files':staging,'active_generation_CSV_overlaps':active,'original_owned_word_ID_rows_rechecked':len(inventory['records']),'original_population_first_Japanese_or_identity_changes':population_changes,'checks':checks,'other_historical_CSV_matches':overlaps},'earlier_all_image_audit_coverage_retained':before['coverage'],'earlier_all_image_hash_check':before['image_hash_recheck'],'current_public_words_sha256':hashlib.sha256(words_raw).hexdigest(),'input_hashes_now':input_hashes,'heads_read_only':{str(path):subprocess.check_output(['git','-C',str(path),'rev-parse','HEAD'],text=True).strip()for path in [ROOT,SOURCE]},'unchanged_by_this_followup':['all images','canonical/mother data','shared ledgers','Git working state except own prompt/audit artifacts; no pull/commit/push','original 149 prompt bytes','prior four correction CSV','earlier audit CSV']}
exclusive_json(F/'final-verification.json',result)
print(json.dumps({k:v for k,v in result.items()if k in ['completed_at','delivery','corrected_original_eleven','audit_overlay','blocked_action']},ensure_ascii=False,indent=2))
