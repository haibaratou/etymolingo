#!/usr/bin/env python3
"""Pictlingo Quest の出題データ(quest-data.js)を生成する。

入力(どれも既存の正本・生成物。読み取りのみ):
  app/support/picture-words/catalog.js   … 画像と単語の対応・出題可否(availability)
  app/eigo-no-e/categories.py          … Pictpedia(辞書サイト)のテーマ分類
  app/eigo-no-e/thumbs/*.webp          … 確認済み画像の320px軽量サムネイル(あれば使う)
  assets/word/*.png                    … --thumbs のときだけ、テーマ語の軽量サムネイル作成に使う

出力:
  app/support/pictlingo-quest/quest-data.js
  app/support/pictlingo-quest/thumbs/*.webp   (--thumbs のとき。eigo-no-e に無いテーマ語の256pxサムネイル)

使い方(リポジトリのルートで):
  python app/support/pictlingo-quest/build_quest_data.py
  python app/support/pictlingo-quest/build_quest_data.py --thumbs  # テーマ語の軽量画像も作る(要 Pillow)
  python app/support/pictlingo-quest/build_quest_data.py --check   # 差分だけ確認

ルール:
  - 出題(レッスン)に使うのは catalog の availability.en.playable が true で、
    答えが英字1〜14文字の語だけ。保留・確認中の語は出題しない。
  - ガチャ・図鑑は bindingStatus が bound の全画像(出題不可の語も絵として収集できる)。
  - 解説文は description.status が reviewed のものだけ収録する。
"""
from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CATALOG = 'app/support/picture-words/catalog.js'
CATEGORIES = 'app/eigo-no-e/categories.py'
THUMBS = 'app/eigo-no-e/thumbs'
OUTPUT = 'app/support/pictlingo-quest/quest-data.js'
OWN_THUMBS = 'app/support/pictlingo-quest/thumbs'
# マップに並べるテーマの順(はじめは絵にしやすい身近なものから)。ここに無いテーマは最後に難しさ順。
THEME_ORDER = ['animals', 'food', 'body', 'clothes', 'home', 'describe', 'actions', 'nature', 'vehicles', 'places',
               'people', 'jobs', 'seasons', 'play', 'arts', 'school', 'feelings', 'things', 'society', 'basics']

SMALL = set('ぁぃぅぇぉゃゅょっ')
VOICED = re.compile(r'[がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ]')
TIER_LIMITS = [9, 12, 15, 18, 22, 27, 34]
EN_OK = re.compile(r'^[A-Za-z]{1,14}$')
KANA_OK = re.compile(r'^[ぁ-ゔー]{1,14}$')


def word_score(kana: str, en: str) -> float:
    """picture-words/difficulty.js の wordScore と同じ式(つづりの難しさ)。"""
    rep = lambda t: len(t) - len(set(t))
    return (max(len(kana) * 2, len(en) * 2) + sum(c in SMALL for c in kana) * 2
            + len(VOICED.findall(kana)) * .5 + (rep(kana) + rep(en)) * .6)


def load_catalog(root: Path) -> list[dict]:
    text = (root / CATALOG).read_text(encoding='utf-8')
    marker = 'window.PICTURE_WORDS_CATALOG ='
    start = text.index(marker) + len(marker)
    return json.loads(text[start:].strip().rstrip(';'))


def load_categories(root: Path) -> list:
    tree = ast.parse((root / CATEGORIES).read_text(encoding='utf-8'))
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(getattr(t, 'id', '') == 'CATEGORIES' for t in node.targets):
            return ast.literal_eval(node.value)
    raise SystemExit('CATEGORIES not found in ' + CATEGORIES)


