const test=require('node:test');
const assert=require('node:assert/strict');
const {resolveFamilyTags}=require('../app/shared/explorer-difficulty-v2.js');
const fs=require('node:fs');
const path=require('node:path');
const components=require('../app/shared/etymological-components.js');
const componentsUI=require('../app/shared/vocabulary-components-ui.js');
test('family rendering rejects memo prose, source labels and arbitrary fallback text',()=>{
 assert.deepEqual(resolveFamilyTags({g:'Wt',gs:[],b:'古英語 steam は熱い蒸気'},'G L'),[]);
 assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'G L'),[]);
 assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'古英語 steam'),[]);
});
test('family rendering preserves canonical hybrid order and filters invalid codes',()=>{
 assert.deepEqual(resolveFamilyTags({g:'G',gs:['G','Wt','G']}),['G']);
 assert.deepEqual(resolveFamilyTags({g:'L',gs:['Gr','L']}),['Gr','L']);
 assert.deepEqual(resolveFamilyTags({g:'G',gs:['古英語']}),['G']);
});
test('family whitelist handles source language codes beyond the three main families',()=>{
 for(const code of ['Ce','Ir','J','Ch','Ko','Tu','Ar','He','Ma','Na','Am','Po','Dr','Ur','Ba','Af','Ot'])assert.deepEqual(resolveFamilyTags({g:code}),[code]);
 for(const code of ['__proto__','constructor','toString','EO','Wt','steam'])assert.deepEqual(resolveFamilyTags({g:code}),[]);
});

test('exported composition uses component meanings rather than the complete word story',()=>{
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 const entry=(w,p)=>parts[JSON.stringify([w,p])];
 assert.equal(entry('disorder','dwis-+ar-'),'dis（否定）＋order（秩序）');
 assert.equal(entry('discourse','dwis-+kers-2'),'dis（離れて）＋course（走る）');
 assert.equal(entry('unexpected','ne+eghs+spek-'),'un（否定）＋ex（十分に）＋pect（観察する）＋ed（〜した）');
});

test('direct Greek references and restored Greek word components retain their provenance',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const words=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/words.json'),'utf8'));
 assert.equal(roots.find(r=>r.key==='gē').kind,'greek_lemma');
 assert.equal(roots.find(r=>r.key==='sed-2').kind,'unverified_reconstruction');
 assert.equal(roots.find(r=>r.key==='(s)kai-1').alias_target,'keit-');
 assert.deepEqual(words.find(w=>w.w==='cataclysm').p,['kat-','kleuə-']);
 assert.deepEqual(words.find(w=>w.w==='anarthrous').p,['ne','ar-']);
 assert.deepEqual(words.find(w=>w.w==='enarthrosis').p,['en','ar-']);
 assert.deepEqual(words.find(w=>w.w==='dendrite').p,['deru-']);
 assert.deepEqual(words.find(w=>w.w==='dendrochronology').p,['deru-','leg-']);
 assert.deepEqual(words.find(w=>w.w==='variable').p,[]);
 assert.deepEqual(words.find(w=>w.w==='wart').p,['wer-1']);
 assert.equal(roots.find(r=>r.key==='am-').kind,'unverified_reconstruction');
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 assert.equal(parts[JSON.stringify(['dendrochronology','deru-+leg-'])],'dendro（木）＋chrono（時間）＋logy（学問）');
});

test('shared root explanation connects the registered semantic branches',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const spek=roots.find(r=>r.key==='spek-');
 const dis=roots.find(r=>r.key==='dwis-');
 assert.match(spek.d,/観察する/);
 assert.match(spek.d,/「見る・観察する」が基本/);
 assert.match(spek.d,/expect は「よく見る」から待ち望む意味/);
 assert.doesNotMatch(spek.d,/pect(?:自体|単独|だけ)の意味は「待つ」/);
 assert.match(dis.d,/離れて/);
 assert.match(dis.d,/否定/);
});

