// Isolated current image-state tests. No browser, real storage, image writes, or saves.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const api=require('../../shared/manager-site-image-store.js');
const root=path.resolve(__dirname,'../../..');
const appURL='file:///D:/Projects/etymolingo/app/wild-wordopia.html';
const A='a'.repeat(64),B='b'.repeat(64),C='c'.repeat(64);
const oldTime='2026-10-28T10:00:00Z',latestTime='2026-10-28T19:00:00Z';
const saveTime='2026-10-30T10:00:00Z',selectTime='2026-10-30T11:00:00Z';
const plain=v=>JSON.parse(JSON.stringify(v));
const entry=(id,imageSha256=B,extra={})=>({id,path:'../work/image/'+id+'.png',updatedAt:latestTime,imageSha256,...extra});
const latest={schema:1,selections:{weid:entry('current-weid'),per1:entry('current-per1')}};
const empty={schema:1,savedAt:'',selections:{}};
const shaURL=(url,hash)=>assert.equal(new URL(url).searchParams.get('v'),hash);
function deployedLatest(){
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'latest-site-images.js'),'utf8'),context,{filename:'latest-site-images.js'});
 return plain(context.window.WILDWORDOPIA_LATEST_CHARACTER_IMAGES);
}

function client(common,defaults){
 const events={},frames=[],messages=[],channels=[],changes=[];
 let storageWrites=0;
 const context={URL,Date,JSON,Object,Array,String,Error,
  WildSiteImageStore:api,WILDWORDOPIA_SITE_IMAGE_SELECTIONS:plain(common),
  WILDWORDOPIA_LATEST_CHARACTER_IMAGES:plain(defaults),location:{href:appURL},
  crypto:{randomUUID:()=> 'image-refresh-token-1234567890'},
  Event:class{constructor(type){this.type=type;}},
  addEventListener(type,fn){(events[type]??=[]).push(fn);},
  dispatchEvent(event){changes.push(event.type);for(const fn of events[event.type]||[])fn(event);},
  BroadcastChannel:class{constructor(name){this.name=name;channels.push(this);}},
  document:{createElement(tag){assert.equal(tag,'iframe');return {setAttribute(){},contentWindow:{postMessage(message){messages.push(message);}}};},body:{append(frame){frames.push(frame);}}},
  localStorage:{getItem(){throw Error('Site consumer must not inspect browser-specific storage');},setItem(){storageWrites++;throw Error('Storage write');},removeItem(){storageWrites++;throw Error('Storage deletion');},clear(){storageWrites++;throw Error('Storage reset');}}
 };
 context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(root,'app/shared/manager-site-images.js'),'utf8'),context,{filename:'manager-site-images.js'});
 return {context,channels,frames,changes,image(key){return context.WILDWORDOPIA_MANAGER_IMAGE({id:key,rootKey:key});},
  iframe(value){for(const fn of events.DOMContentLoaded||[])fn();const frame=frames.at(-1);frame.onload();for(const fn of events.message||[])fn({source:frame.contentWindow,data:{type:'wildwordopia-manager-images',token:messages.at(-1).token,selections:value}});},
  storageWrites:()=>storageWrites};
}

test('real current manifest wins over old Chrome v051 even with an artificially newer legacy clock',()=>{
 const defaults=deployedLatest(),current=defaults.selections.weid;
 assert(current,'current weid entry must exist');assert.match(current.imageSha256,/^[a-f0-9]{64}$/);
 const stale={weid:{id:'v051',src:'../assets/chara/brainrot/library/root-weid-v051.png',updatedAt:'2099-01-01T00:00:00Z'}};
 const before=JSON.stringify({defaults,stale});
 const chrome=api.resolve(empty,stale,appURL,defaults),other=api.resolve(empty,{},appURL,defaults);
 assert.equal(chrome.weid.id,current.id);assert.equal(chrome.weid.src,other.weid.src);
 assert.notEqual(new URL(chrome.weid.src).pathname,new URL(stale.weid.src,appURL).pathname);
 shaURL(chrome.weid.src,current.imageSha256);
 assert.equal(JSON.stringify({defaults,stale}),before);
});

test('real consumer keeps independent Chrome and empty-browser states on the same latest image',()=>{
 const defaults=deployedLatest(),chrome=client(empty,defaults),other=client(empty,defaults);
 const stale={weid:{id:'v051',src:'../assets/chara/brainrot/library/root-weid-v051.png',updatedAt:'2099-01-01T00:00:00Z'}};
 assert.equal(chrome.frames.length,0,'shared defaults must work before iframe storage arrives');
 assert.equal(chrome.image('weid'),other.image('weid'));
 chrome.iframe(stale);other.iframe({});
 assert.equal(chrome.image('weid'),other.image('weid'));
 shaURL(chrome.image('weid'),defaults.selections.weid.imageSha256);
 assert.equal(chrome.storageWrites(),0);assert.equal(other.storageWrites(),0);
});

