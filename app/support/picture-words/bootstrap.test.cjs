const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./test-support/bootstrap-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{fileURLToPath}=require('node:url');
const catalogScope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'catalog.js'),'utf8'),catalogScope);
const captionless=catalogScope.window.PICTURE_WORDS_CATALOG.find(w=>w.description.status==='missing'&&w.availability.en.playable&&!w.availability.ja.playable);
assert.ok(captionless,'catalog needs an actual missing-caption English-only row');
const captionlessQuery='?word='+encodeURIComponent(captionless.id);
const captionlessLetters=[...captionless.availability.en.answer.toUpperCase()];
const invalidNames=new Set(JSON.parse(fs.readFileSync(path.join(__dirname,'reviewed-catalog-report.json'))).invalidPngFiles?.map(x=>path.basename(x.path))||[]);
const pngCount=process.env.PICTURE_WORDS_INVENTORY_MANIFEST?Object.keys(JSON.parse(fs.readFileSync(process.env.PICTURE_WORDS_INVENTORY_MANIFEST)).images).length:fs.readdirSync(path.resolve(__dirname,'../../../assets/word')).filter(name=>name.endsWith('.png')&&!invalidNames.has(name)).length;
test('actual file bootstrap uses all image rows but loads only selected captionless image, never fetches or eagerly loads packs',async()=>{
 const app=await boot({query:captionlessQuery});assert.equal(app.window.PICTURE_WORDS_CATALOG.length,pngCount);assert.equal(app.window.PICTURE_WORDS_CATALOG_META.count,pngCount);assert.ok(pngCount>12000);
 assert.equal(app.snapshot().id,captionless.id);assert.equal(app.snapshot().state,'playing');assert.equal(app.snapshot().mode,'en');assert.deepEqual(app.snapshot().letters,captionlessLetters);
 assert.equal(app.fetches.length,0);assert.equal(app.scripts.length,0);assert.equal(app.images.length,1);assert.ok(decodeURIComponent(new URL(app.images[0].url).pathname).endsWith('/'+captionless.image.path));assert.equal(new URL(app.images[0].url).searchParams.get('v'),captionless.image.sha256);assert.equal(app.speech.length,0);
});

test('actual captionless solve preserves old saved IDs and displays 解説未作成 without any automatic TTS',async()=>{
 const old={mode:'en',routeVersion:2,en:{wordId:captionless.id,stars:{legacyRemoved:3,car:2}},ja:{stars:{legacyRemoved:1}},answerRecords:{legacyRemoved:{en:{independent:2}}}};
 const app=await boot({query:captionlessQuery,saved:old});app.solve();
 assert.equal(app.snapshot().state,'solved');assert.equal(app.snapshot().caption,'解説未作成');assert.equal(app.get('winPronunciation').hidden,true);assert.equal(app.speech.length,0);
 const saved=app.save();assert.equal(saved.en.stars[captionless.id],3);assert.equal(saved.en.stars.legacyRemoved,3);assert.equal(saved.en.stars.car,2);assert.equal(saved.ja.stars.legacyRemoved,1);assert.equal(saved.answerRecords.legacyRemoved.en.independent,2);assert.equal(saved.en.wordId,captionless.id);
 assert.equal(app.get('advanceLabel').textContent,'次の問題へ →');assert.equal(app.get('rewardScene').hidden,false);
 app.get('listenClue').click();assert.equal(app.speech.length,1);assert.equal(app.speech[0].text,captionless.availability.en.answer);assert(app.speech.every(u=>u.text?.trim()));
});

test('a genuinely unsupported Japanese answer explains its unavailability on tap without changing image',async()=>{
 const app=await boot({query:captionlessQuery}),before=app.snapshot();
 const reason=app.window.WordBloomReviewedScenes.unavailableReason(captionless,'ja',before.mode);
 assert.equal(app.get('modeToggle').disabled,false);assert.equal(app.get('modeToggle').getAttribute('aria-disabled'),'false');assert.ok(app.get('modeToggle').title);assert.match(app.get('modeLabel').textContent,/未確認|未対応/);
 app.get('modeToggle').click();assert.deepEqual(app.snapshot(),before);assert.ok(app.get('feedback').textContent);
 app.get('modeToggle').dispatch('click');assert.equal(app.snapshot().mode,'en');assert.equal(app.snapshot().id,captionless.id);assert.deepEqual(app.snapshot().letters,captionlessLetters);assert.match(app.get('feedback').textContent,new RegExp(reason));assert.equal(app.speech.length,0);
});

test('actual one-letter English and one-kana Japanese puzzles solve with exactly one tile',async()=>{
 const english=await boot({query:'?word=i'});assert.deepEqual(english.snapshot().letters,['I']);english.solve();assert.equal(english.snapshot().state,'solved');assert.equal(english.save().en.stars.i,3);
 const word=english.window.PICTURE_WORDS_CATALOG.find(w=>w.availability.ja.playable&&[...w.w].length===1);assert.ok(word);
 const japanese=await boot({query:'?word='+encodeURIComponent(word.id)+'&lang=ja'});assert.equal(japanese.snapshot().id,word.id);assert.deepEqual(japanese.snapshot().letters,[word.w]);japanese.solve();assert.equal(japanese.snapshot().state,'solved');assert.equal(japanese.save().ja.stars[word.id],3);assert(japanese.speech.every(u=>u.text?.trim()));
});

