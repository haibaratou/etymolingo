/* Explicit component-origin columns. Legacy g/gs are preserved and never used
   to guess a historical source language. The same helper works over HTTP/file. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.EtymonOrigins=api;
})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const familyOrder=['ゲルマン','ロマンス','ギリシャ','ケルト','イラン','インド・アーリア','スラヴ','アルバニア','セム','日琉','シナ','朝鮮','テュルク','マレー・ポリネシア','ドラヴィダ','ウラル','バスク'];
 const unique=value=>[...new Set((Array.isArray(value)?value:[]).filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))];
 function identity(row){return JSON.stringify([row.w||'',row.p||[],row.etymology_id||'']);}
 function families(row){return unique(row?.origin_families);}
 function languages(row){return unique(row?.origin_languages);}
 function matches(row,selectedFamilies=[],selectedLanguages=[]){
  return (!selectedFamilies.length||selectedFamilies.some(x=>families(row).includes(x)))
   &&(!selectedLanguages.length||selectedLanguages.some(x=>languages(row).includes(x)));
 }
 function prepare(payload){
  if(!payload||payload.schema!==1||!Array.isArray(payload.languages)||!Array.isArray(payload.entries))throw Error('Invalid origin-tag schema');
  const languageMap=new Map();
  for(const row of payload.languages){
   if(typeof row.label!=='string'||!row.label.trim()||typeof row.family!=='string'||!row.family.trim())throw Error('Invalid origin-language metadata');
   if(languageMap.has(row.label))throw Error('Duplicate origin language: '+row.label);
   languageMap.set(row.label,{id:row.id||row.label,label:row.label,family:row.family});
  }
  const entries=new Map(),ambiguous=new Set();
  for(const row of payload.entries){
   const key=identity(row);
   const fs=families(row),ls=languages(row);
   if(ls.some(l=>!languageMap.has(l)||!fs.includes(languageMap.get(l).family)))throw Error('Inconsistent origin-language family: '+key);
   // A duplicate exact source identity cannot select one sense safely. Hold
   // only that identity; unrelated entries must remain available.
   if(ambiguous.has(key))continue;
   if(entries.has(key)){entries.delete(key);ambiguous.add(key);continue;}
   entries.set(key,{...row,origin_families:fs,origin_languages:ls});
  }
  return {languages:languageMap,entries,ambiguous};
 }
 function bind(words,prepared){
  const counts=new Map();for(const row of words){const key=identity(row);counts.set(key,(counts.get(key)||0)+1);}
  let matched=0,stale=0,ambiguous=0,unclassified=0;
  for(const word of words){
   const key=identity(word),entry=prepared.entries.get(key);
   const valid=entry&&counts.get(key)===1
    &&(entry.before_ja===undefined||entry.before_ja===(word.ja||''))
    &&(entry.before_en===undefined||entry.before_en===(word.en||''))
    &&(entry.before_g===undefined||entry.before_g===(word.g||''))
    &&(entry.before_gs===undefined||JSON.stringify(unique(entry.before_gs).sort())===JSON.stringify(unique(word.gs).sort()));
   word.origin_families=valid?[...entry.origin_families]:[];
   word.origin_languages=valid?[...entry.origin_languages]:[];
   if(valid)matched++;else if(entry)stale++;
   if(counts.get(key)!==1||prepared.ambiguous?.has(key))ambiguous++;
   if(!word.origin_families.length||!word.origin_languages.length)unclassified++;
  }
  return {total:words.length,matched,stale,ambiguous,unclassified};
 }
 function wordPartsKey(row){return JSON.stringify([row.w||'',(row.p||[]).join('+')]);}
 function bindWordParts(words,parts,payload){
  if(!payload||payload.schema!==1||!Array.isArray(payload.entries)||!parts||typeof parts!=='object'||Array.isArray(parts))throw Error('Invalid word-parts supplement');
  const counts=new Map(),oldCounts=new Map(),current=new Map(),entryCounts=new Map(),entryOldCounts=new Map();
  const count=(map,key)=>map.set(key,(map.get(key)||0)+1);
  for(const word of words){const key=identity(word);count(counts,key);count(oldCounts,wordPartsKey(word));current.set(key,word);}
  for(const entry of payload.entries){
   if(!entry||typeof entry.w!=='string'||!Array.isArray(entry.p)||entry.p.some(p=>typeof p!=='string'))throw Error('Invalid word-parts supplement identity');
   count(entryCounts,identity(entry));count(entryOldCounts,wordPartsKey(entry));
  }
  const result={total:payload.entries.length,added:0,alreadyPresent:0,stale:0,ambiguous:0,missing:0};
  for(const entry of payload.entries){
   const key=identity(entry),oldKey=wordPartsKey(entry),word=current.get(key);
   if(!word){result.missing++;continue;}
   if(counts.get(key)!==1||oldCounts.get(oldKey)!==1||entryCounts.get(key)!==1||entryOldCounts.get(oldKey)!==1){result.ambiguous++;continue;}
   const valid=['before_g','before_ja','before_en'].every(field=>Object.hasOwn(entry,field)&&typeof entry[field]==='string')
    &&entry.before_g===(word.g||'')&&entry.before_ja===(word.ja||'')&&entry.before_en===(word.en||'')
    &&(entry.before_gs===undefined||JSON.stringify(unique(entry.before_gs).sort())===JSON.stringify(unique(word.gs).sort()))
    &&typeof entry.parts==='string'&&entry.parts.trim();
   if(!valid){result.stale++;continue;}
   const existing=parts[oldKey];
   if(existing!==undefined&&existing!==null&&(typeof existing!=='string'||existing.trim())){result.alreadyPresent++;continue;}
   parts[oldKey]=entry.parts;result.added++;
  }
  return result;
 }
 function availableLanguages(words,prepared,selectedFamilies=[]){
  const have=new Set(words.flatMap(languages));
  return [...prepared.languages.values()].filter(row=>have.has(row.label)
   &&(!selectedFamilies.length||selectedFamilies.includes(row.family)))
   .sort((a,b)=>a.label.localeCompare(b.label,'ja'));
 }
 function availableFamilies(words){
  const have=unique(words.flatMap(families));
  const rank=x=>{const i=familyOrder.indexOf(x);return i<0?999:i;};
  return have.sort((a,b)=>rank(a)-rank(b)||a.localeCompare(b,'ja'));
 }
 function toggleFamily(state,family,prepared){
  const selected=unique(state.originFamilies);
  state.originFamilies=selected.includes(family)?selected.filter(x=>x!==family):[...selected,family];
  if(state.originFamilies.length)state.originLanguages=unique(state.originLanguages).filter(l=>state.originFamilies.includes(prepared.languages.get(l)?.family));
 }
 return {identity,families,languages,matches,prepare,bind,wordPartsKey,bindWordParts,availableLanguages,availableFamilies,toggleFamily};
});
