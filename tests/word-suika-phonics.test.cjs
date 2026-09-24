const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function game() {
  let now = 0;
  const elements = new Map();
  const drawing = new Proxy({}, { get: () => () => {} });
  const el = id => elements.get(id) || elements.set(id, { textContent: '', innerHTML: '', classList: { add() {}, remove() {}, toggle() {} }, getContext: () => drawing, getBoundingClientRect: () => ({ width: 390, height: 600, left: 0 }), querySelectorAll: () => [], addEventListener() {} }).get(id);
  const ctx = vm.createContext({ document: { querySelector: el }, window: {}, devicePixelRatio: 1, performance: { now: () => now }, requestAnimationFrame() {}, ResizeObserver: class { observe() {} }, Image: class {}, localStorage: { getItem: () => null, setItem() {} }, fetch: () => Promise.reject(new Error('offline test')), setTimeout: fn => (fn(), 1), clearTimeout() {} });
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'app/games/word-suika-phonics.html'), 'utf8');
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], ctx);
  return source => vm.runInContext(source, ctx);
}

test('the first phonics stage has a fixed chunk sequence', () => {
  const run = game();
  assert.equal(run('JSON.stringify(STAGES[0].chunks.slice(0, 6))'), '["l","igh","t","n","igh","t"]');
});

test('left-to-right phonics chunks form LIGHT, but their anagram does not', () => {
  const run = game();
  run('setDictionary([{w:"light",ja:"光"}]); addBody("l",80,400); addBody("igh",160,400); addBody("t",240,400); tryWordMerge()');
  assert.equal(run('bodies.length'), 1);
  assert.equal(run('bodies[0].word'), 'light');
  assert.equal(run('score'), 250);
  run('bodies=[]; addBody("t",80,400); addBody("igh",160,400); addBody("l",240,400); tryWordMerge()');
  assert.equal(run('bodies.length'), 3);
  assert.equal(run('score'), 250);
});

test('a completed word is a physical input to the next evolution', () => {
  const run = game();
  run('setDictionary([{w:"act",ja:"行動"},{w:"react",ja:"反応"},{w:"reactor",ja:"原子炉"}]); addBody("re",30,400); addBody("a",150,400); addBody("c",210,400); addBody("t",270,400); tryWordMerge()');
  assert.equal(run('bodies.length'), 2);
  assert.equal(run('bodies.find(b=>b.word).word'), 'act');
  run('bodies.find(b=>b.letters==="re").x=130; tryWordMerge()');
  assert.equal(run('bodies.length'), 1);
  assert.equal(run('bodies[0].word'), 'react');
  run('addBody("or",280,400); tryWordMerge()');
  assert.equal(run('bodies[0].word'), 'reactor');
  assert.equal(run('score'), 830);
});
