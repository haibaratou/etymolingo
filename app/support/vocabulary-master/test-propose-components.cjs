'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),test=require('node:test');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const api=require('../../shared/etymological-components.js'),ui=require('../../shared/vocabulary-components-ui.js');
const words=JSON.parse(read('app/data/generated-etymon/words.json')),roots=JSON.parse(read('app/data/generated-etymon/roots.json'));
const payload={ETYMON_ETYMOLOGICAL_COMPONENTS:require('../../shared/component-payload-node.cjs').readPayload(path.join(root,'app/data/generated-etymon'))};
const data=payload.ETYMON_ETYMOLOGICAL_COMPONENTS,binding=api.bind(words,api.prepare(data,roots));
const w=words[12569],parts=JSON.parse(read('app/data/generated-etymon/word-parts.json'));
const html=read('app/vocabulary-master.html'),runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function loadData('))[2];
const c={ROOT_BY:new Map([...roots,...binding.syntheticRoots()].map(r=>[r.key,r])),COMPONENTS:binding,
 window:{VocabularyComponentsUI:ui},WORD_PARTS:parts,mode:'words',
 esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 memoOf:()=>({}),wordImageHTML:()=>'',semanticLine:()=>'',langTags:()=>'',originLanguageTags:()=>'',affixChips:()=>'',gameTagCell:()=>''};
vm.createContext(c);
vm.runInContext(runtime.slice(runtime.indexOf('function wordParts('),runtime.indexOf('/* ===== 左ペイン ===== */')),c);
vm.runInContext(runtime.slice(runtime.indexOf('function rootChip('),runtime.indexOf('/* この語根がどの道')),c);
vm.runInContext(runtime.slice(runtime.indexOf('function rowHTML('),runtime.indexOf('function renderTable(')),c);
const row=()=>c.rowHTML(w),cell=()=>ui.rootCell(binding,w,key=>c.rootChip(key,w));

test('propose keeps its lexical sense, images, difficulty and supported legacy root IDs',()=>{
 const original=JSON.parse(read('work/etymology-two-tier-20261028/baseline/app/data/generated-etymon/words.json'))[12569];
 const protectedWord=Object.fromEntries(Object.entries(w).filter(([k])=>!['origin_families','origin_languages'].includes(k)));
 assert.deepEqual(protectedWord,original);assert.deepEqual(w.p,['per1','apo-']);
 const baselineManifest=JSON.parse(read('work/etymology-two-tier-20261028/baseline/app/data/generated-etymon/manifest.json'));
 assert.equal(crypto.createHash('sha256').update(read('app/data/generated-etymon/roots.json')).digest('hex'),baselineManifest.files.roots.sha256);
 assert.equal(parts[JSON.stringify(['propose','per1+apo-'])],'古フランス語 proposer：pro-（前へ）＋poser（置く）');
});
test('the missing direct poser component is a guarded attested form, not a new PIE root',()=>{
 assert.equal(w.w,'propose');const lineages=binding.wordLineages(w),coverage=binding.coverage(w);
 assert.equal(coverage.guard_valid,true);assert.equal(lineages.length,2);
 const poser=lineages.find(x=>x.id==='poser-base'),entity=binding.entity(poser.word_ref);
 assert.equal(entity.form,'poser');assert.equal(entity.language,'古フランス語');assert.equal(entity.kind,'attested_lexeme');
 assert.equal(poser.surface_form,'pose');assert.equal(coverage.confirmed_pie_lexical_count,0);
 assert.equal(coverage.components_complete,false);assert.equal(coverage.mixed_basis,false);
 for(const l of lineages)assert.ok(binding.syntheticRoots().some(x=>x.component_id===l.word_ref));
});
test('direct parts, Latin model, qualified old composition and word-form history remain separate',()=>{
 const output=cell();assert.match(output,/pose ← poser/);assert.match(output,/直接の構成形/);
 assert.match(output,/prōpōnere/);assert.match(output,/pōnere のさらに古い構成（仮説）/);
 assert.match(output,/sinere/);assert.match(output,/残す・そのままにする/);
 assert.match(output,/pausāre/);assert.match(output,/pauein/);
 assert.match(output,/data-analysis-kind="hypothesis"/);assert.match(output,/関連未確定/);
 assert.equal(ui.matches(binding.coverage(w),'uncertain'),true);
 assert.equal((output.match(/data-k="per1"/g)||[]).length,1);
 assert.equal((output.match(/data-k="apo-"/g)||[]).length,1);
});
test('native row has exactly one legacy-root list and the corrected historical caption',()=>{
 const output=row();assert.equal((output.match(/data-k="per1"/g)||[]).length,1);
 assert.equal((output.match(/data-k="apo-"/g)||[]).length,1);
 assert.match(output,/古フランス語 proposer：pro-（前へ）＋poser（置く）/);
 assert.doesNotMatch(output,/>pro（前へ）＋pose（置く）</);
 assert.equal((output.match(/class="cRoots"/g)||[]).length,1);
});
test('every caption component has its own explicit display reference and guarded language stage',()=>{
 const a=binding.annotations(w).assembly_alignment;
 const direct=binding.wordLineages(w).filter(x=>x.confirmed).map(x=>x.word_ref);
 assert.deepEqual(Array.from(a.segments,s=>s.entity_ref),direct);
 assert.equal(a.segments.length,2);
 const caption=a.caption_prefix+Array.from(a.segments,s=>{
  const e=binding.entity(s.entity_ref);assert.equal(s.language,e.language);
  assert.notEqual(e.kind,'pie_reconstruction');return e.form+'（'+e.meaning+'）';
 }).join('＋');
 assert.equal(caption,a.caption);
 assert.equal(caption,parts[JSON.stringify(['propose','per1+apo-'])]);
});
test('all ordinary root cells deduplicate exact root IDs and component refs without changing source arrays',()=>{
 const word={p:['per1','apo-','per1','apo-']},before=JSON.stringify(word);
 const fake={rootRefs:()=>[],coverage:()=>({state:'legacy_registered'}),annotations:()=>null};
 const output=ui.rootCell(fake,word,key=>`<i data-k="${key}"></i>`);
 assert.equal((output.match(/data-k="per1"/g)||[]).length,1);assert.equal((output.match(/data-k="apo-"/g)||[]).length,1);
 assert.equal(JSON.stringify(word),before);
 const ref=binding.rootRefs(w)[0],dup={rootRefs:()=>[ref,ref]};
 assert.equal((ui.chips(dup,w).match(/class="chip /g)||[]).length,1);
});
test('changed meanings cannot inherit propose layered history or an uncertain-reference annotation',()=>{
 for(const field of ['ja','en','pos','b']){
  const changed={...w,[field]:w[field]+' changed'},b=api.bind([changed],api.prepare(data,roots));
  assert.equal(b.annotations(changed),null);assert.equal(b.coverage(changed).guard_valid,false);
  assert.doesNotMatch(ui.rootCell(b,changed,()=>''),/pōnere のさらに古い構成/);
 }
});
