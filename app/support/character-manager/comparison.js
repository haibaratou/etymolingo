window.startCharacterComparison=function(runtime){
const {document,window,parent,opener,scrollTo,localStorage}=runtime;
let removedComparisonImages=new Set();const main=document.querySelector('main'),ref={children:[]},sort=document.querySelector('#root-sort');let filter='all';const initialRoots=[...new Set([...main.children].map(x=>x.dataset.root))];function apply(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));for(const c of main.children)c.hidden=removedComparisonImages.has(c.dataset.root+':'+c.dataset.imageId)||(filter!=='all'&&c.dataset.root!==filter&&c.dataset.series!==filter);for(const c of ref.children)c.hidden=!['all','meaning20'].includes(filter)&&c.dataset.root!==filter;const cs=[...main.children],latest={};cs.forEach((c,i)=>{if(!c.dataset.originalIndex)c.dataset.originalIndex=i+1;latest[c.dataset.root]=Math.max(latest[c.dataset.root]||0,Number(c.dataset.updated)||0)});/* id-sort:start */cs.sort((a,b)=>((sort.value==='id'||sort.value==='id-desc')?((Number(a.dataset.pieRank)||999999)-(Number(b.dataset.pieRank)||999999))*(sort.value==='id-desc'?-1:1):0)||(sort.value==='updated'?(latest[b.dataset.root]||0)-(latest[a.dataset.root]||0):0)||initialRoots.indexOf(a.dataset.root)-initialRoots.indexOf(b.dataset.root)||Number(b.dataset.updated||0)-Number(a.dataset.updated||0)||Number(a.dataset.originalIndex)-Number(b.dataset.originalIndex));cs.forEach((c,i)=>{if(main.children[i]!==c)main.insertBefore(c,main.children[i]||null)});document.querySelector('#visible-count').textContent=[...main.children].filter(c=>!c.hidden).length+'案';}try{sort.value=localStorage.getItem('wildwordopia.compare-sort.v1')||'updated'}catch{}document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;apply()});sort.onchange=()=>{try{localStorage.setItem('wildwordopia.compare-sort.v1',sort.value)}catch{}apply()};apply();
const comparisonDeletedKey='wildwordopia.deleted-images.v1';
try{removedComparisonImages=new Set(JSON.parse(localStorage.getItem(comparisonDeletedKey)||'[]'))}catch{removedComparisonImages=new Set()}
function comparisonSaveDeleted(){localStorage.setItem(comparisonDeletedKey,JSON.stringify([...removedComparisonImages]))}
function comparisonBadges(){const latest={};for(const c of main.children){const k=c.dataset.root+':'+c.dataset.imageId;if(removedComparisonImages.has(k))continue;if(!latest[c.dataset.root]||Number(c.dataset.updated)>Number(latest[c.dataset.root].dataset.updated))latest[c.dataset.root]=c;}for(const c of main.children){let b=c.querySelector('.official-edition');if(!b){b=document.createElement('div');b.className='official-edition';c.querySelector('.copy').prepend(b)}b.textContent=latest[c.dataset.root]===c?'正式版 · '+c.dataset.imageId:'以前の候補 · '+c.dataset.imageId;}}
function comparisonDeleteButton(rid,cid){const b=document.createElement('button');b.type='button';b.className='image-delete comparison-delete';b.textContent='画像を削除';b.onclick=()=>{const scrollX=window.scrollX,scrollY=window.scrollY;removedComparisonImages.add(rid+':'+cid);comparisonSaveDeleted();comparisonApplyDeleted();window.scrollTo(scrollX,scrollY);};return b;}
function comparisonApplyDeleted(){for(const c of main.children)for(const e of c.querySelectorAll('.reference-entry'))e.hidden=removedComparisonImages.has(e.dataset.deleteKey);comparisonBadges();apply();}
for(const c of main.children){
 c.querySelector('.visual').after(comparisonDeleteButton(c.dataset.root,c.dataset.imageId));
 for(const a of [...c.querySelectorAll('.inline-reference')]){const wrap=document.createElement('div');wrap.className='reference-entry';const match=a.getAttribute('href').match(/root-.*?-(v\d+)\.png/);const cid=match?match[1]:'original';wrap.dataset.deleteKey=c.dataset.root+':'+cid;a.before(wrap);wrap.append(a,comparisonDeleteButton(c.dataset.root,cid));}
}
document.querySelector('#restore-deleted-images').onclick=()=>{removedComparisonImages.clear();comparisonSaveDeleted();comparisonApplyDeleted();};
comparisonApplyDeleted();

