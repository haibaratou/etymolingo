const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const scenes=require('./illustration-scenes.js');
const sample=JSON.parse(fs.readFileSync(__dirname+'/../data/generated-etymon/illustration-scenes.json')).entries;
const e=sample.find(e=>e.w==='taken');
const word={w:e.w,p:e.p,ja:e.sense.ja,en:e.sense.en};
test('exact root, spelling and art selection',()=>{
 assert.equal(scenes.find({entries:sample},word,e.art),e);
 assert.equal(scenes.find({entries:sample},{...word,p:['wrong']},e.art),null);
 assert.equal(scenes.find({entries:sample},word,'taken'),null);
});
test('first sense must match both languages',()=>{
 assert(scenes.firstSenseMatches(e,word));
 assert(!scenes.firstSenseMatches(e,{...word,en:'changed'}));
 assert(!scenes.firstSenseMatches(e,{...word,ja:'別義'}));
});
test('unreviewed and mismatch fail closed without image requests',async()=>{
 for(const status of ['unreviewed','mismatch','stale_sense']) {
  const result=await scenes.verify({...e,status},{word,imageUrl:'ignored'});assert.equal(result.status,status);
 }
});
test('replaced image rejected, actual image verified',async()=>{
 const bytes=Buffer.from('known image'); const sha=crypto.createHash('sha256').update(bytes).digest('hex');
 const prev=global.fetch;global.fetch=async()=>({ok:true,arrayBuffer:async()=>bytes});
 try{
  assert.equal((await scenes.verify({...e,image:{...e.image,sha256:sha}},{word,imageUrl:'image.png'})).status,'reviewed');
  assert.equal((await scenes.verify(e,{word,imageUrl:'image.png'})).status,'stale_image');
 }finally{global.fetch=prev;}
});
test('source changed rejected before fetch',async()=>{
 assert.equal((await scenes.verify(e,{word:{...word,en:'changed'},imageUrl:'image.png'})).status,'stale_sense');
});
test('network unavailable remains explicit',async()=>{
 const prev=global.fetch;global.fetch=async()=>{throw Error('offline')};
 try{assert.equal((await scenes.verify(e,{word,imageUrl:'image.png'})).status,'unavailable');}finally{global.fetch=prev;}
});
test('every sample contains exact inflection; no excess length',()=>{
 for(const e of sample){assert(new RegExp('(?<![\\w])'+e.w+'(?![\\w])','i').test(e.scene.en),e.w);assert(e.scene.en.split(/\s+/).length<=18,e.w);}
});
