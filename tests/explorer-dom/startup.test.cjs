const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const {parseHTML}=require('linkedom');
const crypto=require('node:crypto');
const canonicalLevels=require('../../app/shared/custom-learning-levels.js');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'app/vocabulary-master.html'),'utf8');
const scenes=fs.readFileSync(path.join(root,'app/shared/illustration-scenes.js'),'utf8');
const overlay=fs.readFileSync(path.join(root,'app/shared/explorer-difficulty-v2.js'),'utf8');
const components=require('../../app/shared/etymological-components.js');
const componentsUI=require('../../app/shared/vocabulary-components-ui.js');
const search=require('../../app/shared/vocabulary-search.js');
const sceneAPI=require('../../app/shared/illustration-scenes.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const between=(text,start,end)=>{
 const from=text.indexOf(start),to=text.indexOf(end,from);
 assert.notEqual(from,-1,'missing fixture start: '+start);assert.notEqual(to,-1,'missing fixture end: '+end);
 return text.slice(from,to);
};
function componentContext(roots,words){
 const prepared=components.prepare({schema:1,entities:[],words:[],aliases:[]},roots);
 const context={window:{VocabularyComponentsUI:componentsUI},ROOT_BY:new Map(roots.map(r=>[r.key,r])),COMPONENTS:components.bind(words,prepared)};
 vm.runInNewContext(html.match(/^function componentCoverage\([^]*?^function hasPieRoot\([^]*?^}/m)[0],context);
 return context;
}
const unpack=b64=>JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')));
const pack=data=>zlib.gzipSync(JSON.stringify(data)).toString('base64');
const sha=raw=>crypto.createHash('sha256').update(raw).digest('hex');
const motherProfile=(()=>{
 const scope={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'app/data/generated-etymon/custom-learning-levels.js'),'utf8'),scope);
 const data=unpack(scope.window.ETYMON_CUSTOM_LEARNING_LEVELS.data);
 return Object.fromEntries(['schema','ruleVersion','profile','profileSha256','policySha256','sourceCefrSha256','sourceWeblioSha256'].map(name=>[name,data[name]]));
})();
function canonicalFixture(words,expectedLevels){
 assert.equal(words.length,expectedLevels.length);
 const entries=words.map((word,i)=>{
  const p=word.p||[],level=expectedLevels[i],senseJa=canonicalLevels.norm(String(word.ja||'').split('、')[0]),senseEn=canonicalLevels.norm(String(word.en||'').split(' / ')[0]);
  return {dictionaryIndex:i,w:word.w,p,pos:word.pos||'',...(word.etymology_id?{etymology_id:word.etymology_id}:{}),
   senseJa,senseEn,senseSha256:sha(Buffer.from(JSON.stringify([canonicalLevels.norm(word.w),p,senseJa,senseEn]))),
   level,raw:word.r??null,auxiliaryR:word.r??null,web:level===null?null:motherProfile.profile.weblioTo10.indexOf(level),official:[],
   basis:level===null?'unclassified':'weblio_30_to_10',confidence:level===null?'unknown':'provisional',note:'Explicit canonical level for this synthetic fixture'};
 });
 const data={...motherProfile,sourceWordsSha256:sha(Buffer.from(JSON.stringify(words))),entries},raw=Buffer.from(JSON.stringify(data));
 return {EtymonCustomLearningLevels:canonicalLevels,ETYMON_CUSTOM_LEARNING_LEVELS:{schema:1,encoding:'gzip-base64',sha256:sha(raw),data:zlib.gzipSync(raw).toString('base64')}};
}

test('root labels distinguish direct lemmas, uncertain reconstructions and legacy references',()=>{
 const context={};vm.runInNewContext(html.match(/^function rootLabel\([^]*?^}/m)[0],context);
 assert.equal(context.rootLabel({key:'arkhein',kind:'greek_lemma'}),'ギリシャ語 arkhein');
 assert.equal(context.rootLabel({key:'merph-',kind:'unverified_reconstruction'}),'由来未確定 merph-');
 assert.equal(context.rootLabel({key:'ōrd-',kind:'legacy_alias',display_form:'ōrd- → ar-'}),'旧参照 ōrd- → ar-');
 assert.equal(context.rootLabel({key:'ar-'}),'*ar-');
 assert.equal(context.rootLabel({key:'-tro-',kind:'pie_formative'}),'PIEの語形成 -tro-');
 assert.equal(context.rootLabel({key:'snu-',kind:'germanic_sound_symbolism'}),'ゲルマン語の擬音的要素 snu-');
 assert.equal(context.rootLabel({key:'Frankon-',kind:'germanic_lemma',display_form:'Franko'}),'ゲルマン語 Franko');
});

test('PIE formatives remain typed components without becoming lexical PIE roots in the filter',()=>{
 const roots=[{key:'-tro-',kind:'pie_formative'},{key:'ar-'},{key:'autos',kind:'greek_lemma'},{key:'merph-',kind:'unverified_reconstruction'}];
 const words=roots.map(r=>({w:r.key,p:[r.key]})).concat({w:'empty',p:[]});
 const context=componentContext(roots,words);
 assert.equal(context.COMPONENTS.coverage(words[0]).legacy_formative_ref_count,1);
 assert.equal(context.hasPieRoot(words[0]),false);
 assert.equal(context.hasPieRoot(words[1]),true);
 assert.equal(context.hasPieRoot(words[2]),false);
 assert.equal(context.hasPieRoot(words[3]),false);
 assert.equal(context.hasPieRoot(words[4]),false);
});

test('Germanic sound symbolism is not counted as PIE ancestry',()=>{
 const word={w:'sound-symbolic-fixture',p:['snu-']};
 const context=componentContext([{key:'snu-',kind:'germanic_sound_symbolism'}],[word]);
 assert.equal(context.hasPieRoot(word),false);
});

test('PIE registration filter remains independent of proof coverage and its absence',()=>{
 const word={w:'earth',p:['er-2']};
 const context=componentContext([{key:'er-2',kind:'pie_reconstruction',origin_language:'PIE'}],[word]);
 const coverage={guard_valid:false,confirmed_pie_lexical_count:0,confirmed_attested_lexical_count:1,eligible_legacy_pie_ref_count:0};
 context.COMPONENTS={coverage:()=>coverage};
 assert.equal(context.hasPieRoot(word),true);
 assert.equal(coverage.confirmed_pie_lexical_count,0);
 assert.equal(coverage.confirmed_attested_lexical_count,1);
 assert.equal(componentsUI.matches(coverage,'pie',word,context.ROOT_BY),!(!context.hasPieRoot(word)));
 context.COMPONENTS=null;
 assert.equal(context.hasPieRoot(word),true);
 assert.equal(context.hasPieRoot({w:'unknown',p:['unknown']}),false);
});

