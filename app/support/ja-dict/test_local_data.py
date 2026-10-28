import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('ja_local_data', Path(__file__).with_name('build_local_data.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class LocalDataTests(unittest.TestCase):
    def setUp(self):
        # Keep fixtures inside the writable workspace, without changing global TEMP.
        self.temporary = tempfile.TemporaryDirectory(dir=Path(__file__).parent)
        self.addCleanup(self.temporary.cleanup)
        self.data = Path(self.temporary.name) / 'ja'
        (self.data / 'ja_det').mkdir(parents=True)
        self.index = self.data / 'ja_index.json'
        self.index.write_text('[ ["あ", "あ", "名", "", "", 1] ]\n', encoding='utf-8')
        (self.data / 'ja_det/あ.json').write_text('{"あ":[["辞書","", "", "全文。"]]}', encoding='utf-8')
        self.output = Path(self.temporary.name) / 'file'

    def test_check_is_read_only_and_detects_updates(self):
        before = {p: p.read_bytes() for p in self.data.rglob('*.json')}
        report = module.build(self.data, self.output)
        self.assertEqual((report['indexRecords'], report['detailRecords'], report['detailShards']), (1, 1, 1))
        module.build(self.data, self.output, check=True)
        stamps = {p: p.stat().st_mtime_ns for p in self.output.iterdir()}
        module.build(self.data, self.output)
        self.assertEqual(stamps, {p: p.stat().st_mtime_ns for p in self.output.iterdir()})
        self.assertEqual(before, {p: p.read_bytes() for p in before})
        self.index.write_text('[]', encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'missing or stale'):
            module.build(self.data, self.output, check=True)
        old_manifest = (self.output / 'manifest.js').read_bytes()
        module.build(self.data, self.output)
        self.assertNotEqual(old_manifest, (self.output / 'manifest.js').read_bytes())
        for p in stamps:
            self.assertTrue(p.exists(), 'old content-addressed files remain available')

    def test_atomic_replace_preserves_other_hardlink(self):
        module.build(self.data, self.output)
        manifest = self.output / 'manifest.js'
        other = self.output / 'other-hardlink.js'
        try:
            os.link(manifest, other)
        except PermissionError as error:
            self.skipTest('This Windows sandbox denies creation of hardlink fixtures: ' + str(error))
        before = other.read_bytes()
        self.index.write_text('[]', encoding='utf-8')
        module.build(self.data, self.output)
        self.assertEqual(other.read_bytes(), before)
        self.assertNotEqual(manifest.read_bytes(), before)
        self.assertFalse(os.path.samefile(manifest, other))

    def test_invalid_input_does_not_activate_partial_generation(self):
        module.build(self.data, self.output)
        before = {p: p.read_bytes() for p in self.output.iterdir()}
        self.index.write_text('[]', encoding='utf-8')
        (self.data / 'ja_det/あ.json').write_text('{broken', encoding='utf-8')
        with self.assertRaises(json.JSONDecodeError):
            module.build(self.data, self.output)
        self.assertEqual(before, {p: p.read_bytes() for p in self.output.iterdir()})

    def test_script_string_preserves_special_keys_and_text(self):
        text = '{"__proto__":{"x":1},"text":"</script>\\n語義\u2028\u2029\\\"\\\\"}'
        self.assertEqual(json.loads(module.js_string(text)), text)
        self.assertNotIn('</script>', module.js_string(text))


if __name__ == '__main__':
    unittest.main()
