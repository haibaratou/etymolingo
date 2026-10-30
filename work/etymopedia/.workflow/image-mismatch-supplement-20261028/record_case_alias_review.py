import pathlib,json,csv,datetime
OUT=pathlib.Path(__file__).parent;ROOT=pathlib.Path(r'D:\Projects\etymolingo');SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
load=lambda n:json.loads((OUT/n).read_bytes());d=load('current-image-population.json');a=load('case-insensitive-bindings.json');todo=list(csv.DictReader((SOURCE/'tools/word-art-todo.csv').open(encoding='utf-8-sig')));keys={r['key']for r in d['records']}
for x in a:
 if x['key']in keys:continue
 w=x['word'];names=sorted({r['ファイル名']for r in todo if r['単語']==w['w'] and (r.get('語根')or'').split('+')==w.get('p',[])})
 if not w.get('p'):names=sorted({r['ファイル名']for r in todo if r['単語']==w['w'] and not r.get('語根')})
 d['records'].append({'key':x['key'],'source_record':next(i for i,z in enumerate(json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes()))if z['w']==w['w'] and z.get('p',[])==w.get('p',[])),'w':w['w'],'p':w.get('p',[]),'etymology_id':w.get('etymology_id')or'','ja':w['ja'],'first_ja':w['ja'].split('、')[0],'en_snapshot':w.get('en',''),'pos':w.get('pos',''),'filename':x['actual_filename'],'runtime_referenced':True,'runtime_filename_case_alias':x['runtime_filename'],'literal_names':names,'image':d['all_PNG_fingerprints'][x['actual_filename']],'exact_reviewed_caption_records':0,'caption_samples':[],'exact_historical_pixel_reviews':[],'flagged_by_any_register':w['w']=='Reading','fresh_case_alias_review':'Walker.png full pixels show a pedestrian; Reading.png full pixels show a female portrait, incompatible with reading action'})
 keys.add(x['key'])
names={r['filename']for r in d['records']};d['unreferenced_PNGs']=sorted(set(d['all_PNG_fingerprints'])-names);d['counts'].update({'current_imaged_word_IDs':len(d['records']),'current_referenced_PNGs':len(names),'runtime_referenced_word_rows':sum(r['runtime_referenced']for r in d['records']),'unreferenced_PNGs':len(d['unreferenced_PNGs']),'no_reusable_visual_evidence_rows':sum(not(r['exact_reviewed_caption_records']or r['exact_historical_pixel_reviews'])for r in d['records']),'register_flagged_current_rows':sum(r['flagged_by_any_register']for r in d['records'])});d['final_binding_case_note']='Two Windows case-insensitive bindings were added after exact-case audit: Reading/reading and walker/Walker. No actual file or shared index was renamed.'
(OUT/'current-image-population.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
f=load('flagged-cases.json')
for c in f['cases']:
 if c['case']==418:c['filename']='Reading.png';c['runtime_case_alias']='reading.png'
(OUT/'flagged-cases.json').write_text(json.dumps(f,ensure_ascii=False,indent=2),encoding='utf-8');print(d['counts'])
