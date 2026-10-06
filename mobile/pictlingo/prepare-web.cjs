const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const out = path.join(__dirname, 'www');
const runtime = 'app/games/picture-words';
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root,runtime,'catalog.js'),'utf8'),ctx);
const rules = require(path.join(root,runtime,'reviewed-scenes.js'));
const candidates = ctx.window.PICTURE_WORDS_CATALOG.filter(w => rules.supportsLanguage(w,'ja') && rules.supportsLanguage(w,'en') && rules.validCaption(w) && rules.hasPack(w) && w.recordedUpdatedAt >= '2026-09-10');
const words=[]; let packBytes=0;
// Small offline preview: vary lengths without downloading the whole artwork library.
const buckets = Array.from({length:4},()=>[]);
for(const w of candidates) buckets[Math.min(3,Math.floor((Math.max(w.en.length,w.w.length)-1)/3))].push(w);
for(let n=0; words.length<40 && buckets.some(b=>b.length); n++) {
  const w=buckets[n%4].shift(); if(!w)continue;
  const p=path.join(root,'app/games',w.sceneAsset);
  if(!fs.existsSync(p))continue;
  const size=fs.statSync(p).size;
  if(packBytes+size>6_000_000)continue;
  const png=fs.readFileSync(path.join(root,w.image.path));
  if(crypto.createHash('sha256').update(png).digest('hex')!==w.image.sha256)continue;
  words.push(w);packBytes+=size;
}
if(words.length<10)throw Error('Not enough verified offline puzzles');
fs.mkdirSync(out,{recursive:true});
// Only this generated directory can be removed, never repository data.
if(path.dirname(out)!==__dirname || path.basename(out)!=='www')throw Error('Unsafe output');
fs.rmSync(out,{recursive:true,force:true});
function write(rel,text){const p=path.join(out,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text);}
function copy(rel){const p=path.join(out,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(root,rel),p);}
for(const name of ['style.css','difficulty.js','gesture.js','pronunciation.js','progression.js','reviewed-scenes.js','game.js'])copy(runtime+'/'+name);
for(const name of ['illustration-scenes.js','illustration-scenes.css'])copy('app/shared/'+name);
copy('assets/ui/word_et_star.png');copy('assets/word/candy.png');
for(const w of words){copy('app/games/'+w.sceneAsset);copy(w.image.path);}
const meta={...ctx.window.PICTURE_WORDS_CATALOG_META,count:words.length,androidPreview:true};
write(runtime+'/catalog.js','window.PICTURE_WORDS_CATALOG_META='+JSON.stringify(meta)+';\nwindow.PICTURE_WORDS_CATALOG='+JSON.stringify(words)+';');
write('index.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pictlingo</title><script>location.replace("app/games/picture-words.html?phone=1")</script></head><body></body></html>');
let html=fs.readFileSync(path.join(root,'app/games/picture-words.html'),'utf8');
html=html.replace(/\s*<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/g,'').replace(/\s*<link rel="manifest"[^>]*>/,'').replace(/\s*<script src="picture-words\/desktop.js[^>]*><\/script>/,'');
html=html.replace('<script src="picture-words/catalog.js','<script src="picture-words/capacitor.js" defer></script>\n  <script src="picture-words/native-bridge.js" defer></script>\n  <script src="picture-words/catalog.js');
html=html.replace('<a href="../index.html">ゲーム一覧へ</a>','<button type="button" id="exitApp">閉じる</button>');
html=html.replace('</head>','<style>#saveOffline{display:none!important}body{overscroll-behavior:none}#exitApp{background:none;color:inherit;padding:12px;font:inherit}</style></head>');
write('app/games/picture-words.html',html);
write(runtime+'/native-bridge.js',fs.readFileSync(path.join(__dirname,'native-bridge.js'),'utf8'));
write(runtime+'/capacitor.js',fs.readFileSync(path.join(__dirname,'node_modules/@capacitor/core/dist/capacitor.js'),'utf8'));
write(runtime+'/offline.js',`(() => { const ids=new Set(window.PICTURE_WORDS_CATALOG.map(w=>w.id)); const api={state:{online:false,supported:false},ready:async()=>api,refresh:async()=>{},canPlay:w=>ids.has(w.id),hasSavedScene:w=>ids.has(w.id)}; window.NicolingoOffline=api; })();`);
let speech=fs.readFileSync(path.join(out,runtime,'pronunciation.js'),'utf8');
speech=speech.replace('synth = root.speechSynthesis, Utterance = root.SpeechSynthesisUtterance','synth = root.PictlingoNativeSpeech?.synth || root.speechSynthesis, Utterance = root.PictlingoNativeSpeech?.Utterance || root.SpeechSynthesisUtterance');
write(runtime+'/pronunciation.js',speech);
let game=fs.readFileSync(path.join(out,runtime,'game.js'),'utf8');
game=game.replace('`../etymon-explorer.html#words/q=', '`https://haibaratou.github.io/etymolingo/app/etymon-explorer.html#words/q=');
write(runtime+'/game.js',game);
const manifest={schema:1,questions:words.length,packBytes,ids:words.map(w=>w.id),sourceCatalogSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,runtime,'catalog.js'))).digest('hex')};
write('bundle-manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({questions:words.length,packBytes},null,2));
