'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),test=require('node:test');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const api=require('../../shared/etymological-components.js'),ui=require('../../shared/vocabulary-components-ui.js');
const html=read('app/vocabulary-master.html'),runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function loadData('))[2];
const payload={};vm.createContext(payload);vm.runInContext(read('app/data/generated-etymon/etymological-components.js'),payload);
const words=JSON.parse(read('app/data/generated-etymon/words.json')),roots=JSON.parse(read('app/data/generated-etymon/roots.json'));
const binding=api.bind(words,api.prepare(payload.ETYMON_ETYMOLOGICAL_COMPONENTS,roots));
test('complete runtime compiles and component scripts exist with current hash tokens',()=>{
 new vm.Script(runtime);
 for(const p of ['shared/etymological-components.js','shared/vocabulary-components-ui.js','data/generated-etymon/etymological-components.js']){
  assert.ok(html.includes(p+'?v='));assert.ok(fs.existsSync(path.join(root,'app',p)));
  assert.ok(html.includes(p+'?v='+crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'app',p))).digest('hex').slice(0,12)));
 }
});
test('runtime binds source-supported nodes and browse links without changing legacy data',()=>{
 const W=structuredClone(words),R=structuredClone(roots),protectedWords=JSON.stringify(W),protectedRoots=JSON.stringify(R);
 const c={WORDS:W,ROOTS:R,LEGACY_ROOT_COUNT:0,COMPONENTS:null,componentDataError:'',byRoot:null,window:{EtymonComponents:api,ETYMON_ETYMOLOGICAL_COMPONENTS:payload.ETYMON_ETYMOLOGICAL_COMPONENTS}};
 vm.createContext(c);vm.runInContext(runtime.slice(runtime.indexOf('  LEGACY_ROOT_COUNT=ROOTS.length;'),runtime.indexOf('  ROOTS.forEach((r,i)=>{r.rank=i+1;});')),c);
 assert.equal(JSON.stringify(W),protectedWords);assert.equal(JSON.stringify(R.slice(0,roots.length)),protectedRoots);
 assert.equal(c.LEGACY_ROOT_COUNT,1436);assert.ok(R.length>1436);assert.equal(c.COMPONENTS.summary.linked,payload.ETYMON_ETYMOLOGICAL_COMPONENTS.words.length);
 for(const node of R.slice(1436)){
  assert.ok(node.key.startsWith('component:'));assert.equal(node.all,c.COMPONENTS.byEntity(node.component_id).length);
  assert.ok(Number.isFinite(node.all));assert.ok(node.all>0);
  assert.equal(typeof node.en,'string');assert.equal(typeof node.ja,'string');
 }
});
test('PIE presence excludes formative-only and unresolved IDs, while preserving legacy PIE status',()=>{
 assert.equal(ui.hasPie({legacy_pie_ref_count:1}),true);
 assert.equal(ui.hasPie({confirmed_pie_lexical_count:1}),true);
 assert.equal(ui.hasPie({legacy_formative_ref_count:1}),false);
 assert.equal(ui.hasPie({state:'unavailable',unknown_legacy_ref_count:1}),false);
 const unknown=api.bind([{w:'fixture',p:['unknown'],ja:'',en:''}],api.prepare(payload.ETYMON_ETYMOLOGICAL_COMPONENTS,roots));
 const w=unknown.byEntity('unknown');assert.equal(w.length,0);
});
test('new multiple-component filter counts independent lineages, not borrowed transmission stages',()=>{
 const selected=name=>words.filter(w=>w.w===name&&ui.matches(binding.coverage(w),'multiple'));
 assert.equal(selected('tsunami').length,1);assert.equal(selected('tariff').length,0);
 assert.equal(selected('safari').length,0);
 const coffee=words.find(w=>w.w==='coffee');assert.ok(ui.matches(binding.coverage(coffee),'attested'));
 assert.ok(!ui.matches(binding.coverage(coffee),'none'));
});
test('display escapes data, preserves source identities, and does not equate badges with root classification',()=>{
 assert.match(ui.sourceBadge({src:'wiktionary'}),/>Wt</);assert.doesNotMatch(ui.sourceBadge({src:'wiktionary'}),/語根/);
 assert.match(ui.sourceBadge({src:'sense_add'}),/>追加</);assert.doesNotMatch(ui.sourceBadge({src:'sense_add'}),/>EO</);
 assert.match(ui.sourceBadge({src:'<img>'}),/&lt;img&gt;/);
 const coffee=words.find(w=>w.w==='coffee');assert.match(ui.badge(binding.coverage(coffee)),/資料支持/);
 assert.match(ui.chips(binding,coffee),/data-k="component:/);assert.doesNotMatch(ui.chips(binding,coffee),/>\*qahwa/);
 assert.match(ui.info(binding,{component_id:binding.rootRefs(coffee)[0].id}),/https:\/\//);
 assert.match(ui.details(binding,coffee),/全構成要素の確認は未完了/);
 const safari=words.find(w=>w.w==='safari');assert.match(ui.details(binding,safari),/確認した伝承・派生段階/);
});
test('filtering uses cached coverage and keeps missing data distinct from unregistered',()=>{
 assert.equal(ui.matches(null,'none'),false);assert.equal(ui.matches(null,'unavailable'),true);
 const start=binding.stats.graph_walks;
 for(let i=0;i<5;i++)for(const w of words)ui.matches(binding.coverage(w),'attested');
 assert.equal(binding.stats.graph_walks,start);
});