test('root chips show uncertain relations without converting them into proven etymologies',()=>{
 const context={window:{VocabularyComponentsUI:componentsUI},COMPONENTS:null,esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.runInNewContext(html.match(/^function rootLabel\([^]*?^}/m)[0]+'\n'+between(html,'const ROOT_BY=new Map();','/* この語根がどの道'),context);
 const marked=context.rootChip('gnō-',{root_relations:{'gnō-':{status:'uncertain',direct_form:'norma',direct_meaning:'直角定規・規則',note:'<img src=x onerror=bad()>'}}});
 const {document}=parseHTML('<div>'+marked+'</div>');
 assert.equal(document.querySelector('[data-root-relation]').textContent,'関連未確定');
 assert.match(document.querySelector('[data-root-relation]').title,/norma/);
 assert.equal(document.querySelectorAll('img').length,0);
 assert.doesNotMatch(context.rootChip('gnō-',{w:'know'}),/関連未確定/);
});

function fallbackContext(element,fetch){
 const context={document:{getElementById:()=>element},location:{protocol:'https:'},PIE_V:'fixture',fetch,unpack};
 vm.runInNewContext(between(html,'let embeddedPromise;','function multilingualCell'),context);
 return context;
}

test('external fallback snapshot is untouched on successful HTTP sidecar requests',async()=>{
 const calls=[],context=fallbackContext({textContent:'',dataset:{src:'fallback.txt'},type:'application/gzip-base64'},async url=>{
  calls.push(url);return {ok:true,json:async()=>({schema:1,entries:[]})};
 });
 assert.equal(calls.length,0);
 await context.loadSidecar('multilingual-answers.json','multilingual_answers');
 assert.deepEqual(calls,['data/generated-etymon/multilingual-answers.json?v=fixture']);
});

test('staged external gzip fallback loads once on demand and restores its original snapshot',async()=>{
 const payload={words:[{w:'steam'}],illustration_scenes:{schema:1,entries:[]}},calls=[];
 const context=fallbackContext({textContent:'',dataset:{src:'data/generated-etymon/explorer-fallback-fixture.txt'},type:'application/gzip-base64'},async url=>{
  calls.push(url);return {ok:true,text:async()=>pack(payload)};
 });
 const first=context.embeddedData(),second=context.embeddedData();
 assert.equal(first,second);assert.deepEqual(await first,payload);
 assert.deepEqual(calls,['data/generated-etymon/explorer-fallback-fixture.txt']);
});

test('inline local snapshot stays self-contained even when a staged URL is present',async()=>{
 const payload={words:[{w:'roach',etymology_id:'roach-fish'}]},context=fallbackContext({textContent:pack(payload),dataset:{src:'unused.txt'},type:'application/gzip-base64'},()=>{throw Error('inline fallback must not fetch')});
 assert.deepEqual(await context.embeddedData(),payload);
});

test('failed sidecar request uses staged fallback and preserves snapshot provenance',async()=>{
 const payload={illustration_scenes:{schema:1,entries:[]}},calls=[];
 const context=fallbackContext({textContent:'',dataset:{src:'fallback.txt'},type:'application/gzip-base64'},async url=>{
  calls.push(url);return url==='fallback.txt'?{ok:true,text:async()=>pack(payload)}:{ok:false};
 });
 const result=await context.loadSidecar('illustration-scenes.json','illustration_scenes');
 assert.equal(result.verification,'export_snapshot');assert.equal(result.schema,1);
 assert.deepEqual(calls,['data/generated-etymon/illustration-scenes.json?v=fixture','fallback.txt']);
});

test('optional scoring and band scripts wait until first native render and two animation frames',async()=>{
 const scripts=[],frames=[],idles=[],listeners=new Map(),dispatched=[],dataset={};
 const document={documentElement:{dataset},createElement:()=>({}),head:{append(el){scripts.push({src:el.src,panelsReady:dataset.explorerPanelsReady});queueMicrotask(()=>el.onload());}}};
 const window={document,location:{pathname:'/vocabulary-master.html'},addEventListener:(type,fn)=>listeners.set(type,fn),dispatchEvent:e=>dispatched.push(e.type),requestAnimationFrame:fn=>frames.push(fn),requestIdleCallback:fn=>idles.push(fn)};
 vm.runInNewContext(scenes.slice(scenes.indexOf('// Explorer-only optional panels')),{window,document,Event,queueMicrotask,setTimeout,console});
 assert.equal(scripts.length,0);assert.equal(frames.length,0);
 listeners.get('etymon:ready')();assert.equal(scripts.length,0);
 frames.shift()();assert.equal(scripts.length,0);
 frames.shift()();assert.equal(scripts.length,0);
 idles.shift()();await tick();await tick();
 assert.equal(scripts.length,9);
 assert(scripts.filter(x=>/generated-etymon\/puzzle-(?:eligibility|visual-scores)/.test(x.src)).every(x=>x.panelsReady==='1'));
 assert.equal(dataset.explorerPanelsReady,'1');assert.equal(dataset.explorerVisualReady,'1');
 assert.deepEqual(dispatched,['etymon:review-ready','etymon:visual-ready']);
 listeners.get('etymon:ready')();while(frames.length)frames.shift()();while(idles.length)idles.shift()();await tick();
 assert.equal(scripts.length,9,'duplicate ready signals never reload scripts');
});

test('optional panels still mount when a background tab never paints',async()=>{
 const scripts=[],timers=[],listeners=new Map(),dataset={};
 const document={documentElement:{dataset},createElement:()=>({}),head:{append(el){scripts.push(el.src);queueMicrotask(()=>el.onload());}}};
 const window={document,location:{pathname:'/app/vocabulary-master.html'},addEventListener:(type,fn)=>listeners.set(type,fn),dispatchEvent(){},requestAnimationFrame(){},requestIdleCallback(){}};
 vm.runInNewContext(scenes.slice(scenes.indexOf('// Explorer-only optional panels')),{window,document,Event,queueMicrotask,setTimeout:(fn,ms)=>timers.push({fn,ms}),console});
 assert.equal(scripts.length,0);listeners.get('etymon:ready')();assert.equal(scripts.length,0);
 assert.equal(timers.length,1);assert.equal(timers[0].ms,1000);
 timers[0].fn();await tick();await tick();assert.equal(dataset.explorerPanelsReady,'1');assert.equal(scripts.length,9);
 timers[0].fn();await tick();assert.equal(scripts.length,9,'a late frame or timer must not reload panels');
});

test('lazy scene search deduplicates requests and never repaints obsolete query results',async()=>{
 let resolve,loads=0,renders=0;
 const pending=new Promise(r=>{resolve=r;});
 const words=[{w:'steam',p:[],ja:'蒸気',en:'vapor'}];
 const SEARCH_INDEX=search.createIndex(words,{sceneKey:w=>sceneAPI.key({...w,art:w.w})});
 const context={q:'first',WORDS:words,SEARCH_INDEX,document:{getElementById:()=>null},loadSidecar(){loads++;return pending;},window:{IllustrationScenes:sceneAPI},illustrationSceneIndex:new Map(),updateTableCount(){},renderTable(){renders++;}};
 vm.runInNewContext(between(html,'let illustrationSceneData;','const sceneObserver ='),context);
 assert.equal(loads,0);
 context.refreshSceneSearch('first');context.q='second';context.refreshSceneSearch('second');
 assert.equal(loads,1);
 resolve({entries:[{w:'steam',p:[],art:'steam',sense:{ja:'蒸気',en:'vapor'},scene:{en:'a steam cloud',ja:'蒸気の雲'},review:{status:'reviewed'}}]});await tick();
 assert.equal(SEARCH_INDEX.scenesReady,true);
 assert.equal(SEARCH_INDEX.search('a steam cloud')[0],words[0]);
 assert.equal(renders,1,'only the current query repaints after lazy captions are ready');
 context.q='';context.refreshSceneSearch('');await tick();assert.equal(renders,1);
});

test('late caption search repaint preserves an opened detail and the table scroll position',()=>{
 const {document}=parseHTML('<html><body><div id="tableWrap"><table><tbody><tr data-i="7"><td>steam</td></tr><tr class="detRow"><td><input value="still editing"><div data-scene-observed="1" data-scene-loading="1"></div></td></tr></tbody></table></div></body></html>');
 const wrap=document.getElementById('tableWrap'),detail=wrap.querySelector('tr.detRow');
 wrap.scrollTop=240;wrap.scrollLeft=360;let hydrated;
 const context={document,updateTableCount(){},renderTable(){wrap.innerHTML='<table><tbody><tr data-i="7"><td>steam with captions</td></tr><tr data-i="8"><td>new caption match</td></tr></tbody></table>';wrap.scrollTop=0;},hydrateIllustrationScenes(node){hydrated=node;}};
 vm.runInNewContext(between(html,'function repaintSceneSearch(){','let sceneSearchRequest='),context);
 context.repaintSceneSearch();
 assert.equal(wrap.querySelector('tr.detRow'),detail);
 assert.equal(detail.previousElementSibling.dataset.i,'7');assert.equal(hydrated,detail);
 assert.equal(detail.querySelector('input').value,'still editing');
 assert.equal(wrap.scrollTop,240);assert.equal(wrap.scrollLeft,360);
});

test('late scene-only matches update the real counter without rebuilding controls or closing details',async()=>{
 const names=['television','program','viewer','animation','delusion','unrestrained'];
 const words=names.map((w,i)=>({w,i,p:[],ja:'例',en:'sample',pos:i===5?'形':'名'}));
 const {document}=parseHTML('<html><body><div id="toolbar"><input id="draft" value="unfinished filter"><span id="tCount"><b>1</b> / 1語</span></div><div id="tableWrap"><table><tbody><tr data-i="0"><td>television</td></tr><tr class="detRow"><td><input id="note" value="still editing"></td></tr></tbody></table></div></body></html>');
 const wrap=document.getElementById('tableWrap'),counter=document.getElementById('tCount'),draft=document.getElementById('draft'),detail=wrap.querySelector('tr.detRow'),note=document.getElementById('note');
 let focused=draft;Object.defineProperty(document,'activeElement',{get:()=>focused});
 note.focus=()=>{focused=note;};note.selectionStart=2;note.selectionEnd=5;note.selectionDirection='forward';
 note.setSelectionRange=(start,end,direction)=>{note.selectionStart=start;note.selectionEnd=end;note.selectionDirection=direction;};
 let resolve;const pending=new Promise(r=>{resolve=r;});
 const F={originFamilies:[],originLanguages:[],pos:'',comp:false,noroot:false,rootType:'',pic:'',tag:'',review:false,reviewNotes:false,sortCol:'w',sortDir:-1,userSorted:true};
 const before=JSON.stringify(F),index=new Map();
 const SEARCH_INDEX=search.createIndex(words,{sceneKey:w=>sceneAPI.key({...w,art:w.w})});
 const context={document,F,q:'television',WORDS:words,SEARCH_INDEX,illustrationSceneIndex:index,loadSidecar:()=>pending,window:{IllustrationScenes:sceneAPI},
  baseWords:()=>SEARCH_INDEX.search(context.q),applyFilters:base=>base.filter(w=>!F.pos||w.pos===F.pos).slice().sort((a,b)=>F.sortDir*a.w.localeCompare(b.w)),
  renderTable(){wrap.innerHTML='<table><tbody>'+context.applyFilters(context.baseWords()).map(w=>'<tr data-i="'+w.i+'"><td>'+w.w+'</td></tr>').join('')+'</tbody></table>';},
  renderToolbar(){throw Error('late count update must not rebuild active controls');},hydrateIllustrationScenes(){}};
 vm.runInNewContext(between(html,'function tableCountHTML(','function renderToolbar(){')+between(html,'let illustrationSceneData;','const sceneObserver ='),context);
 context.refreshSceneSearch('television');
 resolve({entries:names.map(w=>({w,p:[],art:w,sense:{ja:'例',en:'sample'},scene:{en:'television scene',ja:'テレビの場面'},review:{status:'reviewed'}}))});await tick();
 assert.equal(wrap.querySelectorAll('tr[data-i]').length,6);assert.equal(counter.textContent,'6 / 6語');
 assert.equal(wrap.querySelector('tr.detRow'),detail);assert.equal(document.getElementById('draft'),draft);assert.equal(draft.value,'unfinished filter');
 assert.equal(draft.isConnected,true);assert.equal(document.activeElement,draft);assert.equal(JSON.stringify(F),before);
 F.pos='名';focused=note;context.repaintSceneSearch();
 assert.equal(wrap.querySelectorAll('tr[data-i]').length,5);assert.equal(counter.textContent,'5 / 6語 (絞り込み中)');
 assert.equal(wrap.querySelector('tr.detRow'),detail);assert.equal(document.activeElement,note);assert.equal(note.selectionStart,2);assert.equal(note.selectionEnd,5);
 assert.equal(F.sortCol,'w');assert.equal(F.sortDir,-1);assert.equal(F.pos,'名');
});

test('initial and filtered toolbars use the same count format as a late search repaint',()=>{
 const {document}=parseHTML('<html><body><div id="toolbar"></div></body></html>');
 const F={originFamilies:[],originLanguages:[],pos:'',comp:false,noroot:false,rootType:'',pic:'',tag:'',review:false,reviewNotes:false};
 const words=[{pos:'名'},{pos:'形'}];
 const context={document,F,$:s=>document.querySelector(s),baseWords:()=>words,applyFilters:base=>base.filter(w=>!F.pos||w.pos===F.pos),esc:String,tagPanelOpen:false,originPanelOpen:false,originDataError:'',componentDataError:'',reviewDataError:'',REVIEW_NOTES:null,window:{VocabularyComponentsUI:componentsUI}};
 vm.runInNewContext(between(html,'const POSES=','/* ===== テーブル ===== */'),context);
 context.renderToolbar();
 assert.equal(document.getElementById('tCount').textContent,'2 / 2語');assert.equal(document.getElementById('fReset'),null);
 F.pos='名';context.renderToolbar();
 assert.equal(document.getElementById('tCount').textContent,'1 / 2語 (絞り込み中)');assert(document.getElementById('fReset'));
});

test('compact list warnings verify only mismatches and reject changed images or senses',async(t)=>{
 const crypto=require('node:crypto'),api=require('../../app/shared/illustration-scenes.js');
 const bytes=Buffer.from('reviewed mismatch fixture'),hash=crypto.createHash('sha256').update(bytes).digest('hex');
 const {document}=parseHTML('<html><body><table><tbody><tr><td class="cPic"><img src="https://example.test/assets/word/normal.png"><span hidden data-scene-word="0"></span></td></tr><tr><td class="cPic"><img src="https://example.test/assets/word/repair.png"><span hidden data-scene-word="1"></span></td></tr><tr><td class="cPic"><span hidden data-scene-word="2"></span></td></tr></tbody></table></body></html>');
 const words=[{w:'normal',p:[],pica:'normal',ja:'通常',en:'normal'},
  {w:'repair',p:[],pica:'repair',etymology_id:'repair-one',ja:'例',en:'sample'},
  {w:'repair',p:[],pica:'repair',etymology_id:'repair-two',ja:'例',en:'sample'}];
 const entry={...words[1],art:'repair',status:'mismatch',sense:{ja:'例',en:'sample'},image:{sha256:hash}};
 const observed=[];let fetches=0;
 const oldFetch=global.fetch;global.fetch=async()=>{fetches++;return {ok:true,arrayBuffer:async()=>bytes};};t.after(()=>{global.fetch=oldFetch;});
 const context={document,WORDS:words,URL,location:{protocol:'https:',href:'https://example.test/app/vocabulary-master.html'},safeWordAssetName:w=>w,wordImageURL:w=>'https://example.test/assets/word/'+w.pica+'.png',
  IntersectionObserver:class{observe(row){observed.push(row);}unobserve(){}},
  window:{IllustrationScenes:api,ETYMON_ILLUSTRATION_REVIEW_STATUS:{schema:1,entries:[entry,{...entry,w:'normal',art:'normal',status:'reviewed'}]},addEventListener(){}}};
 vm.runInNewContext(between(html,'let illustrationReviewIndex;','const sceneSearchText='),context);
 const markers=[...document.querySelectorAll('[data-scene-word]')];
 markers.forEach(m=>context.hydrateIllustrationReview(m));
 assert.equal(observed.length,1);assert.equal(observed[0],markers[1].closest('tr'));
 await context.fillIllustrationReview(markers[0]);await context.fillIllustrationReview(markers[2]);assert.equal(fetches,0);
 await context.fillIllustrationReview(markers[1]);
 const image=markers[1].closest('tr').querySelector('img');
 assert.equal(fetches,1);assert.equal(image.classList.contains('illustration-needs-revision'),true);
 global.fetch=async()=>{fetches++;return {ok:true,arrayBuffer:async()=>Buffer.from('replacement image')};};
 await context.fillIllustrationReview(markers[1]);
 assert.equal(markers[1].dataset.reviewStatus,'stale_image');assert.equal(image.classList.contains('illustration-needs-revision'),false);
 context.WORDS[1]={...words[1],en:'different meaning'};
 await context.fillIllustrationReview(markers[1]);
 assert.equal(fetches,3);assert.equal(markers[1].dataset.reviewStatus,'stale_image');
 // An independent English paraphrase does not change the image's Japanese target.
 context.WORDS[1]={...words[1],ja:'別の語義'};
 await context.fillIllustrationReview(markers[1]);
 assert.equal(fetches,3);assert.equal(markers[1].dataset.reviewStatus,'stale_sense');
});

test('hidden list markers cannot request scene data or PNG verification',async()=>{
 let loads=0,verifications=0;
 const context={WORDS:[{w:'steam'}],loadIllustrationSceneData(){loads++;},window:{IllustrationScenes:{verify(){verifications++;}}}};
 vm.runInNewContext(between(html,'async function fillIllustrationScene','function hydrateIllustrationScenes'),context);
 await context.fillIllustrationScene({hidden:true,isConnected:true,dataset:{sceneWord:'0'}});
 await context.fillIllustrationScene({hidden:false,isConnected:true,dataset:{sceneWord:'0'},closest:()=>({hidden:true})});
 assert.equal(loads,0);assert.equal(verifications,0);
});

test('list and detail warnings match pinned Pages media URLs and ignore another displayed asset',async()=>{
 const api=require('../../app/shared/illustration-scenes.js');
 const location={protocol:'https:',href:'https://haibaratou.github.io/etymolingo/app/vocabulary-master.html'};
 const routed=url=>new URL(url,location.href).href.replace('https://haibaratou.github.io/etymolingo/','https://raw.githubusercontent.com/haibaratou/etymolingo/pinned-commit/');
 for(const kind of ['list','detail']){
  const expected=routed('../assets/word/repair.png?v=fixture'),other=routed('../assets/word/another.png?v=fixture');
  const {document}=parseHTML('<html><body><table><tbody><tr class="'+(kind==='detail'?'detRow':'')+'"><td class="cPic"><img id="target" src="'+expected+'"><img id="other" src="'+other+'"><'+(kind==='list'?'span hidden':'div')+' data-scene-word="0"></'+(kind==='list'?'span':'div')+'></td></tr></tbody></table></body></html>');
  const word={w:'repair',p:[],pica:'repair',ja:'例',en:'sample'},entry={...word,art:'repair',status:'mismatch'};
  const helper={key:api.key,find:()=>entry,verify:async()=>({status:'mismatch'}),render(){}};
  const context={document,WORDS:[word],URL,location,safeWordAssetName:w=>w,wordImageURL:()=> '../assets/word/repair.png?v=fixture',loadIllustrationSceneData:async()=>({entries:[entry]}),
   IntersectionObserver:class{observe(){}unobserve(){}},window:{IllustrationScenes:helper,ETYMON_ASSET_URL:routed,ETYMON_ILLUSTRATION_REVIEW_STATUS:{schema:1,entries:[entry]},addEventListener(){}}};
  vm.runInNewContext(kind==='list'?between(html,'let illustrationReviewIndex;','const sceneSearchText='):between(html,'async function fillIllustrationScene','function hydrateIllustrationScenes'),context);
  const marker=document.querySelector('[data-scene-word]'),target=document.getElementById('target'),unrelated=document.getElementById('other');
  const fill=kind==='list'?context.fillIllustrationReview:context.fillIllustrationScene;
  await fill(marker);
  assert.equal(target.classList.contains('illustration-needs-revision'),true,kind+' pinned raw URL warning');
  assert.equal(target.getAttribute('aria-label'),'イラスト要修正');
  assert.equal(unrelated.classList.contains('illustration-needs-revision'),false,kind+' unrelated image guard');
  let resolve;helper.verify=()=>new Promise(r=>{resolve=r;});
  const pending=fill(marker);await tick();
  target.classList.remove('illustration-needs-revision');target.removeAttribute('aria-label');target.src=other;
  resolve({status:'mismatch'});await pending;
  assert.equal(target.classList.contains('illustration-needs-revision'),false,kind+' replaced displayed asset guard');
 }
});

test('opening the local page does not decode the large offline dictionary merely for EO links',async()=>{
 let loads=0;
 const context={location:{protocol:'file:'},offlineDictionary(){loads++;return Promise.resolve({eo_slugs:['steam']});},DATA_DIR:'unused',PIE_V:'fixture'};
 vm.runInNewContext(between(html,'let EO_SLUG=new Set();','let EO_PICK='),context);
 assert.equal(loads,0);
 const a=context.prepareEOSlugs(),b=context.prepareEOSlugs();assert.equal(a,b);await a;
 assert.equal(loads,1);
});

test('late visual data repaints existing scores after the lightweight panel already mounted',async(t)=>{
 const {window}=parseHTML('<html><head><base href="https://example.test/app/vocabulary-master.html"></head><body><div id="tableWrap"><table><thead><tr><th class="cW">単語</th><th class="cK">カナ</th><th class="cR">レア度</th><th class="cLang">語派</th><th class="cPos">品詞</th></tr></thead><tbody><tr data-i="0"><td class="cW">steam<button class="spk" data-say="steam">🔊</button></td><td class="cK"></td><td class="cR">30</td><td class="cLang">G</td><td class="cPos">名</td><td class="cPic"><img src="https://example.test/assets/word/steam.png"></td></tr></tbody></table></div></body></html>');
 const listeners=new Map(),observers=[];
 const Observer=class extends window.MutationObserver{constructor(fn){super(fn);observers.push(this);}};
 t.after(()=>observers.forEach(o=>o.disconnect()));
 const DelayedResponse=class extends Response{async text(){const raw=await super.text();await new Promise(resolve=>setTimeout(resolve,180));return raw;}};
 const words=[{w:'steam',p:[],g:'G',pos:'名',ja:'蒸気',en:'vapor'}];
 const warnings=[],context={...canonicalFixture(words,[5]),document:window.document,WORDS:words,URL,queueMicrotask,MutationObserver:Observer,Blob,Response:DelayedResponse,DecompressionStream,atob,console:{warn(...a){warnings.push(a);}},addEventListener:(type,fn)=>listeners.set(type,fn)};
 vm.runInNewContext(overlay,context);assert.ok(await context.EtymonDifficultyV2.ready);await tick();await tick();
 assert.equal(window.document.querySelector('td.cLang .ety-family-tag').textContent,'ゲルマン');
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'読込中');
 assert.equal(warnings.length,0);
 listeners.get('etymon:visual-error')();await tick();
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'読込エラー');
 context.ETYMON_PUZZLE_ENVELOPE={schema:1,encoding:'gzip-base64',data:pack({schema:1,entries:[{id:'steam-picture',w:'steam',p:[],imagePath:'assets/word/steam.png',imageGitBlobSha:'same-picture'}]})};
 context.ETYMON_PUZZLE_VISUAL_SCORES={entries:[{id:'steam-picture',score:89,imageGitBlobSha:'same-picture'}]};
 const scoreCell=window.document.querySelector('td.guess-v2-col');
 const repainted=new Promise((resolve,reject)=>{
  const observer=new Observer(()=>{if(scoreCell.textContent==='89 / 100'){clearTimeout(timeout);observer.disconnect();resolve();}});
  const timeout=setTimeout(()=>{observer.disconnect();reject(new Error('Visual score did not recover: '+scoreCell.textContent+'; warnings='+warnings.length));},2000);
  observer.observe(scoreCell,{childList:true,subtree:true,characterData:true});
 });
 listeners.get('etymon:visual-ready')();
 await repainted;
 assert.equal(warnings.length,0,'valid late visual data must not trigger a load error');
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'89 / 100');
});

