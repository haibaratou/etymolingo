"""Read-only validation of the authored CSV; write evidence beside the deliverable.

Uses the public current words snapshot and literal approved work-list filenames.
Never reads private PIE datasets or writes source/runtime/image data.
"""
import collections,csv,datetime,hashlib,importlib.util,json,pathlib,re,subprocess,sys
ROOT=pathlib.Path(r'D:\Projects\etymolingo'); HERE=ROOT/'work/etymopedia'
OUT=HERE/'.workflow/difficulty-prompts-20261027'; SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def ident(w,p):return (w,tuple(p))
def load(p):return json.loads(p.read_text(encoding='utf-8'))
sys.path.insert(0,str(HERE));import workflow_io as workflow
specs=workflow.definitions(SOURCE)
target=HERE/'prompt_rows_difficulty_low_missing_20261027.csv'
raw,fields,rows=workflow.read_csv(target);workflow.check_rows(rows)
template=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')))
assert fields==template and len(fields)==19 and len(rows)==2000
assert raw.startswith(b'\xef\xbb\xbf') and raw.endswith(b'\r\n')
frozen=load(OUT/'image-missing-candidates.json');ranked=load(OUT/'ranked-candidates.json');progress=load(OUT/'progress.json')
assert sha(ROOT/'app/data/generated-etymon/words.json')==frozen['words_source']['sha256']
assert sha(pathlib.Path(frozen['filename_source']['path']))==frozen['filename_source']['sha256']
for source in ranked['difficulty_sources']:assert sha(ROOT/source['path'])==source['sha256'],source
words=load(ROOT/'app/data/generated-etymon/words.json');bykey=collections.defaultdict(list)
for w in words:bykey[ident(w['w'],w.get('p',[]))].append(w)
names=collections.defaultdict(set)
with pathlib.Path(frozen['filename_source']['path']).open(encoding='utf-8-sig',newline='')as stream:
 for row in csv.DictReader(stream):
  roots=json.loads(row['語根ID_JSON'])if row.get('語根ID_JSON')else(row.get('roots')or row.get('語根')or'').split('+')if(row.get('roots')or row.get('語根'))else[]
  names[ident(row['単語'],roots)].add(row['ファイル名'])
owners=collections.defaultdict(set)
for key,ww in bykey.items():
 if len(ww)==1 and len(names[key])==1 and not ww[0].get('etymology_id'):owners[next(iter(names[key])).casefold()].add(key)
official={p.name.casefold()for p in(ROOT/'assets/word').glob('*.png')}
staging={p.name.casefold()for p in(HERE/'_illust').rglob('*.png')}
text=(ROOT/'assets/word/illustration-index.js').read_text(encoding='utf-8');artindex=json.loads(text.removeprefix('globalThis.ETYMON_WORD_ART = ').strip().removesuffix(';'))
queued=set();queued_names=set();queue_evidence=[]
for src in frozen['existing_generation_csvs']:
 p=pathlib.Path(src['path']);rr=list(csv.DictReader(p.open(encoding='utf-8-sig',newline='')))
 queue_evidence.append({'path':str(p),'sha256_at_selection':src['sha256'],'sha256_now':sha(p),'records_now':len(rr)})
 for r in rr:
  fname=r.get('ファイル名')or r.get('filename');word=r.get('単語')or r.get('word')
  if fname:queued_names.add(fname.casefold())
  if word:
   try:roots=json.loads(r['語根ID_JSON'])if r.get('語根ID_JSON')else(r.get('roots')or r.get('語根')or'').split('+')if(r.get('roots')or r.get('語根'))else[];queued.add(ident(word,roots))
   except(ValueError,TypeError):pass