;
(()=>{const d=document.getElementById('design-rules-dialog');document.getElementById('design-rules-open').onclick=()=>d.showModal();document.getElementById('design-rules-close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});})();
;
(()=>{
  const stateKey='wildwordopia.root-candidate-review.v1',backupKey='wildwordopia.root-candidate-review.backup.v1',rootPrefix='wildwordopia.root-note.v1.';
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')||{}}catch{return {}}}
  function state(){const merged={reviews:{},previews:{}};for(const key of ['wildwordopia.root-candidate-review.top100-backup.v1',backupKey,stateKey]){const s=read(key);Object.assign(merged.previews,s.previews||{});for(const [k,v]of Object.entries(s.reviews||{})){if(!merged.reviews[k]||Date.parse(v.updatedAt||'')>=Date.parse(merged.reviews[k].updatedAt||'')||!merged.reviews[k].updatedAt)merged.reviews[k]=v;}}return merged;}
  function save(s){localStorage.setItem(stateKey,JSON.stringify(s));localStorage.setItem(backupKey,JSON.stringify(s));}
  function stored(k){return localStorage.getItem(k)||'';}
  const toolbar=document.createElement('div');toolbar.className='comparison-note-toolbar';
  const exportButton=document.createElement('button');exportButton.id='send-production-notes';exportButton.type='button';exportButton.textContent='記入済みメモを一括で取り出す';
  const feedback=document.createElement('span');feedback.id='comparison-note-feedback';feedback.setAttribute('role','status');feedback.textContent='各画像の下に修正依頼を書けます。入力すると自動保存します。';toolbar.append(exportButton,feedback);document.querySelector('header').append(toolbar);
  function refresh(){const s=state();document.querySelectorAll('.comparison-candidate-note').forEach(t=>{if(document.activeElement!==t)t.value=s.reviews[t.dataset.noteKey]?.comment||'';});document.querySelectorAll('.comparison-root-note').forEach(t=>{if(document.activeElement!==t)t.value=stored(rootPrefix+t.dataset.root);});}
  for(const card of document.querySelectorAll('main > article')){
    const rid=card.dataset.root,cid=card.dataset.imageId,key=rid+':'+cid,panel=document.createElement('section');panel.className='comparison-note-panel';
    const label=document.createElement('label'),input=document.createElement('textarea'),status=document.createElement('span');input.id='correction-'+rid+'-'+cid;input.className='comparison-candidate-note';input.dataset.noteKey=key;input.value=state().reviews[key]?.comment||'';input.placeholder='この画像への修正依頼を書いてください';label.htmlFor=input.id;label.textContent='修正依頼・メモ（'+cid+'）';status.className='note-status';status.setAttribute('role','status');status.textContent='入力するとすぐ自動保存';
    input.addEventListener('input',()=>{try{const s=state();s.reviews[key]={decision:'unselected',history:[],...s.reviews[key],comment:input.value,updatedAt:new Date().toISOString()};save(s);status.textContent='自動保存済み';}catch{status.textContent='保存に失敗しました。入力内容はこの欄に残っています。';}});
    const common=document.createElement('details'),summary=document.createElement('summary'),rootInput=document.createElement('textarea');summary.textContent='この一族すべてに共通する修正点';rootInput.className='comparison-root-note';rootInput.dataset.root=rid;rootInput.setAttribute('aria-label',rid+'一族全体への修正依頼');rootInput.value=stored(rootPrefix+rid);rootInput.placeholder='同じ語根のすべての候補に共通する修正点';rootInput.addEventListener('input',()=>{try{localStorage.setItem(rootPrefix+rid,rootInput.value);refresh();status.textContent='一族共通メモを自動保存しました';}catch{status.textContent='保存に失敗しました';}});common.append(summary,rootInput);panel.append(label,input,status,common);card.querySelector('.copy').append(panel);
  }
  const snapshotKey='wildwordopia.notes-before-clear.v1',historyKey='wildwordopia.note-export-history.v1';
  function collect(){const current=state(),roots={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(rootPrefix))roots[k]=stored(k);}return {roots,reviews:current.reviews,global:stored('wildwordopia.global-review-note.v1'),at:new Date().toISOString()};}
  function hasNotes(snapshot){return Object.values(snapshot.roots||{}).some(v=>String(v).trim())||Object.values(snapshot.reviews||{}).some(v=>v.comment?.trim())||Boolean(snapshot.global?.trim());}
  function archive(snapshot){if(!hasNotes(snapshot))return;let history=[];try{history=JSON.parse(localStorage.getItem(historyKey)||'[]')}catch{}history.push(snapshot);localStorage.setItem(historyKey,JSON.stringify(history.slice(-12)));localStorage.setItem(snapshotKey,JSON.stringify(snapshot));}
  function restoreSnapshot(snapshot){if(!hasNotes(snapshot))return 0;const current=state();let count=0;for(const [key,value]of Object.entries(snapshot.reviews||{})){if(!value.comment?.trim()||current.reviews[key]?.comment?.trim())continue;current.reviews[key]={...current.reviews[key],comment:value.comment,updatedAt:new Date().toISOString()};count++;}for(const [key,value]of Object.entries(snapshot.roots||{})){if(String(value).trim()&&!stored(key).trim()){localStorage.setItem(key,value);count++;}}if(snapshot.global?.trim()&&!stored('wildwordopia.global-review-note.v1').trim()){localStorage.setItem('wildwordopia.global-review-note.v1',snapshot.global);count++;}if(count){save(current);refresh();}return count;}
  const recover=document.createElement('button');recover.type='button';recover.id='restore-exported-notes';recover.textContent='消去前のメモを復元';toolbar.append(recover);
  function recoverNotes(){let snapshots=[];try{snapshots=JSON.parse(localStorage.getItem(historyKey)||'[]')}catch{}const last=read(snapshotKey);if(hasNotes(last))snapshots.push(last);let count=0;for(const snapshot of snapshots.reverse())count+=restoreSnapshot(snapshot);feedback.textContent=count?count+'件のメモをバックアップから復元しました。':'復元できるメモがないか、すでに記入欄へ復元済みです。';return count;}
  recover.onclick=recoverNotes;
  const recoveryMigration='wildwordopia.failed-download-recovery-20261019.v1';
  if(!localStorage.getItem(recoveryMigration)){if(!hasNotes(collect()))recoverNotes();localStorage.setItem(recoveryMigration,'done');}
  const clearSaved=document.createElement('button');clearSaved.type='button';clearSaved.id='clear-saved-notes';clearSaved.textContent='保存できたので書き出したメモを消去';clearSaved.hidden=true;toolbar.append(clearSaved);let pending=null;
  function clearExported(snapshot){archive(snapshot);const current=state();for(const [key,value]of Object.entries(snapshot.reviews||{})){if(current.reviews[key]?.comment===value.comment){current.reviews[key].comment='';current.reviews[key].updatedAt=new Date().toISOString();}}for(const [key,value]of Object.entries(snapshot.roots||{}))if(stored(key)===value)localStorage.removeItem(key);if(stored('wildwordopia.global-review-note.v1')===(snapshot.global||''))localStorage.removeItem('wildwordopia.global-review-note.v1');save(current);refresh();clearSaved.hidden=true;feedback.textContent='保存したメモを消去しました。消去前のバックアップから復元できます。';}
  clearSaved.onclick=()=>{if(pending)clearExported(pending);};
  function textFor(snapshot){const lines=['Wild Wordopia 制作用メモ',''];const roots=snapshot.roots||{},reviews=snapshot.reviews||{};const ids=new Set([...Object.keys(reviews).map(k=>k.split(':')[0]),...Object.keys(roots).map(k=>k.slice(rootPrefix.length))]);for(const rid of ids){const common=roots[rootPrefix+rid]||'',records=Object.entries(reviews).filter(([k,v])=>k.startsWith(rid+':')&&v.comment?.trim());if(!common.trim()&&!records.length)continue;lines.push('## '+rid);if(common.trim())lines.push('【語根全体】',common);for(const [k,v]of records)lines.push('【個別候補 '+k.split(':')[1]+'】',v.comment);lines.push('');}if(snapshot.global?.trim())lines.push('【全体メモ】',snapshot.global);return lines.join('\n');}
  exportButton.onclick=async()=>{
    const snapshot=collect();if(!hasNotes(snapshot)){feedback.textContent='書き出すメモがありません。「消去前のメモを復元」でバックアップを確認できます。';return;}
    archive(snapshot);const text=textFor(snapshot);const stamp=new Date().toLocaleString('sv-SE',{timeZone:'Asia/Tokyo'}).replace(/[^0-9]/g,'');const filename='wildwordopia-production-notes-'+stamp+'-'+Date.now().toString(36)+'.txt';
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);pending=snapshot;clearSaved.hidden=false;feedback.textContent='日時付きの名前でダウンロードを開始しました。メモは残しています。保存できた後に消去してください。';
  };
  const show=document.createElement('button');show.type='button';show.textContent='メモを表示・コピー';show.id='show-production-notes';toolbar.append(show);const dialog=document.createElement('dialog');dialog.style.cssText='width:min(900px,94vw);max-height:90vh;background:#222632;color:white;border:1px solid #667084;border-radius:10px';const textArea=document.createElement('textarea');textArea.style.cssText='width:100%;height:60vh;font:14px/1.6 system-ui';textArea.readOnly=true;textArea.setAttribute('aria-label','制作用メモ全文');const close=document.createElement('button');close.textContent='閉じる';close.onclick=()=>dialog.close();dialog.append(textArea,close);document.body.append(dialog);show.onclick=()=>{textArea.value=textFor(collect());dialog.showModal();textArea.focus();textArea.select();};
  window.addEventListener('storage',refresh);
})();

(()=>{
 // Explicit user request: recover the two com- candidates hidden by accidental deletion.
 const comRecoveryKey='wildwordopia.recover-com-20261019.v1';
 if(!localStorage.getItem(comRecoveryKey)){
  let restored=false;for(const key of ['kom:v021','kom:v022'])if(removedComparisonImages.delete(key))restored=true;
  if(restored){comparisonSaveDeleted();comparisonApplyDeleted();}
  localStorage.setItem(comRecoveryKey,'done');
 }
 const cards=[...main.children],host=document.querySelector('#comparison-filters');
 // A reflow can place the next delete button under a second click or tap.
 let deleteLockedUntil=0;
 document.addEventListener('click',event=>{
  if(!event.target.closest?.('.image-delete'))return;
  const now=performance.now();
  if(now<deleteLockedUntil||event.detail>1){event.preventDefault();event.stopImmediatePropagation();return;}
  deleteLockedUntil=now+1200;
 },true);
 const undo=document.createElement('button');undo.type='button';undo.id='undo-last-image-delete';undo.textContent='直前の削除を戻す';undo.style.margin='8px';
 undo.onclick=()=>{const key=[...removedComparisonImages].at(-1);if(!key)return;const x=window.scrollX,y=window.scrollY;removedComparisonImages.delete(key);comparisonSaveDeleted();comparisonApplyDeleted();window.scrollTo(x,y);};
 document.querySelector('#restore-deleted-images').before(undo);
 const style=document.createElement('style');style.textContent=`
 .candidate-name-row{display:flex;align-items:center;gap:10px;width:100%}.candidate-name-row h2{flex:1;min-width:0;margin:0}.candidate-name-row>.image-delete{flex:none;margin:0;padding:5px 9px;white-space:nowrap}.copy .official-edition{margin-top:0}
 .appearance-group{margin:12px 0}.appearance-group strong{display:block;margin-bottom:7px}.appearance-options{display:flex;flex-wrap:wrap;gap:6px}.appearance-options button{border:1px solid #667084;background:#252c39;color:#eef0f6;border-radius:16px;padding:6px 11px;cursor:pointer}.appearance-options button[aria-pressed=true]{background:#dbe8fc;color:#172033;border-color:#dbe8fc}
 .comparison-search{display:flex;align-items:center;gap:10px;margin:14px 0}.comparison-search input{flex:1;min-width:0;max-width:600px;padding:10px 12px;border:1px solid #667084;border-radius:7px;background:#222632;color:#fff;font:16px system-ui}.comparison-search label{font-weight:600}
 `;document.head.append(style);
 for(const c of cards){const h=c.querySelector('.copy h2'),button=c.querySelector(':scope>.image-delete');if(h&&button){const row=document.createElement('div');row.className='candidate-name-row';h.before(row);button.textContent='削除';button.setAttribute('aria-label',h.textContent+'の画像を削除');row.append(h,button);}}
 const searchRow=document.createElement('div');searchRow.className='comparison-search';const label=document.createElement('label');label.htmlFor='comparison-search';label.textContent='検索';const search=document.createElement('input');search.id='comparison-search';search.type='search';search.placeholder='語根・キャラ名・英単語・PIE ID / No.';searchRow.append(label,search);host.before(searchRow);
 function animal(raw){for(const [pattern,name]of [[/フェネック/,'フェネック'],[/アナグマ/,'アナグマ'],[/オオカミ|狼/,'オオカミ'],[/ネコ|猫/,'ネコ'],[/イヌ|犬/,'イヌ'],[/ウサギ|兎/,'ウサギ'],[/ハムスター/,'ハムスター'],[/ネズミ|鼠/,'ネズミ'],[/ヒツジ|羊/,'ヒツジ'],[/ウシ|牛/,'ウシ'],[/クマ|熊/,'クマ']])if(pattern.test(raw))return name;return raw||'未記録';}
 function hair(raw){for(const [pattern,name]of [[/桃|ピンク|ローズ/,'桃系'],[/紫|ラベンダー|ライラック/,'紫系'],[/アクア|青|ブルー|紺|シアン/,'青系'],[/緑|グリーン|ミント|ティール/,'緑系'],[/白|銀|シルバー|アイボリー/,'白・銀系'],[/オレンジ|橙|赤|朱|珊瑚/,'赤・橙系'],[/金|黄|ブロンド/,'金・黄系'],[/黒|ブラック|チャコール/,'黒系'],[/茶|ブラウン|栗/,'茶系']])if(pattern.test(raw))return name;return raw||'未記録';}
 for(const c of cards){c.appearanceAnimal=animal(c.dataset.animal);c.appearanceHair=hair(c.dataset.hair);c.appearanceSearch=((c.querySelector('.copy')?.textContent||'')+' '+c.dataset.root+' '+c.dataset.pieRank+' '+String(c.dataset.pieRank||'').padStart(3,'0')).toLocaleLowerCase();}
 const ageGroups=['未設定','幼児','子ども','思春期','大人','老人'],ageKey='wildwordopia.design-age-groups.v1';let ageState={};try{ageState=JSON.parse(localStorage.getItem(ageKey)||'{}')}catch{}
 for(const c of cards){const key=c.dataset.root+':'+c.dataset.imageId;const saved=ageState[key]||c.dataset.designAgeGroup;c.appearanceAge=ageGroups.includes(saved)?saved:'未設定';}
 const selected={animal:'all',hair:'all',age:'all'};
 function group(key,title,field){const section=document.createElement('section');section.className='appearance-group';const heading=document.createElement('strong');heading.textContent=title;const options=document.createElement('div');options.className='appearance-options';const values=key==='age'?ageGroups:[...new Set(cards.map(c=>c[field]))].sort((a,b)=>a.localeCompare(b,'ja'));for(const value of ['all',...values]){const button=document.createElement('button');button.type='button';button.dataset.traitGroup=key;button.dataset.traitValue=value;button.textContent=value==='all'?'すべて':value;button.setAttribute('aria-pressed',String(value==='all'));button.onclick=()=>{selected[key]=value;for(const sibling of options.children)sibling.setAttribute('aria-pressed',String(sibling===button));apply();};options.append(button);}section.append(heading,options);host.append(section);}
 group('animal','動物モチーフ','appearanceAnimal');group('hair','髪の基本色','appearanceHair');group('age','想定年齢','appearanceAge');
 const originalApply=apply;apply=function(){originalApply();const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);for(const c of cards)c.hidden=c.hidden||(selected.animal!=='all'&&c.appearanceAnimal!==selected.animal)||(selected.hair!=='all'&&c.appearanceHair!==selected.hair)||(selected.age!=='all'&&c.appearanceAge!==selected.age)||terms.some(t=>!c.appearanceSearch.includes(t));document.querySelector('#visible-count').textContent=cards.filter(c=>!c.hidden).length+'案';};search.addEventListener('input',()=>apply());apply();
})();

