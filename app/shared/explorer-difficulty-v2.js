/* Learner difficulty v2: explicit Weblio-first, CEFR-J and edited r fallback.
   This is an independent DISPLAY hint, not a modification to dictionary sense,
   official CEFR, image evaluation, or game progression. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root&&root.document){root.EtymonDifficultyV2=api;api.mount(root);}
})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const WEBLIO_TO_10=[0,1,2,3,4,5,5,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10];
const R_CUTS=[415,467.75,520.5,556.25,592,651,710,822,1046];
const BANDS=['A1','A2','B1','B2'];
const R_MID={A1:415,A2:520.5,B1:592,B2:710};
const POS={noun:'名',verb:'動',adjective:'形',adverb:'副',pronoun:'代',preposition:'前',conjunction:'接',interjection:'間',determiner:'冠',article:'冠','modal auxiliary':'助',number:'数'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numeric=v=>typeof v==='number'&&Number.isFinite(v)&&v>0&&v<99999?v:null;
function makeIndex(webData,cefrData){
 const web=new Map(),cefr=new Map();
 for(const e of webData?.entries||[])if(e.status==='rated'&&Number.isInteger(e.level)&&e.level>=1&&e.level<=30)web.set(e.w,e.level);
 for(const e of cefrData?.entries||[])if(BANDS.includes(e.level)){if(!cefr.has(e.w))cefr.set(e.w,[]);cefr.get(e.w).push(e);}
 return {web,cefr};
}
function evaluate(w,index){
 const raw=Number.isFinite(w?.r)?numeric(w.r):null,all=index.cefr.get(w?.w)||[];
 const tags=String(w?.pos||'').split(/[\/・,、]/).map(t=>t.trim()).filter(Boolean);
 const matched=all.filter(e=>tags.includes(POS[e.pos]));
 const official=all.map(e=>({pos:e.pos,level:e.level}));
 const web=index.web.get(w?.w);
 if(Number.isInteger(web))return {level:WEBLIO_TO_10[web],basis:'weblio_30_to_10',web,raw,official,confidence:'provisional',note:'Weblio Lvを主指標にした独自10段階への対応。CEFR-J・Ngramとの単純平均は行わない。'};
 const candidates=matched.length?matched:all.filter(e=>!tags.length);
 if(candidates.length){
  const lower=candidates.reduce((a,b)=>BANDS.indexOf(a.level)<=BANDS.indexOf(b.level)?a:b).level;
  const value=2*BANDS.indexOf(lower)+1+(raw!==null&&raw>R_MID[lower]?1:0);
  return {level:value,basis:'cefr_j_fallback',web:null,raw,official,confidence:'provisional_low',note:'Weblio未収録。品詞が一致するCEFR-Jの最易帯を暫定採用。複数品詞では代表語義の厳密な認定ではない。'};
 }
 if(raw!==null){
  const lv=1+R_CUTS.filter(c=>raw>c).length;
  return {level:lv,basis:'edited_r_fallback',web:null,raw,official,confidence:'provisional_very_low',note:'Weblioと該当CEFR-Jなし。書籍頻度由来の加工rによる低信頼の推定。'};
 }
 return {level:null,basis:'unclassified',web:null,raw:null,official,confidence:'unknown',note:'根拠不足のため未分類。'};
}
function makeModal(root){
 let dialog=root.document.getElementById('difficultyV2Dialog');
 if(dialog)return dialog;
 dialog=root.document.createElement('dialog');dialog.id='difficultyV2Dialog';
 dialog.setAttribute('aria-label','英単語の難易度の詳細');
 dialog.innerHTML='<div id="difficultyV2Details"></div><button type="button" class="difficulty-v2-close">閉じる</button>';
 root.document.body.append(dialog);
 dialog.querySelector('.difficulty-v2-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 return dialog;
}
function modalHTML(w,d){
 const officially=d.official.length?d.official.map(x=>esc(x.pos)+' '+esc(x.level)).join(' / '):'該当なし';
 return '<h2>'+esc(w.w)+' — ★ '+(d.level===null?'未分類':d.level)+'</h2>'
  +'<p>独自の10段階目安（公式CEFRの認定ではありません）</p>'
  +'<dl><dt>CEFR-J（品詞別）</dt><dd>'+officially+'</dd>'
  +'<dt>Oxford CEFR</dt><dd>未連携</dd>'
  +'<dt>Weblio Lv</dt><dd>'+(d.web===null?'—':d.web)+'</dd>'
  +'<dt>Ngram（加工r）</dt><dd>'+(d.raw===null?'—':d.raw)+'</dd></dl>'
  +'<p>'+esc(d.note)+'</p><p class="difficulty-v2-caution">数値は学習者の実測正答率・公式CEFR細分類ではありません。</p>';
}
function mount(root){
 const doc=root.document,style=doc.createElement('style');
 style.textContent='.difficulty-v2-col{width:76px!important;min-width:76px!important;max-width:76px!important;white-space:nowrap!important;text-align:left!important;padding-left:8px!important;vertical-align:middle!important}.difficulty-v2-button{font-weight:700;font-size:13px;line-height:1.35;font-family:inherit;color:#245d4b;border:1px solid #a4c6b4;background:#eaf5ef;border-radius:7px;padding:2px 7px;white-space:nowrap;cursor:pointer;text-align:left;margin:0}.difficulty-v2-button:hover,.difficulty-v2-button:focus-visible{border-color:#338a6b;background:#d9efe3}.difficulty-v2-button[data-unknown="1"]{color:#62676a;background:#f4f4f4;border-color:#ddd}#difficultyV2Dialog{max-width:min(480px,92vw);border:1px solid #b7c1bd;border-radius:12px;padding:20px 22px;box-shadow:0 12px 40px #0003;background:#fff;color:#273b32}#difficultyV2Dialog::backdrop{background:#0006}#difficultyV2Dialog h2{font-size:20px;margin:0 0 8px}#difficultyV2Dialog p{margin:8px 0;line-height:1.55}#difficultyV2Dialog dl{display:grid;grid-template-columns:max-content 1fr;gap:7px 14px;margin:12px 0}#difficultyV2Dialog dt{font-weight:700}#difficultyV2Dialog dd{margin:0}#difficultyV2Dialog .difficulty-v2-close{display:block;margin:18px 0 0 auto;padding:6px 14px;cursor:pointer}#difficultyV2Dialog .difficulty-v2-caution{font-size:12px;color:#6a6a6a}';
 doc.head.append(style);
 const index=makeIndex(root.ETYMON_WEBLIO_LEVELS,root.ETYMON_LEARNING_LEVELS);
 let pending=false,table=null,removed=[],difficultyIndex=-1,hadDifficultyColumn=false;
 function wordOf(tr){
  const i=Number(tr.dataset.i);
  try{if(Number.isInteger(i)&&typeof WORDS!=='undefined'&&WORDS[i])return WORDS[i];}catch(_){}
  const w=tr.querySelector('td.cW')?.textContent?.trim().split('🔊')[0]?.trim();
  return {w:w||'',pos:'',r:null};
 }
 function makeButton(w){
  const d=evaluate(w,index),b=doc.createElement('button');b.type='button';
  b.className='difficulty-v2-button';b.dataset.difficultyV2='1';
  b.dataset.word=w.w||'';b.dataset.level=d.level===null?'':String(d.level);
  b.textContent=d.level===null?'★ —':'★ '+d.level;
  b.title='難易度の根拠（CEFR-J・Weblio・Ngram）を見る';
  b.setAttribute('aria-label',esc(w.w)+' 独自難易度 '+(d.level===null?'未分類':d.level)+'。根拠を表示');
  if(d.level===null)b.dataset.unknown='1';
  b._details={w,d};return b;
 }
 function processRow(tr){
  if(tr.dataset.difficultyV2Processed)return;
  // Rendered rows are always reconstructed in original column order.
  for(const i of removed)if(tr.children[i])tr.children[i].remove();
  let cell=hadDifficultyColumn?tr.children[difficultyIndex]:null;
  if(!cell){
   cell=doc.createElement('td');
   tr.insertBefore(cell,tr.children[difficultyIndex]||null);
  }
  cell.classList.add('difficulty-v2-col');
  cell.replaceChildren(makeButton(wordOf(tr)));
  tr.dataset.difficultyV2Processed='1';
 }
 function processTable(t){
  const header=t.querySelector('thead tr');if(!header)return;
  const headers=[...header.children],existing=headers.findIndex(h=>h.classList.contains('difficulty-v2-col'));
  if(t!==table){
   table=t;
   const chosen=headers.findIndex(h=>h.textContent.replace(/\s+/g,'').includes('英単語の難易度')||h.textContent.trim()==='難易度');
   removed=headers.map((h,i)=>({txt:h.textContent.replace(/\s+/g,'').trim(),i}))
    .filter(x=>x.txt==='画像評価'||x.txt.includes('レア度')||x.txt==='Ngram'||(x.txt.includes('英単語の難易度')&&x.i!==chosen))
    .map(x=>x.i).sort((a,b)=>b-a);
   // In old releases no difficulty column existed.
   hadDifficultyColumn=chosen>=0;
   let retained=chosen>=0?chosen:headers.findIndex(h=>h.textContent.trim()==='カナ')+1;
   difficultyIndex=retained-removed.filter(i=>i<retained).length;
   for(const i of removed)headers[i]?.remove();
   const h=chosen>=0?headers[chosen]:doc.createElement('th');
   if(chosen<0)header.insertBefore(h,header.children[difficultyIndex]||null);
   h.textContent='難易度';h.classList.add('difficulty-v2-col');
   for(const tr of t.querySelectorAll('tbody tr'))processRow(tr);
  }else{
   for(const tr of t.querySelectorAll('tbody tr:not([data-difficulty-v2-processed])'))processRow(tr);
  }
 }
 function update(){
  pending=false;
  const t=doc.querySelector('#tableWrap table');
  if(t)processTable(t);
 }
 function schedule(){if(!pending){pending=true;queueMicrotask(update)}}
 doc.addEventListener('click',e=>{
  const b=e.target.closest?.('button[data-difficulty-v2]');if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const d=b._details;if(!d)return;
  const dialog=makeModal(root);dialog.querySelector('#difficultyV2Details').innerHTML=modalHTML(d.w,d.d);
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 },true);
 const observe=()=>{const el=doc.getElementById('tableWrap')||doc.body;new MutationObserver(schedule).observe(el,{childList:true,subtree:true});schedule()};
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
}
return {WEBLIO_TO_10,R_CUTS,makeIndex,evaluate,mount};
});
