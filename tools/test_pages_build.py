import base64
import contextlib
import gzip
import hashlib
import json
import io
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).parent))
from build_pages import build, needs_media_router


class PagesBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'repo'
        self.root.mkdir()
        self.out = Path(self.temp.name) / 'out'
        subprocess.run(['git','init','-q',str(self.root)],check=True)
        self.raw = 'https://raw.githubusercontent.com/haibaratou/etymolingo/' + 'a'*40 + '/'
        self.snapshot = base64.b64encode(gzip.compress(json.dumps({'words':[{'w':'test'}]}).encode())).decode()
        self.files = {
            'tools/pages-assets.template.js': Path(__file__).with_name('pages-assets.template.js').read_text(),
            'app/index.html':'<!doctype html><html><head></head><body><a href="game.html">Game</a></body></html>',
            'app/game.html':'<!doctype html><html><head></head><body><img src="../assets/word/a.png"><script src="code.js"></script></body></html>',
            'app/code.js':'const metadata={path:"assets/word/a.png"};',
            'app/data/generated-etymon/words.json':'{"w":"test"}',
            'app/support/ja-dict/build_local_data.py': (Path(__file__).resolve().parents[1]/'app/support/ja-dict/build_local_data.py').read_text(encoding='utf-8'),
            'app/japanese-dictionary.html':'<!doctype html><html><head></head><body><script src="support/ja-dict/data-loader.js"></script></body></html>',
            'app/data/ja/ja_index.json':json.dumps([['あい','あい','名','','love',1,'','','ひ']],ensure_ascii=False),
            'app/data/ja/ja_det/あ.json':json.dumps({'あい':[['デジタル大辞泉','','あい','fixture definition']]},ensure_ascii=False),
            'app/vocabulary-master.html':'<!doctype html><html><head></head><body><script id="pieData" type="application/gzip-base64">'+self.snapshot+'</script><script src="code.js"></script></body></html>',
            'app/other-snapshot.html':'<script id="pieData" type="application/gzip-base64">'+self.snapshot+'</script>',
            'app/support/picture-words-sw.js':'const SHELL = ["pictlingo-game.html"];',
            'assets/word/a.png':'unchanged image bytes',
            'assets/ui/icon.png':'local UI icon bytes',
            'app/support/picture-words/scene-assets/a@abc.js':'packed original',
            'work/etymopedia/foo.csv':'csv source',
            'tools/secret.txt':'not runtime',
        }
        for name,text in self.files.items():
            target = self.root/name
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(text,encoding='utf-8')
        subprocess.run(['git','-C',str(self.root),'add','.'],check=True)

    def stage(self):
        with contextlib.redirect_stdout(io.StringIO()):
            return build(self.root,self.out,'haibaratou/etymolingo','a'*40)

    def test_static_home_needs_no_bootstrap_and_dynamic_game_keeps_synchronous_order(self):
        self.stage()
        self.assertNotIn('pages-assets.js',(self.out/'app/index.html').read_text())
        game = (self.out/'app/game.html').read_text()
        self.assertRegex(game,r'<head><script src="../pages-assets.js\?v=[a-f0-9]{12}"></script>')
        self.assertLess(game.index('pages-assets.js'),game.index('src="code.js"'))
        self.assertNotIn('defer',game)
        self.assertIn(self.raw+'assets/word/a.png',game)
        self.assertTrue(needs_media_router('<button onclick="makeImage()">Play</button>'))
        self.assertTrue(needs_media_router('<a href="javascript:makeImage()">Play</a>'))
        self.assertFalse(needs_media_router('<img src="already-mapped.png"><style>body{color:red}</style>'))

    def test_only_staged_explorer_snapshot_becomes_a_lazy_content_addressed_text_payload(self):
        report = self.stage()
        original = self.root/'app/vocabulary-master.html'
        self.assertEqual(original.read_text(encoding='utf-8'),self.files['app/vocabulary-master.html'])
        text = (self.out/'app/vocabulary-master.html').read_text(encoding='utf-8')
        self.assertNotIn(self.snapshot,text)
        sha = hashlib.sha256(self.snapshot.encode()).hexdigest()
        expected = 'data/generated-etymon/explorer-fallback-'+sha+'.txt'
        self.assertIn('data-src="'+expected+'"',text)
        self.assertEqual((self.out/'app'/expected).read_text(encoding='utf-8'),self.snapshot)
        self.assertIn(self.snapshot,(self.out/'app/other-snapshot.html').read_text())
        self.assertNotRegex(text,r'<(?:script|link)\b[^>]*\s(?:src|href)="[^"]*explorer-fallback-')
        self.assertEqual(report['externalizedSnapshots'][0]['sha256'],sha)
        self.assertEqual(report['externalizedSnapshots'][0]['bytes'],len(self.snapshot.encode()))

    def test_snapshot_filename_changes_with_its_content(self):
        self.stage()
        before = json.loads((self.out/'deployment-manifest.json').read_text())['externalizedSnapshots'][0]['payload']
        changed_snapshot = base64.b64encode(gzip.compress(b'{"words":[{"w":"changed"}]}')).decode()
        text = self.files['app/vocabulary-master.html'].replace(self.snapshot,changed_snapshot)
        (self.root/'app/vocabulary-master.html').write_text(text,encoding='utf-8')
        second = Path(self.temp.name)/'out2'
        with contextlib.redirect_stdout(io.StringIO()):
            result = build(self.root,second,'haibaratou/etymolingo','a'*40)
        self.assertNotEqual(before,result['externalizedSnapshots'][0]['payload'])

    def test_japanese_local_data_is_rebuilt_from_staged_json_without_changing_sources(self):
        sources = {name:(self.root/name).read_bytes() for name in self.files
                   if name.startswith('app/data/ja/')}
        report = self.stage()
        local = self.out/'app/data/ja/file'
        self.assertTrue((local/'manifest.js').is_file())
        self.assertEqual(report['jaDictionaryLocalData']['indexRecords'],1)
        self.assertEqual(report['jaDictionaryLocalData']['detailShards'],1)
        self.assertEqual(report['jaDictionaryLocalData']['detailRecords'],1)
        self.assertEqual(report['jaDictionaryLocalData']['files'],3)
        self.assertEqual(len(list(local.glob('index-*.js'))),1)
        self.assertEqual(len(list(local.glob('det-3042-*.js'))),1)
        self.assertFalse((self.root/'app/data/ja/file').exists())
        for name,raw in sources.items():
            self.assertEqual((self.root/name).read_bytes(),raw)
            self.assertEqual((self.out/name).read_bytes(),raw)
        first_manifest = (local/'manifest.js').read_bytes()
        source = self.root/'app/data/ja/ja_index.json'
        changed = json.loads(source.read_text(encoding='utf-8'))
        changed[0][4] = 'affection'
        source.write_text(json.dumps(changed,ensure_ascii=False),encoding='utf-8')
        changed_bytes = source.read_bytes()
        second = Path(self.temp.name)/'out-updated-ja'
        with contextlib.redirect_stdout(io.StringIO()):
            result = build(self.root,second,'haibaratou/etymolingo','a'*40)
        self.assertNotEqual(report['jaDictionaryLocalData']['indexSha256'],
                            result['jaDictionaryLocalData']['indexSha256'])
        self.assertNotEqual(first_manifest,(second/'app/data/ja/file/manifest.js').read_bytes())
        self.assertEqual(source.read_bytes(),changed_bytes)
        self.assertEqual((second/'app/data/ja/ja_index.json').read_bytes(),changed_bytes)
        self.assertEqual(result['jaDictionaryLocalData']['indexSha256'],
                         hashlib.sha256(changed_bytes).hexdigest())

    def test_media_and_runtime_sources_are_unchanged_and_client_manifest_is_absent(self):
        report = self.stage()
        self.assertFalse((self.out/'assets/word/a.png').exists())
        self.assertFalse((self.out/'app/support/picture-words/scene-assets/a@abc.js').exists())
        self.assertEqual((self.out/'assets/ui/icon.png').read_bytes(),(self.root/'assets/ui/icon.png').read_bytes())
        self.assertEqual((self.root/'assets/word/a.png').read_text(),'unchanged image bytes')
        self.assertEqual((self.out/'app/code.js').read_bytes(),(self.root/'app/code.js').read_bytes())
        self.assertFalse((self.out/'tools/secret.txt').exists())
        router = (self.out/'pages-assets.js').read_text()
        self.assertNotIn('__MEDIA_PATHS__',router)
        self.assertNotIn('assets/word/a.png',router)
        self.assertLess(report['pagesAssetsBytes'],8000)
        version = hashlib.sha256((self.out/'pages-assets.js').read_bytes()).hexdigest()[:12]
        self.assertEqual(report['pagesAssetsVersion'],version)
        self.assertIn('../pages-assets.js?v='+version,(self.out/'app/support/picture-words-sw.js').read_text())
        subprocess.run(['node','--check',str(self.out/'pages-assets.js')],check=True)


if __name__ == '__main__':
    unittest.main()
