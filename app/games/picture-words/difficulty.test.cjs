const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { tiers, buildCatalog, bilingualCatalog, challenge, resumeIndex } = require('./difficulty.js');
const scope = { window: {} }; vm.runInNewContext(fs.readFileSync(require.resolve('./catalog.js'), 'utf8'), scope);
const source = JSON.parse(JSON.stringify(scope.window.PICTURE_WORDS_CATALOG));
const ordered = buildCatalog(source);
test('every playable picture has both English and kana answers, including restored saves', () => {
  const playable = bilingualCatalog(source);
  assert.equal(playable.length, 1859); // First-meaning readings plus individually reviewed image exclusions.
  assert.ok(playable.every(word => word.updatedArt && word.en && /^[ぁ-ゔー]{2,14}$/.test(word.w)));
  assert.equal(playable.find(word => word.en === 'candy').w, 'きゃんでぃー');
  assert.ok(!playable.some(word => word.en === 'said'));
  for (const word of playable) {
    const index = resumeIndex({routeVersion:2}, {wordId:word.id}, source, playable);
    assert.equal(playable[index].pic, word.pic);
    assert.ok(challenge(playable[index], 'ja').length > 0);
    assert.ok(challenge(playable[index], 'en').length > 0);
  }
});
test('both pronunciation buttons preserve the current bilingual round and artwork',()=>{
 const code=fs.readFileSync(require.resolve('./game.js'),'utf8'),handlers={},spoken=[];
 const round={answers:{en:[...'CAT'],ja:[...'ねこ']},completed:{en:false,ja:false},hints:{en:0,ja:0}};
 const entry={en:'cat',w:'ねこ',pic:'cat'};
 const context={entry,round,phase:'playing',mode:'en',cancelGesture:()=>{},speech:{stop:()=>{},speak:(...args)=>spoken.push(args)},$:()=>({}),
 document:{querySelectorAll:()=>['ja','en'].map(lang=>({dataset:{mode:lang},addEventListener:(_,fn)=>handlers[lang]=fn}))}};
 vm.runInNewContext(code.slice(code.indexOf("  document.querySelectorAll('[data-mode]')"),code.indexOf("  $('retryImage')")),context);
 handlers.ja();handlers.en();assert.deepEqual(spoken,[[entry,'ja',false,true],[entry,'en',false,true]]);assert.equal(context.round,round);assert.equal(context.entry,entry);
});
test('mobile launch never requests browser fullscreen or its exit instructions', () => {
  const game = fs.readFileSync(require.resolve('./game.js'), 'utf8');
  assert.doesNotMatch(game, /requestFullscreen|exitFullscreen/);
  const manifest = JSON.parse(fs.readFileSync(require.resolve('./manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.display, 'standalone');
});

test('retaining a picture pins the displayed entry even with a stale index or lost connectivity', () => {
  const code = fs.readFileSync(require.resolve('./game.js'), 'utf8');
  const start = code.indexOf('    // Language changes belong');
  const end = code.indexOf('    const retainedHintCount', start);
  const entry = {id:'current',pic:'candy',w:'きゃんでぃー'};
  const context = {entry,catalog:[{id:'other'},entry],nextIndex:0,index:0,mode:'ja',keepPicture:true,
    offline:{canPlay:()=>false},nextUncollected:()=>{throw new Error('Must not select another picture');},
    closePlay:()=>{throw new Error('Must not close current picture');}};
  vm.runInNewContext('(function(){'+code.slice(start,end)+'})()',context);
  assert.equal(context.nextIndex,1);
  assert.equal(context.entry,entry);
});
// Captured from the published 80-word route, independently of today's sorter.
const legacyRoute = `cat dog sea key bus star duck crab shoe moon fox cloud horse chair car bread peach river flower fish cake bridge castle egg spoon ring turtle tea piano octopus clock feather grape lion sheep leaf guitar umbrella panda camera mountain honey plane rabbit bottle giraffe cheese pencil garlic banana mushroom carrot scissors cookie watermelon penguin butterfly pumpkin bicycle potato philosophy submarine constellation helicopter independence thermometer refrigerator transformation contradiction imagination crosswalk technology orchestra democracy correlation antibiotic unanimity photography unprecedented environment`.split(' ');

test('the expanded dictionary keeps every identity and spreads spellings across all eight ranks', () => {
  assert.deepEqual(ordered.map(w => w.id).sort(), source.map(w => w.id).sort());
  assert.equal(new Set(ordered.map(w => w.id)).size, source.length);
  for (let i = 1; i < ordered.length; i++) assert.ok(ordered[i].difficultyScore >= ordered[i - 1].difficultyScore);
  for (let tier = 0; tier < tiers.length; tier++) assert.ok(ordered.some(w => w.tier === tier), `Rank ${tier + 1} should have puzzles`);
  assert.ok(ordered.every(word => Number.isFinite(word.difficultyScore) && Number.isInteger(word.tier) && word.tier >= 0 && word.tier < tiers.length));
  assert.ok(ordered.filter(word => word.tier < 7).length > ordered.length * .8, 'Expansion must not place every added word in the final rank');
  assert.equal(ordered.find(word => word.id === 'cat').tier, 0);
});

test('a spelling keeps the same rank when thousands of other words are added', () => {
  const samples = ['abc', 'abcde', 'abcdef', 'abcdefgh', 'abcdefghi', 'abcdefghijk', 'abcdefghijklmn', 'abcdefghijklmnopq'].map(en => ({ id: `fixture-${en}`, en, w: '' }));
  const small = buildCatalog(samples), expanded = buildCatalog([...source, ...samples]);
  assert.deepEqual(small.map(word => word.tier), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (const word of small) assert.equal(expanded.find(candidate => candidate.id === word.id).tier, word.tier);
});

test('short words stay in one ring, long words use two rings with at most six inner letters', () => {
  for (const language of ['ja', 'en']) {
    for (const word of ordered) {
      if (language === 'ja' && !word.w) continue;
      const p = challenge(word, language);
      assert.ok(p.length >= (language === 'ja' ? 1 : 2)); assert.equal(p.choices, p.length); assert.equal(p.decoys, 0); assert.ok(p.innerCount <= 8); assert.equal(p.dual, p.length > 8);
      if (p.dual) assert.equal(p.innerCount, Math.min(6, Math.ceil(p.length / 2))); else assert.ok(p.choices <= 8);
    }
  }
  assert.ok(ordered.some(word => word.ja === '満場一致'));
  const longest = challenge(ordered.find(word => word.en === 'transformation'), 'en');
  assert.equal(longest.length, 14); assert.equal(longest.choices, 14); assert.equal(longest.decoys, 0); assert.equal(longest.batches, 2);
});

test('the illustration and rarity are shared across both supported answer languages', () => {
  for (const word of ordered) {
    if (word.w) assert.equal(challenge(word, 'ja').key, challenge(word, 'en').key);
    assert.equal(tiers[word.tier].name, challenge(word, 'en').name);
  }
});

test('old numeric saves migrate by word identity without moving the current illustration', () => {
  assert.equal(legacyRoute.length, 80);
  assert.deepEqual(source.slice(0, 80).map(word => word.id).sort(), legacyRoute.slice().sort());
  for (let index = 0; index < legacyRoute.length; index++) {
    assert.equal(ordered[resumeIndex({}, { index }, source, ordered)].id, source[index].id);
    assert.equal(ordered[resumeIndex({ routeVersion: 1 }, { index }, source, ordered)].id, legacyRoute[index]);
  }
  assert.equal(resumeIndex({}, {}, source, ordered), 0);
  assert.equal(resumeIndex({ routeVersion: 2 }, { index: 42 }, source, ordered), 42);
  assert.equal(ordered[resumeIndex({ routeVersion: 1 }, { index: 42 }, source, ordered)].id, 'plane');
  assert.equal(ordered[resumeIndex({}, { wordId: 'cat', index: 30 }, source, ordered)].id, 'cat');
  assert.equal(ordered[resumeIndex({ routeVersion: 1 }, { index: 8000 }, source, ordered)].id, 'environment');
  assert.equal(ordered[resumeIndex({ routeVersion: 1 }, { index: -1 }, source, ordered)].id, 'cat');
});