test('all registered lexical PIE kinds remain exact searchable',()=>{for(const kind of [undefined,'pie_registered','pie','pie_root','pie_reconstruction']){const root={key:'er-2',kind,origin_language:'PIE'};assert.deepEqual(search.matchingRoots([root],'*er-2'),[root]);assert.deepEqual(search.matchingRoots([root],'＊er-2'),[root]);}});
test('unverified, proposed, formative, aliases, attested and unknown are not newly promoted',()=>{for(const kind of ['unverified_reconstruction','proposed_reconstruction','pie_formative','legacy_alias','latin_lemma','attested_lexeme','unknown'])assert.equal(search.matchingRoots([{key:'er-2',kind}],'*er-2').length,0);});
test('metadata aliases, canonical entities, wrong language and unresolved roots stay excluded',()=>{for(const extra of [{component_id:'x'},{alias_of:'x'},{unresolved:true},{origin_language:'L'}])assert.equal(search.matchingRoots([{key:'er-2',kind:'pie_reconstruction',...extra}],'*er-2').length,0);});
test('root homograph numbers remain exact and marker is not a wildcard',()=>{const roots=[{key:'er-1'},{key:'er-2',kind:'pie_reconstruction'}];assert.deepEqual(search.matchingRoots(roots,'*er-2'),[roots[1]]);assert.deepEqual(search.matchingRoots(roots,'*er'),[]);assert.deepEqual(search.matchingRoots(roots,'er-2'),[]);});
test('registered PIE lookup includes the linked word without promoting its ancestry proof',()=>{
 const roots=[{key:'er-2',kind:'pie_reconstruction',origin_language:'PIE'}];
 const words=[{w:'earth',p:['er-2'],ja:'地球、土',confirmed_pie_lexical_count:0},{w:'other',p:[],ja:'他'}];
 const before=JSON.stringify({roots,words});const index=search.createIndex(words,{roots});
 assert.deepEqual(index.search('*er-2'),[words[0]]);
 assert.equal(words[0].confirmed_pie_lexical_count,0);
 assert.equal(JSON.stringify({roots,words}),before);
});

