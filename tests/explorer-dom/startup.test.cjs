const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'app/etymon-explorer.html'),'utf8');
const scenes=fs.readFileSync(path.join(root,'app/shared/illustration-scenes.js'),'utf8');
const overlay=fs.readFileSync(path.join(root,'app/shared/explorer-difficulty-v2.js'),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const between=(text,start,end)=>text.slice(text.indexOf(start),text.indexOf(end,text.indexOf(start)));
const unpack=b64=>JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')));
const pack=data=>zlib.gzipSync(JSON.stringify(data)).toString('base64');

test('root chips show uncertain relations without converting them into proven etymologies',()=>{
 const context={esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.runInNewContext(between(html,'const ROOT_BY=new Map();','/* この語根がどの道'),context);
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
 const window={document,location:{pathname:'/etymon-explorer.html'},addEventListener:(type,fn)=>listeners.set(type,fn),dispatchEvent:e=>dispatched.push(e.type),requestAnimationFrame:fn=>frames.push(fn),requestIdleCallback:fn=>idles.push(fn)};
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

test('lazy scene search deduplicates requests and never repaints obsolete query results',async()=>{
 let resolve,loads=0,renders=0;
 const pending=new Promise(r=>{resolve=r;});
 const context={q:'first',WORDS:[{}],document:{getElementById:()=>null},loadSidecar(){loads++;return pending;},window:{IllustrationScenes:{key:e=>e.w}},illustrationSceneIndex:new Map(),updateTableCount(){},renderTable(){renders++;}};
 vm.runInNewContext(between(html,'let illustrationSceneData;','const sceneObserver ='),context);
 assert.equal(loads,0);
 context.refreshSceneSearch('first');context.q='second';context.refreshSceneSearch('second');
 assert.equal(loads,1);
 resolve({entries:[{w:'steam',review:{status:'reviewed'}}]});await tick();
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
 const words=names.map((w,i)=>({w,i,pos:i===5?'形':'名'}));
 const {document}=parseHTML('<html><body><div id="toolbar"><input id="draft" value="unfinished filter"><span id="tCount"><b>1</b> / 1語</span></div><div id="tableWrap"><table><tbody><tr data-i="0"><td>television</td></tr><tr class="detRow"><td><input id="note" value="still editing"></td></tr></tbody></table></div></body></html>');
 const wrap=document.getElementById('tableWrap'),counter=document.getElementById('tCount'),draft=document.getElementById('draft'),detail=wrap.querySelector('tr.detRow'),note=document.getElementById('note');
 let focused=draft;Object.defineProperty(document,'activeElement',{get:()=>focused});
 note.focus=()=>{focused=note;};note.selectionStart=2;note.selectionEnd=5;note.selectionDirection='forward';
 note.setSelectionRange=(start,end,direction)=>{note.selectionStart=start;note.selectionEnd=end;note.selectionDirection=direction;};
 let resolve;const pending=new Promise(r=>{resolve=r;});
 const F={min:'',max:'',lang:'',pos:'',comp:false,noroot:false,pic:'',tag:'',review:false,sortCol:'w',sortDir:-1,userSorted:true};
 const before=JSON.stringify(F),index=new Map();
 const context={document,F,q:'television',WORDS:words,illustrationSceneIndex:index,loadSidecar:()=>pending,window:{IllustrationScenes:{key:e=>e.w}},
  baseWords:()=>index.size?words:[words[0]],applyFilters:base=>base.filter(w=>!F.pos||w.pos===F.pos).slice().sort((a,b)=>F.sortDir*a.w.localeCompare(b.w)),
  renderTable(){wrap.innerHTML='<table><tbody>'+context.applyFilters(context.baseWords()).map(w=>'<tr data-i="'+w.i+'"><td>'+w.w+'</td></tr>').join('')+'</tbody></table>';},
  renderToolbar(){throw Error('late count update must not rebuild active controls');},hydrateIllustrationScenes(){}};
 vm.runInNewContext(between(html,'function tableCountHTML(','function renderToolbar(){')+between(html,'let illustrationSceneData;','const sceneObserver ='),context);
 context.refreshSceneSearch('television');
 resolve({entries:names.map(w=>({w,review:{status:'reviewed'}}))});await tick();
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
 const F={min:'',max:'',lang:'',pos:'',comp:false,noroot:false,pic:'',tag:'',review:false};
 const words=[{pos:'名'},{pos:'形'}];
 const context={document,F,$:s=>document.querySelector(s),baseWords:()=>words,applyFilters:base=>base.filter(w=>!F.pos||w.pos===F.pos),esc:String,langList:()=>[['','全語派']],tagPanelOpen:false};
 vm.runInNewContext(between(html,'const RAR_PRESETS=','/* ===== テーブル ===== */'),context);
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
 const context={document,WORDS:words,URL,location:{protocol:'https:',href:'https://example.test/app/etymon-explorer.html'},safeWordAssetName:w=>w,wordImageURL:w=>'https://example.test/assets/word/'+w.pica+'.png',
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
 assert.equal(fetches,2);assert.equal(markers[1].dataset.reviewStatus,'stale_sense');
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
 const location={protocol:'https:',href:'https://haibaratou.github.io/etymolingo/app/etymon-explorer.html'};
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
 const {window}=parseHTML('<html><head><base href="https://example.test/app/etymon-explorer.html"></head><body><div id="tableWrap"><table><thead><tr><th class="cW">単語</th><th class="cK">カナ</th><th class="cR">レア度</th><th class="cLang">語派</th><th class="cPos">品詞</th></tr></thead><tbody><tr data-i="0"><td class="cW">steam<button class="spk" data-say="steam">🔊</button></td><td class="cK"></td><td class="cR">30</td><td class="cLang">G</td><td class="cPos">名</td><td class="cPic"><img src="https://example.test/assets/word/steam.png"></td></tr></tbody></table></div></body></html>');
 const listeners=new Map(),observers=[];
 const Observer=class extends window.MutationObserver{constructor(fn){super(fn);observers.push(this);}};
 t.after(()=>observers.forEach(o=>o.disconnect()));
 const warnings=[],context={document:window.document,WORDS:[{w:'steam',p:[],g:'G',pos:'名'}],URL,queueMicrotask,MutationObserver:Observer,Blob,Response,DecompressionStream,atob,console:{warn(...a){warnings.push(a);}},addEventListener:(type,fn)=>listeners.set(type,fn)};
 vm.runInNewContext(overlay,context);await tick();await tick();
 assert.equal(window.document.querySelector('td.cLang .ety-family-tag').textContent,'ゲルマン');
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'読込中');
 assert.equal(warnings.length,0);
 listeners.get('etymon:visual-error')();await tick();
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'読込エラー');
 context.ETYMON_PUZZLE_ENVELOPE={schema:1,encoding:'gzip-base64',data:pack({schema:1,entries:[{id:'steam-picture',w:'steam',p:[],imagePath:'assets/word/steam.png',imageGitBlobSha:'same-picture'}]})};
 context.ETYMON_PUZZLE_VISUAL_SCORES={entries:[{id:'steam-picture',score:89,imageGitBlobSha:'same-picture'}]};
 listeners.get('etymon:visual-ready')();
 for(let n=0;n<20&&window.document.querySelector('td.guess-v2-col').textContent!=='89 / 100';n++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(window.document.querySelector('td.guess-v2-col').textContent,'89 / 100');
});
