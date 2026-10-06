"""Encode Android-only WebP derivatives; canonical PNGs are never modified."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json, sys, shutil

base = Path(__file__).resolve().parent
root = base.parent.parent
out = base / 'www'
cache = base / 'artifacts' / 'webp-q90-m4-v1'
cache.mkdir(parents=True, exist_ok=True)
rows = json.loads((out / 'image-input.json').read_text(encoding='utf-8'))

def convert(w):
    source = root / w['image']['path']
    source_sha = w['image']['sha256']
    if hashlib.sha256(source.read_bytes()).hexdigest() != source_sha:
        raise ValueError('Source image mismatch: ' + w['id'])
    target = cache / (source_sha + '.webp')
    with Image.open(source) as original:
        rgba = original.convert('RGBA')
        if not target.exists():
            rgba.save(target, format='WEBP', quality=90, method=4, exact=True)
        with Image.open(target) as decoded:
            decoded.load()
            if decoded.size != rgba.size or ImageChops.difference(decoded.convert('RGBA').getchannel('A'), rgba.getchannel('A')).getbbox():
                raise ValueError('Size or transparency changed: ' + w['id'])
        width, height = rgba.size
    payload = target.read_bytes()
    sha = hashlib.sha256(payload).hexdigest()
    rel = 'assets/pictlingo/' + sha + '.webp'
    destination = out / rel
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(target, destination)
    return w['id'], dict(path=rel, sha256=sha, sourceSha256=source_sha, bytes=len(payload), width=width, height=height, mime='image/webp', quality=90)

images = {}
with ThreadPoolExecutor(max_workers=4) as executor:
    for index, (word_id, metadata) in enumerate(executor.map(convert, rows), 1):
        images[word_id] = metadata
        if index % 100 == 0:
            print(f'WebP: {index}/{len(rows)}', flush=True)
(out / 'image-derivatives.json').write_text(json.dumps(images, ensure_ascii=False), encoding='utf-8')
print(json.dumps(dict(images=len(images), bytes=sum(v['bytes'] for v in images.values()))), flush=True)
