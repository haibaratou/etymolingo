/* The mother's versioned difficulty is shared by dictionaries and the puzzle. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymonCustomLearningLevels=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const version='mother_weblio_first_v1';
 const policySha256='fedc3e7c2f27ecbe7d61d5af652c7380674825c7ee54577419ad5b7da794907b';
 const profile={"automaticRecalibration":false,"bandMedians":{"A1":415,"A2":520.5,"B1":592,"B2":710},"bands":["A1","A2","B1","B2"],"boundaryPolicy":"strict_gt_cutoff_and_band_midpoint","duplicateIdentityPolicy":"unknown_exact_w_p_etymology_id","officialBandPolicy":"easiest_pos_matched_else_all_only_without_tags","posMap":{"adjective":"\u5f62","adverb":"\u526f","article":"\u51a0","conjunction":"\u63a5","determiner":"\u51a0","interjection":"\u9593","modal auxiliary":"\u52a9","noun":"\u540d","number":"\u6570","preposition":"\u524d","pronoun":"\u4ee3","verb":"\u52d5"},"precedence":["weblio","cefr_j","edited_r"],"ruleVersion":"mother_weblio_first_v1","unlistedCutPoints":[415,467.75,520.5,556.25,592,651,710,822,1046],"webSourceStatus":"ok","weblioTo10":[0,1,2,3,4,5,5,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10]};
 const stable=value=>Array.isArray(value)?'['+value.map(stable).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',')+'}':JSON.stringify(value);
 const norm=v=>String(v||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').trim().replace(/\s+/g,' ');
 const key=(w,p,id)=>JSON.stringify([w,p,id||null]);
 const hash=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
 function create(data){
  if(data?.schema!==1||data.ruleVersion!==version||!Array.isArray(data.entries)||stable(data.profile)!==stable(profile)||data.policySha256!==policySha256||data.profileSha256!==policySha256||!['sourceWordsSha256','sourceCefrSha256','sourceWeblioSha256'].every(k=>hash(data[k])))throw Error('Unsupported mother difficulty profile');
  const map=new Map(),duplicates=new Set();
  for(const e of data.entries){
   if(!e||typeof e.w!=='string'||!Array.isArray(e.p))throw Error('Invalid mother difficulty entry');
   const k=key(e.w,e.p,e.etymology_id);if(map.has(k))duplicates.add(k);map.set(k,e);
  }
  return {data,lookup(row){
   if(!row||typeof row!=='object')return null;
   const game=Array.isArray(row.roots),w=game?row.en:row.w,p=game?row.roots:row.p,k=key(w,p,row.etymology_id),e=map.get(k);
   if(!e||duplicates.has(k)||!Number.isInteger(e.level)||e.level<1||e.level>10||e.pos!==row.pos)return null;
   const ja=game?row.sense?.ja:String(row.ja||'').split('、')[0],en=game?row.sense?.en:String(row.en||'').split(' / ')[0];
   if(norm(ja)!==e.senseJa||norm(en)!==e.senseEn||row.sense?.sha256&&row.sense.sha256!==e.senseSha256)return null;
   return e;
  }};
 }
 async function decode(envelope){
  if(envelope?.schema!==1||envelope.encoding!=='gzip-base64')throw Error('Missing mother difficulty data');
  const packed=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
  const bytes=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
  if(digest!==envelope.sha256)throw Error('Mother difficulty checksum mismatch');
  return create(JSON.parse(new TextDecoder().decode(bytes)));
 }
 return {version,policySha256,create,decode,norm};
});
