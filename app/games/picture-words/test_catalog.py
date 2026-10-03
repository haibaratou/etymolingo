"""Catalogue regressions: exact art senses, source meanings, and broad coverage."""
import json
from pathlib import Path
import tempfile
import unittest
from datetime import datetime

import build_catalog as catalog


class CatalogRulesTest(unittest.TestCase):
    def test_kana_answers_use_complete_meanings_and_unambiguous_readings(self):
        lookup = {'砂糖菓子': {'さとうがし'}, '本': {'もと・ほん'},
                  '市場': {'いちば', 'しじょう'}, '背中': {'せなか'}}
        self.assertEqual(catalog.japanese_answer('キャンディー、砂糖菓子', lookup), 'きゃんでぃー')
        self.assertEqual(catalog.japanese_answer('背中、後ろ', lookup), 'せなか')
        self.assertEqual(catalog.japanese_answer('本', lookup), '')
        self.assertEqual(catalog.japanese_answer('市場', lookup), '')
        self.assertEqual(catalog.japanese_answer('背中に乗せた荷物', lookup), '')

    def test_first_meaning_never_falls_back_to_a_later_sense(self):
        lookup = {'流れる': {'ながれる'}, '尻': {'しり'}, '写真': {'しゃしん'}}
        for meaning in ('走る、流れる', '底、尻', '絵、写真'):
            self.assertEqual(catalog.japanese_answer(meaning, lookup), '')
        self.assertEqual(catalog.verified_reading('走る、ラン', 'run',
            {'run': [{'ja': 'ラン', 'w': 'らん'}]}), '')
        source = {'w': 'gang', 'p': ['ghengh-'], 'ja': '一群',
                  'ja_readings': [{'gloss': '一群', 'kana': 'いちぐん', 'status': 'reviewed'}]}
        self.assertEqual(catalog.first_meaning_answer(source, 'gang', {}, {}), 'いちぐん')
        source['ja_readings'][0]['status'] = 'candidate'
        self.assertEqual(catalog.first_meaning_answer(source, 'gang', {}, {}), '')
        seizure = {'w': 'seizure', 'p': [], 'ja': 'つかむこと、押収、発作'}
        self.assertEqual(catalog.first_meaning_answer(seizure, 'seizure', {}, {}), 'つかむこと')
        seizure['ja'] = '発作、つかむこと'
        with self.assertRaises(ValueError):
            catalog.first_meaning_answer(seizure, 'seizure', {}, {})

    def test_confirmed_image_mismatch_stays_unready_without_losing_its_identity(self):
        source = {'w': 'arts', 'p': [], 'ja': '芸術、諸芸術',
                  'ja_readings': [{'gloss': '芸術', 'kana': 'げいじゅつ', 'status': 'reviewed'}]}
        self.assertEqual(catalog.image_review_status(source, 'arts'), 'image_meaning_mismatch')
        self.assertEqual(catalog.first_meaning_answer(source, 'arts', {}, {}), '')
        source['ja'] = '別の意味'
        self.assertEqual(catalog.image_review_status(source, 'arts'), 'meaning_changed_since_image_review')
        self.assertEqual(catalog.image_review_status({'w': 'apple', 'p': [], 'ja': 'リンゴ'}, 'apple'), '')

    def test_update_audit_checks_actual_display_image_and_cutoff(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'audit.csv'
            path.write_text('単語,語根,辞書参照画像ファイル名,辞書表示画像_2026-09-10以降更新,辞書表示画像更新日時_JST\n'
                            'seal,selk-,seal@selk.png,YES,2026-09-11T00:00:00+09:00\n'
                            'old,,old.png,YES,2026-09-10T23:59:59+09:00\n'
                            'missing,,missing.png,YES,\n'
                            'undated,,undated.png,YES,2026-09-10T00:00:00\n'
                            'rejected,,rejected.png,NO,2026-09-11T00:00:00+09:00\n', encoding='utf-8')
            rows = catalog.updated_art_rows(path)
            self.assertEqual([row[:3] for row in rows], [['seal', 'selk-', 'seal@selk.png']])

    def test_homographs_never_guess_a_shared_picture(self):
        row = {'w': 'seal', 'p': ['selk-']}
        files = {'seal': Path('seal.png'), 'seal@selk': Path('seal@selk.png')}
        self.assertIsNone(catalog.resolve_picture(row, files, {'seal': 2}, {}, {}))
        ledger = {('seal', 'selk-'): 'seal@selk.png'}
        self.assertEqual(catalog.resolve_picture(row, files, {'seal': 2}, {}, ledger), 'seal@selk')

    def test_index_uses_exact_case_and_takes_precedence(self):
        row = {'w': 'seal', 'p': ['selk-']}
        files = {'seal': Path('seal.png'), 'seal@selk': Path('seal@selk.png')}
        index = {('seal', 'selk-'): 'Seal@selk.png'}
        ledger = {('seal', 'selk-'): 'seal@selk.png'}
        self.assertIsNone(catalog.resolve_picture(row, files, {'seal': 2}, index, ledger))

    def test_unique_words_join_actual_inventory_without_suffix_guessing(self):
        files = {'apple': Path('apple.png'), 'orange_alt': Path('orange_alt.png')}
        self.assertEqual(catalog.resolve_picture({'w': 'apple'}, files, {'apple': 1}, {}, {}), 'apple')
        self.assertIsNone(catalog.resolve_picture({'w': 'orange'}, files, {'orange': 1}, {}, {}))

    def test_reading_requires_matching_meaning_and_exact_picture(self):
        readings = {'back': [
            {'ja': '背中', 'w': 'せなか'}, {'ja': '後ろ', 'w': 'うしろ'},
        ], 'seal': [{'ja': '封印', 'w': 'ふういん'}],
            'book': [{'ja': '本', 'w': 'もと'}],
            'lemon': [{'ja': 'レモン', 'w': 'れもん'}]}
        self.assertEqual(catalog.verified_reading('後ろ、戻って、支える', 'back', readings), '')
        self.assertEqual(catalog.verified_reading('アザラシ', 'seal@selk', readings), '')
        self.assertEqual(catalog.verified_reading('支える', 'back', readings), '')
        self.assertEqual(catalog.verified_reading('本、予約する', 'book', readings), '')
        self.assertEqual(catalog.verified_reading('レモン', 'lemon', readings), 'れもん')

    def test_puzzle_filters(self):
        valid = {'w': 'apple', 'pos': '名', 'ja': 'リンゴ'}
        self.assertTrue(catalog.eligible(valid))
        for update in ({'w': 'ice-cream'}, {'w': 'Paris'}, {'w': 'a'},
                       {'w': 'abcdefghijklmno'}, {'ja': ''}, {'pos': '名/助'},
                       {'w': 'orgasm'}, {'ja': '誤綴'}):
            self.assertFalse(catalog.eligible({**valid, **update}), update)

    def test_optional_ledger_preserves_filename_verbatim(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'ledger.csv'
            path.write_text('単語,語根,ファイル名\nseal,selk-,seal@selk.png\n', encoding='utf-8-sig')
            self.assertEqual(catalog.read_ledger([path])['seal', 'selk-'], 'seal@selk.png')


class ShippedCatalogTest(unittest.TestCase):
    def test_only_dated_exact_art_is_playable(self):
        audit = catalog.read_json(catalog.UPDATED_ART)
        allowed = {(word, filename) for word, roots, filename, date in audit}
        self.assertTrue(all(datetime.fromisoformat(row[3]) >= catalog.CUTOFF for row in audit))
        playable = [row for row in self.entries if row['updatedArt']]
        self.assertGreater(len(playable), 3000)
        self.assertTrue(any(bool(row['w']) for row in playable))
        # Missing first-sense readings are deliberately unready, never filled from later senses.
        for row in self.entries:
            self.assertEqual(row['updatedArt'], (row['en'], row['pic'] + '.png') in allowed)

    @classmethod
    def setUpClass(cls):
        cls.words = catalog.read_json(catalog.ROOT / 'app/data/generated-etymon/words.json')
        cls.japanese = catalog.read_json(catalog.ROOT / 'app/data/generated-etymon/word-suika-ja.json')
        cls.inventory = {path.stem: path for path in (catalog.ROOT / 'assets/word').glob('*.png')}
        cls.art_index = catalog.read_art_index(catalog.ROOT / 'assets/word/illustration-index.js')
        cls.ledger = catalog.read_ledger([])
        cls.entries = catalog.build_catalog(cls.words, cls.japanese, cls.inventory, cls.art_index, cls.ledger)

    def test_broad_catalogue_is_reproducible(self):
        self.assertGreater(len(self.entries), 3000)
        self.assertGreater(sum(bool(row['w']) for row in self.entries), 100)
        self.assertEqual(catalog.render_catalog(self.entries),
                         (catalog.HERE / 'catalog.js').read_text(encoding='utf-8'))

    def test_every_page_has_a_unique_answer_id_and_real_exact_artwork(self):
        for field in ('en', 'id', 'pic'):
            self.assertEqual(len({row[field] for row in self.entries}), len(self.entries), field)
        for row in self.entries:
            with self.subTest(word=row['en']):
                self.assertRegex(row['en'], r'^[a-z]{2,14}$')
                self.assertEqual(self.inventory[row['pic']].name, row['pic'] + '.png')
                with self.inventory[row['pic']].open('rb') as image:
                    self.assertEqual(image.read(8), b'\x89PNG\r\n\x1a\n')
                if row['w']:
                    self.assertRegex(row['w'], r'^[ぁ-ゔー]{2,14}$')

    def test_original_collection_ids_and_answers_survive(self):
        by_pair = {(row['w'], row['pic']): row for row in self.japanese}
        for row, pair in zip(self.entries[:80], catalog.LEGACY_CHOICES):
            self.assertEqual((row['w'], row['pic']), pair)
            self.assertEqual(row['ja'], by_pair[pair]['ja'])
            self.assertEqual(row['id'], pair[1])
        self.assertEqual(self.entries[0]['id'], 'rabbit')
        self.assertEqual(self.entries[79]['id'], 'democracy')

    def test_new_pages_retain_exact_dictionary_meaning_and_sense(self):
        counts = catalog.Counter(row['w'] for row in self.words)
        for row in self.entries[80:]:
            source = self.words[row['dictionaryIndex']]
            self.assertEqual(row['en'], source['w'])
            self.assertEqual(row['ja'], source['ja'])
            self.assertEqual(row['roots'], source.get('p', []))
            self.assertEqual(row['rank'], source['r'])
            self.assertEqual(row['pic'], catalog.resolve_picture(
                source, self.inventory, counts, self.art_index, self.ledger))
            self.assertTrue(catalog.eligible(source))


if __name__ == '__main__':
    unittest.main()

