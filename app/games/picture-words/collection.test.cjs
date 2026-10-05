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

test('one collection counts English-only, Japanese-only, and bilingual acquisitions once by exact ID', async () => {
  const words = catalog.filter(word => word.availability.en.playable && word.availability.ja.playable).slice(0,3);
  assert.equal(ids.size, catalog.length, 'every catalog ID must remain distinct');
  const saved = basic(); saved.en.stars[words[0].id] = 3; saved.ja.stars[words[1].id] = 2;
  saved.en.stars[words[2].id] = 1; saved.ja.stars[words[2].id] = 3;
  saved.en.stars.retiredId = 3;
  for (const lang of ['en','ja']) {
    const app = await boot({query:'?word=car&lang='+lang,saved}); app.get('collection').click();
    assert.equal(cards(app).length,3); assert.equal(filter(app,'owned').textContent,'獲得済み 3');
    assert.equal(filter(app,'missing').textContent,`未獲得 ${catalog.length-3}`);
    assert.equal(filter(app,'all').textContent,`すべて ${catalog.length}`);
    assert.equal(body(app).querySelector('.dictionary-meter').getAttribute('aria-valuenow'),'3');
    assert.equal(body(app).querySelector('.dictionary-meter').getAttribute('aria-valuemax'),String(catalog.length));
    assert.equal(app.get('collectionCount').textContent,'3');
    assert.equal(body(app).querySelector('.dictionary-tabs'),null);
    assert.equal(body(app).querySelectorAll('.dictionary-filters button').length,3);
    assert.deepEqual(cards(app).map(c=>c.dataset.wordId).sort(),Array.from(words,w=>w.id).sort());
  }
});

test('the compact card and detail stamp show only the highest real score across both languages', async () => {
  const saved = basic(); saved.en.stars.car = 1; saved.ja.stars.car = 3;
  saved.answerRecords.car = {en:{bestScore:60,lastScore:40,assisted:3},ja:{bestScore:100,lastScore:90,independent:2}};
  const app = await boot({query:'?word=car',saved}); const before = app.save(); app.get('collection').click();
  const owned = card(app,'car'); assert.equal(score(owned).dataset.score,'100');
  assert.equal(score(owned).getAttribute('role'),'img'); assert.equal(score(owned).getAttribute('aria-label'),'最高 100点');
  assert.match(owned.getAttribute('aria-label'),/最高 100点/); assert.equal(score(owned).textContent,'100点最高');
  assert.doesNotMatch(body(app).textContent,/自力|答えを見た|回|はなまる|正解/);
  owned.click(); assert.equal(score(body(app)).dataset.score,'100');
  assert.equal(app.get('modalTitle').textContent,'コレクション');
  assert.equal(body(app).querySelector('.answer-record'),null); assert.equal(body(app).querySelector('.entry-books'),null);
  assert.doesNotMatch(body(app).textContent,/自力|答えを見た|今回|でもゲット/);
  body(app).querySelector('.dictionary-back').click(); assert.equal(app.document.activeElement.dataset.wordId,'car');
  assert.deepEqual(app.save(),before, 'viewing and returning must not rewrite either language history');
});

test('legacy acquisitions never invent scores, a recorded zero remains visible, invalid scores are ignored', async () => {
  for (const [records, expected] of [
    [undefined,null], [{last:'independent'},null], [{en:{independent:3}},null],
    [{ja:{bestScore:0}},'0'], [{bestScore:70,last:'assisted'},'70'],
    [{en:{bestScore:60},ja:{bestScore:90}},'90'],
    [{en:{bestScore:'100'},ja:{bestScore:110}},null],
    [{en:{bestScore:-10},ja:{bestScore:85.5}},null]
  ]) {
    const saved = basic(); saved.en.stars.car = 3; if(records)saved.answerRecords.car=records;
    const app=await boot({query:'?word=car',saved});app.get('collection').click();
    assert.equal(score(card(app,'car'))?.dataset.score ?? null,expected);
    assert.equal(body(app).querySelector('.answer-record'),null);
  }
});

test('same-spelling homonyms retain separate cards, images, IDs and best scores', async () => {
  const grouped = new Map(); for(const word of catalog){const set=grouped.get(word.en)||[];set.push(word);grouped.set(word.en,set);}
  const pair=[...grouped.values()].find(words=>words.length>1&&words[0].en&&new Set(words.map(w=>w.pic)).size>1).slice(0,2);
  const saved=basic();saved.en.stars[pair[0].id]=3;saved.ja.stars[pair[1].id]=2;
  saved.answerRecords[pair[0].id]={en:{bestScore:100}};saved.answerRecords[pair[1].id]={ja:{bestScore:70}};
  const app=await boot({query:'?word=car',saved});app.get('collection').click();
  assert.equal(cards(app).length,2);assert.notEqual(pair[0].id,pair[1].id);
  assert.equal(score(card(app,pair[0].id)).dataset.score,'100');assert.equal(score(card(app,pair[1].id)).dataset.score,'70');
  assert.notEqual(card(app,pair[0].id).querySelector('.dictionary-art img').src,card(app,pair[1].id).querySelector('.dictionary-art img').src);
});

