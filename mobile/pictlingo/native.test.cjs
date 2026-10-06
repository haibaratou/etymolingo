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
test('every bundled puzzle has verified artwork, a reviewed caption and both language answers',async()=>{
  assert.ok(words.length>=10 && words.length<=40);
  for(const w of words){
    assert.ok(rules.supportsLanguage(w,'ja'),w.id);assert.ok(rules.supportsLanguage(w,'en'),w.id);
    assert.ok(rules.validCaption(w),w.id);
    await rules.verifyPackScript(w,fs.readFileSync(path.join(__dirname,'www/app/games',w.sceneAsset),'utf8'),webcrypto);
  }
});
test('offline runtime can verify and prepare every image without networking',async()=>{
  const c={window:{},atob,TextEncoder,Uint8Array};
  for(const w of words)vm.runInNewContext(fs.readFileSync(path.join(__dirname,'www/app/games',w.sceneAsset),'utf8'),c);
  const runtime=new rules.Runtime({meta:context.window.PICTURE_WORDS_CATALOG_META,crypto:webcrypto,location:{protocol:'https:',href:'https://localhost/app/games/picture-words.html'},navigator:{onLine:false},assetRoot:c.window,makeImageURL:()=> 'verified-local-image',fetcher:()=>{throw Error('Network forbidden');}});
  for(const w of words){const result=await runtime.prepare(w);assert.equal(result.playable,true,w.id+': '+result.reason);assert.equal(result.imageVerified,true,w.id);assert.equal(result.ttsAllowed,true,w.id);}
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
