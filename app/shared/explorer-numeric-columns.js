/* Color-coded rarity and 10-step learning stars for Explorer.\n   Source metrics are shown only on tap; stored dictionary values are unchanged. */
(() => {
  'use strict';
  if (!/\/etymon-explorer\.html$/.test(location.pathname)) return;
  if(window.__etyExplorerStarsInitialized)return;
  window.__etyExplorerStarsInitialized=true;
  const $=(sel,root=document)=>root.querySelector(sel);
  const expectedColumns=[
    {id:'custom',cls:'cCustom',name:'独自Lv',match:/独自レベル|独自Lv|英単語の難易度/},
    {id:'weblio',cls:'cWeblio',name:'Weblio Lv',match:/Weblio\s*Lv|Weblioレベル/},
    {id:'guess',cls:'cGuess',name:'画像評価',match:/画像の推測度|画像推測|画像評価/}
  ];
  const source='data/generated-etymon/';
  let customByIndex=new Map(),weblioByWord=new Map(),guessByKey=new Map();
  let revision=0,pending=false;
  // Two independent visual signals: rarity (frequency) and learning difficulty.
  const rarityCutoffs=[400,600,800,1000,1400,1800];
  const levelNames=['','入門','初級','基礎','準中級','中級','中上級','上級','超上級','伝説','幻レア'];
  const css=document.createElement('style');
  css.textContent=`
  th.cCustom,td.cCustom,th.cR,td.cR{min-width:86px;text-align:center!important}
  .cCustom,.cWeblio,.cGuess{font-variant-numeric:tabular-nums;white-space:nowrap}
  .cGuess{min-width:65px;text-align:center!important}
  th.cWeblio,td.cWeblio{display:none!important}
  .ety-stars{display:inline-flex;align-items:center;justify-content:center;gap:5px;
    max-width:100%;padding:5px 10px;border-radius:999px;border:1px solid currentColor;
    font-weight:850;font-size:12px;line-height:1.4;cursor:pointer;white-space:nowrap;
    background:#e8f2e8;color:#306841}
  .ety-stars:hover{filter:brightness(.95);transform:translateY(-1px)}
  .ety-stars:focus-visible{outline:3px solid #2467c7;outline-offset:2px}
  .ety-stars .ety-star-icons{letter-spacing:1px;font-size:13px}
  .ety-stars .ety-star-name{font-size:11px}
  .ety-stars.ety-v0{background:#eeeeee;color:#666}
  .ety-stars.ety-v1{background:#e4f2e4;color:#386849}
  .ety-stars.ety-v2{background:#caedd6;color:#216543}
  .ety-stars.ety-v3{background:#b7ebdf;color:#176f66}
  .ety-stars.ety-v4{background:#d4edff;color:#19609a}
  .ety-stars.ety-v5{background:#a7d5fa;color:#163f83}
  .ety-stars.ety-v6{background:#e4d8ff;color:#60419a}
  .ety-stars.ety-v7{background:#e7bfff;color:#703190}
  .ety-stars.ety-v8{background:#f9c8df;color:#852856}
  .ety-stars.ety-v9{background:#ffe2a1;color:#835000;border-color:#c7912b}
  .ety-stars.ety-v10{background:linear-gradient(115deg,#302047,#8651ac,#c46c96);
    color:#fff;border-color:#684283}
  .ety-source-dialog{border:2px solid #d4c9bc;border-radius:18px;padding:22px 24px;
    background:#fffdf8;color:#312820;box-shadow:0 14px 45px #16161644;
    width:min(94vw,470px);max-height:85vh;overflow:auto}
  .ety-source-dialog::backdrop{background:#17131c8c}
  .ety-source-dialog h2{font-size:20px;margin:0 0 14px;overflow-wrap:anywhere}
  .ety-source-dialog dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:10px 18px;margin:14px 0}
  .ety-source-dialog dt{font-weight:800;color:#61554b}
  .ety-source-dialog dd{margin:0;font-variant-numeric:tabular-nums}
  .ety-source-dialog .ety-note{font-size:12px;line-height:1.7;color:#61554b}
  .ety-source-dialog button.ety-close{display:block;margin:16px 0 0 auto;border:0;
    padding:8px 20px;border-radius:999px;background:#4b4038;color:#fff;cursor:pointer}
  @media(max-width:620px){.ety-stars{font-size:11px;padding:4px 6px}
    .ety-stars .ety-star-icons{letter-spacing:0}}
  `;
  document.head.append(css);
  const loadScript=path=>new Promise((resolve,reject)=>{
    const el=document.createElement('script');
    el.src=path;el.onload=resolve;el.onerror=()=>reject(Error(path));
    document.head.append(el);
  });
  function classifyHeader(th){
    if(th.classList.contains('cPic')||/^(画像|イラスト|絵)$/.test(th.textContent.trim()))return 'picture';
    if(th.classList.contains('cR')||/^(レア度|幻レア度|Ngram)/i.test(th.textContent.trim()))return 'ngram';
    return expectedColumns.find(x=>th.classList.contains(x.cls)||x.match.test(th.textContent))?.id||null;
  }
  function configureHeader(table){
    const header=table.tHead?.rows[0];
    if(!header||header.dataset.numericSetup==='1')return;
    const original=Array.from(header.cells),columns={};
    original.forEach((th,i)=>{const key=classifyHeader(th);if(key)columns[key]=i;});
    const rarity=columns.ngram!==undefined?original[columns.ngram]:$('.cR',header);
    if(!rarity)return;
    table.__numericOriginalIndexes=columns;
    rarity.classList.add('cR');
    // Do not replace the header itself; keep the existing sort handler.
    const replaceLabel=(th,value)=>{
      const text=Array.from(th.childNodes).find(x=>x.nodeType===3);
      if(text)text.textContent=value;else th.textContent=value;
    };
    replaceLabel(rarity,'レア度');
    rarity.title='書籍頻度に基づくレア度。タップするとNgram由来の数値を表示';
    let custom=columns.custom!==undefined?original[columns.custom]:document.createElement('th');
    custom.classList.add('cCustom');
    replaceLabel(custom,'英単語の難易度');
    custom.title='独自10段階の★評価。タップすると難易度の根拠を表示';
    header.insertBefore(custom,rarity);
    // Put image guessability beside the image, not among the difficulty metrics.
    const pic=columns.picture!==undefined?original[columns.picture]:$('.cPic',header);
    let guess=columns.guess!==undefined?original[columns.guess]:document.createElement('th');
    guess.classList.add('cGuess');
    replaceLabel(guess,'画像評価');
    guess.title='画像から英語を推測できる度合い（AI推定、0〜100）';
    if(pic)header.insertBefore(guess,pic.nextSibling);
    else header.append(guess);
    const oldWeblio=columns.weblio!==undefined?original[columns.weblio]:null;
    if(oldWeblio)oldWeblio.remove();
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
    if(!cell)return;
    const s=value===null||value===undefined?'':String(value);
    if(cell.textContent.trim()!==s)cell.textContent=s;
  }
  function starButton(level,type){
    const ok=Number.isInteger(level)&&level>=1&&level<=(type==='learning'?10:7);
    const n=ok?level:0;
    const label=type==='learning'?(levelNames[n]||'未分類'):
      (['','ふだん','ときどき','めずらしい','激レア','幻','神','究極'][n]||'未確認');
    const button=document.createElement('button');
    button.type='button';
    button.className='ety-stars ety-v'+(type==='learning'?n:Math.min(10,n===7?10:n+1));
    button.dataset.etyRating=type;
    button.title='タップでCEFR-J・Oxford CEFR・Weblio Lv・Ngramを表示';
    button.setAttribute('aria-label',(type==='learning'?'英単語の難易度':'レア度')+(ok?' レベル'+n:' 未分類')+'。詳細を開く');
    const stars=document.createElement('span');
    stars.className='ety-star-icons';stars.setAttribute('aria-hidden','true');stars.textContent=ok?'★'.repeat(n):'☆';
    const word=document.createElement('span');
    word.className='ety-star-name';word.textContent=label;
    button.append(stars,word);
    return button;
  }
  function placeStar(td,level,type){
    if(!td)return;
    const key=type+':'+String(level??'');
    if(td.dataset.etyScore===key)return;
    td.replaceChildren(starButton(level,type));
    td.dataset.etyScore=key;
  }
  function paintRow(table,tr){
    if(!tr.hasAttribute('data-i')||tr.classList.contains('detRow'))return;
    if(tr.dataset.numericSetup!=='1'){
      const original=Array.from(tr.cells),positions=table.__numericOriginalIndexes||{};
      const rarity=positions.ngram!==undefined?original[positions.ngram]:$('.cR',tr);
      if(!rarity)return;
      rarity.classList.add('cR');
      const custom=positions.custom!==undefined?original[positions.custom]:document.createElement('td');
      custom.classList.add('cCustom');
      tr.insertBefore(custom,rarity);
      const image=positions.picture!==undefined?original[positions.picture]:$('.cPic',tr);
      const guess=positions.guess!==undefined?original[positions.guess]:document.createElement('td');
      guess.classList.add('cGuess');
      if(image)tr.insertBefore(guess,image.nextSibling);else tr.append(guess);
      const web=positions.weblio!==undefined?original[positions.weblio]:null;
      if(web)web.remove();
      tr.dataset.numericSetup='1';
    }
    if(tr.dataset.numericRevision===String(revision))return;
    const rec=rowRecord(tr),e=rec?.custom;
    placeStar($('.cCustom',tr),Number.isInteger(e?.level)?e.level:null,'learning');
    const r=e?.auxiliaryR;
    const rarity=Number.isFinite(r)&&r>0&&r<99999?
      1+rarityCutoffs.filter(c=>r>=c).length:null;
    placeStar($('.cR',tr),rarity,'rarity');
    let guess=null;
    if(e){
      const key=JSON.stringify([rec.w,e.p||[]]);
      const found=guessByKey.get(key),img=$('td.cPic img',tr);
      if(found&&img&&img.src.endsWith('/'+found.imagePath)&&
        Number.isInteger(found.score)&&found.score>=0&&found.score<=100)guess=found.score;
    }
    numericOnly($('.cGuess',tr),guess);
    tr.dataset.numericRevision=String(revision);
  }
  function showSources(tr,kind){
    const rec=rowRecord(tr);if(!rec)return;
    const e=rec.custom,web=weblioByWord.get(rec.w);
    const official=e?.basis==='cefr_anchor_then_edited_auxiliary_split'?
      (e.officialCandidates||[]).join(', '):'';
    const r=e?.auxiliaryR;
    const validR=Number.isFinite(r)&&r>0&&r<99999;
    const level=Number.isInteger(e?.level)?e.level:null;
    const dlg=document.createElement('dialog');dlg.className='ety-source-dialog';
    const heading=document.createElement('h2');
    heading.textContent=rec.w+' — '+(level?'難易度 Lv'+level:'難易度 未分類');
    const description=document.createElement('p');description.className='ety-note';
    description.textContent=kind==='rarity'?'レア度は頻度由来の独立した指標です。':
      '★は独自の10段階評価です。公式CEFRの10段階認定ではありません。';
    const dl=document.createElement('dl');
    for(const [label,value] of [
      ['CEFR-J',official||'未評価・一致なし'],
      ['Oxford CEFR','未連携'],
      ['Weblio Lv',Number.isInteger(web)?String(web):'未取得'],
      ['Ngram（加工r）',validR?String(r):'未取得']
    ]){
      const dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=label;dd.textContent=value;dl.append(dt,dd);
    }
    const note=document.createElement('p');note.className='ety-note';
    note.textContent=(e?.basis==='cefr_anchor_then_edited_auxiliary_split'?
      'CEFR-Jの見出し語＋品詞を基準に、編集済み補助指標で二分した暫定値。':
      'CEFR-Jで直接確認できないため、独自レベルは低信頼の暫定推定。')+
      ' Ngram欄は生頻度ではなく、書籍頻度などから加工・補正されたr値です。';
    const close=document.createElement('button');close.type='button';
    close.className='ety-close';close.textContent='閉じる';
    close.addEventListener('click',()=>dlg.close());
    dlg.addEventListener('close',()=>dlg.remove());
    dlg.append(heading,description,dl,note,close);
    document.body.append(dlg);dlg.showModal();
  }
    function enhance(){
    pending=false;
    // Filter toolbar is redrawn independently of the table.
    // Do not expose numeric source data in the visible list; only the star badges.
    for(const label of document.querySelectorAll('#toolbar .tLabel')){
      if(label.textContent.trim()==='Ngram'||label.textContent.trim()==='幻レア度')label.textContent='レア度';
    }
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
    wrap.addEventListener('click',event=>{
      const button=event.target.closest('button[data-ety-rating]');
      if(button&&wrap.contains(button)){
        event.preventDefault();event.stopPropagation();
        const tr=button.closest('tr[data-i]');
        if(tr)showSources(tr,button.dataset.etyRating);
      }
    });
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
        refresh();
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
