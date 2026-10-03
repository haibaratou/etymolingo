const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('offline selection permits cached pictures only, including after a failed network probe', async () => {
  const handlers = {};
  const root = {isSecureContext:true, caches:{}, addEventListener:(name, fn) => handlers[name] = fn};
  const navigator = {onLine:true, serviceWorker:{register:async () => ({})}};
  const caches = {open:async () => ({keys:async () => [{url:'https://example.test/assets/word/candy.png'}]})};
  vm.runInNewContext(fs.readFileSync(__dirname+'/offline.js','utf8'), {
    window:root,navigator,caches,URL,Set,AbortSignal,location:{href:'https://example.test/app/games/picture-words.html'},
    fetch:async () => {throw new Error('offline');},
  });
  const offline = await root.NicolingoOffline.ready();
  assert.equal(offline.canPlay({pic:'candy'}),true);
  assert.equal(offline.canPlay({pic:'missing'}),false);
  handlers.online();
  assert.equal(offline.canPlay({pic:'missing'}),true);
  navigator.onLine = false;
  handlers.offline();
  assert.equal(offline.canPlay({pic:'missing'}),false);
});

test('service worker restores shell and illustration with the server unavailable', async () => {
  const handlers = {}, stored = new Map();
  const location = new URL('https://example.test/project/app/games/picture-words-sw.js');
  const cache = {match:async key => stored.get(key.url)?.clone(), put:async (key,value) => stored.set(key.url,value)};
  stored.set('https://example.test/project/app/games/picture-words/game.js',new Response('cached game'));
  stored.set('https://example.test/project/assets/word/candy.png',new Response('cached picture'));
  vm.runInNewContext(fs.readFileSync(__dirname+'/../picture-words-sw.js','utf8'), {
    self:{location,addEventListener:(name,fn) => handlers[name]=fn},URL,Request,Response,Set,
    caches:{open:async()=>cache},fetch:async()=>{throw new Error('offline');},
  });
  for (const [path,body] of [['app/games/picture-words/game.js?v=offline1','cached game'],['assets/word/candy.png','cached picture']]) {
    let result;
    handlers.fetch({request:new Request('https://example.test/project/'+path),respondWith:value=>result=value});
    assert.equal(await (await result).text(),body);
  }
  let intercepted = false;
  handlers.fetch({request:new Request('https://example.test/project/app/games/picture-words.html?connection-check'),respondWith:()=>intercepted=true});
  assert.equal(intercepted,false);
});

test('offline pack stays at twenty pictures and under five megabytes of artwork', () => {
  const scope = {window:{}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),scope);
  const pool = require('./difficulty.js').bilingualCatalog(scope.window.PICTURE_WORDS_CATALOG);
  const candy = pool.find(word => word.en === 'candy');
  const pack = [candy,...pool.filter(word => word !== candy)].slice(0,20);
  const path = require('node:path');
  const bytes = pack.reduce((sum,word)=>sum+fs.statSync(path.join(__dirname,'../../../assets/word',word.pic+'.png')).size,0);
  assert.equal(pack.length,20);
  assert.ok(bytes < 4500000, `Artwork pack grew to ${bytes} bytes`);
  assert.ok(fs.readFileSync(__dirname+'/../picture-words-sw.js','utf8').includes('if (shell) await cache.put'));
});
