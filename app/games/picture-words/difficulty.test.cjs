const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { tiers, buildCatalog, challenge, resumeIndex } = require('./difficulty.js');
const scope = { window: {} }; vm.runInNewContext(fs.readFileSync(require.resolve('./catalog.js'), 'utf8'), scope);
const source = JSON.parse(JSON.stringify(scope.window.PICTURE_WORDS_CATALOG));
const ordered = buildCatalog(source);
test('all words keep their identity and enter eight progressively harder ranks', () => {
  assert.deepEqual(ordered.map(w => w.id).sort(), source.map(w => w.id).sort());
  assert.equal(new Set(ordered.map(w => w.id)).size, source.length);
  for (let i = 1; i < ordered.length; i++) assert.ok(ordered[i].difficultyScore >= ordered[i - 1].difficultyScore);
  for (let tier = 0; tier < 8; tier++) assert.equal(ordered.filter(w => w.tier === tier).length, 10);
  assert.equal(ordered[0].id, 'cat');
});
test('short words stay in one ring, long words use two rings with at most six inner letters', () => {
  for (const language of ['ja', 'en']) {
    for (const word of ordered) { const p = challenge(word, language); assert.ok(p.choices >= p.length); assert.ok(p.innerCount <= 6); assert.ok(p.decoys <= 5); assert.equal(p.dual, p.length > 6); if (p.dual) assert.equal(p.innerCount, 6); else assert.ok(p.choices <= 6); }
  }
  assert.ok(ordered.slice(60).every(word => word.challengeBand));
  for (const word of ordered) for (const language of ['ja', 'en']) {
    const profile = challenge(word, language);
    assert.equal(profile.choices, profile.length); assert.equal(profile.decoys, 0);
  }
  assert.ok(ordered.slice(70).every(word => word.challengeBand === 2));
  assert.ok(ordered.some(word => word.ja === '満場一致'));
  const longest = challenge(ordered.find(word => word.en === 'transformation'), 'en');
  assert.equal(longest.length, 14); assert.equal(longest.choices, 14); assert.equal(longest.decoys, 0); assert.equal(longest.batches, 2);
});
test('the illustration and rarity are shared across both answer languages', () => {
  for (const word of ordered) { assert.equal(challenge(word, 'ja').key, challenge(word, 'en').key); assert.equal(tiers[word.tier].name, challenge(word, 'en').name); }
});
test('old numeric saves migrate by word identity without moving the current illustration', () => {
  for (let index = 0; index < source.length; index++) assert.equal(ordered[resumeIndex({}, { index }, source, ordered)].id, source[index].id);
  assert.equal(resumeIndex({}, {}, source, ordered), 0);
  assert.equal(resumeIndex({ routeVersion: 1 }, { index: 42 }, source, ordered), 42);
  assert.equal(ordered[resumeIndex({}, { wordId: 'cat', index: 30 }, source, ordered)].id, 'cat');
});
