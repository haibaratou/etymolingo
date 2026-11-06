/* node --test app/support/picture-words/test-listening.cjs */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('./listening-core.js');
function word(en, overrides = {}) {
  return { id: en + '-id', en, pic: en, roots: [en], image: { path: 'assets/word/' + en + '.png', sha256: en },
    description: { en: 'The ' + en + ' is here.' }, ...overrides };
}
const words = ['cat', 'dog', 'fish', 'bird', 'apple', 'sun', 'moon', 'book'].map(en => word(en));
const prepared = word => ({ status: 'reviewed', playable: true, ttsAllowed: true, imageVerified: true,
  imageURL: 'data:image/png;base64,' + word.en, entry: { w: word.en, art: word.pic, p: word.roots, scene: { en: word.description.en, ja: '確認済み説明' } } });
function fixture(options = {}) {
  const calls = [], speech = { stop() { calls.push('stop'); }, speakScene(...args) { calls.push(args); return true; } };
  const session = new core.Session({ words, prepare: async w => prepared(w), speech, random: () => .23, ...options });
  return { session, speech, calls };
}
test('four choices use distinct identity, PNG content, headword and reviewed sentence', () => {
  const base = words[0];
  for (const clone of [word('a', { id: base.id }), word('b', { image: { ...base.image } }),
    word('c', { en: 'CAT' }), word('d', { description: { en: base.description.en.toUpperCase() } }),
    word('balloon', { description: { en: 'A cat holds a balloon.' } })]) assert.equal(core.distinct(clone, [base]), false);
  const round = core.chooseRound(words, undefined, () => .23);
  assert.equal(round.choices.length, 4);
  for (let i = 0; i < 4; i++) assert.equal(core.distinct(round.choices[i], round.choices.filter((_, j) => j !== i)), true);
  assert.equal(round.choices[round.answerIndex], round.target);
  assert.equal(core.mentions('A carpet lies here.', 'car'), false);
  assert.equal(core.normalize(' A cat.  '), core.normalize('a cat'));
});
test('unverified captions, unplayable words, offline misses and duplicate IDs are excluded', () => {
  const reviewed = { supportsLanguage: w => w.en !== 'cat', validCaption: w => w.en !== 'dog' };
  const offline = { canPlay: w => w.en !== 'fish' };
  assert.deepEqual(core.eligibleCatalog([...words, words[4]], reviewed, offline).map(w => w.en), ['bird', 'sun', 'moon', 'book']);
});
test('not enough distinct illustrations fails instead of repeating an image', () => {
  assert.equal(core.chooseRound(words.slice(0, 3)), null);
  assert.equal(core.chooseRound(words.map(w => ({ ...w, image: words[0].image }))), null);
});
test('explicit English playback unlocks choices; wrong tap reveals once, replay and next work', async () => {
  const { session, calls } = fixture();
  assert.equal(await session.next(), true);
  assert.equal(session.choose(0), null);
  assert.equal(session.replay(), true);
  assert.equal(calls.at(-1)[0], session.round.target);
  assert.equal(calls.at(-1)[1], session.round.prepared[session.round.answerIndex]);
  assert.equal(calls.at(-1)[2], 'en');
  const wrong = (session.round.answerIndex + 1) % 4;
  assert.deepEqual(session.choose(wrong), { index: wrong, correct: false });
  assert.equal(session.choose(session.round.answerIndex), null);
  assert.equal(session.replay(), true);
  const previous = session.round.target.id;
  assert.equal(await session.next(), true);
  assert.notEqual(session.round.target.id, previous);
  assert.equal(session.state, 'playing'); assert.equal(session.heard, false); assert.equal(session.answer, null);
  assert.equal(session.number, 2);
});
test('correct answer and unavailable speech preserve clear session states', async () => {
  const { session, speech } = fixture(); await session.next();
  speech.speakScene = () => false;
  assert.equal(session.replay(), false); assert.equal(session.choose(0), null);
  speech.speakScene = () => true; session.replay();
  assert.deepEqual(session.choose(session.round.answerIndex), { index: session.round.answerIndex, correct: true });
  assert.equal(session.state, 'answered');
});
test('image verification and exact prepared sentence binding fail closed', async () => {
  for (const mutate of [r => ({ ...r, imageVerified: false }), r => ({ ...r, ttsAllowed: false }),
    r => ({ ...r, entry: { ...r.entry, w: 'wrong' } }),
    r => ({ ...r, entry: { ...r.entry, scene: { en: 'unreviewed' } } })]) {
    let checks = 0;
    const { session } = fixture({ prepare: async w => { checks++; return mutate(prepared(w)); } });
    assert.equal(await session.next(), false); assert.equal(session.state, 'error');
    assert.equal(session.round, null); assert.equal(checks, 4);
  }
});
test('one failed image is omitted from the next prepared set', async () => {
  const failedId = core.chooseRound(words, undefined, () => .23).choices[0].id;
  const { session } = fixture({ prepare: async w => w.id === failedId ? null : prepared(w) });
  assert.equal(await session.next(), true);
  assert.equal(session.round.choices.some(w => w.id === failedId), false);
});
test('late async image result cannot overwrite a newer round or stopped session', async () => {
  let release; const barrier = new Promise(resolve => { release = resolve; }); let wait = true;
  const { session } = fixture({ prepare: async w => { if (wait) await barrier; return prepared(w); } });
  const old = session.next(); await Promise.resolve(); wait = false;
  assert.equal(await session.next(), true); const current = session.round;
  release(); assert.equal(await old, false); assert.equal(session.round, current); assert.equal(session.number, 1);
  const { session: stopped } = fixture({ prepare: async w => { await barrier; return prepared(w); } });
  const pending = stopped.next(); stopped.stop(); assert.equal(await pending, false); assert.equal(stopped.number, 0);
});
test('listening boot precedes puzzle save reads and never accesses puzzle/history storage', () => {
  const entry = fs.readFileSync(path.join(__dirname, '../../pictlingo-game.html'), 'utf8');
  const game = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
  const mode = fs.readFileSync(path.join(__dirname, 'listening.js'), 'utf8');
  const desktop = fs.readFileSync(path.join(__dirname, 'desktop.js'), 'utf8');
  assert.ok(game.indexOf('PictlingoListening.mount()') < game.indexOf('const originalCatalog'));
  assert.ok(game.indexOf('PictlingoListening.mount()') < game.indexOf('readSave()'));
  assert.doesNotMatch(mode, /localStorage|sessionStorage|word-bloom-v1/);
  assert.ok(entry.indexOf('listening.js?') < entry.indexOf('/game.js?'));
  assert.match(entry, /id="listeningMode"[^>]+target="_top"/);
  assert.match(desktop, /searchParams.get\('mode'\) === 'listening'/);
  const sw = fs.readFileSync(path.join(__dirname, '../picture-words-sw.js'), 'utf8');
  for (const asset of ['listening-core.js', 'listening.js', 'listening.css']) assert.ok(sw.includes("'" + asset + "'"));
});