const halfStars=require('../../app/shared/explorer-difficulty-v2.js');
test('all ten levels display at most five real star shapes with odd half clips',()=>{
 for(let level=1;level<=10;level++){
  const html=halfStars.starHTML(level);
  assert.equal((html.match(/class="difficulty-v2-star(?: |")/g)||[]).length,Math.ceil(level/2));
  assert.equal((html.match(/clip-path:inset\(0 50% 0 0\)/g)||[]).length,level%2);
  assert.match(html,new RegExp('aria-label="'+(level/2)+' / 5 星"'));
  assert.equal((html.match(/★/g)||[]).length,Math.ceil(level/2));
 }
});
test('unclassified and zero stay distinct; invalid levels do not create misleading stars',()=>{
 assert.equal(halfStars.starHTML(null),'未分類');assert.match(halfStars.starHTML(0),/0 \/ 5 星/);assert(!halfStars.starHTML(0).includes('★'));
 for(const level of [undefined,-1,11,NaN,1.5,'10'])assert.equal(halfStars.starHTML(level),'');
});
test('display formatting leaves internal evaluation and ten-level constants intact',()=>{
 const idx=halfStars.makeIndex({entries:[{w:'easy',status:'rated',level:1},{w:'hard',status:'rated',level:30}]},{entries:[]});
 assert.equal(halfStars.evaluate({w:'easy'},idx).level,1);assert.equal(halfStars.evaluate({w:'hard'},idx).level,10);
 assert.equal(halfStars.evaluate({w:'unknown',r:0},idx).level,null);
 assert.equal(halfStars.WEBLIO_TO_10[30],10);
});
test('toolbar and detail inherit their original color and size while table stars keep gold styling',()=>{
 const source=require('node:fs').readFileSync(require.resolve('../../app/shared/explorer-difficulty-v2.js'),'utf8');
 assert(source.includes('.difficulty-v2-filter .difficulty-v2-stars,#difficultyV2Dialog .difficulty-v2-stars{font-size:inherit;color:inherit}'));
 assert(source.includes('.difficulty-v2-stars{display:inline-flex;gap:0;font-size:.8em;line-height:1;color:#95630b;white-space:nowrap}'));
});

