const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { boot } = require('./test-support/bootstrap-fixture.cjs');
const scope = { window: {} };
vm.runInNewContext(fs.readFileSync(__dirname + '/catalog.js', 'utf8'), scope);
const catalog = scope.window.PICTURE_WORDS_CATALOG;
const ids = new Set(catalog.map(word => word.id));
const basic = () => ({mode:'en',routeVersion:2,en:{stars:{}},ja:{stars:{}},answerRecords:{}});
const body = app => app.get('modalBody');
const cards = app => body(app).querySelectorAll('.dictionary-card');
const filter = (app, value) => body(app).querySelector(`[data-filter="${value}"]`);
const card = (app, id) => body(app).querySelector(`[data-word-id="${id}"]`);
const score = element => element.querySelector('.collection-score-stamp');
function search(app, query, event = 'input') {
  const input = body(app).querySelector('.dictionary-search'); input.value = query; input.dispatch(event);
}

test('Quest dictionary opens with exactly five named star tabs, 48 cards and sequential five-digit numbers', async () => {
  const app=await boot({query:'?word=car&lang=en',saved:basic()});app.get('collection').click();
  assert.equal(body(app).querySelectorAll('.dictionary-tiers button').length,5);
  assert.equal(cards(app).length,48);
  assert.equal(body(app).querySelector('.dictionary-number').textContent,'No.00001');
  assert.equal(app.get('modal').classList.contains('quest-dex-modal'),true);
  assert.equal(filter(app,'all').getAttribute('aria-pressed'),'true');
  assert.ok(cards(app).every(c=>c.querySelector('.dictionary-silhouette')));
  assert.equal(body(app).querySelector('.dictionary-search'),null);
});

test('Quest collection filters retain bilingual ownership and detail image pronunciation', async () => {
  const saved=basic(); for(const w of catalog){saved.en.stars[w.id]=1;}
  const app=await boot({query:'?word=car&lang=en',saved});app.get('collection').click();
  filter(app,'owned').click();assert.equal(cards(app).length,48);
  for(let band=0;band<5 && !card(app,'car');band++)body(app).querySelectorAll('.dictionary-tiers button')[band].click();
  const chosen=cards(app).find(c=>{const w=catalog.find(w=>w.id===c.dataset.wordId);return w.availability?.en?.playable && w.en;});
  const id=chosen.dataset.wordId;chosen.click();
  body(app).querySelector('.dictionary-entry-art').click();
  assert.equal(app.speech.at(-1).text,catalog.find(w=>w.id===id).en);
  body(app).querySelector('.dictionary-back').click();
  filter(app,'missing').click();assert.equal(cards(app).length,0);
  filter(app,'all').click();body(app).querySelectorAll('.dictionary-tiers button')[4].click();
  assert.equal(body(app).querySelectorAll('.dictionary-tiers button')[4].getAttribute('aria-selected'),'true');
  assert.equal(cards(app).length,48);
});

test('bilingual toggle works after a solve, keeps the same image and scores, and cancels the old reward', async () => {
  const app=await boot({query:'?word=family'}), image=app.get('clueImage').src;
  app.solve();assert.equal(app.snapshot().state,'solved');assert.equal(app.save().en.stars.family,3);
  const loadedImages=app.images.filter(image=>image.id==='clueImage').length;app.get('modeToggle').click();
  assert.equal(app.snapshot().mode,'ja');assert.equal(app.snapshot().state,'playing');assert.equal(app.snapshot().id,'family');
  assert.equal(app.get('clueImage').src,image);assert.equal(app.images.filter(image=>image.id==='clueImage').length,loadedImages);
  assert.equal(app.get('rewardScene').hidden,true);assert.equal(app.get('rewardBackdrop').hidden,true);
  assert.equal(app.save().ja.stars.family,undefined);assert.equal(app.save().answerRecords.family.ja,undefined);
  assert.equal(app.get('winPronunciation').hidden,true);assert.equal(app.get('modeToggle').getAttribute('aria-disabled'),'false');
  app.solve();assert.equal(app.save().ja.stars.family,3);assert.equal(app.save().answerRecords.family.en.bestScore,undefined);
  app.get('modeToggle').click();assert.equal(app.snapshot().mode,'en');assert.equal(app.snapshot().state,'playing');
  assert.equal(app.get('clueImage').src,image);app.flushTimers();assert.equal(app.snapshot().id,'family');
});

