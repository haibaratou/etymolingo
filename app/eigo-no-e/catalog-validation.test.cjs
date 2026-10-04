const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const v=require('./catalog-validation.js');const clone=x=>JSON.parse(JSON.stringify(x));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'data.js'),'utf8'),ctx);const full=JSON.parse(JSON.stringify(ctx.window.EIGO_NO_E));
const row={id:'book',art:'book',w:'book',p:['test-root'],ja:'本',en:'volume',pos:'名',r:2,c:['things/paper'],sense:{index:0,ja:'本',en:'volume',sha256:'2'.repeat(64)},scene:{en:'An open book rests on a wooden stand.',ja:'開いた本が木の台に置かれている。'},image:{path:'assets/word/book.png',sha256:'1'.repeat(64),git_blob_sha:'3'.repeat(40)},thumb:{path:'eigo-no-e/thumbs/book.111111111111.webp',source_sha256:'1'.repeat(64),sha256:'4'.repeat(64)},status:'reviewed',review:{status:'reviewed'}};
function fixture(){const r=clone(row);return {data:{schema:3,words:[r],categories:clone(full.categories)},scenes:{schema:1,entries:[clone(r)]},words:[{w:r.w,p:r.p,ja:r.ja+'、予約する',en:r.en+' / reserve',pos:r.pos,r:r.r,ja_readings:[{gloss:r.ja,kana:'ほん'}]}],index:{}};}
const run=f=>v.buildCurrentCatalog(f.data,f.scenes,f.words,f.index);
test('current composite identity passes',()=>assert.equal(run(fixture()).words.length,1));
test('English description is mandatory, WordNet cannot fill it',()=>{const f=fixture();f.scenes.entries[0].scene.en='';f.data.words[0].d='a volume';assert.equal(run(f).words.length,0);});
test('reviewed editorial record with stale exported status is excluded',()=>{const f=fixture();f.scenes.entries[0].status='stale_image';assert.equal(run(f).words.length,0);});
test('unreviewed editorial status is excluded even if exported reviewed',()=>{const f=fixture();f.scenes.entries[0].review.status='unreviewed';assert.equal(run(f).words.length,0);});
test('changed canonical first JA is excluded',()=>{const f=fixture();f.words[0].ja='予約する、本';assert.equal(run(f).words.length,0);});
test('changed canonical first EN is excluded',()=>{const f=fixture();f.words[0].en='reserve / volume';assert.equal(run(f).words.length,0);});
test('wrong root cannot match the same headword',()=>{const f=fixture();f.words[0].p=['other'];assert.equal(run(f).words.length,0);});
test('changed image hash is excluded',()=>{const f=fixture();f.scenes.entries[0].image.sha256='0'.repeat(64);assert.equal(run(f).words.length,0);});
test('outdated thumbnail binding is excluded',()=>{const f=fixture();f.data.words[0].thumb.source_sha256='0'.repeat(64);assert.equal(run(f).words.length,0);});
test('changed exceptional filename mapping is excluded',()=>{const f=fixture();f.index[JSON.stringify([row.w,row.p.join('+')])]='book@other';assert.equal(run(f).words.length,0);});
test('unsafe asset path is excluded',()=>{const f=fixture();f.data.words[0].thumb.path='https://wrong.example/image.webp';assert.equal(run(f).words.length,0);});
test('no definition, synonym or etymology fallback survives',()=>{const f=fixture();Object.assign(f.data.words[0],{d:'def',syn:['syn'],h:['hyper'],rel:['rel'],b:'etymology'});const w=run(f).words[0];for(const k of ['d','syn','h','rel','b'])assert.equal(k in w,false);});
test('current reviewed text replaces cached text without changing art',()=>{const f=fixture();f.scenes.entries[0].scene.en='A book lies open on a stand.';assert.equal(run(f).words[0].scene.en,'A book lies open on a stand.');});
test('rootless and case sensitive identities remain distinct',()=>assert.notEqual(v.sceneKey({w:'I',p:['eg'],art:'i'}),v.sceneKey({w:'i',p:[],art:'i'})));
test('headword substring is not sufficient',()=>assert.equal(v.validDescription({w:'book',scene:{en:'A textbook lies open.',ja:'教科書が開く。'}}),false));
test('a short descriptive phrase is accepted',()=>assert.equal(v.validDescription({w:'book',scene:{en:'An open book.',ja:'開いた本。'}}),true));
test('headword-only filler is rejected',()=>assert.equal(v.validDescription({w:'book',scene:{en:'This is a book.',ja:'本。'}}),false));
test('empty categories removed and counts recomputed',()=>{const result=run(fixture());for(const c of result.categories)for(const s of c.subs)assert.equal(s.n,result.words.filter(w=>w.c.includes(`${c.id}/${s.id}`)).length);});
test('real generated catalog contains only English-scene rows',()=>{const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'build-manifest.json'),'utf8'));assert.equal(full.words.length,manifest.eligible);assert(full.words.length>0);for(const w of full.words){assert.equal(w.status,'reviewed');assert(v.validDescription(w));assert(w.c.length);assert.equal(w.thumb.source_sha256,w.image.sha256);for(const k of ['d','syn','h','rel','b'])assert.equal(k in w,false);}});

