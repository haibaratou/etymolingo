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

const ui=require('../app/shared/vocabulary-components-ui.js');
function fixture(){
 const entity={id:'shared-men',kind:'pie_reconstruction',form:'*men-',meaning:'考える',language:'印欧祖語',status:'individually_confirmed',evidence:[]};
 const ref={id:entity.id,entity_id:entity.id,key:'component:'+entity.id,kind:entity.kind,form:entity.form,language:entity.language,entity};
 const makeWord=(w,p)=>({w,p,ja:'意味',en:'meaning',pos:'名',b:''});
 const current=makeWord('automatic',['men-1']),proof=makeWord('automation',['men-1']);
 const meta=w=>({w:w.w,p:[...w.p],word_guard:{ja:w.ja,en:w.en,pos:w.pos,b:w.b}});
 const metas=new Map([[current,meta(current)],[proof,meta(proof)]]),links=new Map([[current,[]],[proof,['men-1']]]);
 const info=key=>({type:'pie_registered',kind:'',form:key,origin_language:'',meaning:key==='men-1'?'考える':'突出する'});
 const api={coverage:()=>({guard_valid:true,state:'pie_confirmed'}),annotations:w=>metas.get(w),rootRefs:()=>[ref],byEntity:()=>[current,proof],legacyInfo:info,bindingStale:()=>[],entity:id=>id===entity.id?entity:null,wordLineages:w=>[{id:'line',confirmed:true,uncertain_edges:0,terminal_entity:entity,deepest_confirmed_ref:entity.id,confirmed_path_refs:[entity.id],legacy_root_keys:links.get(w)||[]}]};
 const render=key=>'<span class="chip" data-k="'+key+'">*'+key+'</span>';
 return {api,current,proof,metas,links,ref,render,meta};
}
test('PIE dedup uses a shared explicit guarded terminal mapping and preserves broad legacy navigation',()=>{
 const f=fixture(),h=ui.rootCell(f.api,f.current,f.render);
 assert(h.includes('data-k="men-1"'));assert(!h.includes('data-k="component:shared-men"'));
 assert.equal((h.match(/class="chip/g)||[]).length,1);
});
test('similar spelling, matching meaning and homonym numbering alone never merge PIE roots',()=>{
 const f=fixture();f.links.set(f.proof,[]);
 let h=ui.rootCell(f.api,f.current,f.render);assert(h.includes('data-k="component:shared-men"'));assert(h.includes('data-k="men-1"'));
 f.links.set(f.proof,['men-1']);f.current.p=['men-1','men-2'];f.metas.set(f.current,f.meta(f.current));
 h=ui.rootCell(f.api,f.current,f.render);assert(h.includes('data-k="men-1"'));assert(h.includes('data-k="men-2"'));assert(!h.includes('data-k="component:shared-men"'));
});
test('conflicting or multiple explicit legacy targets keep the confirmed PIE tag',()=>{
 const f=fixture();f.links.set(f.current,['men-2']);f.current.p.push('men-2');f.metas.set(f.current,f.meta(f.current));
 assert(ui.rootCell(f.api,f.current,f.render).includes('data-k="component:shared-men"'));
 f.links.set(f.current,[]);f.links.set(f.proof,['men-1','men-2']);
 assert(ui.rootCell(f.api,f.current,f.render).includes('data-k="component:shared-men"'));
});
test('missing, unresolved or blocked legacy display never removes the confirmed PIE tag',()=>{
 for(const mode of ['missing','unresolved','blocked']){
  const f=fixture();
  if(mode==='missing'){f.current.p=[];f.metas.set(f.current,f.meta(f.current));}
  if(mode==='unresolved')f.api.legacyInfo=()=>null;
  if(mode==='blocked')f.api.bindingStale=w=>w===f.current?[{root_key:'men-1'}]:[];
  const h=ui.rootCell(f.api,f.current,f.render);assert(h.includes('data-k="component:shared-men"'),mode);
 }
});
test('stale, mutated or uncertain proof words cannot establish display identity',()=>{
 for(const mode of ['coverage','mutation','uncertain','blocked','wrong-terminal']){
  const f=fixture();
  if(mode==='coverage')f.api.coverage=w=>({guard_valid:w!==f.proof,state:'pie_confirmed'});
  if(mode==='mutation')f.proof.ja='changed';
  if(mode==='blocked')f.api.bindingStale=w=>w===f.proof?[{root_key:'men-1'}]:[];
  if(mode==='uncertain'||mode==='wrong-terminal'){const lines=f.api.wordLineages;f.api.wordLineages=w=>lines(w).map(l=>({...l,...(w===f.proof?(mode==='uncertain'?{uncertain_edges:1}:{deepest_confirmed_ref:'other'}):{})}));}
  assert(ui.rootCell(f.api,f.current,f.render).includes('data-k="component:shared-men"'),mode);
 }
});
test('dedup remains safe without an entity-members index and does not mutate input data',()=>{
 const f=fixture(),before=JSON.stringify([f.current,f.proof,f.ref]);delete f.api.byEntity;
 assert(ui.rootCell(f.api,f.current,f.render).includes('data-k="component:shared-men"'));
 f.links.set(f.current,['men-1']);assert(!ui.rootCell(f.api,f.current,f.render).includes('data-k="component:shared-men"'));
 assert.equal(JSON.stringify([f.current,f.proof,f.ref]),before);
});

function mixedSourceFixture(){
 const word={w:'mixed',p:['men-1'],ja:'意味',en:'meaning',pos:'名',b:''};
 const pie={id:'pie',kind:'pie_reconstruction',form:'*men-',meaning:'考える',language:'印欧祖語',status:'individually_confirmed'};
 const auto={id:'greek-auto',kind:'attested_lexeme',form:'autós',meaning:'自分自身',language:'古代ギリシャ語',status:'dictionary_attested'};
 const refs=[pie,auto].map((entity,i)=>({id:entity.id,entity_id:entity.id,key:'component:'+entity.id,entity,kind:entity.kind,form:entity.form,language:entity.language,role:i?'formative':'lexical',lineage_id:i?'auto-line':'pie-line'}));
 const lines=refs.map(ref=>({id:ref.lineage_id,role:ref.role,confirmed:true,uncertain_edges:0,deepest_confirmed_ref:ref.entity.id,terminal_entity:ref.entity,confirmed_path_refs:[ref.entity.id],legacy_root_keys:[]}));
 const meta={w:word.w,p:[...word.p],word_guard:{ja:word.ja,en:word.en,pos:word.pos,b:word.b}};
 const api={coverage:()=>({guard_valid:true,state:'pie_confirmed'}),annotations:()=>meta,rootRefs:()=>refs,wordLineages:()=>lines,bindingStale:()=>[],entity:id=>[pie,auto].find(e=>e.id===id),legacyInfo:key=>({type:'pie_registered',form:key,kind:'',origin_language:''}),byEntity:()=>[word]};
 const render=key=>'<span class="chip" data-k="'+key+'">*'+key+'</span>';
 return {word,pie,auto,refs,lines,meta,api,render};
}
test('PIE rows retain an independently confirmed attested source material with its own language and navigation',()=>{
 const f=mixedSourceFixture(),before=JSON.stringify(f.word),h=componentsUI.rootCell(f.api,f.word,f.render);
 assert(h.includes('data-k="men-1"'));assert(h.includes('data-k="component:greek-auto"'));assert(h.includes('autós'));assert(h.includes('古代ギリシャ語'));assert(!h.includes('*autós'));assert.equal((h.match(/data-k="component:greek-auto"/g)||[]).length,1);assert.equal(JSON.stringify(f.word),before);
});
test('mixed source material can be shown without a legacy p key or spelling equation',()=>{
 const f=mixedSourceFixture();assert(!f.word.p.includes('autos'));assert.equal(f.meta.assembly_alignment,undefined);
 assert(componentsUI.rootCell(f.api,f.word,f.render).includes('data-k="component:greek-auto"'));
 assert.deepEqual(f.word.p,['men-1']);
});
test('PIE mixed tags do not restore transmission stages, ordinary suffixes or material already on the PIE path',()=>{
 for(const mode of ['lexical','suffix','shared-path','pie-path','unconfirmed','uncertain','wrong-terminal','duplicate-line']){
  const f=mixedSourceFixture();
  if(mode==='lexical'){f.refs[1].role='lexical';f.lines[1].role='lexical';}
  if(mode==='suffix'){f.refs[1].kind='attested_formative';f.auto.kind='attested_formative';}
  if(mode==='shared-path')f.lines[0].confirmed_path_refs.push(f.auto.id);
  if(mode==='pie-path')f.lines[1].confirmed_path_refs.push(f.pie.id);
  if(mode==='unconfirmed')f.lines[1].confirmed=false;
  if(mode==='uncertain')f.lines[1].uncertain_edges=1;
  if(mode==='wrong-terminal')f.lines[1].deepest_confirmed_ref='other';
  if(mode==='duplicate-line')f.lines.push({...f.lines[1]});
  assert(!componentsUI.rootCell(f.api,f.word,f.render).includes('data-k="component:greek-auto"'),mode);
 }
});
test('unrelated legacy PIE registration alone cannot promote a historical form to a mixed source material',()=>{
 const f=mixedSourceFixture();f.refs.shift();f.lines.shift();
 assert(!componentsUI.rootCell(f.api,f.word,f.render).includes('data-k="component:greek-auto"'));
});
test('mixed source tags obey word/source guards rather than reviving stale components',()=>{
 for(const mode of ['coverage','mutation']){const f=mixedSourceFixture();if(mode==='coverage')f.api.coverage=()=>({guard_valid:false,state:'unavailable'});else f.word.ja='changed';assert(!componentsUI.rootCell(f.api,f.word,f.render).includes('data-k="component:greek-auto"'));}
});
function registeredMixedSourceFixture(){
 const f=mixedSourceFixture(),proof={w:'verified-peer',p:[],ja:'意味',en:'meaning',pos:'名',b:''};
 const proofLines=JSON.parse(JSON.stringify(f.lines));
 f.pie.kind='attested_lexeme';f.refs[0].kind='attested_lexeme';
 f.meta.assembly_alignment={segments:[{lineage_id:'auto-line',entity_ref:'greek-auto'},{lineage_id:'pie-line',entity_ref:'pie'}]};
 f.api.annotations=w=>w===proof?{w:proof.w,p:proof.p,word_guard:{ja:proof.ja,en:proof.en,pos:proof.pos,b:proof.b}}:f.meta;
 f.api.wordLineages=w=>w===proof?proofLines:f.lines;
 f.api.byEntity=()=>[proof];
 return {...f,proof};
}
test('registered PIE plus a guarded aligned independent material retains the same source entity without a confirmed PIE terminal on this row',()=>{
 const f=registeredMixedSourceFixture(),h=componentsUI.rootCell(f.api,f.word,f.render);
 assert(h.includes('data-k="men-1"'));assert(h.includes('data-k="component:greek-auto"'));assert(!h.includes('data-k="component:pie"'));
});
test('registered-only mixed expansion requires explicit assembly branches and a guarded shared source identity',()=>{
 for(const mode of ['no-alignment','no-peer','stale-peer','no-other-material','wrong-alignment']){
  const f=registeredMixedSourceFixture();
  if(mode==='no-alignment')delete f.meta.assembly_alignment;
  if(mode==='no-peer')f.api.byEntity=()=>[];
  if(mode==='stale-peer')f.api.coverage=w=>({guard_valid:w!==f.proof,state:'attested_confirmed'});
  if(mode==='no-other-material')f.meta.assembly_alignment.segments.pop();
  if(mode==='wrong-alignment')f.meta.assembly_alignment.segments[0].entity_ref='unrelated';
  assert(!componentsUI.rootCell(f.api,f.word,f.render).includes('data-k="component:greek-auto"'),mode);
 }
});
