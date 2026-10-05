"""Reviewed semantic metadata, separate from linguistic and legacy game tags.

This module is intentionally reusable by the public builder. It never mutates
canonical words, captions, image bytes, image ownership, or language tags.
"""
from __future__ import annotations
import copy
from datetime import datetime
import hashlib
import json
import re
import unicodedata
from pathlib import Path


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf-8')


def normalize(value):
    return ' '.join(unicodedata.normalize('NFKC', str(value or '')).translate(
        str.maketrans({'’': "'", '‘': "'", '‐': '-', '‑': '-'})).split())


def word_key(row):
    return row['w'], tuple(row.get('p', []))


def key(row):
    return (*word_key(row), row['art'])


def sense_of(word):
    ja = normalize(word.get('ja', '').split('、')[0])
    en = normalize(word.get('en', '').split(' / ')[0])
    return {'index': 0, 'ja': ja, 'en': en,
            'sha256': hashlib.sha256(compact([normalize(word['w']), word.get('p', []), ja, en])).hexdigest()}


def validate(payload, words, target_repo=None):
    """Reject stale/ambiguous input, rather than silently inheriting a homonym.

    All words remain read-only. The declared literal art ID must exist in target
    inventory when exporting; the site separately checks resolved primary rows.
    """
    if not isinstance(payload, dict) or type(payload.get('schema')) is not int or payload['schema'] != 1:
        raise ValueError('Unsupported semantic classification schema')
    if not isinstance(payload.get('entries'), list) or not isinstance(payload.get('taxonomy'), list):
        raise ValueError('Semantic entries and taxonomy must be lists')
    paths, category_ids = set(), set()
    for category in payload['taxonomy']:
        cid = category.get('id', '')
        if not re.fullmatch(r'[a-z][a-z0-9-]*', cid) or cid in category_ids:
            raise ValueError('Duplicate or invalid semantic category')
        category_ids.add(cid)
        if not all(isinstance(category.get(k), str) and category[k].strip() for k in ['ja', 'en']):
            raise ValueError('Missing semantic category labels')
        if not isinstance(category.get('subs'), list):
            raise ValueError('Semantic subcategories must be a list')
        for sub in category['subs']:
            sid = sub.get('id', '')
            path = cid + '/' + sid
            if not re.fullmatch(r'[a-z][a-z0-9-]*', sid) or path in paths:
                raise ValueError('Duplicate or invalid semantic subcategory')
            if not all(isinstance(sub.get(k), str) and sub[k].strip() for k in ['ja', 'en']):
                raise ValueError('Missing semantic subcategory labels')
            paths.add(path)
    canonical = {}
    for word in words:
        canonical.setdefault(word_key(word), []).append(word)
    seen = set()
    for entry in payload['entries']:
        if not isinstance(entry, dict) or not isinstance(entry.get('w'), str) or not entry['w']:
            raise ValueError('Invalid semantic word')
        if not isinstance(entry.get('p'), list) or not all(isinstance(p, str) and p for p in entry['p']):
            raise ValueError('Invalid ordered semantic roots')
        if not isinstance(entry.get('art'), str) or not re.fullmatch(r'[A-Za-z0-9_@-]+', entry['art']):
            raise ValueError('Invalid semantic art identity')
        identity = key(entry)
        if identity in seen:
            raise ValueError('Duplicate semantic identity')
        seen.add(identity)
        matched = canonical.get(word_key(entry), [])
        if len(matched) != 1:
            raise ValueError('Missing or ambiguous semantic canonical identity')
        if entry.get('scope') != 'first_sense' or entry.get('canonical') != {k: matched[0].get(k, '') for k in ['ja', 'en', 'pos']}:
            raise ValueError('Stale semantic full-gloss/POS guard')
        if entry.get('sense') != sense_of(matched[0]):
            raise ValueError('Stale semantic first-sense guard')
        review = entry.get('review', {})
        if review.get('status') != 'reviewed' or not isinstance(review.get('note'), str) or not review['note'].strip():
            raise ValueError('Semantic classification is not reviewed')
        stamp = review.get('reviewed_at', '')
        try:
            parsed = datetime.fromisoformat(stamp.replace('Z', '+00:00'))
            if 'T' not in stamp or parsed.tzinfo is None:
                raise ValueError()
        except (ValueError, TypeError, AttributeError):
            raise ValueError('Invalid semantic review timestamp')
        if not isinstance(review.get('method'), str) or not review['method'].strip() or not isinstance(review.get('evidence'), list) or not review['evidence'] or not all(isinstance(x, str) and re.fullmatch(r'https://[^\s]+', x) for x in review['evidence']):
            raise ValueError('Missing public semantic review method/evidence')
        for field in ['categories', 'semanticTags']:
            value = entry.get(field)
            if not isinstance(value, list) or not value or not all(isinstance(x, str) and x.strip() for x in value) or len(value) != len(set(value)):
                raise ValueError('Invalid semantic ' + field)
        if not set(entry['categories']).issubset(paths):
            raise ValueError('Unknown semantic category path')
        if not all(isinstance(entry.get('distinction', {}).get(k), str) and entry['distinction'][k].strip() for k in ['ja', 'en']):
            raise ValueError('Missing bilingual semantic distinction')
        evidence = entry.get('artBindingEvidence', {})
        if evidence.get('path') != 'assets/word/' + entry['art'] + '.png' or not re.fullmatch(r'[a-f0-9]{64}', evidence.get('sha256', '')) or not re.fullmatch(r'[a-f0-9]{40}', evidence.get('git_blob_sha', '')):
            raise ValueError('Invalid reviewed semantic image binding evidence')
        if target_repo is not None:
            image_path = Path(target_repo) / evidence['path']
            if not image_path.is_file():
                raise ValueError('Missing declared semantic image')
            raw = image_path.read_bytes()
            image_sha = hashlib.sha256(raw).hexdigest()
            image_blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
            if image_sha != evidence['sha256'] or image_blob != evidence['git_blob_sha']:
                raise ValueError('Stale reviewed semantic image bytes')
    return copy.deepcopy(payload)


