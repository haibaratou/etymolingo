/* Run with: node --test app/support/wildwords/word-details.test.cjs */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function runtime(){
 const loaded=[],ctx={console,Blob,Response,DecompressionStream,TextDecoder,Uint8Array,atob,crypto:require('node:crypto').webcrypto};
 ctx.window=ctx;ctx.globalThis=ctx;
 ctx.document={createElement:tag=>({tag}),head:{append(el){if(el.tag!=='script')return;loaded.push(el.src);try{vm.runInContext(read('app/'+el.src),ctx,{filename:el.src});el.onload();}catch(e){el.onerror(e);}}}};
 vm.createContext(ctx);vm.runInContext(read('app/shared/rarity-presentation.js'),ctx);
 vm.runInContext(read('app/shared/wild-wordopia-details.js'),ctx);
 return {ctx,loaded};
}
test('Wild active UI and regeneration template never load the removed AI explanation or old word rarity',()=>{
 for(const p of ['app/wild-wordopia.html','app/shared/wild-wordopia-details.js','tools/wild-wordopia-template.html']){
  const s=read(p);
  for(const forbidden of ['EnglishParaphrases','english-paraphrases','wildParaphrase','paraSec','paraSvc','EtymonRarity.numeric','row.r','w.r/200','a.r??Infinity','byR('])assert.ok(!s.includes(forbidden),p+': '+forbidden);
  assert.ok(s.includes('EtymonRarity.learning('),p);
 }
 const builder=read('tools/build_wild_wordopia.py');
 assert.match(builder,/wild-wordopia-template\.html/);
 assert.match(builder,/template\.read_text\(encoding='utf-8'\)/);
});
test('Exact current custom levels render once; normal meanings and source English remain',async()=>{
 const {ctx,loaded}=runtime(),details=await ctx.WildWordDetails.loadDictionary(),levels=await ctx.WildWordDetails.loadLearning();
 const matched=details.rows.filter(row=>levels.lookup(row));assert.ok(matched.length>10);
 const sample=[matched.find(row=>row.w==='puppy')||matched[0],...Array.from({length:10},(_,i)=>matched.find(row=>levels.lookup(row)?.level===i+1)).filter(Boolean)];
 for(const row of sample){
  const target={isConnected:true,innerHTML:'',dataset:{},querySelector(selector){assert.equal(selector,'.wordSpeak');return {};}};
  await ctx.WildWordDetails.render(target,row,details.roots);
  const level=levels.lookup(row).level;
  assert.match(target.innerHTML,new RegExp('data-rarity-stars="'+level+'"'));
  assert.equal((target.innerHTML.match(/data-rarity-stars=/g)||[]).length,1);
  assert.equal((target.innerHTML.match(/★/g)||[]).length,level);
  for(const text of [row.w,row.ja,row.en].filter(Boolean))assert.ok(target.innerHTML.includes(String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))));
  assert.ok(!target.innerHTML.includes('wordLearning'));
  assert.ok(!target.innerHTML.includes('レア度'));
 }
 assert.ok(loaded.includes('data/wild-wordopia-word-details.js'));
 assert.ok(loaded.includes('data/generated-etymon/custom-learning-levels.js'));
 assert.ok(!loaded.some(src=>/paraphrases|dictionary-basics/.test(src)));
});
test('Absent exact learning match is unclassified and does not substitute legacy r',async()=>{
 const {ctx}=runtime(),details=await ctx.WildWordDetails.loadDictionary();
 const row=details.rows.find(row=>row.w==='puppy')||details.rows[0];
 const service=await ctx.WildWordDetails.loadLearning();const bad={...row,pos:'unverified'};
 assert.equal(service.lookup(bad),null);
 const model=ctx.EtymonRarity.learning(undefined,'detail');
 assert.equal(model.stars,0);assert.equal(model.scale,10);
 assert.equal((ctx.EtymonRarity.html(model).match(/★/g)||[]).length,0);
});
