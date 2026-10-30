'use strict';
// Explicitly invented metadata exercises display guards, not historical inference.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../..'),flag=process.argv.indexOf('--helpers');
const helpers=flag<0?path.join(root,'app/shared'):path.resolve(process.argv[flag+1]),suffix=flag<0?'.js':'.staged.js';
const api=require(path.join(helpers,'etymological-components'+suffix)),ui=require(path.join(helpers,'vocabulary-components-ui'+suffix));
const clone=structuredClone,source='https://example.test/word',oldSource='https://example.test/legacy';
const evidence=[{source,note:'Software fixture only'}];
function fixture(){
 const word={w:'fixture',p:['old-latin'],ja:'検証',en:'fixture',pos:'名',b:'Protected fixture note'};
 const entity={id:'base',form:'gerere',meaning:'運ぶ・もたらす',language:'ラテン語',kind:'attested_lexeme',status:'dictionary_attested',evidence};
 const legacy={key:'old-latin',pie:'gerere',ja:'運ぶ',kind:'latin_lemma',origin_language:'L',definition_reviewed:true,definition_source:oldSource};
 const guard={kind:'latin_lemma',form:'gerere',origin_language:'L',meaning:'運ぶ',definition_reviewed:true,definition_source:oldSource};
 const row={w:word.w,p:[...word.p],word_guard:{ja:word.ja,en:word.en,pos:word.pos,b:word.b},guard_valid:true,components_complete:false,
  lineages:[{id:'base-lineage',role:'lexical',refs:['base'],word_ref:'base',deepest_confirmed_ref:'base',link_status:'source_supported',legacy_root_keys:['old-latin'],edges:[],evidence}],
  legacy_relations:[{key:'old-latin',status:'source_supported',relation:'same_attested_lemma',entity_ref:'base',direct_form:'gerere',direct_meaning:'運ぶ・もたらす',note:'Explicit reviewed same-lemma display link.',legacy_guard:guard,evidence:[...evidence,{source:oldSource}]}]};
 const payload={schema:1,entities:[entity],aliases:[],edges:[],words:[row],legacy_root_types:[{key:'old-latin',type:'latin_lemma'}]};
 return {word,entity,legacy,row,payload};
}
function render(f){
 const binding=api.bind([f.word],api.prepare(f.payload,[f.legacy]));
 const html=ui.rootCell(binding,f.word,key=>`<span class="chip" data-k="${key}">LEGACY gerere</span>`);
 return {html,binding};
}
function retained(f){const {html}=render(f);assert.match(html,/LEGACY gerere/);assert.doesNotMatch(html,/legacyComponentReference/);}
test('one explicitly linked confirmed Latin lemma displays once and retains old navigation',()=>{
 const f=fixture(),before=clone(f),{html,binding}=render(f);
 assert.doesNotMatch(html,/LEGACY gerere/);assert.equal((html.match(/>gerere<i>/g)||[]).length,1);
 assert.match(html,/class="chip legacyComponentReference" data-k="old-latin" data-equivalent-component="base"/);
 assert.match(html,/data-k="component:base"/);assert.deepEqual(f,before);
 assert.equal(binding.coverage(f.word).legacy_ref_count,1);assert.equal(binding.coverage(f.word).confirmed_attested_lexical_count,1);
 assert.deepEqual(binding.rootRefs(f.word).map(r=>r.id),['base']);assert.deepEqual(binding.byEntity('base'),[f.word]);
});
test('typed old metadata is immutable and independent of legacy coverage reference shapes',()=>{
 const f=fixture(),{binding}=render(f),info=binding.legacyInfo('old-latin');
 assert.ok(Object.isFrozen(info));assert.equal(info.type,'latin_lemma');assert.equal(info.form,'gerere');
 assert.throws(()=>{info.meaning='changed';},TypeError);assert.equal(binding.legacyInfo('old-latin').meaning,'運ぶ');
 assert.equal(binding.legacyInfo('absent'),null);assert.ok(!Object.hasOwn(binding.coverage(f.word).legacy_refs[0],'form'));
});
test('same spelling without an explicit typed reviewed relation remains separate',()=>{
 const f=fixture();delete f.row.legacy_relations;retained(f);
});
test('ordinary legacy annotations cannot be used as aliases',()=>{
 const f=fixture();for(const field of ['relation','entity_ref','legacy_guard','evidence'])delete f.row.legacy_relations[0][field];retained(f);
});
test('a different language, stage, form or sense never hides a legacy chip',()=>{
 for(const [field,value]of [['language','古フランス語'],['stage','古ラテン語'],['language_stage','後期ラテン語'],['form','gērere'],['meaning','別の意味']]){
  const f=fixture();f.entity[field]=value;retained(f);
 }
});
test('PIE, formative, morphological-root and proposed entities cannot suppress old lemmas',()=>{
 for(const kind of ['pie_reconstruction','pie_formative','attested_formative','attested_morphological_root','proposed_reconstruction']){
  const f=fixture();f.entity.kind=kind;if(kind==='proposed_reconstruction')f.entity.status='proposed';retained(f);
 }
});
test('legacy PIE or unknown type is never equated to an attested component',()=>{
 for(const kind of ['pie_registered','pie_reconstruction','unverified_reconstruction','legacy_alias','']){
  const f=fixture();f.legacy.kind=kind;f.payload.legacy_root_types[0].type=kind||'pie_registered';f.row.legacy_relations[0].legacy_guard.kind=kind;retained(f);
 }
});
test('changed old meaning, form, source, review, language or stage invalidates equivalence',()=>{
 for(const [field,value]of [['ja','別義'],['pie','gero'],['definition_source','https://example.test/changed'],['definition_reviewed',false],['origin_language','F'],['stage','後期ラテン語'],['language_stage','後期ラテン語'],['stage',{}]]){
  const f=fixture();f.legacy[field]=value;retained(f);
 }
});
test('exact typed guard, relation fields and status are mandatory',()=>{
 const base=fixture().row.legacy_relations[0];
 for(const field of Object.keys(base)){const f=fixture();delete f.row.legacy_relations[0][field];retained(f);}
 for(const [field,value]of [['relation','orthographic_alias'],['status','uncertain'],['entity_ref','unknown'],['direct_form','gest-'],['direct_meaning','異義'],['note','']]){
  const f=fixture();f.row.legacy_relations[0][field]=value;retained(f);
 }
 const extra=fixture();extra.row.legacy_relations[0].after_ja='forbidden';retained(extra);
 const guard=fixture();guard.row.legacy_relations[0].legacy_guard.extra='unknown';retained(guard);
});
test('evidence must cover both the reviewed legacy definition and confirmed entity path',()=>{
 for(const mutate of [f=>{f.row.legacy_relations[0].evidence=[];},f=>{f.row.legacy_relations[0].evidence=[{source:oldSource}];},f=>{f.row.legacy_relations[0].evidence=evidence;},f=>{f.row.lineages[0].evidence=[{source:'https://example.test/unrelated'}];}]){
  const f=fixture();mutate(f);retained(f);
 }
});
test('uncertain lineages, qualified older edges and missing legacy membership are retained',()=>{
 const uncertain=fixture();uncertain.row.lineages[0].link_status='uncertain';retained(uncertain);
 const missing=fixture();missing.row.lineages[0].legacy_root_keys=[];retained(missing);
 const qualified=fixture();qualified.payload.entities.push({id:'older',form:'*old',meaning:'仮説',language:'PIE',kind:'proposed_reconstruction',status:'proposed',evidence});
 qualified.row.lineages[0].refs.push('older');qualified.row.lineages[0].edges.push({from:'base',to:'older',relation:'proposed_from',link_status:'proposed',evidence});retained(qualified);
});
test('a cognate or unreachable same spelling is not a direct confirmed lineage member',()=>{
 const f=fixture();f.payload.entities.push({...f.entity,id:'other',form:'other'});
 f.row.lineages[0].refs.push('other');f.row.lineages[0].word_ref='other';f.row.lineages[0].deepest_confirmed_ref='other';
 f.row.lineages[0].edges.push({from:'other',to:'base',relation:'cognate_with',link_status:'reviewed',evidence});retained(f);
});
test('a known ancestor with a deeper displayed PIE terminal is not silently hidden',()=>{
 const f=fixture();f.payload.entities.push({id:'pie',form:'*older',meaning:'古い語根',language:'PIE',kind:'pie_reconstruction',status:'reviewed',evidence});
 f.row.lineages[0].refs.push('pie');f.row.lineages[0].deepest_confirmed_ref='pie';
 f.row.lineages[0].edges.push({from:'base',to:'pie',relation:'derived_from',link_status:'reviewed',evidence});retained(f);
});
test('duplicate annotations, ambiguous paths and duplicated old dictionary keys fail closed',()=>{
 const rows=fixture();rows.row.legacy_relations.push(clone(rows.row.legacy_relations[0]));retained(rows);
 const paths=fixture();paths.row.lineages.push({...clone(paths.row.lineages[0]),id:'second'});retained(paths);
 const f=fixture(),binding=api.bind([f.word],api.prepare(f.payload,[f.legacy,clone(f.legacy)]));
 assert.equal(binding.legacyInfo('old-latin'),null);assert.match(ui.rootCell(binding,f.word,()=>'<b>LEGACY gerere</b>'),/LEGACY gerere/);
});
test('word context drift does not inherit the display relation',()=>{
 const f=fixture();f.word.en='changed';retained(f);
});
test('layered nonPIE rows use neutral references; all typed PIE references preserve their label',()=>{
 const f=fixture();f.row.component_display='layered';f.row.assembly_alignment={caption_prefix:'',caption:'gerere（運ぶ・もたらす）',segments:[{entity_ref:'base',language:'ラテン語'}],evidence};
 assert.match(render(f).html,/従来の語根参照/);assert.doesNotMatch(render(f).html,/従来のPIE参照/);
 delete f.row.legacy_relations;f.legacy.kind='pie_registered';f.payload.legacy_root_types[0].type='pie_registered';
 assert.match(render(f).html,/従来のPIE参照（直接部品とは別段階）/);
});
test('current complete data keeps previous counts, filters, references and propose row bytes',()=>{
 const data=path.join(root,'app/data/generated-etymon'),context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(data,'etymological-components.js'),'utf8'),context);
 const words=JSON.parse(fs.readFileSync(path.join(data,'words.json'),'utf8')),roots=JSON.parse(fs.readFileSync(path.join(data,'roots.json'),'utf8')),before=JSON.stringify({words,roots});
 const oldDir=path.join(root,'work/assembly-component-alignment-20261028/legacy-lemma-dedup'),oldAPI=path.join(oldDir,'etymological-components.js.before-a057615888fc'),oldUI=path.join(oldDir,'vocabulary-components-ui.js.before-cc2d1d2216c5');
 const priorAPI=fs.existsSync(oldAPI)?require(oldAPI):require(path.join(root,'app/shared/etymological-components.js'));
 const priorUI=fs.existsSync(oldUI)?require(oldUI):require(path.join(root,'app/shared/vocabulary-components-ui.js'));
 const binding=api.bind(words,api.prepare(context.ETYMON_ETYMOLOGICAL_COMPONENTS,roots)),oldBinding=priorAPI.bind(words,priorAPI.prepare(context.ETYMON_ETYMOLOGICAL_COMPONENTS,roots));
 assert.deepEqual(binding.summary,oldBinding.summary);
 for(const w of words){assert.deepEqual(binding.coverage(w),oldBinding.coverage(w));assert.deepEqual(binding.rootRefs(w).map(r=>r.id),oldBinding.rootRefs(w).map(r=>r.id));}
 const propose=words.find(w=>w.w==='propose'&&w.p.join('+')==='per1+apo-'),legacy=key=>`<span class="chip" data-k="${key}">${key}</span>`;
 assert.equal(ui.rootCell(binding,propose,legacy),priorUI.rootCell(oldBinding,propose,legacy));assert.equal(JSON.stringify({words,roots}),before);
});
