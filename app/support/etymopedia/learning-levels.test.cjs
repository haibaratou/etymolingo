const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'../../..'),api=require('./learning-levels.js'),custom=require('../../shared/custom-learning-levels.js'),rarity=require('../../shared/rarity-presentation.js');
const decode=file=>{const s={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'app/data/generated-etymon',file),'utf8'),s);const envelope=Object.values(s.window)[0];return JSON.parse(zlib.gunzipSync(Buffer.from(envelope.data,'base64')));};
const rows=decode('dictionary-basics.js').entries,levels=custom.create(decode('custom-learning-levels.js')),service=api.create(levels,rows);
test('browser decoder accepts the deployed canonical identity envelope',async()=>{
 const s={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'app/data/generated-etymon/dictionary-basics.js'),'utf8'),s);
 const decoded=await api.decodeBasics(s.window.ETYMON_DICTIONARY_BASICS_GZIP);
 assert.equal(decoded.length,rows.length);assert.deepEqual(decoded[0],rows[0]);
 await assert.rejects(api.decodeBasics({...s.window.ETYMON_DICTIONARY_BASICS_GZIP,sha256:'invalid'}),/checksum mismatch/);
});
test('matched canonical entries display their exact current level as stars',()=>{
 let checked=0;
 for(const row of rows){const entry=service.lookup({w:row.w,p:row.p,jp:row.ja,pos:row.pos});if(!entry)continue;const model=rarity.learning(entry.level,'detail');assert.equal(model.stars,entry.level);assert.equal(model.scale,10);checked++;}
 assert.ok(checked>30000);
});
test('legacy CSV identity differences stay unclassified',()=>{
 const row=rows.find(x=>levels.lookup(x));assert.ok(row);
 for(const change of [{jp:'別の意味'},{pos:'別の品詞'},{p:['not-the-root']},{w:'not-the-word'}])assert.equal(service.lookup({w:row.w,p:row.p,jp:row.ja,pos:row.pos,...change}),null);
 assert.equal(api.create(levels,[row,row]).lookup({w:row.w,p:row.p,jp:row.ja,pos:row.pos}),null);
});
test('current entry renders levels and groups without the old numeric rarity',()=>{
 const html=fs.readFileSync(path.join(root,'app/etymopedia.html'),'utf8');
 const runtime=html.replace(/const EMB_(?:IMG|CSV) = .*?;\r?\n/g,'');
 for(const forbidden of ['rarTier(', 'rarPill(', 'rarTitle(', 'w.rarity', '+r.r||0', '+r.rarity||0', 'UI.rar_legend'])assert.ok(!runtime.includes(forbidden),forbidden);
 assert.ok(/EtymonRarity\.html\(EtymonRarity\.learning\(level,/.test(runtime),'exact current-level model');
 assert.ok(/await EtymopediaLearning\.load\(\)/.test(runtime),'canonical level loader');
 assert.ok(/Array\.from\(\{length:10\}/.test(runtime),'all ten current levels');
 assert.ok(/\),null\]\.map/.test(runtime),'explicit unclassified group');
});
