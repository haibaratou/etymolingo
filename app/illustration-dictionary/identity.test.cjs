const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/app.js','utf8');
const helper={key:e=>JSON.stringify([e.w,e.p||[],e.art])};
const a={w:'seen',p:[],art:'seen@x',image:{sha256:'a'},sense:{sha256:'s1'},scene:{en:'I have seen the bird.',ja:'鳥を見た。'}};
const b={...a,p:['root'],art:'seen',image:{sha256:'b'},sense:{sha256:'s2'},scene:{en:'I have seen the tree.',ja:'木を見た。'}};
const c={...a,w:'book',art:'book'};
const slice=(start,end)=>code.slice(code.indexOf(start),code.indexOf(end,code.indexOf(start)+start.length));
function context(extra={}){const scope={window:{IllustrationScenes:helper},entries:[a,b,c],lookup:new Map(),states:new Map(),pending:new Map(),...extra};vm.createContext(scope);vm.runInContext(slice('const entryKey=','const cardEntries='),scope);scope.lookup.set(helper.key(a),a);scope.lookup.set(helper.key(b),b);return scope;}
test('unique links resolve both homographs; old word link has deterministic fallback',()=>{
 const x=context();assert.equal(x.resolveFragment('#entry='+encodeURIComponent(helper.key(a))),a);assert.equal(x.resolveFragment('#entry='+encodeURIComponent(helper.key(b))),b);assert.equal(x.resolveFragment('#seen'),a);assert.equal(x.resolveFragment('#%ZZ'),null);
});
test('verification caches and pending promises do not cross root/art bindings',async()=>{
 let calls=0;const x=context({imageUrl:e=>e.art,window:{IllustrationScenes:{...helper,verify:async e=>{calls++;return{status:'reviewed',entry:e}}}}});vm.runInContext(slice('async function verify(','function sentenceHTML'),x);
 const [r1,r2]=await Promise.all([x.verify(a),x.verify(b)]);assert.equal(calls,2);assert.equal(r1.entry,a);assert.equal(r2.entry,b);await x.verify(a);assert.equal(calls,2);await x.verify(a,{fresh:true});assert.equal(calls,3);
});
test('same entry but replaced image cannot inherit a cached pass',async()=>{
 let calls=0;const x=context({imageUrl:e=>e.art,window:{IllustrationScenes:{...helper,verify:async e=>{calls++;return{status:'reviewed',entry:e}}}}});vm.runInContext(slice('async function verify(','function sentenceHTML'),x);await x.verify(a);await x.verify({...a,image:{sha256:'replacement'}});assert.equal(calls,2);
});
test('next/previous navigation uses full identity',()=>{
 let opened;const x=context({current:b,filtered:[a,b,c],openDetail:e=>{opened=e}});vm.runInContext(slice('function advance(','function toast'),x);x.advance(1);assert.equal(opened,c);x.advance(-1);assert.equal(opened,a);
});
test('render verifies only entering-viewport cards and detail always rechecks',()=>{
 const render=slice('function render(){','function updateCardScene');assert(render.includes('cardObserver.observe(card)'));assert(!render.includes('verify(e).then'));assert(render.includes('cardObserver.disconnect()'));assert(render.includes('card.dataset.entryKey=entryKey(e)'));
 assert(code.includes('const result=await verify(e,{fresh:true})'));assert(code.includes('request!==detailRequest||!current||entryKey(current)!==entryKey(e)'));assert(code.includes('function closeDetail(){detailRequest++;'));
});
test('curated scene aliases/categories stay bound to original exact image',()=>{
 const x=context();vm.runInContext(slice('const sampleBindings=','const words='),x);assert.equal(x.sampleContext(a),false);assert.equal(x.sampleContext(b),false);
 const original=JSON.parse(fs.readFileSync(__dirname+'/../data/generated-etymon/illustration-scenes.json')).entries.find(e=>e.w==='seen'&&e.art==='seen@x');assert.equal(x.sampleContext(original),true);assert.equal(x.sampleContext({...original,image:{sha256:'changed'}}),false);
});
test('contractions are highlighted without breaking HTML escaping',()=>{
 const escapeHTML=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll("'",'&#39;');const x=context({escapeHTML});vm.runInContext(slice('function sentenceHTML(','async function openDetail'),x);
 const html=x.sentenceHTML({w:"ain't",scene:{en:"It ain't <raining>."}});assert(html.includes('<mark>ain&#39;t</mark>'));assert(html.includes('&lt;raining&gt;'));
});
test('old headword-only identity operations are absent',()=>{
 for(const fragment of ['states.get(e.w)','states.has(e.w)','pending.get(e.w)','lookup.set(e.w,e)','current.w!==e.w','findIndex(e=>e.w===current.w)'])assert(!code.includes(fragment),fragment);
});
