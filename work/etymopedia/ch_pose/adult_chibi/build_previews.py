"""Validate and index both ages; generate review sheets without changing original PNGs."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
PARENT = ROOT.parent
font = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 17)
small = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 13)

base_records = json.loads((PARENT/'prompts.json').read_text(encoding='utf-8'))
child_records = [dict(r, path=PARENT/r['file']) for r in base_records]
for p in sorted((PARENT/'reference_moves'/'prompts').glob('*.json')):
    r = json.loads(p.read_text(encoding='utf-8'))
    # New sadness records are relative to ch_pose; older movement records to reference_moves.
    path = PARENT/r['file'] if r['file'].startswith('reference_moves/') else PARENT/'reference_moves'/r['file']
    child_records.append(dict(r, path=path))
grown_records = []
for p in sorted((ROOT/'prompts').glob('*.json')):
    r = json.loads(p.read_text(encoding='utf-8'))
    grown_records.append(dict(r, path=PARENT/r['file']))

all_manifest = {}
for age, records in [('children', child_records), ('adult_chibi', grown_records)]:
    records.sort(key=lambda r: r['path'].name)
    assert len(records) == 30, (age, len(records))
    assert len(set(r['path'] for r in records)) == 30
    for who in ['boy', 'girl']:
        assert len([r for r in records if r['path'].name.startswith(who+'_')]) == 15
    sheet = Image.new('RGB', (1500, 1980), '#f4f1e9')
    draw = ImageDraw.Draw(sheet)
    manifest = []
    for i, item in enumerate(records):
        path = item['path']
        with Image.open(path) as im:
            assert im.mode == 'RGBA', path
            alpha = im.getchannel('A')
            lo, hi = alpha.getextrema()
            assert lo == 0 and hi >= 250, (path,lo,hi)
            box = alpha.point(lambda a: 255 if a > 128 else 0).getbbox()
            assert box and box[0] > 0 and box[1] > 0 and box[2] < im.width and box[3] < im.height, (path,box,im.size)
            manifest.append(dict(file=path.relative_to(PARENT).as_posix(), label_ja=item['label'], width=im.width, height=im.height, mode=im.mode, alpha_extrema=[lo,hi], visible_bbox=list(box)))
            thumb = im.crop(box)
            thumb.thumbnail((274, 250), Image.Resampling.LANCZOS)
            x, y = i%5*300, i//5*330
            sheet.paste(thumb,(x+(300-thumb.width)//2,y+8+(250-thumb.height)//2),thumb)
            label = item['label'].replace('大人デフォルメ・','')
            label_font = font
            for size in range(17, 11, -1):
                label_font = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', size)
                if draw.textbbox((0,0),label,font=label_font)[2] <= 284:
                    break
            draw.text((x+8,y+269),label,font=label_font,fill='#452c22')
            draw.text((x+8,y+301),path.stem,font=small,fill='#65574e')
    all_manifest[age] = manifest
    if age == 'adult_chibi':
        sheet.save(ROOT/'contact_sheet.jpg',quality=94)
        sheet.crop((0,0,1500,990)).save(ROOT/'contact_sheet_boy.jpg',quality=94)
        sheet.crop((0,990,1500,1980)).save(ROOT/'contact_sheet_girl.jpg',quality=94)
        (ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    else:
        sheet.save(PARENT/'contact_sheet_all_children.jpg',quality=94)
(PARENT/'catalog_all_ages.json').write_text(json.dumps(all_manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Validated: children 15 boy + 15 girl; adult_chibi 15 boy + 15 girl. Total 60 RGBA PNGs.')
