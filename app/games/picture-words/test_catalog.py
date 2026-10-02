"""Catalogue regressions: exact art senses, source meanings, and broad coverage."""
import json
from pathlib import Path
import tempfile
import unittest

import build_catalog as catalog


class CatalogRulesTest(unittest.TestCase):
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
    @classmethod
    def setUpClass(cls):
        cls.words = catalog.read_json(catalog.ROOT / 'app/data/generated-etymon/words.json')
        cls.japanese = catalog.read_json(catalog.ROOT / 'app/data/generated-etymon/word-suika-ja.json')
        cls.inventory = {path.stem: path for path in (catalog.ROOT / 'assets/word').glob('*.png')}
        cls.art_index = catalog.read_art_index(catalog.ROOT / 'assets/word/illustration-index.js')
        cls.ledger = catalog.read_ledger([])
        cls.entries = catalog.build_catalog(cls.words, cls.japanese, cls.inventory, cls.art_index, cls.ledger)

    def test_broad_catalogue_is_reproducible(self):
        self.assertGreater(len(self.entries), 7000)
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
