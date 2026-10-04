const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { tiers, buildCatalog, bilingualCatalog, challenge, resumeIndex } = require('./difficulty.js');
const scope = { window: {} }; vm.runInNewContext(fs.readFileSync(require.resolve('./catalog.js'), 'utf8'), scope);
const source = JSON.parse(JSON.stringify(scope.window.PICTURE_WORDS_CATALOG));
const ordered = buildCatalog(source);
// Captured test-only legacy fixtures. They test migration/long spellings, never eligibility.
const legacySource = [{"id":"rabbit","en":"rabbit","w":"うさぎ","pic":"rabbit","ja":"兎"},{"id":"flower","en":"flower","w":"はな","pic":"flower","ja":"花"},{"id":"moon","en":"moon","w":"つき","pic":"moon","ja":"月"},{"id":"cat","en":"cat","w":"ねこ","pic":"cat","ja":"猫"},{"id":"umbrella","en":"umbrella","w":"かさ","pic":"umbrella","ja":"傘"},{"id":"star","en":"star","w":"ほし","pic":"star","ja":"星"},{"id":"fox","en":"fox","w":"きつね","pic":"fox","ja":"狐"},{"id":"cloud","en":"cloud","w":"くも","pic":"cloud","ja":"雲"},{"id":"fish","en":"fish","w":"さかな","pic":"fish","ja":"魚"},{"id":"dog","en":"dog","w":"いぬ","pic":"dog","ja":"犬"},{"id":"banana","en":"banana","w":"ばなな","pic":"banana","ja":"バナナ"},{"id":"grape","en":"grape","w":"ぶどう","pic":"grape","ja":"葡萄"},{"id":"peach","en":"peach","w":"もも","pic":"peach","ja":"桃"},{"id":"egg","en":"egg","w":"たまご","pic":"egg","ja":"卵"},{"id":"carrot","en":"carrot","w":"にんじん","pic":"carrot","ja":"人参"},{"id":"bread","en":"bread","w":"ぱん","pic":"bread","ja":"パン"},{"id":"cake","en":"cake","w":"けーき","pic":"cake","ja":"ケーキ"},{"id":"cookie","en":"cookie","w":"くっきー","pic":"cookie","ja":"クッキー"},{"id":"cheese","en":"cheese","w":"ちーず","pic":"cheese","ja":"チーズ"},{"id":"honey","en":"honey","w":"はちみつ","pic":"honey","ja":"蜂蜜"},{"id":"giraffe","en":"giraffe","w":"きりん","pic":"giraffe","ja":"麒麟"},{"id":"lion","en":"lion","w":"らいおん","pic":"lion","ja":"ライオン"},{"id":"horse","en":"horse","w":"うま","pic":"horse","ja":"馬"},{"id":"sheep","en":"sheep","w":"ひつじ","pic":"sheep","ja":"羊"},{"id":"panda","en":"panda","w":"ぱんだ","pic":"panda","ja":"パンダ"},{"id":"penguin","en":"penguin","w":"ぺんぎん","pic":"penguin","ja":"ペンギン"},{"id":"duck","en":"duck","w":"かも","pic":"duck","ja":"鴨"},{"id":"turtle","en":"turtle","w":"かめ","pic":"turtle","ja":"亀"},{"id":"crab","en":"crab","w":"かに","pic":"crab","ja":"蟹"},{"id":"octopus","en":"octopus","w":"たこ","pic":"octopus","ja":"蛸"},{"id":"key","en":"key","w":"かぎ","pic":"key","ja":"鍵"},{"id":"chair","en":"chair","w":"いす","pic":"chair","ja":"椅子"},{"id":"shoe","en":"shoe","w":"くつ","pic":"shoe","ja":"靴"},{"id":"clock","en":"clock","w":"とけい","pic":"clock","ja":"時計"},{"id":"bottle","en":"bottle","w":"ぼとる","pic":"bottle","ja":"ボトル"},{"id":"spoon","en":"spoon","w":"さじ","pic":"spoon","ja":"匙"},{"id":"ring","en":"ring","w":"ゆびわ","pic":"ring","ja":"指輪"},{"id":"camera","en":"camera","w":"かめら","pic":"camera","ja":"カメラ"},{"id":"pencil","en":"pencil","w":"えんぴつ","pic":"pencil","ja":"鉛筆"},{"id":"scissors","en":"scissors","w":"はさみ","pic":"scissors","ja":"鋏"},{"id":"mountain","en":"mountain","w":"やま","pic":"mountain","ja":"山"},{"id":"sea","en":"sea","w":"うみ","pic":"sea","ja":"海"},{"id":"river","en":"river","w":"かわ","pic":"river","ja":"川"},{"id":"bridge","en":"bridge","w":"はし","pic":"bridge","ja":"橋"},{"id":"castle","en":"castle","w":"しろ","pic":"castle","ja":"城"},{"id":"feather","en":"feather","w":"はね","pic":"feather","ja":"羽"},{"id":"leaf","en":"leaf","w":"はっぱ","pic":"leaf","ja":"葉っぱ"},{"id":"potato","en":"potato","w":"じゃがいも","pic":"potato","ja":"じゃが芋"},{"id":"butterfly","en":"butterfly","w":"ちょう","pic":"butterfly","ja":"蝶"},{"id":"tea","en":"tea","w":"おちゃ","pic":"tea","ja":"お茶"},{"id":"car","en":"car","w":"くるま","pic":"car","ja":"車"},{"id":"plane","en":"plane","w":"ひこうき","pic":"plane","ja":"飛行機"},{"id":"bicycle","en":"bicycle","w":"じてんしゃ","pic":"bicycle","ja":"自転車"},{"id":"bus","en":"bus","w":"ばす","pic":"bus","ja":"バス"},{"id":"piano","en":"piano","w":"ぴあの","pic":"piano","ja":"ピアノ"},{"id":"guitar","en":"guitar","w":"ぎたー","pic":"guitar","ja":"ギター"},{"id":"mushroom","en":"mushroom","w":"きのこ","pic":"mushroom","ja":"茸"},{"id":"pumpkin","en":"pumpkin","w":"かぼちゃ","pic":"pumpkin","ja":"南瓜"},{"id":"garlic","en":"garlic","w":"にんにく","pic":"garlic","ja":"にんにく"},{"id":"watermelon","en":"watermelon","w":"すいか","pic":"watermelon","ja":"西瓜"},{"id":"thermometer","en":"thermometer","w":"おんどけい","pic":"thermometer","ja":"温度計","challengeBand":1},{"id":"refrigerator","en":"refrigerator","w":"れいぞうこ","pic":"refrigerator","ja":"冷蔵庫","challengeBand":1},{"id":"constellation","en":"constellation","w":"せいざ","pic":"constellation","ja":"星座","challengeBand":1},{"id":"imagination","en":"imagination","w":"そうぞうりょく","pic":"imagination","ja":"想像力","challengeBand":1},{"id":"philosophy","en":"philosophy","w":"てつがく","pic":"philosophy","ja":"哲学","challengeBand":1},{"id":"independence","en":"independence","w":"どくりつ","pic":"independence","ja":"独立","challengeBand":1},{"id":"transformation","en":"transformation","w":"へんよう","pic":"transformation","ja":"変容","challengeBand":1},{"id":"contradiction","en":"contradiction","w":"むじゅん","pic":"contradiction","ja":"矛盾","challengeBand":1},{"id":"helicopter","en":"helicopter","w":"へりこぷたー","pic":"helicopter","ja":"ヘリコプター","challengeBand":1},{"id":"submarine","en":"submarine","w":"せんすいかん","pic":"submarine","ja":"潜水艦","challengeBand":1},{"id":"orchestra","en":"orchestra","w":"かんげんがくだん","pic":"orchestra","ja":"管弦楽団","challengeBand":2},{"id":"unanimity","en":"unanimity","w":"まんじょういっち","pic":"unanimity","ja":"満場一致","challengeBand":2},{"id":"unprecedented","en":"unprecedented","w":"ぜんだいみもん","pic":"unprecedented","ja":"前代未聞","challengeBand":2},{"id":"correlation","en":"correlation","w":"そうかんかんけい","pic":"correlation","ja":"相関関係","challengeBand":2},{"id":"technology","en":"technology","w":"かがくぎじゅつ","pic":"technology","ja":"科学技術","challengeBand":2},{"id":"antibiotic","en":"antibiotic","w":"こうせいぶっしつ","pic":"antibiotic","ja":"抗生物質","challengeBand":2},{"id":"photography","en":"photography","w":"しゃしんさつえい","pic":"photography","ja":"写真撮影","challengeBand":2},{"id":"crosswalk","en":"crosswalk","w":"おうだんほどう","pic":"crosswalk","ja":"横断歩道","challengeBand":2},{"id":"environment","en":"environment","w":"しぜんかんきょう","pic":"environment","ja":"自然環境","challengeBand":2},{"id":"democracy","en":"democracy","w":"みんしゅしゅぎ","pic":"democracy","ja":"民主主義","challengeBand":2}];

