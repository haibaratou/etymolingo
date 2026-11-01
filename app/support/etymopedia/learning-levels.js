/* Read-only canonical data adapter; never changes artwork, saved selections or DB levels. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymopediaLearning=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const key=row=>JSON.stringify([row.w,row.p||[]]);
 const norm=value=>String(value||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').trim().replace(/\s+/g,' ');
 const first=value=>norm(String(value||'').split('、')[0]);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const valid=level=>Number.isInteger(level)&&level>=1&&level<=10;
 const theme=level=>valid(level)?Math.ceil(level*7/10):0;
 function stars(level){
  if(!valid(level))return '';
  return Array.from({length:Math.ceil(level/2)},(_,i)=>'<span class="el-star'+(i*2+1===level?' el-half':'')+'">★</span>').join('');
 }
 function pill(level,big=false,word){
  const known=valid(level),label=known?'難易度 '+level/2+' / 5（独自10段階のレベル'+level+'）':'難易度 未分類';
  return '<button type="button" class="etymon-rarity er-surface er-t'+theme(level)+' er-'+(big?'detail':'list')+' el-pill" data-etymopedia-difficulty="1" data-level="'+(known?level:'')+'"'+(word?' data-word="'+esc(word.w)+'" data-roots="'+esc(JSON.stringify(word.p||[]))+'"':'')+' data-stars="'+(known?level/2:0)+'" data-scale="5" title="'+esc(label+'。タップして根拠を表示')+'" aria-label="'+esc(label+'。根拠を表示')+'">'+(known?'<span class="el-stars" aria-hidden="true">'+stars(level)+'</span>':'<span>未分類</span>')+'</button>';
 }
 function create(difficulty,index,rows,roots=[]){
  const canonical=new Map(),duplicates=new Set(),rootMap=new Map(),confirmedLayout=new Set();
  for(const row of rows){const k=key(row);if(canonical.has(k))duplicates.add(k);canonical.set(k,row);}
  for(const row of roots){if(rootMap.has(row.key))rootMap.set(row.key,null);else rootMap.set(row.key,row);}
  function status(row){
   const k=key(row),source=canonical.get(k);
   if(!source)return {status:'missing',source:null};
   if(duplicates.has(k))return {status:'ambiguous',source:null};
   if(first(row.jp)!==first(source.ja)&&!confirmedLayout.has(k))return {status:'sense_hold',source:null};
   return {status:'matched',source};
  }
  function lookup(row){const s=status(row);return s.source?difficulty.evaluate(s.source,index):null;}
  function update(row){
   const s=status(row);row.canonicalStatus=s.status;
   if(s.source){const w=s.source;row.jp=w.ja||'';row.gloss=w.en||'';row.memo=w.b||'';row.pos=w.pos||'';row.region=w.g||'';row.ipa=w.phonetic||'';}
   return row;
  }
  const api={lookup,status,update,source:row=>status(row).source,roots:rootMap};
  // Exact reviewed exception: the legacy root identity is not an approved assembly.
  api.pieRoots=row=>key(row)===JSON.stringify(['adjacent',['ad-','yē-']])?null:(api.source(row)?.p||null);
  // Display selection only: do not mistake familiar spelling for a basic sense.
  const exampleHolds=new Set([['anima',['anə-']],['animus',['anə-']],['rectus',['reg-']],['mare',['mori-']],['mere',['mori-']]].map(x=>JSON.stringify(x)));
  const everydayExamples=new Set(['head','animal','anime','phone','fate','ban','infant','quick','zoo','survive','vitamin','a','an','no','one','eleven','onion','rule','dress','rich','view','story','history','wise','advice','advise','project','inject','marine','marsh','submarine','mermaid','automatic','date','tradition','edition','donate','donation','knee','kneel','polygon','hexagon']);
  api.rootExamples=function(rootKey,explanation,candidates,hasArt){
   const reviewedRoot=rootMap.get(rootKey);
   if(!reviewedRoot||reviewedRoot.definition_reviewed!==true||reviewedRoot.d!==explanation)return [];
   const tokens=new Set((String(explanation||'').match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).map(x=>x.toLowerCase()));
   const seen=new Set();return candidates.filter(row=>{
    const source=api.source(row),roots=api.pieRoots(row),level=api.lookup(row)?.level;
    if(!source||exampleHolds.has(key(source))||!roots?.includes(rootKey)||!tokens.has(source.w.toLowerCase())||!Number.isInteger(level)||level<1||level>9||!hasArt(source)||seen.has(source.w.toLowerCase()))return false;
    seen.add(source.w.toLowerCase());return true;
   }).sort((a,b)=>Number(everydayExamples.has(b.w))-Number(everydayExamples.has(a.w))||api.lookup(a).level-api.lookup(b).level||a.w.length-b.w.length||a.w.localeCompare(b.w)).slice(0,6);
  };
  api.apply=function(words,lexicon,displayRoots,byId){
   // Featured cards and the family list sometimes use different Japanese wording.
   // Accept that wording only when the existing page independently contains the
   // same exact canonical identity AND first sense; never infer from spelling.
   const legacy=[...words,...Object.values(lexicon).flat().map(row=>({w:row[0],jp:row[2],p:row[4]}))];
   for(const row of legacy){const k=key(row),source=canonical.get(k);if(source&&!duplicates.has(k)&&first(row.jp)===first(source.ja))confirmedLayout.add(k);}
   words.forEach(update);Object.values(byId).forEach(update);
   for(const arr of Object.values(lexicon))for(const row of arr){
    const s=status({w:row[0],jp:row[2],p:row[4]});
    if(s.source){row[1]=s.source.g||'';row[2]=s.source.ja||'';row[3]=s.source.b||'';}
   }
   for(const root of Object.values(displayRoots)){
    const source=rootMap.get(root.pie);
    if(source?.definition_reviewed===true&&typeof source.d==='string'&&source.d){root.note=source.d;root.jp=source.ja||root.jp;}
   }
  };
  return api;
 }
 async function decodeSnapshot(envelope){
  if(envelope?.schema!==1||envelope.encoding!=='gzip-base64')throw Error('Current Etymopedia data unavailable');
  const packed=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
  const bytes=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
  if(hash!==envelope.sha256)throw Error('Current Etymopedia data checksum mismatch');
  const data=JSON.parse(new TextDecoder().decode(bytes));
  if(data.schema!==1||!Array.isArray(data.words)||!Array.isArray(data.roots))throw Error('Incomplete current Etymopedia data');
  return data;
 }
 async function load(options={}){
  const scope=options.scope||globalThis;
  // Use the same integrity-checked public projection on HTTP and file://.
  // Never overwrite it with older shared dictionary JSON or source shards.
  const data=await decodeSnapshot(scope.ETYMOPEDIA_CURRENT_DATA);
  const engine=scope.EtymonDifficultyV2;
  if(!engine||!Array.isArray(scope.ETYMON_WEBLIO_LEVELS?.entries)||!Array.isArray(scope.ETYMON_LEARNING_LEVELS?.entries))throw Error('Current difficulty evidence unavailable');
  const api=create(engine,engine.makeIndex(scope.ETYMON_WEBLIO_LEVELS,scope.ETYMON_LEARNING_LEVELS),data.words,data.roots);
  api.phonetic=async row=>api.source(row)?.phonetic||'';
  return api;
 }
 function details(word,result,status='matched'){
  const level=result?.level??null;
  const hold=status==='sense_hold'?'旧表示と正本の語義が異なるため、自動更新を保留しています。':status==='ambiguous'?'同じ識別情報を持つ語が複数あり、特定できません。':status==='missing'?'現在の正本と同じ綴り・語根構成を確認できません。':status==='unavailable'?'現在の正本データを読み込めませんでした。再読み込みまたはデータ更新が必要です。':'';
  const official=result?.official?.length?result.official.map(x=>esc(x.pos)+' '+esc(x.level)).join(' / '):'該当なし';
  return '<h2>'+esc(word?.w||'難易度の目安')+'</h2><div class="el-dialog-stars">'+pill(level,true)+'</div><p>星は最大5個、半星刻みです。正本の独自10段階を表示時だけ2で割ります。'+(valid(level)?' レベル'+level+' → '+level/2+'つ星。':' 未分類は最低レベルに置き換えません。')+'</p>'+(word?'<dl><dt>Weblio Lv（1〜30）</dt><dd>'+esc(result?.web??'—')+'</dd><dt>CEFR-J（品詞別）</dt><dd>'+official+'</dd><dt>補助資料（加工r）</dt><dd>'+esc(result?.raw??'—')+'</dd></dl>':'')+'<p>'+esc(hold||result?.note||'Weblioを主指標とし、未収録語はCEFR-J、加工rの順に補います。')+'</p><p class="el-caution">公式CEFRの細分類や実測の学習難易度ではありません。</p>';
 }
 function bind(scope=globalThis){
  if(scope.document.documentElement.dataset.etymopediaDifficultyBound)return;
  scope.document.documentElement.dataset.etymopediaDifficultyBound='1';
  scope.document.addEventListener('click',event=>{
   const button=event.target.closest?.('[data-etymopedia-difficulty]');if(!button||button.closest('#etymopediaDifficultyDialog'))return;
   event.stopPropagation();event.preventDefault();
   let dialog=scope.document.getElementById('etymopediaDifficultyDialog');
   if(!dialog){dialog=scope.document.createElement('dialog');dialog.id='etymopediaDifficultyDialog';dialog.setAttribute('aria-label','難易度の説明');dialog.innerHTML='<div class="el-details"></div><button type="button" class="el-close">閉じる</button>';scope.document.body.append(dialog);dialog.querySelector('.el-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
   const word=button.dataset.word?{w:button.dataset.word,p:JSON.parse(button.dataset.roots),jp:''}:null;
   const service=scope.etymopediaLevels,actual=word&&scope.etymopediaWord?.(word.w,word.p);
   const result=actual?service?.lookup(actual):{level:button.dataset.level?Number(button.dataset.level):null};
   const state=!service?'unavailable':actual?service.status(actual).status:'matched';
   dialog.querySelector('.el-details').innerHTML=details(actual||word,result,state);
   dialog.showModal();
  },true);
 }
 return {key,norm,first,valid,theme,stars,pill,create,decodeSnapshot,load,details,bind};
});
