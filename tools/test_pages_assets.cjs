const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.a={};this.nodeType=1;}setAttribute(k,v){this.a[k]=v;}getAttribute(k){return this.a[k];}hasAttribute(k){return k in this.a;}querySelectorAll(){return [];}}
class Img extends Element{set src(v){this.value=v;}get src(){return this.value;}set srcset(v){this.ss=v;}}
class Style{setProperty(k,v){this[k]=v;}}
let fetched;
const win={Element,HTMLImageElement:Img,CSSStyleDeclaration:Style,document:{currentScript:{src:'https://haibaratou.github.io/etymolingo/pages-assets.js'},baseURI:'https://haibaratou.github.io/etymolingo/app/games/picture-words.html',documentElement:{}},MutationObserver:class{observe(){}},URL,Request,fetch:async(u)=>{fetched=u;return {ok:true};}};win.window=win;
let code=fs.readFileSync('tools/pages-assets.template.js','utf8').replace('__RAW_BASE__',JSON.stringify('https://raw.githubusercontent.com/haibaratou/etymolingo/'+'a'.repeat(40)+'/')).replace('__MEDIA_PATHS__',JSON.stringify(['assets/word/café.png','app/games/picture-words/scene-assets/test.js']));vm.runInNewContext(code,win);
let img=new Img;img.src='../../assets/word/caf%C3%A9.png?v=1';assert.match(img.src,/raw.githubusercontent.com.*caf%C3%A9.png\?v=1/);assert.equal(img.crossOrigin,'anonymous');
assert.equal(win.ETYMON_ASSET_URL('../data/generated-etymon/words.json'),'../data/generated-etymon/words.json');assert.equal(win.ETYMON_ASSET_URL('https://example.com/a.png'),'https://example.com/a.png');
let e=new Element;e.setAttribute('src','../../assets/word/café.png');assert.match(e.getAttribute('src'),/raw.githubusercontent/);
win.fetch('picture-words/scene-assets/test.js');assert.match(fetched,/raw.githubusercontent/);
assert.match(win.ETYMON_ASSET_URL('../../assets/word/café.png'),/caf%C3%A9.png/);console.log('PASS media URL routing, query/Unicode, original metadata paths, cross-origin image canvas safety, pack fetch');
