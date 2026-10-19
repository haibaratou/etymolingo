/* Read-only preview of puzzle selection. No game data or source records are changed. */
(() => {
 'use strict';
 const scriptBase=document.currentScript.src;
 const meanings={answer_length_or_format:'英字3〜14文字が必要',auxiliary_not_visual:'助動詞で絵から答えを特定しにくい',function_word:'機能語',ordinary_person_name:'一般的な人名',no_bound_illustration:'対応画像なし',image_on_or_before_2026_09_10:'9月10日以前の画像',image_date_unverified:'画像の更新日が未確認',updated_image_not_verified:'更新済み画像との対応が未確認',existing_game_hold:'既存の出題保留',illustration_needs_review:'画像内容の確認待ち',image_sense_binding_unverified:'画像と語義の対応を確認待ち',proper_name_or_capitalized_word_review:'固有名などの確認待ち。歴史的人物は個別判定',part_of_speech_review:'品詞確認待ち',visual_answer_review:'絵から答えを特定できるか確認待ち',reviewed_image_and_content_word_rules:'既存の確認済み画像・品詞・更新日・文字数の条件を通過。今回の個別目視検品済みという意味ではありません'};
 const index=new Map();let ready=false,failed=false,scheduled=false;
 const key=(w,p)=>JSON.stringify([w,p||[]]);
 function update(){scheduled=false;for(const table of document.querySelectorAll('table')){
  const head=table.querySelector('thead tr');if(!head?.querySelector('th.cW'))continue;
  if(!head.querySelector('.cPuzzle')){const th=document.createElement('th');th.className='cPuzzle';th.textContent='パズル';th.title='一次選定。クリックで理由を確認';head.querySelector('th.cR').before(th);}
  for(const tr of table.querySelectorAll('tr[data-i]')){
   let word;try{word=typeof WORDS==='undefined'?null:WORDS[Number(tr.dataset.i)];}catch{}if(!word)continue;
   let cell=tr.querySelector('.cPuzzle');if(!cell){cell=document.createElement('td');cell.className='cPuzzle';tr.querySelector('td.cR').before(cell);}
   const matches=index.get(key(word.w,word.p))||[];let e=matches.length===1?matches[0]:null;
   if(!e&&matches.length){let path='';try{path=decodeURIComponent(new URL(tr.querySelector('.cPic img')?.src||'',location.href).pathname);}catch{}const exact=matches.filter(r=>r.imagePath&&path.endsWith('/'+r.imagePath));if(exact.length===1)e=exact[0];}
   const status=e?.status||'REVIEW';const label=!ready?'読込中':failed?'読込失敗':status==='REVIEW'?'確認待ち':status;
   const reason=e?(e.reasons||[]).map(r=>meanings[r]||r).join('／'):'今回の選定記録がありません。未選定です。';
   const text=reason+(e?.imageUpdatedAt?'。画像更新: '+e.imageUpdatedAt:'');const signature=label+'|'+text;
   if(cell.dataset.signature!==signature){const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent=label;p.textContent=text;details.append(summary,p);cell.replaceChildren(details);cell.dataset.signature=signature;cell.dataset.status=status;cell.title=text;}
  }
  for(const td of table.querySelectorAll('.detRow>td[colspan]'))if(td.colSpan!==head.children.length)td.colSpan=head.children.length;
 }}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
 async function start(){
  const style=document.createElement('style');style.textContent='.cPuzzle{min-width:84px;font-size:12px}.cPuzzle summary{cursor:pointer;font-weight:bold;white-space:nowrap}.cPuzzle details p{min-width:210px;max-width:270px;white-space:normal;font-size:11px;line-height:1.7}.cPuzzle[data-status="OK"] summary{color:#257344}.cPuzzle[data-status="NG"] summary{color:#a54d47}.cPuzzle[data-status="REVIEW"] summary{color:#857449}';document.head.append(style);
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule();
  try{await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('../data/generated-etymon/puzzle-eligibility.js',scriptBase).href;s.onload=resolve;s.onerror=reject;document.head.append(s);});
   const envelope=window.ETYMON_PUZZLE_ENVELOPE;if(envelope?.encoding!=='gzip-base64')throw Error('Missing puzzle data');
   const bytes=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
   if(data.schema!==1)throw Error('Unsupported puzzle data');for(const e of data.entries){const k=key(e.w,e.p);if(!index.has(k))index.set(k,[]);index.get(k).push(e);}
  }catch{failed=true;}ready=true;schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