test('every playable picture has both English and kana answers, including restored saves', () => {
  const playable = bilingualCatalog(source);
  assert.equal(playable.length, scope.window.PICTURE_WORDS_CATALOG_META.count); // Every generated entry must remain playable.
  assert.equal(playable.length, scope.window.PICTURE_WORDS_CATALOG_META.count);
  assert.ok(playable.every(require('./reviewed-scenes.js').validRow));
  assert.ok(playable.every(word => word.updatedArt && word.en && /^[ぁ-ゔー]{2,14}$/.test(word.w)));
  assert.ok(!playable.some(word => word.en === 'candy'), 'Unreviewed legacy examples must not return to the active pool');
  assert.ok(!playable.some(word => word.en === 'said'));
  for (const word of playable) {
    const index = resumeIndex({routeVersion:2}, {wordId:word.id}, source, playable);
    assert.equal(playable[index].pic, word.pic);
    assert.ok(challenge(playable[index], 'ja').length > 0);
    assert.ok(challenge(playable[index], 'en').length > 0);
  }
});
test('switching languages retains image and per-language answer-viewed status',()=>{
 const code=fs.readFileSync(require.resolve('./game.js'),'utf8'),handlers={};
 const round={answers:{en:[...'CAT'],ja:[...'ねこ']},viewed:{en:true,ja:false},mistakes:{en:0,ja:0}};
 const entry={en:'cat',w:'ねこ',pic:'cat'};let nextCalls=0;
 const noop=()=>{};
 const c={entry,round,phase:'playing',mode:'en',mistakes:1,generation:1,cancelGesture:noop,clearPending:noop,speech:{stop:noop},$:()=>({dataset:{}}),updateLabels:noop,renderAnswers:noop,makeWheel:noop,updateAnswer:noop,drawTrail:noop,updateProgress:noop,persist:noop,setFeedback:noop,nextUncollected:()=>nextCalls++,
 document:{querySelectorAll:()=>['ja','en'].map(lang=>({dataset:{mode:lang},addEventListener:(_,fn)=>handlers[lang]=fn}))}};
 vm.runInNewContext(code.slice(code.indexOf("  document.querySelectorAll('[data-mode]')"),code.indexOf("  $('retryImage')")),c);
 handlers.ja();assert.equal(c.mode,'ja');assert.equal(c.comboEligible,true);handlers.en();assert.equal(c.comboEligible,false);assert.equal(c.mistakes,1);assert.equal(c.entry,entry);assert.equal(nextCalls,0);assert.equal(round.viewed.en,true);
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

test('the reviewed dictionary preserves eligible identities and stable valid ranks without requiring every rank', () => {
  assert.deepEqual(ordered.map(w => w.id).sort(), source.map(w => w.id).sort());
  assert.equal(new Set(ordered.map(w => w.id)).size, source.length);
  for (let i = 1; i < ordered.length; i++) assert.ok(ordered[i].difficultyScore >= ordered[i - 1].difficultyScore);
  assert.equal(tiers.length, 8); // The rank system remains complete even when a reviewed subset is sparse.
  assert.ok(ordered.every(word => Number.isFinite(word.difficultyScore) && Number.isInteger(word.tier) && word.tier >= 0 && word.tier < tiers.length));
  assert.ok(ordered.filter(word => word.tier < 7).length > ordered.length * .8, 'Expansion must not place every added word in the final rank');
  assert.equal(ordered.find(word => word.id === 'car').tier, 0);
});

test('synthetic spellings cover all eight stable ranks regardless of the reviewed subset', () => {
  const samples = ['abc', 'abcde', 'abcdef', 'abcdefgh', 'abcdefghi', 'abcdefghijk', 'abcdefghijklmn', 'abcdefghijklmnopq'].map(en => ({ id: `fixture-${en}`, en, w: '' }));
  const small = buildCatalog(samples), expanded = buildCatalog([...source, ...samples]);
  assert.deepEqual(small.map(word => word.tier), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (const word of small) assert.equal(expanded.find(candidate => candidate.id === word.id).tier, word.tier);
});

test('short words stay in one ring, long words use two rings with at most six inner letters', () => {
  for (const language of ['ja', 'en']) {
    for (const word of buildCatalog([...source, ...legacySource])) {
      if (language === 'ja' && !word.w) continue;
      const p = challenge(word, language);
      assert.ok(p.length >= (language === 'ja' ? 1 : 2)); assert.equal(p.choices, p.length); assert.equal(p.decoys, 0); assert.ok(p.innerCount <= 8); assert.equal(p.dual, p.length > 8);
      if (p.dual) assert.equal(p.innerCount, Math.min(6, Math.ceil(p.length / 2))); else assert.ok(p.choices <= 8);
    }
  }
  assert.ok(legacySource.some(word => word.ja === '満場一致'));
  const longest = challenge(buildCatalog(legacySource).find(word => word.en === 'transformation'), 'en');
  assert.equal(longest.length, 14); assert.equal(longest.choices, 14); assert.equal(longest.decoys, 0); assert.equal(longest.batches, 2);
});

test('the illustration and rarity are shared across both supported answer languages', () => {
  for (const word of ordered) {
    if (word.w) assert.equal(challenge(word, 'ja').key, challenge(word, 'en').key);
    assert.equal(tiers[word.tier].name, challenge(word, 'en').name);
  }
});

test('historical numeric routes migrate against explicit legacy fixtures, not the narrowed live pool', () => {
  const legacyOrdered = buildCatalog(legacySource);
  assert.equal(legacyRoute.length, 80);
  assert.deepEqual(legacySource.map(word => word.id).sort(), legacyRoute.slice().sort());
  for (let index = 0; index < legacyRoute.length; index++) {
    assert.equal(legacyOrdered[resumeIndex({}, { index }, legacySource, legacyOrdered)].id, legacySource[index].id);
    assert.equal(legacyOrdered[resumeIndex({ routeVersion: 1 }, { index }, legacySource, legacyOrdered)].id, legacyRoute[index]);
  }
  assert.equal(resumeIndex({}, {}, legacySource, legacyOrdered), 0);
  assert.equal(resumeIndex({ routeVersion: 2 }, { index: 42 }, legacySource, legacyOrdered), 42);
  assert.equal(legacyOrdered[resumeIndex({ routeVersion: 1 }, { index: 42 }, legacySource, legacyOrdered)].id, 'plane');
  assert.equal(legacyOrdered[resumeIndex({}, { wordId: 'cat', index: 30 }, legacySource, legacyOrdered)].id, 'cat');
  assert.equal(legacyOrdered[resumeIndex({ routeVersion: 1 }, { index: 8000 }, legacySource, legacyOrdered)].id, 'environment');
  assert.equal(legacyOrdered[resumeIndex({ routeVersion: 1 }, { index: -1 }, legacySource, legacyOrdered)].id, 'cat');
});

test('restoring a removed picture chooses an eligible current puzzle without reintroducing old art', () => {
  for (const raw of [{}, {routeVersion:1}, {routeVersion:2}]) {
    for (const old of [{wordId:'glasses',index:42}, {wordId:'candy',index:8000}, {index:-1}]) {
      const index=resumeIndex(raw,old,source,ordered);
      assert.ok(index>=0 && index<ordered.length);
      assert.ok(require('./reviewed-scenes.js').validRow(ordered[index]));
      assert.ok(!['glasses','candy'].includes(ordered[index].id));
    }
  }
  const retained=ordered.find(word=>word.id==='car');
  assert.equal(ordered[resumeIndex({routeVersion:2},{wordId:retained.id,index:9999},source,ordered)].pic,retained.pic);
});
