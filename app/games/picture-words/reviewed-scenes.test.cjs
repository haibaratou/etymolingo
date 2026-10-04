const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const crypto=require('node:crypto').webcrypto;
const scenes=require('./reviewed-scenes.js');
const root=path.resolve(__dirname,'../../..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'catalog.js'),'utf8'),ctx);
const catalog=ctx.window.PICTURE_WORDS_CATALOG,meta=ctx.window.PICTURE_WORDS_CATALOG_META;
const word=catalog[0],copy=v=>JSON.parse(JSON.stringify(v));
const index=fs.readFileSync(path.join(root,'assets/word/illustration-index.js'));
const png=fs.readFileSync(path.join(root,word.reviewedScene.image.path));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-etymon/manifest.json')));
const location={href:'https://example.test/app/games/picture-words.html',protocol:'https:'};
function online({live=manifest,art=png,ix=index,fetcher}={}){
 const urls=[];
 const fetch=fetcher|| (async url=>{urls.push(url);return new Response(url.includes('manifest.json')?JSON.stringify(live):url.includes('illustration-index.js')?ix:art,{status:200});});
 return {runtime:new scenes.Runtime({meta,crypto,location,navigator:{onLine:true},fetcher:fetch,makeImageURL:()=> 'data:image/png;base64,verified'}),urls};
}
function snapshot(packWord=word,mutate){
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'app/games',packWord.sceneAsset),'utf8'),sandbox);
 if(mutate)mutate(sandbox.window.PICTURE_WORDS_SCENE_ASSETS[packWord.reviewedScene.image.sha256]);
 return new scenes.Runtime({meta,crypto,location:{href:'file:///repo/app/games/picture-words.html',protocol:'file:'},navigator:{onLine:false},assetRoot:sandbox.window,document:null,fetcher:()=>{throw Error('File mode must not fetch');},makeImageURL:()=> 'data:image/png;base64,verified'});
}
test('all current playable records have complete exact scene bindings',()=>{
 assert.ok(meta.count>0);assert.equal(catalog.length,meta.count);assert.equal(scenes.filterCatalog(catalog).length,meta.count);
 assert.equal(new Set(catalog.map(w=>w.id)).size,meta.count);assert.equal(new Set(catalog.map(w=>w.en)).size,meta.count);
});
test('missing, unreviewed, wrong-headword, mismatched-root, and long descriptions fail closed',()=>{
 for(const mutate of [w=>delete w.reviewedScene,w=>w.reviewedScene.status='unreviewed',w=>w.reviewedScene.scene.ja='',w=>w.reviewedScene.scene.en='Unrelated visual description.',w=>w.reviewedScene.p=['wrong'],w=>w.reviewedScene.scene.en=w.en+' '+('word '.repeat(18)),w=>w.reviewedScene.scene.en='This is '+w.en+'.',w=>w.sceneAsset='../elsewhere.js']){
  const w=copy(word);mutate(w);assert.equal(scenes.validRow(w),false);
 }
});
test('HTTP checks live words/scenes/index and actual original PNG bytes before play',async()=>{
 const x=online(),r=await x.runtime.prepare(word);assert.equal(r.status,'reviewed');assert.equal(r.entry.scene.en,word.reviewedScene.scene.en);assert.equal(r.mode,'current');assert.equal(x.urls.length,3);assert.ok(x.urls.every(u=>u.includes('strictScene=1')));assert.ok(Object.isFrozen(r.entry.scene));
});
test('stale source manifest, changed index, or changed PNG cannot become a puzzle',async()=>{
 const m=copy(manifest);m.files.words.sha256='0'.repeat(64);assert.equal((await online({live:m}).runtime.prepare(word)).reason,'stale-catalog');
 assert.equal((await online({ix:Buffer.from('changed')}).runtime.prepare(word)).reason,'stale-catalog');
 const wrong=Buffer.from(png);wrong[wrong.length-1]^=1;assert.equal((await online({art:wrong}).runtime.prepare(word)).reason,'stale-image');
});
test('a corrupted first-sense digest is rejected before an image can be shown',async()=>{
 const w=copy(word);w.reviewedScene.sense.sha256='0'.repeat(64);assert.equal((await online().runtime.prepare(w)).reason,'stale-sense');
});
test('online fetch failure does not silently switch to the offline snapshot',async()=>{
 const x=online({fetcher:async()=>{throw Error('network');}});assert.equal((await x.runtime.prepare(word)).status,'unavailable');
});
test('direct file mode needs no fetch and validates the lazy image bytes',async()=>{
 const r=await snapshot().prepare(word);assert.equal(r.status,'reviewed');assert.equal(r.mode,'reviewed-snapshot');assert.equal(r.entry.scene.ja,word.reviewedScene.scene.ja);
});
test('corrupt or missing local snapshots do not fall back to the original file or headword',async()=>{
 const corrupt=snapshot(word,p=>{const b=Buffer.from(p.base64,'base64');b[b.length-1]^=1;p.base64=b.toString('base64');});assert.equal((await corrupt.prepare(word)).reason,'stale-image');
 const empty=new scenes.Runtime({meta,crypto,location:{href:'file:///repo/app/games/picture-words.html',protocol:'file:'},navigator:{onLine:false},assetRoot:{},document:null});assert.equal((await empty.prepare(word)).status,'unavailable');
});
test('pack validation parses the complete payload without executing extra script',async()=>{
 const text=fs.readFileSync(path.join(root,'app/games',word.sceneAsset),'utf8');assert.equal(await scenes.verifyPackScript(word,text,crypto),true);
 await assert.rejects(()=>scenes.verifyPackScript(word,text+'window.evil=true;',crypto));
});
test('missing catalog metadata or hashing support fails closed',async()=>{
 const x=new scenes.Runtime({meta:null,crypto,location,navigator:{onLine:true}});assert.equal((await x.prepare(word)).reason,'missing-catalog-provenance');
 const y=snapshot();y.crypto={};assert.equal((await y.prepare(word)).reason,'hash-unavailable');
});

test('duplicate IDs and disallowed existing reading/image gates cannot enter the active pool',()=>{
 const twice=[copy(word),copy(word)];assert.equal(scenes.filterCatalog(twice).length,0);
 for(const mutate of [w=>w.reviewStatus='first_reading_unavailable',w=>w.updatedArt=false,w=>w.w='ち',w=>w.id='']){const bad=copy(word);mutate(bad);assert.equal(scenes.validRow(bad),false);}
});
test('file bootstrap loads the actual relative lazy script before verifying its PNG',async()=>{
 const assetRoot={},events=[],location={href:require('node:url').pathToFileURL(path.join(root,'app/games/picture-words.html')).href,protocol:'file:'};
 const document={createElement:()=>({remove(){events.push('removed');}}),head:{append(script){events.push(script.src);const file=require('node:url').fileURLToPath(script.src);vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:assetRoot});queueMicrotask(()=>script.onload());}}};
 const runtime=new scenes.Runtime({meta,crypto,location,navigator:{onLine:false},assetRoot,document,fetcher:()=>{throw Error('no file fetch');},makeImageURL:()=> 'data:image/png;base64,verified'});
 assert.equal((await runtime.prepare(word)).status,'reviewed');assert.equal(events.length,2);assert.ok(events[0].endsWith(word.reviewedScene.image.sha256+'.js'));
});