test('real table, filter and tap dialog show five-star scale but retain ten-level behavior',async(t)=>{
 const {window}=parseHTML('<html><head></head><body><div id="toolbar"></div><div id="tableWrap"><table><thead><tr><th class="cW">単語</th><th class="cK">カナ</th><th class="cR">レア度</th></tr></thead><tbody>'+[0,1,2].map(i=>'<tr data-i="'+i+'"><td class="cW">word'+i+'</td><td class="cK"></td><td class="cR"></td></tr>').join('')+'</tbody></table></div></body></html>');
 const observers=[];const Observer=class extends window.MutationObserver{constructor(fn){super(fn);observers.push(this)}};t.after(()=>observers.forEach(o=>o.disconnect()));
 const words=[{w:'word0',r:1},{w:'word1',r:9999},{w:'word2',r:0}].map((word,i)=>({...word,p:[],pos:'名',ja:'例'+i,en:'fixture '+i}));
 const originalTable=window.document.getElementById('tableWrap').innerHTML;
 const context={...canonicalFixture(words,[1,10,null]),document:window.document,WORDS:words,URL,queueMicrotask,MutationObserver:Observer,console,addEventListener(){},applyFilters:list=>list,renderToolbar(){},renderTable(){
  // The native renderer replaces its table when async canonical data arrives.
  const visible=new Set(context.applyFilters(words).map(word=>words.indexOf(word)));
  window.document.getElementById('tableWrap').innerHTML=originalTable;
  for(const row of window.document.querySelectorAll('tbody tr[data-i]'))if(!visible.has(Number(row.dataset.i)))row.remove();
 }};
 vm.runInNewContext(overlay,context);assert.ok(await context.EtymonDifficultyV2.ready);await tick();await tick();
 const buttons=window.document.querySelectorAll('button[data-difficulty-v2]');
 assert.equal(buttons.length,3);assert.equal(buttons[0].dataset.level,'1');assert.equal(buttons[1].dataset.level,'10');
 assert.equal(buttons[0].querySelectorAll('.difficulty-v2-star').length,1);assert.equal(buttons[0].querySelectorAll('.difficulty-v2-half').length,1);
 assert.equal(buttons[1].querySelectorAll('.difficulty-v2-star').length,5);assert.equal(buttons[2].textContent,'未分類');
 const filter=window.document.querySelector('[data-difficulty-filter="10"]');assert.equal(filter.querySelectorAll('.difficulty-v2-star').length,5);
 filter.click();assert.deepEqual(Array.from(context.applyFilters(words)),[words[1]]);filter.click();assert.equal(context.applyFilters(words).length,3);
 await tick();await tick(); // Observe the native table replacement before tapping its new button.
 window.document.querySelector('button[data-difficulty-v2][data-word="word0"]').click();const dialog=window.document.getElementById('difficultyV2Dialog');assert(dialog.hasAttribute('open'));assert.equal(dialog.querySelectorAll('h2 .difficulty-v2-star').length,1);assert.equal(dialog.querySelectorAll('h2 .difficulty-v2-half').length,1);
 assert.match(dialog.textContent,/最大5つ星・0.5刻み/);assert.equal(context.EtymonDifficultyV2.levelFor(words[1]),10);
 // A changed local r cannot rerate a valid mother record, and stale identities
 // stay unclassified even though the old r-only formula would return level ten.
 assert.equal(context.EtymonDifficultyV2.levelFor({...words[0],r:9999}),1);
 for(const change of [{ja:'stale sense'},{pos:'動'},{p:['different-root']}])assert.equal(context.EtymonDifficultyV2.levelFor({...words[1],...change}),null);
 await assert.rejects(context.EtymonDifficultyV2.loadCanonical({}),/loader unavailable/);
 const stale=canonicalFixture(words,[1,10,null]),data=unpack(stale.ETYMON_CUSTOM_LEARNING_LEVELS.data);
 data.ruleVersion='cefr_plus_edited_aux_v0.1';const raw=Buffer.from(JSON.stringify(data));
 stale.ETYMON_CUSTOM_LEARNING_LEVELS={schema:1,encoding:'gzip-base64',sha256:sha(raw),data:zlib.gzipSync(raw).toString('base64')};
 await assert.rejects(context.EtymonDifficultyV2.loadCanonical(stale),/profile/);
});

