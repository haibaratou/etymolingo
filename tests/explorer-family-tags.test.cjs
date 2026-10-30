const test=require('node:test');
const assert=require('node:assert/strict');
const {resolveFamilyTags}=require('../app/shared/explorer-difficulty-v2.js');
const fs=require('node:fs');
const path=require('node:path');
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
 assert.match(spek.d,/pect だけに「待つ」(?:という意味があるわけではない|を割り当てない)/);
 assert.match(dis.d,/離れて/);
 assert.match(dis.d,/否定/);
});

test('a known direct-language decomposition remains visible with zero or one PIE root',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const parts=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/word-parts.json'),'utf8'));
 const vm=require('node:vm');
 const code=html.match(/^function wordParts\([^]*?^}/m)[0];
 const context={WORD_PARTS:parts,esc:s=>String(s)};vm.createContext(context);vm.runInContext(code,context);
 assert.match(context.wordParts({w:'normal',p:[]},true),/norm（基準）＋al（〜に関する）/);
 assert.match(context.wordParts({w:'mission',p:[]}),/miss（送る）＋ion（こと）/);
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
 assert.match(parts[JSON.stringify(['important','en+per-2'])],/ant（〜している）/);
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
 assert.match(parts[JSON.stringify(['contemplate','kom+temə-1'])],/templ（占いのための場所）/);
 assert.doesNotMatch(parts[JSON.stringify(['contemplate','kom+temə-1'])],/場所を見る/);
});

test('attested Latin and Greek references are labelled consistently in titles and word chips',()=>{
 const roots=JSON.parse(fs.readFileSync(path.join(__dirname,'../app/data/generated-etymon/roots.json'),'utf8'));
 const html=fs.readFileSync(path.join(__dirname,'../app/vocabulary-master.html'),'utf8');
 const vm=require('node:vm');const context={ROOT_BY:new Map(roots.map(r=>[r.key,r])),esc:s=>String(s)};
 vm.createContext(context);
 for(const name of ['rootLabel','rootChip','eoTag','hasPieRoot']){
  vm.runInContext(html.match(new RegExp('^function '+name+'\\([^]*?^}','m'))[0],context);
 }
 for(const [key,label] of [['gerere','ラテン語'],['autos','ギリシャ語'],['servus','ラテン語'],['bassus','ラテン語'],['plumbum','ラテン語'],['angelos','ギリシャ語'],['ferrum','ラテン語'],['asinus','ラテン語'],['kannabis','ギリシャ語'],['philos','ギリシャ語']]){
  const r=context.ROOT_BY.get(key);
  assert.match(context.rootLabel(r),new RegExp('^'+label+' '));
  assert.ok(!context.rootChip(key).includes('*'+key));
  assert.match(context.rootChip(key),new RegExp(label+' '+key));
  assert.equal(context.eoTag({...r,eo:'different'}),'');
  assert.equal(context.hasPieRoot({p:[key]}),false);
 }
 assert.match(context.rootChip('gnō-'),/\*gnō-|\*gnō-/);
 assert.equal(context.hasPieRoot({p:['autos','men-1']}),true);
 assert.equal(context.hasPieRoot({p:[]}),false);
 assert.match(html,/>語根・部品\$\{arrow\('p'\)\}/);
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
