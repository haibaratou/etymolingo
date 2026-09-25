"""Rebuild the reviewed picture-word catalog from Word Suika's exported dictionary.

Run from any directory: python app/games/picture-words/build_catalog.py
Only reads generated game data, never the source dictionary under data/pie.
"""
import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
# Explicit sense selection: a reading alone is not a safe image lookup key.
CHOICES = [
    ('うさぎ', 'rabbit'), ('はな', 'flower'), ('つき', 'moon'),
    ('ねこ', 'cat'), ('かさ', 'umbrella'), ('ほし', 'star'),
    ('きつね', 'fox'), ('くも', 'cloud'), ('さかな', 'fish'), ('いぬ', 'dog'),
    ('ばなな', 'banana'), ('ぶどう', 'grape'), ('もも', 'peach'),
    ('たまご', 'egg'), ('にんじん', 'carrot'), ('ぱん', 'bread'),
    ('けーき', 'cake'), ('くっきー', 'cookie'), ('ちーず', 'cheese'),
    ('はちみつ', 'honey'), ('きりん', 'giraffe'), ('らいおん', 'lion'),
    ('うま', 'horse'), ('ひつじ', 'sheep'), ('ぱんだ', 'panda'),
    ('ぺんぎん', 'penguin'), ('かも', 'duck'), ('かめ', 'turtle'),
    ('かに', 'crab'), ('たこ', 'octopus'), ('かぎ', 'key'), ('いす', 'chair'),
    ('くつ', 'shoe'), ('とけい', 'clock'), ('ぼとる', 'bottle'), ('さじ', 'spoon'),
    ('ゆびわ', 'ring'), ('かめら', 'camera'), ('えんぴつ', 'pencil'),
    ('はさみ', 'scissors'), ('やま', 'mountain'), ('うみ', 'sea'),
    ('かわ', 'river'), ('はし', 'bridge'), ('しろ', 'castle'),
    ('はね', 'feather'), ('はっぱ', 'leaf'), ('じゃがいも', 'potato'),
    ('ちょう', 'butterfly'), ('おちゃ', 'tea'), ('くるま', 'car'),
    ('ひこうき', 'plane'), ('じてんしゃ', 'bicycle'), ('ばす', 'bus'),
    ('ぴあの', 'piano'), ('ぎたー', 'guitar'), ('きのこ', 'mushroom'),
    ('かぼちゃ', 'pumpkin'), ('にんにく', 'garlic'), ('すいか', 'watermelon'),
    ('おんどけい', 'thermometer'), ('れいぞうこ', 'refrigerator'),
    ('せいざ', 'constellation'), ('そうぞうりょく', 'imagination'),
    ('てつがく', 'philosophy'), ('どくりつ', 'independence'),
    ('へんよう', 'transformation'), ('むじゅん', 'contradiction'),
    ('へりこぷたー', 'helicopter'), ('せんすいかん', 'submarine'),
    ('かんげんがくだん', 'orchestra'), ('まんじょういっち', 'unanimity'),
    ('ぜんだいみもん', 'unprecedented'), ('そうかんかんけい', 'correlation'),
    ('かがくぎじゅつ', 'technology'), ('こうせいぶっしつ', 'antibiotic'),
    ('しゃしんさつえい', 'photography'), ('おうだんほどう', 'crosswalk'),
    ('しぜんかんきょう', 'environment'), ('みんしゅしゅぎ', 'democracy'),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dictionary', type=Path, default=ROOT / 'app/data/generated-etymon/word-suika-ja.json',
                        help='Word Suika Japanese exported dictionary (required only when rebuilding).')
    args = parser.parse_args()
    if not args.dictionary.is_file():
        parser.error('Provide the Word Suika exported word-suika-ja.json with --dictionary. The game itself uses catalog.js.')
    rows = json.loads(args.dictionary.read_text(encoding='utf-8'))
    lookup = {(row['w'], row.get('pic')): row for row in rows}
    # Check spelling and case on case-insensitive hosts as well.
    filenames = {path.name for path in (ROOT / 'assets/word').glob('*.png')}
    selected = []
    for index, (reading, picture) in enumerate(CHOICES):
        row = lookup[(reading, picture)]
        assert picture + '.png' in filenames, f'Missing exact image filename: {picture}'
        word = {**row, 'en': picture, 'id': picture}
        if index >= 60: word['challengeBand'] = 1 if index < 70 else 2
        selected.append(word)
    text = '// Curated from generated-etymon/word-suika-ja.json; retain exact w, ja, and pic.\n'
    text += 'window.PICTURE_WORDS_CATALOG = ' + json.dumps(selected, ensure_ascii=False, indent=2) + ';\n'
    (HERE / 'catalog.js').write_text(text, encoding='utf-8')
    print(f'Wrote {len(selected)} reviewed dictionary/image pairs.')


if __name__ == '__main__':
    main()
