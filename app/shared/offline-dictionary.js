/* Loads a user's existing local dictionary data; no network fallback or inferred entries. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OfflineDictionary=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const anchors=words=>words.map(w=>[w.w,w.p||[],w.ja||'',w.en||'',...(w.etymology_id?[w.etymology_id]:[])]);
 async function hashWords(words){
  const bytes=new TextEncoder().encode(JSON.stringify(anchors(words)));
  const hash=await globalThis.crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
 }
 async function decode(envelope,words){
  if(envelope?.schema!==1||envelope.encoding!=='gzip-base64'||typeof envelope.data!=='string')throw Error('Unsupported offline dictionary data');
  if(await hashWords(words)!==envelope.words_sha256)throw Error('Offline dictionary word identity/order differs; regenerate the local dictionary');
  const bytes=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
  const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  if(data.schema!==1||!data.det||!data.eo||!data.eo_pick||!data.details_brief||!Array.isArray(data.eo_slugs))throw Error('Incomplete offline dictionary data');
  return data;
 }
 const loads=new Map();
 function scriptLoad(url){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('Local dictionary file unavailable: '+url));document.head.append(script);});}
 async function parts(envelope,url){
  if(typeof envelope.data==='string')return envelope;
  if(!Array.isArray(envelope.parts)||!envelope.parts.length)throw Error('Offline dictionary parts missing');
  const values=[];
  for(const part of envelope.parts){
   if(!/^offline-dictionary-part-[a-f0-9]{12}-[0-9]+\.js$/.test(part.file))throw Error('Invalid offline dictionary part');
   const partUrl=new URL(part.file,new URL(url,location.href)).href;
   await scriptLoad(partUrl);
   const value=globalThis.ETYMON_OFFLINE_DICTIONARY_PARTS?.[part.file];
   if(typeof value!=='string')throw Error('Offline dictionary part has no data');
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
   const sha=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
   if(sha!==part.sha256)throw Error('Offline dictionary part checksum differs');
   values.push(value);
  }
  return {...envelope,data:values.join('')};
 }
 function load(words,options={}){
  const url=options.url||'data/generated-etymon/offline-dictionary.js?v=9cb6b1e3b270';
  if(!loads.has(url))loads.set(url,new Promise((resolve,reject)=>{
   if(globalThis.ETYMON_OFFLINE_DICTIONARY){resolve(globalThis.ETYMON_OFFLINE_DICTIONARY);return;}
   const script=document.createElement('script');script.src=url;script.async=true;
   script.onload=()=>globalThis.ETYMON_OFFLINE_DICTIONARY?resolve(globalThis.ETYMON_OFFLINE_DICTIONARY):reject(Error('Local dictionary script contained no data'));
   script.onerror=()=>reject(Error('Local dictionary data unavailable; generate offline-dictionary.js from the existing dictionary files'));
   document.head.append(script);
  }).catch(e=>{loads.delete(url);throw e;}));
  // Check against the caller's current ordered words on every call, not only load.
  return loads.get(url).then(envelope=>parts(envelope,url)).then(envelope=>decode(envelope,words));
 }
 return {load,decode,hashWords,anchors};
});

// Explorer optional scoring data is loaded after first paint by illustration-scenes.js.
