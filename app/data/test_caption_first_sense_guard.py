"""Regression: incomplete source sense keeps its scene but cannot gain runtime speech."""
import copy
from pathlib import Path
import sys
import unittest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build_generated_image_catalog as catalog


class CaptionFirstSenseGuardTests(unittest.TestCase):
    def fixture(self, ja='本', en='book'):
        word = {'w': 'book', 'p': ['bhago-'], 'ja': ja, 'en': en}
        image = {'path': 'assets/word/book.png', 'sha256': 'a' * 64, 'git_blob_sha': 'b' * 40}
        entry = {'status': 'reviewed', 'review': {'status': 'reviewed'}, 'sense': catalog.sense_of(word),
                 'image': image.copy(), 'scene': {'en': 'An open book lies on the table.', 'ja': '開いた本が机の上にある。'}}
        return entry, word, image

    def test_missing_first_sense_is_held_without_source_mutation(self):
        for ja, en in [('本', ''), ('', 'book'), ('本', '  '), (' ', 'book'), ('', '')]:
            with self.subTest(ja=ja, en=en):
                entry, word, image = self.fixture(ja, en)
                original = copy.deepcopy(entry)
                self.assertEqual(catalog.validate_caption(entry, word, 'book', image),
                                 (None, 'held', 'canonical_first_sense_missing'))
                self.assertEqual(entry, original)

    def test_complete_first_sense_remains_reviewed(self):
        entry, word, image = self.fixture()
        result, status, reason = catalog.validate_caption(entry, word, 'book', image)
        self.assertEqual((status, reason), ('reviewed', ''))
        self.assertEqual(result['scene'], entry['scene'])

    def test_missing_or_unreviewed_scene_retains_existing_reason(self):
        entry, word, image = self.fixture(en='')
        self.assertEqual(catalog.validate_caption(None, word, 'book', image),
                         (None, 'missing', 'caption_not_created'))
        entry['review']['status'] = 'candidate'
        self.assertEqual(catalog.validate_caption(entry, word, 'book', image),
                         (None, 'held', 'caption_not_reviewed'))


if __name__ == '__main__':
    unittest.main()