test('actual unknown or unavailable exact IDs never initialize a random image or a substituted language',async()=>{
 for(const query of ['?word=unknown-exact-id',captionlessQuery+'&lang=ja','?word=car&word='+encodeURIComponent(captionless.id)]){
  const app=await boot({query});assert.equal(app.snapshot().state,'error');assert.equal(app.snapshot().id,undefined);assert.equal(app.images.length,0);assert.equal(app.scripts.length,0);assert.equal(app.speech.length,0);assert.equal(app.get('startPlay').disabled,true);assert.equal(app.get('launchScreen').open,true);
  app.get('startPlay').click();assert.equal(app.images.length,0);assert.equal(app.snapshot().state,'error');
 }
});

test('actual reviewed caption starts only after solve and uses the exact selected language',async()=>{
 for(const lang of ['en','ja']){
  const app=await boot({query:'?word=car&lang='+lang});const word=app.window.PICTURE_WORDS_CATALOG.find(w=>w.id==='car');assert.equal(app.snapshot().id,'car');assert.equal(app.snapshot().mode,lang);assert.equal(app.scripts.length,1);assert.equal(app.fetches.length,0);assert.equal(app.speech.length,0);
  app.solve();assert.equal(app.snapshot().state,'solved');assert.equal(app.speech.length,0);app.flushTimers(3000);assert.equal(app.speech.length,1);assert.equal(app.speech[0].text,word.description[lang]);assert.equal(app.speech[0].lang,lang==='ja'?'ja-JP':'en-US');assert.equal(app.get('winPronunciation').hidden,false);assert.equal(app.snapshot().caption,word.description.en+word.description.ja);
 }
});

test('repaired said image uses its reviewed farewell caption and hash-verified pack only after solve',async()=>{
 const app=await boot({query:'?word=said'}),word=app.window.PICTURE_WORDS_CATALOG.find(w=>w.id==='said');
 assert.equal(word.description.status,'reviewed');assert.equal(word.description.ttsAllowed,true);assert.equal(word.description.en,'She said goodbye and waved.');assert.equal(word.description.ja,'彼女はさようならと言って手を振った。');
 assert.equal(word.image.sha256,'25645de93d2f6c6f3340b0a35abbc2b5721039a66ebcbd2d4c547c96983159ab');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../..',word.image.path))).digest('hex'),word.image.sha256);assert.equal(word.reviewedScene.image.sha256,word.image.sha256);
 assert.equal(app.snapshot().id,'said');assert.deepEqual(app.snapshot().letters,[...'SAID']);assert.equal(app.snapshot().state,'playing');assert.equal(app.scripts.length,1);assert.equal(fileURLToPath(app.scripts[0]),path.join(__dirname,'scene-assets','said@'+word.image.sha256+'.js'));assert.equal(app.images.length,1);assert.equal(app.fetches.length,0);assert.equal(app.speech.length,0);
 app.solve();assert.equal(app.snapshot().state,'solved');assert.equal(app.snapshot().caption,word.description.en+word.description.ja);assert.equal(app.get('winPronunciation').hidden,false);assert.equal(app.speech.length,0);app.flushTimers(3000);assert.equal(app.speech.length,1);assert.equal(app.speech[0].text,word.description.en);assert.equal(app.speech[0].lang,'en-US');
});

test('actual repeated language switches keep one image, cancel prior audio, and Next ignores repeat clicks while loading',async()=>{
 const app=await boot({query:'?word=car'}),firstId=app.snapshot().id,firstImage=app.get('clueImage').src;
 app.get('listenClue').click();const firstUtterance=app.speech[0];assert.equal(firstUtterance.text,'car');
 app.get('modeToggle').click();assert.equal(app.snapshot().mode,'ja');assert.equal(app.snapshot().id,firstId);assert.equal(app.get('clueImage').src,firstImage);assert.ok(app.cancelCount()>0);
 app.get('modeToggle').click();app.get('modeToggle').click();app.get('modeToggle').click();assert.equal(app.snapshot().mode,'en');assert.equal(app.get('clueImage').src,firstImage);assert.equal(app.scripts.length,1);
 app.solve();const oldCaption=app.speech.at(-1);assert.equal(app.snapshot().state,'solved');
 app.get('advanceLabel').click();app.get('advanceLabel').click();await app.settle(()=>app.snapshot().state==='playing');const next=app.snapshot();assert.notEqual(next.id,firstId);assert.equal(app.get('rewardExplanation').hidden,true);assert.equal(app.get('winPronunciation').hidden,true);assert.equal(app.get('rewardScene').hidden,true);
 const calls=app.speech.length;oldCaption.onend?.();firstUtterance.onend?.();app.flushTimers();assert.equal(app.speech.length,calls);assert.equal(app.snapshot().id,next.id);assert.equal(app.snapshot().state,'playing');assert.equal(app.get('rewardScene').hidden,true);assert.equal(app.fetches.length,0);
});


test('actual desktop shell forwards the exact requested ID and language to its game iframe without starting a random puzzle',async()=>{
 const app=await boot({query:'?word=a%40an&lang=ja',desktopHost:true});
 assert.equal(app.window.NICOLINGO_PHONE_HOST,true);const frame=app.document.querySelector('iframe');assert.ok(frame);
 const target=new URL(frame.src);assert.equal(target.searchParams.get('word'),'a@an');assert.equal(target.searchParams.get('lang'),'ja');assert.equal(target.searchParams.get('phone'),'1');assert.equal(target.protocol,'file:');
 assert.equal(app.images.length,0);assert.equal(app.scripts.length,0);assert.equal(app.fetches.length,0);assert.equal(app.speech.length,0);
});
