/* Stable sense keys shared by the development dictionary. A rootless origin
   never inherits a spelling-only image or another origin's personal note. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.EtymonLexicalIdentity=api;
})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 function key(row,joined=false){
  const fields=[row.w,joined?(row.p||[]).join('+'):(row.p||[])];
  if(row.etymology_id)fields.push(row.etymology_id);
  return JSON.stringify(fields);
 }
 const artKey=row=>key(row,true);
 function dictionaryAnchor(row){
  const fields=[row.w,row.p||[],row.ja||'',row.en||''];
  if(row.etymology_id)fields.push(row.etymology_id);
  return fields;
 }
 function applyArtwork(words,index){
  for(const row of words){
   const stem=index[artKey(row)];
   if(typeof stem==='string'&&stem){row.pica=stem;row.pic=true;}
   else if(row.etymology_id){delete row.pica;row.pic=false;}
  }
 }
 const familyCodes=new Set(['G','L','Gr','S','Sa','Ce','Sl','Ir','Al','Ar','He','Tu','J','Ch','Ko','Ma','Na','Am','Po','Dr','Ur','Ba','Af','Ot']);
 function languageFamilies(row){
  const groups=Array.isArray(row?.gs)?row.gs:[];
  const known=[...new Set(groups.filter(code=>familyCodes.has(code)))];
  return known.length?known:(familyCodes.has(row?.g)?[row.g]:[]);
 }
 function familyMatches(row,selection){
  if(!selection)return true;
  const groups=languageFamilies(row);
  return selection==='x'?groups.some(g=>!['G','L','Gr'].includes(g)):groups.includes(selection);
 }
 function memoKey(row){return key(row);}
 const spellingCounts=new WeakMap();
 function memoFor(row,memos,words){
  const exact=memos[memoKey(row)];
  if(exact)return exact;
  if(!spellingCounts.has(words)){
   const counts=new Map();for(const word of words)counts.set(word.w,(counts.get(word.w)||0)+1);
   spellingCounts.set(words,counts);
  }
  if(!row.etymology_id&&spellingCounts.get(words).get(row.w)===1)return memos[row.w]||null;
  return null;
 }
 return {key,artKey,dictionaryAnchor,applyArtwork,languageFamilies,familyMatches,memoKey,memoFor};
});
