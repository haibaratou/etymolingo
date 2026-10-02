const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { dayKey, hydrate, supports, discoveryWeight, selectNext, markSeen, summary, collect } = require('./progression.js');

const at = (day, hour = 12) => new Date(2026, 9, day, hour);
const words = Array.from({ length: 12 }, (_, index) => ({ id: `word-${index}`, en: `word${index}`, w: `ことば${index}`, tier: index < 2 ? 0 : 1 }));
const fresh = () => ({ mode: 'en', targetTier: 0, en: { stars: {} }, ja: { stars: {} }, discovery: hydrate(undefined, at(3)) });
const add = (state, id, date = at(3), language = 'en') => collect(state, id, language, { isNew: true, now: date });
function freezeDeep(value) {
  Object.freeze(value);
  for (const child of Object.values(value)) if (child && typeof child === 'object') freezeDeep(child);
  return value;
}

test('new rank-matched words are shuffled and scarce ranks fall back to every missing page before reviews', () => {
  const saved = fresh();
  assert.equal(selectNext(words, saved, { random: () => 0 }), 0);
  assert.equal(selectNext(words, saved, { random: () => .99 }), 1);
  saved.en.stars = { 'word-0': 3, 'word-1': 2 };
  assert.equal(selectNext(words, saved, { random: () => 0 }), 2);
  saved.en.stars = {};
  assert.equal(selectNext(words, saved, { targetTier: -1, random: () => .99 }), 11);
});

test('skipped puzzles persist across a reload and a complete pass occurs before any repeat', () => {
  let saved = fresh();
  const displayed = [];
  for (let turn = 0; turn < words.length; turn++) {
    const index = selectNext(words, saved, { afterId: displayed.at(-1), random: () => .7 });
    const id = words[index].id;
    assert.ok(!displayed.includes(id), `Repeated ${id} before the full pool was seen`);
    displayed.push(id);
    saved.discovery = markSeen(saved.discovery, id, 'en', at(3));
    saved = JSON.parse(JSON.stringify(saved));
    saved.discovery = hydrate(saved.discovery, at(3));
  }
  assert.equal(new Set(displayed).size, words.length);
  const next = selectNext(words, saved, { afterId: displayed.at(-1), random: () => 0 });
  assert.equal(words[next].id, displayed[0]);
});

test('mixed discovery weights familiar easy words while keeping rare short and difficult words drawable', () => {
  const saved = fresh(); saved.targetTier = -1;
  const pool = [
    { id: 'cat', en: 'cat', rank: 500, difficultyScore: 6, tier: 0 },
    { id: 'qi', en: 'qi', rank: 2000, difficultyScore: 4, tier: 0 },
    { id: 'ornithorhynchus', en: 'ornithorhynchus', rank: 2300, difficultyScore: 34, tier: 7 },
  ];
  assert.equal(discoveryWeight(pool[0], 0), 32);
  assert.equal(discoveryWeight(pool[1], 0), 4);
  assert.equal(discoveryWeight(pool[2], 0), 1);
  assert.equal(selectNext(pool, saved, { random: () => .5 }), 0);
  assert.equal(selectNext(pool, saved, { random: () => .98 }), 1);
  assert.equal(selectNext(pool, saved, { random: () => .999999 }), 2);
  assert.equal(selectNext(pool, saved, { targetTier: 7, random: () => 0 }), 2);
  for (const word of pool) assert.ok(discoveryWeight(word, 0) > 0);
});

test('mixed discovery fills a globally new page before replaying a word collected in the other language', () => {
  const saved = fresh(); saved.targetTier = -1;
  saved.ja.stars = { 'word-0': 3, 'word-1': 3 };
  assert.equal(selectNext(words, saved, { random: () => 0 }), 2);
  for (const word of words.slice(2)) saved.en.stars[word.id] = 3;
  assert.equal(selectNext(words, saved, { random: () => 0 }), 0);
  saved.en.stars['word-0'] = 1;
  assert.equal(selectNext(words, saved, { random: () => 0 }), 1);
});