test('root source disclosure keeps original text and confirmed EO link separate from editorial summaries',()=>{
 const context={URL,esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.runInNewContext(between(html,'function confirmedRootEtymOnlineURL','function rootNavigationCount'),context);
 const out=context.rootSourceSectionsHTML({d:'COMMENTARY',original_definition:'ORIGINAL',editorial_summary:'SUMMARY',etymonline_reference:{status:'confirmed',url:'https://www.etymonline.com/word/*er-',heading:'*er-',section:'2'}});
 const {document}=parseHTML('<div>'+out+'</div>');
 assert.equal(document.querySelector('summary').textContent,'語源解説(ハイパー英語語源辞書)');
 assert.equal(document.querySelector('details').hasAttribute('open'),false);
 assert.equal(document.querySelector('.rootOriginal').textContent,'ORIGINAL');
 assert.equal(document.querySelector('.rootTalk').textContent,'COMMENTARY');
 assert(!out.includes('SUMMARY'));assert(!out.includes('編集要点'));
 assert.equal(document.querySelector('.rootEoReference a').closest('details'),null);
 assert(out.indexOf('rootEoReference')>out.indexOf('</details>'));
});
test('missing root original never falls back to reviewed summary or an invented EO link',()=>{
 const context={URL,esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.runInNewContext(between(html,'function confirmedRootEtymOnlineURL','function rootNavigationCount'),context);
 for(const r of [{def:'SUMMARY',definition_reviewed:true},{original_definition:'',def:'SUMMARY',editorial_summary:'SUMMARY'}]){
  const out=context.rootSourceSectionsHTML(r);assert(!out.includes('SUMMARY'));assert(out.includes('原典解説は未収録'));assert(!out.includes('href='));
 }
 assert(context.rootSourceSectionsHTML({def:'LEGACY ORIGINAL'}).includes('LEGACY ORIGINAL'));
 const out=context.rootSourceSectionsHTML({original_definition:'<img src=x>',etymonline_reference:{status:'candidate',url:'https://www.etymonline.com/word/x'}});
 assert(out.includes('&lt;img src=x&gt;'));assert(!out.includes('href='));assert(!out.includes('対応未確認'));
});


test('starred PIE search uses exact keys and preserves homograph numbers and hyphens',()=>{
 const roots=[{key:'leu-'},{key:'leu-2'},{key:'leuk-'},{key:'autos',kind:'greek_lemma'}];
 const words=[{w:'loosen',p:['leu-'],r:2},{w:'dirt',p:['leu-2'],r:1},{w:'light',p:['leuk-']},
  {w:'misleading',p:[],ja:'*leu-',semanticTags:['*leu-']},{w:'auto',p:['autos']}];
 const index=search.createIndex(words,{roots});
 for(const q of ['*leu-','＊leu-',' * leu- '])assert.deepEqual(index.search(q),[words[0]]);
 assert.deepEqual(index.search('*leu-2'),[words[1]]);
 for(const q of ['*leu','*missing-','*','**leu-','*autos'])assert.deepEqual(index.search(q),[]);
 assert.deepEqual(search.matchingRoots(roots,'＊leu-'),[roots[0]]);
 assert.equal(search.rootQuery('loosen'),null);
});

test('starred search follows the same active root members as root navigation',()=>{
 const roots=[{key:'leu-'}],old={w:'obsolete',p:['leu-']},current={w:'confirmed',p:[]};
 const index=search.createIndex([old,current],{roots,rootMembers:key=>key==='leu-'?[current]:[]});
 assert.deepEqual(index.search('*leu-'),[current]);assert.deepEqual(index.search('＊leu-'),[current]);
});

test('word, exact PNG lookup, absent results and input clearing keep their existing behavior',()=>{
 const words=[{w:'light',p:['leuk-'],art:'light@shine'},{w:'light',p:['leu-'],art:'light@weight'},
  {w:'lighter',p:[],art:'lighter'}];
 const index=search.createIndex(words,{roots:[{key:'leu-'},{key:'leuk-'}],imageURLs:w=>['../assets/word/'+w.art+'.png'],baseURL:'https://example.test/app/vocabulary-master.html'});
 assert.deepEqual(index.search('light'),words);
 assert.deepEqual(index.search('light@weight.png'),[words[1]]);
 assert.deepEqual(index.search('https://example.test/assets/word/light@shine.png?v=current'),[words[0]]);
 assert.deepEqual(index.search('no-such-word'),[]);assert.deepEqual(index.search(''),words);assert.deepEqual(index.search('   '),words);
});

test('starred root results expose the matching item and open its unchanged identity',()=>{
 const {document}=parseHTML('<html><body><div id="contentHead"></div><input id="qSide"></body></html>');
 const roots=[{key:'leu-',ja:'解く'},{key:'leu-2',ja:'汚れ'}];
 const context={window:{VocabularySearch:search},document,$:s=>document.querySelector(s),mode:'words',q:'＊leu-',ROOTS:roots,WORDS:[],esc:String,rootLabel:r=>'*'+r.key,
  setNav(){},renderAll(){},pushState(){}};
 vm.runInNewContext(html.match(/^function renderHead\([^]*?^}/m)[0],context);context.renderHead();
 const button=document.querySelector('[data-search-root]');
 assert.equal(document.querySelectorAll('[data-search-root]').length,1);assert.equal(button.dataset.searchRoot,'leu-');
 button.onclick();assert.equal(context.mode,'root');assert.equal(context.cur,'leu-');assert.equal(document.getElementById('qSide').value,'＊leu-');
 context.mode='words';context.q='';context.renderHead();assert.equal(document.querySelector('[data-search-root]'),null);
});

test('root sidebar accepts both reconstruction markers without merging neighboring roots',()=>{
 const {document}=parseHTML('<html><body><aside id="side"></aside><input id="qSide"><select id="sortSide"><option value="abc" selected>abc</option></select><div id="sideList"></div></body></html>');
 const roots=[{key:'leu-',ja:'解く'},{key:'leu-2',ja:'汚れ'},{key:'leuk-',ja:'光'}].map((r,i)=>({...r,pie:r.key,en:'fixture',rank:i+1}));
 const context={window:{VocabularySearch:search},document,$:s=>document.querySelector(s),mode:'root',cur:'leu-',ROOTS:roots,esc:String,rootLabel:r=>'*'+r.key,rootConceptSrc:()=>'',rootNavigationTitle:()=>'',rootNavigationCount:()=>0};
 vm.runInNewContext(html.match(/^function renderSide\([^]*?^}/m)[0],context);
 for(const query of ['*leu-','＊leu-']){
  document.getElementById('qSide').value=query;context.renderSide();
  assert.deepEqual([...document.querySelectorAll('[data-k]')].map(el=>el.dataset.k),['leu-']);
 }
 document.getElementById('qSide').value='*leu-2';context.renderSide();assert.equal(document.querySelector('[data-k]').dataset.k,'leu-2');
 document.getElementById('qSide').value='*missing-';context.renderSide();assert.equal(document.querySelectorAll('[data-k]').length,0);
 document.getElementById('qSide').value='';context.renderSide();assert.equal(document.querySelectorAll('[data-k]').length,3);
});


test('English spelling assembly wins over historical captions for before and evidence',()=>{
 const code=between(html,'function wordParts(','function rootLabel(');
 for(const [word,roots,caption] of [['before',['ambhi','per1'],'be（〜の周りに）＋fore（前へ）'],['evidence',['eghs','weid-'],'e（外へ）＋vid（見る）＋ence（こと）']]){
  const w={w:word,p:roots},key=JSON.stringify([word,roots.join('+')]);
  const c={w,WORD_PARTS:{[key]:caption},esc:s=>s,COMPONENTS:{hasAssemblyAncestryDisplay:()=>true,boundAssemblyCaption:()=>{throw Error('historical text must not override spelling assembly')}}};
  vm.runInNewContext(code+';result=wordParts(w)',c);assert(c.result.includes(caption));
 }
});

test('network and bundled word-parts are the same digest-bound snapshot',()=>{
 const crypto=require('node:crypto');
 const raw=fs.readFileSync(path.join(root,'app/data/generated-etymon/word-parts.json'));
 const expected=html.match(/const WORD_PARTS_SHA256='([0-9a-f]{64})'/)[1];
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),expected);
 const bundle=unpack(html.match(/<script id="pieData" type="application\/gzip-base64">([^]*?)<\/script>/)[1]);
 assert.deepEqual(bundle.word_parts,JSON.parse(raw));
});

