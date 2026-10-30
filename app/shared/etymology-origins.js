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
 // The source producer verifies reviewed claims and raw source snapshots. This
 // payload deliberately omits source prose. Runtime checks exact word context,
 // own-shard/index provenance and both UTF-8 assembly digests without fetching.
 const correctionScope='etymological_assembly_only';
 const fixedCorrection={correction_id:'propose-old-french-stage-v1',w:'propose',p:['per1','apo-'],etymology_id:'',
  before_g:'L',before_ja:'提案する',before_en:'suggest',before_pos:'動',
  before_b:'「前に置く」が原義。求婚の意味が加わったのは1764年から。',
  before_parts:'pro（前へ）＋pose（置く）',parts:'古フランス語 proposer：pro-（前へ）＋poser（置く）'};
 const correctionFields=Object.keys(fixedCorrection);
 const genericCorrectionFields=correctionFields.concat(['correction_scope','word_key','before_parts_sha256','parts_sha256','source_guard']);
 function exactFields(value,fields){
  return value!==null&&typeof value==='object'&&!Array.isArray(value)
   &&Object.keys(value).length===fields.length&&fields.every(field=>Object.hasOwn(value,field));
 }
 function nonempty(value){return typeof value==='string'&&!!value.trim();}
 // Synchronous SHA-256 is used only for the small reviewed correction batch.
 // It also works in direct-file mode where WebCrypto may be unavailable.
 const sha256K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 function assemblyDigest(text){
  const bytes=[];
  for(const char of text){
   let cp=char.codePointAt(0);if(cp>=0xd800&&cp<=0xdfff)cp=0xfffd;
   if(cp<0x80)bytes.push(cp);
   else if(cp<0x800)bytes.push(0xc0|(cp>>>6),0x80|(cp&63));
   else if(cp<0x10000)bytes.push(0xe0|(cp>>>12),0x80|((cp>>>6)&63),0x80|(cp&63));
   else bytes.push(0xf0|(cp>>>18),0x80|((cp>>>12)&63),0x80|((cp>>>6)&63),0x80|(cp&63));
  }
  const byteLength=bytes.length;bytes.push(0x80);
  while(bytes.length%64!==56)bytes.push(0);
  const high=Math.floor(byteLength/0x20000000),low=(byteLength*8)>>>0;
  for(let shift=24;shift>=0;shift-=8)bytes.push((high>>>shift)&255);
  for(let shift=24;shift>=0;shift-=8)bytes.push((low>>>shift)&255);
  const hash=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n)),schedule=new Array(64);
  for(let offset=0;offset<bytes.length;offset+=64){
   for(let i=0;i<16;i++){const j=offset+i*4;schedule[i]=((bytes[j]<<24)|(bytes[j+1]<<16)|(bytes[j+2]<<8)|bytes[j+3])>>>0;}
   for(let i=16;i<64;i++){
    const x=schedule[i-15],y=schedule[i-2],s0=rotr(x,7)^rotr(x,18)^(x>>>3),s1=rotr(y,17)^rotr(y,19)^(y>>>10);
    schedule[i]=(schedule[i-16]+s0+schedule[i-7]+s1)>>>0;
   }
   let [a,b,c,d,e,f,g,h]=hash;
   for(let i=0;i<64;i++){
    const t1=(h+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+sha256K[i]+schedule[i])>>>0;
    const t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
    h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
   }
   for(const [i,value]of [a,b,c,d,e,f,g,h].entries())hash[i]=(hash[i]+value)>>>0;
  }
  return hash.map(n=>n.toString(16).padStart(8,'0')).join('');
 }
 function prepareWordPartsCorrections(entries){
  if(!Array.isArray(entries))throw Error('Invalid word-parts corrections array');
  const ids=new Set(),keys=new Set();
  for(const entry of entries){
   const fixed=entry?.correction_id===fixedCorrection.correction_id;
   if(fixed){
    if(!exactFields(entry,correctionFields)||Object.entries(fixedCorrection).some(([field,value])=>JSON.stringify(entry[field])!==JSON.stringify(value)))throw Error('Unapproved individual word-parts correction');
   }else{
    const valid=exactFields(entry,genericCorrectionFields)&&entry.correction_scope===correctionScope
     &&nonempty(entry.correction_id)&&nonempty(entry.w)&&Array.isArray(entry.p)&&entry.p.every(nonempty)
     &&['etymology_id','before_g','before_ja','before_en','before_pos','before_b'].every(field=>typeof entry[field]==='string')
     &&nonempty(entry.before_parts)&&nonempty(entry.parts)&&entry.before_parts!==entry.parts
     &&entry.word_key===wordPartsKey(entry)&&entry.word_key!==wordPartsKey(fixedCorrection)
     &&['before_parts_sha256','parts_sha256'].every(field=>typeof entry[field]==='string'&&/^[0-9a-f]{64}$/.test(entry[field]));
    if(!valid)throw Error('Unapproved or invalid assembly-only correction payload');
    if(assemblyDigest(entry.before_parts)!==entry.before_parts_sha256||assemblyDigest(entry.parts)!==entry.parts_sha256)throw Error('Assembly-only correction digest changed');
    const source=entry.source_guard,first=entry.w[0],shard=/^[A-Za-z]$/.test(first)?first.toLowerCase():'_';
    if(!exactFields(source,['path','record','slot','sha256'])||source.path!=='app/data/generated-etymon/det/'+shard+'.json'
      ||typeof source.record!=='string'||!/^(0|[1-9][0-9]*)$/.test(source.record)||source.slot!==1
      ||typeof source.sha256!=='string'||!/^[0-9a-f]{64}$/.test(source.sha256))throw Error('Invalid assembly-only correction provenance');
   }
   const oldKey=wordPartsKey(entry);
   if(ids.has(entry.correction_id)||keys.has(oldKey))throw Error('Only the individual occurrence of each correction is authorized; duplicate correction ID or word key');
   ids.add(entry.correction_id);keys.add(oldKey);
  }
  return entries;
 }
 function bindWordPartsCorrections(words,parts,entries){
  const result={total:entries.length,corrected:0,alreadyCorrected:0,stale:0,ambiguous:0,missing:0};
  const counts=new Map(),oldCounts=new Map(),current=new Map(),indices=new Map();
  for(const [index,word]of words.entries()){
   const key=identity(word),oldKey=wordPartsKey(word);counts.set(key,(counts.get(key)||0)+1);oldCounts.set(oldKey,(oldCounts.get(oldKey)||0)+1);current.set(key,word);indices.set(key,String(index));
  }
  for(const entry of entries){
   const key=identity(entry),oldKey=wordPartsKey(entry),word=current.get(key);
   if(!word){result.missing++;continue;}
   if(counts.get(key)!==1||oldCounts.get(oldKey)!==1){result.ambiguous++;continue;}
   const generic=entry.correction_id!==fixedCorrection.correction_id;
   if(['g','ja','en','pos','b'].some(field=>entry['before_'+field]!==word[field])
     ||(generic&&((word.etymology_id===undefined?'':word.etymology_id)!==entry.etymology_id||indices.get(key)!==entry.source_guard.record))){result.stale++;continue;}
   if(parts[oldKey]===entry.parts){result.alreadyCorrected++;continue;}
   if(parts[oldKey]!==entry.before_parts){result.stale++;continue;}
   parts[oldKey]=entry.parts;result.corrected++;
  }
  return result;
 }
 function bindWordParts(words,parts,payload){
  if(!payload||payload.schema!==1||!Array.isArray(payload.entries)||!parts||typeof parts!=='object'||Array.isArray(parts))throw Error('Invalid word-parts supplement');
  // Validate every correction before additions or corrections can mutate parts.
  const corrections=Object.hasOwn(payload,'corrections')?prepareWordPartsCorrections(payload.corrections):null;
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
    &&(!Object.hasOwn(entry,'before_pos')||(typeof entry.before_pos==='string'&&entry.before_pos===(word.pos||'')))
    &&(entry.before_gs===undefined||JSON.stringify(unique(entry.before_gs).sort())===JSON.stringify(unique(word.gs).sort()))
    &&typeof entry.parts==='string'&&entry.parts.trim();
   if(!valid){result.stale++;continue;}
   const existing=parts[oldKey];
   if(existing!==undefined&&existing!==null&&(typeof existing!=='string'||existing.trim())){result.alreadyPresent++;continue;}
   parts[oldKey]=entry.parts;result.added++;
  }
  if(corrections)result.corrections=bindWordPartsCorrections(words,parts,corrections);
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
