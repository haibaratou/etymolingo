const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),zlib=require('zlib'),crypto=require('crypto');
const root=require('path').resolve(__dirname,'../../..'),s={window:{}};
for(const f of ['app/support/picture-words/catalog.js','app/data/generated-etymon/custom-learning-levels.js','app/data/generated-etymon/learning-levels.js','app/data/generated-etymon/picture-words-selection.js'])vm.runInNewContext(fs.readFileSync(root+'/'+f,'utf8'),s);
Object.assign(global,s.window);global.EtymonCustomLearningLevels=require(root+'/app/shared/custom-learning-levels.js');global.EtymonSpellingEligibility=require(root+'/app/shared/spelling-puzzle-eligibility.js');
const custom=EtymonCustomLearningLevels,cefr=require(root+'/app/shared/learning-levels.js'),gate=require(root+'/app/support/picture-words/learning-gate.js'),rt=require(root+'/app/support/picture-words/reviewed-scenes.js'),difficulty=require(root+'/app/support/picture-words/difficulty.js'),progression=require(root+'/app/support/picture-words/progression.js');
const env=PICTURE_WORDS_SELECTION,rows=PICTURE_WORDS_CATALOG,meta=PICTURE_WORDS_CATALOG_META,decode=e=>JSON.parse(zlib.gunzipSync(Buffer.from(e.data,'base64'))),data=decode(env),pack=d=>({schema:1,encoding:'gzip-base64',data:zlib.gzipSync(Buffer.from(JSON.stringify(d))).toString('base64')});
test('every current question uses the exact mother level and retains reviewed art and scenes',async()=>{
 const state=await gate.load(rows,meta,env,cefr,rt),lookup=custom.create(decode(ETYMON_CUSTOM_LEARNING_LEVELS)),selected=new Set(data.entries.map(e=>e.id));
 const expected=rows.filter(w=>selected.has(w.id)&&lookup.lookup(w)&&!EtymonSpellingEligibility.inflectionOnly(w.en,w.pos,w.ja,w.sceneBinding?.en||''));
 assert.ok(state.words.length>0);assert.equal(state.words.length,expected.length);
 const counts=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,0])),expectedCounts={...counts};
 for(const w of expected)expectedCounts[lookup.lookup(w).level]++;
 for(const w of state.words){assert.ok(rt.validCaption(w));assert.ok(w.description.en&&w.description.ja);assert.ok(w.visualReview.score>=50);assert.equal(w.visualReview.imageGitBlobSha,w.image.git_blob_sha);assert.equal(w.customLearningLevel.senseSha256,w.sense.sha256);assert.equal(w.customLearningLevel.level,lookup.lookup(w).level);counts[w.customLearningLevel.level]++;}
 assert.deepEqual(counts,expectedCounts);assert.equal(state.report.version,custom.version);
 const protein=state.words.find(w=>w.id==='protein');assert.ok(protein);assert.equal(protein.customLearningLevel.level,5);
});
test('modified scores, image hashes, missing captions, wrong learning level fail closed',async()=>{
 for(const change of [e=>e.visualReview.score=49,e=>e.visualReview.imageGitBlobSha='0'.repeat(40),e=>e.description.ja='',e=>e.customLearningLevel.level=e.customLearningLevel.level%10+1,e=>e.customLearningLevel.senseSha256='0'.repeat(64)]){
  const d=structuredClone(data),id=d.entries[0].id;change(d.entries[0]);const state=await gate.load(rows,meta,pack(d),cefr,rt);assert.ok(!state.words.some(w=>w.id===id));
 }
});
test('learning identities reject stale meaning, wrong POS, capitalization and duplicate keys',()=>{
 const payload=decode(ETYMON_CUSTOM_LEARNING_LEVELS),lookup=custom.create(payload),good=rows.find(w=>lookup.lookup(w));assert.ok(good);
 for(const w of [{...good,pos:'wrong'},{...good,en:good.en.toUpperCase()},{...good,sense:{...good.sense,ja:'wrong'}}])assert.equal(lookup.lookup(w),null);
 const entry=lookup.lookup(good);payload.entries.push(entry);assert.equal(custom.create(payload).lookup(good),null);
});
test('custom payload checksum verifies',async()=>{await custom.decode(ETYMON_CUSTOM_LEARNING_LEVELS);await assert.rejects(custom.decode({...ETYMON_CUSTOM_LEARNING_LEVELS,sha256:'0'.repeat(64)}));});
test('ten selected levels never borrow from a different level, including empty ten',()=>{
 const words=Array.from({length:9},(_,i)=>({id:String(i),en:'word',w:'ことば',tier:i}));for(let tier=0;tier<9;tier++)assert.equal(words[progression.selectNext(words,{}, {language:'en',targetTier:tier,random:()=>.9})].tier,tier);
 assert.equal(progression.selectNext(words,{}, {language:'en',targetTier:9}),-1);assert.equal(difficulty.tiers.length,10);
});
test('CEFR selections migrate deterministically, histories remain owned by existing IDs',()=>{
 for(let i=0;i<4;i++){const raw={learningScheme:'CEFR-J-1.6',targetTier:i,en:{wordId:'car',stars:{car:3}},answerRecords:{car:{en:1}}},before=structuredClone(raw),m=difficulty.migrateSelection(raw);assert.equal(m.targetTier,i*2);assert.deepEqual(m.legacyLearningSelection,{scheme:'CEFR-J-1.6',targetTier:i,migration:'paired_band_lower_level'});assert.deepEqual(raw,before);assert.deepEqual(difficulty.migrateSelection({...raw,...m}),m);}
});

test('old rule or mixed mother profile cannot revive an obsolete selection',async()=>{
 for(const change of [d=>d.report.version='cefr_plus_edited_aux_v0.1',d=>d.report.customProfileSha256='0'.repeat(64),d=>d.report.customSourceWordsSha256='0'.repeat(64)]){
  const d=structuredClone(data);change(d);await assert.rejects(gate.load(rows,meta,pack(d),cefr,rt),/selection|source mismatch/);
 }
});
