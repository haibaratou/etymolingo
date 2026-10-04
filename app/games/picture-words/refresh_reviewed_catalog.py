"""Refresh the playable Picture Words pool from exact reviewed public scenes.

The existing build_catalog.py remains the authority for eligibility, readings,
homograph selection and IDs. This producer only filters its rows, verifies the
current bilingual/image bindings, and adds immutable lazy PNG snapshots.
"""
from __future__ import annotations
import argparse
import base64
from collections import Counter, defaultdict
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import sys
import unicodedata

sys.dont_write_bytecode = True
GAME = Path('app/games/picture-words')
WORDS = Path('app/data/generated-etymon/words.json')
SCENES = Path('app/data/generated-etymon/illustration-scenes.json')
INDEX = Path('assets/word/illustration-index.js')
MANIFEST = Path('app/data/generated-etymon/manifest.json')
HTML = Path('app/games/picture-words.html')
REPORT = 'reviewed-catalog-report.json'


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def git_blob_sha(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def json_bytes(data, pretty=False):
    return (json.dumps(data, ensure_ascii=False, indent=2 if pretty else None,
                       separators=None if pretty else (',', ':')) + '\n').encode()


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def normalize(text):
    return ' '.join(unicodedata.normalize('NFKC', text).translate(
        str.maketrans({'’': "'", '‘': "'", '‐': '-', '‑': '-'})).split())


def first_senses(word):
    return normalize(word['ja'].split('、')[0]), normalize(word['en'].split(' / ')[0])


def sense_digest(w, roots, ja, en):
    value = [normalize(w), roots, normalize(ja), normalize(en)]
    return sha256(json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode())


def english_word_count(text):
    return len(re.findall(r"[\w]+(?:['-][\w]+)*", normalize(text)))


def includes_headword(text, headword):
    pattern = r'(?<!\w)' + re.escape(normalize(headword)).replace(r'\ ', r'\s+') + r'(?!\w)'
    return bool(re.search(pattern, normalize(text), re.I))


def scene_identity(entry):
    return entry['w'], tuple(entry['p']), entry['art']


def row_identity(row):
    roots = row.get('roots', row.get('sceneBinding', {}).get('p', []))
    return row['en'], tuple(roots), row['pic']


def read_previous_catalog(path):
    if not path.is_file():
        return []
    text = path.read_text(encoding='utf-8-sig')
    match = re.search(r'window\.PICTURE_WORDS_CATALOG\s*=\s*', text)
    if not match:
        raise ValueError('Previous catalog lacks the expected data assignment')
    rows, _ = json.JSONDecoder().raw_decode(text[match.end():])
    if not isinstance(rows, list) or len({r['id'] for r in rows}) != len(rows):
        raise ValueError('Previous catalog has invalid or duplicate IDs')
    return rows


def load_normal_builder(root):
    path = root / GAME / 'build_catalog.py'
    spec = importlib.util.spec_from_file_location('picture_words_normal_builder', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_inventory(root, manifest_path=None):
    """An optional Git inventory supports a sparse QA checkout without fake PNGs.

    Every emitted image still must exist and pass both byte hashes. In a normal
    complete checkout, the default scans the actual assets/word directory.
    """
    if manifest_path is None:
        return {p.stem: p for p in sorted((root / 'assets/word').glob('*.png'))}
    payload = read_json(manifest_path)
    if payload.get('schema') != 1 or not isinstance(payload.get('entries'), list):
        raise ValueError('Unsupported inventory schema')
    result = {}
    for entry in payload['entries']:
        rel = entry['path']
        if not re.fullmatch(r'assets/word/[^/\\]+\.png', rel) or '..' in Path(rel).parts:
            raise ValueError('Unsafe inventory path')
        p = root / rel
        if p.stem in result:
            raise ValueError('Duplicate inventory filename')
        result[p.stem] = p
    return result


def validate_manifest(root, words_raw, scenes_raw):
    manifest = read_json(root / MANIFEST)
    for name, path, raw in [('words', WORDS, words_raw), ('illustration_scenes', SCENES, scenes_raw)]:
        item = manifest.get('files', {}).get(name, {})
        if (item.get('file') != path.name or item.get('sha256') != sha256(raw)
                or item.get('bytes') != len(raw)):
            raise ValueError('Stale public manifest binding: ' + name)
    return manifest


def validate_hash_bound_line_endings(path, raw):
    if b'\r\n' in raw:
        raise ValueError('CRLF line endings in hash-bound input ' + Path(path).as_posix() +
                         '. Save this file with LF line endings without changing its content, '
                         'following the repository .gitattributes policy, then rerun the refresh. '
                         'Automatic newline conversion could make published metadata inconsistent.')


def validate_scene(entry, binding, root):
    """Return (reason, detail, bytes), excluding only the affected candidate."""
    try:
        if entry.get('status') != 'reviewed' or entry.get('review', {}).get('status') != 'reviewed':
            return 'scene_not_reviewed', 'Both exported and editorial status must be reviewed', None
        if not all(entry['review'].get(k) for k in ('reviewed_at', 'method', 'notes')):
            return 'missing_review_evidence', 'Visual review evidence is incomplete', None
        w, p, art = entry['w'], entry['p'], entry['art']
        if not isinstance(w, str) or not isinstance(p, list) or not all(isinstance(x, str) for x in p):
            return 'invalid_scene_identity', 'Invalid word/root types', None
        if w != binding.get('w') or p != binding.get('p'):
            return 'stale_identity', 'Exact word and ordered roots no longer match', None
        if not re.fullmatch(r'[A-Za-z0-9_@-]+', art):
            return 'invalid_image_path', 'Unsafe artwork stem', None
        s = entry['sense']
        if s.get('index') != 0 or (normalize(s['ja']), normalize(s['en'])) != first_senses(binding):
            return 'stale_sense', 'First Japanese/English meaning no longer matches', None
        if s.get('sha256') != sense_digest(w, p, s['ja'], s['en']):
            return 'stale_sense_digest', 'First-sense fingerprint differs', None
        en, ja = entry['scene']['en'], entry['scene']['ja']
        if not isinstance(en, str) or not isinstance(ja, str) or not normalize(en) or not normalize(ja):
            return 'missing_bilingual_caption', 'Both language captions are required', None
        if not includes_headword(en, w):
            return 'missing_exact_headword', 'English caption lacks the exact headword', None
        if english_word_count(en) > 18:
            return 'caption_too_long', 'English caption exceeds 18 words', None
        if (len(re.findall(r'[.!?](?:["\u201d\u2019])?(?:\s|$)', normalize(en))) > 1
                or len(re.findall(r'[。！？]', normalize(ja))) > 1):
            return 'multiple_caption_sentences', 'Use one phrase or sentence per language', None
        bare = re.sub(r'[.!?]+$', '', normalize(en)).strip().casefold()
        head = normalize(w).casefold()
        if bare in {head, 'a ' + head, 'an ' + head, 'the ' + head,
                    'this is ' + head, 'this is a ' + head, 'this is an ' + head}:
            return 'headword_only_caption', 'Caption adds no visual detail', None
        image = entry['image']
        if (image['path'] != 'assets/word/' + art + '.png'
                or not re.fullmatch(r'[0-9a-f]{64}', image['sha256'])
                or not re.fullmatch(r'[0-9a-f]{40}', image['git_blob_sha'])):
            return 'invalid_image_binding', 'Invalid canonical image path or hashes', None
        path = root / image['path']
        if not path.is_file():
            return 'missing_image', image['path'], None
        raw = path.read_bytes()
        if sha256(raw) != image['sha256'] or git_blob_sha(raw) != image['git_blob_sha']:
            return 'stale_image', 'Current PNG bytes differ from the accepted image', None
        if not raw.startswith(b'\x89PNG\r\n\x1a\n') or len(raw) < 24 or raw[12:16] != b'IHDR':
            return 'invalid_png', 'Accepted bytes are not a PNG with an IHDR', None
        return None, None, raw
    except (KeyError, TypeError, ValueError, AttributeError) as error:
        return 'invalid_scene_schema', type(error).__name__, None


def produce(root, inventory_path=None, previous_catalog=None):
    root = Path(root)
    normal = load_normal_builder(root)
    words_raw, scenes_raw, index_raw = ((root / p).read_bytes() for p in (WORDS, SCENES, INDEX))
    for path, raw in [(WORDS, words_raw), (SCENES, scenes_raw), (INDEX, index_raw)]:
        validate_hash_bound_line_endings(path, raw)
    validate_manifest(root, words_raw, scenes_raw)
    words, payload = json.loads(words_raw), json.loads(scenes_raw)
    if payload.get('schema') != 1 or not isinstance(payload.get('entries'), list):
        raise ValueError('Unsupported reviewed-scene schema')
    canonical = defaultdict(list)
    for word in words:
        canonical[word['w'], tuple(word.get('p', []))].append(word)
    scenes = {}
    for entry in payload['entries']:
        try:
            key = scene_identity(entry)
        except (KeyError, TypeError):
            raise ValueError('Invalid scene identity') from None
        if key in scenes:
            raise ValueError('Duplicate scene identity: ' + repr(key))
        scenes[key] = entry
    inventory = read_inventory(root, inventory_path)
    rows = normal.build_catalog(words, read_json(root / 'app/data/generated-etymon/word-suika-ja.json'),
                                inventory, normal.read_art_index(root / INDEX), normal.read_ledger([]))
    previous = read_previous_catalog(previous_catalog or root / GAME / 'catalog.js')
    prior_by_identity = {row_identity(r): r for r in previous}
    included, excluded, assets = [], [], {}
    for original in rows:
        row = copy.deepcopy(original)
        reason, detail, raw = None, None, None
        binding = row.get('sceneBinding')
        if not row.get('updatedArt'):
            reason = 'art_not_completed_after_cutoff'
        elif row.get('reviewStatus'):
            reason, detail = 'normal_readiness_gate', row['reviewStatus']
        elif not re.fullmatch(r'[ぁ-ゔー]{2,14}', row.get('w', '')):
            reason = 'normal_kana_gate'
        elif not binding:
            reason = 'no_exact_scene_binding'
        else:
            candidates = canonical.get((binding['w'], tuple(binding['p'])), [])
            if len(candidates) != 1:
                reason = 'ambiguous_canonical_binding'
            elif binding != {k: candidates[0].get(k, [] if k == 'p' else '') for k in ('w', 'p', 'ja', 'en')}:
                reason = 'stale_canonical_binding'
            elif binding['w'] != row['en'] or ('roots' in row and row['roots'] != binding['p']):
                reason = 'row_binding_mismatch'
            else:
                entry = scenes.get((binding['w'], tuple(binding['p']), row['pic']))
                if entry is None:
                    reason = 'no_reviewed_scene'
                else:
                    reason, detail, raw = validate_scene(entry, binding, root)
                    if reason is None and row.get('imageRevision', entry['image']['sha256']) != entry['image']['sha256']:
                        reason = 'stale_image_revision'
        if reason:
            item = {'id': row['id'], 'w': row['en'], 'p': row.get('roots', binding.get('p', []) if binding else []),
                    'art': row['pic'], 'reason': reason}
            if detail:
                item['detail'] = detail
            excluded.append(item)
            continue
        prior = prior_by_identity.get(row_identity(row))
        if prior and prior['id'] != row['id']:
            raise ValueError('Normal builder changed a stable ID: ' + row['id'])
        reviewed = {'schema': 1, 'status': 'reviewed', **{k: copy.deepcopy(entry[k]) for k in ('w', 'p', 'art')}}
        reviewed['sense'] = {k: entry['sense'][k] for k in ('index', 'ja', 'en', 'sha256')}
        reviewed['scene'] = {k: entry['scene'][k] for k in ('en', 'ja')}
        reviewed['image'] = {k: entry['image'][k] for k in ('path', 'sha256', 'git_blob_sha')}
        row['reviewedScene'] = reviewed
        filename = entry['art'] + '@' + entry['image']['sha256'] + '.js'
        row['sceneAsset'] = 'picture-words/scene-assets/' + filename
        packed = {'mime': 'image/png', 'base64': base64.b64encode(raw).decode('ascii')}
        code = '(window.PICTURE_WORDS_SCENE_ASSETS ||= {})[' + json.dumps(entry['image']['sha256']) + '] = '
        assets['scene-assets/' + filename] = (code + json.dumps(packed, separators=(',', ':')) + ';\n').encode()
        included.append(row)
    if not included:
        raise ValueError('No verified playable scenes; refusing an empty refresh')
    # Keep the surviving old route in its old order; append new IDs in normal-builder order.
    prior_order = {r['id']: i for i, r in enumerate(previous)}
    normal_order = {r['id']: i for i, r in enumerate(rows)}
    included.sort(key=lambda r: (0, prior_order[r['id']]) if r['id'] in prior_order else (1, normal_order[r['id']]))
    meta = {'schema': 1, 'sourceWordsSha256': sha256(words_raw), 'scenesSha256': sha256(scenes_raw),
            'indexSha256': sha256(index_raw), 'count': len(included)}
    header = '// Generated by refresh_reviewed_catalog.py; exact reviewed playable scenes only.\n'
    text = header + 'window.PICTURE_WORDS_CATALOG_META = ' + json.dumps(meta, separators=(',', ':')) + ';\n'
    text += 'window.PICTURE_WORDS_CATALOG = [\n' + ',\n'.join(
        '  ' + json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in included) + '\n];\n'
    emitted = {scene_identity(r['reviewedScene']) for r in included}
    excluded_by_identity = {(r['w'], tuple(r['p']), r['art']): r['reason'] for r in excluded}
    scene_exclusions = []
    for key, entry in sorted(scenes.items()):
        if key in emitted:
            continue
        reason = excluded_by_identity.get(key)
        if not reason:
            matches = canonical.get(key[:2], [])
            reason = ('normal_word_or_POS_gate' if len(matches) == 1 and not normal.eligible(matches[0])
                      else 'not_selected_by_normal_art_date_or_homograph_rules')
        scene_exclusions.append({'w': key[0], 'p': list(key[1]), 'art': key[2], 'reason': reason})
    input_paths = [WORDS, SCENES, INDEX, GAME / 'build_catalog.py', GAME / 'updated-art.json',
                   GAME / 'readiness-review.json', GAME / 'image-revisions.json',
                   Path('app/data/generated-etymon/word-suika-ja.json'), Path('app/data/ja/ja_index.json')]
    report = {'schema': 1, 'meta': meta, 'normalCatalogRows': len(rows), 'emittedRows': len(included),
              'excludedRowsCount': len(excluded), 'sceneEntries': len(scenes),
              'verifiedPngs': len(included), 'lazyAssets': len(assets),
              'lazyAssetBytes': sum(len(b) for b in assets.values()),
              'ordering': 'Surviving existing IDs in previous order; new IDs appended in normal-builder order',
              'inputHashes': {p.as_posix(): sha256((root / p).read_bytes()) for p in input_paths},
              'inventoryNamesSha256': sha256(json_bytes(sorted(p.name for p in inventory.values()))),
              'exclusionCounts': dict(sorted(Counter(e['reason'] for e in excluded).items())),
              'excludedRows': excluded, 'sceneExclusions': scene_exclusions}
    files = {'catalog.js': text.encode(), REPORT: json_bytes(report, pretty=True), **assets}
    return files, report


def bind_catalog_html(html_raw, catalog_raw):
    """Replace only the existing catalog script's v value, preserving other bytes."""
    pattern = rb'''(<script\b[^>]*?\bsrc\s*=\s*["']picture-words/catalog\.js\?v=)([^"'&\s<>]+)'''
    matches = list(re.finditer(pattern, html_raw, re.I))
    if len(matches) != 1:
        raise ValueError('Expected exactly one picture-words/catalog.js?v= script in game HTML; '
                         'inspect the current HTML before refreshing')
    start, end = matches[0].span(2)
    return html_raw[:start] + sha256(catalog_raw)[:12].encode('ascii') + html_raw[end:]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[3],
                        help='Public repository root; never a private source-data tree')
    parser.add_argument('--output-dir', type=Path, help='Defaults to app/games/picture-words under root')
    parser.add_argument('--html-output', type=Path,
                        help='Game HTML destination; defaults to picture-words.html beside the output directory')
    parser.add_argument('--previous-catalog', type=Path, help='Optional stable-ID/order seed; never changes eligibility')
    parser.add_argument('--inventory', type=Path, help='Optional schema1 exact Git filename inventory for sparse QA')
    parser.add_argument('--check', action='store_true', help='Verify deterministic outputs without writing any file')
    args = parser.parse_args(argv)
    out = args.output_dir or args.root / GAME
    html_path = args.html_output or out.parent / HTML.name
    previous = args.previous_catalog or (out / 'catalog.js' if (out / 'catalog.js').exists() else args.root / GAME / 'catalog.js')
    try:
        files, report = produce(args.root, args.inventory, previous)
        # Prefer the destination's current UI, including any concurrent local edits.
        html_source = html_path if html_path.is_file() else args.root / HTML
        html_raw = bind_catalog_html(html_source.read_bytes(), files['catalog.js'])
        outputs = [(out / name, raw) for name, raw in files.items()] + [(html_path, html_raw)]
        if args.check:
            bad = [str(path) for path, raw in outputs if not path.is_file() or path.read_bytes() != raw]
            if bad:
                raise ValueError('Generated files are missing or stale: ' + ', '.join(bad[:8]))
        else:
            for path, raw in outputs:
                if path.is_file() and path.read_bytes() == raw:
                    continue
                path.parent.mkdir(parents=True, exist_ok=True)
                temporary = path.with_name(path.name + '.tmp')
                temporary.write_bytes(raw)
                temporary.replace(path)
        print(('Verified' if args.check else 'Wrote') + f" {report['emittedRows']} reviewed playable rows and {report['lazyAssets']} lazy image assets.")
        return 0
    except (OSError, ValueError, KeyError, AssertionError) as error:
        print('Review refresh failed: ' + str(error), file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
