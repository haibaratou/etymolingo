from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent
records = [json.loads(p.read_text(encoding='utf-8')) for p in sorted((root/'prompts').glob('*.json'))]
assert len(records) == 14, len(records)
font = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 17)
small = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 13)
sheet = Image.new('RGB', (1200, 1440), '#f4f1e9')
draw = ImageDraw.Draw(sheet)
inventory = []
for i, item in enumerate(records):
    path = root.parent/item['file'] if item['file'].startswith('reference_moves/') else root/item['file']
    with Image.open(path) as im:
        assert im.mode == 'RGBA', path
        alpha = im.getchannel('A')
        lo, hi = alpha.getextrema()
        assert lo == 0 and hi >= 250, (path, lo, hi)
        box = alpha.point(lambda a: 255 if a > 128 else 0).getbbox()
        assert box and box[0] > 0 and box[1] > 0 and box[2] < im.width and box[3] < im.height, (path, box)
        inventory.append({'file': item['file'], 'label_ja': item['label'], 'reference': item.get('reference', item.get('refs', [None])[-1]), 'size': list(im.size), 'mode': im.mode, 'alpha_extrema':[lo,hi], 'visible_bbox':list(box)})
        thumb = im.crop(box)
        thumb.thumbnail((276, 275), Image.Resampling.LANCZOS)
        x, y = (i % 4)*300, (i//4)*360
        sheet.paste(thumb, (x+(300-thumb.width)//2, y+12+(275-thumb.height)//2), thumb)
        draw.text((x+8,y+294), item['label'], font=font, fill='#452c22')
        draw.text((x+8,y+328), path.stem, font=small, fill='#65574e')
sheet.save(root/'contact_sheet.jpg',quality=94)
(root/'manifest.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Validated {len(inventory)} individual transparent PNGs.')
