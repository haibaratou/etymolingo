"""Past/participle-only dictionary senses are not standalone puzzle or art targets.

A form with an independent adjective/noun sense remains a separate dictionary
sense and may be used for its own visual meaning. Do not infer inflections from
spelling (e.g. -ed) alone. The original dictionary rows remain untouched.
"""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

FORM_GLOSS = re.compile(
    r"^(?:past(?:\s+tense)?(?:\s+and\s+past\s+participle)?|"
    r"past\s+participle|past\s+form|simple\s+past(?:\s+tense)?|"
    r"preterite)\s+of\s+[a-z][a-z'-]*\b",
    re.IGNORECASE,
)
JA_FORM = re.compile(r"(?:\b[A-Za-z]+\s*の過去(?:形|分詞)?|過去形(?:・過去分詞)?|過去分詞)")
IRREGULAR_GLOSSED_AS_ACTION = frozenset({'went', 'was', 'were'})


def is_simple_inflection_only(row: dict) -> bool:
    """True only when this dictionary sense represents an inflection alone."""
    word = str(row.get('w') or '').strip().lower()
    pos = str(row.get('pos') or '')
    en = str(row.get('en') or '').strip()
    ja = str(row.get('ja') or '').strip()
    parts = [piece.strip() for piece in en.split(' / ') if piece.strip()]
    if parts and all(FORM_GLOSS.match(piece) for piece in parts):
        return True
    if not parts and JA_FORM.search(ja) and '動' in pos.split('/'):
        return True
    # The legacy database occasionally paraphrases grammatical forms as verbs
    # ('went' = 'traveled') without explicitly naming the underlying lemma.
    if word in IRREGULAR_GLOSSED_AS_ACTION and pos.split('/') == ['動']:
        return True
    return False


def first_sense_is_inflection(row: dict) -> bool:
    """Hold artwork when the first dictionary sense is just an inflection."""
    first = str(row.get('en') or '').strip().split(' / ')[0].strip()
    return bool(FORM_GLOSS.match(first)) or is_simple_inflection_only(row)


def audit_prompt_csv(path: Path) -> list[tuple[int, str]]:
    """Read existing 19-column art prompts; do not rewrite the user's CSV."""
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = csv.DictReader(stream)
        required = {'単語', '語義', '第一英語義'}
        if not required.issubset(rows.fieldnames or []):
            raise ValueError('Required prompt columns are missing: 単語, 語義, 第一英語義')
        return [
            (number, row['単語'])
            for number, row in enumerate(rows, start=2)
            if first_sense_is_inflection({
                'w': row['単語'], 'ja': row['語義'],
                'en': row['第一英語義'], 'pos': ''
            })
        ]


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fail if an image prompt is for a simple past/participle form.')
    parser.add_argument('csv_file', type=Path)
    args = parser.parse_args()
    flagged = audit_prompt_csv(args.csv_file)
    for line, word in flagged:
        print(f'EXCLUDE line {line}: {word}')
    print(f'Inflection-only/inflection-first prompt candidates: {len(flagged)}')
    raise SystemExit(1 if flagged else 0)
