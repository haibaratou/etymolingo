const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {validRow,Runtime}=require('./reviewed-scenes.js');
const ctx={window:{}};
for(const name of ['dictionary-links.js','catalog.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,name),'utf8'),ctx);
const rows=ctx.window.PICTURE_WORDS_DICTIONARY_LINKS,meta=ctx.window.PICTURE_WORDS_CATALOG_META;
test('every dictionary link keeps a valid reviewed scene and matching source provenance',()=>{
 assert.equal(new Set(rows.map(w=>w.id)).size,rows.length);
 for(const w of rows){assert(validRow(w),w.id);assert.equal(w.dictionarySources.words_sha256,meta.sourceWordsSha256);assert.equal(w.dictionarySources.scenes_sha256,meta.scenesSha256);assert.equal(w.dictionarySources.illustration_index_sha256,meta.indexSha256);assert(fs.existsSync(path.join(__dirname,'..',w.sceneAsset)),w.id);}
});
test('mother uses the canonical image, kana and identity',()=>{const w=rows.find(w=>w.id==='mother');assert.equal(w.en,'mother');assert.equal(w.w,'ははおや');assert.equal(w.reviewedScene.image.path,'assets/word/mother.png');});
test('homograph IDs are retained and unsupported kana is not fabricated',()=>{assert(rows.some(w=>w.id==='got@x'));assert(rows.some(w=>w.id==='got@ghend'));assert.equal(rows.find(w=>w.id==='got@x').w,'');});
test('a stale direct-link catalog cannot bypass the scene provenance check',async()=>{const runtime=new Runtime({meta:{...meta,scenesSha256:'0'.repeat(64)}});assert.equal((await runtime.prepare(rows[0])).reason,'stale-dictionary-link');});
test('direct links do not expand the default discovery catalog',()=>{assert(ctx.window.PICTURE_WORDS_CATALOG.every(w=>!w.dictionaryRequested));});
