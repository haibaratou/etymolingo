/* Mother dictionary: visual answerability and CEFR-J learning level. */
(() => {
'use strict';
const scriptBase=document.currentScript.src;
const meanings={answer_length_or_format:'英字3〜14文字が必要',auxiliary_not_visual:'助動詞で絵から答えを特定しにくい',function_word:'機能語',ordinary_person_name:'一般的な人名',no_bound_illustration:'対応画像なし',image_on_or_before_2026_09_10:'9月10日以前の画像',image_date_unverified:'GitHub画像更新日が未確認',updated_image_not_verified:'更新済み画像との対応が未確認',existing_game_hold:'既存の出題保留',illustration_needs_review:'画像内容の確認待ち',image_sense_binding_unverified:'画像と語義の対応を確認待ち',current_image_changed:'画像が解説確認後に更新されている',proper_name_or_capitalized_word_review:'固有名などの確認待ち',part_of_speech_review:'品詞確認待ち',visual_answer_review:'絵から答えを特定できるか確認待ち',reviewed_image_and_content_word_rules:'文字数・品詞・画像更新日の一次条件を通過'};
const posMap={'名':'noun','動':'verb','形':'adjective','副':'adverb','代':'pronoun','前':'preposition','接':'conjunction','間':'interjection','冠':'determiner','助':'modal auxiliary'};
const index=new Map(),scores=new Map(),levels=new Map();let ready=false,failed=false,scheduled=false;
const key=(w,p)=>JSON.stringify([w,p||[]]);
function addCell(tr,cls,before){let c=tr.querySelector('.'+cls);if(!c){c=document.createElement('td');c.className=cls;tr.querySelector(before).before(c);}return c;}
function detail(cell,label,text,signature){if(cell.dataset.signature===signature)return;const d=document.createElement('details'),s=document.createElement('summary'),p=document.createElement('p');s.textContent=label;p.textContent=text;d.append(s,p);cell.replaceChildren(d);cell.dataset.signature=signature;cell.title=text;}
function update(){scheduled=false;for(const table of document.querySelectorAll('table')){
 const head=table.querySelector('thead tr');if(!head?.querySelector('th.cW'))continue;
 if(!head.querySelector('.cPuzzle')){const th=document.createElement('th');th.className='cPuzzle';th.textContent='画像の推測度';th.title='絵だけから英単語を推測できる度合い。100点満点の推定評価';head.querySelector('th.cR').before(th);}
 if(!head.querySelector('.cLearning')){const th=document.createElement('th');th.className='cLearning';th.textContent='英単語の難易度';th.title='CEFR-J 1.6／語彙の学習レベル。レア度とは別';head.querySelector('.cPuzzle').before(th);}
 for(const tr of table.querySelectorAll('tr[data-i]')){
  let w;try{w=typeof WORDS==='undefined'?null:WORDS[Number(tr.dataset.i)];}catch{}if(!w)continue;
  const cell=addCell(tr,'cPuzzle','td.cR'),lc=addCell(tr,'cLearning','.cPuzzle');
  const matches=index.get(key(w.w,w.p))||[];let e=matches.length===1?matches[0]:null;
  if(!e&&matches.length){let path='';try{path=decodeURIComponent(new URL(tr.querySelector('.cPic img')?.src||'',location.href).pathname);}catch{}const exact=matches.filter(r=>r.imagePath&&path.endsWith('/'+r.imagePath));if(exact.length===1)e=exact[0];}
  const raw=e?scores.get(e.id):null;const score=raw&&raw.imageGitBlobSha===e.imageGitBlobSha?raw:null;
  const status=e?.status||'REVIEW';let label=!ready?'読込中':failed?'読込失敗':score?score.score+' / 100':raw?'再評価待ち':status==='NG'?'対象外':'未評価';
  const reason=e?(e.reasons||[]).map(r=>meanings[r]||r).join('／'):'今回の選定記録なし';
  let text=score?score.reasonJa+' 他に浮かぶ答え: '+score.alternativeAnswersEn.join(', ')+ '。内訳: 意味 '+score.components.meaningVisible+'/40・区別 '+score.components.conceptDistinct+'/25・英語の特定 '+score.components.answerSpecific+'/25・見やすさ '+score.components.smallImageReadable+'/10。実画像を確認した推定評価で、プレイヤーの正答率ではありません。':'実画像の採点はまだ行っていません。';
  text+=' 一次条件: '+status+'（'+reason+'）'+(e?.imageUpdatedAt?'。GitHub画像更新: '+e.imageUpdatedAt:'');
  detail(cell,label,text,label+'|'+text);cell.dataset.status=status;cell.dataset.rating=score?(score.score>=85?'high':score.score>=70?'good':score.score>=50?'mid':'low'):'unknown';
  const poses=new Set(String(w.pos||'').split(/[/・,、\s]+/).map(p=>posMap[p]).filter(Boolean));const hits=(levels.get(w.w.toLowerCase())||[]).filter(e=>poses.has(e.pos));const ls=[...new Set(hits.map(e=>e.level))].sort();
  const ll=!ready?'読込中':failed?'読込失敗':ls.length?ls.join(' / '):'未確認';const lt=hits.length?'CEFR-J Wordlist 1.6。'+hits.map(e=>e.pos+': '+e.level).join('、')+'。見出し語・品詞単位の指標で、個別語義や画像の難易度ではありません。':'資料に未掲載、または品詞未対応。未掲載語を上級とは推定しません。';detail(lc,ll,lt,ll+'|'+lt);
 }
 for(const td of table.querySelectorAll('.detRow>td[colspan]'))if(td.colSpan!==head.children.length)td.colSpan=head.children.length;
}}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
function load(name){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('../data/generated-etymon/'+name+'?v=visual-cefr-1',scriptBase).href;s.onload=resolve;s.onerror=reject;document.head.append(s);});}
async function start(){
 const style=document.createElement('style');style.textContent='.cPuzzle,.cLearning{min-width:90px;font-size:12px}.cPuzzle summary,.cLearning summary{cursor:pointer;font-weight:bold;white-space:nowrap}.cPuzzle details p,.cLearning details p{min-width:210px;max-width:290px;white-space:normal;font-size:11px;line-height:1.7}.cPuzzle[data-rating="high"] summary,.cPuzzle[data-rating="good"] summary{color:#257344}.cPuzzle[data-rating="low"] summary{color:#a54d47}.cPuzzle[data-rating="mid"] summary{color:#857449}.cPuzzle[data-rating="unknown"] summary{color:#888}.learning-credit{font-size:11px;line-height:1.7;color:#777;padding:8px 16px}';document.head.append(style);
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule();
 try{
  await Promise.all(['puzzle-eligibility.js','puzzle-visual-scores.js','learning-levels.js'].map(load));
  const env=window.ETYMON_PUZZLE_ENVELOPE;if(env?.encoding!=='gzip-base64')throw Error('Missing puzzle data');const bytes=Uint8Array.from(atob(env.data),c=>c.charCodeAt(0));const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());if(data.schema!==1)throw Error('Unsupported schema');
  for(const e of data.entries){const k=key(e.w,e.p);if(!index.has(k))index.set(k,[]);index.get(k).push(e);}
  const visual=window.ETYMON_PUZZLE_VISUAL_SCORES;if(visual?.schema!==1)throw Error('Missing scores');for(const e of visual.entries)scores.set(e.id,e);
  const learning=window.ETYMON_LEARNING_LEVELS;if(learning?.scheme!=='CEFR-J')throw Error('Missing learning levels');for(const e of learning.entries){const k=e.w.toLowerCase();if(!levels.has(k))levels.set(k,[]);levels.get(k).push(e);}
  const credit=document.createElement('p');credit.className='learning-credit';credit.textContent=learning.attribution+' ／ A1・A2: 基礎段階、B1・B2: 自立して使う段階。画像の推測度は英単語を知っている人を想定した100点満点の推定評価です。';document.body.append(credit);
 }catch{failed=true;}ready=true;schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
