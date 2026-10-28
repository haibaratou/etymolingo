'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),api=require('../../shared/reviewed-word-glosses.js');
const old={w:'amygdala',p:[],etymology_id:'',ja:'感情に関わる脳の扁桃体',en:'almond-shaped brain structure involved in emotion',pos:'名',b:'existing etymology',r:810,pica:'amygdala',ja_readings:[{gloss:'感情に関わる脳の扁桃体',kana:'かんじょうにかかわるのうのへんとうたい',status:'candidate',source:'existing'}],ja_kana:'かんじょうにかかわるのうのへんとうたい'};
const hash=(w,ja)=>crypto.createHash('sha256').update(JSON.stringify([w.w,w.p,w.etymology_id,ja,w.en,w.pos,w.b])).digest('hex');
function fixture(){const w=structuredClone(old),e={w:w.w,p:[],etymology_id:'',before:{ja:w.ja,en:w.en,pos:w.pos,b:w.b},before_derived:{ja_readings:structuredClone(w.ja_readings),ja_kana:w.ja_kana},after:{ja:'扁桃体',ja_readings:[{gloss:'扁桃体',kana:'へんとうたい',status:'candidate',source:'manual:single-gloss-override:amygdala:2026-10-28'}],ja_kana:'へんとうたい'},before_sha256:hash(w,w.ja),after_sha256:hash(w,'扁桃体')};return {w,e,p:{schema:1,guard_algorithm:'word-gloss-context-v1',entries:[e]}};}
test('only three authorized translation-dependent fields change and applying twice is idempotent',()=>{
 const {w,p}=fixture(),other={...structuredClone(w),w:'another'},before=structuredClone([w,other]),r=api.bind([w,other],p);
 assert.equal(r.applied,1);assert.equal(w.ja,'扁桃体');assert.equal(w.ja_kana,'へんとうたい');
 for(const k of Object.keys(old))if(!['ja','ja_readings','ja_kana'].includes(k))assert.deepEqual(w[k],old[k],k);
 assert.deepEqual(other,before[1]);assert.equal(api.bind([w,other],p).already_applied,1);
});
test('changed sense/context, duplicate word and duplicate corrections never overwrite',()=>{
 for(const field of ['ja','en','pos','b']){
  const {w,p}=fixture();w[field]='changed';const before=structuredClone(w);assert.equal(api.bind([w],p).held,1);assert.deepEqual(w,before);
 }
 const {w,p}=fixture(),dup=structuredClone(w),before=structuredClone([w,dup]);assert.equal(api.bind([w,dup],p).held,1);assert.deepEqual([w,dup],before);
 p.entries.push(structuredClone(p.entries[0]));assert.equal(api.bind([w],p).held,1);
});
test('independent reading edits are protected; already-shortened rows can synchronize known stale readings',()=>{
 const {w,p}=fixture();w.ja_readings.push({gloss:'other',kana:'other'});const before=structuredClone(w);assert.equal(api.bind([w],p).held,1);assert.deepEqual(w,before);
 const a=fixture();a.w.ja='扁桃体';assert.equal(api.bind([a.w],a.p).applied,1);assert.equal(a.w.ja_readings[0].gloss,'扁桃体');
});
test('metadata property ordering does not cause a false mismatch and invalid replacement fields are rejected',()=>{
 const {w,p}=fixture();p.entries[0].before_derived={ja_kana:w.ja_kana,ja_readings:w.ja_readings.map(x=>({source:x.source,status:x.status,kana:x.kana,gloss:x.gloss}))};assert.equal(api.bind([w],p).applied,1);
 const bad=fixture();bad.e.after.r=1;assert.equal(api.bind([bad.w],bad.p).applied,0);assert.deepEqual(bad.w,old);
});
test('root order and origin IDs distinguish homographs; unavailable snapshots do not infer corrections',()=>{
 const {w,p}=fixture();w.p=['different'];assert.equal(api.bind([w],p).missing,1);assert.equal(w.ja,old.ja);
 assert.equal(api.bind([w],null).unavailable,true);assert.equal(w.ja,old.ja);
});
