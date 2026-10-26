const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {parseHTML}=require('linkedom');
const rootDir=path.resolve(__dirname,'../..');
const overlay=fs.readFileSync(path.join(rootDir,'app/shared/explorer-difficulty-v2.js'),'utf8');
const explorer=fs.readFileSync(path.join(rootDir,'app/etymon-explorer.html'),'utf8');
const identity=require('../../app/shared/lexical-identity.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));

function nativeTable(words,{extra=false,spaced=false,sheet=false}={}){
 const columns=[['cPic','絵'],['cW','単語'],['cK','カナ'],['cR','レア度'],['cJa','語義'],['cEn','パラフレーズ'],['cRoots','印欧祖語'],['cParts','ことばの組み立て'],['cDef','語源ひとことメモ'],['cLang',spaced?' 語 \n 派 ':'語派'],['cPos','品詞'],['cMemo','メモ']];
 if(extra)columns.splice(7,0,['unrelated','別の列']);
 if(sheet)columns.push(['cMemo','意味タグ']);
 const row=(w,i)=>'<tr data-i="'+i+'">'+columns.map(([cls])=>{
  const text={cW:w.w+'<button class="spk" data-say="'+w.w+'">🔊</button>',cJa:w.ja,cEn:w.en,cDef:w.b,cLang:'古英語 steam は 熱い蒸気',cPos:w.pos,cR:'30',unrelated:'無関係'}[cls]||'';
  return '<td class="'+cls+'">'+text+'</td>';
 }).join('')+'</tr>';
 return '<table><thead><tr>'+columns.map(([cls,label])=>'<th class="'+cls+'">'+label+'</th>').join('')+'</tr></thead><tbody>'+words.map(row).join('')+'</tbody></table>';
}

async function fixture(words,options={}){
 const {window}=parseHTML('<html><head></head><body><div id="tableWrap">'+nativeTable(words,options)+'</div></body></html>');
 const capturedRows=[],observers=[];let observations=0;
 const NativeObserver=window.MutationObserver;
 const Observer=class extends NativeObserver {constructor(fn){super(records=>{observations++;if(observations>30)throw Error('non-settling overlay observer');fn(records);});observers.push(this);}};
 const context={document:window.document,WORDS:words,URL,queueMicrotask,MutationObserver:Observer,
  console:{warn(){}},addEventListener(){},ETYMON_WEBLIO_LEVELS:{entries:[]},ETYMON_LEARNING_LEVELS:{entries:[]},
  EtymonSpellingEligibility:{evaluate(row){capturedRows.push(row);return {eligible:true,reason:'fixture'};}}};
 context.globalThis=context;vm.runInNewContext(overlay,context);
 await tick();await tick();
 return {context,document:window.document,capturedRows,observations:()=>observations,cleanup:()=>observers.forEach(o=>o.disconnect())};
}

const steam={w:'steam',p:[],pos:'名/動',ja:'蒸気',en:'vapor',b:'古英語で立ちのぼる蒸気を表した。',g:'G',gs:['G']};
const television={w:'television',p:['kwekw-'],pos:'名',ja:'テレビ',en:'TV',b:'遠くを見るという語の組み合わせ。',g:'Gr',gs:['Gr','L']};

test('column insertion, removed metrics and whitespace headers never move tags into the memo',async(t)=>{
 const f=await fixture([steam,television],{extra:true,spaced:true,sheet:true});
 t.after(f.cleanup);
 const rows=[...f.document.querySelectorAll('tbody tr')];
 assert.equal(rows[0].querySelector('td.cDef').textContent,steam.b);
 assert.equal(rows[1].querySelector('td.cDef').textContent,television.b);
 assert.deepEqual([...rows[0].querySelectorAll('td.cLang [data-family]')].map(n=>n.dataset.family),['G']);
 assert.deepEqual([...rows[1].querySelectorAll('td.cLang [data-family]')].map(n=>n.dataset.family),['Gr','L']);
 assert.equal(rows[0].querySelector('td.unrelated').textContent,'無関係');
 assert.equal(rows[0].querySelector('td.cR'),null);
 assert.equal(rows[0].children.length,f.document.querySelector('thead tr').children.length);
 assert.deepEqual(JSON.parse(JSON.stringify(f.capturedRows[0])),{w:'steam',pos:'名/動',ja:'蒸気',en:'vapor'});
});

test('new pagination chunks and a replaced sort/filter table receive exactly one enhancement',async(t)=>{
 const f=await fixture([steam]);
 t.after(f.cleanup);
 const first=f.document.querySelector('tbody tr');
 const rowHTML=nativeTable([television]).match(/<tbody>(.*)<\/tbody>/s)[1].replace('data-i="0"','data-i="1"');
 f.context.WORDS.push(television);
 f.document.querySelector('tbody').insertAdjacentHTML('beforeend',rowHTML);
 const incoming=f.document.querySelector('tr[data-i="1"]');
 await tick();await tick();
 assert.equal(incoming.querySelectorAll('td.difficulty-v2-col').length,1);
 assert.equal(first.querySelectorAll('td.difficulty-v2-col').length,1);
 assert.equal(incoming.querySelector('td.cDef').textContent,television.b);
 f.context.WORDS=[television,steam];
 f.document.getElementById('tableWrap').innerHTML=nativeTable([television,steam],{extra:true});
 await tick();await tick();
 for(const row of f.document.querySelectorAll('tbody tr')){
  assert.equal(row.querySelectorAll('td.difficulty-v2-col').length,1);
  assert.equal(row.querySelectorAll('td.cLang .ety-family-tags').length,1);
 }
 const count=f.observations();await tick();await tick();
 assert.equal(f.observations(),count,'no idle mutation loop');
});

test('invalid family metadata clears stale prose only in the language cell',async(t)=>{
 const w={...steam,g:'Wt',gs:['古英語','steam']};
 const f=await fixture([w]);
 t.after(f.cleanup);
 assert.equal(f.document.querySelector('td.cLang').textContent,'未確認');
 assert.equal(f.document.querySelector('td.cDef').textContent,steam.b);
 assert.equal(f.document.querySelector('td.cLang .ety-family-tag'),null);
});

test('native rendering uses only the source memo and marks absent memos',()=>{
 const body=explorer.slice(explorer.indexOf('function rowHTML(w){'),explorer.indexOf('function renderTable(){'));
 const context={window:{EtymonLexicalIdentity:identity},WORDS:[steam],memos:{},mode:'words',
  memoOf:()=>({}),esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  wordImageHTML:()=>'',semanticLine:()=>'',rootChip:()=>'',wordParts:()=>'',langTags:()=>'',affixChips:()=>'',gameTagCell:()=>''};
 vm.runInNewContext(body+';globalThis.renderRow=rowHTML;',context);
 const {document}=parseHTML('<table><tbody>'+context.renderRow({...steam,i:0,pre:'',suf:''})+context.renderRow({...steam,i:1,b:'',pre:'',suf:''})+'</tbody></table>');
 assert.equal(document.querySelectorAll('td.cDef')[0].textContent,steam.b);
 assert.equal(document.querySelectorAll('td.cDef')[1].textContent,'語源メモ未登録');
 assert.equal(document.querySelector('td.cDef .ety-family-tag'),null);
});

test('memo clicks leave details closed while the headword still opens details',()=>{
 const handler=explorer.slice(explorer.indexOf("wrapEl.addEventListener('click',e=>{"),explorer.indexOf("wrapEl.addEventListener('input',e=>{"));
 const {window}=parseHTML('<div id="tableWrap"><table><tbody><tr data-i="0"><td class="cW">steam</td><td class="cDef"><div class="txt blurb">'+steam.b+'</div></td></tr></tbody></table></div>');
 const wrapEl=window.document.getElementById('tableWrap');let opened=0;
 vm.runInNewContext(handler,{wrapEl,F:{},toggleDetail(){opened++;}});
 window.document.querySelector('td.cDef .txt').dispatchEvent(new window.Event('click',{bubbles:true}));
 assert.equal(opened,0);
 window.document.querySelector('td.cW').dispatchEvent(new window.Event('click',{bubbles:true}));
 assert.equal(opened,1);
});

function csvImporter(words,memos){
 const body=explorer.slice(explorer.indexOf('function loadSheetCSV(text){'),explorer.indexOf('function sheetCSV(){'));
 const context={window:{EtymonLexicalIdentity:identity},WORDS:words,memos};
 vm.runInNewContext(body,context);return context.loadSheetCSV;
}

test('blank CSV notes clear unique legacy spelling notes without fallback resurrection',()=>{
 const memos={steam:{tag:'old tag',note:'old note'}};
 const load=csvImporter([steam],memos);
 assert.equal(identity.memoFor(steam,memos,[steam])?.note,'old note');
 load('word,tag,note\nsteam,,\n');
 assert.equal(memos.steam,undefined);
 assert.equal(identity.memoFor(steam,memos,[steam]),null);
});

test('CSV note migration replaces unique legacy notes and later deletion remains clear',()=>{
 const memos={steam:{note:'old note'}},words=[steam],load=csvImporter(words,memos);
 assert.equal(load('word,tag,note\nsteam,new tag,new note\n'),1);
 assert.equal(memos.steam,undefined);
 assert.equal(identity.memoFor(steam,memos,words).note,'new note');
 load('word,tag,note\nsteam,,\n');
 assert.equal(identity.memoFor(steam,memos,words),null);
});

test('CSV clearing one homograph preserves legacy history and another origin note',()=>{
 const fish={w:'roach',p:[],etymology_id:'roach-fish'},insect={w:'roach',p:[],etymology_id:'roach-cockroach'};
 const legacy={note:'unassigned old note'},other={note:'insect note'};
 const memos={roach:legacy,[identity.memoKey(fish)]:{note:'fish note'},[identity.memoKey(insect)]:other};
 csvImporter([fish,insect],memos)('word,roots,etymology_id,tag,note\nroach,,roach-fish,,\n');
 assert.equal(identity.memoFor(fish,memos,[fish,insect]),null);
 assert.equal(identity.memoFor(insect,memos,[fish,insect]),other);
 assert.equal(memos.roach,legacy);
});

test('native family sorting and filters share the same whitelist and hybrid tags',()=>{
 const native=explorer.slice(explorer.indexOf('function wLangs(w){'),explorer.indexOf('/* 印欧祖語のチップ。'));
 const context={window:{EtymonLexicalIdentity:identity}};vm.runInNewContext(native,context);
 assert.deepEqual([...context.wLangs(television)],['Gr','L']);
 assert.deepEqual([...context.wLangs({...steam,g:'Wt',gs:['古英語']})],[]);
 assert.equal(identity.familyMatches(television,'L'),true);
 assert.equal(identity.familyMatches({...steam,g:'Wt',gs:['古英語']},'x'),false);
});

test('all inline Explorer JavaScript parses after data and memo changes',()=>{
 let checked=0;
 for(const script of explorer.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(/\bsrc\s*=/.test(script[1])||/\btype\s*=/.test(script[1]))continue;
  new vm.Script(script[2],{filename:'etymon-explorer.html:inline-'+checked});checked++;
 }
 assert.ok(checked>0);
});

test('tag styles override the native white span text and mobile CSS keeps both columns reachable',()=>{
 assert.match(overlay,/td\.cLang \.ety-family-tag\{[^}]*color:#284866/);
 assert.match(overlay,/td\.cLang \.ety-family-tag\[data-family="G"\]\{[^}]*color:#24643b/);
 const styles=explorer.slice(0,explorer.indexOf('</style>'));
 for(const rule of styles.matchAll(/([^{}]+)\{[^{}]*display:none[^{}]*\}/g))assert.doesNotMatch(rule[1],/\.cLang\b|\.cDef\b/);
 assert.doesNotMatch(explorer,/td\.cDef \.txt\{[^}]*cursor:pointer/);
});
