'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../..'),api=require('../../shared/vocabulary-search.js'),origins=require('../../shared/etymology-origins.js');
const {contextFor}=require('./profile-search.cjs');
const tests=[];function test(name,run){const extra=run();tests.push({name,passed:true,...(extra||{})});}
const fixture=[
 {i:0,w:'board',p:['board-one'],etymology_id:'wood',ja:'木板',k:'ボード',pos:'名',r:1,pica:'board',pic:true,origin_families:['ゲルマン'],origin_languages:['古英語']},
 {i:1,w:'plank',p:['plank'],ja:'厚板',pos:'名',r:2,pica:'board',pic:true,origin_families:['ロマンス'],origin_languages:['フランス語']},
 {i:2,w:'board',p:['board-two'],etymology_id:'committee',ja:'委員会',pos:'名',r:3,pica:'board@committee',pic:true,origin_families:['ゲルマン'],origin_languages:['古英語']},
 {i:3,w:'missing',p:[],ja:'画像なし',pos:'名',r:4,pic:false},
];
const imageURLs=w=>w.pica?['../assets/word/'+encodeURIComponent(w.pica)+'.png?v=fixture']:[];
const create=()=>api.createIndex(fixture,{baseURL:'https://example.invalid/site/app/vocabulary-master.html',imageURLs});
test('exact image references return every referencing sense and never strip to a spelling',()=>{
 const index=create();assert.deepEqual(index.search('board.png').map(w=>w.i),[0,1]);
 assert.deepEqual(index.search('board@committee.png').map(w=>w.i),[2]);
 assert.deepEqual(index.search('board').map(w=>w.i),[0,2]);assert.deepEqual(index.search('missing.png'),[]);
});
test('Windows paths, file URLs, other HTTP prefixes, encoding and version suffixes resolve the same registered image',()=>{
 const index=create();
 for(const q of ['D:\\Projects\\etymolingo\\assets\\word\\board.png','"D:\\Other clone\\assets\\word\\board.png"','file:///D:/Projects/etymolingo/assets/word/board.png',
  'https://example.invalid/new-repository/assets/word/board.png?v=changed#preview','../assets/word/BOARD.PNG'])assert.deepEqual(index.search(q).map(w=>w.i),[0,1],q);
 assert.deepEqual(index.search('file:///D:/Projects/assets/word/board%40committee.png?v=1').map(w=>w.i),[2]);
});
test('English, Japanese, kana and rarity match ordering stay intact',()=>{
 const index=create();assert.deepEqual(index.search('bo').map(w=>w.i),[0,2]);assert.deepEqual(index.search('木板').map(w=>w.i),[0]);
 assert.deepEqual(index.search('ボード').map(w=>w.i),[0]);assert.deepEqual(index.search('板').map(w=>w.i),[0,1]);assert.equal(index.search(''),fixture);
});
test('cached queries invalidate only when reviewed scene text changes',()=>{
 const words=[{w:'scene',p:['one'],ja:'現在義',pica:'scene',r:1},{w:'scene',p:['two'],ja:'別義',pica:'scene@two',r:2}];
 const key=x=>JSON.stringify([x.w,x.p,x.art]),index=api.createIndex(words,{sceneKey:w=>key({...w,art:w.pica})});
 const first=index.search('描写語');assert.equal(index.search('描写語'),first);
 index.setScenes([{w:'scene',p:['one'],art:'scene',status:'reviewed',sense:{ja:'現在義'},scene:{ja:'描写語',en:'unique scene'}},
  {w:'scene',p:['two'],art:'scene@two',status:'reviewed',sense:{ja:'古い別義'},scene:{ja:'描写語',en:'stale'}}],{key,matches:(e,w)=>e.sense.ja===w.ja});
 assert.deepEqual(index.search('描写語'),[words[0]]);assert.notEqual(index.search('描写語'),first);assert.equal(index.scenesReady,true);
 for(let i=0;i<40;i++)index.search('cache-query-'+i);assert.ok(index.stats().cached_queries<=12);
});
function frames(){let id=0;const queue=new Map();return {queue,request:fn=>{queue.set(++id,fn);return id;},cancel:key=>queue.delete(key),run(){const jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn();}};}
test('latest-input scheduling coalesces work, retains final text, flushes and cancels without stale renders',()=>{
 const frame=frames(),rendered=[],scheduler=api.createLatestScheduler(q=>rendered.push(q),frame);
 for(const q of ['b','bo','boa','boar','board'])scheduler.schedule(q);
 assert.equal(frame.queue.size,1);assert.deepEqual(rendered,[]);frame.run();assert.deepEqual(rendered,['board']);
 scheduler.schedule('水');scheduler.flush();assert.deepEqual(rendered,['board','水']);assert.equal(frame.queue.size,0);
 scheduler.schedule('discard');scheduler.cancel();frame.run();assert.deepEqual(rendered,['board','水']);
});
const html=fs.readFileSync(path.join(root,'app/vocabulary-master.html'),'utf8');
const runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function baseWords()'))[2];
test('actual input handlers retain IME composition, final rapid input and clear-button behavior',()=>{
 const block=runtime.slice(runtime.indexOf("const gs=$('#gs');"),runtime.indexOf("addEventListener('keydown',e=>{",runtime.indexOf("const gs=$('#gs');")));
 const frame=frames(),listeners={},renders=[],timer=new Map();let timerId=0,focused=0;
 const gs={value:'',addEventListener:(name,fn)=>{listeners[name]=fn;},focus:()=>focused++},x={classList:{toggle(){},remove(){}}};
 const c={window:{VocabularySearch:{createLatestScheduler:run=>api.createLatestScheduler(run,frame)}},$:selector=>selector==='#gs'?gs:x,q:'',mode:'root',F:{},limit:400,
  setNav:()=>{},renderAll:()=>renders.push(c.q),renderToolbar:()=>{},renderTable:()=>{},pushState:()=>{},
  setTimeout:fn=>{timer.set(++timerId,fn);return timerId;},clearTimeout:id=>timer.delete(id)};
 vm.createContext(c);vm.runInContext(block,c);
 for(const value of ['b','bo','board.png']){gs.value=value;listeners.input({});assert.equal(c.q,value);}
 assert.deepEqual(renders,[]);frame.run();assert.deepEqual(renders,['board.png']);
 listeners.compositionstart();gs.value='み';listeners.input({isComposing:true});assert.equal(frame.queue.size,0);
 gs.value='水';listeners.compositionend();frame.run();assert.deepEqual(renders,['board.png','水']);
 gs.value='pending';listeners.input({});x.onclick();frame.run();assert.deepEqual(renders,['board.png','水','']);assert.equal(c.q,'');assert.equal(focused,1);assert.equal(timer.size,0);
});
const env=contextFor(html),index=api.createIndex(env.words,{baseURL:'https://example.invalid/etymolingo/app/vocabulary-master.html',imageURLs:env.context.wordSearchImageURLs,
 sceneKey:w=>env.scenes.key({w:w.w,p:w.p,etymology_id:w.etymology_id,art:w.pica||env.context.safeArtName(w.w)})});
