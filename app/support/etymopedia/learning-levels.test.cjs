'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),api=require('./learning-levels.js'),engine=require('../../shared/explorer-difficulty-v2.js');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),hash=raw=>crypto.createHash('sha256').update(raw).digest('hex');
const context={};context.window=context;vm.createContext(context);
for(const p of ['app/data/generated-etymon/weblio-learning-levels.js','app/data/generated-etymon/learning-levels.js','app/support/etymopedia/current-data.js'])vm.runInContext(read(p),context);
const envelope=context.ETYMOPEDIA_CURRENT_DATA,projection=JSON.parse(zlib.gunzipSync(Buffer.from(envelope.data,'base64'))),words=JSON.parse(read('app/data/generated-etymon/words.json')),roots=JSON.parse(read('app/data/generated-etymon/roots.json'));
const index=engine.makeIndex(context.ETYMON_WEBLIO_LEVELS,context.ETYMON_LEARNING_LEVELS),service=api.create(engine,index,projection.words,projection.roots);
test('levels 1–10 display exactly half as many stars, retaining all ten levels',()=>{
 for(let n=1;n<=10;n++){
  const markup=api.pill(n);assert.equal((markup.match(/class="el-star(?: el-half)?"/g)||[]).length,Math.ceil(n/2));
  assert.equal((markup.match(/el-half/g)||[]).length,n%2);assert.ok(markup.includes('data-stars="'+n/2+'"'));
  assert.ok(markup.includes('data-level="'+n+'"'));assert.ok(markup.includes('data-scale="5"'));
  assert.equal(api.theme(n),Math.ceil(n*7/10));
 }
 for(const n of [null,undefined,0,-1,11,1.5,NaN,'1']){assert.equal(api.stars(n),'');assert.ok(api.pill(n).includes('未分類'));}
 assert.equal((api.stars(10).match(/★/g)||[]).length,5);
});
test('public projection has strict safe fields and integrity independent of shared DB',async()=>{
 const {validate}=require('./build-data.cjs');validate(projection);
 assert.match(projection.wordsSha256,/^[a-f0-9]{64}$/);assert.match(projection.rootsSha256,/^[a-f0-9]{64}$/);
 assert.equal(projection.canonicalWordCount,words.length);assert.equal(projection.roots.length,12);
 const current=new Set(words.map(api.key));for(const row of projection.words)assert.ok(current.has(api.key(row)));
 assert.deepEqual(await api.decodeSnapshot(envelope),projection);
 await assert.rejects(api.decodeSnapshot({...envelope,sha256:'bad'}),/checksum/);
 const bad=JSON.parse(JSON.stringify(projection));bad.words[0].b={source_original:'PRIVATE'};assert.throws(()=>validate(bad),/Invalid public text/);
});
test('all projected levels use the existing Weblio-first API without changing DB values',()=>{
 const before=JSON.stringify(projection.words);
 for(const source of projection.words){const legacy={w:source.w,p:source.p,jp:source.ja};assert.deepEqual(service.lookup(legacy),engine.evaluate(source,index));}
 assert.equal(JSON.stringify(projection.words),before);
 const levels=new Set(words.map(w=>engine.evaluate(w,index).level));assert.deepEqual([...levels].sort((a,b)=>(a??99)-(b??99)),[1,2,3,4,5,6,7,8,9,10,null]);
});
test('meaning conflicts, absent/changed roots, ambiguous identities remain unclassified',()=>{
 const source=projection.words.find(w=>w.w==='head');assert.ok(source);
 for(const row of [{w:source.w,p:source.p,jp:'別の意味'},{w:source.w,p:['wrong-root'],jp:source.ja},{w:'not-a-word',p:source.p,jp:source.ja}])assert.equal(service.lookup(row),null);
 assert.equal(api.create(engine,index,[source,source]).lookup({w:source.w,p:source.p,jp:source.ja}),null);
 const merlin=service.status({w:'merlin',p:['mori-'],jp:'魔法使いマーリン'});assert.equal(merlin.status,'sense_hold');
 assert.equal(service.lookup({w:'merlin',p:['mori-'],jp:'魔法使いマーリン'}),null);
});
test('data update uses authoritative text and corrected POS while keeping art, keys and empty memo',()=>{
 const source=projection.words.find(w=>w.w==='head');
 const row={w:'head',p:source.p,jp:source.ja,pos:'動',morphs:['head'],split:['head',''],art:'keep.png',memo:'old'};
 const imageFields=JSON.stringify({w:row.w,p:row.p,morphs:row.morphs,split:row.split,art:row.art});service.update(row);
 assert.equal(row.pos,source.pos);assert.equal(row.memo,source.b);assert.equal(row.gloss,source.en);
 assert.equal(JSON.stringify({w:row.w,p:row.p,morphs:row.morphs,split:row.split,art:row.art}),imageFields);
 const blank={...source,b:''};const empty=api.create(engine,index,[blank]);const target={w:source.w,p:source.p,jp:source.ja,memo:'old'};empty.update(target);assert.equal(target.memo,'');
 const viewRoot={pie:'kaput-',art:'same.png',concept:'same-seal.png',note:'old'};service.apply([],{}, {kaput:viewRoot},{});
 assert.equal(viewRoot.note,projection.roots.find(r=>r.key==='kaput-').d);assert.equal(viewRoot.art,'same.png');assert.equal(viewRoot.concept,'same-seal.png');
});
test('featured and family entries reconcile only through separately confirmed exact identity and sense',()=>{
 const current={w:'test',p:['root'],ja:'現在の語義',pos:'名',b:'現在のメモ',r:400};
 const exact=api.create(engine,index,[current]),featured={w:'test',p:['root'],jp:'以前の言い回し'};
 exact.apply([featured],{root:[['test','G','現在の語義','old',['root']]]},{},{test:featured});
 assert.equal(featured.jp,'現在の語義');assert.ok(exact.lookup(featured));
 const hold=api.create(engine,index,[current]),other={w:'test',p:['root'],jp:'別の意味'};
 hold.apply([other],{root:[['test','G','現在の語義','old',['wrong-root']]]},{},{test:other});assert.equal(hold.lookup(other),null);assert.equal(other.jp,'別の意味');
});
test('HTTP uses the safe snapshot and fails closed when it is missing',async()=>{
 const requested=[];const scope={ETYMOPEDIA_CURRENT_DATA:envelope,EtymonDifficultyV2:engine,ETYMON_WEBLIO_LEVELS:context.ETYMON_WEBLIO_LEVELS,ETYMON_LEARNING_LEVELS:context.ETYMON_LEARNING_LEVELS,fetch:async p=>{requested.push(p);return {ok:true,json:async()=>p.endsWith('/words.json')?words:roots};}};
 const http=await api.load({protocol:'https:',scope});const head=words.find(w=>w.w==='head');assert.deepEqual(http.lookup({w:head.w,p:head.p,jp:head.ja}),engine.evaluate(head,index));
 assert.deepEqual(requested,[]);
 await assert.rejects(api.load({protocol:'https:',scope:{...scope,ETYMOPEDIA_CURRENT_DATA:null}}),/unavailable/);
 const file=await api.load({protocol:'file:',scope:{...scope,ETYMOPEDIA_CURRENT_DATA:envelope,fetch:async()=>{throw Error('file mode must not fetch');}}});assert.deepEqual(file.lookup({w:head.w,p:head.p,jp:head.ja}),engine.evaluate(head,index));
});
test('shared difficulty script exposes the same API without mounting when requested',()=>{
 const source=read('app/shared/explorer-difficulty-v2.js');const sandbox={document:{currentScript:{dataset:{apiOnly:'true'}}}};vm.runInNewContext(source,sandbox);
 assert.equal(typeof sandbox.EtymonDifficultyV2.evaluate,'function');
 assert.equal(sandbox.EtymonDifficultyV2.evaluate({w:'test'},sandbox.EtymonDifficultyV2.makeIndex({},{})).level,null);
});
test('difficulty tap opens details in capture phase, prevents parent navigation and never speaks',()=>{
 let listener,shown=false,stopped=false,prevented=false;
 const dialog={querySelector:s=>s==='.el-details'?{set innerHTML(v){assert.match(v,/最大5個/);}}:null,showModal:()=>{shown=true;}};
 const doc={documentElement:{dataset:{}},addEventListener:(name,fn,capture)=>{assert.equal(name,'click');assert.equal(capture,true);listener=fn;},getElementById:()=>dialog};
 api.bind({document:doc});
 const button={dataset:{level:'10'},closest:()=>null};listener({target:{closest:()=>button},stopPropagation:()=>{stopped=true;},preventDefault:()=>{prevented=true;}});
 assert.ok(shown&&stopped&&prevented);assert.ok(!api.bind.toString().includes('say('));assert.ok(!api.bind.toString().includes('speechSynthesis'));
});
test('entry keeps ten ordered level groups plus unclassified, and uses the current adapter',()=>{
 const html=read('app/etymopedia.html');const runtime=html.split('\n').filter(l=>!l.startsWith('const EMB_')).join('\n');
 assert.match(runtime,/data-api-only="true"/);assert.match(runtime,/await EtymopediaLearning\.load\(\)/);assert.match(runtime,/LEVELS\.apply\(WORDS,LEXICON,ROOTS,byId\)/);
 assert.match(runtime,/Array\.from\(\{length:10\}/);assert.match(runtime,/\),null\]\.map/);assert.match(runtime,/EtymopediaLearning\.pill\(level,big,word\)/);
 assert.ok(!runtime.includes('custom-learning-levels.js'));assert.ok(!runtime.includes('EtymonRarity.learning('));
 new vm.Script([...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].at(-1)[1]);
});
test('derived dictionary uses existing PIE icons rather than language-family pills',()=>{
 const html=read('app/etymopedia.html');const row=html.slice(html.indexOf('const drowHTML='),html.indexOf('// 独自レベル',html.indexOf('const drowHTML=')));
 assert.match(row,/conceptRowHTML\(canonicalRoots,true\)/);assert.match(row,/LEVELS.pieRoots\(\{w,jp,p:pl\}\)/);assert.ok(!row.includes('regionLabel(via)'));assert.ok(!row.includes('viaCls(via)'));
 assert.ok(!html.includes('${w.parts?'));assert.match(html,/entryMorphRow.*conceptRowHTML\(wordConceptKeys\(w\)\)/);
});