test('explicit shared choice remains authoritative while old automatic shared choice follows current default',()=>{
 const pin={schema:1,savedAt:saveTime,selections:{weid:entry('deliberately-selected-old-weid',A,{updatedAt:oldTime,selectionMode:'explicit',selectedAt:oldTime})}};
 const stale={weid:entry('legacy-browser',C,{updatedAt:'2099-01-01T00:00:00Z'})};
 let result=api.resolve(pin,stale,appURL,latest);
 assert.equal(result.weid.id,'deliberately-selected-old-weid');shaURL(result.weid.src,A);
 const automatic={schema:1,savedAt:saveTime,selections:{weid:entry('old-automatic',A,{updatedAt:oldTime,selectionMode:'automatic'})}};
 result=api.resolve(automatic,stale,appURL,latest);
 assert.equal(result.weid.id,latest.selections.weid.id);shaURL(result.weid.src,B);
});

test('legacy shared files retain explicit selections without silently adopting a different character image',()=>{
 const legacyShared={schema:1,savedAt:saveTime,selections:{weid:entry('older-common-pin',A,{updatedAt:oldTime})}};
 const result=api.resolve(legacyShared,{},appURL,latest);
 assert.equal(result.weid.id,'older-common-pin');shaURL(result.weid.src,A);
});

test('only a newer explicitly selected local preview may override current shared/default state',()=>{
 const pin={schema:1,savedAt:saveTime,selections:{weid:entry('shared-pin',A,{selectionMode:'explicit'})}};
 const wanted=entry('new-local-preview',C,{selectionMode:'explicit',selectedAt:selectTime});
 const result=api.resolve(pin,{weid:wanted},appURL,latest);
 assert.equal(result.weid.id,wanted.id);shaURL(result.weid.src,C);
 for(const selectedAt of [undefined,'invalid',oldTime,saveTime]){
  const rejected=api.resolve(pin,{weid:{...wanted,selectedAt}},appURL,latest);
  assert.equal(rejected.weid.id,'shared-pin',String(selectedAt));
 }
 const automatic=api.resolve(pin,{weid:{...wanted,selectionMode:'automatic'}},appURL,latest);
 assert.equal(automatic.weid.id,'shared-pin');
});

test('legacy selection remains available when no current shared or formal record exists',()=>{
 const legacy={unknownroot:entry('previous-choice',A,{updatedAt:oldTime})};
 const before=JSON.stringify(legacy),result=api.resolve(empty,legacy,appURL,latest);
 assert.equal(result.unknownroot.id,'previous-choice');shaURL(result.unknownroot.src,A);
 assert.equal(JSON.stringify(legacy),before);
});

test('same image bytes keep one stable URL across repeated resolves and browser-specific timestamps',()=>{
 const first=api.resolve(empty,{},appURL,latest).weid.src;
 for(let n=0;n<5;n++){
  const other=plain(latest);other.selections.weid.updatedAt='203'+n+'-01-01T00:00:00Z';
  const next=api.resolve(empty,{},appURL,other).weid.src;
  assert.equal(next,first);shaURL(next,B);
 }
});

test('changing bytes at the same image path changes its revision URL without changing the selected image',()=>{
 const next=plain(latest);next.selections.weid.imageSha256=C;
 const a=api.resolve(empty,{},appURL,latest).weid,b=api.resolve(empty,{},appURL,next).weid;
 assert.equal(a.id,b.id);assert.equal(new URL(a.src).pathname,new URL(b.src).pathname);
 assert.notEqual(a.src,b.src);shaURL(a.src,B);shaURL(b.src,C);
});

test('saved pin to the same file receives current byte revision rather than preserving stale cached bytes',()=>{
 const common={schema:1,savedAt:saveTime,selections:{weid:{...entry('current-weid',A),selectionMode:'explicit'}}};
 const result=api.resolve(common,{},appURL,latest).weid;
 assert.equal(result.id,'current-weid');assert.equal(new URL(result.src).pathname,new URL(latest.selections.weid.path,appURL).pathname);
 shaURL(result.src,B);
});

