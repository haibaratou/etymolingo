const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const H=__dirname;const revision=JSON.parse(fs.readFileSync(H+'/image-revisions.json','utf8')).entries[0];const hash=revision.sha256;
const word={pic:revision.art,imageRevision:hash};
const game=fs.readFileSync(H+'/game.js','utf8'),offlineSource=fs.readFileSync(H+'/offline.js','utf8');
const reviewed=require('./reviewed-scenes.js');const scope={window:{}};vm.runInNewContext(fs.readFileSync(H+'/catalog.js','utf8'),scope);const strictWord=scope.window.PICTURE_WORDS_CATALOG.find(w=>reviewed.hasPack(w));
test('strict image and offline pack identities use the accepted PNG hash without fallback',()=>{
 const runtime=new reviewed.Runtime({location:{href:'https://example.test/app/games/picture-words.html',protocol:'https:'}});
 const url=new URL(runtime.imageURL(strictWord));assert.equal(decodeURIComponent(url.pathname),'/'+strictWord.image.path);assert.equal(url.searchParams.get('strictScene'),'1');assert.equal(url.searchParams.get('v'),strictWord.image.sha256);
 assert.equal(strictWord.sceneAsset,'picture-words/scene-assets/'+strictWord.pic+'@'+strictWord.image.sha256+'.js');
 assert.equal(runtime.imageURL({pic:'stimulus'}),'');
});
test('old canonical and alias PNG-only caches cannot qualify a description-only puzzle',async()=>{
 const root={isSecureContext:true,caches:{},addEventListener:()=>{},WordBloomReviewedScenes:reviewed};const nav={onLine:false,serviceWorker:{}};const location={href:'https://example.test/app/games/picture-words.html',protocol:'https:'};
 const keys=[{url:'https://example.test/assets/word/stimulus.png'},{url:'https://example.test/assets/word/stimulus@'+hash+'.png'}];
 vm.runInNewContext(offlineSource,{window:root,navigator:nav,location,URL,Set,setTimeout,clearTimeout,caches:{open:async()=>({keys:async()=>keys})}});await root.NicolingoOffline.refresh();assert.equal(root.NicolingoOffline.canPlay(strictWord),false);assert.equal(root.NicolingoOffline.canPlay({pic:'stimulus'}),false);
 keys.push({url:new URL(strictWord.sceneAsset,location.href).href});await root.NicolingoOffline.refresh();assert.equal(root.NicolingoOffline.canPlay(strictWord),true);
});
test('worker and pack saver use the same existing cache name',()=>{const sw=fs.readFileSync(H+'/../picture-words-sw.js','utf8');assert.equal(sw.match(/const CACHE = '([^']+)'/)[1],offlineSource.match(/const CACHE = '([^']+)'/)[1]);assert.equal(sw.match(/const CACHE = '([^']+)'/)[1],'nicolingo-offline-v2');});
test('previous cache-first SW requests new alias instead of serving old PNG',async()=>{const handlers={};let responsePromise,requested;const oldsw=fs.readFileSync(H+'/../picture-words-sw.js','utf8');const origin='https://example.test';vm.runInNewContext(oldsw,{self:{location:new URL(origin+'/app/games/picture-words-sw.js'),addEventListener:(k,f)=>handlers[k]=f},URL,Request,Response,caches:{open:async()=>({match:async key=>key.url===origin+'/assets/word/stimulus.png'?new Response('OLD'):undefined})},fetch:async req=>{requested=req.url;return new Response('NEW')}});handlers.fetch({request:new Request(origin+'/assets/word/stimulus@'+hash+'.png'),respondWith:p=>responsePromise=p});assert.equal(await (await responsePromise).text(),'NEW');assert.equal(requested,origin+'/assets/word/stimulus@'+hash+'.png');});
test('revision alias is byte-identical to canonical accepted PNG',()=>{const root=path.resolve(H,'../../..');const a=fs.readFileSync(root+'/assets/word/'+revision.art+'.png'),b=fs.readFileSync(root+'/assets/word/'+revision.art+'@'+hash+'.png');assert.deepEqual(a,b);assert.equal(require('node:crypto').createHash('sha256').update(a).digest('hex'),hash);});
