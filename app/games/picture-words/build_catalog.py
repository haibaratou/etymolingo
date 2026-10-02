"""Build Picture Words from the explorer's public dictionary and existing artwork.

Run from any directory: python app/games/picture-words/build_catalog.py
Only reads generated runtime data; never reads the source data/pie directory.
Exact sense filenames come from illustration-index.js and the ledger snapshot below.
An unambiguous spelling may also join an actual inventory filename, as the explorer
itself does. No filenames, Japanese readings, meanings, or etymologies are invented.
"""
import argparse
from collections import Counter, defaultdict
import csv
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
MAX_LETTERS = 14
# Retain these reviewed answers and IDs so existing collections remain valid.
LEGACY_CHOICES = [
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

# Exact filenames copied from tools/word-art-todo.csv (2026-10-03).
# Store only exceptional/sense-specific mappings so a public checkout can rebuild
# without the private tools directory. --art-ledger can add future ledger entries.
LEDGER_SENSE_ART = [
    ('added', 'ad-+dō-', 'added@ad-do.png'),
    ('art', 'ar-', 'art@ar.png'),
    ('ash', 'as-', 'ash@as.png'),
    ('ash', 'os-', 'ash@os.png'),
    ('ass', 'asinus', 'ass@asinus.png'),
    ('ass', 'ors-', 'ass@ors.png'),
    ('ate', '', 'ate@x.png'),
    ('ate', 'ed-', 'ate@ed.png'),
    ('band', 'bhendh-', 'band@bhendh.png'),
    ('bass', 'bhars-1', 'bass@bhars1.png'),
    ('bay', 'badyo-', 'bay@badyo.png'),
    ('bay', 'bat-', 'bay@bat.png'),
    ('bear', 'bher-1', 'bear@bher1.png'),
    ('bear', 'bher-3', 'bear@bher3.png'),
    ('bee', 'bhei-+bhā-2', 'bee@bhei-bha2.png'),
    ('bill', 'beu-', 'bill@beu.png'),
    ('blessed', 'bhel-3', 'blessed@bhel3.png'),
    ('blown', '', 'blown@x.png'),
    ('blown', 'bhlē-2', 'blown@bhle2.png'),
    ('bore', 'bher-2', 'bore@bher2.png'),
    ('borne', 'bher-1', 'borne@bher1.png'),
    ('bowl', 'bhel-2', 'bowl@bhel2.png'),
    ('bull', 'bhel-2', 'bull@bhel2.png'),
    ('burn', 'bhreuə-', 'burn@bhreue.png'),
    ('burn', 'gʷher-', 'burn@gwher.png'),
    ('bust', 'bhres-', 'bust@bhres.png'),
    ('chord', 'gherə-', 'chord@ghere.png'),
    ('con', 'kom', 'con_word@kom.png'),
    ('corn', 'gr̥ə-no-', 'corn@greno.png'),
    ('count', 'kom+ei-', 'count@kom-ei.png'),
    ('counter', 'kom+pau-2', 'counter@kom-pau2.png'),
    ('crawl', 'gerbh-', 'crawl@gerbh.png'),
    ('desert', 'de-+ser-3', 'desert@de-ser3.png'),
    ('die', 'dō-', 'die@do.png'),
    ('dock', 'deuk-', 'dock@deuk.png'),
    ('dock', 'dheu-1', 'dock@dheu1.png'),
    ('down', 'dheu-1', 'down@dheu1.png'),
    ('dug', 'dhīgʷ-', 'dug@dhigw.png'),
    ('earn', 'es-en-', 'earn@esen.png'),
    ('egg', 'awi-', 'egg@awi.png'),
    ('elder', 'al-3', 'elder@al3.png'),
    ('fan', 'dhēs-', 'fan@dhes.png'),
    ('fan', 'wet-1', 'fan@wet1.png'),
    ('fay', 'bhā-2', 'fay@bha2.png'),
    ('feet', 'ped-', 'feet@ped.png'),
    ('file', 'pū̆-2', 'file@pu2.png'),
    ('foil', 'bhel-3', 'foil@bhel3.png'),
    ('forbidden', '', 'forbidden@x.png'),
    ('found', 'gheu-', 'found@gheu.png'),
    ('frozen', '', 'frozen@x.png'),
    ('frozen', 'preus-', 'frozen@preus.png'),
    ('full', 'pelə-1', 'full@pele1.png'),
    ('glance', 'gel-2', 'glance@gel2.png'),
    ('glance', 'ghel-2', 'glance@ghel2.png'),
    ('grave', 'ghrebh-2', 'grave@ghrebh2.png'),
    ('halt', 'kel-3', 'halt@kel3.png'),
    ('heard', '', 'heard@x.png'),
    ('heard', 'kous-', 'heard@kous.png'),
    ('hide', '(s)keu-', 'hide@skeu.png'),
    ('hip', 'keu-2', 'hip@keu2.png'),
    ('hold', 'kel-2', 'hold@kel2.png'),
    ('hop', 'keu-2', 'hop@keu2.png'),
    ('housing', '(s)keu-', 'housing@skeu.png'),
    ('hung', 'konk-', 'hung@konk.png'),
    ('impress', 'en+per-4', 'impress@en-per4.png'),
    ('incorporate', 'en+kʷrep-', 'incorporate@en-kwrep.png'),
    ('inform', 'en+merph-', 'inform@en-merph.png'),
    ('irony', 'werə-3', 'irony@were3.png'),
    ('lake', 'laku-', 'lake@laku.png'),
    ('lap', 'lab-', 'lap@lab.png'),
    ('lap', 'leb-2', 'lap@leb2.png'),
    ('leave', 'leip-', 'leave@leip.png'),
    ('leave', 'leubh-', 'leave@leubh.png'),
    ('left', '', 'left@x.png'),
    ('link', 'leuk-', 'link@leuk.png'),
    ('low', 'legh-', 'low@legh.png'),
    ('mail', 'molko-', 'mail@molko.png'),
    ('mare', 'mori-', 'mare@mori.png'),
    ('match', 'mag-', 'match@mag.png'),
    ('match', 'meug-', 'match@meug.png'),
    ('meal', 'mē-2', 'meal@me2.png'),
    ('mean', 'medhyo-', 'mean@medhyo.png'),
    ('mean', 'mei-no-', 'mean@meino.png'),
    ('meet', 'mōd-', 'meet@mod.png'),
    ('mental', 'men-1', 'mental@men1.png'),
    ('mere', 'mori-', 'mere@mori.png'),
    ('met', '', 'met@x.png'),
    ('met', 'mōd-', 'met@mod.png'),
    ('mill', 'gheslo-', 'mill@gheslo.png'),
    ('mill', 'melə-', 'mill@mele.png'),
    ('mold', 'med-', 'mold@med.png'),
    ('mole', 'mai-2', 'mole@mai2.png'),
    ('mood', 'mē-1', 'mood@me1.png'),
    ('mystery', 'meuə-3', 'mystery@meue3.png'),
    ('neat', 'nei-', 'neat@nei.png'),
    ('net', 'ned-', 'net@ned.png'),
    ('no', 'ne+oi-no-', 'no@ne-oino.png'),
    ('ought', 'aiw-', 'ought@aiw.png'),
    ('ounce', 'oi-no-', 'ounce@oino.png'),
    ('pace', 'pag-', 'pace@pag.png'),
    ('pace', 'petə-', 'pace@pete.png'),
    ('pan', 'per-2', 'pan@per2.png'),
    ('pan', 'petə-', 'pan@pete.png'),
    ('peer', 'perə-2', 'peer@pere2.png'),
    ('pen', 'pet-', 'pen@pet.png'),
    ('pie', 'ped-', 'pie@ped.png'),
    ('pile', 'peis-1', 'pile@peis1.png'),
    ('pile', 'pilo-', 'pile@pilo.png'),
    ('pine', 'kʷei-1', 'pine@kwei1.png'),
    ('pine', 'peiə-', 'pine@peie.png'),
    ('pole', 'kʷel-1', 'pole@kwel1.png'),
    ('pole', 'pag-', 'pole@pag.png'),
    ('policy', 'apo-+deik-', 'policy@apo-deik.png'),
    ('policy', 'pelə-3', 'policy@pele3.png'),
    ('post', 'per1+stā-', 'post@per1-sta.png'),
    ('pound', '(s)pen-', 'pound@spen.png'),
    ('prize', 'per-5', 'prize@per5.png'),
    ('pulse', 'pel-1', 'pulse@pel1.png'),
    ('pulse', 'pel-6', 'pulse@pel6.png'),
    ('punch', 'penkʷe', 'punch@penkwe.png'),
    ('punch', 'peuk-', 'punch@peuk.png'),
    ('rack', 'reg-', 'rack@reg.png'),
    ('rack', 'wreg-', 'rack@wreg.png'),
    ('rank', '(s)ker-3', 'rank@sker3.png'),
    ('rank', 'reg-', 'rank@reg.png'),
    ('rash', 'rēd-', 'rash@red.png'),
    ('real', 'reg-', 'real@reg.png'),
    ('real', 'rē-', 'real@re.png'),
    ('refrain', 're-+ghrendh-', 'refrain@re-ghrendh.png'),
    ('reveal', 're-+weg-1', 'reveal@re-weg1.png'),
    ('riding', 'reidh-', 'riding@reidh.png'),
    ('riding', 'trei-', 'riding@trei.png'),
    ('ring', 'ker-2', 'ring@ker2.png'),
    ('rocket', 'ghers-', 'rocket@ghers.png'),
    ('rocket', 'ruk-', 'rocket@ruk.png'),
    ('rode', 'reidh-', 'rode@reidh.png'),
    ('row', 'rei-1', 'row@rei1.png'),
    ('rush', 're-', 'rush@re.png'),
    ('rush', 'rezg-', 'rush@rezg.png'),
    ('sage', 'sep-', 'sage@sep.png'),
    ('school', '(s)kel-1', 'school@skel1.png'),
    ('school', 'segh-', 'school@segh.png'),
    ('seal', 'selk-', 'seal@selk.png'),
    ('seal', 'sāg-', 'seal@sag.png'),
    ('sent', '', 'sent@x.png'),
    ('sent', 'sent-', 'sent@sent.png'),
    ('set', 'sekʷ-1', 'set@sekw1.png'),
    ('shed', 'skei-', 'shed@skei.png'),
    ('shed', 'skot-', 'shed@skot.png'),
    ('sheer', 'skai-2', 'sheer@skai2.png'),
    ('sic', 'so-+ko-', 'sic@so-ko.png'),
    ('slip', '(s)lei-', 'slip@slei.png'),
    ('slip', 'sleubh-', 'slip@sleubh.png'),
    ('sole', 's(w)e-', 'sole@swe.png'),
    ('sole', 'sel-1', 'sole@sel1.png'),
    ('sound', 'swen-', 'sound@swen.png'),
    ('sound', 'swen-to-', 'sound@swento.png'),
    ('spoken', 'spreg-1', 'spoken@spreg1.png'),
    ('sprang', '', 'sprang@x.png'),
    ('sprang', 'spergh-', 'sprang@spergh.png'),
    ('stall', 'stel-', 'stall@stel.png'),
    ('stay', 'stāk-', 'stay@stak.png'),
    ('stern', 'ster-1', 'stern@ster1.png'),
    ('stir', '(s)twer-1', 'stir@stwer1.png'),
    ('strain', 'streig-', 'strain@streig.png'),
    ('sunk', 'sengʷ-', 'sunk@sengw.png'),
    ('swept', '', 'swept@x.png'),
    ('swept', 'swei-2', 'swept@swei2.png'),
    ('taken', 'tak-2', 'taken@tak2.png'),
    ('tear', 'dakru-', 'tear@dakru.png'),
    ('tear', 'der-2', 'tear@der2.png'),
    ('temple', 'temp-', 'temple@temp.png'),
    ('temple', 'temə-1', 'temple@teme1.png'),
    ('utterance', 'ud-', 'utterance@ud.png'),
    ('vent', 'eghs+wē-', 'vent@eghs-we.png'),
    ('wake', 'weg-2', 'wake@weg2.png'),
    ('wake', 'wegʷ-', 'wake@wegw.png'),
    ('wax', 'wokso-', 'wax@wokso.png'),
    ('ways', 'wegh-', 'ways@wegh.png'),
    ('well', 'wel-3', 'well@wel3.png'),
    ('withdrawn', '', 'withdrawn@x.png'),
    ('withdrawn', 'wi-+dhragh-', 'withdrawn@wi-dhragh.png'),
    ('woke', '', 'woke@x.png'),
    ('woke', 'weg-2', 'woke@weg2.png'),
    ('written', '', 'written@x.png'),
    ('written', 'wreid-', 'written@wreid.png'),
    ('yard', 'ghazdh-o-', 'yard@ghazdho.png'),
    ('yard', 'gher-1', 'yard@gher1.png'),
]

# Family puzzle exclusions are explicit and reviewable; anatomy/science in general
# is still eligible. Function words and entries without a usable meaning are not.
EXCLUDED_WORDS = frozenset('''
ass asshole bastard bitch blowjob cock cunt dildo ejaculation erotic fuck fucking
genital genitals intercourse masturbation orgasm penis porn pornography prostitute
prostitution pussy rape rapist semen sexy sexuality shit slut sperm vagina vaginal whore
'''.split())
EXCLUDED_MEANING = re.compile(r'誤字|誤記|誤綴|廃語|侮蔑語|差別語|陰茎|性交|膣|腟|自慰|射精|強姦|わいせつ')
CONTENT_POS = {'名', '動', '形'}
FUNCTION_POS = {'冠', '代', '助', '前', '接'}


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def identity(row):
    return row['w'], '+'.join(row.get('p', []))


def read_art_index(path):
    text = path.read_text(encoding='utf-8-sig').strip()
    prefix = 'globalThis.ETYMON_WORD_ART = '
    if not text.startswith(prefix) or not text.endswith(';'):
        raise ValueError('Expected the public ETYMON_WORD_ART JSON assignment.')
    return {tuple(json.loads(key)): stem + '.png'
            for key, stem in json.loads(text[len(prefix):-1]).items()}


def read_ledger(paths):
    result = {(word, roots): filename for word, roots, filename in LEDGER_SENSE_ART}
    for path in paths:
        with path.open(encoding='utf-8-sig', newline='') as file:
            rows = csv.DictReader(file)
            if not {'単語', '語根', 'ファイル名'}.issubset(rows.fieldnames or []):
                raise ValueError('Art ledger must contain 単語, 語根, ファイル名 columns.')
            for row in rows:
                result[row['単語'], row['語根']] = row['ファイル名']
    return result


def normalized_japanese(text):
    return ''.join(chr(ord(ch) - 0x60) if 'ァ' <= ch <= 'ヶ' else ch for ch in text).strip()


def verified_reading(meaning, picture, readings):
    # A picture can have many unrelated Japanese export candidates (e.g. back).
    # Require an exact source meaning/meaning component instead of choosing the
    # first reading, and preserve the complete source meaning on the card. The
    # export sometimes chose an unrelated kanji reading (book: 本 -> もと), so
    # new Japanese answers also require a directly written kana source. Reviewed
    # legacy choices remain available regardless of this conservative new rule.
    meanings = {normalized_japanese(meaning)}
    meanings.update(normalized_japanese(part) for part in re.split('[、,／/;；]', meaning))
    matching = [row for row in readings.get(picture, [])
                if re.fullmatch(r'[ぁ-ゔー]{2,14}', row.get('w', ''))
                and normalized_japanese(row.get('ja', '')) == row['w']
                and normalized_japanese(row.get('ja', '')) in meanings]
    if not matching:
        return ''
    return min(matching, key=lambda row: (len(row['w']), row['w']))['w']


def eligible(row):
    word = row.get('w', '')
    positions = set(row.get('pos', '').split('/'))
    return bool(re.fullmatch(r'[a-z]{2,14}', word)
                and word not in EXCLUDED_WORDS
                and positions & CONTENT_POS
                and not positions & FUNCTION_POS
                and row.get('ja', '').strip()
                and not EXCLUDED_MEANING.search(row['ja']))


def resolve_picture(row, inventory, spelling_counts, art_index, ledger):
    key = identity(row)
    if key in art_index:
        filename = art_index[key]
    elif key in ledger:
        filename = ledger[key]
    elif spelling_counts[row['w']] == 1 and row['w'] in inventory:
        # Use the actual observed path's name verbatim. In particular, do not
        # strip accents/case/suffixes or invent a filename for a homograph.
        filename = inventory[row['w']].name
    else:
        return None
    path = inventory.get(Path(filename).stem)
    return path.stem if path and path.name == filename else None


def build_catalog(words, japanese, inventory, art_index, ledger):
    readings = defaultdict(list)
    for row in japanese:
        readings[row.get('pic', '')].append(row)
    japanese_lookup = {(row['w'], row.get('pic')): row for row in japanese}
    spelling_counts = Counter(row['w'] for row in words)
    by_spelling = defaultdict(list)
    for index, row in enumerate(words):
        by_spelling[row['w']].append((index, row))
    selected = []
    for index, (reading, picture) in enumerate(LEGACY_CHOICES):
        source = japanese_lookup[reading, picture]
        assert picture in inventory, f'Missing reviewed artwork: {picture}'
        row = {**source, 'en': picture, 'id': picture}
        if index >= 60:
            row['challengeBand'] = 1 if index < 70 else 2
        matches = by_spelling.get(picture, [])
        if matches:
            row['rank'] = min(source.get('r', 9999) for _, source in matches)
        selected.append(row)
    seen_words = {row['en'] for row in selected}
    seen_pictures = {row['pic'] for row in selected}
    candidates = []
    for index, source in enumerate(words):
        if not eligible(source) or source['w'] in seen_words:
            continue
        picture = resolve_picture(source, inventory, spelling_counts, art_index, ledger)
        if not picture:
            continue
        candidates.append((source.get('r', 9999), index, source, picture))
    # One spelling / illustration per page: a homograph never disguises a repeated
    # spelling as a newly discovered word. Its exact selected sense stays attached.
    for rank, index, source, picture in sorted(candidates, key=lambda entry: entry[:2]):
        if source['w'] in seen_words or picture in seen_pictures:
            continue
        selected.append({
            'w': verified_reading(source['ja'], picture, readings),
            'ja': source['ja'], 'pic': picture, 'en': source['w'], 'id': picture,
            'rank': rank, 'roots': source.get('p', []), 'dictionaryIndex': index,
        })
        seen_words.add(source['w'])
        seen_pictures.add(picture)
    assert len({row['id'] for row in selected}) == len(selected)
    return selected


def render_catalog(selected):
    header = '// Generated from the explorer public dictionary and exact existing artwork.\n'
    header += '// Rebuild with build_catalog.py; the first 80 IDs preserve existing collections.\n'
    # One entry per line keeps the 7,000+ page catalogue small and reviewable.
    return header + 'window.PICTURE_WORDS_CATALOG = [\n' + ',\n'.join(
        '  ' + json.dumps(row, ensure_ascii=False, separators=(',', ':'))
        for row in selected) + '\n];\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dictionary', type=Path, default=ROOT / 'app/data/generated-etymon/word-suika-ja.json',
                        help='Export containing verified Japanese readings (legacy option name retained).')
    parser.add_argument('--words', type=Path, default=ROOT / 'app/data/generated-etymon/words.json')
    parser.add_argument('--images', type=Path, default=ROOT / 'assets/word')
    parser.add_argument('--illustration-index', type=Path, default=ROOT / 'assets/word/illustration-index.js')
    parser.add_argument('--art-ledger', type=Path, action='append', default=[],
                        help='Optional current word-art-todo.csv; uses its exact filename column.')
    parser.add_argument('--output', type=Path, default=HERE / 'catalog.js')
    parser.add_argument('--check', action='store_true', help='Verify the checked-in catalogue without modifying it.')
    args = parser.parse_args()
    for path in (args.dictionary, args.words, args.illustration_index, *args.art_ledger):
        if not path.is_file():
            parser.error(f'Missing input: {path}')
    inventory = {path.stem: path for path in args.images.glob('*.png')}
    if not inventory:
        parser.error('No PNG artwork found; refusing to generate an empty catalogue.')
    words = read_json(args.words)
    selected = build_catalog(words, read_json(args.dictionary), inventory,
                             read_art_index(args.illustration_index), read_ledger(args.art_ledger))
    text = render_catalog(selected)
    if args.check:
        if not args.output.is_file() or args.output.read_text(encoding='utf-8') != text:
            parser.error('catalog.js is out of date; rebuild it first.')
    else:
        args.output.write_text(text, encoding='utf-8')
    print(f'{"Verified" if args.check else "Wrote"} {len(selected):,} unique English/image pairs; '
          f'{sum(bool(row["w"]) for row in selected):,} have verified Japanese answers. '
          f'All English answers use 2-{MAX_LETTERS} letters; all artwork exists.')


if __name__ == '__main__':
    main()
