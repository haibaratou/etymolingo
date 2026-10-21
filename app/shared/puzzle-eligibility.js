/* Mother dictionary: visual answerability and official CEFR-J learning level. */
(() => {
'use strict';
const scriptBase=document.currentScript.src;
const meanings={answer_length_or_format:'英字3〜14文字が必要',auxiliary_not_visual:'助動詞で絵から答えを特定しにくい',function_word:'機能語',ordinary_person_name:'一般的な人名',no_bound_illustration:'対応画像なし',image_on_or_before_2026_09_10:'9月10日以前の画像',image_date_unverified:'GitHub画像更新日が未確認',updated_image_not_verified:'更新済み画像との対応が未確認',existing_game_hold:'既存の出題保留',illustration_needs_review:'画像内容の確認待ち',image_sense_binding_unverified:'画像と語義の対応を確認待ち',current_image_changed:'画像が解説確認後に更新されている',proper_name_or_capitalized_word_review:'固有名などの確認待ち',part_of_speech_review:'品詞確認待ち',visual_answer_review:'絵から答えを特定できるか確認待ち',reviewed_image_and_content_word_rules:'文字数・品詞・画像更新日の一次条件を通過'};
const index=new Map(),scores=new Map(),levels=new Map();let learningLookup=null,customLookup=null;let ready=false,failed=false,scheduled=false;
const key=(w,p)=>JSON.stringify([w,p||[]]);
function addCell(tr,cls,before){let c=tr.querySelector('.'+cls);if(!c){c=document.createElement('td');c.className=cls;tr.querySelector(before).before(c);}return c;}
function detail(cell,label,text,signature){if(cell.dataset.signature===signature)return;const d=document.createElement('details'),s=document.createElement('summary'),p=document.createElement('p');s.textContent=label;p.textContent=text;d.append(s,p);cell.replaceChildren(d);cell.dataset.signature=signature;cell.title=text;}
function plain(cell,label){const signature='plain|'+label;if(cell.dataset.signature===signature)return;const span=document.createElement('span');span.textContent=label;cell.replaceChildren(span);cell.dataset.signature=signature;cell.title='';}
function update(){scheduled=false;for(const table of document.querySelectorAll('table')){
 const head=table.querySelector('thead tr');if(!head?.querySelector('th.cW'))continue;
 if(!head.querySelector('.cPuzzle')){const th=document.createElement('th');th.className='cPuzzle';th.textContent='画像の推測度';th.title='絵だけから英単語を推測できる度合い。100点満点の推定評価';head.querySelector('th.cR').before(th);}
 if(!head.querySelector('.cLearning')){const th=document.createElement('th');th.className='cLearning';th.textContent='英単語の難易度';th.title='独自レベル1〜10の暫定推定';head.querySelector('.cPuzzle').before(th);}
 for(const tr of table.querySelectorAll('tr[data-i]')){
  let w;try{w=typeof WORDS==='undefined'?null:WORDS[Number(tr.dataset.i)];}catch{}if(!w)continue;
  const cell=addCell(tr,'cPuzzle','td.cR'),lc=addCell(tr,'cLearning','.cPuzzle');
  const rc=tr.querySelector('td.cR');if(rc&&window.EtymonRarity&&rc.dataset.raritySignature!==String(w.r)){rc.innerHTML=window.EtymonRarity.html(window.EtymonRarity.numeric(w.r,'list'))+'<span class="rarity-raw">'+(Number.isFinite(w.r)?w.r:'?')+'</span>';rc.dataset.raritySignature=String(w.r);}
  const matches=index.get(key(w.w,w.p))||[];let e=matches.length===1?matches[0]:null;
  if(!e&&matches.length){let path='';try{path=decodeURIComponent(new URL(tr.querySelector('.cPic img')?.src||'',location.href).pathname);}catch{}const exact=matches.filter(r=>r.imagePath&&path.endsWith('/'+r.imagePath));if(exact.length===1)e=exact[0];}
  const raw=e?scores.get(e.id):null;const score=raw&&raw.imageGitBlobSha===e.imageGitBlobSha?raw:null;
  const status=e?.status||'REVIEW';let label=!ready?'読込中':failed?'読込失敗':score?score.score+' / 100':raw?'再評価待ち':status==='NG'?'対象外':'未採点';
  const reason=e?(e.reasons||[]).map(r=>meanings[r]||r).join('／'):'今回の選定記録なし';
  let text=score?score.reasonJa+(score.alternativeAnswersEn.length?' 候補：'+score.alternativeAnswersEn.join('、')+'。':'')+' 内訳：意味 '+score.components.meaningVisible+'/40、区別 '+score.components.conceptDistinct+'/25、答えの特定 '+score.components.answerSpecific+'/25、見やすさ '+score.components.smallImageReadable+'/10。':raw?'画像更新後の再採点待ち。':status==='NG'?reason:'画像を確認して採点する順番待ち。';
  if(score||status==='NG')detail(cell,label,text,label+'|'+text);else plain(cell,label);cell.dataset.status=status;cell.dataset.rating=score?(score.score>=85?'high':score.score>=70?'good':score.score>=50?'mid':'low'):'unknown';
  const entry=learningLookup?.lookup(w.w,w.pos),custom=customLookup?.lookup(w);
  const ll=!ready?'読込中':failed?'読込失敗':custom?'独自レベル '+custom.level:'未分類';
  const info='独自の暫定推定です。公式CEFRの追加区分や実測の学習難易度ではありません。'+(custom?'根拠: '+custom.basis+'。信頼度: '+custom.confidence+'。'+(custom.targetPosStatus==='unresolved'?'対象品詞未確定。':''):'語義・品詞・根拠の確認待ち。')+(entry?' 既存CEFR-J参照: '+entry.level:'');detail(lc,ll,info,ll+'|'+info);

 }
 for(const td of table.querySelectorAll('.detRow>td[colspan]'))if(td.colSpan!==head.children.length)td.colSpan=head.children.length;
}}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
function load(name){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL((name==='shared-learning-levels.js'?'../shared/learning-levels.js':name==='shared-custom-learning-levels.js'?'../shared/custom-learning-levels.js':name==='shared-rarity-presentation.js'?'../shared/rarity-presentation.js':'../data/generated-etymon/'+name)+'?v=cefr4-1',scriptBase).href;s.onload=resolve;s.onerror=reject;document.head.append(s);});}
async function start(){
 const rarityStyle=document.createElement('link');rarityStyle.rel='stylesheet';rarityStyle.href=new URL('rarity-presentation.css?v=72739a7155e0',scriptBase).href;document.head.append(rarityStyle);
 const style=document.createElement('style');style.textContent='.cPuzzle,.cLearning{min-width:90px;font-size:12px}.cPuzzle summary,.cLearning summary{cursor:pointer;font-weight:bold;white-space:nowrap}.cPuzzle details p,.cLearning details p{min-width:210px;max-width:290px;white-space:normal;font-size:11px;line-height:1.7}.cPuzzle[data-rating="high"] summary,.cPuzzle[data-rating="good"] summary{color:#257344}.cPuzzle[data-rating="low"] summary{color:#a54d47}.cPuzzle[data-rating="mid"] summary{color:#857449}.cPuzzle[data-rating="unknown"] summary{color:#888}.learning-credit{font-size:11px;line-height:1.7;color:#777;padding:8px 16px}';document.head.append(style);
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule();
 try{
  await Promise.all(['puzzle-eligibility.js','puzzle-visual-scores.js','learning-levels.js','shared-learning-levels.js','custom-learning-levels.js','shared-custom-learning-levels.js','shared-rarity-presentation.js'].map(load));
  const env=window.ETYMON_PUZZLE_ENVELOPE;if(env?.encoding!=='gzip-base64')throw Error('Missing puzzle data');const bytes=Uint8Array.from(atob(env.data),c=>c.charCodeAt(0));const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());if(data.schema!==1)throw Error('Unsupported schema');
  for(const e of data.entries){const k=key(e.w,e.p);if(!index.has(k))index.set(k,[]);index.get(k).push(e);}
  const visual=window.ETYMON_PUZZLE_VISUAL_SCORES;if(visual?.schema!==1)throw Error('Missing scores');for(const e of visual.entries)scores.set(e.id,e);
  const learning=window.ETYMON_LEARNING_LEVELS;if(learning?.scheme!=='CEFR-J'||!window.EtymonLearningLevels)throw Error('Missing learning levels');learningLookup=window.EtymonLearningLevels.create(learning);customLookup=await window.EtymonCustomLearningLevels.decode(window.ETYMON_CUSTOM_LEARNING_LEVELS);
  const credit=document.createElement('p');credit.className='learning-credit';credit.textContent='独自レベル：CEFR＋編集済み補助指標による1〜10の暫定推定。CEFR未収録・品詞不一致は低信頼です。画像の推測度：英単語を知っている人を想定し、意味40・区別25・答えの特定25・見やすさ10で採点する推定値です。実測正答率ではありません。';document.body.append(credit);

 }catch{failed=true;}ready=true;schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
