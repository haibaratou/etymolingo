"""Slice the generated 4 x 3 ink atlas; no artwork is drawn by this tool."""
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NAMES = ['tree', 'flame', 'wave', 'cloud', 'lightning', 'wind',
         'rock', 'claw', 'feather', 'root', 'slash', 'sun']

def main():
    source = ROOT / 'art/incoming/fx_semantic_atlas.png'
    image = Image.open(source).convert('RGB')
    manifest = []
    for i, name in enumerate(NAMES):
        col, row = i % 4, i // 4
        crop = image.crop((round(col * image.width / 4), round(row * image.height / 3),
                           round((col + 1) * image.width / 4), round((row + 1) * image.height / 3)))
        rgb = np.asarray(crop).astype(np.float32) / 255
        alpha = np.clip((1 - rgb.min(axis=2) - .04) / .96, 0, 1) ** .9
        unmatte = np.clip((rgb - (1 - alpha[..., None])) / np.maximum(alpha[..., None], .001), 0, 1)
        rgba = Image.fromarray((np.dstack([unmatte, alpha]) * 255).astype(np.uint8))
        box = rgba.getbbox()
        if box:
            rgba = rgba.crop((max(0, box[0]-6), max(0, box[1]-6),
                              min(rgba.width, box[2]+6), min(rgba.height, box[3]+6)))
        rgba.thumbnail((512, 512), Image.Resampling.LANCZOS)
        target = ROOT / f'assets/art/fx_semantic_{name}.png'
        rgba.save(target)
        manifest.append({'name': name, 'file': str(target.relative_to(ROOT)), 'size': list(rgba.size)})
    (ROOT / 'art/review/semantic-art-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(f'Imported {len(manifest)} isolated ink textures')

if __name__ == '__main__':
    main()
