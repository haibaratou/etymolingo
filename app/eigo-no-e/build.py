#!/usr/bin/env python3
"""えいごのえ(試作) のデータとサムネイルを作る。

    python3 app/eigo-no-e/build.py              # データ + サムネイル
    python3 app/eigo-no-e/build.py --no-thumbs  # データだけ

入力(読むだけ):
  app/eigo-no-e/categories.py                   カテゴリーと所属する語(人が編集する)
  app/eigo-no-e/wordnet-notes.json              英語の説明・類義語・上位語(あいまい検索用。WordNet 3.0 由来)
  app/data/generated-etymon/words.json          語義・品詞・レア度
  app/data/generated-etymon/illustration-scenes.json  照合済みの場面文(あれば検索に使う)
  assets/word/illustration-index.js             (語, 語根) → 絵のファイル名
出力:
  app/eigo-no-e/data.js       window.EIGO_NO_E = {...}  (file:// でも動く)
  app/eigo-no-e/thumbs/*.webp 一覧用の小さな絵
"""
import argparse, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
ROOT = os.path.dirname(APP)
GEN = os.path.join(APP, 'data', 'generated-etymon')
ART_DIR = os.path.join(ROOT, 'assets', 'word')
THUMB_DIR = os.path.join(HERE, 'thumbs')
sys.path.insert(0, HERE)
from categories import CATEGORIES, JA_OVERRIDE, JA_KANA  # noqa: E402


def load(path, default=None):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        if default is None:
            raise
        return default


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--thumb', type=int, default=320)
    ap.add_argument('--no-thumbs', action='store_true')
    a = ap.parse_args()

    words = load(os.path.join(GEN, 'words.json'))
    notes = load(os.path.join(HERE, 'wordnet-notes.json'), {})
    scenes = load(os.path.join(GEN, 'illustration-scenes.json'), {'entries': []}).get('entries', [])
    scene_by = {s['art']: s['scene'] for s in scenes if s.get('status') == 'reviewed'}
    src = open(os.path.join(ART_DIR, 'illustration-index.js'), encoding='utf-8').read()
    art_index = json.loads(src[src.index('{'):src.rindex('}') + 1])
    files = {f[:-4] for f in os.listdir(ART_DIR) if f.endswith('.png')}

    # 絵ID → 語。台帳 (語, 語根) を優先し、無ければ「語.png」をその綴りで一番よく使う語に当てる
    def key(x):
        return json.dumps([x['w'], '+'.join(x.get('p') or [])], ensure_ascii=False, separators=(',', ':'))
    claimed = {art_index[key(x)] for x in words if art_index.get(key(x)) in files}
    by_art, by_spell = {}, {}
    for x in sorted(words, key=lambda x: x.get('r') or 99999):
        art = art_index.get(key(x)) or (x['w'] if x['w'] in files and x['w'] not in claimed else None)
        if not art or art not in files or art in by_art:
            continue
        by_art[art] = x
        by_spell.setdefault(x['w'], art)  # よく使うほうが先に入る

    out, cats, missing = {}, [], []
    for cid, ja, en, icon, subs in CATEGORIES:
        sub_out = []
        for sid, sja, sen, toks in subs:
            full = f'{cid}/{sid}'
            n = 0
            for t in toks.split():
                art = t if '@' in t else by_spell.get(t)
                if not art or art not in by_art:
                    missing.append(t)
                    continue
                x = by_art[art]
                o = out.get(art)
                if not o:
                    o = out[art] = {'id': art, 'w': x['w'], 'ja': JA_OVERRIDE.get(x['w'], x.get('ja', '')),
                                    'pos': x.get('pos', ''), 'r': x.get('r') or 99999, 'c': []}
                    nt = notes.get(art) or {}
                    if nt.get('d'):
                        o['d'] = nt['d']
                    kana = JA_KANA.get(x['w']) if x['w'] in JA_OVERRIDE else x.get('ja_kana')
                    if kana:
                        o['k'] = kana
                    for k2 in ('syn', 'h', 'rel'):
                        if nt.get(k2):
                            o[k2] = nt[k2]
                    if art in scene_by:
                        o['scene'] = scene_by[art]
                if full not in o['c']:
                    o['c'].append(full)
                    n += 1
            sub_out.append({'id': sid, 'ja': sja, 'en': sen, 'n': n})
        icon_art = icon if '@' in icon else by_spell.get(icon)
        cats.append({'id': cid, 'ja': ja, 'en': en, 'icon': icon_art if icon_art in out else None, 'subs': sub_out})

    data = {'schema': 2, 'total_art': len(by_art), 'categories': cats,
            'words': sorted(out.values(), key=lambda o: o['r'])}
    with open(os.path.join(HERE, 'data.js'), 'w', encoding='utf-8') as f:
        f.write('// build.py が生成。手で直さない。\nwindow.EIGO_NO_E=')
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print(f'words: {len(out)} / illustrated: {len(by_art)} / categories: {len(cats)}', file=sys.stderr)
    if missing:
        print('絵が無いので外した語:', ' '.join(sorted(set(missing))), file=sys.stderr)

    if a.no_thumbs:
        return
    from PIL import Image
    os.makedirs(THUMB_DIR, exist_ok=True)
    made = 0
    for o in out.values():
        dst = os.path.join(THUMB_DIR, o['id'] + '.webp')
        srcp = os.path.join(ART_DIR, o['id'] + '.png')
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(srcp):
            continue
        im = Image.open(srcp).convert('RGBA')
        im.thumbnail((a.thumb, a.thumb), Image.LANCZOS)
        im.save(dst, 'WEBP', quality=82, method=4)
        made += 1
    print('thumbs made:', made, file=sys.stderr)


if __name__ == '__main__':
    main()
