'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {parseHTML}=require('../../../tests/explorer-dom/node_modules/linkedom');
const {csv}=require('./build-data.cjs');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('file-mode page loads current texts and every difficulty group without mutating images or storage (browserless DOM)',async()=>{
 const html=read('app/etymopedia.html').split('\n').map(l=>l.startsWith('const EMB_IMG =')?'const EMB_IMG = {};':l).join('\n');
 const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].at(-1)[1].split('/* ---- 起動 ---- */')[0];
 const {document}=parseHTML(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
 const stored=new Map([['etymo_likes3','{"head#0":2}'],['lexi_item_art','{"head":"data:image/png;base64,USER_ART"}']]),beforeStorage=JSON.stringify([...stored]),writes=[];
 const context={document,console,crypto:globalThis.crypto,TextDecoder,TextEncoder,Blob,Response,DecompressionStream,atob,Uint8Array,
  location:{protocol:'file:',hash:'#/word/head'},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>{writes.push(k);stored.set(k,v);}},
  fetch:async()=>{throw Error('No file fetch');},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},scrollTo(){},ResizeObserver:class{observe(){}disconnect(){}},
  EtymonDifficultyV2:require('../../shared/explorer-difficulty-v2.js')};
 context.window=context;vm.createContext(context);
 for(const p of ['app/data/generated-etymon/weblio-learning-levels.js','app/data/generated-etymon/learning-levels.js','app/support/etymopedia/current-data.js','app/support/etymopedia/learning-levels.js'])vm.runInContext(read(p),context);
 vm.runInContext(script+'\nthis.pageState=()=>({WORDS,ROOTS,LEXICON,byId,LEVELS});',context);
 await vm.runInContext('loadAll()',context);
 const state=context.pageState(),legacyRoots=csv(read('app/data/roots.csv'));
 assert.ok(state.LEVELS);assert.equal(Object.keys(state.ROOTS).length,12);
 for(const legacy of legacyRoots){const current=state.ROOTS[legacy.id];assert.equal(current.art,legacy.art);assert.equal(current.concept,legacy.concept);}
 assert.equal(JSON.stringify([...stored]),beforeStorage);assert.deepEqual(writes,[]);
 const head=state.byId.head;assert.equal(head.pos,'名/動');assert.equal(head.jp,'頭、首長');
 vm.runInContext('renderWord("head")',context);await new Promise(resolve=>setImmediate(resolve));
 const star=document.querySelector('.entryStars [data-etymopedia-difficulty]');assert.ok(star);assert.equal(Number(star.dataset.stars),state.LEVELS.lookup(head).level/2);
 assert.equal(document.querySelector('.pimg img').getAttribute('src'),'data:image/png;base64,USER_ART');
 assert.equal(document.querySelectorAll('.entryStars [data-etymopedia-difficulty]').length,1,'no duplicate rarity indicator');
 const lists=[];
 for(const id of Object.keys(state.ROOTS)){
  vm.runInContext('renderRoot('+JSON.stringify(id)+')',context);
  const groups=[...document.querySelectorAll('.tierBox summary [data-etymopedia-difficulty]')].map(el=>el.dataset.level===''?null:Number(el.dataset.level));
  assert.deepEqual(groups,[...groups].sort((a,b)=>(a??99)-(b??99)));
  assert.ok(groups.every(n=>n===null||(n>=1&&n<=10)));
  lists.push({id,groups,rows:document.querySelectorAll('.drow').length});
 }
 const featuredCounts={},lexiconCounts={};
 for(const row of state.WORDS){const s=state.LEVELS.status(row).status;featuredCounts[s]=(featuredCounts[s]||0)+1;}
 for(const arr of Object.values(state.LEXICON))for(const [w,via,jp,note,p] of arr){const s=state.LEVELS.status({w,jp,p}).status;lexiconCounts[s]=(lexiconCounts[s]||0)+1;}
 assert.equal(state.LEVELS.status({w:'merlin',p:['mori-'],jp:'魔法使いマーリン'}).status,'sense_hold');
 console.log(JSON.stringify({featuredCounts,lexiconCounts,roots:lists.length,renderedRows:lists.reduce((n,r)=>n+r.rows,0)}));
});