test('a known direct-language decomposition remains visible with zero or one PIE root',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 const vm=require('node:vm');
 const code=html.match(/^function wordParts\([^]*?^}/m)[0];
 const context={WORD_PARTS:parts,COMPONENTS:null,esc:s=>String(s)};vm.createContext(context);vm.runInContext(code,context);
 assert.equal(context.wordParts({w:'normal',p:[]},true),'<div class="wordParts"><b>語源計算式</b><span>norm（基準）＋al（〜に関する）</span></div>');
 assert.equal(context.wordParts({w:'mission',p:[]}),'<div class="wordParts"><span>miss（送る）＋ion（こと）</span></div>');
 assert.match(context.wordParts({w:'transmit',p:['terə-2']}),/mit（送る）/);
 assert.equal(context.wordParts({w:'unreviewed-word',p:['a','b']}),'');
});

test('an attested Latin lemma is not presented as a reconstructed PIE root',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const words=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/words.json'),'utf8'));
 const lemma=roots.find(r=>r.key==='mittere');
 assert.equal(lemma.kind,'latin_lemma');assert.equal(lemma.all,0);
 assert.equal(words.filter(w=>w.p.includes('mittere')).length,0);
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const code=html.match(/^function rootLabel\([^]*?^}/m)[0];
 const vm=require('node:vm');const context={};vm.createContext(context);vm.runInContext(code,context);
 assert.equal(context.rootLabel(lemma),'ラテン語 mittere');
 assert.equal(context.rootLabel({key:'gnō-'}),'*gnō-');
});

test('the signum branch, away and inherited inspectorate roots use the corrected identities',()=>{
 const words=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/words.json'),'utf8'));
 const word=w=>words.find(r=>r.w===w);
 assert.deepEqual(word('design').p,['de-','sekʷ-1']);
 assert.deepEqual(word('insignificance').p,['ne','sekʷ-1','dhē-']);
 assert.deepEqual(word('away').p,['an-','wegh-']);
 assert.deepEqual(word('inspectorate').p,['en','spek-']);
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 assert.equal(parts[JSON.stringify(['important','en+per-2'])],'im（中に）＋port（運ぶ）＋ant（〜している）');
});

test('contested add ancestry and templum meanings preserve the exact lexical records',()=>{
 const words=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/words.json'),'utf8'));
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 for(const name of ['add','addendum','addition','additional','additionally']){
  const matches=words.filter(w=>w.w===name);
  assert.equal(matches.length,1);
  assert.deepEqual(matches[0].p,['ad-']);
 }
 const added=words.filter(w=>w.w==='added');
 assert.equal(added.length,2);
 assert.ok(added.some(w=>w.p.length===0));
 assert.ok(added.some(w=>JSON.stringify(w.p)===JSON.stringify(['ad-'])));
 assert.equal(parts[JSON.stringify(['add','ad-'])],'ad（〜へ）＋d（置く）');
 assert.equal(parts[JSON.stringify(['add','ad-+dō-'])],undefined);
 assert.equal(parts[JSON.stringify(['contemplate','kom+temə-1'])],'con（十分に）＋templ（占いのための場所）＋ate（〜する・〜にする）');
 assert.doesNotMatch(parts[JSON.stringify(['contemplate','kom+temə-1'])],/場所を見る/);
});

test('attested Latin and Greek references are labelled consistently in titles and word chips',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const words=roots.map(r=>({w:r.key,p:[r.key]})),mixed={w:'mixed-fixture',p:['autos','men-1']},empty={w:'empty-fixture',p:[]};
 const prepared=components.prepare({schema:1,entities:[],words:[],aliases:[]},roots);
 const vm=require('node:vm');const context={ROOT_BY:new Map(roots.map(r=>[r.key,r])),esc:s=>String(s),window:{VocabularyComponentsUI:componentsUI},COMPONENTS:components.bind([...words,mixed,empty],prepared)};
 vm.createContext(context);
 vm.runInContext(html.match(/^function componentCoverage\([^]*?^function hasPieRoot\([^]*?^}/m)[0],context);
 for(const name of ['rootLabel','rootChip','eoTag']){
  vm.runInContext(html.match(new RegExp('^function '+name+'\\([^]*?^}','m'))[0],context);
 }
 for(const [key,label] of [['gerere','ラテン語'],['autos','ギリシャ語'],['servus','ラテン語'],['bassus','ラテン語'],['plumbum','ラテン語'],['angelos','ギリシャ語'],['ferrum','ラテン語'],['asinus','ラテン語'],['kannabis','ギリシャ語'],['philos','ギリシャ語']]){
  const r=context.ROOT_BY.get(key);
  assert.match(context.rootLabel(r),new RegExp('^'+label+' '));
  assert.ok(!context.rootChip(key).includes('*'+key));
  assert.match(context.rootChip(key),new RegExp(label+' '+key));
  assert.equal(context.eoTag({...r,eo:'different'}),'');
  assert.equal(context.hasPieRoot(words.find(w=>w.w===key)),false);
 }
 assert.match(context.rootChip('gnō-'),/\*gnō-|\*gnō-/);
 assert.equal(context.hasPieRoot(mixed),true);
 assert.equal(context.hasPieRoot(empty),false);
 assert.match(html,/>PIE\$\{arrow\('p'\)\}/);
});