index.setScenes(env.sceneEntries,{key:env.scenes.key,matches:env.scenes.firstSenseMatches});
test('actual baseWords and two-level filters compose with exact shared-image matches',()=>{
 const c=env.context;const currentWords=c.WORDS,currentIndex=c.SEARCH_INDEX;
 c.WORDS=fixture;c.SEARCH_INDEX=create();c.q='board.png';c.F.originFamilies=['ロマンス'];c.F.originLanguages=['フランス語'];
 assert.deepEqual(Array.from(c.applyFilters(c.baseWords()),w=>w.i),[1]);
 c.F.originFamilies=['ゲルマン','ロマンス'];c.F.originLanguages=['古英語','フランス語'];assert.deepEqual(Array.from(c.applyFilters(c.baseWords()),w=>w.i),[0,1]);
 c.F.originFamilies=['ロマンス'];c.F.originLanguages=['古英語'];assert.deepEqual(Array.from(c.applyFilters(c.baseWords())),[]);
 c.F.originFamilies=[];c.F.originLanguages=[];c.WORDS=currentWords;c.SEARCH_INDEX=currentIndex;
});
test('all public image reference filenames resolve every exact row, including alternate and ID-specific art',()=>{
 const expected=new Map();let explicitOriginReferences=0,alternateReferences=0;
 for(const word of env.words){
  if(word.etymology_art)explicitOriginReferences++;if(word.art_senses?.length)alternateReferences+=word.art_senses.length;
  for(const url of env.context.wordSearchImageURLs(word)){
   const file=decodeURIComponent(new URL(url,'https://example.invalid/app/').pathname.split('/').at(-1)).toLowerCase();
   let values=expected.get(file);if(!values)expected.set(file,values=new Set());values.add(word);
  }
 }
 let shared=0;
 for(const [file,values] of expected){
  const actual=index.search(file);assert.equal(actual.length,values.size,file);for(const word of actual)assert.ok(values.has(word),file+' returned another sense');if(values.size>1)shared++;
 }
 const boards=index.search('board.png');assert.ok(boards.length);assert.deepEqual(index.search('D:\\Projects\\etymolingo\\assets\\word\\board.png'),boards);
 const stem=[...expected.keys()].find(file=>file.includes('@'));assert.ok(stem);assert.deepEqual(index.search('https://example.invalid/another-prefix/assets/word/'+encodeURIComponent(stem)),index.search(stem));
 return {public_records:env.words.length,verified_image_filenames:expected.size,shared_image_filenames:shared,explicit_origin_art_references:explicitOriginReferences,alternate_art_references:alternateReferences,board_filename_matches:boards.map(w=>({i:w.i,w:w.w,p:w.p,etymology_id:w.etymology_id||''}))};
});
test('index construction and queries preserve every word field',()=>{
 const before=JSON.stringify(fixture);const ix=create();ix.search('board.png');ix.search('板');assert.equal(JSON.stringify(fixture),before);
});
test('HTML runtime parses, retains lazy full-result appending and avoids repeated ready-scene repaint',()=>{
 new vm.Script(runtime);assert.match(runtime,/const CHUNK=100/);assert.match(runtime,/tblRows\.slice\(tblShown,tblShown\+CHUNK\)/);
 assert.match(runtime,/if\(!query\|\|SEARCH_INDEX\?\.scenesReady\)return/);assert.match(html,/shared\/vocabulary-search\.js\?v=/);
});
const report={status:'passed',tests:tests.length,results:tests,limitations:['No browser DOM/layout pass is implied.']};
const output=path.join(root,'work/search-performance-20261028/search-tests.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
