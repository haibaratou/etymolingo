import pathlib,json,csv,hashlib,sys
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=HERE/'.workflow/image-mismatch-supplement-20261028';SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses,sense_digest
cases={x['case']:x for x in json.loads((OUT/'flagged-cases.json').read_bytes())['cases']};comps={}
for x in json.loads((OUT/'unreviewed-cases.json').read_bytes())['cases']:
 cases[100000+x['scan']]={'case':100000+x['scan'],'filename':x['filename'],'current_words':[{**r,'en':r.get('en_snapshot','')} for r in x['rows']],'image_sha256':x['rows'][0]['image']['sha256'],'references':[{'source':'independent_current_pixel_review','record':x['scan'],'data':{'method':'unreviewed contact sheet, current first Japanese meaning and exact image hash'}}]}
for p in sorted(OUT.glob('compositions*.json')):
 for n,c in json.loads(p.read_bytes()).items():assert n not in comps,(n,'duplicate composition');comps[n]=c
words=json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes());pool={}
for w in words:pool.setdefault((w['w'],tuple(w.get('p',[])),w.get('etymology_id')or''),[]).append(w)
fields=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')));rows=[];evidence=[]
excluded=json.loads((OUT/'final-overrides.json').read_bytes())
style='Match only the attached invidious.png drawing style: thick rounded dark-brown outlines, simple rounded 2D shapes, smooth solid colors and restrained cartoon shading. Do not copy its characters or scene.'
for n in sorted(map(int,comps),key=lambda n:(n!=1,n)):
 if str(n) in excluded:continue
 case=cases[n];assert len(case['current_words'])==1,(n,'shared image owner requires resolution');old=case['current_words'][0];ww=pool[(old['w'],tuple(old.get('p')or[]),old.get('etymology_id')or'')];assert len(ww)==1,(n,'ambiguous canonical ID');w=ww[0];ja,en=first_senses(w)
 assert ja==first_senses(old)[0],(n,'meaning changed during preparation');assert not w.get('etymology_id'),(n,'origin requires a representation beyond formal 19 columns')
 output='512x512 PNG, RGBA, genuine transparent background. No text, numerals, labels, logos, watermark, checkerboard or solid background.'
 if n in [26,117,290,104421,105346,105387]:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential chemical atom/group symbols and bond notation in the structural formula itself. No caption, compound name, other text, logo or watermark.'
 if n in [305,440,501,584,100051,100418,100468,100097,100316,100441,101449,101493,101933,102181,102225,103601,103815,104991,105038,105331,105700,107897,107921,108004]:output='512x512 PNG, RGBA, genuine transparent background. Allow only the intrinsic notation explicitly specified in Composition. No explanatory caption, other text, logo or watermark.'
 prompt=f'Subject: {w["w"]}, target first meaning "{ja}".\n\nComposition: {comps[str(n)]}\n\nStyle: {style}\n\nFraming: One compact composition occupies about 80-90% of the square, with every subject and tool fully inside the frame.\n\nOutput: {output}'
 row={x:''for x in fields};row.update({'ファイル名':case['filename'],'語義':w['ja'],'対象語義':ja,'画像生成プロンプト':prompt,'プロンプト準備状況':'作成済み','画風参照画像':'references/invidious.png','単語':w['w'],'語根ID_JSON':json.dumps(w.get('p',[]),ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':sense_digest(w['w'],w.get('p',[]),ja,en),'制作状態':'prompt_ready'})
 rows.append(row);evidence.append({'case':n,'filename':case['filename'],'w':w['w'],'p':w.get('p',[]),'first_ja':ja,'current_image_sha256':case['image_sha256'],'composition':comps[str(n)],'sources':case['references']})
target=HERE/'prompt_rows_image_mismatch_supplement_20261028.csv';data={'fields':fields,'rows':rows}
if target.exists():data['expected_before_sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
(OUT/'authoring.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8');(OUT/'prompt-selection.json').write_text(json.dumps({'rows':len(rows),'selection':evidence},ensure_ascii=False,indent=2),encoding='utf-8');print('prepared_rows',len(rows))
