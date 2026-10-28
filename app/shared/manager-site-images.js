(()=>{
 'use strict';let selections={};
 const apply=value=>{if(!value||typeof value!=='object')return;const clean={};for(const[root,item]of Object.entries(value)){if(!item||typeof item.src!=='string')continue;try{const url=new URL(item.src,location.href);if(!['file:','http:','https:'].includes(url.protocol))continue;clean[root]={...item,src:url.href}}catch{}}if(JSON.stringify(clean)===JSON.stringify(selections))return;selections=clean;window.dispatchEvent(new Event('wildwordopia-selection-changed'))};
 window.WILDWORDOPIA_MANAGER_IMAGE=c=>{const root=c.id==='ster2'?'ster2':c.id;return selections[root]?.src||selections[c.rootKey]?.src||''};
 try{const channel=new BroadcastChannel('wildwordopia-manager-images');channel.onmessage=e=>apply(e.data)}catch{}
 addEventListener('DOMContentLoaded',()=>{const frame=document.createElement('iframe'),token=crypto.randomUUID();frame.hidden=true;frame.name='wildwordopia-manager-site-bridge';frame.src=new URL('character-manager.html',location.href).href;frame.setAttribute('aria-hidden','true');addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.data?.type==='wildwordopia-manager-images'&&e.data.token===token)apply(e.data.selections)});frame.onload=()=>frame.contentWindow.postMessage({type:'wildwordopia-manager-images-request',token},'*');document.body.append(frame)});
})();
