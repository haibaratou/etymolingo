const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const reviewed=require('./reviewed-scenes.js'),crypto=require('node:crypto').webcrypto;
const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),scope);const words=scope.window.PICTURE_WORDS_CATALOG,word=words.find(w=>reviewed.hasPack(w)),other=words.find(w=>w.id!==word.id && reviewed.hasPack(w));
const location=new URL('https://example.test/project/app/games/picture-words.html');
function setup({online=true,files=[],fetcher=async()=>new Response('ok'),storage=false,protocol='https:',registration=Promise.resolve({})}={}){
 const handlers={},stored=new Map(files.map(url=>[url,new Response('cached')]));const cache={keys:async()=>{if(storage)throw Error('denied');return [...stored.keys()].map(url=>({url}));},match:async key=>stored.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,value)=>stored.set(typeof key==='string'?key:key.url,value.clone())};
 const root={isSecureContext:protocol!=='file:',caches:{},addEventListener:(name,fn)=>handlers[name]=fn,WordBloomReviewedScenes:{...reviewed,verifyPackScript:(w,t)=>reviewed.verifyPackScript(w,t,crypto)}};
 const navigator={onLine:online,serviceWorker:{register:()=>registration,ready:Promise.resolve({})}};const loc={href:protocol==='file:'?'file:///repo/app/games/picture-words.html':location.href,protocol};
 vm.runInNewContext(fs.readFileSync(__dirname+'/offline.js','utf8'),{window:root,navigator,location:loc,URL,Set,AbortSignal,TextEncoder,setTimeout,clearTimeout,caches:{open:async()=>cache},fetch:fetcher});return{root,navigator,handlers,stored,api:root.NicolingoOffline};
}
for(const scenario of ['blocked-probe','stalled-registration-and-probe','denied-storage'])test(`reviewed online puzzles survive optional offline setup failure: ${scenario}`,async()=>{
 const never=new Promise(()=>{}),x=setup({storage:scenario==='denied-storage',registration:never,fetcher:()=>scenario==='stalled-registration-and-probe'?never:Promise.reject(Error('probe'))});const offline=await x.api.ready();assert.equal(offline.canPlay(word),true);assert.equal(offline.canPlay({pic:'unreviewed'}),false);
});
test('file viewing needs no service worker or network and only admits reviewed records',async()=>{const x=setup({online:false,protocol:'file:',fetcher:()=>{throw Error('no network');}});await x.api.ready();assert.equal(x.api.canPlay(word),true);assert.equal(x.api.canPlay({pic:'old'}),false);});
test('offline availability requires the exact caption image pack; old PNG-only packs do not qualify',async()=>{
 const pack=new URL(word.sceneAsset,location).href;const x=setup({files:[new URL('../../assets/word/'+other.pic+'.png',location).href,pack],fetcher:async()=>{throw Error('offline');}});await x.api.ready();assert.equal(x.api.canPlay(word),true);assert.equal(x.api.canPlay(other),false);x.handlers.online();assert.equal(x.api.canPlay(other),true);x.navigator.onLine=false;x.handlers.offline();assert.equal(x.api.canPlay(other),false);
});
test('Play keeps the loaded verified picture when leaving the start screen',()=>{const code=fs.readFileSync(__dirname+'/game.js','utf8'),fn=code.slice(code.indexOf('  function startPlay()'),code.indexOf('  function updateOfflineStatus()'));const calls=[];vm.runInNewContext(fn+';startPlay();',{$:()=>({close:()=>calls.push('closed')}),window:{scrollTo(){}},sound:{unlock(){}},phase:'playing',index:12,loadLevel:(...args)=>calls.push(args)});assert.deepEqual(calls,['closed',[12,false,false,true,true]]);});
test('service worker keeps saved immutable packs but never masks a strict current-data request',async()=>{
 const handlers={},stored=new Map(),location=new URL('https://example.test/project/app/games/picture-words-sw.js');const cache={match:async key=>stored.get(key.url)?.clone(),put:async(key,v)=>stored.set(key.url,v)};
 const paths=[['app/games/picture-words/game.js?v=scene1','cached game'],['app/games/'+word.sceneAsset,'cached reviewed pack']];for(const [p,body] of paths)stored.set('https://example.test/project/'+p.split('?')[0],new Response(body));
 vm.runInNewContext(fs.readFileSync(__dirname+'/../picture-words-sw.js','utf8'),{self:{location,addEventListener:(n,f)=>handlers[n]=f},URL,Request,Response,Set,caches:{open:async()=>cache},fetch:async()=>{throw Error('offline');}});
 for(const [p,body] of paths){let r;handlers.fetch({request:new Request('https://example.test/project/'+p),respondWith:x=>r=x});assert.equal(await(await r).text(),body);}
 for(const p of ['app/games/picture-words.html?connection-check','assets/word/old.png?strictScene=1','app/data/generated-etymon/manifest.json?strictScene=1']){let intercepted=false;handlers.fetch({request:new Request('https://example.test/project/'+p),respondWith:()=>intercepted=true});assert.equal(intercepted,false);}
});
test('explicit save verifies real packs and stays within20 entries and4.5MB without deleting old cache',async()=>{
 const old=new URL('../../assets/word/old.png',location).href;
 const x=setup({files:[old],fetcher:async url=>{const name=decodeURIComponent(new URL(url).pathname.split('/').pop());return new Response(fs.readFileSync(path.join(__dirname,'scene-assets',name),'utf8'));}});let progress=0;const count=await x.api.save(words,(n,total)=>{progress=n;assert.ok(total<=20);});assert.ok(count>0&&count<=20);assert.equal(progress,count);assert.ok(x.stored.has(old));let bytes=0;for(const [key,response] of x.stored){if(key===old)continue;bytes+=(await response.clone().arrayBuffer()).byteLength;}assert.ok(bytes<=4500000);assert.equal(x.api.state.sceneAssets.size,count);
});