test('language control is disabled while the selected picture loads and resumes when it is ready', async () => {
  const app=await boot({query:'?word=family',deferImages:true});
  assert.equal(app.snapshot().state,'loading');assert.equal(app.get('modeToggle').disabled,true);
  app.get('modeToggle').click();assert.equal(app.snapshot().mode,'en');
  await app.settle(()=>app.pendingImages.length>0);app.finishImages();
  assert.equal(app.snapshot().state,'playing');assert.equal(app.get('modeToggle').disabled,false);
  app.get('modeToggle').click();assert.equal(app.snapshot().mode,'ja');assert.equal(app.snapshot().id,'family');
});

test('post-solve language replay then Next ignores repeated clicks and stale narration callbacks', async () => {
  const app=await boot({query:'?word=family'});app.solve();await app.settle();app.flushTimers(3000);
  const firstSpeech=app.speech.at(-1);app.get('modeToggle').click();
  assert.equal(app.snapshot().mode,'ja');assert.equal(app.snapshot().state,'playing');
  firstSpeech?.onend?.();app.flushTimers();assert.equal(app.snapshot().id,'family');assert.equal(app.snapshot().mode,'ja');
  app.solve();await app.settle();app.flushTimers(3000);const japaneseSpeech=app.speech.at(-1);
  const word=app.window.PICTURE_WORDS_CATALOG.find(word=>word.id==='family');
  assert.equal(japaneseSpeech.text,word.description.ja);
  app.get('advanceLabel').click();app.get('advanceLabel').click();
  const nextId=app.snapshot().id;app.get('modeToggle').click();
  await app.settle(()=>app.snapshot().state==='playing'&&app.snapshot().id!=='family');
  const next=app.snapshot(),speechCount=app.speech.length;
  assert.equal(next.mode,'ja');assert.equal(app.get('rewardScene').hidden,true);
  japaneseSpeech?.onend?.();firstSpeech?.onend?.();app.flushTimers();
  assert.equal(app.snapshot().id,next.id);assert.equal(app.speech.length,speechCount);
  assert.equal(app.save().answerRecords.family.en.independent,1);assert.equal(app.save().answerRecords.family.ja.independent,1);
});


test('game illustration tap requests its headword',async()=>{
  const app=await boot({query:'?word=car&lang=en',saved:basic()});app.get('clueImage').click();assert.equal(app.speech.at(-1).text,'car');
});


test('an answer-assisted clear registers equally and can be replayed from the dictionary',async()=>{
  const app=await boot({query:'?word=car&lang=en',saved:basic()});
  app.get('hint').click();app.flushTimers(3000);app.solve();
  assert.equal(app.snapshot().state,'solved');assert.ok(app.save().en.stars.car);
  assert.equal(app.save().answerRecords.car.en.bestScore,undefined);
  assert.equal(app.get('rewardSeal').hidden,true);
  app.get('collection').click();filter(app,'owned').click();
  for(let band=0;band<5 && !card(app,'car');band++)body(app).querySelectorAll('.dictionary-tiers button')[band].click();
  card(app,'car').click();
  assert.equal(body(app).querySelector('.collection-score-stamp'),null);
  body(app).querySelector('.modal-primary').click();
  await app.settle(()=>app.snapshot().state==='playing');
  assert.equal(app.snapshot().id,'car');assert.equal(app.get('modal').open,false);
});
