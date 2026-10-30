import csv,json,pathlib,sys
ROOT=pathlib.Path(r'D:\Projects\etymolingo');SOURCE=pathlib.Path(r'D:\Projects\etymon-source');sys.path.insert(0,str(SOURCE/'tools'))
from illustration_scenes import first_senses,sense_digest
HERE=ROOT/'work/etymopedia';OUT=HERE/'.workflow/caption-import-20261027'
fields=next(csv.reader((HERE/'etymopedia_sample/prompt_rows_template.csv').open(encoding='utf-8-sig',newline='')))
audit=json.loads((OUT/'audit-current-policy.json').read_text(encoding='utf-8'));words=json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes())
scenes={
 'biker.png':'Show one adult wearing a closed motorcycle helmet, seated on a red motorcycle in a clear side view. Make the fuel tank, engine block, exhaust pipe, two thick tires and foot pegs visible. The rider holds the handlebars with both hands and rests both boots on the pegs. Do not draw bicycle pedals.',
 'plugin.png':'Show a laptop displaying a simple painting application with a small landscape canvas. A mouse pointer drags one compact extra brush-tool panel into an empty slot along the application window, adding a new paintbrush tool beside the existing palette. Use only clear brush and color icons, with no written labels, and no physical circuit board or electronic plug.',
 'coupe.png':'Show one blue two-door coupe car in a clear three-quarter side view. Give it a continuous fixed hard roof, a compact passenger cabin, one long door on each side and a short rear deck. Keep both near-side wheels and the entire roof visible. Do not draw a convertible, drinking glass or extra vehicle.',
 'gemstone.png':'Show a single rough piece of rock bearing several naturally grown purple mineral crystals suitable for cutting into jewelry. Show uneven crystal tips, broken raw surfaces and gray rock matrix attached around the base. Keep the specimen unpolished and unmounted. Do not show faceted cut jewels, rings or a jewelry display case.'
}
style='Use the attached invidious.png for drawing style only. Match its thick rounded dark-brown contours, simplified rounded 2D shapes, smooth solid colors and restrained cartoon shading. Do not copy the reference subject or composition.'
rows=[];evidence=[]
for rec in audit['rows']:
 if rec['filename']not in scenes:continue
 matches=[w for w in words if w['w']==rec['word']and w.get('p',[])==rec['roots']and w.get('etymology_id','')==rec.get('etymology_id','')];assert len(matches)==1;w=matches[0];ja,en=first_senses(w)
 r={field:''for field in fields};r.update({'ファイル名':rec['filename'],'語義':w['ja'],'対象語義':ja,'画像生成プロンプト':f'Subject: {w["w"]}, target meaning "{ja}".\n\nComposition: {scenes[rec["filename"]]}\n\nStyle: {style}\n\nFraming: One compact composition, with the complete subject using about 80-90% of the square. Keep every part inside the frame.\n\nOutput: 512x512 PNG, RGBA, genuine transparent background. No text, numerals, labels, logos or watermark.','プロンプト準備状況':'作成済み','画風参照画像':'references/invidious.png','単語':w['w'],'語根ID_JSON':json.dumps(w.get('p',[]),ensure_ascii=False,separators=(',',':')),'第一英語義':en,'語義SHA256':sense_digest(w['w'],w.get('p',[]),ja,en,w.get('etymology_id')),'制作状態':'prompt_ready'})
 rows.append(r);evidence.append({'filename':rec['filename'],'reason':rec['image_revision_reason'],'current_first_ja':ja,'old_image_sha256':rec['official_sha256'],'source_csv':rec['csv'],'source_record':rec['record']})
assert len(rows)==4
(OUT/'repair-authoring.json').write_text(json.dumps({'fields':fields,'rows':rows},ensure_ascii=False),encoding='utf-8')
(OUT/'repair-selection.json').write_text(json.dumps({'rows':evidence,'paraphrase_policy':'en is an independent snapshot and is not used to decide image revisions.'},ensure_ascii=False,indent=2),encoding='utf-8')
