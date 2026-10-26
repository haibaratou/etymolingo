import unittest
from inflection_policy import is_simple_inflection_only, first_sense_is_inflection


class InflectionPolicyTest(unittest.TestCase):
    def test_pure_past_and_participles_are_excluded(self):
        for w, en in [('wrote', 'past of write'), ('eaten', 'past participle of eat'),
                      ('sent', 'past and past participle of send'), ('bred', 'past form of breed'),
                      ('taken', 'past participle of take')]:
            self.assertTrue(is_simple_inflection_only({'w': w, 'pos': '動', 'en': en}), w)

    def test_irregular_legacy_paraphrases_are_excluded(self):
        for w in ('went', 'was', 'were'):
            self.assertTrue(is_simple_inflection_only({'w': w, 'pos': '動', 'en': 'traveled'}), w)

    def test_independent_senses_survive(self):
        examples = [
            {'w':'broken', 'pos':'形', 'ja':'壊れた', 'en':'damaged'},
            {'w':'frozen', 'pos':'形', 'ja':'凍った', 'en':'icy'},
            {'w':'saw', 'pos':'名', 'ja':'のこぎり', 'en':'cutting tool'},
            {'w':'found', 'pos':'動', 'ja':'設立する', 'en':'establish'},
            {'w':'candied', 'pos':'形', 'ja':'砂糖漬け', 'en':'coated with sugar'},
            {'w':'spat', 'pos':'名/動', 'ja':'口論、過去形', 'en':'quarrel / past of spit'},
        ]
        for row in examples:
            self.assertFalse(is_simple_inflection_only(row), row['w'])

    def test_inflection_first_mixed_sense_is_held_for_art_review(self):
        example = {'w': 'done', 'pos': '動/形', 'ja': 'doの過去分詞、終わった', 'en': 'past participle of do / finished'}
        self.assertFalse(is_simple_inflection_only(example))
        self.assertTrue(first_sense_is_inflection(example))

    def test_ordinary_past_word_is_not_false_positive(self):
        self.assertFalse(is_simple_inflection_only({'w':'history', 'pos':'名','en':'the story of the past'}))


if __name__=='__main__':
    unittest.main()
