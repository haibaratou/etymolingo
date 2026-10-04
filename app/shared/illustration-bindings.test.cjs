'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('app/etymon-explorer.html');
const words=JSON.parse(read('app/data/generated-etymon/words.json'));
const scenes=JSON.parse(read('app/data/generated-etymon/illustration-scenes.json')).entries.filter(e=>(e.status||e.review?.status)==='reviewed');
const indexText=read('assets/word/illustration-index.js'),ctx={};vm.runInNewContext(indexText,ctx);const index=ctx.ETYMON_WORD_ART;
// Exercise the actual Explorer resolver, including case/accent collision rules.
const start=html.indexOf('let CASE_CLASH='),end=html.indexOf('// 同綴り異義語',start);
const initStart=html.indexOf('{const seen=new Map();',html.indexOf('WORDS.forEach((w,i)=>{w.i=i;});'));
const initEnd=html.indexOf('  for(const w of WORDS)for(const c of w.p)',initStart);
assert(start>=0&&end>start&&initStart>=0&&initEnd>initStart,'Review this harness if the Explorer resolver is refactored');
const scope={WORDS:words};vm.runInNewContext(html.slice(start,end)+'\n'+html.slice(initStart,initEnd)+'\nthis.assetName=safeWordAssetName;',scope);
const byIdentity=new Map();for(const w of words){const k=JSON.stringify([w.w,w.p||[]]);const list=byIdentity.get(k)||[];list.push(w);byIdentity.set(k,list);}
const indexKey=e=>JSON.stringify([e.w,e.p.join('+')]);
test('every reviewed scene has an unambiguous canonical word/root identity',()=>{
 assert(scenes.length>0);for(const e of scenes)assert.equal(byIdentity.get(JSON.stringify([e.w,e.p]))?.length,1,indexKey(e));
});
test('Explorer resolves every reviewed scene to its exact artwork stem',()=>{
 for(const e of scenes){const w=byIdentity.get(JSON.stringify([e.w,e.p]))[0];const stem=index[indexKey(e)]||w.pica||scope.assetName(e.w);assert.equal(stem,e.art,indexKey(e)+' must not fall through to another homograph');}
});
test('all reviewed artwork paths exist and match the accepted PNG SHA256',()=>{
 for(const e of scenes){assert.equal(e.image.path,'assets/word/'+e.art+'.png');const bytes=fs.readFileSync(path.join(root,e.image.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),e.image.sha256,indexKey(e));}
});
test('the external artwork-index cache query is bound to the current index bytes',()=>{
 const expected=crypto.createHash('sha256').update(indexText).digest('hex').slice(0,12);const match=html.match(/illustration-index\.js\?v=([^"\s]+)/);assert(match);assert.equal(match[1],expected,'Bump the HTML index cache token after changing exact mappings');
});