test('adjacent displays its registered PIE roots without rewriting data or bypassing sense guards',()=>{
 const w=projection.words.find(w=>w.w==='adjacent');assert.ok(w);const before=JSON.stringify(w);const row={w:w.w,p:w.p,jp:w.ja};assert.ok(service.source(row));assert.deepEqual(service.pieRoots(row),['ad-','yē-']);assert.equal(JSON.stringify(w),before);assert.equal(service.pieRoots({...row,jp:'different sense'}),null);
});
test('twelve configured root maps have six exact sense-locked examples and shared origin labels',()=>{
 const config=JSON.parse(read('app/support/etymopedia/root-map-examples.json'));assert.equal(Object.keys(config).length,12);
 for(const [rootKey,expected]of Object.entries(config)){
  const views=projection.words.filter(w=>w.p.includes(rootKey)).map(w=>({...w,jp:w.ja}));
  const chosen=service.rootExamples(rootKey,'',views,()=>true);
  assert.equal(chosen.length,6);assert.equal(new Set(chosen.map(w=>w.w)).size,6);
  assert.deepEqual(chosen.map(w=>w.w),expected.map(w=>w.w));
  chosen.forEach(w=>assert.ok(service.mapOriginLanguages(w.w).length));
 }
});
test('six-example contract refuses missing artwork, changed sense, roots, levels and duplicate identities',()=>{
 const key='yē-',views=projection.words.filter(w=>w.p.includes(key)).map(w=>({...w,jp:w.ja}));
 assert.throws(()=>service.rootExamples(key,'',views,()=>false),/validation failed/);
 const missing=views.filter(w=>w.w!=='project');assert.throws(()=>service.rootExamples(key,'',missing,()=>true),/validation failed/);
 const wrong=views.map(w=>w.w==='project'?{...w,jp:'別語義'}:w);assert.throws(()=>service.rootExamples(key,'',wrong,()=>true),/validation failed/);
 const wrongRoots=views.map(w=>w.w==='project'?{...w,p:['unrelated']}:w);assert.throws(()=>service.rootExamples(key,'',wrongRoots,()=>true),/validation failed/);
 const noLevels=api.create({evaluate:()=>({level:null})},{},projection.words,projection.roots);assert.throws(()=>noLevels.rootExamples(key,'',views,()=>true),/validation failed/);
 const duplicate=api.create(engine,index,[...projection.words,projection.words.find(w=>w.w==='project')],projection.roots);assert.throws(()=>duplicate.rootExamples(key,'',views,()=>true),/validation failed/);
 const changed=projection.words.map(w=>w.w==='project'?{...w,en:'unrelated sense'}:w);const guarded=api.create(engine,index,changed,projection.roots);assert.throws(()=>guarded.rootExamples(key,'',views,()=>true),/validation failed/);
});
test('root display has origin seals and six selection; dictionary speakers alone are removed',()=>{
 const html=read('app/etymopedia.html'),start=html.indexOf('const drowHTML='),row=html.slice(start,html.indexOf('// 独自レベル',start));
 assert.ok(!row.includes('data-say'));assert.match(html,/entryHW.*data-say/);assert.match(html,/LEVELS.rootExamples\(r.pie,r.note/);assert.match(html,/source.origin_languages/);assert.match(html,/class="originSeal"/);assert.ok(!html.includes('mainWords.slice(0,4)'));
});

