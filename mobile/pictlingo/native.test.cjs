const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const rules=require(path.join(root,'app/games/picture-words/reviewed-scenes.js'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'www/app/games/picture-words/catalog.js'),'utf8'),context);
const words=context.window.PICTURE_WORDS_CATALOG;
const bundledIds=new Set(JSON.parse(fs.readFileSync(path.join(__dirname,'www/bundle-manifest.json'))).ids);
const bundled=words.filter(w=>bundledIds.has(w.id));
async function offlineRuntime() {
  const w={WordBloomReviewedScenes:{...rules},PICTLINGO_BUNDLED_IDS:[...bundledIds]};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'mobile-data.js'),'utf8'),{window:w,URL,Uint8Array,btoa});
  await w.NicolingoOffline.ready();
  return new w.WordBloomReviewedScenes.Runtime({meta:context.window.PICTURE_WORDS_CATALOG_META,crypto:webcrypto,location:{protocol:'https:',href:'https://localhost/app/games/picture-words.html'},navigator:{onLine:false},offline:w.NicolingoOffline,makeImageURL:()=> 'verified-local-image',fetcher:async url=>{
    const parsed=new URL(url);
    assert.equal(parsed.origin,'https://localhost','External network forbidden');
    assert.match(parsed.pathname,/^\/assets\/pictlingo\/[a-f0-9]{64}\.webp$/);
    const b=fs.readFileSync(path.join(__dirname,'www',parsed.pathname));
    return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};
  }});
}
test('all 1086 images retain their reviewed source binding and are bundled once',async()=>{
  assert.ok(words.length>1000);assert.equal(bundled.length,words.length,'All images must be bundled');
  const runtime=await offlineRuntime();
  for(const w of words){
    assert.ok(rules.supportsLanguage(w,'ja'),w.id);assert.ok(rules.supportsLanguage(w,'en'),w.id);assert.ok(rules.validCaption(w),w.id);
    const original=fs.readFileSync(path.join(root,w.image.path));
    assert.equal(await runtime.digest('SHA-256',original),w.androidImage.sourceSha256);
    await runtime.verifyImage(w,await runtime.loadPack(w));
  }
  assert.equal(fs.existsSync(path.join(__dirname,'www/app/games/picture-words/scene-assets')),false);
});
test('every compressed image and caption can be prepared with external networking forbidden',async()=>{
  const runtime=await offlineRuntime();
  for(const w of bundled){const result=await runtime.prepare(w);assert.equal(result.playable,true,w.id+': '+result.reason);assert.equal(result.imageVerified,true,w.id);assert.equal(result.ttsAllowed,true,w.id);}
});
test('corrupt compressed data and wrong source bindings fail verification',async()=>{
  const runtime=await offlineRuntime(),w=words[0],bytes=await runtime.loadPack(w);
  const bad=bytes.slice();bad[bad.length-1]^=1;
  await assert.rejects(runtime.verifyImage(w,bad),/invalid-derivative/);
  await assert.rejects(runtime.loadPack({...w,androidImage:{...w.androidImage,sourceSha256:'0'.repeat(64)}}),/invalid-derivative/);
});
test('Android speech receives the word and real synthesis rate and ignores stale events',async()=>{
  let callback;const calls=[];let ready;
  const native={addListener:async(_,fn)=>{callback=fn;},getVoices:async()=>({voices:[{lang:'ja-JP',localService:true}]}),speak:async args=>calls.push(args),stop:async()=>{},exit:async()=>{}};
  const w={Capacitor:{isNativePlatform:()=>true,registerPlugin:()=>native}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'native-bridge.js'),'utf8'),{window:w,document:{addEventListener:()=>{}}});
  const {synth,Utterance}=w.PictlingoNativeSpeech;
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(synth.getVoices()[0].lang,'ja-JP');
  let ended=0;const u=new Utterance('めがね');u.lang='ja-JP';u.rate=.65;u.onend=()=>ended++;
  synth.speak(u);assert.equal(calls[0].rate,.65);assert.equal(calls[0].text,'めがね');
  synth.cancel();callback({id:calls[0].id,state:'done'});assert.equal(ended,0);
  u.rate=1;synth.speak(u);callback({id:calls[1].id,state:'done'});assert.equal(ended,1);
});
