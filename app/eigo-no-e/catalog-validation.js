/* Current-data gates for the generated えいごのえ catalog. No definition fallback. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EigoCatalogValidation=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const normalize=value=>String(value||'').normalize('NFKC').replace(/[‘’]/g,"'").replace(/[‐‑]/g,'-').trim().replace(/\s+/g,' ');
const wordKey=x=>JSON.stringify([x.w,x.p||[]]);
const sceneKey=x=>JSON.stringify([x.w,x.p||[],x.art]);
const firstJa=x=>normalize(String(x.ja||'').split('、')[0]);
const firstEn=x=>normalize(String(x.en||'').split(' / ')[0]);
const indexKey=x=>JSON.stringify([x.w,(x.p||[]).join('+')]);
function validDescription(scene){
  const text=normalize(scene.scene?.en),head=normalize(scene.w);
  if(!text||!normalize(scene.scene?.ja))return false;
  const escaped=head.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(!new RegExp('(^|[^\\w])'+escaped+'(?!\\w)','i').test(text))return false;
  if((text.match(/[A-Za-z0-9_]+(?:['-][A-Za-z0-9_]+)*/g)||[]).length>18)return false;
  const bare=text.replace(/[.!?]+$/,'').trim().toLowerCase(),lower=head.toLowerCase();
  return ![lower,'a '+lower,'an '+lower,'the '+lower,'this is '+lower,'this is a '+lower,'this is an '+lower].includes(bare);
}
function buildCurrentCatalog(data,scenes,words,index){
  if(data?.schema!==3||!Array.isArray(data.words)||scenes?.schema!==1||!Array.isArray(scenes.entries)||!Array.isArray(words))throw Error('Unsupported picture dictionary data');
  const currentWords=new Map(words.map(w=>[wordKey(w),w]));
  const currentScenes=new Map();
  for(const entry of scenes.entries){const key=sceneKey(entry);if(currentScenes.has(key))throw Error('Duplicate scene identity');currentScenes.set(key,entry);}
  const output=[],excluded=[];
  for(const row of data.words){
    const scene=currentScenes.get(sceneKey(row)),word=currentWords.get(wordKey(row));
    let reason='';
    if(!scene||!word)reason='missing_identity';
    else if((scene.status||scene.review?.status)!=='reviewed'||scene.review?.status!=='reviewed')reason='not_reviewed';
    else if(!validDescription(scene))reason='invalid_description';
    else if(firstJa(word)!==normalize(scene.sense?.ja)||firstEn(word)!==normalize(scene.sense?.en)||scene.sense?.index!==0||scene.sense?.sha256!==row.sense?.sha256)reason='stale_first_sense';
    else if(scene.image?.sha256!==row.image?.sha256||scene.image?.git_blob_sha!==row.image?.git_blob_sha||scene.image?.path!==row.image?.path||row.thumb?.source_sha256!==scene.image?.sha256)reason='stale_image_binding';
    else if(index[indexKey(row)]&&index[indexKey(row)]!==row.art)reason='stale_art_mapping';
    else if(!/^[A-Za-z0-9_@-]+$/.test(row.art)||row.image.path!==`assets/word/${row.art}.png`||!row.thumb?.path?.startsWith('eigo-no-e/thumbs/'))reason='invalid_asset_path';
    if(reason){excluded.push({id:row.id,reason});continue;}
    // Only canonical first meanings and the current reviewed description survive.
    const next={...row,ja:firstJa(word),en:firstEn(word),pos:word.pos||'',r:word.r||99999,scene:scene.scene,sense:scene.sense,image:scene.image,status:'reviewed',review:{status:'reviewed'}};
    delete next.d;delete next.syn;delete next.h;delete next.rel;delete next.b;
    const reading=(word.ja_readings||[]).find(r=>normalize(r.gloss)===next.ja&&r.kana);
    if(reading)next.k=reading.kana;else delete next.k;
    if(word.tags!==undefined)next.tags=word.tags;
    output.push(next);
  }
  const categories=data.categories.map(c=>{
    const subs=c.subs.map(s=>({...s,n:output.filter(w=>w.c.includes(`${c.id}/${s.id}`)).length})).filter(s=>s.n);
    const members=output.filter(w=>w.c.some(k=>k.startsWith(c.id+'/')));
    return {...c,subs,icon:members.some(w=>w.id===c.icon)?c.icon:members[0]?.id};
  }).filter(c=>c.subs.length);
  return {...data,words:output,categories,total_art:output.length,excluded};
}
return {buildCurrentCatalog,wordKey,sceneKey,firstJa,firstEn,validDescription};
});
