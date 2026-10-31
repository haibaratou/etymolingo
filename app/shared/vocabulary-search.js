/* Cached vocabulary and exact image-reference lookup. No dictionary or image
   data is generated or changed here. All matching rows keep their own identity. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.VocabularySearch=api;
})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 function decode(value){try{return decodeURIComponent(value);}catch{return value;}}
 function cleanPath(value){
  let text=String(value||'').trim();
  if((text[0]==='"'&&text.at(-1)==='"')||(text[0]==="'"&&text.at(-1)==="'"))text=text.slice(1,-1);
  return decode(text.replace(/\\/g,'/').split(/[?#]/,1)[0]).toLowerCase();
 }
 function imageQuery(value){
  const path=cleanPath(value),file=path.slice(path.lastIndexOf('/')+1);
  return /\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(file)?{path,file}:null;
 }
 // A leading reconstruction marker requests an exact registered PIE key.
 // Preserve hyphens, parentheses and homograph numbers; this is not a wildcard.
 const rootText=value=>String(value||'').normalize('NFC').trim().toLowerCase();
 function rootQuery(value){
  const text=String(value||'').trim();
  return /^[*＊]/u.test(text)?rootText(text.slice(1)):null;
 }
 function matchingRoots(roots,value){
  const key=rootQuery(value);
  return key?roots.filter(r=>(!r.kind||r.kind==='pie')&&rootText(r.key)===key):[];
 }
 function createIndex(words,options={}){
  const images=new Map(),sceneRows=new Map(),cache=new Map();
  const rows=words.map((word,i)=>{
   const rootIDs=[...(word.p||[]),...(options.rootKeys?.(word)||[])];
   return {word,i,rootIDs,spelling:String(word.w||'').toLowerCase(),ja:String(word.ja||''),kana:String(word.k||''),
    tags:(word.semanticTags||[]).join('\0').toLowerCase(),roots:rootIDs.join('\0').toLowerCase(),scene:''};
  });
  const byRarity=rows.slice().sort((a,b)=>((a.word.r??9e9)-(b.word.r??9e9))||a.i-b.i);
  const add=(map,key,row)=>{if(!key)return;let values=map.get(key);if(!values)map.set(key,values=new Set());values.add(row);};
  for(const row of rows){
   for(const value of options.imageURLs?.(row.word)||[]){
    const raw=cleanPath(value);add(images,raw,row);add(images,raw.slice(raw.lastIndexOf('/')+1),row);
    try{const url=new URL(value,options.baseURL);const absolute=cleanPath(url.href);add(images,absolute,row);add(images,cleanPath(url.pathname),row);}catch{}
   }
   const key=options.sceneKey?.(row.word);if(key)add(sceneRows,key,row);
  }
  let scenesReady=false,version=0;
  function remember(query,value){cache.set(query,value);if(cache.size>12)cache.delete(cache.keys().next().value);return value;}
  function search(value){
   const query=String(value||'').trim();
   if(!query)return words;
   if(cache.has(query))return cache.get(query);
   if(rootQuery(query)!==null){
    const keys=new Set(matchingRoots(options.roots||[],query).map(r=>r.key));
    const members=options.rootMembers?new Set([...keys].flatMap(key=>options.rootMembers(key)||[])):null;
    return remember(query,byRarity.filter(row=>members?members.has(row.word):row.rootIDs.some(key=>keys.has(key))).map(row=>row.word));
   }
   const image=imageQuery(query);
   if(image){
    const found=images.get(image.path)||images.get(image.file);
    const result=found?[...found].sort((a,b)=>((a.word.r??9e9)-(b.word.r??9e9))||a.i-b.i).map(row=>row.word):[];
    return remember(query,result);
   }
   const ql=query.toLowerCase(),buckets=[[],[],[],[],[],[],[]];
   for(const row of byRarity){
    let score=-1;
    if(row.spelling===ql)score=0;
    else if(row.spelling.startsWith(ql))score=1;
    else if(row.spelling.includes(ql))score=2;
    else if(row.ja===query||(row.kana&&row.kana===query))score=3;
    else if(row.ja.includes(query)||(row.kana&&row.kana.includes(query)))score=4;
    else if(row.tags.includes(ql)||row.scene.includes(ql)||row.roots.includes(ql))score=5;
    if(score>=0)buckets[score].push(row.word);
   }
   return remember(query,buckets.flat());
  }
  function setScenes(entries,helpers){
   for(const row of rows)row.scene='';
   for(const entry of entries||[]){
    if((entry.status||entry.review?.status)!=='reviewed')continue;
    for(const row of sceneRows.get(helpers.key(entry))||[]){
     if(helpers.matches(entry,row.word))row.scene=(String(entry.scene?.en||'')+' '+String(entry.scene?.ja||'')).toLowerCase();
    }
   }
   scenesReady=true;version++;cache.clear();
  }
  return {search,setScenes,get scenesReady(){return scenesReady;},get version(){return version;},
   stats:()=>({records:rows.length,image_aliases:images.size,scene_keys:sceneRows.size,cached_queries:cache.size})};
 }
 function createLatestScheduler(run,options={}){
  const request=options.request||((fn)=>typeof requestAnimationFrame==='function'?requestAnimationFrame(fn):setTimeout(fn,0));
  const cancel=options.cancel||((id)=>typeof cancelAnimationFrame==='function'?cancelAnimationFrame(id):clearTimeout(id));
  let handle=null,pending=false,latest;
  function flush(){
   if(handle!==null){cancel(handle);handle=null;}
   if(!pending)return;
   pending=false;const value=latest;latest=undefined;run(value);
  }
  function schedule(value){latest=value;pending=true;if(handle===null)handle=request(()=>{handle=null;flush();});}
  function stop(){if(handle!==null)cancel(handle);handle=null;pending=false;latest=undefined;}
  return {schedule,flush,cancel:stop,get pending(){return pending;}};
 }
 return {createIndex,createLatestScheduler,imageQuery,rootQuery,matchingRoots};
});
