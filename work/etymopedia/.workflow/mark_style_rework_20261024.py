import json
import pathlib
import sys

P = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(P))
import workflow_io as w

C = P / 'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv'
W = P / '.workflow'
names = set()
for file in W.glob('resume_*20261024.json'):
    if '_v2_' in file.name:
        continue
    for item in json.loads(file.read_text(encoding='utf-8')):
        names.add(item['filename'])
_, _, rows = w.read_csv(C)
by_name = {row['ファイル名']: row for row in rows}
for name in sorted(names):
    row = by_name[name]
    if row['制作状態'] != 'reviewed':
        print('skip', name, row['制作状態'])
        continue
    token = json.loads(w.state_path(C).read_bytes())['token']
    note = row.get('検品メモ', '')
    note += ' | 画風再制作待ち: 既存画像より均一なベクター風・高彩度。旧画像を保持。'
    result = w.record(C, token, w.key(row), {'制作状態': 'needs_revision', '検品メモ': note})
    print('marked', name, result['state'])
print('total', len(names))