scenes={int(line.split('\t',1)[0]):line.split('\t',1)[1]for p in OUT.glob('compositions_*.tsv')for line in p.read_text(encoding='utf-8').splitlines()if line.strip()}
holds={int(n):reason for p in OUT.glob('holds_*.json')for n,reason in load(p).items()}
assert len(scenes)==2000 and len(holds)==350 and not(set(scenes)&set(holds))
assert set(scenes)|set(holds)==set(range(1,2351))
assert [e['candidate_rank']for e in progress['selection']]==sorted(scenes)
assert len(set(scenes.values()))==2000
issues=[];selection=[];comp_lengths=[];prompt_lengths=[];notation=[];headwords=[]
blank=['実行プロンプト','解説英語','解説日本語','画像SHA256','画像GitBlobSHA','検品日時','検品メモ','要確認理由']
for number,(r,e)in enumerate(zip(rows,progress['selection']),1):
 rank=e['candidate_rank'];v=workflow.view(r);key=ident(v['word'],v['roots']);ww=bykey[key]
 assert len(ww)==1 and not ww[0].get('etymology_id'),(number,'current identity')
 w=ww[0];expected=ranked['ranked'][rank-1];ja,en=specs.first_senses(w)
 assert r['語義']==w['ja'] and r['対象語義']==ja==specs.first_senses({'ja':expected['first_ja']})[0],(number,'first meaning')
 assert r['第一英語義']==en and r['語義SHA256']==specs.sense_digest(w['w'],w.get('p',[]),ja,en),(number,'canonical snapshot')
 assert names[key]=={v['filename']},(number,'literal approved filename')
 if owners[v['filename'].casefold()]!={key}:issues.append({'row':number,'rank':rank,'word':w['w'],'reason':'filename has another canonical owner','owners':[[x,list(y)]for x,y in owners[v['filename'].casefold()]]})
 art=artindex.get(json.dumps([w['w'],'+'.join(w.get('p',[]))],ensure_ascii=False,separators=(',',':')))
 visible=w.get('pica');available={v['filename'].casefold()}
 for stem in(art,visible):
  if stem:available.add((stem+'.png').casefold())
 if w.get('pic')and not visible:available.add((w['w']+'.png').casefold())
 if available&official:issues.append({'row':number,'rank':rank,'word':w['w'],'reason':'official image exists','filenames':sorted(available&official)})
 if available&staging:issues.append({'row':number,'rank':rank,'word':w['w'],'reason':'generated staging image exists','filenames':sorted(available&staging)})
 if key in queued or v['filename'].casefold()in queued_names:issues.append({'row':number,'rank':rank,'word':w['w'],'reason':'another generation queue exists'})
 assert r['プロンプト準備状況']=='作成済み'and r['制作状態']=='prompt_ready'
 assert all(r[x]==''for x in blank)and r['画風参照画像']=='references/invidious.png'
 prompt=v['prompt'];parts=re.split(r'\n\n(?=(?:Subject|Composition|Style|Framing|Output):)',prompt)
 assert len(parts)==5 and [p.split(':',1)[0]for p in parts]==['Subject','Composition','Style','Framing','Output']
 comp=parts[1].removeprefix('Composition: ');assert comp==scenes[rank]
 assert len(comp.split())>=12 and re.match('[A-Z0-9]',comp),(number,'composition specificity/typo')
 assert not re.search(r'(visual example of|concrete example of|subject representing|person matching|plausible person|natural scene of)',comp,re.I)
 assert '512x512 PNG, RGBA, genuine transparent background.'in parts[4]
 assert '80-90%'in parts[3]and'invidious.png'in parts[2]and'2D'in parts[2]
 if 'Allow only'in parts[4]:notation.append({'row':number,'rank':rank,'word':w['w'],'allowed':parts[4]})
 comp_lengths.append(len(comp.split()));prompt_lengths.append(len(prompt.split()));headwords.append(w['w'])
 selection.append({**e,'csv_record':number,'part_of_speech':w.get('pos',''),'source_record':expected['source_record'],'sense_sha256':r['語義SHA256'],'composition':comp,'image_checks':{'literal_filename':v['filename'],'runtime_mapped_art':art,'runtime_pica':visible,'official_absent':not(available&official),'staging_absent':not(available&staging)}})
assert len({ident(r['単語'],json.loads(r['語根ID_JSON']))for r in rows})==2000
levels=[e['difficulty']['level']for e in selection];assert levels==sorted(levels)and all(x is not None for x in levels)
repair=list(csv.DictReader((HERE/'prompt_rows_image_meaning_fixes_20261027.csv').open(encoding='utf-8-sig',newline='')))
assert not({x['ファイル名'].casefold()for x in rows}&{x['ファイル名'].casefold()for x in repair})
git={}
for name,path in [('etymolingo',ROOT),('etymon-source',SOURCE)]:
 git[name]={'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=path,text=True).strip(),'status':subprocess.check_output(['git','status','--short'],cwd=path,text=True).splitlines(),'stash_count':len(subprocess.check_output(['git','stash','list','--format=%gd'],cwd=path,text=True).splitlines())}
homographs=[e for e in selection if len([x for x in words if x['w']==e['word']])>1]
report={'schema':1,'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'passed'if not issues else'needs_resolution','path':str(target),'sha256':hashlib.sha256(raw).hexdigest(),'rows':len(rows),'columns':fields,'encoding':'UTF-8 BOM; CRLF CSV record terminators; quoted multiline prompt fields','formal_parser':'workflow_io.read_csv + check_rows + view: all 2000 rows accepted','difficulty_distribution':dict(collections.Counter(levels)),'difficulty_basis_distribution':dict(collections.Counter(e['difficulty']['basis']for e in selection)),'rated_eligible_candidates':ranked['ranked_count'],'unclassified_excluded':ranked['unclassified_excluded'],'reviewed_candidate_count':2350,'manually_held':350,'initial_exclusions':frozen['exclusions'],'composition_word_count':{'min':min(comp_lengths),'max':max(comp_lengths),'mean':sum(comp_lengths)/len(comp_lengths)},'prompt_word_count':{'min':min(prompt_lengths),'max':max(prompt_lengths)},'unique_compositions':len(set(scenes.values())),'formal_png_filenames_now':len(official),'staging_png_filenames_now':len(staging),'runtime_words_source':frozen['words_source'],'literal_filename_source':frozen['filename_source'],'difficulty_sources':ranked['difficulty_sources'],'queue_checks':queue_evidence,'notation_exceptions':notation,'homograph_checks':homographs,'git':git,'issues':issues,'scope':{'image_generation':0,'PNG_copy_or_replacement':0,'commit':0,'push':0,'pull':0,'meaning_or_paraphrase_edits':0}}
(OUT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'final-selection.json').write_text(json.dumps({'csv_sha256':report['sha256'],'selection':selection,'holds':progress['holds']},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items()if k not in('columns','queue_checks','notation_exceptions','homograph_checks','git')},ensure_ascii=False,indent=2));assert not issues,issues
