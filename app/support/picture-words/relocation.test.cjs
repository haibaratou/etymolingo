const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const reviewed=require('./reviewed-scenes.js');
const body=fs.readFileSync(__dirname+'/../picture-words-sw.js','utf8');
function worker(){
 const saved=new Map(),handlers={},location=new URL('https://example.test/project/app/picture-words-sw.js');let claimed=0,network=0;
 const cache={keys:async()=>[...saved.keys()].map(url=>new Request(url)),match:async key=>saved.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,response)=>saved.set(typeof key==='string'?key:key.url,response.clone())};
 vm.runInNewContext(body,{self:{location,clients:{claim:async()=>{claimed++;}},addEventListener:(name,handler)=>handlers[name]=handler},caches:{open:async name=>{assert.equal(name,'nicolingo-offline-v2');return cache;}},URL,Request,Response,Set,fetch:async()=>{network++;throw Error('offline');}});
 return {saved,handlers,claimed:()=>claimed,network:()=>network};
}
test('activation copies saved packs to support URLs and retains the old entries',async()=>{
 const w=worker(),old='https://example.test/project/app/games/picture-words/scene-assets/cat@abc.js',next=old.replace('/games/','/support/').replace('@','%40');
 w.saved.set(old,new Response('immutable saved pack'));let done;w.handlers.activate({waitUntil:p=>done=p});await done;
 assert.equal(await w.saved.get(next).clone().text(),'immutable saved pack');assert.equal(await w.saved.get(old).clone().text(),'immutable saved pack');assert.equal(w.claimed(),1);
});
test('relocated packs fall back to previous saved URLs without network or cache deletion',async()=>{
 const w=worker(),old='https://example.test/project/app/games/picture-words/scene-assets/cat@abc.js',next=old.replace('/games/','/support/').replace('@','%40');w.saved.set(old,new Response('saved before relocation'));
 let response;w.handlers.fetch({request:new Request(next),respondWith:p=>response=p});assert.equal(await(await response).text(),'saved before relocation');assert.equal(w.network(),0);assert.ok(w.saved.has(old));
 for(const url of ['https://example.test/project/app/data/generated-etymon/manifest.json?strictScene=1','https://example.test/project/app/word-drop.html']){let intercepted=false;w.handlers.fetch({request:new Request(url),respondWith:()=>intercepted=true});assert.equal(intercepted,false);}
});
test('file-mode pack loading uses the new location while retaining exact catalogue identity',async()=>{
 const sha='a'.repeat(64),word={id:'fixture',en:'cat',pic:'cat',generatedImage:true,bindingStatus:'bound',image:{path:'assets/word/cat.png',sha256:sha,git_blob_sha:'b'.repeat(40)},sceneAsset:'picture-words/scene-assets/cat@'+sha+'.js'};
 const assets={};let requested;
 const document={createElement:()=>({remove(){}}),head:{append(script){requested=script.src;assets.PICTURE_WORDS_SCENE_ASSETS={[sha]:{mime:'image/png',base64:'iVBORw0KGgo='}};queueMicrotask(()=>script.onload());}}};
 const runtime=new reviewed.Runtime({location:{href:'file:///repo/app/pictlingo-game.html',protocol:'file:'},document,assetRoot:assets});
 assert.equal(reviewed.hasPack(word),true);assert.equal((await runtime.loadPack(word)).length,8);assert.equal(decodeURIComponent(requested),'file:///repo/app/support/'+word.sceneAsset);
});
test('worker loader is above the Pictlingo-only scope on a static host',async()=>{
 let registration;
 const root={isSecureContext:true,caches:{},addEventListener(){},WordBloomReviewedScenes:reviewed};
 const navigator={onLine:true,serviceWorker:{register:(url,options)=>{registration={url,options};return Promise.resolve({});},ready:Promise.resolve({})}};
 const location=new URL('https://example.test/project/app/pictlingo-game.html');
 vm.runInNewContext(fs.readFileSync(__dirname+'/offline.js','utf8'),{window:root,navigator,location,URL,Set,AbortSignal,TextEncoder,setTimeout,clearTimeout,caches:{open:async()=>({keys:async()=>[]})},fetch:async()=>new Response('online')});
 await root.NicolingoOffline.ready();assert.equal(registration.url,'picture-words-sw.js');assert.equal(registration.options.scope,'./pictlingo-game.html');
 const script=new URL(registration.url,location),scope=new URL(registration.options.scope,location);assert.equal(script.pathname,'/project/app/picture-words-sw.js');assert.equal(scope.pathname,'/project/app/pictlingo-game.html');assert.ok(scope.href.startsWith(new URL('./',script).href));
});
