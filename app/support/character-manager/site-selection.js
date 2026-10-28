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
  const chosen=()=>{const draft=read(draftKey),result={};let removed=[];try{removed=JSON.parse(localStorage.getItem('wildwordopia.deleted-images.v1')||'[]')}catch{}for(const c of cards()){if(removed.includes(c.dataset.root+':'+c.dataset.imageId))continue;const root=c.dataset.root;const selected=draft[root]===c.dataset.imageId;const old=result[root];if(selected||(!old?.selected&&(!old||Number(c.dataset.updated||0)>=Number(old.card.dataset.updated||0))))result[root]={card:c,selected}}return result};
  function refresh(){const picked=chosen();for(const c of cards()){const active=picked[c.dataset.root]?.card===c,b=c.querySelector('.official-like');if(b){b.textContent=active?'♥':'♡';b.setAttribute('aria-pressed',String(active));b.title=active?'正式画像（もう一度押すと最新画像を自動選択）':'この画像を正式画像にする'}const badge=c.querySelector('.official-edition');if(badge)badge.textContent=(active?'正式版 · ':'以前の候補 · ')+c.dataset.imageId}}
  for(const c of cards()){const b=document.createElement('button');b.type='button';b.className='official-like';b.setAttribute('aria-label','この画像を正式画像にする');b.onclick=e=>{e.preventDefault();e.stopPropagation();const draft=read(draftKey),root=c.dataset.root;if(draft[root]===c.dataset.imageId)delete draft[root];else draft[root]=c.dataset.imageId;localStorage.setItem(draftKey,JSON.stringify(draft));refresh()};c.append(b)}
  const bar=document.createElement('div');bar.className='site-publish-bar';const publish=document.createElement('button');publish.type='button';publish.textContent='選択した正式画像をサイトへ反映';publish.id='publish-site-images';const status=document.createElement('span');status.className='site-publish-status';status.role='status';status.textContent='♡で選択。未選択の一族は最後に生成した画像を使用。';bar.append(publish,status);host.querySelector('header').append(bar);
  publish.onclick=()=>{try{const selections={};for(const [root,{card}]of Object.entries(chosen())){const img=card.querySelector('.visual img');if(!img)continue;selections[root]={id:card.dataset.imageId,src:img.src,updatedAt:new Date().toISOString()}}localStorage.setItem(publishedKey,JSON.stringify(selections));status.textContent=Object.keys(selections).length+'一族を反映しました。サイトを開き直しても維持されます。';const channel=new BroadcastChannel('wildwordopia-manager-images');channel.postMessage(selections);channel.close();refresh()}catch(e){status.textContent='保存できませんでした：'+e.message}};
  host.addEventListener('click',()=>queueMicrotask(refresh));refresh();
 });
})();
