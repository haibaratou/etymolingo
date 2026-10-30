'use strict';
// Design fixtures test guarding and field preservation, not historical claims.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {test}=require('node:test');
const root=path.resolve(__dirname,'../../..');
const selected=process.argv.indexOf('--runtime');
const runtime=selected<0?path.join(root,'app/shared/etymology-origins.js'):path.resolve(process.argv[selected+1]);
const api=require(runtime),clone=structuredClone;
const digest=text=>crypto.createHash('sha256').update(text,'utf8').digest('hex');
const fixtureWord=(w='fixture')=>({w,p:['root-a','root-b'],etymology_id:'',g:'G',ja:'検証語',en:'fixture',pos:'名',b:'Protected note',r:5,pic:'protected.png'});
function fixtureEntry(word,index=0){
 return {correction_id:word.w+'-assembly-fixture-v1',w:word.w,p:[...word.p],etymology_id:word.etymology_id,
  before_g:word.g,before_ja:word.ja,before_en:word.en,before_pos:word.pos,before_b:word.b,
  before_parts:'wrong（検証用の旧構成）',parts:'form（検証用の構成）',correction_scope:'etymological_assembly_only',word_key:api.wordPartsKey(word),
  before_parts_sha256:digest('wrong（検証用の旧構成）'),parts_sha256:digest('form（検証用の構成）'),
  source_guard:{path:'app/data/generated-etymon/det/'+(/^[A-Za-z]$/.test(word.w[0])?word.w[0].toLowerCase():'_')+'.json',record:String(index),slot:1,sha256:digest('Immutable fixture snapshot')}};
}
function fixture(){const word=fixtureWord(),entry=fixtureEntry(word);return {word,entry,parts:{[entry.word_key]:entry.before_parts,protected:'Protected caption'}};}
function bind(words,parts,corrections,entries=[]){return api.bindWordParts(words,parts,{schema:1,entries,corrections});}
function reject(entry,words=[fixtureWord()]){
 const parts={[api.wordPartsKey(words[0])]:'wrong（検証用の旧構成）',protected:'Protected caption'},before=clone(parts),beforeWords=clone(words);
 assert.throws(()=>bind(words,parts,[entry]));assert.deepEqual(parts,before);assert.deepEqual(words,beforeWords);
}