test('mixed preference broadens after three pages and still reaches every skipped word without repetition', () => {
  const word = { id: 'extended', en: 'extended', rank: 900, difficultyScore: 18, tier: 3 };
  assert.equal(discoveryWeight(word, 0), discoveryWeight(word, 29));
  assert.ok(discoveryWeight(word, 30) > discoveryWeight(word, 29));
  assert.ok(discoveryWeight(word, 40) > discoveryWeight(word, 30));
  const pool = Array.from({ length: 100 }, (_, index) => ({ id: `word-${index}`, en: `word${index}`, difficultyScore: 4 + index, rank: 400 + index * 20, tier: Math.min(7, Math.floor(index / 10)) }));
  const saved = fresh(); saved.targetTier = -1;
  const displayed = new Set();
  for (let turn = 0; turn < pool.length; turn++) {
    const index = selectNext(pool, saved, { random: () => .5 });
    assert.ok(!displayed.has(pool[index].id));
    displayed.add(pool[index].id);
    saved.discovery = markSeen(saved.discovery, pool[index].id, 'en', at(3));
  }
  assert.equal(displayed.size, pool.length);
});

test('a fully collected dictionary reviews every available word before repeating', () => {
  const saved = fresh();
  saved.en.stars = Object.fromEntries(words.map(word => [word.id, 3]));
  const displayed = [];
  for (let turn = 0; turn < words.length * 2; turn++) {
    const index = selectNext(words, saved, { afterId: displayed.at(-1), random: () => .25 });
    const id = words[index].id;
    displayed.push(id);
    saved.discovery = markSeen(saved.discovery, id, 'en', at(3));
  }
  assert.equal(new Set(displayed.slice(0, words.length)).size, words.length);
  assert.deepEqual(displayed.slice(words.length), displayed.slice(0, words.length));
});

test('a seen but uncollected page takes priority over an acquired review', () => {
  const saved = fresh();
  saved.en.stars = Object.fromEntries(words.slice(1).map(word => [word.id, 3]));
  saved.discovery = markSeen(saved.discovery, words[0].id, 'en', at(3));
  assert.equal(selectNext(words, saved, { afterId: words[0].id, random: () => .99 }), 0);
});

test('selection excludes English-only words in Japanese and handles empty or single-word pools', () => {
  const saved = fresh(), englishOnly = { id: 'astronaut', en: 'astronaut', tier: 0 };
  assert.equal(supports(englishOnly, 'ja'), false);
  assert.equal(supports(englishOnly, 'en'), true);
  assert.equal(selectNext([englishOnly], saved, { language: 'ja' }), -1);
  assert.equal(selectNext([englishOnly], saved, { afterId: 'astronaut', random: () => 1 }), 0);
  assert.equal(selectNext([], saved), -1);
  assert.equal(selectNext(words, saved, { random: () => NaN }), 0);
});

test('only globally new unique words grow the daily collection, independently of language', () => {
  let state = hydrate(null, at(3));
  let result = add(state, 'cat'); state = result.discovery;
  assert.equal(result.added, true);
  assert.equal(add(state, 'cat', at(3), 'ja').added, false);
  assert.equal(collect(state, 'dog', 'en', { isNew: false, now: at(3) }).added, false);
  assert.equal(add(state, 'cat', at(4), 'ja').daily.count, 0);
  assert.equal(add(state, 'cat', at(4), 'ja').added, false);
  assert.equal(summary(state, at(3)).count, 1);
});

test('the tenth page slot stays full until the eleventh collection starts a new page', () => {
  let state = hydrate(null, at(3)), result;
  for (let index = 0; index < 10; index++) { result = add(state, `new-${index}`); state = result.discovery; }
  assert.equal(result.goalCompleted, true);
  assert.equal(result.pageCompleted, true);
  assert.equal(result.daily.goalReached, true);
  assert.equal(result.daily.pageNumber, 1);
  assert.equal(result.daily.pageFilled, 10);
  assert.equal(result.daily.pagesCompleted, 1);
  result = add(state, 'new-10'); state = result.discovery;
  assert.equal(result.goalCompleted, false);
  assert.equal(result.pageCompleted, false);
  assert.equal(result.daily.pageNumber, 2);
  assert.equal(result.daily.pageFilled, 1);
  assert.deepEqual(result.daily.pageIds, ['new-10']);
  for (let index = 11; index < 20; index++) { result = add(state, `new-${index}`); state = result.discovery; }
  assert.equal(result.pageCompleted, true);
  assert.equal(result.goalCompleted, false);
  assert.equal(result.daily.pageNumber, 2);
  assert.equal(result.daily.pageFilled, 10);
});

