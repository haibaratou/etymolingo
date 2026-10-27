const test=require('node:test');
const assert=require('node:assert/strict');
const {resolveFamilyTags}=require('../app/shared/explorer-difficulty-v2.js');
const fs=require('node:fs');
const path=require('node:path');
test('family rendering rejects memo prose, source labels and arbitrary fallback text',()=>{
 assert.deepEqual(resolveFamilyTags({g:'Wt',gs:[],b:'古英語 steam は熱い蒸気'},'G L'),[]);
 assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'G L'),[]);
 assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'古英語 steam'),[]);
});
test('family rendering preserves canonical hybrid order and filters invalid codes',()=>{
 assert.deepEqual(resolveFamilyTags({g:'G',gs:['G','Wt','G']}),['G']);
 assert.deepEqual(resolveFamilyTags({g:'L',gs:['Gr','L']}),['Gr','L']);
 assert.deepEqual(resolveFamilyTags({g:'G',gs:['古英語']}),['G']);
});
test('family whitelist handles source language codes beyond the three main families',()=>{
 for(const code of ['Ce','Ir','J','Ch','Ko','Tu','Ar','He','Ma','Na','Am','Po','Dr','Ur','Ba','Af','Ot'])assert.deepEqual(resolveFamilyTags({g:code}),[code]);
 for(const code of ['__proto__','constructor','toString','EO','Wt','steam'])assert.deepEqual(resolveFamilyTags({g:code}),[]);
});

test('exported composition uses component meanings rather than the complete word story',()=>{
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 const entry=(w,p)=>parts[JSON.stringify([w,p])];
 assert.equal(entry('disorder','dwis-+ōrd-'),'dis（否定）＋order（秩序）');
 assert.equal(entry('discourse','dwis-+kers-2'),'dis（離れて）＋course（走る）');
 assert.equal(entry('unexpected','ne+eghs+spek-'),'un（ない）＋ex（外へ）＋pect（観察する）＋ed（〜した）');
});

test('shared root explanation connects the registered semantic branches',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const spek=roots.find(r=>r.key==='spek-');
 const dis=roots.find(r=>r.key==='dwis-');
 assert.match(spek.d,/観察する/);
 assert.match(spek.d,/pect だけに「待つ」という意味があるわけではない/);
 assert.match(dis.d,/取り除く/);
 assert.match(dis.d,/否定/);
});
