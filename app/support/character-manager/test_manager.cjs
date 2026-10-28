// In-memory UI logic tests. This does not launch or claim to verify a browser.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const support=__dirname;
class Element{
  constructor(){this.children=[];this.dataset={};this.value='';this.attrs={};this.events={};this.messages=[];this.contentWindow={postMessage:(data)=>this.messages.push(data)};this.classList={toggle:()=>{}};this.parts={};this.open=false;}
  get options(){return this.children;}
  append(...children){this.children.push(...children);}
  replaceChildren(){this.children=[];}
  setAttribute(key,value){this.attrs[key]=value;}
  getAttribute(key){return this.attrs[key]??null;}
  addEventListener(type,handler){(this.events[type]??=[]).push(handler);}
  querySelector(selector){return this.parts[selector]??=new Element();}
  querySelectorAll(){return [];}
  hasAttribute(key){return Object.hasOwn(this.attrs,key);}
  scrollTo(x,y){this.scrollLeft=x;this.scrollTop=y;}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  get src(){return this.attrs.src;}
  set src(value){this.attrs.src=value;this.loads=(this.loads||0)+1;}
}
function environment(hash=''){
  const elements=new Map(),events={},sent=[],writes=[],storage=new Map();
  const element=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
  const location={hash,protocol:'file:',port:'',href:'file:///D:/Projects/etymolingo/app/compare.html',replace(value){this.replaced=value;}};
  const context={console,Set,Map,URL,URLSearchParams,JSON,Number,String,Date,Error,Promise,queueMicrotask,location,opener:null,scrollTo:()=>{},fetch:async()=>{throw Error('Offline fixture');},parent:{postMessage:data=>sent.push(data)},localStorage:{get length(){return storage.size;},key:index=>[...storage.keys()][index],getItem:key=>storage.get(key)??null,setItem:(key,value)=>{storage.set(key,String(value));writes.push(key);},removeItem:key=>{storage.delete(key);writes.push(key);}},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>new Element()},addEventListener(type,handler){(events[type]??=[]).push(handler);}};
  context.window=context;
  vm.createContext(context);
  return {context,element,storage,writes,sent,run:file=>vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file}),emit:(type,data)=>{for(const handler of events[type]||[])handler(data);},trigger:(id,type)=>{for(const handler of element(id).events[type]||[])handler({target:element(id)});}};
}
function testManager(){
  const e=environment(),instances={},channel='wildwordopia-character-manager';
  e.context.WILDWORDOPIA_COMPARISON_MARKUP='<header>Comparison</header>';
  e.context.WILDWORDOPIA_HISTORY_MARKUP='<header>History</header>';
  e.context.createCharacterViewRuntime=(host,send)=>{
    const mode=host===e.element('view-comparison')?'comparison':'history';
    const runtime={host,send,messages:[],receive(data){this.messages.push(data);}};
    instances[mode]=runtime;return runtime;
  };
  e.context.startCharacterComparison=runtime=>{
    runtime.starts=(runtime.starts||0)+1;
    runtime.send({channel,type:'ready',count:669});
    runtime.send({type:'wildwordopia-history-state',removed:['saved:v001'],rejected:['saved:v002']});
  };
  e.context.startCharacterHistory=runtime=>{
    runtime.starts=(runtime.starts||0)+1;runtime.send({channel,type:'ready',count:2304});
  };
  e.run(path.join(support,'manager.js'));
  const comparison=instances.comparison;assert.equal(comparison.starts,1);assert.equal(instances.history,undefined);
  e.element('tab-history').onclick();e.emit('hashchange');const history=instances.history;
  assert.equal(history.starts,1);assert.equal(e.element('panel-comparison').hidden,true);
  assert.match(e.element('history-count').textContent,/2,304/);
  assert(history.messages.some(m=>m.type==='wildwordopia-history-state'&&m.removed[0]==='saved:v001'));
  history.send({channel,type:'navigate',mode:'comparison',root:'weid'});e.emit('hashchange');
  assert.equal(e.context.location.hash,'#comparison?root=weid');assert.equal(comparison.starts,1);
  assert(comparison.messages.some(m=>m.type==='show-root'&&m.root==='weid'));
  e.context.location.hash='#history';e.emit('hashchange');assert.equal(history.starts,1);
  e.element('tab-history').onkeydown({key:'Home',preventDefault(){}});e.emit('hashchange');
  assert.equal(e.element('tab-comparison').focused,true);assert.equal(e.writes.length,0);
  assert(!e.element('view-comparison').innerHTML.includes('iframe'));
}
async function testHistory(){
  const e=environment();
  e.run(path.join(support,'../wildwordopia-history/wildwordopia-history-data.js'));
  const entries=e.context.WILDWORDOPIA_HISTORY.entries,first=entries[0],second=entries[1],third=entries[2];
  const selectionKey='wildwordopia.history-compare-selection.v1';
  const reviewKey='wildwordopia.root-candidate-review.v1';
  e.storage.set(selectionKey,JSON.stringify([first.id]));e.storage.set('wildwordopia.deleted-images.v1',JSON.stringify([second.id]));
  const review=JSON.stringify({reviews:{[third.id]:{decision:'reject',comment:'保存済みのメモ'}},previews:{sample:'v001'}});e.storage.set(reviewKey,review);
  e.element('#mode').value='all';e.element('#root').value='';e.element('#search').value='';
  e.run(path.join(support,'../wildwordopia-history/wildwordopia-history.js'));
  e.context.startCharacterHistory({document:e.context.document,window:e.context,parent:e.context.parent,opener:null,scrollTo:e.context.scrollTo,localStorage:e.context.localStorage});
  assert.equal(entries.length,e.context.WILDWORDOPIA_HISTORY.count);assert.equal(e.element('main').children.length,Math.min(entries.length,60));assert.equal(e.writes.length,0);
  assert(e.element('#status').textContent.includes('全履歴 '+entries.length+'件'));
  e.element('#search').value='weid';e.trigger('#search','input');
  assert(e.element('main').children.length>0);assert(e.element('main').children.every(c=>c.innerHTML.includes('weid')));
  e.element('#search').value='';e.trigger('#search','input');
  const card=e.element('main').children[2];card.querySelector('.check').onchange({target:{checked:true}});
  assert.deepEqual(JSON.parse(e.storage.get(selectionKey)),[first.id,third.id]);assert.equal(e.storage.get(reviewKey),review);
  assert(e.writes.every(k=>k===selectionKey));
  e.element('#mode').value='selected';e.trigger('#mode','change');assert.equal(e.element('main').children.length,2);
  const selectedBefore=e.storage.get(selectionKey);e.emit('message',{source:e.context.parent,data:{channel:'wildwordopia-character-manager',type:'activate'}});assert.equal(e.storage.get(selectionKey),selectedBefore);
  e.emit('message',{source:e.context.parent,data:{channel:'wildwordopia-character-manager',type:'show-root',root:'genu1'}});
  assert.equal(e.element('#root').value,'genu1');assert(e.element('main').children.length>0);
  assert.equal(e.element('#mode').value,'all');assert.equal(e.storage.get(selectionKey),selectedBefore);
  const detailsCard=e.element('main').children[0];await detailsCard.querySelector('.details').onclick();
  assert.equal(e.element('#detail').open,true);assert.match(e.element('#detail pre').textContent,/索引に保存された全記録/);assert.match(e.element('#detail pre').textContent,/createdAt/);
  e.element('#root').value='';e.trigger('#root','change');e.element('#mode').value='all';e.trigger('#mode','change');
  e.element('#next').onclick();assert.match(e.element('#page').textContent,/^2 /);e.element('#prev').onclick();assert.match(e.element('#page').textContent,/^1 /);
  const image=e.element('main').children[0];image.querySelector('.picture').onclick();assert.equal(e.element('#zoom').open,true);assert(e.element('#zoom img').src.startsWith('file:///'));
  image.querySelector('.card-actions').children[0].onclick();assert.equal(e.sent.at(-1).type,'navigate');assert.equal(e.sent.at(-1).root,first.rootId);
  assert.equal(e.storage.get(reviewKey),review);assert.equal(e.storage.get('wildwordopia.deleted-images.v1'),JSON.stringify([second.id]));
}
function testMarkupAndRuntime(){
  const root=path.resolve(support,'../../..');
  for(const file of ['app/compare.html','app/wildwordopia-history.html','app/キャラクター管理を開く.cmd'])assert.equal(fs.existsSync(path.join(root,file)),false,file+' must remain absent');
  const shell=fs.readFileSync(path.join(root,'app/character-manager.html'),'utf8');
  assert(!/<iframe\b/.test(shell));assert(!/(?:src|href)=["'](?:compare|wildwordopia-history)\.html/.test(shell));
  for(const match of shell.matchAll(/(?:src|href)="([^"]+)"/g))assert(fs.existsSync(path.resolve(root,'app',match[1])),match[1]);
  const e=environment();
  e.run(path.join(support,'comparison-markup.js'));e.run(path.join(support,'history-markup.js'));
  for(const mode of ['COMPARISON','HISTORY']){
    const fragment=e.context['WILDWORDOPIA_'+mode+'_MARKUP'];assert(fragment.includes('<header>'));
    assert(!/<(?:html|head|body|base|meta|script|iframe)\b/i.test(fragment));
  }
  assert.equal([...e.context.WILDWORDOPIA_COMPARISON_MARKUP.matchAll(/<article\b/g)].length,669);
  const host=new Element();host.id='view-comparison';e.context.document.head=new Element();e.context.CSS={escape:value=>value};
  e.run(path.join(support,'runtime.js'));const sent=[];const runtime=e.context.createCharacterViewRuntime(host,message=>sent.push(message));
  assert.equal(runtime.document.body,host);assert.equal(runtime.localStorage,e.context.localStorage);
  runtime.document.querySelector('main').value='comparison only';assert.equal(host.parts.main.value,'comparison only');
  let delivered=null;runtime.window.addEventListener('message',event=>{assert.equal(event.source,runtime.parent);delivered=event.data;});
  runtime.receive({type:'test'});assert.equal(delivered.type,'test');
  runtime.scrollTo(4,42);assert.equal(host.scrollTop,42);assert.equal(runtime.window.scrollX,4);
  const style=new Element();style.tagName='STYLE';style.textContent='html{overflow-anchor:none}main{display:grid}';runtime.document.head.append(style);
  assert(style.textContent.startsWith('@scope (#view-comparison)'));assert(style.textContent.includes(':scope{'));
  assert.equal(e.writes.length,0);
}
(async()=>{testManager();await testHistory();testMarkupAndRuntime();console.log('PASS: single-document modules, tab/root navigation, history filters/checks/paging/details, scoped runtime, saved-state isolation, all local dependencies present; old HTML and launcher absent. Browser layout/access unverified.');})().catch(error=>{console.error(error);process.exitCode=1;});