test('doubtful gno links do not appear in PIE membership or character explanations',()=>{
 const words=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/words.json'),'utf8'));
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 for(const name of ['enormity','norm','normal','note','notable']){
  const word=words.find(w=>w.w===name);
  assert.ok(!word.p.includes('gnō-'));
  assert.equal(word.root_relations,undefined);
 }
 for(const name of ['know','noble','notice','chirognomy'])assert.ok(words.find(w=>w.w===name).p.includes('gnō-'));
 assert.deepEqual(words.find(w=>w.w==='enormity').p,['eghs']);
 assert.deepEqual(words.find(w=>w.w==='norm').p,[]);
 const gno=roots.find(r=>r.key==='gnō-');
 assert.deepEqual(words.find(w=>w.w==='chirognomy').p,['ghes-','gnō-']);
 assert.equal(gno.all,67);
 assert.equal(words.filter(w=>w.p.includes('gnō-')).length,67);
 assert.equal(gno.uncertain,undefined);
 assert.doesNotMatch(gno.d,/norma|nota|enormity|規則|直角定規/);
 assert.doesNotMatch(gno.d,/\d+語/);
});


test('wordParts uses the authoritative spelling caption and never falls back to ancestry prose',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const code=html.match(/^function wordParts\([^]*?^}/m)[0];
 const vm=require('node:vm');
 const context={WORD_PARTS:{},esc:s=>String(s),COMPONENTS:{hasAssemblyAncestryDisplay:()=>true,boundAssemblyCaption:()=> 'reviewed ancestry',directAssemblyCaption:()=> 'direct material'}};
 vm.createContext(context);vm.runInContext(code,context);
 const word={w:'fixture',p:[]};
 assert.equal(context.wordParts(word),'');
 context.WORD_PARTS[JSON.stringify(['fixture',''])]='fix（固定する）＋ture（こと）';
 assert.match(context.wordParts(word),/fix（固定する）＋ture（こと）/);
 assert.doesNotMatch(context.wordParts(word),/reviewed ancestry|direct material/);
 context.COMPONENTS=null;
 assert.match(context.wordParts(word),/fix（固定する）＋ture（こと）/);
});

test('en explanation gives concrete negative-prefix examples and separates ne ancestry',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const text=roots.find(r=>r.key==='en').d;
 assert.match(text,/incorrect（正しくない）の in-/);
 assert.match(text,/impossible（不可能な）の im-/);
 assert.match(text,/こちらは \*ne に由来し、「中に」を表す \*en とは別系統/);
});

