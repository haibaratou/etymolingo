"""Portable, pure ownership resolver for every observed generated PNG.

No filesystem reads, network, dates/POS/caption eligibility gate, or source mutation.
Inputs:
  words: canonical dictionaries with w and ordered p (plus semantic fields).
  png_inventory: {exact_stem: {path, sha256, git_blob_sha, ...}}. Caller scans
      current assets/word/*.png; hashes are required to resolve immutable copies.
  protected_index: existing ETYMON_WORD_ART mapping; keys are its JSON [w,roots]
      strings or Python (w, joined_roots) tuples. Values are stems or filenames.
  explicit_ledger_tuples: [w,joined_roots,filename,optional_actual_date] rows,
      or dictionaries {w,p/file/art,source,priority,recordedUpdatedAt}. Dictionary
      p is the ordered root list. Optional priority=3 marks published exceptional
      sense tuples, while dated tuples use priority=2. Never infer dates.
  reviewed_scenes: entries or {entries:[...]}; this is binding evidence only.
      Caption/image/first-sense review validity must be checked independently.
Returns safe_primary, assets, conflicts, rejected_evidence, summary. Every input
PNG appears exactly once in assets. Unresolved files have no fabricated word.
Protect exact index bindings; reject ambiguous shared homograph defaults;
prefer a uniquely owned sense-specific alternative when a default is ambiguous.
"""
from collections import defaultdict
import json
import re
import unicodedata


def identity_key(word, roots):
    return json.dumps([word, list(roots)], ensure_ascii=False, separators=(',', ':'))


def _stem(value):
    value = str(value)
    return value[:-4] if value.endswith('.png') else value


def _raw_name(word):
    if re.fullmatch(r'(con|prn|aux|nul|com[1-9]|lpt[1-9])', word, re.I):
        return word + '_word'
    text = ''.join(c for c in unicodedata.normalize('NFD', word)
                   if not unicodedata.combining(c))
    text = re.sub("['’]", '', text)
    return re.sub('[^A-Za-z0-9_-]', '', re.sub(r'\s+', '_', text))


def _sense_slug(roots):
    parts = []
    for root in roots:
        text = ''.join(c for c in unicodedata.normalize('NFD', root.replace('ʷ', 'w').replace('ə', 'e'))
                       if not unicodedata.combining(c))
        parts.append(re.sub('[^a-z0-9]', '', text.lower()) or 'x')
    return '-'.join(parts) or 'x'


