/* Shared choices and current file revisions outrank stale browser-only records. */
(()=>{
 'use strict';const store=window.WildSiteImageStore;let local={},selections={};
 const apply=value=>{if(value&&typeof value==='object')local=value;const clean=store.resolve(window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS,local,location.href,window.WILDWORDOPIA_LATEST_CHARACTER_IMAGES);if(JSON.stringify(clean)===JSON.stringify(selections))return;selections=clean;window.dispatchEvent(new Event('wildwordopia-selection-changed'))};
 window.WILDWORDOPIA_MANAGER_IMAGE=c=>{for(const key of [c.id,c.rootKey,String(c.rootKey||'').replace(/-/g,'')])if(selections[key])return selections[key].src;return ''};
 apply();
 try{const channel=new BroadcastChannel('wildwordopia-manager-images');channel.onmessage=e=>apply(e.data)}catch{}
 addEventListener('DOMContentLoaded',()=>{const frame=document.createElement('iframe'),token=crypto.randomUUID();frame.hidden=true;frame.name='wildwordopia-manager-site-bridge';frame.src=new URL('character-manager.html',location.href).href;frame.setAttribute('aria-hidden','true');addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.data?.type==='wildwordopia-manager-images'&&e.data.token===token)apply(e.data.selections)});frame.onload=()=>frame.contentWindow.postMessage({type:'wildwordopia-manager-images-request',token},'*');document.body.append(frame)});
})();
