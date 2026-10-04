'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=process.env.PICTURE_WORDS_TEST_ROOT||path.resolve(__dirname,'../../..');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const catalogText=fs.readFileSync(path.join(__dirname,'catalog.js'),'utf8'),scope={window:{}};
vm.runInNewContext(catalogText,scope);
const rows=JSON.parse(JSON.stringify(scope.window.PICTURE_WORDS_CATALOG));
const meta=JSON.parse(JSON.stringify(scope.window.PICTURE_WORDS_CATALOG_META));
const report=JSON.parse(fs.readFileSync(path.join(__dirname,'reviewed-catalog-report.json'),'utf8'));
const scenes=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-etymon/illustration-scenes.json'),'utf8')).entries;
const words=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-etymon/words.json'),'utf8'));
const identity=e=>JSON.stringify([e.w,e.p,e.art]);
test('catalog metadata binds exact current public words, scenes and index bytes',()=>{
 assert.equal(meta.schema,1);assert.equal(meta.count,rows.length);assert(rows.length>0);
 for(const [field,file] of [['sourceWordsSha256','app/data/generated-etymon/words.json'],['scenesSha256','app/data/generated-etymon/illustration-scenes.json'],['indexSha256','assets/word/illustration-index.js']])assert.equal(meta[field],sha(fs.readFileSync(path.join(root,file))));
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
});
test('every emitted row has the complete exact reviewed scene contract',()=>{
 for(const r of rows){
  const e=r.reviewedScene;assert.equal(e.schema,1);assert.equal(e.status,'reviewed');assert.equal(r.en,e.w);assert.equal(r.pic,e.art);assert.equal(e.sense.index,0);assert.deepEqual(e.p,r.sceneBinding.p);assert.equal(e.w,r.sceneBinding.w);assert(e.scene.en&&e.scene.ja);assert(r.updatedArt);assert(!r.reviewStatus);assert.match(r.w,/^[ぁ-ゔー]{2,14}$/);assert.deepEqual(Object.keys(e).sort(),['art','image','p','scene','schema','sense','status','w']);assert.equal(r.sceneAsset,`picture-words/scene-assets/${e.art}@${e.image.sha256}.js`);
  const matchingScenes=scenes.filter(s=>identity(s)===identity(e));assert.equal(matchingScenes.length,1);
  const source=matchingScenes[0];assert.equal(source.status,'reviewed');assert.equal(source.review.status,'reviewed');
  for(const [key,fields] of [['sense',['index','ja','en','sha256']],['scene',['en','ja']],['image',['path','sha256','git_blob_sha']]])assert.deepEqual(e[key],Object.fromEntries(fields.map(field=>[field,source[key][field]])));
  const matchingWords=words.filter(w=>w.w===e.w&&JSON.stringify(w.p||[])===JSON.stringify(e.p));assert.equal(matchingWords.length,1);
  assert.deepEqual(r.sceneBinding,Object.fromEntries(['w','p','ja','en'].map(key=>[key,matchingWords[0][key]??(key==='p'?[]:'')])));
 }
});
test('generated metadata and report account for the current input membership without release counts',()=>{
 assert.deepEqual(report.meta,meta);assert.equal(report.emittedRows,rows.length);assert.equal(report.verifiedPngs,rows.length);
 assert.equal(report.sceneEntries,scenes.length);assert.equal(report.excludedRowsCount,report.excludedRows.length);
 assert.equal(report.normalCatalogRows,rows.length+report.excludedRows.length);
 assert.equal(Object.values(report.exclusionCounts).reduce((a,b)=>a+b,0),report.excludedRows.length);
 const emittedIds=new Set(rows.map(r=>r.id));assert(report.excludedRows.every(r=>!emittedIds.has(r.id)));
 const emittedScenes=new Set(rows.map(r=>identity(r.reviewedScene)));
 assert.deepEqual(report.sceneExclusions.map(identity).sort(),scenes.filter(e=>!emittedScenes.has(identity(e))).map(identity).sort());
 assert.equal(report.lazyAssets,new Set(rows.map(r=>r.sceneAsset)).size);
});
test('each lazy script registers exactly the verified canonical PNG bytes',()=>{
 for(const r of rows){const e=r.reviewedScene,digest=e.image.sha256;const local=path.join(__dirname,'scene-assets',`${e.art}@${digest}.js`);const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(local,'utf8'),sandbox);const registered=sandbox.window.PICTURE_WORDS_SCENE_ASSETS;assert.deepEqual(Object.keys(registered),[digest]);assert.equal(registered[digest].mime,'image/png');const bytes=Buffer.from(registered[digest].base64,'base64');assert.equal(sha(bytes),digest);assert.deepEqual(bytes,fs.readFileSync(path.join(root,e.image.path)));const git=crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');assert.equal(git,e.image.git_blob_sha);}
});
test('the startup catalog has no bundled image payload or build timestamp',()=>{
 assert(!catalogText.includes('base64'));assert(!catalogText.includes('data:image/'));assert(!catalogText.includes('reviewed_at'));assert(!catalogText.includes('generatedAt'));
});
