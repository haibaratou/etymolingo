"""Portable producer regression tests; never changes canonical input files.

Normal checkout: python app/games/picture-words/test_refresh_reviewed_catalog.py
Sparse QA can set PICTURE_WORDS_TEST_ROOT and PICTURE_WORDS_TEST_INVENTORY.
"""
from contextlib import redirect_stderr, redirect_stdout
import base64
import copy
import io
import json
import os
from pathlib import Path
import re
import tempfile
import unittest

import refresh_reviewed_catalog as R

ROOT = Path(os.environ.get('PICTURE_WORDS_TEST_ROOT', Path(__file__).resolve().parents[3]))
INVENTORY = Path(os.environ['PICTURE_WORDS_TEST_INVENTORY']) if os.environ.get('PICTURE_WORDS_TEST_INVENTORY') else None


def parse_catalog(raw):
    text = raw.decode()
    prefix = 'window.PICTURE_WORDS_CATALOG = '
    return json.JSONDecoder().raw_decode(text[text.index(prefix) + len(prefix):])[0]


class ReviewedCatalogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.files, cls.report = R.produce(ROOT, INVENTORY)
        cls.rows = parse_catalog(cls.files['catalog.js'])
        cls.previous = R.read_previous_catalog(ROOT / R.GAME / 'catalog.js')
        cls.scenes = {R.scene_identity(e): e for e in R.read_json(ROOT / R.SCENES)['entries']}
        cls.words = R.read_json(ROOT / R.WORDS)
        normal = R.load_normal_builder(ROOT)
        cls.normal_rows = normal.build_catalog(
            cls.words, R.read_json(ROOT / 'app/data/generated-etymon/word-suika-ja.json'),
            R.read_inventory(ROOT, INVENTORY), normal.read_art_index(ROOT / R.INDEX),
            normal.read_ledger([]))
        cls.sample = cls.rows[0]
        cls.entry = cls.scenes[R.scene_identity(cls.sample['reviewedScene'])]
        cls.binding = cls.sample['sceneBinding']

    def checked(self, entry=None, binding=None, root=None):
        return R.validate_scene(entry or self.entry, binding or self.binding, root or ROOT)

    def test_current_pool_matches_exact_eligible_reviewed_input_membership(self):
        # Derive the complete set from current inputs, never a release's counts.
        expected = set()
        for row in self.normal_rows:
            if not row.get('updatedArt') or row.get('reviewStatus') or not re.fullmatch(r'[ぁ-ゔー]{2,14}', row['w']):
                continue
            binding = row.get('sceneBinding')
            if not binding:
                continue
            matches = [w for w in self.words if (w['w'], w.get('p', [])) == (binding['w'], binding['p'])]
            if len(matches) != 1 or binding != {k: matches[0].get(k, [] if k == 'p' else '') for k in ('w', 'p', 'ja', 'en')}:
                continue
            if row['en'] != binding['w'] or row.get('roots', binding['p']) != binding['p']:
                continue
            entry = self.scenes.get((binding['w'], tuple(binding['p']), row['pic']))
            if entry is None or R.validate_scene(entry, binding, ROOT)[0] is not None:
                continue
            if row.get('imageRevision', entry['image']['sha256']) != entry['image']['sha256']:
                continue
            expected.add(row['id'])
        self.assertEqual({row['id'] for row in self.rows}, expected)
        self.assertEqual(len(self.rows), len(expected))
        self.assertEqual(self.report['emittedRows'], len(self.rows))
        self.assertEqual(self.report['verifiedPngs'], len(self.rows))
        self.assertEqual(self.report['meta']['count'], len(expected))
        self.assertEqual(self.report['normalCatalogRows'], len(self.normal_rows))
        self.assertEqual(self.report['sceneEntries'], len(self.scenes))
        for row in self.rows:
            self.assertTrue(row['updatedArt'])
            self.assertNotIn('reviewStatus', row)
            self.assertRegex(row['w'], r'^[ぁ-ゔー]{2,14}$')

    def test_meta_binds_actual_raw_input_bytes(self):
        meta = self.report['meta']
        self.assertEqual(set(meta), {'schema','sourceWordsSha256','scenesSha256','indexSha256','count'})
        self.assertEqual(meta['schema'], 1)
        for field, path in [('sourceWordsSha256', R.WORDS), ('scenesSha256', R.SCENES), ('indexSha256', R.INDEX)]:
            self.assertEqual(meta[field], R.sha256((ROOT / path).read_bytes()))

    def test_rows_exact_schema_bindings_and_current_hashes(self):
        for row in self.rows:
            e = row['reviewedScene']
            self.assertEqual(set(e), {'schema','status','w','p','art','sense','scene','image'})
            self.assertEqual((e['schema'], e['status']), (1, 'reviewed'))
            self.assertEqual((row['en'], row['pic']), (e['w'], e['art']))
            self.assertEqual(R.first_senses(row['sceneBinding']), (R.normalize(e['sense']['ja']),R.normalize(e['sense']['en'])))
            raw = (ROOT / e['image']['path']).read_bytes()
            self.assertEqual(R.sha256(raw), e['image']['sha256'])
            self.assertEqual(R.git_blob_sha(raw), e['image']['git_blob_sha'])

    def test_all_lazy_packs_decode_to_exact_original_png(self):
        for row in self.rows:
            e = row['reviewedScene']; digest = e['image']['sha256']
            expected = 'picture-words/scene-assets/' + e['art'] + '@' + digest + '.js'
            self.assertEqual(row['sceneAsset'], expected)
            raw = self.files[expected.removeprefix('picture-words/')].decode()
            prefix = '(window.PICTURE_WORDS_SCENE_ASSETS ||= {})[' + json.dumps(digest) + '] = '
            self.assertTrue(raw.startswith(prefix)); self.assertTrue(raw.endswith(';\n'))
            value = json.loads(raw[len(prefix):-2])
            self.assertEqual(value['mime'], 'image/png')
            png = base64.b64decode(value['base64'], validate=True)
            self.assertEqual(png, (ROOT / e['image']['path']).read_bytes())
            self.assertEqual(R.sha256(png), digest)

    def test_no_startup_image_payload_or_generation_timestamps(self):
        text = self.files['catalog.js'].decode()
        self.assertNotIn('base64', text)
        self.assertNotIn('data:image/', text)
        self.assertNotIn('reviewed_at', text)
        self.assertNotIn('generatedAt', text)
        self.assertNotIn('timestamp', self.files[R.REPORT].decode())

    def test_existing_ID_order_and_original_row_fields_preserved(self):
        included = {r['id'] for r in self.rows}
        existing = [r for r in self.previous if r['id'] in included]
        self.assertEqual([r['id'] for r in self.rows[:len(existing)]], [r['id'] for r in existing])
        for row in existing:
            actual = next(r for r in self.rows if r['id'] == row['id'])
            stripped = {k:v for k,v in actual.items() if k not in ('reviewedScene','sceneAsset')}
            old = {k:v for k,v in row.items() if k not in ('reviewedScene','sceneAsset')}
            self.assertEqual(stripped, old)

    def test_normal_builder_has_not_been_changed(self):
        byid = {r['id']:r for r in self.normal_rows}
        for r in self.rows:
            self.assertEqual({k:v for k,v in r.items() if k not in ('reviewedScene','sceneAsset')},byid[r['id']])

    def test_determinism_even_after_strict_catalog_replaces_old_catalog(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'catalog.js';p.write_bytes(self.files['catalog.js'])
            regenerated,report=R.produce(ROOT,INVENTORY,p)
            self.assertEqual(regenerated,self.files);self.assertEqual(report,self.report)

    def test_surviving_existing_order_is_preserved_when_seed_is_reordered(self):
        with tempfile.TemporaryDirectory() as td:
            selected=list(reversed(self.rows[:3]));p=Path(td)/'catalog.js'
            p.write_text('window.PICTURE_WORDS_CATALOG = '+json.dumps(selected)+';\n')
            files,_=R.produce(ROOT,INVENTORY,p);rows=parse_catalog(files['catalog.js'])
            self.assertEqual([r['id'] for r in rows[:3]],[r['id'] for r in selected])
            self.assertEqual({r['id'] for r in rows},{r['id'] for r in self.rows})

    def test_changed_stable_ID_is_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            row=copy.deepcopy(self.sample);row['id']='unexpected-renumbering';p=Path(td)/'catalog.js'
            p.write_text('window.PICTURE_WORDS_CATALOG = '+json.dumps([row])+';\n')
            with self.assertRaisesRegex(ValueError,'stable ID'):R.produce(ROOT,INVENTORY,p)

    def test_new_eligible_reviewed_description_grows_catalog_without_changing_old_IDs(self):
        # A private synthetic two-word fixture exercises the real unchanged normal
        # builder. Its one-pixel PNG and review claims are test data only.
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            def put(path, raw):
                target = root / path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(raw)
            def put_json(path, data):
                put(path, R.json_bytes(data))
            put(R.GAME / 'build_catalog.py', (ROOT / R.GAME / 'build_catalog.py').read_bytes())
            normal = R.load_normal_builder(root)
            png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jT1sAAAAASUVORK5CYII=')
            japanese = [{'w': kana, 'ja': kana, 'pic': art} for kana, art in normal.LEGACY_CHOICES]
            for row in japanese:
                put(Path('assets/word') / (row['pic'] + '.png'), png)
            words = [
                {'w': 'acorn', 'p': [], 'ja': 'どんぐり', 'en': 'oak seed', 'pos': '名', 'r': 2},
                {'w': 'candle', 'p': [], 'ja': 'ろうそく', 'en': 'wax light', 'pos': '名', 'r': 1},
            ]
            entries = []
            for word in words:
                art = word['w']
                put(Path('assets/word') / (art + '.png'), png)
                entries.append({
                    'w': word['w'], 'p': word['p'], 'art': art, 'status': 'reviewed',
                    'sense': {'index': 0, 'ja': word['ja'], 'en': word['en'],
                              'sha256': R.sense_digest(word['w'], word['p'], word['ja'], word['en'])},
                    'scene': {'en': 'An acorn beside a leaf.' if art == 'acorn' else 'A candle on a plate.',
                              'ja': '葉の横のどんぐり。' if art == 'acorn' else '皿の上のろうそく。'},
                    'image': {'path': 'assets/word/' + art + '.png',
                              'sha256': R.sha256(png), 'git_blob_sha': R.git_blob_sha(png)},
                    'review': {'status': 'reviewed', 'reviewed_at': '2000-01-01',
                               'method': 'synthetic unit-test fixture', 'notes': 'Not editorial evidence; synthetic fixture only'},
                })
            put_json(R.WORDS, words)
            put_json(Path('app/data/generated-etymon/word-suika-ja.json'), japanese)
            put_json(Path('app/data/ja/ja_index.json'), [])
            put(R.INDEX, b'globalThis.ETYMON_WORD_ART = {};\n')
            put(R.HTML, b'<script src="picture-words/catalog.js?v=fixture" defer></script>\n')
            put_json(R.GAME / 'updated-art.json', [[w['w'], '', w['w'] + '.png', '2099-01-01T00:00:00+09:00'] for w in words])
            put_json(R.GAME / 'readiness-review.json', {'rows': []})
            put_json(R.GAME / 'image-revisions.json', {'entries': []})
            def set_scenes(current):
                put_json(R.SCENES, {'schema': 1, 'entries': current})
                put_json(R.MANIFEST, {'files': {
                    name: {'file': path.name, 'bytes': len((root / path).read_bytes()),
                           'sha256': R.sha256((root / path).read_bytes())}
                    for name, path in [('words', R.WORDS), ('illustration_scenes', R.SCENES)]}})
            set_scenes(entries[:1])
            before_files, before_report = R.produce(root)
            before = parse_catalog(before_files['catalog.js'])
            self.assertEqual([r['id'] for r in before], ['acorn'])
            self.assertEqual(before_report['emittedRows'], 1)
            self.assertIn('candle', {r['id'] for r in before_report['excludedRows']})
            put(R.GAME / 'catalog.js', before_files['catalog.js'])
            set_scenes(entries)
            after_files, after_report = R.produce(root)
            after = parse_catalog(after_files['catalog.js'])
            self.assertEqual(after_report['emittedRows'], before_report['emittedRows'] + 1)
            self.assertEqual(after_report['meta']['count'], len(after))
            self.assertEqual(after[:len(before)], before)
            self.assertEqual([r['id'] for r in after], ['acorn', 'candle'])
            self.assertLess(after[1]['rank'], after[0]['rank'])  # New ID appends despite lower rank.
            self.assertEqual(len(after_files) - len(before_files), 1)  # One new immutable pack.
            put(R.GAME / 'catalog.js', after_files['catalog.js'])
            repeated_files, repeated_report = R.produce(root)
            self.assertEqual(repeated_files, after_files)
            self.assertEqual(repeated_report, after_report)
            with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
                self.assertEqual(R.main(['--root', str(root)]), 0)
                self.assertEqual(R.main(['--root', str(root), '--check']), 0)

    def test_exclusions_account_for_all_normal_rows_and_nonemitted_scenes(self):
        self.assertEqual(self.report['normalCatalogRows'],len(self.rows)+len(self.report['excludedRows']))
        self.assertEqual(self.report['sceneEntries'],len(self.rows)+len(self.report['sceneExclusions']))
        self.assertEqual(sum(self.report['exclusionCounts'].values()),len(self.report['excludedRows']))
        self.assertTrue(all(r['reason'] for r in self.report['excludedRows']))

    def test_valid_scene_passes(self):
        self.assertIsNone(self.checked()[0])

    def test_unreviewed_mismatch_or_conflicting_review_status_is_excluded(self):
        for status in ['unreviewed','mismatch','stale_image']:
            entry=copy.deepcopy(self.entry);entry['status']=status
            self.assertEqual(self.checked(entry)[0],'scene_not_reviewed')
        entry=copy.deepcopy(self.entry);entry['review']['status']='mismatch'
        self.assertEqual(self.checked(entry)[0],'scene_not_reviewed')

    def test_missing_manual_visual_evidence_is_excluded(self):
        entry=copy.deepcopy(self.entry);entry['review']['notes']=''
        self.assertEqual(self.checked(entry)[0],'missing_review_evidence')

    def test_missing_Japanese_or_English_is_excluded(self):
        for language in ['ja','en']:
            entry=copy.deepcopy(self.entry);entry['scene'][language]=' '
            self.assertEqual(self.checked(entry)[0],'missing_bilingual_caption')

    def test_exact_headword_required_and_substrings_do_not_count(self):
        entry=copy.deepcopy(self.entry);entry['scene']['en']='A completely unrelated visible object.'
        self.assertEqual(self.checked(entry)[0],'missing_exact_headword')
        self.assertFalse(R.includes_headword('A catapult on wheels.','cat'))
        self.assertFalse(R.includes_headword('A non-dairy drink.','non-'))
        self.assertTrue(R.includes_headword('They aren’t wet.',"aren't"))
        self.assertTrue(R.includes_headword('A CAT by a basket.','cat'))

    def test_caption_limit18_and_no_minimum_padding(self):
        entry=copy.deepcopy(self.entry);entry['scene']['en']=' '.join([entry['w']]+['detail']*18)
        self.assertEqual(self.checked(entry)[0],'caption_too_long')
        entry['scene']['en']=entry['w']+' beside baskets.'
        self.assertIsNone(self.checked(entry)[0])

    def test_headword_only_and_multiple_sentences_are_excluded(self):
        entry=copy.deepcopy(self.entry);entry['scene']['en']='This is a '+entry['w']+'.'
        self.assertEqual(self.checked(entry)[0],'headword_only_caption')
        entry['scene']['en']=entry['w']+' is nearby. Another object appears.'
        self.assertEqual(self.checked(entry)[0],'multiple_caption_sentences')

    def test_stale_source_first_sense_and_digest_are_excluded(self):
        binding=copy.deepcopy(self.binding);binding['en']='different meaning'
        self.assertEqual(self.checked(binding=binding)[0],'stale_sense')
        entry=copy.deepcopy(self.entry);entry['sense']['sha256']='0'*64
        self.assertEqual(self.checked(entry)[0],'stale_sense_digest')

    def test_exact_ordered_root_identity_required(self):
        entry=copy.deepcopy(self.entry);entry['p']=['wrong-root']
        self.assertEqual(self.checked(entry)[0],'stale_identity')

    def test_missing_original_png_excluded_without_fallback(self):
        with tempfile.TemporaryDirectory() as td:
            self.assertEqual(self.checked(root=Path(td))[0],'missing_image')

    def test_corrupted_original_png_excluded_even_if_filename_matches(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);p=root/self.entry['image']['path'];p.parent.mkdir(parents=True)
            p.write_bytes((ROOT/self.entry['image']['path']).read_bytes()+b'corruption')
            self.assertEqual(self.checked(root=root)[0],'stale_image')

    def test_Git_blob_hash_is_checked_independently(self):
        entry=copy.deepcopy(self.entry);entry['image']['git_blob_sha']='0'*40
        self.assertEqual(self.checked(entry)[0],'stale_image')

    def test_unsafe_image_path_rejected(self):
        entry=copy.deepcopy(self.entry);entry['image']['path']='../outside.png'
        self.assertEqual(self.checked(entry)[0],'invalid_image_binding')

    def test_matching_hashes_do_not_accept_non_PNG_bytes(self):
        with tempfile.TemporaryDirectory() as td:
            entry=copy.deepcopy(self.entry);root=Path(td);p=root/entry['image']['path'];p.parent.mkdir(parents=True);raw=b'not a png';p.write_bytes(raw)
            entry['image']['sha256']=R.sha256(raw);entry['image']['git_blob_sha']=R.git_blob_sha(raw)
            self.assertEqual(self.checked(entry,root=root)[0],'invalid_png')

    def test_stale_manifest_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);p=root/R.MANIFEST;p.parent.mkdir(parents=True)
            p.write_text(json.dumps(R.read_json(ROOT/R.MANIFEST)))
            with self.assertRaisesRegex(ValueError,'Stale public manifest'):
                R.validate_manifest(root,b'changed',(ROOT/R.SCENES).read_bytes())

    def test_CRLF_hash_bound_inputs_fail_early_with_actionable_message(self):
        for path in [R.WORDS,R.SCENES,R.INDEX]:
            with self.assertRaisesRegex(ValueError,r'CRLF.*LF line endings.*gitattributes'):
                R.validate_hash_bound_line_endings(path,b'content\r\n')
            R.validate_hash_bound_line_endings(path,b'content\n')
        with tempfile.TemporaryDirectory() as td:
            root=Path(td)
            for path in [R.WORDS,R.SCENES,R.INDEX,R.GAME/'build_catalog.py']:
                out=root/path;out.parent.mkdir(parents=True,exist_ok=True)
                raw=(ROOT/path).read_bytes()
                if path==R.INDEX:raw=raw.replace(b'\n',b'\r\n')
                out.write_bytes(raw)
            with self.assertRaisesRegex(ValueError,'CRLF line endings in hash-bound input assets/word'):
                R.produce(root)
            self.assertFalse((root/R.MANIFEST).exists())

    def test_check_detects_pack_corruption_and_missing_output_without_writes(self):
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)
            for name,raw in self.files.items():
                p=out/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
            html=out/'picture-words.html'
            html.write_bytes(R.bind_catalog_html((ROOT/R.HTML).read_bytes(),self.files['catalog.js']))
            args=['--root',str(ROOT),'--output-dir',str(out),'--html-output',str(html),'--check']
            if INVENTORY:args+=['--inventory',str(INVENTORY)]
            with redirect_stdout(io.StringIO()),redirect_stderr(io.StringIO()):self.assertEqual(R.main(args),0)
            asset=out/next(name for name in self.files if name.startswith('scene-assets/'))
            asset.write_bytes(asset.read_bytes()+b'bad')
            before={str(p.relative_to(out)):p.read_bytes() for p in out.rglob('*') if p.is_file()}
            with redirect_stdout(io.StringIO()),redirect_stderr(io.StringIO()):self.assertEqual(R.main(args),1)
            self.assertEqual(before,{str(p.relative_to(out)):p.read_bytes() for p in out.rglob('*') if p.is_file()})
            asset.unlink()
            with redirect_stdout(io.StringIO()),redirect_stderr(io.StringIO()):self.assertEqual(R.main(args),1)


    def test_catalog_HTML_update_changes_only_existing_query_value(self):
        for original in [(ROOT/R.HTML).read_bytes(),
                         b'<!doctype html>\r\n<script defer src=\'picture-words/catalog.js?v=old&amp;keep=1\'></script>\r\n<div>fresh UI</div>']:
            token=R.sha256(self.files['catalog.js'])[:12].encode()
            expected=re.sub(rb'(picture-words/catalog\.js\?v=)[^\s\'"&<>]+',lambda m:m[1]+token,original)
            actual=R.bind_catalog_html(original,self.files['catalog.js'])
            self.assertEqual(actual,expected)
            self.assertEqual(R.bind_catalog_html(actual,self.files['catalog.js']),actual)
            self.assertNotEqual(R.bind_catalog_html(actual,self.files['catalog.js']+b'\n'),actual)

    def test_missing_or_duplicate_HTML_catalog_scripts_fail_closed(self):
        script=b'<script src="picture-words/catalog.js?v=old"></script>'
        for raw in [b'<html></html>',script+script]:
            with self.assertRaisesRegex(ValueError,'exactly one'):
                R.bind_catalog_html(raw,self.files['catalog.js'])

    def test_check_detects_stale_HTML_without_writes_and_refresh_preserves_fresh_UI(self):
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)/'picture-words';html=Path(td)/'picture-words.html'
            for name,raw in self.files.items():
                p=out/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
            fresh=(ROOT/R.HTML).read_bytes()+b'\n<!-- concurrent fresh UI preserved -->\n'
            stale=re.sub(rb'(picture-words/catalog\.js\?v=)[^\s\'"&<>]+',rb'\g<1>stale-token',fresh)
            html.write_bytes(stale)
            args=['--root',str(ROOT),'--output-dir',str(out)]
            if INVENTORY:args+=['--inventory',str(INVENTORY)]
            before={str(p.relative_to(td)):p.read_bytes() for p in Path(td).rglob('*') if p.is_file()}
            with redirect_stdout(io.StringIO()),redirect_stderr(io.StringIO()):
                self.assertEqual(R.main(args+['--check']),1)
            self.assertEqual(before,{str(p.relative_to(td)):p.read_bytes() for p in Path(td).rglob('*') if p.is_file()})
            with redirect_stdout(io.StringIO()),redirect_stderr(io.StringIO()):
                self.assertEqual(R.main(args),0)
                self.assertEqual(R.main(args+['--check']),0)
            self.assertEqual(html.read_bytes(),R.bind_catalog_html(stale,self.files['catalog.js']))
            self.assertTrue(html.read_bytes().endswith(b'<!-- concurrent fresh UI preserved -->\n'))
            for name,raw in self.files.items():self.assertEqual((out/name).read_bytes(),raw)


if __name__=='__main__':
    unittest.main(verbosity=2)
