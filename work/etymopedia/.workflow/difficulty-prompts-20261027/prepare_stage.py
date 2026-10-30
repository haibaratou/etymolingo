import csv,json,pathlib,hashlib,re,sys,collections
ROOT=pathlib.Path(r'D:\Projects\etymolingo');HERE=ROOT/'work/etymopedia';OUT=HERE/'.workflow/difficulty-prompts-20261027';SOURCE=pathlib.Path(r'D:\Projects\etymon-source');sys.path.insert(0,str(SOURCE/'tools'))
from illustration_scenes import first_senses,sense_digest
ranked=json.loads((OUT/'ranked-candidates.json').read_text(encoding='utf-8'));items=ranked['ranked'];scenes={};holds={}
for path in sorted(OUT.glob('compositions_*.tsv')):
 for line in path.read_text(encoding='utf-8').splitlines():
  if not line.strip():continue
  n,text=line.split('\t',1);n=int(n);assert n not in scenes,(n,'duplicate authored scene');scenes[n]=text
for path in sorted(OUT.glob('holds_*.json')):
 for n,text in json.loads(path.read_text(encoding='utf-8')).items():
  assert int(n)not in holds;holds[int(n)]=text
assert not set(scenes).intersection(holds)
fields=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')));assert len(fields)==19
style='Use the attached invidious.png for drawing style only. Match its thick rounded dark-brown contours, simplified rounded 2D shapes, smooth solid colors and restrained cartoon shading. Do not copy the reference subject or composition.'
rows=[];evidence=[];staging_names={p.name.casefold()for p in(HERE/'_illust').rglob('*.png')}
notation=json.loads((OUT/'notation_exceptions.json').read_text(encoding='utf-8'))
for n in sorted(scenes):
 w=items[n-1];composition=scenes[n];assert len(composition.split())>=12,(n,'incomplete composition');assert not re.search(r'(visual example of|representing this word|matching this word|plausible person|appropriate subject)',composition,re.I)
 ja,en=first_senses(w);assert ja and ja==first_senses({'ja':w['first_ja']})[0]
 row={f:''for f in fields};output='512x512 PNG, RGBA, genuine transparent background. No text, numerals, labels, logos or watermark.'
 if n==54:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential dimension marking "10 m" on each of the two measuring tapes. No other text, labels, logos or watermark.'
 if n==134:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential mass marking "1 kg" on the kilogram weight. No other text, labels, logos or watermark.'
 if n==135:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential count "1000" in the mechanical counter. No other text, labels, logos or watermark.'
 if n==225:output='512x512 PNG, RGBA, genuine transparent background. Allow only the ampersand symbol "&", which is the subject itself. No other text, numerals, labels, logos or watermark.'
 if n==310:output='512x512 PNG, RGBA, genuine transparent background. Allow only the sample letters "abc" in italic type, since the lettering itself is the subject. No other text, labels, logos or watermark.'
 if n==338:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential serial numerals "999998", "999999" and "1000000" on the tickets. No other text, labels, logos or watermark.'
 if n==377:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential chemical symbol "Ra" on the sealed specimen case. No other text, numerals, labels, logos or watermark.'
 if n==408:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential ticket serials "998", "999" and "1000". No other text, labels, logos or watermark.'
 if n==450:output='512x512 PNG, RGBA, genuine transparent background. Allow only the letters "A", "B" and "C" needed to show alphabetical order. No other text, numerals, labels, logos or watermark.'
 if n==454:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential chemical formula "NH2" for the amino group. No other text, labels, logos or watermark.'
 if n==495:output='512x512 PNG, RGBA, genuine transparent background. Allow only month numerals 1 through 12 on the calendar, which are essential to the timing concept. No other text, labels, logos or watermark.'
 if n==496:output='512x512 PNG, RGBA, genuine transparent background. Allow only essential game numerals on the bingo card. Do not print the word bingo or any other text, logos or watermark.'
 if n==499:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential statistical values "1000" and "12" beside the population and birth pictograms. No other text, labels, logos or watermark.'
 if n==511:output='512x512 PNG, RGBA, genuine transparent background. Allow only the raised Braille dot patterns, since that writing system itself is the subject. No other text, labels, logos or watermark.'
 if n==537:output='512x512 PNG, RGBA, genuine transparent background. Allow only the essential chemical symbol "Cs" on the sealed specimen case. No other text, numerals, labels, logos or watermark.'
 if str(n)in notation:output='512x512 PNG, RGBA, genuine transparent background. Allow only '+notation[str(n)]+'. No other text, numerals, labels, logos or watermark.'
 row.update({'ファイル名':w['filename'],'語義':w['ja'],'対象語義':ja,'画像生成プロンプト':f'Subject: {w["w"]}, target meaning "{ja}".\n\nComposition: {composition}\n\nStyle: {style}\n\nFraming: One compact composition, with the complete subject using about 80-90% of the square. Keep every part inside the frame.\n\nOutput: {output}','プロンプト準備状況':'作成済み','画風参照画像':'references/invidious.png','単語':w['w'],'語根ID_JSON':json.dumps(w['p'],ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':sense_digest(w['w'],w['p'],ja,en),'制作状態':'prompt_ready'})
 assert not(ROOT/'assets/word'/w['filename']).exists()
 assert w['filename'].casefold()not in staging_names
 rows.append(row);evidence.append({'candidate_rank':n,'word':w['w'],'ordered_roots':w['p'],'filename':w['filename'],'difficulty':w['difficulty'],'first_ja':ja,'source_record':w['source_record'],'specificity_review':'Individually authored concrete subject, action or physical properties and spatial relationship; Japanese target read alongside composition.'})
assert len({r['ファイル名'].casefold()for r in rows})==len(rows);assert len({(r['単語'],r['語根ID_JSON'])for r in rows})==len(rows)
target=HERE/'prompt_rows_difficulty_low_missing_20261027.csv';data={'fields':fields,'rows':rows}
if target.exists():data['expected_before_sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
(OUT/'authoring.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
progress={'phase':'authoring','requested_rows':2000,'authored_rows':len(rows),'reviewed_holds':len(holds),'reviewed_through_candidate':max([*scenes,*holds],default=0),'difficulty_distribution':dict(collections.Counter(e['difficulty']['level']for e in evidence)),'selection':evidence,'holds':[{'rank':n,'word':items[n-1]['w'],'first_ja':items[n-1]['first_ja'],'reason':holds[n]}for n in sorted(holds)],'target':str(target)}
(OUT/'progress.json').write_text(json.dumps(progress,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in progress.items()if k not in ('selection','holds')},ensure_ascii=False))