// Keep reader-note regressions in this existing workflow entry point.
{
// Reader display regressions. Synthetic prose and sources are software fixtures.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'app/vocabulary-master.html'),'utf8');
const api=require('../../app/shared/word-review-notes.js');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tick=()=>new Promise(r=>setImmediate(r));
const between=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const word=()=>({i:0,w:'fixture',p:['fixture-root'],ja:'試験語',en:'fixture',pos:'名',b:'既存の語源メモ。'});
const empty=()=>({schema:1,batches:[],word_notes:[],component_issues:[],pending_scopes:[]});
function binding(w,options={}){return api.bind([w],api.prepare(empty()),options);}
function audited(w){
 const guard=Object.fromEntries(['ja','en','pos','b'].map(k=>[k,w[k]??'']));
 const meta={...w,word_guard:guard,review_note:'既存の語源備考。その全文を保持。',lineages:[{review_note:'既存の系列備考。'}]};
 const payload={...empty(),batches:[{id:'internal-batch'}],word_notes:[{id:'internal-note',batch_id:'internal-batch',summary:'今回の反映: INTERNAL',confirmed_scope:['確認済みの範囲 INTERNAL'],unreviewed_scope:['未確認の範囲 INTERNAL'],source_review_text:'返却レビュー INTERNAL',machine_checks:[{check:'INTERNAL'}],issues:[{code:'fixture_issue',status:'held',reason:'INTERNAL issue',component_refs:[]}],target:{w:w.w,p:w.p,etymology_id:''},word_guard:guard}]};
 const b=api.bind([w],api.prepare(payload),{binding:{annotations:()=>meta}});
 return {b,meta,payload};
}
test('reader notes retain full authored and canonical prose but do not publish audit records',()=>{
 const w=word(),{b,payload}=audited(w),before=JSON.stringify(payload),state=b.get(w);
 const mark=api.html(b,w);assert.match(mark,/>備考（要確認）</);assert.equal(state.notes.length,1);assert.equal(b.needsReview(w),true);
 assert.doesNotMatch(mark,/既存の語源メモ|INTERNAL/,'closed details have no eager body');
 const body=api.bodyHTML(b,w,{status:'ready',hasSaved:true});
 assert.match(body,/既存の語源メモ。/);assert.match(body,/既存の語源備考。その全文を保持。/);assert.match(body,/既存の系列備考。/);
 assert.doesNotMatch(body,/INTERNAL|今回の反映|確認済みの範囲|未確認の範囲|作業単位|レビュー・備考原文/);
 assert.equal(JSON.stringify(payload),before);
});
test('notes do not depend on the existence of an audit record, including helper data failures',()=>{
 const w=word();assert.match(api.html(binding(w),w),/>備考</);assert.match(api.html(null,w),/>備考</);
 const blank={...w,b:''};assert.equal(api.html(binding(blank),blank),'');assert.equal(api.html(null,blank),'');
 const {b,meta}=audited(blank);meta.review_note='';meta.lineages=[];assert.equal(api.html(b,blank),'','an audit-only entry is not a reader note');
});
test('context-drifted canonical prose is withheld while current memo and review state survive',()=>{
 const w=word(),{b}=audited(w);w.b='現在のメモ。';
 const body=api.bodyHTML(b,w,{status:'ready',hasSaved:false});
 assert.match(body,/現在のメモ/);assert.doesNotMatch(body,/その全文を保持|系列備考|INTERNAL/);assert.match(body,/一致しない過去の備考/);assert.equal(b.needsReview(w),true);
});
test('same-spelling identities never inherit another sense memo or canonical note',()=>{
 const a=word(),b={...word(),i:1,p:['another'],etymology_id:'separate',b:'別語源のメモ。'},guard=Object.fromEntries(['ja','en','pos','b'].map(k=>[k,a[k]]));
 const notes=api.bind([a,b],api.prepare(empty()),{binding:{annotations:w=>w===a?{...a,word_guard:guard,review_note:'第一語源の備考',lineages:[]}:null}});
 assert.match(api.bodyHTML(notes,a),/第一語源/);assert.doesNotMatch(api.bodyHTML(notes,b),/第一語源/);assert.match(api.bodyHTML(notes,b),/別語源のメモ/);
});
test('unsafe source URLs and prose markup cannot create active content',()=>{
 const w={...word(),b:'<img src=x onerror=bad()> & "raw"'},b=binding(w);
 for(const u of ['javascript:alert(1)','data:text/html,bad','//bad.example','http://insecure.example','https://user:password@example.test/','https://example.test/\n" onclick="bad']){
  const {document}=parseHTML('<main>'+api.bodyHTML(b,w,{status:'ready',hasSaved:false,etymonlineURL:u})+'</main>');
  assert.equal(document.querySelectorAll('a,img,script').length,0,u);assert.ok(document.querySelector('main').textContent.includes(w.b));
 }
 const {document}=parseHTML('<main>'+api.bodyHTML(b,w,{status:'ready',hasSaved:false,etymonlineURL:'https://example.test/word/fixture?q="quoted"&next=1'})+'</main>');
 const a=document.querySelector('a');assert.ok(a);assert.equal(a.getAttribute('rel'),'noopener noreferrer');assert.equal(a.getAttribute('target'),'_blank');assert.equal(a.getAttribute('onclick'),null);
});
test('missing, unverified and failed sources show distinct status text without empty buttons',()=>{
 const w=word(),b=binding(w);
 const missing=api.bodyHTML(b,w,{status:'ready',hasSaved:false});assert.match(missing,/登録されていません/);
 const failed=api.bodyHTML(b,w,{status:'error',hasSaved:false});assert.match(failed,/読み込めませんでした/);assert.doesNotMatch(failed,/登録されていません/);
 const unverified=api.bodyHTML(b,w,{status:'unverified',hasSaved:false});assert.match(unverified,/対応するEtymonline原文は未確認/);
 for(const body of [missing,failed,unverified])assert.doesNotMatch(body,/<button|<a /);
});
function sourceContext({words=[word()],protocol='https:',det={},eo={},pick={},slugs=[],failure,offlineFailure=false}={}){
 let loads=0;const calls=[];
 const context={WORDS:words,location:{protocol},DATA_DIR:'data/generated-etymon/',PIE_V:'fixture',URL,console,Promise,
 window:{OfflineDictionary:{load(){loads++;return offlineFailure?Promise.reject(Error('offline fixture failure')):Promise.resolve({det,eo,eo_pick:pick,eo_slugs:slugs});}}},
 fetch:async url=>{calls.push(url);if(failure&&url.includes(failure))return {ok:false,status:503,json:async()=>({})};
 const suffix=url.split('generated-etymon/')[1].split('?')[0];
 const data=suffix==='eo_slugs.json'?slugs:suffix==='eo_pick.json'?pick:suffix.startsWith('det/')?det[suffix[4]]:suffix.startsWith('eo/')?eo[suffix[3]]:undefined;
 return {ok:true,json:async()=>data||{}};}};
 vm.runInNewContext(between("let offlineDictionaryPromise=null",'async function fillEO(')+between('const reviewSourceCache=new WeakMap();',"wrapEl.addEventListener('toggle',e=>{"),context);
 return {context,calls,loads:()=>loads};
}
test('HTTPS source checks use cached existing loaders only after explicit note opening',async()=>{
 const w=word(),f=sourceContext({det:{f:{0:['stored original','Not found','',w.w]}},eo:{f:{fixture:[{p:'(n.)',x:'stored EO'}]}},slugs:['fixture']});
 assert.equal(f.calls.length,0);const a=f.context.reviewSources(w),b=f.context.reviewSources(w);assert.equal(a,b);
 const sources=await a;assert.equal(sources.hasSaved,true);assert.equal(sources.etymonlineURL,'https://www.etymonline.com/word/fixture');assert.equal(f.calls.length,4);
 await f.context.reviewSources(w);assert.equal(f.calls.length,4);
});
test('file sources reuse exactly one OfflineDictionary promise and never fetch',async()=>{
 const w=word(),f=sourceContext({protocol:'file:',det:{f:{0:['stored original','Not found','',w.w]}},eo:{f:{fixture:[{p:'(n.)',x:'stored EO'}]}},slugs:['fixture']});
 assert.equal(f.loads(),0);const sources=await f.context.reviewSources(w);assert.equal(sources.hasSaved,true);assert.equal(f.loads(),1);assert.equal(f.calls.length,0);
 await f.context.reviewSources(w);assert.equal(f.loads(),1);
 const failed=sourceContext({protocol:'file:',offlineFailure:true});assert.equal((await failed.context.reviewSources(w)).status,'error');assert.equal(failed.calls.length,0);
});
test('read failures are not reported as absent originals and partial data remain usable',async()=>{
 const w=word(),missing=sourceContext();assert.equal((await missing.context.reviewSources(w)).status,'ready');assert.equal((await missing.context.reviewSources(w)).hasSaved,false);
 const failed=sourceContext({failure:'det/'});const f=await failed.context.reviewSources(w);assert.equal(f.status,'partial');assert.equal(f.hasSaved,false);
 const partial=sourceContext({failure:'det/',eo:{f:{fixture:[{x:'EO still present'}]}},slugs:['fixture']});assert.equal((await partial.context.reviewSources(w)).hasSaved,true);
 const picks=sourceContext({failure:'eo_pick',eo:{f:{fixture:[{p:'(n.)',x:'potential wrong sense'}]}},slugs:['fixture']});assert.equal((await picks.context.reviewSources(w)).hasSaved,false);
});
test('EO-only originals remain usable and sense selection never borrows another etymology',async()=>{
 const w=word(),f=sourceContext({eo:{f:{fixture:[{p:'(n.)',x:'noun original'},{p:'(v.)',x:'verb original'}]}},slugs:['fixture']});
 const a=await f.context.reviewSources(w);assert.equal(a.hasSaved,true);assert.equal(a.d,null);
 w.etymology_id='sense-two';w.eo_sections=[];const b=await f.context.reviewSources(w);assert.equal(b.hasSaved,false);assert.equal(b.status,'unverified');assert.equal(b.etymonlineURL,'');
 w.eo_sections=['(v.)'];const c=await f.context.reviewSources(w);assert.equal(c.hasSaved,true);
 w.eo_sections=['not-present'];const d=await f.context.reviewSources(w);assert.equal(d.hasSaved,false);assert.equal(d.status,'unverified');
 const mismatch=sourceContext({eo:{f:{fixture:[{p:'(n.)',x:'noun original'}]}},pick:{'fixture\tfixture-root':['(v.)']},slugs:['fixture']});assert.equal((await mismatch.context.reviewSources(word())).hasSaved,false);
});
test('validating source availability does not invent a link for an unregistered EO slug',async()=>{
 const w=word(),f=sourceContext({eo:{f:{fixture:[{x:'stored original'}]}},slugs:[]});
 const sources=await f.context.reviewSources(w);assert.equal(sources.hasSaved,true);assert.equal(sources.etymonlineURL,'');
});
function eventFixture({delayed=false}={}){
 const w=word(),b=binding(w),{window}=parseHTML('<html><body><div id="tableWrap"><table><tbody><tr data-i="0"><td class="cW">fixture'+api.html(b,w)+'</td></tr></tbody></table></div></body></html>');
 const wrapEl=window.document.getElementById('tableWrap');let resolve,loads=0,rendered=0,headwordOpens=0;
 const response=delayed?new Promise(r=>resolve=r):Promise.resolve({status:'ready',hasSaved:true,d:['stored']});
 const context={WORDS:[w],REVIEW_NOTES:b,window:{VocabularyReviewNotes:api},document:window.document,wrapEl,reviewSourceKey:w=>JSON.stringify(w),reviewSources:()=>{loads++;return response;},
 renderDetail(tr){rendered++;const row=window.document.createElement('tr');row.className='detRow';row.scrollIntoView=()=>{};tr.after(row);},toggleDetail(){headwordOpens++;},F:{}};
 vm.runInNewContext(between("wrapEl.addEventListener('toggle',e=>{", "wrapEl.addEventListener('input',e=>{"),context);
 const area=window.document.querySelector('.reviewNotes'),toggle=open=>{area.open=open;area.dispatchEvent(new window.Event('toggle',{bubbles:true}));};
 return {w,b,window,context,area,toggle,resolve,loads:()=>loads,rendered:()=>rendered,headwordOpens:()=>headwordOpens};
}
test('opening notes hydrates lazily, closing clears the body, reopening retains the notes',async()=>{
 const f=eventFixture();assert.equal(f.loads(),0);assert.equal(f.area.querySelector('.reviewNotesBody').innerHTML,'');
 f.toggle(true);await tick();assert.match(f.area.textContent,/既存の語源メモ/);assert.ok(f.area.querySelector('[data-review-source-word]'));
 f.toggle(false);assert.equal(f.area.querySelector('.reviewNotesBody').innerHTML,'');f.toggle(true);await tick();assert.ok(f.area.querySelector('[data-review-source-word]'));
});
test('closing, leaving, or changing a sense during source loading cannot repopulate obsolete notes',async()=>{
 for(const change of ['close','remove','change']){
  const f=eventFixture({delayed:true});f.toggle(true);
  if(change==='close')f.toggle(false);else if(change==='remove')f.area.remove();else f.w.eo_sections=['changed'];
  f.resolve({status:'ready',hasSaved:true,d:['original']});await tick();assert.equal(f.area.querySelector('[data-review-source-word]'),null,change);
 }
});
test('source button opens one existing detail only and does not bubble into headword toggle',async()=>{
 const f=eventFixture();f.toggle(true);await tick();const source=f.area.querySelector('[data-review-source-word]');
 for(let i=0;i<3;i++)source.dispatchEvent(new f.window.Event('click',{bubbles:true,cancelable:true}));
 await tick();assert.equal(f.rendered(),1);assert.equal(f.headwordOpens(),0);assert.equal(f.window.document.querySelectorAll('.detRow').length,1);
 f.area.querySelector('summary').dispatchEvent(new f.window.Event('click',{bubbles:true}));assert.equal(f.headwordOpens(),0);
 f.window.document.querySelector('.cW').dispatchEvent(new f.window.Event('click',{bubbles:true}));assert.equal(f.headwordOpens(),1);
});
test('source click interrupted by note close does not open an unwanted detail',async()=>{
 const f=eventFixture();f.toggle(true);await tick();f.area.querySelector('button').dispatchEvent(new f.window.Event('click',{bubbles:true,cancelable:true}));f.toggle(false);await tick();assert.equal(f.rendered(),0);
});
test('the existing detail renderer displays saved EO text even when det data are absent',async()=>{
 const w=word(),f=sourceContext({eo:{f:{fixture:[{h:'fixture',p:'(n.)',x:'SAVED EO ORIGINAL <i>whole</i>'}]}},slugs:['fixture']});
 const {window}=parseHTML('<html><body><table><tbody><tr data-i="0"><td>fixture</td></tr></tbody></table></body></html>');
 Object.assign(f.context,{document:window.document,window:{VocabularyReviewNotes:api,VocabularyComponentsUI:{details:()=>''}},REVIEW_NOTES:binding(w),COMPONENTS:null,esc,wordSenseImagesHTML:()=>'',semanticLine:()=>'',wordParts:()=>'',gameTagHTML:()=>'',hydrateIllustrationScenes:()=>{}});
 vm.runInNewContext(between('async function fillEO(', 'const ROOT_CONCEPT=')+between('function renderDetail(tr,w,d){','/* ダウンロードしたCSV'),f.context);
 f.context.renderDetail(window.document.querySelector('tr'),w,null);await tick();await tick();
 const detail=window.document.querySelector('.detRow');assert.match(detail.textContent,/SAVED EO ORIGINAL whole/);assert.match(detail.textContent,/ローカル保存/);assert.doesNotMatch(detail.textContent,/今回の反映|作業単位/);
});
test('empty and unmatched saved sense picks do not revive other EO articles in the existing reader',async()=>{
 for(const keep of [[],['(v.)']]){
  const w=word(),f=sourceContext({eo:{f:{fixture:[{h:'fixture',p:'(n.)',x:'OTHER SENSE MUST NOT BECOME MAIN'}]}},pick:{'fixture\tfixture-root':keep},slugs:['fixture']});
  const sources=await f.context.reviewSources(w);assert.equal(sources.hasSaved,false);assert.equal(sources.etymonlineURL,'');assert.equal(sources.status,'unverified');
  const {document}=parseHTML('<div class="eoLocal"><span></span></div>');f.context.esc=esc;vm.runInNewContext(between('async function fillEO(', 'const ROOT_CONCEPT='),f.context);
  await f.context.fillEO(w.w,document,w);assert.match(document.textContent||document.querySelector('span').textContent,/未確認/);assert.doesNotMatch(document.querySelector('span').innerHTML,/OTHER SENSE/);
 }
});
test('existing saved EO reader distinguishes load failure from absent articles',async()=>{
 for(const failure of ['eo/','eo_pick']){
  const w=word(),f=sourceContext({failure,eo:{f:{fixture:[{h:'fixture',p:'(n.)',x:'SENSE MUST REMAIN HIDDEN'}]}},slugs:['fixture']});
  const {document}=parseHTML('<div class="eoLocal"><span></span></div>');f.context.esc=esc;vm.runInNewContext(between('async function fillEO(', 'const ROOT_CONCEPT='),f.context);
  await f.context.fillEO(w.w,document,w);const text=document.querySelector('span').textContent;
  assert.match(text,/読み込めません|確認できません/);assert.doesNotMatch(text,/SENSE MUST|保存された項目なし/);
 }
});
test('original EO sense selection and labeled other-sense disclosures remain distinct',async()=>{
 const w=word(),f=sourceContext({eo:{f:{fixture:[{h:'fixture',p:'(n.)',x:'NOUN ORIGINAL'},{h:'fixture',p:'(v.)',x:'VERB ORIGINAL'}]}},pick:{'fixture\tfixture-root':['(v.)']},slugs:['fixture']});
 const {document}=parseHTML('<div class="eoLocal"><span></span></div>');f.context.esc=esc;vm.runInNewContext(between('async function fillEO(', 'const ROOT_CONCEPT='),f.context);
 await f.context.fillEO(w.w,document,w);const span=document.querySelector('span'),other=span.querySelector('.eoOther');
 assert.ok(other);assert.match(other.textContent,/NOUN ORIGINAL/);assert.match(other.textContent,/この語根とは別系統/);other.remove();assert.match(span.textContent,/VERB ORIGINAL/);assert.doesNotMatch(span.textContent,/NOUN ORIGINAL/);
});

}
