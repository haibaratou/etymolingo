const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.resolve(__dirname, '../../japanese-dictionary.html'), 'utf8');
const code = html.slice(html.indexOf('function wordImageName('), html.indexOf('// skip を渡すと'));
const context = vm.createContext({esc: s => String(s), document: {createElement: () => ({})}});
vm.runInContext(code, context);

test('shared image paths resolve beside the repository in both file and subpath HTTP pages', () => {
  for (const stem of ['school', 'mountain', 'water', 'abdomen', 'cat', 'a@an', 'ice_cream']) {
    const relative = context.wordImageUrl(stem);
    assert.equal(new URL(relative, 'file:///D:/Projects/etymolingo/app/japanese-dictionary.html').href,
      'file:///D:/Projects/etymolingo/assets/word/' + encodeURIComponent(stem) + '.png');
    assert.equal(new URL(relative, 'https://example.test/site/app/japanese-dictionary.html').href,
      'https://example.test/site/assets/word/' + encodeURIComponent(stem) + '.png');
    assert.ok(!relative.includes('github.io'));
  }
});

test('canonical Japanese image IDs and existing fallback still use actual shared PNGs', () => {
  const app = path.resolve(__dirname, '../..');
  const rows = JSON.parse(fs.readFileSync(path.join(app, 'data/ja/ja_index.json'), 'utf8'));
  for (const [word, expected] of [['学校', 'school'], ['山', 'mountain'], ['水', 'water'], ['腹部', 'abdomen'], ['猫', 'cat']]) {
    const row = rows.find(r => r[0] === word);
    const candidates = context.wordImageCandidates(row);
    assert.equal(candidates[0], expected);
    assert.ok(fs.statSync(path.resolve(app, '../assets/word', expected + '.png')).isFile());
    assert.ok(context.wordImageTag(row).includes('../assets/word/' + expected + '.png'));
  }
});

test('a word without an image keeps a placeholder; exhausted fallback remains safe', () => {
  assert.equal(context.wordImageTag(['語', 'ご', '', '', '']), '<div class="noimg"></div>');
  let error, replacement;
  const image = {dataset: {imageNames: 'missing_one|missing_two'},
    addEventListener(event, handler) {assert.equal(event, 'error'); error = handler;},
    replaceWith(node) {replacement = node;}};
  context.enableImageFallback({querySelectorAll: () => [image]});
  error();
  assert.equal(image.src, '../assets/word/missing_two.png');
  error();
  assert.equal(replacement.className, 'noimg');
});