test('normalization preserves stable source revision and ignores malformed revision metadata',()=>{
 const recognized=api.normalize({weid:{id:'v051',src:'../work/image/old.png?v='+A+'#picture',updatedAt:oldTime}},appURL).weid;
 shaURL(recognized.src,A);assert.equal(new URL(recognized.src).hash,'');
 const malformed=api.normalize({weid:entry('no-valid-hash','not-a-content-hash')},appURL).weid;
 assert.notEqual(new URL(malformed.src).searchParams.get('v'),'not-a-content-hash');
 assert.ok(!malformed.imageSha256||/^[a-f0-9]{64}$/.test(malformed.imageSha256));
});

test('export retains explicit intent and byte revision while remaining portable and leaving all inputs unchanged',()=>{
 const local={weid:entry('chosen-now',C,{selectionMode:'explicit',selectedAt:selectTime})};
 const before=JSON.stringify({latest,local});
 const bundle=api.bundle(empty,local,appURL,'2026-10-30T12:00:00Z');
 assert.equal(bundle.selections.weid.imageSha256,C);
 assert.equal(bundle.selections.weid.selectionMode,'explicit');
 assert.equal(bundle.selections.weid.selectedAt,selectTime);
 assert.ok(!JSON.stringify(bundle).includes('file:'));
 const normalized=api.normalize(bundle,appURL).weid;shaURL(normalized.src,C);
 assert.equal(JSON.stringify({latest,local}),before);
});

test('Windows file URL case differences still receive the current same-file revision',()=>{
 const pin={schema:1,savedAt:saveTime,selections:{weid:entry('current-weid',A,{path:'../WORK/IMAGE/CURRENT-WEID.PNG',selectionMode:'explicit'})}};
 const result=api.resolve(pin,{},appURL,latest).weid;
 assert.equal(result.id,'current-weid');shaURL(result.src,B);
 assert.equal(new URL(result.src).pathname.toLowerCase(),new URL(latest.selections.weid.path,appURL).pathname.toLowerCase());
});

test('a deliberately selected older candidate gets its current bytes from the complete image revision list',()=>{
 const defaults=plain(latest);defaults.images=[entry('older-chosen-weid',C)];
 const pin={schema:1,savedAt:saveTime,selections:{weid:entry('older-chosen-weid',A,{selectionMode:'explicit',updatedAt:oldTime})}};
 const before=JSON.stringify({defaults,pin}),result=api.resolve(pin,{},appURL,defaults).weid;
 assert.equal(result.id,'older-chosen-weid');shaURL(result.src,C);
 assert.equal(new URL(result.src).pathname,new URL(pin.selections.weid.path,appURL).pathname);
 assert.equal(JSON.stringify({defaults,pin}),before);
});

function managerUI({common=empty,published={},draft={}}={}){
 const draftKey='wildwordopia.manager-official.v1',publishedKey='wildwordopia.manager-published.v1';
 const storage=new Map([[draftKey,JSON.stringify(draft)],[publishedKey,JSON.stringify(published)],
  ['wildwordopia.root-candidate-review.v1','{"reviews":{"retained":{"comment":"keep this"}}}'],
  ['wildwordopia.deleted-images.v1','[]']]);
 const initial=new Map(storage),writes=[],saved=[],buttons=new Map(),events={};let removals=0;
 class Element{
  constructor(){this.children=[];this.attrs={};this.events={};this.dataset={};}
  set id(value){this._id=value;buttons.set(value,this);}get id(){return this._id||'';}
  append(...children){this.children.push(...children);}
  setAttribute(key,value){this.attrs[key]=String(value);}
  getAttribute(key){return this.attrs[key]??null;}
  addEventListener(type,handler){(this.events[type]??=[]).push(handler);}
  querySelector(selector){if(selector==='.official-like')return this.children.find(child=>child.className==='official-like')||null;if(selector==='.official-edition')return this.badge||null;if(selector==='.visual img')return this.image;return null;}
 }
 const header=new Element(),host=new Element(),cards=[];
 for(const rootId of ['weid','per1'])for(const [label,time]of [['old',oldTime],['current',latestTime]]){
  const card=new Element();card.dataset={root:rootId,imageId:label+'-'+rootId,updated:String(Date.parse(time))};
  card.image={src:new URL('../work/image/'+label+'-'+rootId+'.png',appURL).href};card.badge={textContent:''};cards.push(card);
 }
 host.querySelector=selector=>selector==='header'?header:null;
 host.querySelectorAll=selector=>{assert.equal(selector,'main > article[data-root]');return cards;};
 const actionTime='2026-10-30T12:34:56.000Z';
 class ActionDate extends Date{constructor(...args){super(...(args.length?args:[actionTime]));}static now(){return Date.parse(actionTime);}}
 const context={URL,Date:ActionDate,JSON,Object,Array,String,Error,Number,Set,Map,console,
  location:{href:'file:///D:/Projects/etymolingo/app/character-manager.html'},name:'',
  WildSiteImageStore:{...api,save:async bundle=>{saved.push(plain(bundle));return {status:'saved'};}},
  WILDWORDOPIA_SITE_IMAGE_SELECTIONS:plain(common),WILDWORDOPIA_LATEST_CHARACTER_IMAGES:plain(latest),
  localStorage:{getItem:key=>storage.get(key)??null,setItem(key,value){writes.push(key);storage.set(key,String(value));},removeItem(){removals++;throw Error('No state deletion allowed');},clear(){removals++;throw Error('No storage reset allowed');}},
  document:{getElementById:id=>id==='view-comparison'?host:buttons.get(id),createElement:()=>new Element(),head:new Element()},
  queueMicrotask:fn=>fn(),addEventListener(type,fn){(events[type]??=[]).push(fn);},
  BroadcastChannel:class{postMessage(){}close(){}}
 };
 context.window=context;context.parent=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'site-selection.js'),'utf8'),context,{filename:'site-selection.js'});
 for(const fn of events.DOMContentLoaded||[])fn();
 return {context,storage,initial,writes,saved,cards,actionTime,draftKey,publishedKey,
  button:id=>buttons.get(id),card:id=>cards.find(card=>card.dataset.imageId===id),
  async settle(){await new Promise(resolve=>setImmediate(resolve));},removals:()=>removals};
}