test('only file protocol selects snapshot mode',()=>{assert.equal(v.usesLocalSnapshot('file:'),true);for(const p of ['http:','https:','data:','about:'])assert.equal(v.usesLocalSnapshot(p),false);});
test('direct-file snapshot retains all generated reviewed rows',()=>{const result=v.buildSnapshotCatalog(full);assert.equal(result.words.length,full.words.length);assert.equal(result.words.find(w=>w.w==='book').k,'ほん');});
test('snapshot without build provenance is rejected',()=>{const d=clone(full);delete d.sources;assert.throws(()=>v.buildSnapshotCatalog(d));});
test('unreviewed rows cannot enter local snapshot fallback',()=>{const d=clone(full);d.words[0].status='stale_image';assert.equal(v.buildSnapshotCatalog(d).words.length,full.words.length-1);});
test('file and HTTPS bootstrap remain separate branches',()=>{const source=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');assert(source.includes("const localSnapshot=location.protocol==='file:'"));assert(source.includes('if(localSnapshot){'));assert(source.includes('D=window.EigoCatalogValidation.buildSnapshotCatalog(generated);'));assert(source.includes('const checked=localSnapshot ? Promise.resolve'));assert(source.includes("const full = w => `../${w.image.path}?v=${w.image.sha256.slice(0,12)}`"));});
async function bootstrap(protocol,failNetwork=false){
  const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
  const prefix=app.slice(0,app.indexOf('/* ───────── index'))+'window.__bootOutcome={count:D.words.length};})();';
  const view={innerHTML:''},retry={};let requests=0;
  const win={EIGO_NO_E:clone(full),EigoCatalogValidation:v,IllustrationScenes:{load:async()=>{requests++;if(failNetwork)throw Error('offline');return {schema:1,entries:clone(full.words)};}}};
  win.self=win;win.top=win;
  const sandbox={window:win,URL,location:{protocol,href:protocol==='file:'?'file:///D:/etymolingo/app/eigo-no-e.html':'https://example.test/app/eigo-no-e.html',reload(){}},document:{querySelector:s=>s==='#view'?view:retry},console:{error(){}},fetch:async url=>{requests++;if(failNetwork||protocol==='file:')throw Error('fetch is unavailable');return {ok:true,json:async()=>({files:{words:{sha256:full.sources.words_sha256}}}),text:async()=>'window.ART={};'};}};
  vm.createContext(sandbox);await vm.runInContext(prefix,sandbox);return {view: view.innerHTML,count:win.__bootOutcome?.count,requests};
}
test('actual file bootstrap performs zero fetches and loads285 reviewed rows',async()=>{const r=await bootstrap('file:');assert.equal(r.requests,0);assert.equal(r.count,full.words.length);});
test('actual HTTPS bootstrap still checks current data',async()=>{const r=await bootstrap('https:');assert(r.requests>=3);assert.equal(r.count,full.words.length);});
test('HTTPS failure does not silently use the local snapshot',async()=>{const r=await bootstrap('https:',true);assert(r.requests>=1);assert.equal(r.count,undefined);assert(r.view.includes('イラストを読み込めませんでした'));});
