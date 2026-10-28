const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const app=read('app.js'),html=read('../pictlingo-dictionary.html');
const rarity=require('../shared/rarity-presentation.js'),custom=require('../shared/custom-learning-levels.js');
const scope={window:{}};vm.runInNewContext(read('../data/generated-etymon/custom-learning-levels.js'),scope);
const levels=custom.create(JSON.parse(zlib.gunzipSync(Buffer.from(scope.window.ETYMON_CUSTOM_LEARNING_LEVELS.data,'base64'))));
vm.runInNewContext(read('data.js'),scope);const rows=scope.window.EIGO_NO_E.words;
const start=app.indexOf('function learningHTML('),end=app.indexOf('function imagePOS(',start);
const context={window:{EtymonRarity:rarity},customLevels:levels};vm.createContext(context);vm.runInContext(app.slice(start,end)+';this.renderLearning=learningHTML;',context);
const render=w=>context.renderLearning(w,'detail');

test('Pictlingo Dictionary removes the dedicated AI field and its three imports',()=>{
 assert(!/EnglishParaphrases|ETYMON_ENGLISH_PARAPHRASES|wordParaphrase|paraphrases/i.test(app));
 assert(!/english-paraphrases/.test(html));
 assert(html.includes('dictionary-basics.js'));
 assert(app.includes('meaningsHTML(w)')&&app.includes('captionHTML(w)')&&app.includes('pronunciationHTML(w)'));
});
test('all classified current dictionary rows render exactly their current independent level as stars',()=>{
 let classified=0;const seen=new Set();
 for(const w of rows){const d=levels.lookup(w);if(!w.w||!d)continue;classified++;seen.add(d.level);const output=render(w);assert.equal((output.match(/★/g)||[]).length,d.level,w.id);assert(output.includes('data-rarity-stars="'+d.level+'"'),w.id);}
 assert(classified>1000);assert(seen.size>=8);
});
test('puppy stars use exact current level and ignore legacy rarity',()=>{
 const puppy=rows.find(w=>w.id==='puppy');assert(puppy);const d=levels.lookup(puppy);assert(d);const expected=render(puppy);assert.equal((expected.match(/★/g)||[]).length,d.level);assert.equal(render({...puppy,r:99999}),expected);assert.equal(render({...puppy,r:1}),expected);
});
test('stale sense or absent level remains unclassified without fabricated stars',()=>{
 const puppy=rows.find(w=>w.id==='puppy');const output=render({...puppy,ja:'mismatched source sense'});assert.equal((output.match(/★/g)||[]).length,0);assert(output.includes('未分類'));assert.equal(render({...puppy,w:''}),'');
});
test('each card has one custom-level display and no old numeric rarity overlay',()=>{
 assert(!/rarityHTML|difficultyHTML|EtymonRarity\.numeric|custom-learning-label/.test(app));
 const tile=app.slice(app.indexOf('const tile ='),app.indexOf('const tile =')+1100);assert.equal((tile.match(/learningHTML\(w\)/g)||[]).length,1);
 const detail=app.slice(app.indexOf('function wordPage('),app.indexOf('function allPage('));assert.equal((detail.match(/learningHTML\(w,'detail'\)/g)||[]).length,1);assert(detail.indexOf('word-learning')<detail.indexOf('word-info'));
});