test('reviewed compound batch preserves exact spelling, genitive and plural distinctions',()=>{
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 const expected={"[\"policeman\",\"\"]": "police（警察）＋man（人）", "[\"businessman\",\"\"]": "busi（忙しい）＋ness（状態）＋man（人）", "[\"salesman\",\"\"]": "sale（販売）＋s（属格の語尾）＋man（人）", "[\"saleswoman\",\"\"]": "sale（販売）＋s（属格の語尾）＋woman（女性）", "[\"snowball\",\"\"]": "snow（雪）＋ball（球）", "[\"snowflake\",\"\"]": "snow（雪）＋flake（薄い小片）", "[\"windshield\",\"\"]": "wind（風）＋shield（盾）", "[\"skateboard\",\"\"]": "skate（滑る）＋board（板）", "[\"surfboard\",\"\"]": "surf（砕ける波）＋board（板）", "[\"housekeeper\",\"\"]": "house（家）＋keep（保つ）＋er（人・もの）", "[\"haircut\",\"\"]": "hair（髪）＋cut（切ること）", "[\"footprint\",\"\"]": "foot（足）＋print（押した跡）", "[\"playmate\",\"\"]": "play（遊ぶ）＋mate（仲間）", "[\"teamwork\",\"\"]": "team（組）＋work（仕事）", "[\"countryside\",\"\"]": "country（土地）＋side（地域）", "[\"seagull\",\"\"]": "sea（海）＋gull（カモメ）", "[\"seafood\",\"pā-\"]": "sea（海）＋food（食べ物）", "[\"waterfront\",\"\"]": "water（水）＋front（前面）", "[\"waterway\",\"\"]": "water（水）＋way（道）", "[\"underwater\",\"\"]": "under（〜の下に）＋water（水）", "[\"underground\",\"\"]": "under（〜の下に）＋ground（地面）", "[\"overhead\",\"\"]": "over（〜の上に）＋head（頭）", "[\"downstairs\",\"\"]": "down（下へ）＋stair（階段）＋s（複数）", "[\"upstairs\",\"\"]": "up（上へ）＋stair（階段）＋s（複数）", "[\"downtown\",\"dheuə-\"]": "down（下へ）＋town（町）", "[\"laptop\",\"\"]": "lap（座った人の膝）＋top（上面）", "[\"password\",\"\"]": "pass（通る）＋word（言葉）"};
 for(const [key,caption]of Object.entries(expected))assert.equal(parts[key],caption,key);
});

function formulaDisplayFixture(){
 const vm=require('node:vm');
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const start=html.indexOf('function wordParts('),end=html.indexOf('function rootLabel(',start);
 assert(start>=0&&end>start,'wordParts renderer must be extracted from the actual HTML');
 const context={WORD_PARTS:{},esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.createContext(context);vm.runInContext(html.slice(start,end),context);
 const word={w:'fixture',p:[]};
 return {render:(text,labeled=false)=>{context.WORD_PARTS[JSON.stringify(['fixture',''])]=text;return context.wordParts(word,labeled);},esc:context.esc};
}
test('formula column omits origin prose but preserves its full body under the correct detail label',()=>{
 const {render,esc}=formulaDisplayFixture();
 const prose=[
  'ラテン語の語形に由来：dēlīneāre（輪郭を描く）',
  '古英語 wæter（水）を継承',
  '古フランス語 forme（形）を一語として借用',
  '確認できたラテン語起源：industria（勤勉・活動）',
  '英語 win（勝つ）の過去形・過去分詞',
  'フランス語のcafé（コーヒー・喫茶店）←caffè（コーヒー）←qahve（コーヒー）←qahwa（コーヒー）〔同じ語の借用経路。内部の分解は未確認〕'
 ];
 for(const text of prose){
  assert.equal(render(text),'');
  assert.equal(render(text,true),'<div class="wordParts"><b>語形・由来</b><span>'+esc(text)+'</span></div>');
 }
});
test('formula renderer preserves component equations and single-form glosses without inventing missing expressions',()=>{
 const {render,esc}=formulaDisplayFixture();
 for(const text of ['dis（否定）＋order（秩序）','ne（否定）＋語形（語源説明）','part（由来）＋part（借用）','a + b','a＝b','dog（犬）','sushi（すし）']){
  assert.equal(render(text),'<div class="wordParts"><span>'+esc(text)+'</span></div>');
  assert.equal(render(text,true),'<div class="wordParts"><b>語源計算式</b><span>'+esc(text)+'</span></div>');
 }
 for(const missing of [undefined,null,'']){assert.equal(render(missing),'');assert.equal(render(missing,true),'');}
 const unsafe='ラテン語の語形に由来：<x & "y">';
 assert.equal(render(unsafe),'');assert(!render(unsafe,true).includes('<x'));assert(render(unsafe,true).includes('&lt;x &amp; &quot;y&quot;&gt;'));
});
test('formula column tooltip describes expressions and separates origin explanations',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 assert.match(html,/<th class="cParts" title="綴りに対応する部品と意味の式。未整備は空欄です。借用元の説明は詳細に表示します。">語源計算式<\/th>/);
});
