/* A deliberately small DOM fixture, not a browser or a rendering assertion.
 * Executes the complete unchanged app and real modules; all I/O is bounded to
 * verified fixture files. Unknown required DOM IDs fail instead of auto-stubbing.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto').webcrypto;
const {pathToFileURL,fileURLToPath}=require('node:url');
const {setTimeout:realDelay}=require('node:timers/promises');
const root=path.resolve(__dirname,'../../../..');
const folder=path.join(root,'app/games/picture-words');
const gameSource=fs.readFileSync(path.join(folder,'game.js'),'utf8');
const catalogSource=fs.readFileSync(path.join(folder,'catalog.js'),'utf8');
const html=fs.readFileSync(path.join(root,'app/games/picture-words.html'),'utf8');
const camel=s=>s.replace(/-([a-z])/g,(_,x)=>x.toUpperCase());
async function boot({query='',saved={},deferImages=false,desktopHost=false}={}) {
 const ids=new Map(),imageRequests=[],scriptRequests=[],fetchRequests=[],speechCalls=[],speechEvents=[],events={},timers=new Map(),errors=[],pendingImages=[];
 let serial=0,context,cancelCount=0,serialized=JSON.stringify(saved);
 const timeout=(fn,ms=0)=>{timers.set(++serial,{fn,ms});return serial;};
 class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.attributes={};this.dataset={};this.handlers={};this.style={setProperty(k,v){this[k]=v;},getPropertyValue(k){return this[k]||'';}};this.className='';this._text='';this.hidden=false;this.disabled=false;this.open=false;this.parentNode=null;this.complete=false;this.naturalWidth=0;this.offsetWidth=60;this.isConnected=false;
   const self=this;this.classList={contains:k=>self.className.split(/\s+/).includes(k),add(...ks){self.className=[...new Set([...self.className.split(/\s+/).filter(Boolean),...ks])].join(' ');},remove(...ks){self.className=self.className.split(/\s+/).filter(k=>!ks.includes(k)).join(' ');},toggle(k,on){const yes=on===undefined?!this.contains(k):!!on;yes?this.add(k):this.remove(k);return yes;}};
  }
  set id(v){this._id=v;ids.set(v,this);}get id(){return this._id||'';}
  set textContent(v){this._text=String(v??'');this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
  set innerHTML(v){this._html=String(v);this._text='';this.children=[];parse(this._html,this);}get innerHTML(){return this._html||'';}
  get childElementCount(){return this.children.length;}
  setAttribute(k,v){v=String(v);this.attributes[k]=v;if(k==='id')this.id=v;else if(k==='class')this.className=v;else if(k.startsWith('data-'))this.dataset[camel(k.slice(5))]=v;else if(k==='hidden')this.hidden=true;else if(k==='disabled')this.disabled=true;else if(k==='open')this.open=true;}
  getAttribute(k){if(k==='class')return this.className;if(k==='id')return this.id;if(k.startsWith('data-'))return this.dataset[camel(k.slice(5))]??null;return this.attributes[k]??null;}
  removeAttribute(k){delete this.attributes[k];if(k==='disabled')this.disabled=false;if(k==='hidden')this.hidden=false;}
  append(...nodes){for(const node of nodes){if(typeof node==='string'){this._text+=node;continue;}node.parentNode=this;node.isConnected=this.isConnected;this.children.push(node);if(this.tagName==='HEAD' && node.tagName==='SCRIPT' && node.src){scriptRequests.push(node.src);try{const local=fileURLToPath(node.src);if(!local.startsWith(folder+path.sep+'scene-assets'+path.sep))throw Error('Unexpected script path '+local);vm.runInContext(fs.readFileSync(local,'utf8'),context,{filename:local});queueMicrotask(()=>node.onload?.());}catch(e){errors.push(e);queueMicrotask(()=>node.onerror?.());}}}}
  replaceChildren(...nodes){this.children.forEach(n=>n.isConnected=false);this.children=[];this._text='';this.append(...nodes);}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.isConnected=false;}
  addEventListener(name,fn){(this.handlers[name]||=[]).push(fn);}
  dispatch(name,event={}){for(const fn of this.handlers[name]||[])fn({type:name,target:this,detail:0,preventDefault(){},...event});}
  click(){if(!this.disabled)this.dispatch('click');}
  getBoundingClientRect(){return {left:0,top:0,width:360,height:360,right:360,bottom:360};}
  getContext(){return {setTransform(){},clearRect(){},save(){},restore(){},beginPath(){},fill(){},translate(){},rotate(){},moveTo(){},lineTo(){},arc(){},rect(){},closePath(){}};}
  focus(){document.activeElement=this;}scrollIntoView(){}setSelectionRange(){}
  showModal(){this.open=true;}close(){this.open=false;this.dispatch('close');}showPopover(){this.popoverOpen=true;}hidePopover(){this.popoverOpen=false;}
  setPointerCapture(id){this.pointerId=id;}hasPointerCapture(id){return this.pointerId===id;}releasePointerCapture(){this.pointerId=null;}
  matches(selector){return matches(this,selector);}closest(selector){for(let n=this;n;n=n.parentNode)if(matches(n,selector))return n;return null;}
  querySelectorAll(selector){return descendants(this).filter(n=>matches(n,selector));}querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  set src(value){this._src=String(value);if(this.tagName==='IMG'){imageRequests.push({id:this.id,url:this._src});const load=()=>{this.complete=true;this.naturalWidth=256;this.onload?.();};if(deferImages)pendingImages.push(load);else queueMicrotask(load);}}get src(){return this._src||'';}
 }
 function descendants(node){return node.children.flatMap(child=>[child,...descendants(child)]);}
 function simple(node,s){if(s===':popover-open')return !!node.popoverOpen;const attr=s.match(/\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]/);if(attr && (node.getAttribute(attr[1])===null || (attr[2]!==undefined && node.getAttribute(attr[1])!==attr[2])))return false;const rest=s.replace(/\[[^\]]+\]/g,'');if(rest.startsWith('#'))return node.id===rest.slice(1);if(rest.startsWith('.'))return rest.split('.').filter(Boolean).every(k=>node.classList.contains(k));return !rest||rest==='*'||node.tagName===rest.toUpperCase();}
 function matches(node,selector){return selector.split(',').some(group=>{const parts=group.trim().split(/\s+(?![^\[]*\])/);if(!simple(node,parts.pop()))return false;for(let i=parts.length-1,parent=node.parentNode;i>=0;i--){while(parent&&!simple(parent,parts[i]))parent=parent.parentNode;if(!parent)return false;parent=parent.parentNode;}return true;});}
 function parse(source,parent){const stack=[parent],voids=new Set(['meta','link','img','input','br','hr','source']);let skip='';for(const token of source.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)||[]){if(token.startsWith('<!--')||token.startsWith('<!'))continue;if(skip){if(token.toLowerCase()===`</${skip}>`)skip='';continue;}if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}if(token.startsWith('<')){const match=token.match(/^<([\w-]+)/);if(!match)continue;const tag=match[1].toLowerCase(),el=new Element(tag);for(const a of token.slice(match[0].length).matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))el.setAttribute(a[1],a[2]??a[3]??a[4]??'');stack.at(-1).append(el);if(tag==='script'||tag==='style'){skip=tag;continue;}if(!voids.has(tag)&&!token.endsWith('/>'))stack.push(el);}else stack.at(-1)._text+=token;}}
 const container=new Element('document');container.isConnected=true;parse(html,container);
 const document={documentElement:descendants(container).find(n=>n.tagName==='HTML'),head:descendants(container).find(n=>n.tagName==='HEAD'),body:descendants(container).find(n=>n.tagName==='BODY'),hidden:false,
 getElementById(id){if(!ids.has(id))throw Error('Missing real HTML ID '+id);return ids.get(id);},createElement:tag=>new Element(tag),querySelectorAll:s=>container.querySelectorAll(s),querySelector:s=>container.querySelector(s),addEventListener(name,fn){(events['document:'+name]||=[]).push(fn);}};
 const location=new URL(pathToFileURL(path.join(root,'app/games/picture-words.html')).href+query);location.replace=url=>{location.href=url;};
 const window={document,location,navigator:{onLine:false},crypto,isSecureContext:false,devicePixelRatio:1,innerWidth:1200,innerHeight:900,
 addEventListener(name,fn){(events[name]||=[]).push(fn);},scrollTo(){},btoa:text=>Buffer.from(text,'binary').toString('base64'),atob:text=>Buffer.from(text,'base64').toString('binary'),
 speechSynthesis:{getVoices:()=>[{lang:'en-US',localService:true},{lang:'ja-JP',localService:true}],addEventListener(){},speak(u){speechCalls.push(u);queueMicrotask(()=>{u.onstart?.();speechEvents.push({type:'start',text:u.text});});},cancel(){cancelCount++;speechEvents.push({type:'cancel'});}},SpeechSynthesisUtterance:class {constructor(text){this.text=text;}}};
 window.self=window;window.top=desktopHost?window:{}; // Default is the real desktop shell's game iframe.
 const fetch=async url=>{fetchRequests.push(String(url));throw Error('No fetch allowed during file bootstrap');};window.fetch=fetch;
 const sandbox={window,document,location,navigator:window.navigator,crypto,fetch,URL,URLSearchParams,TextEncoder,TextDecoder,Uint8Array,AbortSignal,Intl,Date,console,queueMicrotask,
 setTimeout:timeout,clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>timeout(fn,16),cancelAnimationFrame:id=>timers.delete(id),performance:{now:()=>0},innerWidth:1200,innerHeight:900,
 matchMedia:()=>({matches:true}),getComputedStyle:el=>el.style,localStorage:{getItem:()=>serialized,setItem:(key,value)=>{if(key!=='word-bloom-v1')throw Error('Unexpected save key');serialized=value;}}};
 context=vm.createContext(sandbox);
 vm.runInContext(fs.readFileSync(path.join(folder,'desktop.js'),'utf8'),context,{filename:'desktop.js'});
 vm.runInContext(catalogSource,context,{filename:'catalog.js'});
 for(const name of ['difficulty.js','gesture.js','pronunciation.js','progression.js','reviewed-scenes.js','offline.js'])vm.runInContext(fs.readFileSync(path.join(folder,name),'utf8'),context,{filename:name});
 vm.runInContext(fs.readFileSync(path.join(root,'app/shared/illustration-scenes.js'),'utf8'),context,{filename:'illustration-scenes.js'});window.IllustrationScenes=context.IllustrationScenes;
 const result=vm.runInContext(gameSource,context,{filename:'game.js'});await result;
 async function settle(predicate=()=>true){const deadline=Date.now()+10000;while(Date.now()<deadline){await realDelay(1);if(predicate())return;}throw Error('VM state did not settle within 10 seconds');}
 await settle(()=>ids.get('game').dataset.state==='playing'||ids.get('game').dataset.state==='error'||deferImages||window.NICOLINGO_PHONE_HOST===true);
 function flushTimers(maxDelay=1000){for(let pass=0;pass<8;pass++){const ready=[...timers].filter(([,t])=>t.ms<=maxDelay);if(!ready.length)break;for(const [id,t]of ready){if(!timers.delete(id))continue;t.fn();}}}
 return {context,window,document,get:id=>document.getElementById(id),images:imageRequests,scripts:scriptRequests,fetches:fetchRequests,speech:speechCalls,speechEvents,timers,errors,pendingImages,cancelCount:()=>cancelCount,save:()=>JSON.parse(serialized),settle,flushTimers,
 solve(){for(const button of [...ids.get('letters').children])button.click();flushTimers();},
 finishImages(){pendingImages.splice(0).forEach(fn=>fn());},
 dispatchWindow(name){for(const fn of events[name]||[])fn();},
 snapshot(){return {state:ids.get('game').dataset.state,id:ids.get('clueImage').dataset.sceneId,mode:document.documentElement.lang,letters:ids.get('letters').children.map(n=>n.textContent),caption:ids.get('rewardExplanation').textContent};}
 };
}
module.exports={boot};