test('daily rollover retains collections and streaks require consecutive active days', () => {
  let state = add(null, 'cat', at(1)).discovery;
  state = add(state, 'dog', at(2)).discovery;
  assert.equal(summary(state, at(3)).count, 0);
  assert.equal(summary(state, at(3)).streak, 2);
  state = add(state, 'bird', at(3)).discovery;
  assert.equal(summary(state, at(3)).streak, 3);
  assert.equal(summary(state, at(5)).streak, 0);
  state = add(state, 'fish', at(5)).discovery;
  const rolled = summary(state, at(5));
  assert.equal(rolled.streak, 1);
  assert.equal(rolled.totalDays, 4);
  assert.equal(rolled.totalCollected, 4);
  assert.deepEqual(state.days['2026-10-01'], ['cat']);
});

test('old and malformed saves migrate conservatively without invented dates or lost IDs', () => {
  assert.deepEqual(summary(hydrate(undefined, at(3)), at(3)).todayIds, []);
  const raw = { seen: { en: ['cat', null, 'dog', 'cat'], ja: 'bad' }, days: { '2026-10-02': ['legacy-id', 'legacy-id', false], '2026-02-31': ['invalid'], bad: ['invalid'] } };
  const state = hydrate(raw, at(3));
  assert.deepEqual(state.seen.en, ['dog', 'cat']);
  assert.deepEqual(state.seen.ja, []);
  assert.deepEqual(state.days, { '2026-10-02': ['legacy-id'], '2026-10-03': [] });
  const saved = fresh(); saved.en.stars = { cat: 3 }; saved.discovery = state;
  assert.equal(collect(state, 'cat', 'en', { isNew: false, now: at(3) }).daily.count, 0);
});

test('progression functions do not mutate saved input or catalog', () => {
  const saved = freezeDeep(fresh()), catalog = freezeDeep(words.map(word => ({ ...word })));
  const before = JSON.stringify(saved);
  selectNext(catalog, saved, { random: () => .4 });
  markSeen(saved.discovery, 'cat', 'en', at(3));
  add(saved.discovery, 'cat');
  summary(saved.discovery, at(4));
  assert.equal(JSON.stringify(saved), before);
});

test('calendar boundaries use local time instead of UTC and remain correct across DST', () => {
  const script = `const p = require(${JSON.stringify(require.resolve('./progression.js'))});
    const before = new Date('2026-10-02T14:59:59Z'), after = new Date('2026-10-02T15:00:00Z');
    console.log(JSON.stringify([p.dayKey(before), p.dayKey(after)]));`;
  const result = execFileSync(process.execPath, ['-e', script], { encoding: 'utf8', env: { ...process.env, TZ: 'Asia/Tokyo' } });
  assert.deepEqual(JSON.parse(result), ['2026-10-02', '2026-10-03']);
  const dstScript = `const p = require(${JSON.stringify(require.resolve('./progression.js'))});
    let state = p.collect(null, 'one', 'en', {isNew:true, now:new Date(2026, 2, 7, 12)}).discovery;
    state = p.collect(state, 'two', 'en', {isNew:true, now:new Date(2026, 2, 8, 12)}).discovery;
    console.log(JSON.stringify(p.summary(state, new Date(2026, 2, 9, 0))));`;
  const dst = JSON.parse(execFileSync(process.execPath, ['-e', dstScript], { encoding: 'utf8', env: { ...process.env, TZ: 'America/New_York' } }));
  assert.equal(dst.dayKey, '2026-03-09');
  assert.equal(dst.streak, 2);
  assert.equal(dayKey(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
  assert.equal(dayKey(new Date(2027, 0, 1, 0, 0)), '2027-01-01');
});
