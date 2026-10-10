import csv
import hashlib
import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from PIL import Image, ImageDraw
import illustration_csv

ROOT = Path(r'D:\etymolingo\work\etymopedia')
STATE = ROOT / '_illust' / '.codex2-generation-state.json'
HELD = set()

def read_state():
    state = json.loads(STATE.read_text(encoding='utf-8')) if STATE.exists() else {}
    if illustration_csv.assigned_batches(state) != illustration_csv.BATCHES:
        raise RuntimeError('Assignment changed while loading generation state')
    for key in ('current', 'pending'):
        item = state.get(key)
        if item and item.get('row', {}).get('batch') not in illustration_csv.BATCHES:
            raise ValueError('Generation ' + key + ' is outside the assigned batches')
    return state

def write_state(value):
    STATE.parent.mkdir(parents=True, exist_ok=True)
    temporary = STATE.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    os.replace(temporary, STATE)

def queue():
    held = HELD | set(read_state().get('held', []))
    missing = []
    for batch in illustration_csv.BATCHES:
        csv_path = ROOT / 'codex2' / ('prompt_rows_' + batch + '.csv')
        folder = ROOT / '_illust' / ('prompt_rows_' + batch)
        with csv_path.open(encoding='utf-8-sig', newline='') as stream:
            for index, row in enumerate(csv.DictReader(stream), 1):
                name = row['ファイル名']
                if not name or not row['画像生成プロンプト'].strip():
                    continue
                if batch + '/' + name in held or (folder / name).exists():
                    continue
                if row.get('制作状態') in {'needs_revision', 'applied'}:
                    continue
                missing.append({'batch': batch, 'index': index, 'name': name,
                                'prompt': row['画像生成プロンプト'], 'word': row.get('単語'),
                                'sense': row['対象語義'], 'roots_json': row.get('語根ID_JSON'),
                                'sense_sha256': row.get('語義SHA256')})
    while missing:
        row = missing[0]
        binding = illustration_csv.verify_row_identity(row['batch'], row['index'])
        if binding['ok']:
            break
        illustration_csv.record_pending_review(row['batch'], row['index'], binding['reason'])
        missing.pop(0)
    return {'rows': missing[:1], 'remaining': len(missing),
            'assigned_batches': list(illustration_csv.BATCHES)}

def preview():
    state = read_state()
    pending = state['pending']
    with Image.open(pending['source']) as source:
        source.load()
        candidate = source.convert('RGBA').resize((512, 512), Image.Resampling.LANCZOS)
    alpha = candidate.getchannel('A')
    assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 0
    sheet = Image.new('RGB', (1536, 544), 'white')
    draw = ImageDraw.Draw(sheet)
    for index, color in enumerate(('white', '#16243b', '#ffc7df')):
        background = Image.new('RGBA', (512,512), color)
        background.alpha_composite(candidate)
        sheet.paste(background.convert('RGB'), (index*512,32))
        draw.text((index*512+12,10), pending['row']['name'] + ' / ' + color, fill='black')
    folder = ROOT / '_illust' / '.qa-codex2'
    folder.mkdir(exist_ok=True)
    path = folder / ('pending-' + pending['row']['batch'] + '.png')
    sheet.save(path)
    return {'path': str(path), 'alpha': alpha.getextrema()}

def save():
    state = read_state()
    pending = state.get('pending')
    if not pending:
        return {'saved': None}
    row = pending['row']
    with (ROOT / 'codex2' / ('prompt_rows_' + row['batch'] + '.csv')).open(encoding='utf-8-sig', newline='') as stream:
        original = list(csv.DictReader(stream))[row['index'] - 1]
    assert original['ファイル名'] == row['name']
    assert original['画像生成プロンプト'] == row['prompt']
    binding = illustration_csv.verify_row_identity(row['batch'], row['index'])
    if not binding['ok']:
        illustration_csv.record_pending_review(row['batch'], row['index'], binding['reason'])
        state['pending'] = None
        state['current'] = None
        write_state(state)
        return {'saved': None, 'row': row, 'held': binding['reason']}
    caption = pending.get('caption')
    assert caption and pending.get('actual_prompt'), 'Caption and exact execution prompt required'
    target = ROOT / '_illust' / ('prompt_rows_' + row['batch']) / row['name']
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        with Image.open(pending['source']) as source:
            output = source.convert('RGBA').resize((512, 512), Image.Resampling.LANCZOS)
        alpha = output.getchannel('A').getextrema()
        assert alpha[0] == 0 and alpha[1] > 0, alpha
        temporary = target.with_name('.' + target.name + '.' + str(time.time_ns()) + '.tmp')
        output.save(temporary, format='PNG')
        with Image.open(temporary) as check:
            check.load()
            assert check.format == 'PNG' and check.size == (512, 512) and check.mode == 'RGBA'
        try:
            os.rename(temporary, target)
        except FileExistsError:
            temporary.unlink()
    with Image.open(target) as check:
        check.load()
        alpha = check.getchannel('A').getextrema()
        assert check.format == 'PNG' and check.size == (512, 512) and check.mode == 'RGBA'
        assert alpha[0] == 0 and alpha[1] > 0
    image_bytes = target.read_bytes()
    sha256 = hashlib.sha256(image_bytes).hexdigest()
    blob_sha = hashlib.sha1(('blob ' + str(len(image_bytes))).encode() + b'\0' + image_bytes).hexdigest()
    reviewed_at = datetime.now(timezone(timedelta(hours=9))).isoformat(timespec='seconds')
    illustration_csv.update_row(row['batch'], row['index'], {
        '実行プロンプト': pending['actual_prompt'], '解説英語': caption['en'],
        '解説日本語': caption['ja'], '制作状態': 'reviewed',
        '画像SHA256': sha256, '画像GitBlobSHA': blob_sha,
        '検品日時': reviewed_at,
        '検品メモ': '実画像・第一語義・日英解説を照合。白/紺/桃背景512px検品。' + (' ' + caption['note'] if caption.get('note') else '')})
    state['last_saved'] = row
    ledger = ROOT / '_illust' / '.codex2-generation-records.jsonl'
    record = {'row': row, 'source': pending['source'], 'target': str(target),
              'sha256': sha256, 'git_blob_sha': blob_sha,
              'actual_prompt': pending['actual_prompt'], 'caption': caption,
              'reference_paths': pending.get('reference_paths'),
              'saved_at': time.time(), 'reviewed_at': reviewed_at}
    with ledger.open('a', encoding='utf-8', newline='') as stream:
        stream.write(json.dumps(record, ensure_ascii=False) + '\n')
    state['pending'] = None
    state['current'] = None
    write_state(state)
    return {'saved': str(target), 'row': row, 'alpha': alpha}

def holdlog():
    record = read_state()['hold_records'][-1]
    issue = '生成サービスの安全ブロック。request_id=' + str(record.get('request_id')) + '。'
    pending_review = illustration_csv.record_pending_review(record['batch'], record['index'], issue)
    values = {'制作状態': 'error', '検品メモ': issue}
    if record.get('actual_prompt'):
        values['実行プロンプト'] = record['actual_prompt']
    illustration_csv.update_row(record['batch'], record['index'], values)
    return {'held': record['batch'] + '/' + record['name'], 'pending_review': pending_review}

mode = sys.argv[1]
if mode == 'queue':
    result = queue()
elif mode == 'save':
    result = save()
elif mode == 'read':
    result = read_state()
elif mode == 'holdlog':
    result = holdlog()
elif mode == 'preview':
    result = preview()
else:
    raise ValueError(mode)
print(json.dumps(result, ensure_ascii=True))
