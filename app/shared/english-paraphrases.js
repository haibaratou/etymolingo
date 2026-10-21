/* Sense-bound meaning explanations and links to existing dictionary routes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnglishParaphrases=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const norm=s=>String(s||'').normalize('NFKC').trim().replace(/\s+/g,' '),key=(w,p)=>JSON.stringify([w,p||[]]);
 const stop=new Set('a an the and or of to in on at by for with as is are was were be been being that this these those it its you your who which not yet often such before'.split(' '));
 async function decode(env){if(env?.encoding!=='gzip-base64')throw Error('Dictionary basics unavailable');const bytes=Uint8Array.from(atob(env.data),c=>c.charCodeAt(0));const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());if(data.schema!==1||!Array.isArray(data.entries))throw Error('Invalid dictionary basics');return data;}
 function create(data,basics){
  if(data?.schema!==1||data.version!=='english-meaning-v1'||!Array.isArray(basics?.entries))throw Error('Invalid meaning data');
  const byKey=new Map(),bySpelling=new Map();
  for(const e of data.entries){const k=key(e.w,e.p);if(!byKey.has(k))byKey.set(k,[]);byKey.get(k).push(e);}
  for(const e of basics.entries){if(!e.w||!Number.isInteger(e.dictionaryIndex))continue;const k=e.w.toLowerCase();if(!bySpelling.has(k))bySpelling.set(k,[]);bySpelling.get(k).push(e);}
  function lookup(row){const game=Array.isArray(row.roots),w=game?row.en:row.w,p=game?row.roots:row.p,hits=byKey.get(key(w,p))||[];if(hits.length!==1)return null;const e=hits[0];const ja=game?row.sense?.ja:String(row.ja||'').split('、')[0],en=game?row.sense?.en:String(row.en||'').split(' / ')[0];
   if(e.status!=='sense_checked'||!e.text?.trim()||e.sourcePos!==row.pos||norm(e.senseJa)!==norm(ja)||norm(e.sourceEnglish.split(' / ')[0])!==norm(en)||game&&e.senseSha256&&e.senseSha256!==row.sense?.sha256)return null;
   return e;
  }
  function tokens(text){let end=0,out=[];for(const m of String(text).matchAll(/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g)){
   if(m.index>end)out.push({text:text.slice(end,m.index)});const hits=bySpelling.get(m[0].toLowerCase())||[];
   const link=!stop.has(m[0].toLowerCase())&&hits.length;out.push({text:m[0],href:link?(hits.length===1?'#/w/'+encodeURIComponent('dictionary:'+hits[0].dictionaryIndex):'#/d/'+encodeURIComponent(m[0])):null,ambiguous:link&&hits.length>1});end=m.index+m[0].length;
  }if(end<text.length)out.push({text:text.slice(end)});return out;}
  return {lookup,tokens};
 }
 function render(container,row,service,base=''){
  container.replaceChildren();container.classList.add('english-paraphrase');const heading=document.createElement('h3');heading.textContent='英語で言い換える';container.append(heading);const e=service?.lookup(row);container.dataset.paraphraseStatus=e?'available':'missing';
  const p=document.createElement('p');if(!e){p.textContent='この語義の英語説明は確認待ちです。';container.append(p);return;}
  p.lang='en';for(const t of service.tokens(e.text)){if(t.href){const a=document.createElement('a');a.href=base+t.href;a.textContent=t.text;a.title=t.ambiguous?'複数の語義から選ぶ':'辞書で意味を見る';if(base)a.target='_blank',a.rel='noopener';p.append(a);}else p.append(document.createTextNode(t.text));}container.append(p);
  const note=document.createElement('small');note.textContent='この語義を英語で説明しています。同義語の一覧ではありません。'+(e.method==='reused_canonical_english_gloss'?'既存の英語語義を使用。':'収録語義に基づく編集文。')+(e.sourcePosMismatch?'対象品詞と収録タグの不一致を記録しています。':'');container.append(note);
 }
 return {create,decode,render,norm};
});