test('actual manager publish separates automatic candidate time from explicit action time and never clears stored reviews',async()=>{
 const ui=managerUI({draft:{per1:'old-per1'},published:{weid:entry('previous-browser',A)}});
 ui.button('publish-site-images').onclick();await ui.settle();
 assert.equal(ui.saved.length,1);
 const published=JSON.parse(ui.storage.get(ui.publishedKey));
 assert.equal(published.weid.id,'current-weid');assert.equal(published.weid.selectionMode,'automatic');
 assert.equal(published.weid.updatedAt,new Date(latestTime).toISOString());assert.equal(published.weid.selectedAt,undefined);
 assert.equal(published.per1.id,'old-per1');assert.equal(published.per1.selectionMode,'explicit');
 assert.equal(published.per1.updatedAt,new Date(oldTime).toISOString());assert.equal(published.per1.selectedAt,ui.actionTime);
 assert.equal(ui.saved[0].selections.weid.selectionMode,'automatic');assert.equal(ui.saved[0].selections.per1.selectedAt,ui.actionTime);
 assert.deepEqual(ui.writes,[ui.publishedKey]);assert.equal(ui.removals(),0);
 for(const [key,value]of ui.initial)if(key!==ui.publishedKey)assert.equal(ui.storage.get(key),value,key);
});

test('actual manager migrates exact prior published map while common pin and @latest retain their distinct meaning',async()=>{
 const common={schema:1,savedAt:saveTime,selections:{weid:entry('old-weid',A,{selectionMode:'explicit',updatedAt:oldTime})}};
 const existing={weid:entry('chrome-exact-not-current-ui',C,{updatedAt:oldTime})};
 const migration=managerUI({common,published:existing}),before=JSON.stringify([...migration.storage]);
 await migration.button('save-published-site-images').onclick();
 assert.equal(migration.saved[0].selections.weid.id,'chrome-exact-not-current-ui');
 assert.equal(migration.saved[0].selections.weid.selectionMode,'explicit');
 assert.equal(JSON.stringify([...migration.storage]),before);assert.equal(migration.writes.length,0);assert.equal(migration.removals(),0);
 const ui=managerUI({common,published:existing});
 assert.equal(ui.card('old-weid').querySelector('.official-like').getAttribute('aria-pressed'),'true');
 assert.equal(ui.card('current-weid').querySelector('.official-like').getAttribute('aria-pressed'),'false');
 ui.card('old-weid').querySelector('.official-like').onclick({preventDefault(){},stopPropagation(){}});
 assert.equal(JSON.parse(ui.storage.get(ui.draftKey)).weid,'@latest');
 assert.equal(ui.card('current-weid').querySelector('.official-like').getAttribute('aria-pressed'),'true');
 ui.button('publish-site-images').onclick();await ui.settle();
 const current=JSON.parse(ui.storage.get(ui.publishedKey));
 assert.equal(current.weid.id,'current-weid');assert.equal(current.weid.selectionMode,'automatic');assert.equal(current.weid.selectedAt,undefined);
 assert.equal(ui.removals(),0);
 for(const key of ['wildwordopia.root-candidate-review.v1','wildwordopia.deleted-images.v1'])assert.equal(ui.storage.get(key),ui.initial.get(key));
});
