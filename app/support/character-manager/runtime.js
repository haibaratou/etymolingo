// Scoped adapters keep both review modules in the same document.
window.createCharacterViewRuntime=function(host,send){
  const nativeWindow=window,nativeDocument=document,handlers=[];
  const scrollTo=(x,y)=>host.scrollTo(x,y),parent={postMessage:send};
  function scopeStyle(style){if(style.tagName==='STYLE')style.textContent='@scope (#'+host.id+') {'+style.textContent.replace(/(^|})\s*(html|body)(?=\s*\{)/g,'$1:scope')+'}';nativeDocument.head.append(style);}
  const scopedDocument={
    querySelector:selector=>host.querySelector(selector),querySelectorAll:selector=>host.querySelectorAll(selector),
    getElementById:id=>host.querySelector('#'+CSS.escape(id)),createElement:tag=>nativeDocument.createElement(tag),
    addEventListener:(...args)=>host.addEventListener(...args),body:host,head:{append:(...styles)=>styles.forEach(scopeStyle)},
    get activeElement(){return nativeDocument.activeElement;}
  };
  const viewWindow={
    addEventListener:(type,handler)=>type==='message'?handlers.push(handler):nativeWindow.addEventListener(type,handler),
    scrollTo,get scrollX(){return host.scrollLeft;},get scrollY(){return host.scrollTop;},
    WILDWORDOPIA_HISTORY:nativeWindow.WILDWORDOPIA_HISTORY
  };
  return {host,document:scopedDocument,window:viewWindow,parent,opener:null,scrollTo,localStorage:nativeWindow.localStorage,
    receive:data=>handlers.forEach(handler=>handler({source:parent,data}))};
};