test('combined collection supports paging, Japanese search, IME, repeated filters, detail Back and close/reopen', async () => {
  const selected=catalog.slice(0,100),saved=basic();selected.forEach((word,i)=>{saved[i%2?'ja':'en'].stars[word.id]=3;});
  const app=await boot({query:'?word=car',saved});app.get('collection').click();assert.equal(cards(app).length,48);
  body(app).querySelector('[aria-label="Next page"]').click();assert.equal(cards(app).length,48);
  const opened=cards(app)[0].dataset.wordId;cards(app)[0].click();body(app).querySelector('.dictionary-back').click();
  assert.equal(app.document.activeElement.dataset.wordId,opened);assert.match(body(app).querySelector('.dictionary-pages').textContent,/2 \/ 3/);
  filter(app,'all').click();filter(app,'owned').click();assert.match(body(app).querySelector('.dictionary-pages').textContent,/1 \/ 3/);
  const target=selected.find(word=>word.ja);assert.ok(target);search(app,target.ja,'compositionend');assert.ok(card(app,target.id));
  assert.equal(app.document.activeElement.className,'dictionary-search');
  const input=body(app).querySelector('.dictionary-search');input.value='uncommitted';input.dispatch('input',{isComposing:true});assert.ok(card(app,target.id));
  search(app,'__not_a_word__');assert.equal(cards(app).length,0);assert.ok(body(app).querySelector('.dictionary-empty'));
  app.get('closeModal').click();assert.equal(app.get('modal').open,false);app.get('collection').click();assert.equal(cards(app).length,48);
  assert.equal(body(app).querySelector('.dictionary-search').value,'');
});

test('English-only missing entries stay playable from Japanese mode and bilingual replays preserve the chosen mode', async () => {
  const englishOnly=catalog.find(word=>word.availability.en.playable&&!word.availability.ja.playable&&word.en.length>5);
  const app=await boot({query:'?word=car&lang=ja'});app.get('collection').click();filter(app,'all').click();search(app,englishOnly.en);
  card(app,englishOnly.id).click();await app.settle(()=>app.snapshot().state==='playing'&&app.snapshot().id===englishOnly.id);
  assert.equal(app.snapshot().mode,'en');assert.equal(app.get('modal').open,false);
  const saved=basic();saved.en.stars.car=3;
  const bilingual=await boot({query:'?word=car&lang=ja',saved});bilingual.get('collection').click();card(bilingual,'car').click();
  body(bilingual).querySelector('.modal-primary').click();await bilingual.settle(()=>bilingual.snapshot().state==='playing');
  assert.equal(bilingual.snapshot().mode,'ja');assert.equal(bilingual.get('modeToggle').disabled,false);
});

test('repeated solves keep per-language scoring and union collection bookkeeping unchanged', async () => {
  const saved=basic();saved.en.stars.car=3;saved.answerRecords.car={en:{bestScore:100,lastScore:100,independent:2},last:'legacy'};
  const app=await boot({query:'?word=car&lang=ja',saved});app.solve();
  assert.equal(app.save().ja.stars.car,3);assert.equal(app.save().answerRecords.car.ja.bestScore,100);
  assert.equal(app.save().answerRecords.car.en.independent,2);assert.equal(app.save().answerRecords.car.last,'legacy');
  app.get('collection').click();assert.equal(cards(app).length,1);assert.equal(score(card(app,'car')).dataset.score,'100');
});

test('score styling stays compact with no collection stamp animation and refreshes the runtime tokens', () => {
  const css=fs.readFileSync(__dirname+'/style.css','utf8'), html=fs.readFileSync(__dirname+'/../picture-words.html','utf8');
  assert.match(css,/\.collection-score-stamp\{[^}]*width:48px;height:48px/);
  assert.match(css,/\.dictionary-entry-art \.collection-score-stamp\{[^}]*width:64px;height:64px/);
  assert.doesNotMatch(css.match(/\.collection-score-stamp\{[^}]*\}/)[0],/animation:/);
  const crypto=require('node:crypto');for(const file of ['game.js','style.css']){
    const token=crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/'+file)).digest('hex').slice(0,12);
    assert.ok(html.includes('picture-words/'+file+'?v='+token));
  }
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
  app.solve();assert.equal(app.save().ja.stars.family,3);assert.equal(app.save().answerRecords.family.en.bestScore,100);
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
