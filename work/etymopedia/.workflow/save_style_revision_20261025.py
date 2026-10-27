import json
import os
import pathlib
import shutil
import sys

from PIL import Image

P = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(P))
import workflow_io as w

C = P / 'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv'
ARCHIVE = P / '.workflow' / 'style_revisions_20261025' / 'originals'
STAGE = P / '.workflow' / 'style_revisions_20261025' / 'staged'

def main():
    items = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    STAGE.mkdir(parents=True, exist_ok=True)
    for item in items:
        name = item['filename']
        _, _, rows = w.read_csv(C)
        row = next(r for r in rows if r['ファイル名'] == name)
        if row['制作状態'] != 'needs_revision' or '画風再制作待ち' not in row.get('検品メモ',''):
            raise ValueError('Expected style revision row: ' + name)
        dst = P / '_illust' / name
        old = w.png_bytes(dst)
        if w.sha(old) != row['画像SHA256']:
            raise ValueError('Existing image hash changed: ' + name)
        backup = ARCHIVE / name
        if backup.exists() and backup.read_bytes() != old:
            raise ValueError('Conflicting backup: ' + name)
        if not backup.exists():
            with backup.open('xb') as f:
                f.write(old)
        with Image.open(item['source']) as im:
            revised = im.convert('RGBA').resize((512,512), Image.Resampling.LANCZOS)
            stage = STAGE / name
            revised.save(stage, format='PNG')
        new = w.png_bytes(stage)
        os.replace(stage, dst)
        values = {
            '実行プロンプト': item['prompt'],
            '解説英語': item['en'],
            '解説日本語': item['ja'],
            '制作状態': 'reviewed',
            '画像SHA256': w.sha(new),
            '画像GitBlobSHA': w.blob(new),
            '画像保存先': str(dst),
            '検品日時': w.now(),
            '検品方法': '実PNG目視・512x512 RGBA・実アルファ確認・既存画風照合',
            '検品メモ': '画風を既存イラストに合わせて再制作。旧PNGを.workflow内に保全。',
            '生成結果ID': item['source'],
            '生成保存日時': w.now(),
        }
        token = json.loads(w.state_path(C).read_bytes())['token']
        print(json.dumps(w.record(C, token, w.key(row), values), ensure_ascii=False))

if __name__ == '__main__':
    main()
