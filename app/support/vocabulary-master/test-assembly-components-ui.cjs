'use strict';
// Invented words/entities below are software fixtures, not etymological claims.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../..');
const api=require(process.env.ETYMON_COMPONENT_HELPER||path.join(root,'app/shared/etymological-components.js'));
const ui=require(process.env.ETYMON_COMPONENT_UI||path.join(root,'app/shared/vocabulary-components-ui.js'));
const evidence=[{source:'https://example.test/assembly-runtime-fixture',note:'Software fixture only'}];
const entity=(id,form=id,meaning='登録義',language='確認段階',kind='attested_lexeme')=>({id,form,meaning,language,kind,status:'dictionary_attested',evidence});
const edge=(from,to,relation='borrowed_from',link_status='source_supported')=>({from,to,relation,link_status,evidence});
const lineage=(id,refs,edges=[],role='lexical')=>({id,refs,edges,role,word_ref:refs[0],deepest_confirmed_ref:refs[refs.length-1],link_status:'source_supported',evidence});
function fixture(){
 const word={w:'fixture',p:['legacy'],ja:'検証',en:'fixture',pos:'名',b:'software fixture'};
 const entities=[entity('surface','attested','登録義'),entity('old','oldest','古い義','古い確認段階')];
 const lineages=[lineage('base',['surface','old'],[edge('surface','old')])];
 const row={w:word.w,p:word.p.slice(),word_guard:{ja:word.ja,en:word.en,pos:word.pos,b:word.b},guard_valid:true,components_complete:false,status:'source_supported',lineages,
  assembly_alignment:{caption:'確認段階 display（表示義）',caption_template:'確認段階 {0}',segments:[{entity_ref:'surface',language:'確認段階',lineage_id:'base',surface_form:'display',surface_meaning:'表示義',correspondence:'source_supported_surface',evidence}],evidence}};
 const payload={schema:1,entities,aliases:[],edges:[],words:[row]};
 return {word,entities,lineages,row,payload,bind(){return api.bind([word],api.prepare(payload,[{key:'legacy',kind:'pie_registered'}]));}};
}
const legacy=key=>`<i data-k="${key}"></i>`;
const count=(text,marker)=>text.split(marker).length-1;
function unavailable(f,reason){
 const b=f.bind(),c=b.coverage(f.word),cell=ui.rootCell(b,f.word,legacy);
 assert.equal(c.state,'unavailable');assert.equal(c.guard_valid,false);
 assert.equal(b.annotations(f.word),null);assert.deepEqual(b.rootRefs(f.word),[]);
 assert.deepEqual(b.displayRefs(f.word),[]);assert.match(cell,/data-root-state="unavailable"/);
 assert.doesNotMatch(cell,/assemblyComponentRefs|verifiedComponent/);assert.equal(ui.matches(c,'none'),false);
 if(reason)assert.ok(c.stale_reasons.includes(reason),c.stale_reasons.join(', '));
}