def export_classifications(path, words, target_repo):
    return validate(json.loads(Path(path).read_text(encoding='utf-8')), words, target_repo)


def merge_art_index(text, payload):
    """Merge only declared reviewed exact tuples. Never rebuild/guess filenames."""
    start, end = text.index('{'), text.rindex('}') + 1
    mapping = json.loads(text[start:end])
    before = copy.deepcopy(mapping)
    additions = []
    for entry in payload['entries']:
        index_key = compact([entry['w'], '+'.join(entry['p'])]).decode('utf-8')
        if index_key in mapping and mapping[index_key] != entry['art']:
            raise ValueError('Conflicting existing semantic image binding')
        if index_key not in mapping:
            additions.append((index_key, entry['art']))
        mapping[index_key] = entry['art']
    if any(mapping[k] != v for k, v in before.items()):
        raise ValueError('Unrelated illustration mapping changed')
    if not additions:
        return text
    prefix = text[:end - 1].rstrip()
    suffix = text[len(prefix):]
    inserted = (',' if before else '') + '\n  ' + ',\n  '.join(json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False) for k, v in additions)
    return prefix + inserted + suffix


def export_semantic_only(source_dir, target_repo):
    """Narrow opt-in exporter: semantic files, two tuple additions, manifest only.

    HTML hooks are maintained in the public repository. Embedded semantic JSON
    is refreshed only when that marker exists, without rebuilding packed words.
    """
    source_dir, target_repo = Path(source_dir), Path(target_repo)
    words = json.loads((source_dir / 'words.json').read_text(encoding='utf-8'))
    payload = export_classifications(source_dir / 'word_semantic_classifications.json', words, target_repo)
    raw = compact(payload)
    out = target_repo / 'app/data/generated-etymon'
    manifest_path = out / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    runtime_words_raw = (out / 'words.json').read_bytes()
    if manifest['files']['words']['sha256'] != hashlib.sha256(runtime_words_raw).hexdigest():
        raise ValueError('Stale runtime words manifest before semantic export')
    validate(payload, json.loads(runtime_words_raw), target_repo)
    index_path = target_repo / 'assets/word/illustration-index.js'
    index_raw = merge_art_index(index_path.read_text(encoding='utf-8'), payload).encode('utf-8')
    manifest['files']['semantic_classifications'] = {'file': 'semantic-classifications.json', 'bytes': len(raw), 'count': len(payload['entries']), 'sha256': hashlib.sha256(raw).hexdigest()}
    # Compute all output bytes before writing; rebased/missing hooks fail closed.
    outputs = {
        out / 'semantic-classifications.json': raw,
        manifest_path: (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode('utf-8'),
        index_path: index_raw,
    }
    html_path = target_repo / 'app/etymon-explorer.html'
    if html_path.exists():
        text = html_path.read_bytes().decode('utf-8')
        text, index_matches = re.subn(r'(<script src="../assets/word/illustration-index\.js\?v=)[^"]+(\"></script>)', lambda m: m[1] + hashlib.sha256(index_raw).hexdigest()[:12] + m[2], text)
        embedded = raw.decode('utf-8').replace('<', '\\u003c')
        text, semantic_matches = re.subn(r'(<script id="semanticData" type="application/json">).*?(</script>)', lambda m: m[1] + embedded + m[2], text, flags=re.S)
        if index_matches != 1 or semantic_matches != 1:
            raise ValueError('Explorer semantic/index hooks changed or are missing; rebase before export')
        outputs[html_path] = text.encode('utf-8')
    for path, content in outputs.items():
        path.write_bytes(content)
    return payload


def apply_to_catalog(rows, categories, payload, words):
    """Return new primary rows and category counts; preserve nonsemantic fields.

    baseCategories marks a source-managed classification. Removal returns it to
    honest unclassified status; legacy/stale inherited categories are not trusted.
    """
    payload = validate(payload, words)
    result = copy.deepcopy(rows)
    bound = {}
    for row in result:
        if row.get('bindingStatus') == 'bound':
            bound.setdefault(key(row), []).append(row)
        row['c'] = ['more/words'] if 'baseCategories' in row else list(row.get('c', []))
        for name in ['baseCategories', 'semanticTags', 'semanticDistinction', 'semanticCanonical']:
            row.pop(name, None)
    for entry in payload['entries']:
        matched = bound.get(key(entry), [])
        if len(matched) != 1:
            raise ValueError('Semantic art is not exactly one resolved primary row')
        row = matched[0]
        if row.get('image') != entry['artBindingEvidence']:
            raise ValueError('Semantic catalog reviewed image guard mismatch')
        if row.get('sense') != entry['sense']:
            raise ValueError('Semantic catalog first-sense guard mismatch')
        row['baseCategories'] = ['more/words']
        row['c'] = list(entry['categories'])
        row['semanticTags'] = list(entry['semanticTags'])
        row['semanticDistinction'] = dict(entry['distinction'])
        row['semanticCanonical'] = dict(entry['canonical'])
    merged = copy.deepcopy(categories)
    for incoming in payload['taxonomy']:
        category = next((c for c in merged if c['id'] == incoming['id']), None)
        if category is None:
            category = {**incoming, 'subs': [], 'icon': None}
            merged.append(category)
        for name in ['ja', 'en']:
            if category[name] != incoming[name]:
                raise ValueError('Semantic category label conflicts with site taxonomy')
        for sub in incoming['subs']:
            existing = next((s for s in category['subs'] if s['id'] == sub['id']), None)
            if existing is None:
                category['subs'].append(dict(sub))
            elif any(existing[k] != sub[k] for k in ['ja', 'en']):
                raise ValueError('Semantic subcategory label conflicts with site taxonomy')
    final_categories = []
    for category in merged:
        subs = [{**sub, 'n': sum(category['id'] + '/' + sub['id'] in row['c'] for row in result)} for sub in category['subs']]
        category['subs'] = [sub for sub in subs if sub['n']]
        members = [row for row in result if any(c.startswith(category['id'] + '/') for c in row['c'])]
        if not category['subs']:
            continue
        if category.get('icon') not in {r['id'] for r in members} | {r['art'] for r in members}:
            category['icon'] = members[0]['id']
        final_categories.append(category)
    return result, final_categories
