import pathlib,json,csv,hashlib,sys,datetime
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=pathlib.Path(__file__).parent;FOLLOW=OUT/'followup';FOLLOW.mkdir(exist_ok=True)
TARGET=HERE/'prompt_rows_image_mismatch_supplement_20261028.csv';SOURCE=pathlib.Path(r'D:\Projects\etymon-source');sys.path.insert(0,str(SOURCE/'tools'));from illustration_scenes import first_senses,sense_digest
before=TARGET.read_bytes();fields=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')));rows=list(csv.DictReader(before.decode('utf-8-sig').splitlines(keepends=True)));backup=FOLLOW/'original_149_rows.csv'
if not backup.exists():
 assert len(rows)==149 and hashlib.sha256(before).hexdigest()=='550500344b45d3338b5b2f96bb6505d43245ed97f2965fc01d900c13fbddd9e7'
 backup.write_bytes(before)
original=list(csv.DictReader(backup.open(encoding='utf-8-sig',newline='')));assert rows[:149]==original
inputs=json.loads((FOLLOW/'append-compositions.json').read_bytes());words=json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes());todo=list(csv.DictReader((SOURCE/'tools/word-art-todo.csv').open(encoding='utf-8-sig',newline='')));selection=json.loads((OUT/'prompt-selection.json').read_bytes())['selection'];existing={(r['単語'],tuple(json.loads(r['語根ID_JSON'])))for r in rows};evidence=[]
for x in inputs:
 k=(x['w'],tuple(x['p']))
 if k in existing:continue
 pool=[w for w in words if (w['w'],tuple(w.get('p',[])))==k];assert len(pool)==1 and not pool[0].get('etymology_id');w=pool[0];ja,en=first_senses(w)
 names={r['ファイル名']for r in todo if r['単語']==w['w'] and ((r.get('語根')or'').split('+')if r.get('語根')else[])==w.get('p',[])};assert x['filename']in names,(x['w'],names)
 prompt=f'Subject: {w["w"]}, target first meaning "{ja}".\n\nComposition: {x["composition"]}\n\nStyle: Match the attached invidious.png style: thick rounded dark-brown outlines, rounded 2D shapes, smooth solid colors and restrained cartoon shading.\n\nFraming: One compact scene occupies 80-90% of the square. Keep the complete subjects and tools inside the frame.\n\nOutput: 512x512 PNG, RGBA, genuine transparent background. No text, numerals, labels, logos, watermark or checkerboard.'
 r={f:''for f in fields};r.update({'ファイル名':x['filename'],'語義':w['ja'],'対象語義':ja,'画像生成プロンプト':prompt,'プロンプト準備状況':'作成済み','画風参照画像':'references/invidious.png','単語':w['w'],'語根ID_JSON':json.dumps(w.get('p',[]),ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':sense_digest(w['w'],w.get('p',[]),ja,en),'制作状態':'prompt_ready'});rows.append(r);existing.add(k);evidence.append({**x,'current_first_ja':ja,'current_image_sha256':hashlib.sha256((ROOT/'assets/word'/x['filename']).read_bytes()).hexdigest(),'new_CSV_record':len(rows)+1})
assert len({r['ファイル名'].casefold()for r in rows})==len(rows)
(FOLLOW/'append-authoring.json').write_text(json.dumps({'fields':fields,'rows':rows,'expected_before_sha256':hashlib.sha256(before).hexdigest()},ensure_ascii=False),encoding='utf-8')
all_evidence=json.loads((FOLLOW/'append-evidence.json').read_bytes())if(FOLLOW/'append-evidence.json').exists()else[];all_evidence.extend(evidence);(FOLLOW/'append-evidence.json').write_text(json.dumps(all_evidence,ensure_ascii=False,indent=2),encoding='utf-8');print('prepared',len(rows),'appended',[x['w']for x in evidence])