def resolve_bindings(words, png_inventory, protected_index,
                     explicit_ledger_tuples=(), reviewed_scenes=()):
    inv = {_stem(art): dict(meta) for art, meta in png_inventory.items()}
    canonical, joined, spelling = defaultdict(list), defaultdict(set), defaultdict(set)
    raw_words, case_words = defaultdict(set), defaultdict(set)
    for index, row in enumerate(words):
        key = row['w'], tuple(row.get('p') or [])
        canonical[key].append(index)
        joined[key[0], '+'.join(key[1])].add(key)
        spelling[key[0]].add(key)
        raw_words[_raw_name(key[0])].add(key[0])
        case_words[key[0].lower()].add(key[0])
    evidence, rejected, protected = defaultdict(list), [], {}

    def add(key, art, source, priority, **extra):
        art = _stem(art)
        if key not in canonical or art not in inv:
            rejected.append({'identity': identity_key(*key), 'art': art,
                             'source': source, 'reason': 'canonical_identity_missing'
                             if key not in canonical else 'png_missing'})
            return
        evidence[key].append(dict(art=art, source=source, priority=priority, **extra))

    def add_joined(word, roots, art, source, priority, **extra):
        keys = joined.get((word, roots), set())
        if len(keys) != 1:
            rejected.append({'word': word, 'joinedRoots': roots, 'art': _stem(art),
                             'source': source, 'reason': 'identity_not_unique',
                             'canonicalCandidates': [identity_key(*k) for k in sorted(keys)]})
            return
        key = next(iter(keys))
        add(key, art, source, priority, **extra)
        if priority == 0 and _stem(art) in inv:
            protected[key] = _stem(art)

    for key, art in protected_index.items():
        word, roots = json.loads(key) if isinstance(key, str) else key
        roots = '+'.join(roots) if isinstance(roots, (list, tuple)) else roots
        add_joined(word, roots, art, 'protected_exact_index', 0)
    scenes = reviewed_scenes.get('entries', []) if isinstance(reviewed_scenes, dict) else reviewed_scenes
    for scene in scenes:
        add((scene['w'], tuple(scene.get('p') or [])), scene['art'], 'reviewed_scene_binding', 1,
            expectedImageSha256=scene.get('image', {}).get('sha256'))
    for row in explicit_ledger_tuples:
        if isinstance(row, dict):
            word = row['w']
            roots = '+'.join(row['p']) if 'p' in row else row.get('roots', '')
            art = row.get('file', row.get('art'))
            source, priority = row.get('source', 'dated_art_exact_tuple'), row.get('priority', 2)
            if priority not in (2, 3):
                raise ValueError('Ledger priority must be 2 or 3; index protection is not ledger input')
            date = row.get('recordedUpdatedAt')
        else:
            word, roots, art = row[:3]
            source, priority, date = 'dated_art_exact_tuple', 2, row[3] if len(row) > 3 else None
        extra = {'recordedUpdatedAt': date} if date else {}
        add_joined(word, roots, art, source, priority, **extra)

    def base_name(word):
        text = _raw_name(word)
        if re.fullmatch(r'(con|prn|aux|nul|com[1-9]|lpt[1-9])', word, re.I):
            return text
        if text != text.lower() and len(case_words[word.lower()]) > 1:
            return text + '_cap'
        if text != word and raw_words[text] - {word}:
            return text + '_acc'
        return text

    bases, senses = defaultdict(set), defaultdict(set)
    for key in canonical:
        base = base_name(key[0])
        bases[base].add(key)
        senses[base + '@' + _sense_slug(key[1])].add(key)
    for art, keys in senses.items():
        if art in inv and len(keys) == 1:
            add(next(iter(keys)), art, 'canonical_unique_sense_filename', 4)
    for art, keys in bases.items():
        if art in inv and len(keys) == 1:
            key = next(iter(keys))
            if len(spelling[key[0]]) == 1:
                add(key, art, 'canonical_unique_headword_filename', 5)
    for key in canonical:
        if key[0] in inv and len(spelling[key[0]]) == 1:
            add(key, key[0], 'literal_unique_exact_headword_filename', 6)

    claims = defaultdict(lambda: defaultdict(list))
    for key, rows in evidence.items():
        for row in rows:
            claims[row['art']][key].append(row)
    owner, conflicts, contested = {}, [], set()
    for art, by_key in claims.items():
        if len(by_key) == 1:
            owner[art] = next(iter(by_key))
            continue
        # Preserve exact protected binding even if a weaker fallback claims it.
        protected_owners = [k for k in by_key if protected.get(k) == art]
        if len(protected_owners) == 1:
            owner[art] = protected_owners[0]
        else:
            contested.add(art)
        conflicts.append({'art': art, 'reason': 'multiple_canonical_claimants',
                          'protectedOwner': identity_key(*owner[art]) if art in owner else None,
                          'claims': [{'identity': identity_key(*k), 'evidence': v}
                                     for k, v in sorted(by_key.items())]})
    chosen, pending = {}, []
    for key, rows in evidence.items():
        safe = [row for row in rows if owner.get(row['art']) == key and row['art'] not in contested]
        if not safe:
            pending.append({'identity': identity_key(*key),
                            'reason': 'all_candidates_have_conflicting_ownership', 'evidence': rows})
            continue
        priority = min(row['priority'] for row in safe)
        arts = {row['art'] for row in safe if row['priority'] == priority}
        if len(arts) == 1:
            chosen[key] = next(iter(arts))
        else:
            pending.append({'identity': identity_key(*key),
                            'reason': 'equal_authority_alternative_conflict', 'evidence': safe})
    immutable = {}
    for art, meta in inv.items():
        match = re.fullmatch(r'(.+)@([0-9a-f]{64})', art)
        if not match or art in owner:
            continue
        base, digest = match.groups()
        if base in owner and meta.get('sha256') == digest == inv[base].get('sha256'):
            owner[art] = owner[base]
            immutable[art] = base
            claims[art][owner[base]].append({'art': art, 'source': 'verified_immutable_sha256_copy',
                                           'exactBase': base, 'sha256': digest})
    primary = [{'w': key[0], 'p': list(key[1]), 'art': art,
                'dictionaryIndex': canonical[key][0], 'canonicalRowIndices': canonical[key],
                'canonicalIdentity': identity_key(*key), 'bindingStatus': 'exact',
                'evidence': evidence[key]}
               for key, art in sorted(chosen.items())]
    assets = []
    for art, meta in sorted(inv.items()):
        key = owner.get(art)
        primary_art = key is not None and chosen.get(key) == art
        candidates = bases.get(art, set()) | senses.get(art, set())
        reason = None
        if key is None:
            if art in contested: reason = 'conflicting_explicit_ownership'
            elif len(candidates) > 1: reason = 'ambiguous_default_homograph_or_filename_collision'
            elif art == '_placeholder': reason = 'technical_placeholder_not_lexical_entry'
            elif re.search(r'_alt[0-9]+$', art): reason = 'unverified_named_generated_alternate'
            elif '@' in art: reason = 'unrecognized_sense_suffix_or_no_canonical_identity'
            elif '_' in art: reason = 'phrase_or_derived_asset_without_canonical_binding'
            else: reason = 'no_exact_canonical_filename_or_binding'
        dates = sorted({row['recordedUpdatedAt'] for rows in claims.get(art, {}).values()
                        for row in rows if row.get('recordedUpdatedAt')})
        assets.append({**meta, 'art': art, 'path': meta.get('path', 'assets/word/' + art + '.png'),
                       'canonicalOwner': identity_key(*key) if key else None,
                       'bindingStatus': 'exact' if key else 'ownership_pending',
                       'assetRole': 'immutable_revision_alias' if art in immutable else
                       'primary' if primary_art else 'owned_alternate_or_superseded' if key else 'unresolved',
                       'primaryArt': chosen.get(key) if key else None, 'immutableBase': immutable.get(art),
                       'reason': reason, 'recordedUpdatedAt': dates,
                       'candidateIdentities': [identity_key(*k) for k in sorted(candidates)] if not key else [],
                       'evidence': [{'identity': identity_key(*k), 'records': rows}
                                    for k, rows in sorted(claims.get(art, {}).items())]})
    preserved = sum(chosen.get(key) == art for key, art in protected.items())
    if preserved != len(protected):
        raise ValueError('Conflicting protected bindings require manual resolution; refusing loss')
    return {'safe_primary': primary, 'assets': assets,
            'conflicts': conflicts, 'pending_canonical_identities': pending,
            'rejected_evidence': rejected,
            'summary': {'pngPaths': len(inv), 'primaryIdentities': len(primary),
                        'primaryDistinctWords': len({r['w'] for r in primary}),
                        'primaryPngPaths': len(set(chosen.values())), 'ownedPngPaths': len(owner),
                        'ownershipPendingPngPaths': len(inv) - len(owner),
                        'immutableAliases': len(immutable), 'conflictingFiles': len(conflicts),
                        'preservedProtectedBindings': preserved}}
