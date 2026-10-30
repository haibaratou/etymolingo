(()=>{
 'use strict';
 const draftKey='wildwordopia.manager-official.v1',publishedKey='wildwordopia.manager-published.v1';
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
 const bridgeName='wildwordopia-manager-site-bridge';
 if(window.name===bridgeName&&parent!==window){
   let token='',last='';
   const send=()=>{if(!token)return;const selections=read(publishedKey);const signature=JSON.stringify(selections);if(signature===last)return;last=signature;parent.postMessage({type:'wildwordopia-manager-images',token,selections},'*')};
   addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='wildwordopia-manager-images-request'||typeof e.data.token!=='string')return;token=e.data.token;last='';send()});
   setInterval(send,750);addEventListener('storage',send);return;
 }
 addEventListener('DOMContentLoaded',()=>{
  const host=document.getElementById('view-comparison');if(!host)return;
  const style=document.createElement('style');style.textContent=`#view-comparison .visual{position:relative}#view-comparison article{position:relative}.official-like{position:absolute!important;right:10px;top:10px;z-index:5;width:43px;height:43px;border-radius:50%!important;background:#fff!important;color:#96545c!important;border:1px solid #e5c8cd!important;font:27px/1 Arial!important;box-shadow:0 2px 8px #0002;cursor:pointer}.official-like[aria-pressed=true]{background:#ffe8ed!important;color:#c43f64!important;border-color:#d36b86!important}.site-publish-bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:16px 0}.site-publish-bar button{background:#ffcf72;color:#282323;border:0;border-radius:8px;padding:12px 16px;font-weight:700;cursor:pointer}.site-publish-status{font-size:13px;color:#d5e2ea}`;document.head.append(style);
  const cards=()=>[...host.querySelectorAll('main > article[data-root]')];
  const chosen=()=>{
   const draft=read(draftKey),common=window.WildSiteImageStore.normalize(window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS,location.href),result={};
   let removed=[];try{removed=JSON.parse(localStorage.getItem('wildwordopia.deleted-images.v1')||'[]')}catch{}
   for(const c of cards()){
    if(removed.includes(c.dataset.root+':'+c.dataset.imageId))continue;
    const root=c.dataset.root,hasDraft=Object.prototype.hasOwnProperty.call(draft,root);
    const target=hasDraft?draft[root]:(common[root]?.selectionMode!=='automatic'?common[root]?.id:null);
    const selected=target===c.dataset.imageId,old=result[root];
    if(selected||(!old?.selected&&(!old||Number(c.dataset.updated||0)>Number(old.card.dataset.updated||0))))result[root]={card:c,selected};
   }
   return result;
  };
  function refresh(){const picked=chosen();for(const c of cards()){const active=picked[c.dataset.root]?.card===c,b=c.querySelector('.official-like');if(b){b.textContent=active?'♥':'♡';b.setAttribute('aria-pressed',String(active));b.title=active?'正式画像（もう一度押すと最新画像を自動選択）':'この画像を正式画像にする'}const badge=c.querySelector('.official-edition');if(badge)badge.textContent=(active?'正式版 · ':'以前の候補 · ')+c.dataset.imageId}}
  for(const c of cards()){const b=document.createElement('button');b.type='button';b.className='official-like';b.setAttribute('aria-label','この画像を正式画像にする');b.onclick=e=>{e.preventDefault();e.stopPropagation();const draft=read(draftKey),root=c.dataset.root;if(chosen()[root]?.card===c)draft[root]='@latest';else draft[root]=c.dataset.imageId;localStorage.setItem(draftKey,JSON.stringify(draft));refresh()};c.append(b)}
  const bar=document.createElement('div');bar.className='site-publish-bar';
  const publish=document.createElement('button');publish.type='button';publish.textContent='選択した正式画像を共通ファイルへ保存';publish.id='publish-site-images';
  const migrate=document.createElement('button');migrate.type='button';migrate.id='save-published-site-images';migrate.textContent='このブラウザーの反映済み画像を共通保存';
  const status=document.createElement('span');status.className='site-publish-status';status.role='status';
  const destination='app/support/character-manager/site-image-selections.js';
  const sharedCount=Object.keys(window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS?.selections||{}).length;
  status.textContent=sharedCount?`共通保存済み ${sharedCount}一族。♡で変更し、${destination} に保存してください。`:`画像の選択はまだこのブラウザー内です。${destination} に保存すると他のブラウザーでも使えます。`;
  bar.append(publish,migrate,status);host.querySelector('header').append(bar);
  let saving=false;
  async function saveShared(selections){
   if(saving)return;saving=true;publish.disabled=migrate.disabled=true;
   try{
    const bundle=window.WildSiteImageStore.bundle(window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS,selections,location.href);
    const result=await window.WildSiteImageStore.save(bundle,window);
    if(result.status==='saved'){
     window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS=bundle;
     status.textContent=`${destination} に保存した場合、他のブラウザーでWild Wordopiaを開き直すと同じ画像になります。${Object.keys(bundle.selections).length}一族を書き込みました。ブラウザー内の選択・履歴は残しています。`;
    }else status.textContent=`ダウンロードを開始しました。共通反映はまだ完了していません。保存した site-image-selections.js を ${destination} と置き換えてください。ブラウザー内の選択・履歴は残しています。`;
   }catch(error){status.textContent=error.name==='AbortError'?'共通保存を中止しました。ブラウザー内の選択と履歴は残っています。':`共通保存できませんでした：${error.message} ブラウザー内の選択と履歴は残っています。`;}
   finally{saving=false;publish.disabled=migrate.disabled=false;}
  }
  // Export the existing published map verbatim, without choosing newer candidates.
  migrate.onclick=()=>saveShared(read(publishedKey));
  publish.onclick=()=>{
   try{
    const selections={},store=window.WildSiteImageStore,latest=store.normalize(window.WILDWORDOPIA_LATEST_CHARACTER_IMAGES,location.href);
    const selectedAt=new Date().toISOString();
    for(const [root,{card,selected}]of Object.entries(chosen())){
     const img=card.querySelector('.visual img');if(!img)continue;
     const item={id:card.dataset.imageId,src:img.src,updatedAt:new Date(Number(card.dataset.updated)||0).toISOString(),selectionMode:selected?'explicit':'automatic'};
     if(selected)item.selectedAt=selectedAt;
     const normalized=store.normalize({[root]:item},location.href,true)[root];
     const current=Object.values(latest).find(value=>value.path===normalized.path);
     if(current?.imageSha256){normalized.imageSha256=current.imageSha256;normalized.fileUpdatedAt=current.fileUpdatedAt;}
     selections[root]=normalized;
    }
    localStorage.setItem(publishedKey,JSON.stringify(selections));
    try{const channel=new BroadcastChannel('wildwordopia-manager-images');channel.postMessage(selections);channel.close();}catch{}
    refresh();saveShared(selections);
   }catch(error){status.textContent='このブラウザーへの保存ができませんでした：'+error.message;}
  };
  host.addEventListener('click',()=>queueMicrotask(refresh));refresh();
 });
})();
