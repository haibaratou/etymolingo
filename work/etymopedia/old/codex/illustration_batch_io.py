import csv
import json
import os
import re
import sys
import time
from pathlib import Path
from PIL import Image

ROOT = Path(r'D:\etymolingo\work\etymopedia')
STATE = ROOT / '_illust' / '.codex-generation-state.json'
HELD = {'017/Thor.png', '018/slut.png', '019/anus.png', '019/snare.png'}

def read_state():
    return json.loads(STATE.read_text(encoding='utf-8')) if STATE.exists() else {}

def write_state(value):
    STATE.parent.mkdir(parents=True, exist_ok=True)
    temporary = STATE.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    os.replace(temporary, STATE)

def queue():
    held = HELD | set(read_state().get('held', []))
    missing = []
    batches = []
    for path in (ROOT / 'codex').glob('prompt_rows_*.csv'):
        match = re.fullmatch(r'prompt_rows_(\d+)\.csv', path.name)
        if match and int(match.group(1)) >= 16:
            batches.append((int(match.group(1)), match.group(1), path))
    for _, batch, csv_path in sorted(batches):
        folder = ROOT / '_illust' / ('prompt_rows_' + batch)
        with csv_path.open(encoding='utf-8-sig', newline='') as stream:
            for index, row in enumerate(csv.DictReader(stream), 1):
                name = row['ファイル名']
                if not name or not row['画像生成プロンプト'].strip():
                    continue
                if batch + '/' + name in held or (folder / name).exists():
                    continue
                missing.append({'batch': batch, 'index': index, 'name': name, 'prompt': row['画像生成プロンプト']})
    return {'rows': missing[:1], 'remaining': len(missing)}

def save():
    state = read_state()
    pending = state.get('pending')
    if not pending:
        return {'saved': None}
    row = pending['row']
    with (ROOT / 'codex' / ('prompt_rows_' + row['batch'] + '.csv')).open(encoding='utf-8-sig', newline='') as stream:
        original = list(csv.DictReader(stream))[row['index'] - 1]
    assert original['ファイル名'] == row['name']
    assert original['画像生成プロンプト'] == row['prompt']
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
    state['last_saved'] = row
    state['pending'] = None
    state['current'] = None
    write_state(state)
    return {'saved': str(target), 'row': row, 'alpha': alpha}

def holdlog():
    record = read_state()['hold_records'][-1]
    log = ROOT / '_illust' / 'generation_holds_016_027.txt'
    line = json.dumps(record, ensure_ascii=True)
    previous = log.read_text(encoding='utf-8-sig') if log.exists() else ''
    if line not in previous.splitlines():
        with log.open('a', encoding='utf-8', newline='') as stream:
            stream.write(line + '\n')
    return {'held': record['batch'] + '/' + record['name']}

mode = sys.argv[1]
if mode == 'queue':
    result = queue()
elif mode == 'save':
    result = save()
elif mode == 'read':
    result = read_state()
elif mode == 'holdlog':
    result = holdlog()
else:
    raise ValueError(mode)
print(json.dumps(result, ensure_ascii=True))
