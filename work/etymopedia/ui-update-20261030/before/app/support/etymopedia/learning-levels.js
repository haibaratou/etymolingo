/* Match this legacy CSV view to current canonical word identities before displaying a level. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymopediaLearning=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const key=row=>JSON.stringify([row.w,row.p||[]]);
 const norm=value=>String(value||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').trim().replace(/\s+/g,' ');
 const first=value=>norm(String(value||'').split('、')[0]);
 function create(levels,rows){
  const canonical=new Map(),duplicates=new Set();
  for(const row of rows){const k=key(row);if(canonical.has(k))duplicates.add(k);canonical.set(k,row);}
  return {lookup(row){
   const k=key(row),source=canonical.get(k);
   if(!source||duplicates.has(k)||first(row.jp)!==first(source.ja)||(row.pos&&row.pos!==source.pos))return null;
   return levels.lookup(source);
  }};
 }
 async function decodeBasics(envelope){
  if(envelope?.schema!==1||envelope.encoding!=='gzip-base64')throw Error('Missing canonical word identities');
  const packed=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
  const bytes=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  if(envelope.sha256){
   const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
   if(hash!==envelope.sha256)throw Error('Canonical word identity checksum mismatch');
  }
  const data=JSON.parse(new TextDecoder().decode(bytes));
  if(data.schema!==1||!Array.isArray(data.entries))throw Error('Incomplete canonical word identities');
  return data.entries;
 }
 async function load(){
  const [levels,rows]=await Promise.all([
   EtymonCustomLearningLevels.decode(ETYMON_CUSTOM_LEARNING_LEVELS),
   decodeBasics(ETYMON_DICTIONARY_BASICS_GZIP)
  ]);
  return create(levels,rows);
 }
 return {create,decodeBasics,load};
});
