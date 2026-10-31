'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
function contextFor(html){
 const runtime=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].trim()&&m[2].includes('function baseWords()'))[2];
 const words=JSON.parse(read('app/data/generated-etymon/words.json')),roots=JSON.parse(read('app/data/generated-etymon/roots.json'));
 const affixes=JSON.parse(read('app/data/generated-etymon/affixes.json')),parts=JSON.parse(read('app/data/generated-etymon/word-parts.json'));
 const art={};vm.createContext(art);vm.runInContext(read('assets/word/illustration-index.js'),art);
 const identity=require('../../shared/lexical-identity.js'),scenes=require('../../shared/illustration-scenes.js'),origins=require('../../shared/etymology-origins.js');
 const components=require('../../shared/etymological-components.js'),componentsUI=require('../../shared/vocabulary-components-ui.js');
 const componentPayload=require('../../shared/component-payload-node.cjs').readPayload(path.join(root,'app/data/generated-etymon'),{roots});
 const binding=components.bind(words,components.prepare(componentPayload,roots));
 identity.applyArtwork(words,art.ETYMON_WORD_ART||{});
 words.forEach((word,i)=>{word.i=i;});
 const clash=new Set(),names=new Set(),seen=new Map(),seenNames=new Map();
 const raw=w=>w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,'').replace(/\s+/g,'_').replace(/[^A-Za-z0-9_-]/g,'');
 for(const word of words){const k=word.w.toLowerCase();if(seen.has(k)&&seen.get(k)!==word.w)clash.add(k);else seen.set(k,word.w);
  const n=raw(word.w);if(seenNames.has(n)&&seenNames.get(n)!==word.w)names.add(n);else seenNames.set(n,word.w);}
 const sceneEntries=JSON.parse(read('app/data/generated-etymon/illustration-scenes.json')).entries;
 const sceneMap=new Map();for(const entry of sceneEntries)if((entry.status||entry.review?.status)==='reviewed')sceneMap.set(scenes.key(entry),entry);
 let sceneLookups=0;
 const context={console,WORDS:words,ROOTS:roots,AFFIXES:affixes,WORD_PARTS:parts,byRoot:new Map(),CASE_CLASH:clash,NAME_CLASH:names,
  PIE_V:'profile',ROOT_BY:new Map(roots.map(r=>[r.key,r])),AFFIX_T:new Map(affixes.map(a=>[a.name,a.t])),
  F:{min:'',max:'',originFamilies:[],originLanguages:[],pos:'',comp:false,noroot:false,rootType:'',pic:'',tag:'',review:false,sortCol:'r',sortDir:1},mode:'words',q:'',SEARCH_INDEX:null,hasMemo:()=>false,memoOf:()=>({}),
  COMPONENTS:binding,componentCoverage:w=>binding.coverage(w),
  window:{IllustrationScenes:scenes,EtymonOrigins:origins,VocabularyComponentsUI:componentsUI},POS_RANK:['名','動','助','形','副','前','代','接','間','冠','数','接頭','句'],
  wLangs:origins.families,wOriginLanguages:origins.languages};
 const functionText=name=>{const at=runtime.indexOf('function '+name+'(');if(at<0)throw Error('Missing '+name);return runtime.slice(at,runtime.indexOf('\n}',at)+2);};
 const snippets=[runtime.match(/^const esc=.*$/m)[0],runtime.match(/const safeWordAssetName=word=>\{[\s\S]*?\n\};/)[0],runtime.match(/^const wordImageURL=.*$/m)[0],runtime.match(/^const wordImageHTML=.*$/m)[0],
  runtime.slice(runtime.indexOf('const GTAG_K='),runtime.indexOf('/* 一般辞書として')),
  ...['baseWords','applyFilters','cmpBy','posKey','generalDictIssue','hasPieRoot','rootLabel','rootChip','wordParts','affixChips','langTag','langTags','rowHTML'].map(functionText),
  runtime.match(/^function originLanguageTags.*$/m)[0],runtime.match(/^function semanticLine.*$/m)[0]];
 vm.createContext(context);vm.runInContext(snippets.join('\n'),context);
 if(runtime.includes('function wordSearchImageURLs('))vm.runInContext(functionText('wordSearchImageURLs'),context);
 context.sceneSearchText=word=>{sceneLookups++;const entry=sceneMap.get(scenes.key({...word,art:word.pica||context.safeArtName(word.w)}));return entry&&scenes.firstSenseMatches(entry,word)?(entry.scene.en+' '+entry.scene.ja).toLowerCase():'';};
 vm.runInContext('globalThis.safeArtName=safeWordAssetName;globalThis.imageURL=wordImageURL;',context);
 return {context,words,roots,sceneEntries,identity,scenes,getSceneLookups:()=>sceneLookups,functionText};
}
function run(){
 const out=process.argv[2]||'work/search-performance-20261028/search-profile.json';
 const savedBefore='work/search-performance-20261028/vocabulary-master.before.html';
 const beforePath=fs.existsSync(path.join(root,savedBefore))?savedBefore:'app/vocabulary-master.html';
 const htmlBefore=read(beforePath),env=contextFor(htmlBefore),{context,words}=env;
 const helperPath=path.join(root,'app/shared/vocabulary-search.js');
 let index=null,indexMs=null;
 if(fs.existsSync(helperPath)){
  const helper=require(helperPath),start=performance.now();
  index=helper.createIndex(words,{roots:env.roots,baseURL:'https://example.invalid/etymolingo/app/vocabulary-master.html',
   imageURLs:word=>[...(word.pica||word.pic?[context.imageURL(word)]:[]),...(word.etymology_art?[context.imageURL({...word,pica:word.etymology_art})]:[]),...(word.art_senses||[]).filter(s=>s.art).map(s=>context.imageURL({...word,pica:s.art}))],
   sceneKey:word=>env.scenes.key({w:word.w,p:word.p,etymology_id:word.etymology_id,art:word.pica||context.safeArtName(word.w)})});
  index.setScenes(env.sceneEntries,{key:env.scenes.key,matches:env.scenes.firstSenseMatches});indexMs=performance.now()-start;
 }
 const measurements=[];
 for(const query of ['b','bo','board','board.png','水','water','zzzz-no-match']){
  context.q=query;
  const oldLookup=env.getSceneLookups(),t0=performance.now(),oldRows=context.baseWords(),t1=performance.now();
  const oldTwice=context.baseWords(),t2=performance.now();
  const markup=context.applyFilters(oldRows).slice(0,400).map(context.rowHTML).join(''),t3=performance.now();
  const entry={query,before_matches:oldRows.length,before_single_search_ms:+(t1-t0).toFixed(2),before_duplicate_search_ms:+(t2-t1).toFixed(2),before_two_scans_ms:+(t2-t0).toFixed(2),
   repeated_scene_key_lookups:env.getSceneLookups()-oldLookup,row_markup_400_max_ms:+(t3-t2).toFixed(2),row_markup_bytes:Buffer.byteLength(markup),
   before_result_sha256:hash(JSON.stringify(oldRows.map(env.identity.key)))};
  if(index){const a=performance.now(),next=index.search(query),b=performance.now(),again=index.search(query),c=performance.now();entry.after_matches=next.length;entry.after_single_search_ms=+(b-a).toFixed(2);entry.after_cached_search_ms=+(c-b).toFixed(3);entry.after_two_calls_ms=+(c-a).toFixed(2);entry.after_result_sha256=hash(JSON.stringify(next.map(env.identity.key)));entry.same_cached_array=next===again;entry.before_ordinary_results_preserved=entry.before_result_sha256===entry.after_result_sha256;
   const m=performance.now();const paint=context.applyFilters(next).slice(0,100).map(context.rowHTML).join('');entry.after_row_markup_100_max_ms=+(performance.now()-m).toFixed(2);entry.after_row_markup_bytes=Buffer.byteLength(paint);}
  measurements.push(entry);
 }
 const report={scope:'Node real-public-data profiling; actual HTML string generation, no browser DOM/layout timing',records:words.length,index_build_including_scenes_ms:indexMs,queries:measurements,
  findings:['Before: each renderToolbar and renderTable call independently scans WORDS.','Before: every scene text lookup clones a whole word and creates an exact image key; scene-ready repaint repeats the search again.','The 700ms timer saves history only; it does not debounce the expensive input rendering.'],
  inputs:{before_html_sha256:hash(htmlBefore),words_sha256:hash(read('app/data/generated-etymon/words.json')),helper_sha256:fs.existsSync(helperPath)?hash(fs.readFileSync(helperPath)):null}};
 fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});fs.writeFileSync(path.join(root,out),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
if(require.main===module)run();else module.exports={contextFor};