(()=>{
 const style=document.createElement('style');style.textContent=`
 html{scrollbar-gutter:stable}main{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:0 16px 28px}main>article{min-width:0}.visual{cursor:zoom-in}.copy{padding:12px}
 @media(max-width:999px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:599px){main{grid-template-columns:minmax(0,1fr);padding-left:10px;padding-right:10px}}
 .inline-reference-strip{gap:5px}.reference-entry,.inline-reference{flex-basis:56px}.inline-reference img{width:56px;height:56px}.inline-reference{font-size:9px}.reference-entry .image-delete{display:none}
 #comparison-image-viewer{position:fixed;inset:0;margin:auto;width:96vw;height:94dvh;max-width:1400px;max-height:94dvh;padding:0;border:1px solid #667084;border-radius:12px;background:#222632;color:#fff;overflow:hidden}
 #comparison-image-viewer::backdrop{background:rgba(0,0,0,.8)}.image-viewer-top{height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 12px}.image-viewer-top span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.image-viewer-top button{flex:none;min-height:44px}.image-viewer-stage{height:calc(100% - 58px);background:#ddd8d3;padding:10px;display:flex;align-items:center;justify-content:center}.image-viewer-stage img{display:block;max-width:100%;max-height:100%;object-fit:contain}
 `;document.head.append(style);
 for(const button of document.querySelectorAll('.reference-entry .image-delete'))button.remove();
 const dialog=document.createElement('dialog');dialog.id='comparison-image-viewer';dialog.setAttribute('aria-label','キャラクター画像の拡大表示');
 const bar=document.createElement('div');bar.className='image-viewer-top';const title=document.createElement('span'),close=document.createElement('button');close.type='button';close.textContent='閉じる';bar.append(title,close);const stage=document.createElement('div');stage.className='image-viewer-stage';const image=document.createElement('img');image.alt='';stage.append(image);dialog.append(bar,stage);document.body.append(dialog);
 let origin=null,x=0,y=0,oldOverflow='';
 document.addEventListener('click',event=>{const link=event.target.closest?.('main a.visual,main a.inline-reference');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();origin=link;x=window.scrollX;y=window.scrollY;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';const card=link.closest('article');title.textContent=(card?.querySelector('h2')?.textContent||'参考デザイン')+' '+(link.querySelector('span')?.textContent||card?.dataset.imageId||'');image.src=link.href;image.alt=title.textContent;dialog.showModal();});
 close.onclick=()=>dialog.close();dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;origin?.focus({preventScroll:true});window.scrollTo(x,y);image.removeAttribute('src');});
})();


globalThis.attachCharacterComparison(runtime,{main,initialRoots,getRemoved:()=>[...removedComparisonImages],setRoot:root=>{filter=root;apply();}});
};