def build(root: Path, make_thumbs: bool = False) -> tuple[str, dict]:
    catalog = load_catalog(root)
    thumbs_dir = root / THUMBS
    thumb_names = {p.name for p in thumbs_dir.glob('*.webp')} if thumbs_dir.is_dir() else set()
    own_dir = root / OWN_THUMBS

    words, index_of, by_en, image_sha = [], {}, {}, []
    for entry in catalog:
        en, pic = entry.get('en') or '', entry.get('pic') or ''
        image = entry.get('image') or {}
        if entry.get('bindingStatus') != 'bound' or not en or not pic or not image.get('path'):
            continue
        kana = entry.get('w') or ''
        avail = entry.get('availability') or {}
        en_ok = bool(avail.get('en', {}).get('playable')) and avail['en'].get('answer') == en and bool(EN_OK.match(en))
        ja_ok = bool(avail.get('ja', {}).get('playable')) and avail['ja'].get('answer') == kana and bool(KANA_OK.match(kana))
        desc = entry.get('description') or {}
        reviewed = desc.get('status') == 'reviewed' and desc.get('ttsAllowed') is True
        sha12 = (image.get('sha256') or '')[:12]
        thumb = f'{pic}.{sha12}' if f'{pic}.{sha12}.webp' in thumb_names else ''
        path = image['path']
        img = pic if path == f'assets/word/{pic}.png' else '/' + path
        score = word_score(kana, en)
        tier = sum(score >= limit for limit in TIER_LIMITS)
        rank = entry.get('rank') if isinstance(entry.get('rank'), int) else 99999
        ja = (entry.get('ja') or '').split('、')[0]
        flags = (1 if en_ok else 0) | (2 if ja_ok else 0) | (4 if reviewed else 0)
        row = [entry['id'], en, kana, ja, img, thumb, flags, tier, rank, round(score, 1)]
        if reviewed:
            row += [desc.get('ja', ''), desc.get('en', '')]
        image_sha.append(sha12)
        index_of[entry['id']] = len(words)
        by_en.setdefault(en, []).append(len(words))
        words.append(row)

    def resolve(token: str) -> int | None:
        if token in index_of:
            return index_of[token]
        cands = [i for i in by_en.get(token, []) if words[i][6] & 1]
        if not cands:
            return None
        return min(cands, key=lambda i: words[i][8])

    themes, theme_words, missing = [], set(), []
    for cid, ja, en, icon, subs in load_categories(root):
        out_subs = []
        for sid, sja, sen, tokens in subs:
            ids = []
            for token in tokens.split():
                i = resolve(token)
                if i is None or not (words[i][6] & 1):
                    missing.append(token)
                    continue
                if i not in ids:
                    ids.append(i)
            if len(ids) >= 3:
                out_subs.append({'id': sid, 'ja': sja, 'en': sen, 'w': ids})
                theme_words.update(ids)
        if out_subs:
            icon_i = resolve(icon)
            avg = sum(words[i][9] for s in out_subs for i in s['w']) / sum(len(s['w']) for s in out_subs)
            themes.append({'id': cid, 'ja': ja, 'en': en, 'icon': icon_i if icon_i is not None else out_subs[0]['w'][0],
                           'subs': out_subs, 'avg': round(avg, 2)})
    order = {cid: n for n, cid in enumerate(THEME_ORDER)}
    themes.sort(key=lambda t: (order.get(t['id'], len(order)), t['avg']))

    # eigo-no-e に軽量サムネイルが無いテーマ語は、自前の256pxサムネイルを使う(--thumbs で作成)
    made = 0
    for i in sorted(theme_words):
        row = words[i]
        if row[5]:
            continue
        pic = row[4] if not row[4].startswith('/') else Path(row[4]).stem
        src = root / (row[4][1:] if row[4].startswith('/') else f'assets/word/{row[4]}.png')
        sha12 = image_sha[i]
        name = f'{pic}.{sha12}.webp'
        if make_thumbs and not (own_dir / name).exists() and src.exists():
            from PIL import Image  # 必要なときだけ
            own_dir.mkdir(parents=True, exist_ok=True)
            with Image.open(src) as im:
                im = im.convert('RGBA'); im.thumbnail((256, 256), Image.Resampling.LANCZOS)
                im.save(own_dir / name, 'WEBP', quality=80, method=4)
            made += 1
        if (own_dir / name).exists():
            row[5] = 'q:' + name[:-5]

    # テーマ外の出題可能語: 探検ユニット用。よく使う(rank小)・短い語から。
    explore = sorted((i for i, w in enumerate(words) if w[6] & 1 and i not in theme_words),
                     key=lambda i: (words[i][8] // 100, words[i][9], words[i][8]))

    data = {
        'schema': 1,
        'fields': ['id', 'en', 'kana', 'ja', 'img', 'thumb', 'flags', 'tier', 'rank', 'score', 'capJa', 'capEn'],
        'counts': {'words': len(words), 'playableEn': sum(1 for w in words if w[6] & 1),
                   'themes': len(themes), 'themeWords': len(theme_words), 'explore': len(explore),
                   'thumbs': sum(1 for w in words if w[5])},
        'words': words,
        'themes': themes,
        'explore': explore,
    }
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    script = ('// Generated by build_quest_data.py from picture-words/catalog.js + eigo-no-e/categories.py. Do not edit.\n'
              f'window.PQ_DATA={body};\n')
    report = dict(data['counts'], missingThemeTokens=len(missing), thumbsMade=made)
    return script, report


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--root', type=Path, default=ROOT)
    ap.add_argument('--check', action='store_true', help='書き込まずに、出力が最新かだけ確かめる')
    ap.add_argument('--thumbs', action='store_true', help='テーマ語の軽量サムネイル(256px WebP)も作る。要 Pillow')
    args = ap.parse_args()
    script, report = build(args.root, make_thumbs=args.thumbs and not args.check)
    out = args.root / OUTPUT
    print(json.dumps(report, ensure_ascii=False))
    if args.check:
        same = out.exists() and out.read_text(encoding='utf-8') == script
        print('up to date' if same else 'OUTDATED: rerun without --check')
        return 0 if same else 1
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(script, encoding='utf-8', newline='\n')
    print(f'wrote {OUTPUT} ({len(script.encode()) // 1024} KB)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
