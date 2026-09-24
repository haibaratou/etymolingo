const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Run the shipped dictionary, merge animations, timers and physics without a browser.
// Canvas/DOM stubs do not verify visual appearance or audio.
function game(width = 390) {
  let now = 0, nextTimer = 1;
  const timers = new Map(), elements = new Map();
  const bounds = { width, height: 600, left: 0 };
  const drawing = new Proxy({}, { get: () => () => {} });
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      textContent: '', innerHTML: '', classList: { add() {}, remove() {}, toggle() {} },
      getContext: () => drawing, getBoundingClientRect: () => bounds,
      querySelectorAll: () => [], addEventListener() {},
    });
    return elements.get(id);
  }
  const context = vm.createContext({
    document: { querySelector: element }, window: {}, devicePixelRatio: 1,
    performance: { now: () => now }, requestAnimationFrame() {},
    ResizeObserver: class { observe() {} }, Image: class {},
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout(fn, delay) {
      const id = nextTimer++;
      timers.set(id, { at: now + delay, fn });
      return id;
    },
    clearTimeout: id => timers.delete(id),
  });
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'app/games/word-suika_jp.html'), 'utf8');
  vm.runInContext(fs.readFileSync(path.join(root, 'app/data/generated-etymon/word-suika-ja.js'), 'utf8'), context);
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  const run = source => vm.runInContext(source, context);
  function advance(ms) {
    for (let elapsed = 0; elapsed < ms; elapsed += 16) {
      now += 16;
      for (const [id, timer] of timers) if (timer.at <= now) {
        timers.delete(id);
        timer.fn();
      }
      run('if (!over) physics(16)');
    }
  }
  function until(expression, limit = 10000) {
    for (let elapsed = 0; elapsed < limit; elapsed += 16) {
      if (run(expression)) return;
      advance(16);
    }
    assert.fail(`Timed out: ${expression}; ${run('JSON.stringify({bodies: bodies.map(b=>({word:b.word,letters:b.letters,x:b.x,y:b.y})),over,canDrop,wordChain:wordChain?.finalWords})')}`);
  }
  return { run, advance, until, bounds };
}

test('connected そ・ら・ち first form a real 空 ball, then そちら', () => {
  const g = game();
  assert.equal(g.run('stageTarget'), 'そちら');
  g.run('mode="choice"; addBody("そ",115,420); addBody("ら",195,420); addBody("ち",275,420); tryWordMerge()');
  assert.equal(g.run('wordChain.finalWords.join()'), 'そら');
  g.until('bodies.some(b=>b.word==="そら")');
  assert.equal(g.run('bodies.length'), 2);
  assert.equal(g.run('bodies.find(b=>b.word==="そら").ja'), '空');
  assert.equal(g.run('bodies.some(b=>b.letters==="ち" && !b.word)'), true);
  assert.equal(g.run('bodies.some(b=>b.clearsStage)'), false);
  const skyRadius = g.run('bodies.find(b=>b.word==="そら").r');
  g.until('wordChain?.finalWords.includes("そちら")');
  assert.equal(g.run('wordChain.steps.map(s=>s.word).join()'), 'そちら');
  g.until('bodies.some(b=>b.word==="そちら")');
  assert.equal(g.run('bodies.length'), 1);
  assert.ok(g.run('bodies[0].r') > skyRadius);
  assert.equal(g.run('score'), 130);
  assert.equal(g.run('wordCount'), 2);
  g.until('stageCleared');
  assert.equal(g.run('bodies.length'), 0);
});

for (const letters of ['そらち', 'そちら', 'らそち', 'らちそ', 'ちそら', 'ちらそ']) {
  test(`stage 1 clears through actual drops in order ${letters}`, () => {
    const g = game();
    g.run('startStage(1)');
    g.until('canDrop');
    const formed = new Set();
    for (const ch of letters) {
      g.until('canDrop && !wordChain');
      g.run(`choiceIndex=queue.indexOf(${JSON.stringify(ch)}); dropAt(W/2)`);
      for (let i = 0; i < 250; i++) {
        g.advance(16);
        for (const w of JSON.parse(g.run('JSON.stringify(bodies.map(b=>b.word).filter(Boolean))'))) formed.add(w);
      }
    }
    g.until('stageCleared');
    assert.ok(formed.has('そちら'));
    assert.equal(g.run('over'), true);
  });
}

test('separated kana do not merge', () => {
  const g = game(720);
  assert.equal(g.run('addBody("そ",100,200); addBody("ら",500,200); tryWordMerge()'), false);
});

test('a longer word with no shorter dictionary subset can still form', () => {
  const g = game();
  g.run('setDictionary([{w:"あいう",ja:"テスト"}]); addBody("あ",140,400); addBody("い",220,400); addBody("う",180,330); tryWordMerge()');
  assert.equal(g.run('wordChain.finalWords.join()'), 'あいう');
  g.until('bodies.some(b=>b.word==="あいう")');
  assert.equal(g.run('bodies.length'), 1);
});

test('anagrams remain available and no extra merge starts during stage clear', () => {
  const g = game();
  g.run('setDictionary([{w:"あい",ja:"A"},{w:"いあ",ja:"B"}]); STAGES[0].goal=2; addBody("あ",140,400); addBody("い",220,400); tryWordMerge()');
  g.until('bodies.some(b=>b.clearsStage)');
  assert.equal(g.run('bodies.filter(b=>b.word).length'), 2);
  assert.equal(g.run('tryWordMerge()'), false);
});

test('longer balls grow distinctly and fit narrow mobile boards', () => {
  for (const width of [320, 375, 390, 720]) {
    const g = game(width);
    let previous = 40;
    for (let length = 2; length <= 8; length++) {
      const radius = g.run(`wordRadius(${length})`);
      assert.ok(radius > previous, `${width}px / ${length} letters must grow`);
      assert.ok(radius * 2 <= width - 24);
      assert.ok(radius > Math.min(106, 44 * Math.pow(1.12, length - 1)));
      previous = radius;
    }
  }
  const g = game(720);
  assert.equal(g.run('wordRadius(2)'), 60);
  assert.equal(g.run('wordRadius(3)'), 80);
  assert.equal(g.run('wordRadius(7)'), 160);
});

test('existing large balls stay inside the board after a mobile resize', () => {
  const g = game(720);
  g.run('addBody("あいうえおかきく",530,350,"あいうえおかきく")');
  g.bounds.width = 320;
  g.run('resize()');
  assert.equal(g.run('bodies[0].r'), 148);
  assert.ok(g.run('bodies[0].x - bodies[0].r') >= 4);
  assert.ok(g.run('bodies[0].x + bodies[0].r') <= 316);
});

test('drop cooldown cannot unlock input in the middle of a merge', () => {
  const g = game();
  g.run('mode="choice";canDrop=true;dropAt(195);bodies=[];addBody("そ",155,420);addBody("ら",235,420);tryWordMerge()');
  g.advance(432);
  assert.equal(g.run('!!wordChain'), true);
  assert.equal(g.run('canDrop'), false);
  const count = g.run('bodies.length');
  g.run('dropAt(195)');
  assert.equal(g.run('bodies.length'), count);
});
