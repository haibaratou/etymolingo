'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const origins=require('../../shared/etymology-origins.js');
const root=path.resolve(__dirname,'../../..');
const fixtureLanguages=[
 {id:'oe',label:'古英語',family:'ゲルマン'},
 {id:'on',label:'古ノルド語',family:'ゲルマン'},
 {id:'of',label:'古フランス語',family:'ロマンス'},
 {id:'fr',label:'フランス語',family:'ロマンス'},
 {id:'la',label:'ラテン語',family:'ロマンス'},
 {id:'grc',label:'古代ギリシャ語',family:'ギリシャ'},
 {id:'ja',label:'日本語',family:'日琉'},
];
const fixtureTags=[
 ['water',['ゲルマン'],['古英語']],
 ['sky',['ゲルマン'],['古ノルド語']],
 ['restaurant',['ロマンス'],['フランス語']],
 ['beautiful',['ロマンス','ゲルマン'],['古フランス語','古英語']],
 ['television',['ギリシャ','ロマンス'],['古代ギリシャ語','ラテン語']],
 ['sushi',['日琉'],['日本語']],
 ['unresolved',[],[]],
];
function fixture(){
 const words=fixtureTags.map(([w],i)=>({w,p:['fixture'],ja:w,en:w,g:'G',gs:['G'],r:i+1,pos:w==='beautiful'?'形':'名',pre:'',suf:'',pic:false,b:'',k:''}));
 const payload={schema:1,languages:fixtureLanguages,entries:fixtureTags.map(([w,origin_families,origin_languages])=>({w,p:['fixture'],before_ja:w,before_en:w,origin_families,origin_languages}))};
 return {words,payload};
}
const tests=[];
function test(name,fn){fn();tests.push(name);}
test('same level OR and cross-level AND',()=>{
 const {words,payload}=fixture();origins.bind(words,origins.prepare(payload));
 const names=(fs,ls)=>words.filter(w=>origins.matches(w,fs,ls)).map(w=>w.w);
 assert.deepEqual(names(['ゲルマン','日琉'],[]),['water','sky','beautiful','sushi']);
 assert.deepEqual(names(['ロマンス'],['古英語','ラテン語']),['beautiful','television']);
 assert.deepEqual(names([],['古英語','古ノルド語']),['water','sky','beautiful']);
 assert.deepEqual(names(['ゲルマン'],['日本語']),[]);
 assert.equal(names([],[]).length,7);
});
test('legacy primary tag never fabricates a source language',()=>{
 const {words,payload}=fixture();origins.bind(words,origins.prepare(payload));
 assert.deepEqual(words.at(-1).origin_families,[]);assert.deepEqual(words.at(-1).origin_languages,[]);
});
test('language candidates follow selected families',()=>{
 const {words,payload}=fixture(),data=origins.prepare(payload);origins.bind(words,data);
 assert.deepEqual(origins.availableLanguages(words,data,['ゲルマン']).map(x=>x.label).sort(),['古ノルド語','古英語'].sort());
 assert.ok(origins.availableLanguages(words,data,['ゲルマン','日琉']).some(x=>x.label==='日本語'));
});
test('changing family removes incompatible hidden language choices',()=>{
 const {payload}=fixture(),data=origins.prepare(payload);
 const state={originFamilies:['ゲルマン','ロマンス'],originLanguages:['古英語','ラテン語']};
 origins.toggleFamily(state,'ゲルマン',data);
 assert.deepEqual(state,{originFamilies:['ロマンス'],originLanguages:['ラテン語']});
 origins.toggleFamily(state,'ロマンス',data);
 assert.deepEqual(state.originLanguages,['ラテン語']);
});
test('identity preserves root order and homographs never inherit tags',()=>{
 const payload={schema:1,languages:fixtureLanguages,entries:[{w:'same',p:['b','a'],etymology_id:'one',origin_families:['日琉'],origin_languages:['日本語']}]};
 const words=[{w:'same',p:['b','a'],etymology_id:'one'},{w:'same',p:['a','b'],etymology_id:'one'},{w:'same',p:['b','a'],etymology_id:'two'}];
 origins.bind(words,origins.prepare(payload));
 assert.deepEqual(words[0].origin_languages,['日本語']);assert.deepEqual(words[1].origin_languages,[]);assert.deepEqual(words[2].origin_languages,[]);
});
test('changed sense and ambiguous duplicate identities fail closed',()=>{
 const {words,payload}=fixture(),data=origins.prepare(payload);
 words[0].ja='different meaning';words.push({...words[1]});
 const result=origins.bind(words,data);
 assert.equal(result.stale,3);assert.deepEqual(words[0].origin_families,[]);assert.deepEqual(words[1].origin_languages,[]);
});
test('stale file snapshots with changed legacy origin decisions fail closed',()=>{
 const {words,payload}=fixture();payload.entries[0].before_g='L';payload.entries[1].before_gs=['G','L'];
 const result=origins.bind(words,origins.prepare(payload));
 assert.equal(result.stale,2);assert.deepEqual(words[0].origin_languages,[]);assert.deepEqual(words[1].origin_families,[]);
});
test('inconsistent taxonomy is rejected and duplicate identities alone are held',()=>{
 const {payload}=fixture();payload.entries[0].origin_families=['日琉'];assert.throws(()=>origins.prepare(payload),/Inconsistent/);
 const again=fixture().payload;again.entries.push(again.entries[0]);
 const data=origins.prepare(again),{words}=fixture();const result=origins.bind(words,data);
 assert.equal(data.ambiguous.size,1);assert.equal(data.entries.size,6);assert.equal(result.ambiguous,1);
 assert.deepEqual(words[0].origin_languages,[]);assert.deepEqual(words[1].origin_languages,['古ノルド語']);
});
test('binding adds only the two authorized columns',()=>{
 const {words,payload}=fixture();words[0].difficulty=6;words[0].pica='do-not-touch';words[0].b='preserve note';
 const before=JSON.parse(JSON.stringify(words));origins.bind(words,origins.prepare(payload));
 for(const [i,row] of words.entries()){
  const copy={...row};delete copy.origin_families;delete copy.origin_languages;assert.deepEqual(copy,before[i]);
 }
});
function supplementEntry(word,parts='a（部品）＋b（部品）'){
 return {w:word.w,p:[...word.p],etymology_id:word.etymology_id||'',before_g:word.g||'',before_ja:word.ja||'',before_en:word.en||'',parts};
}
test('word-parts supplement fills blanks and preserves every existing value',()=>{
 const {words}=fixture(),before=JSON.parse(JSON.stringify(words));
 const payload={schema:1,entries:words.slice(0,3).map(w=>supplementEntry(w))};
 const parts={[origins.wordPartsKey(words[0])]:'既存の組み立て',[origins.wordPartsKey(words[1])]:' \n'};
 const result=origins.bindWordParts(words,parts,payload);
 assert.equal(result.added,2);assert.equal(result.alreadyPresent,1);
 assert.equal(parts[origins.wordPartsKey(words[0])],'既存の組み立て');
 assert.equal(parts[origins.wordPartsKey(words[1])],payload.entries[1].parts);
 assert.deepEqual(words,before);
});
test('word-parts supplement is idempotent over current HTTP data',()=>{
 const {words}=fixture(),payload={schema:1,entries:words.slice(0,2).map(w=>supplementEntry(w))},parts={};
 assert.equal(origins.bindWordParts(words,parts,payload).added,2);
 const before=JSON.stringify(parts),result=origins.bindWordParts(words,parts,payload);
 assert.equal(result.added,0);assert.equal(result.alreadyPresent,2);assert.equal(JSON.stringify(parts),before);
});
test('word-parts supplement holds changed meanings, origins and missing guards',()=>{
 const {words}=fixture(),entries=words.slice(0,5).map(w=>supplementEntry(w));
 entries[0].before_ja='changed';entries[1].before_en='changed';entries[2].before_g='changed';
 delete entries[3].before_en;entries[4].before_gs=['L'];
 const parts={},result=origins.bindWordParts(words,parts,{schema:1,entries});
 assert.equal(result.stale,5);assert.deepEqual(parts,{});
});
test('word-parts supplement preserves root order and exact origin identity',()=>{
 const words=[{w:'same',p:['a','b'],g:'G',ja:'first',en:'first',etymology_id:'one'},
  {w:'same',p:['b','a'],g:'G',ja:'second',en:'second',etymology_id:'one'}];
 const parts={},entries=[supplementEntry(words[0],'first parts'),supplementEntry({...words[1],etymology_id:'another'},'wrong origin')];
 const result=origins.bindWordParts(words,parts,{schema:1,entries});
 assert.equal(result.added,1);assert.equal(result.missing,1);assert.equal(parts[origins.wordPartsKey(words[0])],'first parts');
 assert.equal(parts[origins.wordPartsKey(words[1])],undefined);
});
test('word-parts supplement rejects legacy key collisions and duplicate source entries',()=>{
 const first={w:'same',p:['a'],g:'G',ja:'first',en:'first',etymology_id:'one'};
 const second={...first,etymology_id:'two'};
 let parts={},result=origins.bindWordParts([first,second],parts,{schema:1,entries:[supplementEntry(first)]});
 assert.equal(result.ambiguous,1);assert.deepEqual(parts,{});
 parts={};result=origins.bindWordParts([first],parts,{schema:1,entries:[supplementEntry(first),supplementEntry(first)]});
 assert.equal(result.ambiguous,2);assert.deepEqual(parts,{});
 const joinCollision={...first,p:['a+b']},joined={...first,p:['a','b']};
 parts={};result=origins.bindWordParts([joinCollision,joined],parts,{schema:1,entries:[supplementEntry(joinCollision)]});
 assert.equal(result.ambiguous,1);assert.deepEqual(parts,{});
});
test('word-parts supplement validates payload and empty content',()=>{
 const {words}=fixture(),parts={},entry=supplementEntry(words[0],'');
 assert.throws(()=>origins.bindWordParts(words,parts,{entries:[]}),/Invalid word-parts/);
 assert.equal(origins.bindWordParts(words,parts,{schema:1,entries:[entry]}).stale,1);
 assert.deepEqual(parts,{});
});
const html=fs.readFileSync(path.join(root,'app/vocabulary-master.html'),'utf8');
test('main runtime syntax and two-column integration',()=>{
 for(const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(!match[1].trim()&&match[2].trim())new vm.Script(match[2]);
 assert.match(html,/語源系統\$\{arrow\('g'\)\}/);assert.match(html,/起源言語\$\{arrow\('originLanguages'\)\}/);
 assert.doesNotMatch(html,/F\.lang\b|data-lang=/);assert.match(html,/origin_families,origin_languages/);
 assert.match(html,/word-parts-supplement\.js/);assert.match(html,/EtymonOrigins\.bindWordParts\(WORDS,WORD_PARTS/);
});
test('actual toolbar handlers combine filters, update candidates and reset',()=>{
 const runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function renderToolbar()'))[2];
 const fn=name=>{
  const start=runtime.indexOf('function '+name+'(');
  assert.ok(start>=0,'Missing runtime function '+name);
  return runtime.slice(start,runtime.indexOf('\n}',start)+2);
 };
 // This small DOM adapter parses the real toolbar markup and invokes its real
 // event handlers. It is a Node integration test, not a browser/layout test.
 const nodes=new Map();let toolbarNodes=[];
 function node(attrs={}){
  return {dataset:Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase()),v])),attrs,
   onclick:null,onchange:null,click(){if(this.onclick)this.onclick();}};
 }
 const toolbar=node();Object.defineProperty(toolbar,'innerHTML',{
  set(value){this.markup=value;toolbarNodes=[];nodes.clear();nodes.set('toolbar',toolbar);
   for(const match of value.matchAll(/<(button|input|span|div|select)\b([^>]*)>/g)){
    const attrs=Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
    const element=node(attrs);toolbarNodes.push(element);if(attrs.id)nodes.set(attrs.id,element);
   }
  },get(){return this.markup;}
 });
 toolbar.querySelectorAll=selector=>{
  if(selector.startsWith('#tagPanel'))return [];
  const attr=selector.match(/^\[([^\]]+)\]$/)?.[1];
  return attr?toolbarNodes.filter(n=>Object.hasOwn(n.attrs,attr)):[];
 };
 nodes.set('toolbar',toolbar);
 const {words,payload}=fixture(),data=origins.prepare(payload);origins.bind(words,data);
 const context={window:{EtymonOrigins:origins,VocabularyComponentsUI:require('../../shared/vocabulary-components-ui.js')},console,F:{min:'',max:'',originFamilies:[],originLanguages:[],pos:'',comp:false,noroot:false,rootType:'',pic:'',tag:'',review:false,sortCol:'r',sortDir:1},
  componentDataError:'',componentCoverage:w=>({state:w.w==='sushi'?'attested_confirmed':'not_registered',confirmed_attested_lexical_count:w.w==='sushi'?1:0}),
  ORIGIN_DATA:data,originDataError:'',originPanelOpen:false,tagPanelOpen:false,mode:'words',q:'',limit:400,
  RAR_PRESETS:[['すべて','','']],POSES:[['','全品詞'],['名','名詞'],['形','形容詞']],
  POS_RANK:['名','動','形'],baseWords:()=>words,saveF:()=>{},tagLabel:x=>x,tagPanelHTML:()=>'',
  wLangs:origins.families,wOriginLanguages:origins.languages,
  document:{getElementById:id=>nodes.get(id)},$:selector=>nodes.get(selector.slice(1)),
  hasPieRoot:()=>false,hasGameTag:()=>false,generalDictIssue:()=>false,
 };
 context.renderTable=()=>{context.lastRows=context.applyFilters(words).map(w=>w.w).sort();};
 vm.createContext(context);
 vm.runInContext(runtime.match(/^const esc=.*$/m)[0]+'\n'+[
  'originFilterHTML','toggleOriginFamily','applyFilters','cmpBy','posKey','tableCountHTML','renderToolbar'
 ].map(fn).join('\n'),context);
 const click=(attr,value)=>{
  const target=toolbarNodes.find(n=>n.attrs[attr]===value);assert.ok(target,attr+'='+value);target.click();
 };
 const expect=names=>assert.deepEqual([...context.lastRows],names.slice().sort());
 context.renderToolbar();context.renderTable();assert.equal(context.lastRows.length,7);
 nodes.get('fOriginOpen').click();click('data-origin-family','ゲルマン');expect(['water','sky','beautiful']);
 assert.deepEqual(toolbarNodes.filter(n=>n.dataset.originLanguage).map(n=>n.dataset.originLanguage).sort(),['古ノルド語','古英語'].sort());
 click('data-origin-family','ロマンス');expect(['water','sky','beautiful','restaurant','television']);
 click('data-origin-language','古英語');expect(['water','beautiful']);
 click('data-origin-language','ラテン語');expect(['water','beautiful','television']);
 click('data-origin-family','ゲルマン');expect(['television']);assert.deepEqual([...context.F.originLanguages],['ラテン語']);
 nodes.get('fAllOriginFamilies').click();expect(['television']);
 nodes.get('fAllOriginLanguages').click();assert.equal(context.lastRows.length,7);
 click('data-origin-language','日本語');expect(['sushi']);
 nodes.get('fReset').click();click('data-pos','形');expect(['beautiful']);
 click('data-origin-family','ゲルマン');click('data-origin-language','古英語');expect(['beautiful']);
 nodes.get('fReset').click();assert.equal(context.lastRows.length,7);
 nodes.get('fRootType').onchange({target:{value:'attested'}});expect(['sushi']);
 click('data-origin-family','ゲルマン');expect([]);
 nodes.get('fReset').click();assert.equal(context.F.rootType,'');assert.equal(context.lastRows.length,7);
 assert.match(toolbar.markup,/語源/);assert.doesNotMatch(toolbar.markup,/語派/);
});
const summary={status:'passed',tests:tests.length,names:tests};
console.log(JSON.stringify(summary,null,2));
if(process.argv.includes('--browser-fixture')){
 const out=path.resolve(process.argv[process.argv.indexOf('--browser-fixture')+1]);fs.mkdirSync(out,{recursive:true});
 const {words,payload}=fixture();
 const data={words,roots:[{key:'fixture',pie:'fixture',ja:'試験',en:'fixture',dict:words.length}],affixes:[],word_parts:{},multilingual_answers:{entries:[]},illustration_scenes:{entries:[]}};
 let page=html.replace(/<script id="pieData"[^>]*>[\s\S]*?<\/script>/,`<script id="pieData" type="application/json">${JSON.stringify(data)}</script>`)
  .replace(/<script id="semanticData"[^>]*>[\s\S]*?<\/script>/,'<script id="semanticData" type="application/json">{"entries":[]}</script>')
  .replace(/<script src="data\/generated-etymon\/etymology-origins.js[^>]*><\/script>/,`<script>globalThis.ETYMON_ETYMOLOGY_ORIGINS=${JSON.stringify(payload)};</script>`)
  .replace('<head>','<head><base href="file:///'+root.replace(/\\/g,'/')+'/app/">');
 const browserTest=String.raw`
window.addEventListener('etymon:ready',()=>{
 const results=[];
 const check=(name,fn)=>{try{fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:String(e)});}};
 const eq=(actual,expected)=>{if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error(JSON.stringify({actual,expected}));};
 const click=selector=>{const el=document.querySelector(selector);if(!el)throw Error('Missing '+selector);el.click();};
 const rows=()=>[...document.querySelectorAll('#tblBody>tr')].map(tr=>WORDS[Number(tr.dataset.i)].w).sort();
 const expect=names=>eq(rows(),names.slice().sort());
 check('initial rows and independent data columns',()=>{click('#navWords');eq(document.querySelectorAll('th.cLang').length,1);eq(document.querySelectorAll('th.cOriginLanguage').length,1);eq(rows().length,7);});
 check('first hierarchy candidate restriction',()=>{click('#fOriginOpen');click('[data-origin-family="ゲルマン"]');expect(['water','sky','beautiful']);eq([...document.querySelectorAll('[data-origin-language]')].map(x=>x.dataset.originLanguage).sort(),['古ノルド語','古英語'].sort());});
 check('multiple family OR',()=>{click('[data-origin-family="ロマンス"]');expect(['water','sky','beautiful','restaurant','television']);});
 check('language AND family',()=>{click('[data-origin-language="古英語"]');expect(['water','beautiful']);});
 check('multiple language OR',()=>{click('[data-origin-language="ラテン語"]');expect(['water','beautiful','television']);});
 check('hidden incompatible language clears after family removal',()=>{click('[data-origin-family="ゲルマン"]');expect(['television']);eq(F.originLanguages,['ラテン語']);});
 check('clear one hierarchy preserves the other',()=>{click('#fAllOriginFamilies');expect(['television']);click('#fAllOriginLanguages');eq(rows().length,7);});
 check('individual-language selection without a family',()=>{click('[data-origin-language="日本語"]');expect(['sushi']);});
 check('existing part-of-speech filter combines and reset clears all',()=>{click('#fReset');click('[data-pos="形"]');expect(['beautiful']);click('[data-origin-family="ゲルマン"]');click('[data-origin-language="古英語"]');expect(['beautiful']);click('#fReset');eq(rows().length,7);});
 check('CSV includes both independent origin columns',()=>{const row=WORDS.find(w=>w.w==='beautiful');memos[EtymonLexicalIdentity.memoKey(row)]={note:'fixture note'};const csv=sheetCSV();if(!csv.includes('origin_families,origin_languages')||!csv.includes('ロマンス|ゲルマン')||!csv.includes('古フランス語|古英語'))throw Error('Missing origin columns');});
 const box=document.createElement('pre');box.id='origin-test-results';box.textContent=JSON.stringify({status:results.every(x=>x.passed)?'passed':'failed',tests:results.length,results});document.body.prepend(box);
 document.documentElement.dataset.originTests=results.every(x=>x.passed)?'passed':'failed';
});`;
 page=page.replace('</body>',`<script>${browserTest}</script></body>`);
 fs.writeFileSync(path.join(out,'origin-filter.fixture.html'),page);
 fs.writeFileSync(path.join(out,'unit-tests.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('Browser fixture: '+path.join(out,'origin-filter.fixture.html'));
}