test('one reviewed assembly correction changes only its exact parts cell',()=>{
 const {word,entry,parts}=fixture(),before=clone(word),result=bind([word],parts,[entry]);
 assert.equal(result.corrections.corrected,1);assert.equal(parts[entry.word_key],entry.parts);
 assert.equal(parts.protected,'Protected caption');assert.deepEqual(word,before);
});
test('already corrected text remains idempotent after all context guards',()=>{
 const {word,entry,parts}=fixture();bind([word],parts,[entry]);const before=clone(parts);
 assert.equal(bind([word],parts,[entry]).corrections.alreadyCorrected,1);assert.deepEqual(parts,before);
 word.en='Changed sense';assert.equal(bind([word],parts,[entry]).corrections.stale,1);assert.deepEqual(parts,before);
});
for(const field of ['g','ja','en','pos','b'])test('current '+field+' drift holds the correction',()=>{
 const {word,entry,parts}=fixture(),before=clone(parts);word[field]='Changed context';
 assert.equal(bind([word],parts,[entry]).corrections.stale,1);assert.deepEqual(parts,before);
});
for(const field of ['etymology_id','w','p'])test('current '+field+' identity drift cannot choose another record',()=>{
 const {word,entry,parts}=fixture(),before=clone(parts);word[field]=field==='p'?['root-b','root-a']:'other';
 assert.equal(bind([word],parts,[entry]).corrections.missing,1);assert.deepEqual(parts,before);
});
test('null origin ID is not silently accepted as an empty guarded ID',()=>{
 const {word,entry,parts}=fixture(),before=clone(parts);word.etymology_id=null;
 assert.equal(bind([word],parts,[entry]).corrections.stale,1);assert.deepEqual(parts,before);
});
test('absent empty origin ID follows the source producer default',()=>{
 const {word,entry,parts}=fixture();delete word.etymology_id;
 assert.equal(bind([word],parts,[entry]).corrections.corrected,1);assert.ok(!Object.hasOwn(word,'etymology_id'));
});
test('own source global index is checked against the whole word array',()=>{
 const {word,entry,parts}=fixture(),before=clone(parts);entry.source_guard.record='1';
 assert.equal(bind([word],parts,[entry]).corrections.stale,1);assert.deepEqual(parts,before);
 assert.equal(bind([fixtureWord('padding'),word],parts,[entry]).corrections.corrected,1);
});
test('duplicate current identities and old joined-key collisions are held',()=>{
 const {word,entry,parts}=fixture(),before=clone(parts);
 assert.equal(bind([word,clone(word)],parts,[entry]).corrections.ambiguous,1);assert.deepEqual(parts,before);
 const other={...word,etymology_id:'other'};
 assert.equal(bind([word,other],parts,[entry]).corrections.ambiguous,1);assert.deepEqual(parts,before);
 const joined={...word,p:['root-a+root-b']};
 assert.equal(bind([word,joined],parts,[entry]).corrections.ambiguous,1);assert.deepEqual(parts,before);
});
test('a third caption, empty, null or missing caption is never overwritten',()=>{
 for(const value of ['Another independently edited caption','',null,undefined]){
  const {word,entry,parts}=fixture();if(value===undefined)delete parts[entry.word_key];else parts[entry.word_key]=value;
  const before=clone(parts);assert.equal(bind([word],parts,[entry]).corrections.stale,1);assert.deepEqual(parts,before);
 }
});
test('multiple distinct reviewed corrections apply together',()=>{
 const first=fixtureWord(),second=fixtureWord('second'),entries=[fixtureEntry(first),fixtureEntry(second,1)];
 const parts=Object.fromEntries(entries.map(e=>[e.word_key,e.before_parts])),before=clone([first,second]);
 assert.equal(bind([first,second],parts,entries).corrections.corrected,2);
 for(const e of entries)assert.equal(parts[e.word_key],e.parts);assert.deepEqual([first,second],before);
});
test('all correction IDs and old parts keys must be unique before mutation',()=>{
 const {word,entry,parts}=fixture();
 for(const duplicate of [clone(entry),{...entry,correction_id:'another'},{...fixtureEntry(fixtureWord('second'),1),correction_id:entry.correction_id}]){
  const before=clone(parts);assert.throws(()=>bind([word],parts,[entry,duplicate]),/duplicate/);assert.deepEqual(parts,before);
 }
});
test('invalid later correction prevents an earlier correction or blank addition',()=>{
 const {word,entry,parts}=fixture(),other=fixtureWord('second'),addition={w:other.w,p:other.p,etymology_id:'',before_g:other.g,before_ja:other.ja,before_en:other.en,parts:'new（部品）'};
 const invalid=fixtureEntry(other,1);invalid.parts+='tampered';const before=clone(parts),beforeWords=clone([word,other]);
 assert.throws(()=>bind([word,other],parts,[entry,invalid],[addition]),/digest/);
 assert.deepEqual(parts,before);assert.deepEqual([word,other],beforeWords);
});
test('unknown correction or provenance fields cannot carry lexical mutations',()=>{
 for(const [where,key,value]of [['entry','after_ja','new meaning'],['entry','after_pos','動'],['entry','new_word_patch',{}],['source','after_b','new note']]){
  const {entry}=fixture();(where==='entry'?entry:entry.source_guard)[key]=value;reject(entry);
 }
});
test('every generic payload field is required and typed',()=>{
 const original=fixture().entry;
 for(const field of Object.keys(original)){const e=clone(original);delete e[field];reject(e);}
 for(const [field,value]of [['w',''],['p',['root-a',1]],['p',['']],['p','root-a'],['etymology_id',null],['before_ja',{}],['before_pos',false],['parts',''],['before_parts',' '],['word_key',17],['correction_id',' ']]){
  const e=clone(original);e[field]=value;reject(e);
 }
});
test('scope and exact joined word key cannot be broadened',()=>{
 for(const [field,value]of [['correction_scope','word_glosses'],['word_key','["fixture","root-b+root-a"]']]){const {entry}=fixture();entry[field]=value;reject(entry);}
 const word={...fixtureWord('propose'),p:['per1','apo-']};reject(fixtureEntry(word),[word]);
});
test('before and after UTF-8 caption hashes must be exact lower-case SHA256',()=>{
 for(const [field,value]of [['before_parts','tamper'],['parts','tamper'],['before_parts_sha256','0'.repeat(64)],['parts_sha256','0'.repeat(64)],['parts_sha256','F'.repeat(64)],['parts_sha256',null]]){
  const {entry}=fixture();entry[field]=value;reject(entry);
 }
 const {entry}=fixture();entry.parts=entry.before_parts;entry.parts_sha256=entry.before_parts_sha256;reject(entry);
});
test('runtime provenance must be own detail shard, exact index, slot one and a digest',()=>{
 for(const [field,value]of [['path','app/data/pie/words.json'],['path','app/data/generated-etymon/det/s.json'],['record','01'],['record',0],['record','-1'],['slot',true],['slot',0],['sha256','invalid'],['sha256',1]]){
  const {entry}=fixture();entry.source_guard[field]=value;reject(entry);
 }
});
test('non-Latin headwords use the own underscore detail shard',()=>{
 const word=fixtureWord('仮'),entry=fixtureEntry(word),parts={[entry.word_key]:entry.before_parts};
 assert.equal(bind([word],parts,[entry]).corrections.corrected,1);
});
test('SHA256 handles ASCII block boundaries, multilingual forms and astral glyphs',()=>{
 for(const text of ['a','a'.repeat(55),'a'.repeat(56),'a'.repeat(63),'a'.repeat(64),'a'.repeat(120),'æþō（古英語）＋日本語','a\u0301とá、𐍈と😀'.repeat(20)]){
  const {word,entry,parts}=fixture();entry.before_parts=text;entry.before_parts_sha256=digest(text);entry.parts=text+' revised';entry.parts_sha256=digest(entry.parts);parts[entry.word_key]=text;
  assert.equal(bind([word],parts,[entry]).corrections.corrected,1,text);
 }
});
test('browser classic-script helper works without Node, TextEncoder, fetch or WebCrypto',()=>{
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(runtime,'utf8'),context);
 const {word,entry,parts}=fixture();entry.parts='古代語（𐍈）';entry.parts_sha256=digest(entry.parts);
 assert.equal(context.EtymonOrigins.bindWordParts([word],parts,{schema:1,entries:[],corrections:[entry]}).corrections.corrected,1);
 assert.equal(parts[entry.word_key],entry.parts);assert.equal(context.crypto,undefined);assert.equal(context.fetch,undefined);
});
test('fixed propose output and whole current file binding match the previous runtime',()=>{
 const backup=path.join(root,'work/assembly-component-alignment-20261028/generic-correction-runtime/etymology-origins.before-fc87a0c52920.js');
 // The compatibility snapshot is local evidence, not a production dependency.
 const previous=fs.existsSync(backup)?require(backup):require(path.join(root,'app/shared/etymology-origins.js'));
 const data=path.join(root,'app/data/generated-etymon'),words=JSON.parse(fs.readFileSync(path.join(data,'words.json'),'utf8'));
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(data,'word-parts-supplement.js'),'utf8'),context);
 const payload=JSON.parse(JSON.stringify(context.ETYMON_WORD_PARTS_SUPPLEMENT)),entry=payload.corrections.find(e=>e.correction_id==='propose-old-french-stage-v1');
 assert.ok(entry);const parts=JSON.parse(fs.readFileSync(path.join(data,'word-parts.json'),'utf8')),old=clone(parts),before=clone(words);
 const compatible={...payload,corrections:[entry]};
 assert.deepEqual(api.bindWordParts(words,parts,compatible),previous.bindWordParts(words,old,compatible));assert.deepEqual(parts,old);assert.deepEqual(words,before);
 const extended=clone(old),currentResult=api.bindWordParts(words,extended,payload);
 assert.deepEqual(extended,old);assert.equal(currentResult.corrections.corrected,0);
 assert.equal(currentResult.corrections.alreadyCorrected,payload.corrections.length);assert.deepEqual(words,before);
 const word=words.find(w=>w.w===entry.w&&JSON.stringify(w.p)===JSON.stringify(entry.p));
 const left={[api.wordPartsKey(word)]:entry.before_parts},right=clone(left);
 assert.deepEqual(bind([word],left,[entry]),previous.bindWordParts([word],right,{schema:1,entries:[],corrections:[entry]}));assert.deepEqual(left,right);
 const withUnknown={...entry,after_ja:'forbidden'};reject(withUnknown,[word]);
});
