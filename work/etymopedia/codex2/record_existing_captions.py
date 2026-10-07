"""Record visually audited captions for this chat's existing batch 028 PNGs."""
import csv
import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
import illustration_csv

BASE = Path(__file__).resolve().parent
ROOT = BASE.parent
history = json.loads((BASE / 'execution_prompt_history_028.json').read_text(encoding='utf-8'))
proposals = json.loads((BASE / 'caption_proposals_028.json').read_text(encoding='utf-8'))
with (BASE / 'prompt_rows_028.csv').open(encoding='utf-8-sig', newline='') as stream:
    rows = list(csv.DictReader(stream))

revisions = {
    5: ('The child spreads both arms as a bird would spread its wings.',
        '子供が鳥の羽のように両腕を広げている。'),
    8: ("The older man's photograph shows that he has been a sailor.",
        '年配の男性の写真に、船乗りだった姿が写っている。'),
    16: ('I have a teddy bear cradled in my arms.',
         '私はぬいぐるみのクマを腕に抱えている。'),
    24: ('The friends look at the soup as one points to it.',
         '二人がスープを見て、一人がそれを指している。'),
}
now = datetime.now(timezone(timedelta(hours=9))).isoformat(timespec='seconds')
results = []
for index, proposal in enumerate(proposals, 1):
    row = rows[index - 1]
    assert proposal['filename'] == row['ファイル名']
    if str(index) in history['edits']:
        actual = row['画像生成プロンプト'] + history['edit_prefix'] + history['edits'][str(index)]
    else:
        suffix = history['new_suffix'] if index >= history['new_suffix_from'] else history['old_suffix']
        actual = row['画像生成プロンプト'] + suffix
    if proposal['review'] == 'safety_hold':
        assert not (ROOT / '_illust' / 'prompt_rows_028' / row['ファイル名']).exists()
        values = {
            '実行プロンプト': actual, '制作状態': 'error',
            '検品メモ': proposal['note'] + ' 元プロンプトを改変せず保留。request_id=a53284e9-4e20-4e75-bb64-f5a022447a01。原本未反映。',
        }
    else:
        english, japanese = revisions.get(index, (proposal['en'], proposal['ja']))
        data = (ROOT / '_illust' / 'prompt_rows_028' / row['ファイル名']).read_bytes()
        values = {
            '実行プロンプト': actual, '解説英語': english, '解説日本語': japanese,
            '制作状態': 'needs_revision' if proposal['review'] == 'needs_revision' else ('generated' if index >= 31 else 'reviewed'),
            '画像SHA256': hashlib.sha256(data).hexdigest(),
            '画像GitBlobSHA': hashlib.sha1(b'blob ' + str(len(data)).encode('ascii') + b'\0' + data).hexdigest(),
            '検品日時': now,
            '検品メモ': proposal['note'] + ' 実画像と第一語義・日英解説を照合。英語は正確な見出し語を含む。'
                      + (' 完成512pxの白/濃紺/ピンク背景検品の最終確認待ち。' if index >= 31 else ' 512×512 PNG RGBA・実アルファ確認。完成サイズを白/濃紺/ピンク背景で目視検品。')
                      + ' 原本未反映。',
        }
    result = illustration_csv.update_row('028', index, values)
    results.append({'filename': result['filename'], 'state': result['state']})

with (BASE / 'prompt_rows_028.csv').open(encoding='utf-8-sig', newline='') as stream:
    written = list(csv.DictReader(stream))
for index, proposal in enumerate(proposals, 1):
    row = written[index - 1]
    if proposal['review'] != 'safety_hold':
        assert row['解説英語'] and row['解説日本語']
        assert illustration_csv.includes_headword(row['解説英語'], row['単語'])
        assert illustration_csv.english_word_count(row['解説英語']) <= 18
print(json.dumps({'batch': '028', 'captions_written': 32, 'safety_hold': 1, 'results': results}, ensure_ascii=True))