test('surface correspondence displays the actual registered form, meaning and stage without dropping deeper material',()=>{
 const f=fixture(),b=f.bind(),out=ui.rootCell(b,f.word,legacy);
 assert.match(out,/display ← attested/);assert.match(out,/<i>登録義<\/i>/);assert.match(out,/<small>確認段階<\/small>/);
 assert.match(out,/組み立て表示：display（表示義）/);assert.match(out,/oldest/);assert.match(out,/古い義/);
 assert.equal(count(out,'data-k="legacy"'),1);assert.equal(count(out,'data-k="component:surface"'),1);
 assert.equal(count(out,'data-k="component:old"'),1);
 assert.equal(b.coverage(f.word).confirmed_attested_lexical_count,1);assert.equal(b.coverage(f.word).components_complete,false);
});
test('aligned transmission forms have browse nodes and entity filtering but remain one independent component',()=>{
 const f=fixture();f.entities.splice(1,0,entity('middle','middle','中間義','中間段階'));
 f.lineages[0].refs=['surface','middle','old'];f.lineages[0].edges=[edge('surface','middle'),edge('middle','old')];
 f.row.assembly_alignment={caption:'確認段階 attested（登録義）←中間段階 middle（中間義）',caption_template:'確認段階 {0}←中間段階 {1}',segments:[{entity_ref:'surface',language:'確認段階',lineage_id:'base'},{entity_ref:'middle',language:'中間段階',lineage_id:'base'}],evidence};
 const b=f.bind(),out=ui.rootCell(b,f.word,legacy);
 assert.equal(b.coverage(f.word).confirmed_attested_lexical_count,1);assert.equal(ui.matches(b.coverage(f.word),'multiple'),false);
 for(const id of ['surface','middle','old']){
  assert.ok(b.syntheticRoots().some(n=>n.component_id===id));assert.equal(b.byEntity(id)[0],f.word);
  assert.equal(b.matches(f.word,{entityIds:[id]}),true);assert.equal(count(out,`data-k="component:${id}"`),1);
 }
});
test('an aligned terminal is rendered once, with exact-ID deduplication and preserved source arrays',()=>{
 const f=fixture();f.row.assembly_alignment={caption:'古い確認段階 oldest（古い義）',caption_template:'古い確認段階 {0}',segments:[{entity_ref:'old',language:'古い確認段階',lineage_id:'base'}],evidence};
 const before=JSON.stringify(f.payload),b=f.bind(),out=ui.rootCell(b,f.word,legacy);
 assert.equal(count(out,'data-k="component:old"'),1);assert.equal(JSON.stringify(f.payload),before);
 assert.equal(b.rootRefs(f.word).length,1);assert.equal(b.displayRefs(f.word).length,1);
});
test('native row retains one root cell and the caption while rendering registered correspondence',()=>{
 const f=fixture(),b=f.bind(),html=fs.readFileSync(path.join(root,'app/vocabulary-master.html'),'utf8');
 const runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function loadData('))[2];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const c={COMPONENTS:b,ROOT_BY:new Map([{key:'legacy',pie:'legacy'},...b.syntheticRoots()].map(r=>[r.key,r])),WORD_PARTS:{[JSON.stringify([f.word.w,f.word.p.join('+')])]:f.row.assembly_alignment.caption},window:{VocabularyComponentsUI:ui},mode:'words',esc,memoOf:()=>({}),wordImageHTML:()=>'',semanticLine:()=>'',langTags:()=>'',originLanguageTags:()=>'',affixChips:()=>'',gameTagCell:()=>''};
 vm.createContext(c);
 for(const [from,to] of [['function wordParts(','/* ===== 左ペイン ===== */'],['function rootChip(','/* この語根がどの道を通って英語に入ったかの内訳。'],['function rowHTML(','function renderTable(']])vm.runInContext(runtime.slice(runtime.indexOf(from),runtime.indexOf(to,runtime.indexOf(from))),c);
 const out=c.rowHTML(f.word);assert.equal(count(out,'class="cRoots"'),1);assert.equal(count(out,'data-k="legacy"'),1);
 assert.match(out,/display ← attested/);assert.match(out,/確認段階 display（表示義）/);
});
test('missing registered assembly entity makes the whole claim unavailable instead of silently dropping a chip',()=>{
 const f=fixture();f.payload.entities=f.entities.filter(e=>e.id!=='surface');unavailable(f);
});
test('language-stage drift invalidates an explicit mapping even when the form spelling is unchanged',()=>{
 const f=fixture();f.entities[0].language='別の言語段階';unavailable(f,'assembly_entity_or_stage_mismatch');
});
test('caption or display meaning drift cannot inherit verified correspondence',()=>{
 for(const mutate of [f=>f.row.assembly_alignment.caption+='changed',f=>f.row.assembly_alignment.segments[0].surface_meaning='別義']){
  const f=fixture();mutate(f);unavailable(f,'assembly_caption_mismatch');
 }
});
test('all independent component lineages must be covered by the caption mapping',()=>{
 const f=fixture();f.entities.push(entity('other'));f.lineages.push(lineage('other',['other']));
 unavailable(f,'missing_assembly_component');
});
test('a proposed or merely cognate form cannot serve as a confirmed assembly component',()=>{
 for(const relation of ['proposed_from','cognate_with']){
  const f=fixture();f.lineages[0].deepest_confirmed_ref='surface';f.lineages[0].edges=[edge('surface','old',relation,relation==='proposed_from'?'proposed':'source_supported')];
  f.row.assembly_alignment={caption:'古い確認段階 oldest（古い義）',caption_template:'古い確認段階 {0}',segments:[{entity_ref:'old',language:'古い確認段階',lineage_id:'base'}],evidence};
  unavailable(f,'assembly_outside_confirmed_path');
 }
});
test('surface form and gloss changes require explicit sourced correspondence',()=>{
 for(const field of ['correspondence','evidence']){const f=fixture();delete f.row.assembly_alignment.segments[0][field];unavailable(f,'unconfirmed_assembly_surface');}
});
test('a template cannot hide another foreign material form in its literal text',()=>{
 for(const literal of ['＋hidden（未登録）','←systir','＋σύν','＋слово']){
  const f=fixture();f.row.assembly_alignment.caption_template+=literal;f.row.assembly_alignment.caption+=literal;
  unavailable(f,'assembly_caption_mismatch');
 }
 const f=fixture();f.row.assembly_alignment.caption_template+='〔日本語の限定注記〕';f.row.assembly_alignment.caption+='〔日本語の限定注記〕';assert.equal(f.bind().coverage(f.word).guard_valid,true);
});
test('template placeholders must identify every declared segment once',()=>{
 for(const template of ['確認段階 {0}＋{0}','確認段階 {1}','確認段階 {0.foo}','確認段階 {0:format}']){
  const f=fixture();f.row.assembly_alignment.caption_template=template;unavailable(f,'assembly_caption_mismatch');
 }
});
test('the three explicit caption styles preserve referenced form and meaning without opaque text passthrough',()=>{
 for(const [style,caption] of [['form_meaning','確認段階 display（表示義）'],['form_only','確認段階 display'],['form_corner_quote','確認段階 display「表示義」']]){
  const f=fixture();f.row.assembly_alignment.segments[0].render_style=style;f.row.assembly_alignment.caption=caption;
  const b=f.bind(),out=ui.rootCell(b,f.word,legacy);assert.equal(b.coverage(f.word).guard_valid,true,style);
  assert.match(out,/<i>登録義<\/i>/);assert.match(out,/display ← attested/);
 }
});
test('bare-form captions still display the registered meaning and historical language',()=>{
 const f=fixture();f.row.assembly_alignment.segments[0].render_style='form_only';f.row.assembly_alignment.caption='確認段階 display';
 const out=ui.rootCell(f.bind(),f.word,legacy);assert.match(out,/組み立て表示：display/);assert.match(out,/<i>登録義<\/i>/);assert.match(out,/<small>確認段階<\/small>/);
});
test('unknown or malformed render styles and style-dependent caption drift are unavailable',()=>{
 for(const style of ['raw_caption','',{},null]){const f=fixture();f.row.assembly_alignment.segments[0].render_style=style;unavailable(f,'unconfirmed_assembly_surface');}
 const f=fixture();f.row.assembly_alignment.segments[0].render_style='form_only';unavailable(f,'assembly_caption_mismatch');
});
function materialFixture(){
 const f=fixture();f.entities=[entity('parent','whole','全体義','形成段階'),entity('first','first','第一材料','第一段階'),entity('second','second','第二材料','第二段階')];
 f.payload.entities=f.entities;f.lineages=[lineage('first',['first']),lineage('second',['second'])];f.row.lineages=f.lineages;
 f.row.historical_analyses=[{id:'whole-materials',kind:'material_composition',label:'確認した内部材料',parent_entity_ref:'parent',status:'source_supported',segments:[{entity_ref:'first',lineage_id:'first'},{entity_ref:'second',lineage_id:'second'}],evidence}];
 f.row.assembly_alignment={caption:'形成段階 whole（全体義）',caption_template:'形成段階 {0}',segments:[{entity_ref:'parent',language:'形成段階',analysis_id:'whole-materials'}],evidence};
 return f;
}
test('a whole-form display parent connects all materials without becoming an extra independent root',()=>{
 const f=materialFixture(),b=f.bind(),out=ui.rootCell(b,f.word,legacy),c=b.coverage(f.word);
 assert.equal(c.confirmed_attested_lexical_count,2);assert.equal(ui.matches(c,'multiple'),true);
 assert.deepEqual(b.rootRefs(f.word).map(r=>r.id),['first','second']);assert.deepEqual(b.displayRefs(f.word).map(r=>r.id),['parent']);
 for(const id of ['parent','first','second']){assert.equal(count(out,`data-k="component:${id}"`),1);assert.ok(b.syntheticRoots().some(n=>n.component_id===id));assert.equal(b.byEntity(id)[0],f.word);assert.equal(b.matches(f.word,{entities:[id]}),true);}
 assert.match(out,/data-analysis-kind="material_composition"/);assert.match(out,/第一材料/);assert.match(out,/第二材料/);
});
test('a hypothesis or analogy cannot be promoted into the confirmed whole-form connection',()=>{
 for(const kind of ['hypothesis','analogy']){const f=materialFixture();f.row.historical_analyses[0].kind=kind;unavailable(f,'assembly_material_parent_mismatch');}
});
test('uncertain material parent, status, or deep path invalidates the whole mapping',()=>{
 for(const mutate of [f=>f.entities[0].status='proposed',f=>f.row.historical_analyses[0].status='uncertain',f=>f.row.historical_analyses[0].segments[1].lineage_id='first']){
  const f=materialFixture();mutate(f);unavailable(f);
 }
});
test('historical analyses cannot silently discard a missing remaining part',()=>{
 const f=fixture();f.row.historical_analyses=[{id:'history',kind:'form_history',label:'語形史',segments:[{entity_ref:'old'},{entity_ref:'missing'}],evidence}];unavailable(f,'dangling_historical_analysis');
});
function contributionFixture(){
 const f=fixture();f.entities.push(entity('contributor','weten-fixture','濡らすという検証義','寄与した確認段階'));
 f.row.historical_analyses=[{id:'attested-contribution',kind:'form_history',caption_binding:'attested_word_contribution',status:'source_supported',label:'確認された別語形の寄与',segments:[{entity_ref:'contributor'}],evidence}];
 f.row.assembly_alignment={caption:'確認段階 display（表示義）を継承〔寄与した確認段階 weten-fixtureの寄与〕',caption_template:'確認段階 {0}を継承〔寄与した確認段階 {1}の寄与〕',segments:[f.row.assembly_alignment.segments[0],{entity_ref:'contributor',language:'寄与した確認段階',analysis_id:'attested-contribution',render_style:'form_only'}],evidence};
 return f;
}
test('an explicit attested word contribution adds its display form while the main material remains one lineage',()=>{
 const f=contributionFixture(),b=f.bind(),out=ui.rootCell(b,f.word,legacy);
 assert.equal(b.coverage(f.word).guard_valid,true);assert.equal(b.coverage(f.word).confirmed_attested_lexical_count,1);
 assert.equal(ui.matches(b.coverage(f.word),'multiple'),false);assert.deepEqual(b.rootRefs(f.word).map(r=>r.id),['old']);
 assert.equal(count(out,'data-k="component:contributor"'),1);assert.match(out,/weten-fixture/);assert.match(out,/濡らすという検証義/);
 assert.equal(b.byEntity('contributor')[0],f.word);assert.equal(b.matches(f.word,{entityIds:['contributor']}),true);
});
test('a contribution-only caption cannot replace the main material alignment',()=>{
 const f=contributionFixture();f.row.assembly_alignment.segments=[f.row.assembly_alignment.segments[1]];
 f.row.assembly_alignment.caption_template='寄与した確認段階 {0}の寄与';f.row.assembly_alignment.caption='寄与した確認段階 weten-fixtureの寄与';
 unavailable(f,'contribution_only_assembly');
});
test('a history contribution cannot supply coverage for a missing independent constituent',()=>{
 const f=contributionFixture();f.lineages.push(lineage('missing-material',['contributor']));
 unavailable(f,'missing_assembly_component');
});
test('ordinary histories, missing confirmation and hypothesis histories cannot back the contribution slot',()=>{
 for(const mutate of [f=>delete f.row.historical_analyses[0].caption_binding,f=>delete f.row.historical_analyses[0].status,f=>f.row.historical_analyses[0].status='uncertain',f=>f.row.historical_analyses[0].kind='hypothesis']){
  const f=contributionFixture();mutate(f);unavailable(f);
 }
});
test('contribution history forms must be attested, confirmed, and in the stated language stage',()=>{
 for(const mutate of [f=>f.entities[2].status='proposed',f=>f.entities[2].kind='pie_reconstruction',f=>f.entities[2].kind='attested_formative',f=>f.entities[2].language='別段階']){
  const f=contributionFixture();mutate(f);unavailable(f);
 }
 const f=contributionFixture();f.entities.push(entity('unconfirmed-parent','parent','仮説','段階','proposed_reconstruction'));f.entities[3].status='proposed';f.row.historical_analyses[0].parent_entity_ref='unconfirmed-parent';unavailable(f,'unattested_contribution_form');
});
test('external origin evidence basis is retained without relaxing the existing word-context guard',()=>{
 const f=contributionFixture();f.row.origin_evidence_basis={origin:'external_primary',local_cache:'cache_drift_only'};
 const original=JSON.stringify(f.payload),b=f.bind();assert.deepEqual(b.annotations(f.word).origin_evidence_basis,f.row.origin_evidence_basis);
 assert.equal(JSON.stringify(f.payload),original);f.word.ja+=' changed';unavailable(f,'word_guard:ja');
});
test('current published aligned records bind and display all unique registered caption IDs',()=>{
 const read=p=>fs.readFileSync(path.join(root,p),'utf8');
 const words=JSON.parse(read('app/data/generated-etymon/words.json')),roots=JSON.parse(read('app/data/generated-etymon/roots.json'));
 const payload=require('../../shared/component-payload-node.cjs').readPayload(path.join(root,'app/data/generated-etymon'),{roots}),b=api.bind(words,api.prepare(payload,roots));
 for(const w of words){const a=b.annotations(w)?.assembly_alignment;if(!a)continue;assert.equal(b.coverage(w).guard_valid,true,w.w);const out=ui.rootCell(b,w,legacy);
  if(b.annotations(w).component_display==='layered')continue;
  for(const id of new Set(a.segments.map(s=>b.entity(s.entity_ref).id)))assert.equal(count(out,`data-k="component:${id}"`),1,w.w+': '+id);
 }
 const propose=words.find(w=>w.w==='propose'),out=ui.rootCell(b,propose,legacy);
 assert.match(out,/pose ← poser/);assert.equal(count(out,'data-k="per1"'),1);assert.equal(count(out,'data-k="apo-"'),1);
 assert.equal(b.summary.linked,payload.words.filter(e=>e.guard_valid).length);
});
