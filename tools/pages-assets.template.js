/* Generated for Pages only. Original files and dictionary identities are unchanged. */
(function(){
'use strict';
const root=new URL('./',document.currentScript.src), raw=__RAW_BASE__, mediaExtensions=new Set(__MEDIA_EXTENSIONS__);
function externalMedia(path){
 if(path.startsWith('assets/ui/')||path.split('/').includes('.git'))return false;
 const dot=path.lastIndexOf('.'),slash=path.lastIndexOf('/');
 return path.startsWith('app/games/picture-words/scene-assets/')||(dot>slash&&mediaExtensions.has(path.slice(dot).toLowerCase()));
}
function map(value,base){
 if(typeof value!=='string'||!value||/^(data:|blob:|#)/i.test(value))return value;
 try{const u=new URL(value,base||document.baseURI);if(u.origin!==root.origin||!u.pathname.startsWith(root.pathname))return value;
 const path=decodeURIComponent(u.pathname.slice(root.pathname.length));if(!externalMedia(path))return value;
 return raw+path.split('/').map(encodeURIComponent).join('/')+u.search+u.hash;
 }catch(_){return value;}
}
function srcset(s){return s.replace(/(^|,\s*)([^,\s]+)([^,]*)/g,(_,a,u,b)=>a+map(u)+b);}
function css(s){return s.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(_,q,u)=>'url('+q+map(u)+q+')');}
function prepare(el,value){if(el instanceof HTMLImageElement&&map(value)!==value&&!el.hasAttribute('crossorigin'))el.crossOrigin='anonymous';}
function prop(proto,key,convert){if(!proto)return;const d=Object.getOwnPropertyDescriptor(proto,key);if(!d||!d.set||!d.configurable)return;Object.defineProperty(proto,key,{...d,set(value){prepare(this,String(value));return d.set.call(this,convert(String(value)));}});}
prop(HTMLImageElement.prototype,'src',map);prop(HTMLImageElement.prototype,'srcset',srcset);
if(window.HTMLSourceElement){prop(HTMLSourceElement.prototype,'src',map);prop(HTMLSourceElement.prototype,'srcset',srcset);}
if(window.HTMLMediaElement)prop(HTMLMediaElement.prototype,'src',map);
if(window.HTMLVideoElement)prop(HTMLVideoElement.prototype,'poster',map);
const originalSet=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(name,value){const k=String(name).toLowerCase();let v=String(value);
 if(k==='src'||k==='poster'){prepare(this,v);v=map(v);}else if(k==='srcset')v=srcset(v);else if(k==='style')v=css(v);
 return originalSet.call(this,name,v);
};
for(const key of ['background','backgroundImage','maskImage','borderImageSource','listStyleImage','cssText'])prop(CSSStyleDeclaration.prototype,key,css);
const setProperty=CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty=function(k,v,p){return setProperty.call(this,k,css(String(v)),p);};
if(window.CSSStyleSheet){const insert=CSSStyleSheet.prototype.insertRule;CSSStyleSheet.prototype.insertRule=function(rule,index){return insert.call(this,css(rule),index);};}
const fetchOriginal=window.fetch;
if(fetchOriginal)window.fetch=function(input,init){const u=typeof input==='string'?input:input instanceof URL?input.href:input&&input.url;const target=map(u);
 if(target!==u){if(input instanceof Request)input=new Request(target,{method:input.method,headers:input.headers,mode:'cors',credentials:'omit',cache:input.cache,redirect:input.redirect,signal:input.signal});else input=target;}
 return fetchOriginal.call(this,input,init);
};
if(window.XMLHttpRequest){const open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url,...rest){return open.call(this,method,map(String(url)),...rest);};}
function refresh(el){if(!el||el.nodeType!==1)return;
 for(const key of ['src','poster','srcset','style'])if(el.hasAttribute(key)){const v=el.getAttribute(key),n=key==='srcset'?srcset(v):key==='style'?css(v):map(v);if(v!==n){prepare(el,v);originalSet.call(el,key,n);}}
 if(el.tagName==='STYLE'){const v=el.textContent,n=css(v);if(v!==n)el.textContent=n;}
 el.querySelectorAll('[src],[poster],[srcset],[style],style').forEach(refreshShallow);
}
function refreshShallow(el){for(const key of ['src','poster','srcset','style'])if(el.hasAttribute(key)){const v=el.getAttribute(key),n=key==='srcset'?srcset(v):key==='style'?css(v):map(v);if(v!==n){prepare(el,v);originalSet.call(el,key,n);}}if(el.tagName==='STYLE'){const s=el.textContent,n=css(s);if(n!==s)el.textContent=n;}}
new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')refreshShallow(r.target);else for(const n of r.addedNodes)refresh(n);}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','poster','srcset','style']});
window.ETYMON_ASSET_URL=map;
})();
