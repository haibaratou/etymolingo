"""Build an asset inventory and visual contact sheet; leave original PNGs untouched."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
records = json.loads((ROOT / 'prompts.json').read_text(encoding='utf-8'))
font = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 17)
small = ImageFont.truetype('C:/Windows/Fonts/meiryo.ttc', 13)
sheet = Image.new('RGB', (1200, 4 * 340), '#f4f1e9')
draw = ImageDraw.Draw(sheet)
inventory = []
for index, item in enumerate(sorted(records, key=lambda r: r['file'])):
    source = ROOT / item['file']
    with Image.open(source) as im:
        assert im.mode == 'RGBA', source
        alpha = im.getchannel('A')
        assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] >= 254, source
        box = alpha.point(lambda a: 255 if a > 128 else 0).getbbox()
        assert box and box[0] > 0 and box[1] > 0 and box[2] < im.width and box[3] < im.height, (source, box)
        inventory.append(dict(file=item['file'], label_ja=item['label'], width=im.width, height=im.height, mode=im.mode, alpha_extrema=list(alpha.getextrema()), content_bbox=list(box), anchor=[0.5, 0.95]))
        thumb = im.copy()
        thumb.thumbnail((270, 270), Image.Resampling.LANCZOS)
        x, y = (index % 4) * 300, (index // 4) * 340
        sheet.paste(thumb, (x + (300 - thumb.width)//2, y + (280 - thumb.height)//2), thumb)
        draw.text((x + 12, y + 282), item['label'], font=font, fill='#452c22')
        draw.text((x + 12, y + 310), source.stem, font=small, fill='#65574e')
sheet.save(ROOT / 'contact_sheet.jpg', quality=92)
(ROOT / 'manifest.json').write_text(json.dumps({'format':'individual transparent PNG reaction poses', 'animation_frames':False, 'images':inventory}, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Validated {len(inventory)} RGBA PNGs with real transparency and unclipped margins.')
