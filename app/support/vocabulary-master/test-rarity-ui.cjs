'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('app/shared/explorer-difficulty-v2.js'),html=read('app/vocabulary-master.html'),api=require('../../shared/explorer-difficulty-v2.js');
const beforeSource=read('work/non-pie-components-20261028/rarity-ui/explorer-difficulty-v2.js.before'),old={module:{exports:{}}};vm.runInNewContext(beforeSource,old);
function element(tag){return {tag,dataset:{},attributes:{},children:[],className:'',textContent:'',classList:{add(){}},setAttribute(k,v){this.attributes[k]=v;},append(e){this.children.push(e);}};}
function makeButton(word,difficulty){
 const m=source.match(/ function makeButton\(w\)\{[\s\S]*?\n \}/);assert.ok(m);
 const context={doc:{createElement:element},difficultyFor:()=>difficulty,index:{},esc:s=>String(s)};
 vm.createContext(context);vm.runInContext(m[0]+'\nthis.button=makeButton('+JSON.stringify(word)+');',context);return context.button;
}
test('current independent level is unchanged for every dictionary record and source inputs',()=>{
 const context={window:{}};vm.createContext(context);
 vm.runInContext(read('app/data/generated-etymon/weblio-learning-levels.js'),context);vm.runInContext(read('app/data/generated-etymon/learning-levels.js'),context);
 const index=api.makeIndex(context.window.ETYMON_WEBLIO_LEVELS,context.window.ETYMON_LEARNING_LEVELS),prior=old.module.exports.makeIndex(context.window.ETYMON_WEBLIO_LEVELS,context.window.ETYMON_LEARNING_LEVELS);
 const words=JSON.parse(read('app/data/generated-etymon/words.json'));for(const word of words)assert.equal(JSON.stringify(api.evaluate(word,index)),JSON.stringify(old.module.exports.evaluate(word,prior)),word.w);
 assert.equal(words.length,49180);
});
test('compact single-line star counts encode exact levels and unknown is never maximum rarity',()=>{
 for(let n=1;n<=10;n++){
  const b=makeButton({w:'test'},{level:n});assert.equal(b.children[0].children.length,n);assert.ok(b.children[0].children.every(x=>x.textContent==='★'));
  assert.equal(b.dataset.level,String(n));assert.match(b.title,/根拠/);assert.equal(b.attributes['aria-pressed'],undefined);
 }
 assert.equal(makeButton({w:'test'},{level:null}).textContent,'未分類');
 const starCSS=source.match(/\.difficulty-v2-stars\{([^}]+)\}/)[1];
 assert.match(starCSS,/display:inline-flex/);assert.match(starCSS,/font-size:\.8em/);assert.match(starCSS,/white-space:nowrap/);
 assert.doesNotMatch(starCSS,/grid|repeat\(/);
 const buttonCSS=[...source.matchAll(/\.difficulty-v2-button\{([^}]+)\}/g)].at(-1)[1];
 assert.match(buttonCSS,/padding:0/);assert.match(buttonCSS,/min-height:0/);assert.match(buttonCSS,/border:0/);assert.match(buttonCSS,/background:transparent/);
 assert.doesNotMatch(source,/width:126px!important|font-size:21px|min-height:38px|grid-template-columns:repeat\(5/);
 assert.doesNotMatch(html,/table-layout:fixed/); // Auto table layout retains the inline content's minimum width.
});
test('star tap opens evidence and never toggles the level filter',()=>{
 const block=source.match(/ doc\.addEventListener\('click',e=>\{([\s\S]*?)\n \},true\);/);assert.ok(block);
 let opened=0,stopped=0;const details={innerHTML:''},dialog={querySelector:()=>details,showModal:()=>opened++};
 const c={root:{},makeModal:()=>dialog,modalHTML:(w,d)=>w.w+':'+d.level};vm.createContext(c);vm.runInContext('this.tap=e=>{'+block[1]+'\n};',c);
 c.tap({target:{closest:()=>({_details:{w:{w:'test'},d:{level:7}}})},preventDefault(){},stopPropagation(){},stopImmediatePropagation(){stopped++;}});
 assert.equal(opened,1);assert.equal(stopped,1);assert.equal(details.innerHTML,'test:7');assert.doesNotMatch(block[1],/toggle\(/);
});
test('native view removes dedicated paraphrase and old rarity columns without deleting fields',()=>{
 assert.doesNotMatch(html,/<t[dh] class="cEn/);assert.doesNotMatch(html,/id="fMin"|id="fMax"|RAR_PRESETS|F\.min|F\.max/);
 assert.doesNotMatch(html,/\$\{w\.r\?\?''\}/);assert.match(html,/w\.en/);assert.match(html,/#fRootType/);
 assert.doesNotMatch(source,/node\.remove\(\);node=next/);assert.match(source,/if\(!cell\|\|root\.EtymonOrigins\)return/);
});
test('deferred level controls preserve native origins and component filters and combine with them',()=>{
 const controls=[],sentinels=[{id:'fOriginOpen'},{id:'fRootType'}],toolbar={
  children:[...sentinels],get firstChild(){return this.children[0];},
  querySelector(){return this.children.find(x=>x.dataset?.difficultyFilter)||null;},
  insertBefore(e,before){this.children.splice(this.children.indexOf(before),0,e);controls.push(e);}
 };
 const doc={getElementById:id=>id==='toolbar'?toolbar:null,createElement(){const e=element('button');e.addEventListener=(k,fn)=>{e[k]=fn;};return e;}};
 let tableCalls=0;const rootObject={applyFilters:rows=>rows.filter(w=>w.family==='日琉'&&w.component),renderToolbar(){toolbar.children=[...sentinels];},renderTable(){tableCalls++;},renderAll(){this.renderToolbar();this.renderTable();}};
 const c={root:rootObject,doc,selectedLevels:new Set(),difficultyFor:w=>({level:w.level}),index:{}};vm.createContext(c);
 for(const name of ['installLevelFilters','toggle']){
  const at=source.indexOf(' function '+name+'('),end=source.indexOf('\n }',at)+3;assert.ok(at>0);vm.runInContext(source.slice(at,end),c);
 }
 c.installLevelFilters();assert.ok(toolbar.children.includes(sentinels[0]));assert.ok(toolbar.children.includes(sentinels[1]));
 controls.find(x=>x.dataset.difficultyFilter==='4').click();
 const records=[{family:'日琉',component:true,level:4},{family:'セム',component:true,level:4},{family:'日琉',component:false,level:4},{family:'日琉',component:true,level:7}];
 assert.deepEqual(rootObject.applyFilters(records),[records[0]]);assert.ok(tableCalls>0);
 assert.ok(toolbar.children.includes(sentinels[0]));assert.ok(toolbar.children.includes(sentinels[1]));
 controls.findLast(x=>x.dataset.difficultyFilter==='clear').click();assert.deepEqual(rootObject.applyFilters(records),[records[0],records[3]]);
});
test('native rarity sort uses the current level rather than the old frequency value',()=>{
 const runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function cmpBy('))[2];
 const at=runtime.indexOf('function cmpBy('),fn=runtime.slice(at,runtime.indexOf('\n}',at)+2);
 const c={window:{EtymonDifficultyV2:{levelFor:w=>w.currentLevel}}};vm.createContext(c);vm.runInContext(fn,c);
 const low={w:'low',r:1500,currentLevel:1},high={w:'high',r:1,currentLevel:10},missing={w:'missing',r:2,currentLevel:null};
 const values=[high,missing,low];values.sort(c.cmpBy('r',1));assert.deepEqual(values,[low,high,missing]);
 values.sort(c.cmpBy('r',-1));assert.deepEqual(values,[high,low,missing]);
});
