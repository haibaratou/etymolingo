/* Numeric-only Explorer comparison: provisional learning, Weblio, image guessability, Ngram.
   Does not write or recalculate any dictionary values. */
(() => {
  'use strict';
  if (!/\/etymon-explorer\.html$/.test(location.pathname)) return;
  const $=(sel,root=document)=>root.querySelector(sel);
  const expectedColumns=[
    {id:'custom',cls:'cCustom',name:'独自Lv',match:/独自レベル|独自Lv|英単語の難易度/},
    {id:'weblio',cls:'cWeblio',name:'Weblio Lv',match:/Weblio\s*Lv|Weblioレベル/},
    {id:'guess',cls:'cGuess',name:'画像推測',match:/画像の推測度|画像推測/}
  ];
  const source='data/generated-etymon/';
  let customByIndex=new Map(),weblioByWord=new Map(),guessByKey=new Map(),sourceValid=false;
  let revision=0,pending=false;
  const css=document.createElement('style');
  css.textContent='.cCustom,.cWeblio,.cGuess{text-align:right!important;font-variant-numeric:tabular-nums;white-space:nowrap;min-width:65px}.cCustom,.cWeblio{font-weight:600}@media(max-width:620px){th.cGuess,td.cGuess{display:none}}';
  document.head.append(css);
  const loadScript=path=>new Promise((resolve,reject)=>{
    const el=document.createElement('script');
    el.src=path;el.onload=resolve;el.onerror=()=>reject(Error(path));
    document.head.append(el);
  });
  function classifyHeader(th){
    if(th.classList.contains('cR')||/^レア度|^Ngram/i.test(th.textContent.trim()))return 'ngram';
    return expectedColumns.find(c=>th.classList.contains(c.cls)||c.match.test(th.textContent))?.id||null;
  }
  function configureHeader(table){
    const header=table.tHead?.rows[0];
    if(!header||header.dataset.numericSetup==='1')return;
    const original=Array.from(header.cells),classes={};
    original.forEach((th,i)=>{const id=classifyHeader(th);if(id)classes[id]=i;});
    const rarity=classes.ngram!==undefined?original[classes.ngram]:$('.cR',header);
    if(!rarity)return;
    table.__numericOriginalIndexes=classes;
    rarity.classList.add('cR');
    // Preserve existing sort handlers and arrows, but change the heading only.
    const tn=Array.from(rarity.childNodes).find(n=>n.nodeType===3);
    if(tn)tn.textContent='Ngram';
    else rarity.textContent='Ngram';
    rarity.title='Ngram頻度を加工したr値。生頻度ではなく、高いほど低頻度です。';
    for(const def of expectedColumns){
      let th=classes[def.id]!==undefined?original[classes[def.id]]:document.createElement('th');
      th.classList.add(def.cls);
      // Newly injected columns are plain headers; no misleading sort affordance.
      if(classes[def.id]===undefined)th.textContent=def.name;
      else{const oldText=Array.from(th.childNodes).find(n=>n.nodeType===3);if(oldText)oldText.textContent=def.name;else th.textContent=def.name;}
      th.title=def.id==='custom'?'独自LvはCEFR-J＋編集済み頻度からの暫定推定。習得難易度の実測ではありません。':def.id==='weblio'?'Weblio掲載の単語単位のレベル。語義別ではありません。':'AIによる画像推測度（0–100）。プレイヤー正答率の実測ではありません。';
      header.insertBefore(th,rarity);
    }
    header.dataset.numericSetup='1';
  }
  function rowRecord(tr){
    const index=Number(tr.dataset.i);
    if(!Number.isInteger(index)||index<0)return null;
    const w=$('td.cW .spk[data-say]',tr)?.dataset.say||'';
    if(!w)return null;
    const e=customByIndex.get(index);
    return {index,w,custom:e?.w===w?e:null};
  }
  function numericOnly(cell,value){
    const s=value===null||value===undefined?'':String(value);
    if(cell.textContent.trim()!==s)cell.textContent=s;
  }
  function paintRow(table,tr){
    if(!tr.hasAttribute('data-i')||tr.classList.contains('detRow'))return;
    if(tr.dataset.numericSetup!=='1'){
      const original=Array.from(tr.cells);
      const colIndex=table.__numericOriginalIndexes||{};
      const rarity=colIndex.ngram!==undefined?original[colIndex.ngram]:$('.cR',tr);
      if(!rarity)return;
      rarity.classList.add('cR');
      for(const def of expectedColumns){
        const td=colIndex[def.id]!==undefined?original[colIndex[def.id]]:document.createElement('td');
        td.classList.add(def.cls);
        tr.insertBefore(td,rarity);
      }
      tr.dataset.numericSetup='1';
    }
    if(tr.dataset.numericRevision===String(revision))return;
    const id=rowRecord(tr);
    const score=id?.custom?.level;
    numericOnly($('.cCustom',tr),Number.isInteger(score)?score:null);
    const wl=id?weblioByWord.get(id.w):null;
    numericOnly($('.cWeblio',tr),Number.isInteger(wl)?wl:null);
    let guess=null;
    if(id?.custom){
      const key=JSON.stringify([id.w,id.custom.p||[]]);
      const data=guessByKey.get(key);
      const img=$('td.cPic img',tr);
      if(data&&img&&img.src.endsWith('/'+data.imagePath)&&Number.isInteger(data.score)&&data.score>=0&&data.score<=100)guess=data.score;
    }
    numericOnly($('.cGuess',tr),guess);
    const rarity=$('.cR',tr);
    if(rarity&&/★|☆|ふだん語|ときどき語|めずらし語|レア語/.test(rarity.textContent)){
      const v=id?.custom?.auxiliaryR;
      numericOnly(rarity,Number.isFinite(v)&&v>0&&v<99999?v:null);
    }
    tr.dataset.numericRevision=String(revision);
  }
  function enhance(){
    pending=false;
    const table=$('#tableWrap table');
    if(!table)return;
    configureHeader(table);
    if(!table.__numericOriginalIndexes)return;
    for(const tr of table.tBodies[0]?.rows||[])paintRow(table,tr);
  }
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(enhance);}
  function refresh(){revision++;schedule();}
  function boot(){
    const wrap=$('#tableWrap');
    if(!wrap)return;
    new MutationObserver(schedule).observe(wrap,{subtree:true,childList:true});
    schedule();
    loadScript(source+'weblio-learning-levels.js?v=92b587b8148d').then(()=>{
      const data=window.ETYMON_WEBLIO_LEVELS;
      weblioByWord=new Map((data?.entries||[]).filter(e=>e.status==='rated'&&Number.isInteger(e.level)&&e.level>=1&&e.level<=30).map(e=>[e.w,e.level]));
      refresh();
    }).catch(e=>console.warn('Explorer Weblio levels unavailable',e));
    Promise.all([
      loadScript('shared/custom-learning-levels.js?v=51f50f7f3b2'),
      loadScript(source+'custom-learning-levels.js?v=f5cfb48d7e4b')
    ]).then(()=>window.EtymonCustomLearningLevels.decode(window.ETYMON_CUSTOM_LEARNING_LEVELS))
      .then(data=>{
        customByIndex=new Map(data.data.entries.map(e=>[e.dictionaryIndex,e]));
        // The JS decoder already checks its checksum, and lookup records remain index+word matched.
        sourceValid=true;refresh();
      }).catch(e=>console.warn('Explorer provisional level data unavailable',e));
    loadScript(source+'puzzle-visual-scores.js?v=20261025').then(()=>{
      guessByKey=new Map((window.ETYMON_PUZZLE_VISUAL_SCORES?.entries||[])
        .map(e=>[JSON.stringify([e.w,e.p||[]]),e]));
      refresh();
    }).catch(e=>console.warn('Explorer visual score data unavailable',e));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
