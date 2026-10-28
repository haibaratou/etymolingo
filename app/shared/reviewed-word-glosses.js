/* Exact, user-approved short-translation corrections; no inferred rewriting. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymonWordGlosses=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k),fields=['ja','en','pos','b'],derived=['ja_readings','ja_kana'];
 const key=w=>JSON.stringify([w.w,w.p,w.etymology_id||'']);
 function equal(a,b){if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(k=>own(b,k)&&equal(a[k],b[k]));}
 const clone=x=>JSON.parse(JSON.stringify(x));
 function validIdentity(e){return e&&typeof e.w==='string'&&Array.isArray(e.p)&&e.p.every(x=>typeof x==='string')&&(!own(e,'etymology_id')||typeof e.etymology_id==='string');}
 function validEntry(e){
  return validIdentity(e)&&e.before&&fields.every(k=>typeof e.before[k]==='string')
   &&e.after&&Object.keys(e.after).sort().join(',')==='ja,ja_kana,ja_readings'
   &&typeof e.after.ja==='string'&&e.after.ja.length>0&&typeof e.after.ja_kana==='string'
   &&Array.isArray(e.after.ja_readings)&&e.after.ja_readings.every(r=>r&&typeof r.gloss==='string'&&typeof r.kana==='string')
   &&e.before_derived&&derived.every(k=>own(e.before_derived,k))
   &&/^[a-f0-9]{64}$/.test(e.before_sha256||'')&&/^[a-f0-9]{64}$/.test(e.after_sha256||'');
 }
 function prepare(payload){
  const available=payload?.schema===1&&payload.guard_algorithm==='word-gloss-context-v1'&&Array.isArray(payload.entries),entries=new Map(),ambiguous=new Set();
  if(available)for(const e of payload.entries){if(!validEntry(e))continue;const k=key(e);if(entries.has(k))ambiguous.add(k);entries.set(k,e);}
  return {available,entries,ambiguous};
 }
 function bind(words,payload){
  const p=payload?.entries instanceof Map?payload:prepare(payload),byKey=new Map(),report={total:words.length,applied:0,already_applied:0,held:0,missing:0,reasons:[]};
  for(const w of words)if(validIdentity(w)){const k=key(w);if(!byKey.has(k))byKey.set(k,[]);byKey.get(k).push(w);}
  if(!p.available){report.unavailable=true;return report;}
  for(const [k,e] of p.entries){
   const matches=byKey.get(k)||[];let reason='';
   if(!matches.length){report.missing++;continue;}
   if(matches.length!==1||p.ambiguous.has(k)){reason='duplicate_identity';}
   else {
    const w=matches[0],state=w.ja===e.before.ja?'before':w.ja===e.after.ja?'after':'other';
    if(state==='other'||fields.filter(x=>x!=='ja').some(x=>w[x]!==e.before[x]))reason='word_guard_mismatch';
    else {
     const actual=Object.fromEntries(derived.map(x=>[x,w[x]])),before=e.before_derived,after=Object.fromEntries(derived.map(x=>[x,e.after[x]]));
     if(!equal(actual,before)&&!equal(actual,after))reason='derived_metadata_changed';
     else if(state==='after'&&equal(actual,after))report.already_applied++;
     else {for(const field of ['ja',...derived])w[field]=clone(e.after[field]);report.applied++;}
    }
   }
   if(reason){report.held++;report.reasons.push({w:e.w,p:e.p,reason});}
  }
  return report;
 }
 return {prepare,bind,identity:key};
});
