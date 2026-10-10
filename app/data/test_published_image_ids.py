"""Published image IDs must survive ownership and canonical exclusion changes."""
import json
from pathlib import Path
import sys
import unittest

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parents[1]
sys.path[:0] = [str(HERE), str(PUBLIC / 'app/games/picture-words')]
import test_refresh_reviewed_catalog as fixture
import build_generated_image_catalog as C


class PublishedImageIDTests(unittest.TestCase):
    setUp = fixture.ProducerTests.setUp
    save = fixture.ProducerTests.save

    def maps(self, rows):
        fixture.dump(self.root / 'app/data/generated-image-legacy-ids.json',
                     {'schema': 1, 'rows': [], 'publishedIdMappings': rows})

    def test_primary_keeps_previously_unresolved_image_id(self):
        self.maps([{'art': 'cat', 'id': 'asset:cat'}])
        rows = C.build_catalog_rows(self.root)[0]
        cat = next(row for row in rows if row['pic'] == 'cat')
        self.assertEqual((cat['id'], cat['en'], cat['bindingStatus']), ('asset:cat', 'cat', 'bound'))
        self.assertTrue(cat['availability']['en']['playable'])

    def test_excluded_word_keeps_id_without_restoring_canonical_meaning(self):
        self.words = [word for word in self.words if word['w'] != 'cat']
        self.save()
        self.maps([{'art': 'cat', 'id': 'cat'}])
        cat = next(row for row in C.build_catalog_rows(self.root)[0] if row['pic'] == 'cat')
        self.assertEqual((cat['id'], cat['en'], cat['bindingStatus']), ('cat', '', 'ownership_pending'))
        self.assertFalse(cat['availability']['en']['playable'])

    def test_old_primary_and_new_primary_keep_separate_original_image_ids(self):
        (self.root / 'assets/word/cat@new.png').write_bytes((self.root / 'assets/word/cat.png').read_bytes())
        (self.root / 'assets/word/illustration-index.js').write_text('globalThis.ETYMON_WORD_ART = ' + json.dumps({'["cat",""]': 'cat@new', '["I","eg"]': 'i'}) + ';')
        self.maps([{'art': 'cat', 'id': 'cat'}, {'art': 'cat@new', 'id': 'asset:cat@new'}])
        rows = {row['pic']: row for row in C.build_catalog_rows(self.root)[0]}
        self.assertEqual((rows['cat']['id'], rows['cat']['bindingStatus']), ('cat', 'alternate'))
        self.assertEqual((rows['cat@new']['id'], rows['cat@new']['bindingStatus']), ('asset:cat@new', 'bound'))

    def test_missing_duplicate_unsafe_and_colliding_mappings_fail_closed(self):
        cases = [
            [{'art': 'missing', 'id': 'missing'}],
            [{'art': 'cat', 'id': 'old'}, {'art': 'cat', 'id': 'new'}],
            [{'art': 'cat', 'id': 'same'}, {'art': 'unbound', 'id': 'same'}],
            [{'art': 'cat', 'id': '__proto__'}],
            [{'art': 'cat', 'id': ''}],
            [{'art': 'cat', 'id': 'i'}],
        ]
        for rows in cases:
            with self.subTest(rows=rows):
                self.maps(rows)
                with self.assertRaises(ValueError):
                    C.build_catalog_rows(self.root)


if __name__ == '__main__':
    unittest.main()
