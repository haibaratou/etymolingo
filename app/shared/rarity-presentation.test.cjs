const test=require('node:test'),assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'../..'),api=require('./rarity-presentation.js');
test('legacy API compatibility keeps fixed thresholds for callers outside this migration',()=>{for(const [r,n] of [[1,1],[400,2],[600,3],[800,4],[1000,5],[1400,6],[1800,7]])assert.equal(api.numeric(r).stars,n);});
test('missing, invalid and sentinel values remain visibly unknown',()=>{for(const r of [null,undefined,0,-1,NaN,Infinity,'400',99999]){const m=api.numeric(r);assert.equal(m.stars,0);assert.equal(m.label,'レア度未確認');}});
test('existing five and seven star counts are preserved without remapping gameplay',()=>{for(const scale of [5,7])for(let n=1;n<=scale;n++){const m=api.band(n,scale,'original label');assert.equal(m.stars,n);assert.equal(m.scale,scale);assert.equal(m.label,'original label');assert.ok(api.html(m).includes('data-rarity-stars="'+n+'"'));}assert.equal(api.band(3,5).theme,3);assert.equal(api.band(5,5).theme,6);});
test('labels are escaped and learning levels are explicitly separate',()=>{const html=api.html(api.band(3,5,'<script>bad</script>'));assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('独自学習レベルとは別'));});
test('reference palette and slow gradients retained, list motion disabled',()=>{const css=fs.readFileSync(path.join(__dirname,'rarity-presentation.css'),'utf8');for(const color of ['#8fa39a','#3ecfa5','#4aa8ff','#9a6ee0','#7b5cd6','#ff5470','#6b4f1d'])assert.ok(css.includes(color));assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/\.er-list\{animation:none!important\}/);assert.match(css,/forced-colors:active/);});
function extract(s,name){const i=s.indexOf('function '+name+'(');assert.ok(i>=0);let at=s.indexOf('{',i),depth=0;for(let j=at;j<s.length;j++){if(s[j]==='{')depth++;if(s[j]==='}'&&!--depth)return s.slice(i,j+1);}throw Error(name);}
test('active game stars no longer use collection bands or old rank data',()=>{
 const game=fs.readFileSync(path.join(root,'app/support/picture-words/game.js'),'utf8');
 assert(!/originalRarityBands|rarityBandFor|questRanks|PQ_DATA/.test(game));
 assert.match(game,/const count = wordLevel\(word\)/);
 assert.match(game,/const KEY = 'word-bloom-v1'/);assert.match(extract(game,'readSave'),/answerRecords/);assert.match(extract(game,'readSave'),/discovery: discovery.hydrate/);
 const sw=fs.readFileSync(path.join(root,'app/support/picture-words-sw.js'),'utf8');
 assert(!/english-paraphrases|dictionary-basics|quest-data/.test(sw));
});
test('active game and dictionary entry scripts parse without retired entrance files',()=>{
 for(const file of ['app/pictlingo-game.html','app/pictlingo-dictionary.html','app/etymopedia.html','app/wild-wordopia.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))if(m[2].trim()&&!/application\/json/.test(m[1]))new vm.Script(m[2]);
 }
});
