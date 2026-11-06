'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),read=name=>fs.readFileSync(path.join(root,name),'utf8'),scope={window:{}};
for(const file of ['app/data/generated-etymon/custom-learning-levels.js','app/data/generated-etymon/weblio-learning-levels.js','app/data/generated-etymon/learning-levels.js'])vm.runInNewContext(read(file),scope);
const envelope=scope.window.ETYMON_CUSTOM_LEARNING_LEVELS,payload=JSON.parse(zlib.gunzipSync(Buffer.from(envelope.data,'base64')));
const custom=require('./custom-learning-levels.js'),engine=require('./explorer-difficulty-v2.js'),canonical=custom.create(payload),index=engine.canonicalIndex(canonical);
const words=JSON.parse(read('app/data/generated-etymon/words.json')),wordKey=w=>JSON.stringify([w.w,w.p,w.etymology_id||null]);
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const stable=value=>Array.isArray(value)?'['+value.map(stable).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',')+'}':JSON.stringify(value);
const packed=data=>{const bytes=Buffer.from(JSON.stringify(data));return {schema:1,encoding:'gzip-base64',data:zlib.gzipSync(bytes).toString('base64'),sha256:digest(bytes)};};

test('the canonical profile and word snapshot have their exact source fingerprints',()=>{
 assert.equal(payload.ruleVersion,'mother_weblio_first_v1');
 assert.equal(payload.sourceWordsSha256,digest(fs.readFileSync(path.join(root,'app/data/generated-etymon/words.json'))));
 assert.equal(digest(Buffer.from(stable(payload.profile))),custom.policySha256);
 assert.equal(payload.policySha256,payload.profileSha256);
 for(const change of [d=>d.ruleVersion='cefr_plus_edited_aux_v0.1',d=>d.profile.weblioTo10[5]=7,d=>d.profileSha256='0'.repeat(64),d=>d.sourceWeblioSha256='missing']){
  const bad=structuredClone(payload);change(bad);assert.throws(()=>custom.create(bad),/profile/);
 }
});

test('every unique canonical record retains the pre-existing Weblio-first scale',()=>{
 const legacy=engine.makeIndex(scope.window.ETYMON_WEBLIO_LEVELS,scope.window.ETYMON_LEARNING_LEVELS),counts=new Map();
 for(const word of words)counts.set(wordKey(word),(counts.get(wordKey(word))||0)+1);
 for(const word of words){
  const actual=engine.evaluate(word,index),expected=engine.evaluate(word,legacy);
  assert.equal(actual.level,counts.get(wordKey(word))>1?null:expected.level,wordKey(word));
 }
 const protein=words.find(w=>w.w==='protein');assert.ok(protein);
 assert.equal(canonical.lookup(protein).web,5);assert.equal(engine.evaluate(protein,index).level,5);
 assert.equal(engine.evaluate(protein,index).level/2,2.5);
});

test('stale identities and missing canonical data never fall back to a formula',()=>{
 const word=words.find(w=>canonical.lookup(w));assert.ok(word);
 for(const changed of [{...word,pos:'wrong'},{...word,p:['wrong']},{...word,ja:'changed'},{...word,en:'changed'},{...word,etymology_id:'wrong'},{...word,w:word.w.toUpperCase()}])assert.equal(canonical.lookup(changed),null);
 const mixed={...engine.makeIndex(scope.window.ETYMON_WEBLIO_LEVELS,scope.window.ETYMON_LEARNING_LEVELS),...engine.canonicalIndex({lookup:()=>null})};
 assert.equal(engine.evaluate(word,mixed).level,null);
 assert.equal(engine.evaluate(word,mixed).basis,'unclassified');
 assert.throws(()=>engine.canonicalIndex(null),/unavailable/);
});

test('same-spelled origins stay distinct and exact duplicates are rejected',()=>{
 const word=words.find(w=>canonical.lookup(w)),entry=canonical.lookup(word),data={...payload,entries:[{...entry,etymology_id:'one',level:2},{...entry,etymology_id:'two',level:7}]};
 const lookup=custom.create(data);
 assert.equal(lookup.lookup({...word,etymology_id:'one'}).level,2);
 assert.equal(lookup.lookup({...word,etymology_id:'two'}).level,7);
 assert.equal(lookup.lookup({...word,etymology_id:null}),null);
 data.entries.push({...entry,etymology_id:'one',level:2});
 assert.equal(custom.create(data).lookup({...word,etymology_id:'one'}),null);
});

test('browser decoding rejects old policy and corrupt data before any view can use it',async()=>{
 const scope={EtymonCustomLearningLevels:custom,ETYMON_CUSTOM_LEARNING_LEVELS:envelope};
 const current=await engine.loadCanonical(scope);assert.equal(current.data.ruleVersion,custom.version);
 await assert.rejects(engine.loadCanonical({...scope,ETYMON_CUSTOM_LEARNING_LEVELS:{...envelope,sha256:'0'.repeat(64)}}),/checksum/);
 await assert.rejects(engine.loadCanonical({...scope,ETYMON_CUSTOM_LEARNING_LEVELS:packed({...payload,ruleVersion:'cefr_plus_edited_aux_v0.1'})}),/profile/);
 await assert.rejects(engine.loadCanonical({}),/unavailable/);
});

test('the real Etymopedia loader uses the same canonical values and holds mixed snapshots',async()=>{
 const api=require('../support/etymopedia/learning-levels.js'),word=words.find(w=>canonical.lookup(w)),data={schema:1,wordsSha256:payload.sourceWordsSha256,words:[word],roots:[]};
 const scope={EtymonDifficultyV2:engine,EtymonCustomLearningLevels:custom,ETYMON_CUSTOM_LEARNING_LEVELS:envelope,ETYMOPEDIA_CURRENT_DATA:packed(data)};
 const service=await api.load({scope});
 assert.deepEqual(service.lookup({w:word.w,p:word.p,jp:word.ja,etymology_id:word.etymology_id}),canonical.lookup(word));
 assert.equal(service.lookup({w:word.w,p:word.p,jp:'different sense'}),null);
 await assert.rejects(api.load({scope:{...scope,ETYMOPEDIA_CURRENT_DATA:packed({...data,wordsSha256:'0'.repeat(64)})}}),/snapshot mismatch/);
 await assert.rejects(api.load({scope:{...scope,ETYMON_CUSTOM_LEARNING_LEVELS:null}}),/Missing mother/);
});
