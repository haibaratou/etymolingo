/* Local viewer integration only. Canonical classifications are opened by the user. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.VocabularyClassificationManager=api;
})(typeof globalThis==='object'?globalThis:this,function(root){
 'use strict';
 const scriptURL=root.document?.currentScript?.src;
 function isLocal(location){return location?.protocol==='file:'||(['http:','https:'].includes(location?.protocol)&&['localhost','127.0.0.1','[::1]','::1'].includes(location?.hostname));}
 function attach(words,reviewed=[]){
  if(!isLocal(root.location)||!words.length||root.document.getElementById('classificationDialog'))return;
  const doc=root.document,dialog=doc.createElement('dialog');
  dialog.id='classificationDialog';dialog.setAttribute('aria-labelledby','classificationDialogTitle');
  dialog.innerHTML='<div class="classificationBar"><h2 id="classificationDialogTitle">カテゴリー・タグ管理</h2><button type="button" class="tBtn" data-close autofocus>閉じる</button></div><p class="classificationIntro">この画面はローカル専用です。端末内の下書きと、管理正本への取込みを区別します。正本への取込みは差分JSONを出力し、検証CLIで行います。</p><p class="classificationLoading" role="status"></p><div class="classificationBody"></div>';
  doc.body.append(dialog);
  const body=dialog.querySelector('.classificationBody'),loading=dialog.querySelector('.classificationLoading');
  let mounting=null;
  const dependencies=[["vocabulary-classification-reference.js","cfbc981d6c5c"],["vocabulary-classification-editor.js","78648514c6e7"],["vocabulary-classification-recovery.js","3cbfbf4701b9"]];
  function load(name,revision){return new Promise((resolve,reject)=>{
   const script=doc.createElement('script');
   script.src=new URL('classifications/'+name+'?v='+revision,scriptURL).href;
   script.onload=resolve;script.onerror=()=>reject(Error('管理用コードを読み込めません: '+name));
   doc.head.append(script);
  });}
  async function mount(){
   loading.textContent='現在の辞書に分類管理を準備しています…';
   for(const [name,revision] of dependencies)await load(name,revision);
   const editor=root.VocabularyClassificationEditor.mount(words,reviewed,null,{
    host:body,fileInputOnly:true,storageKey:'vocabulary-master-local-classification-draft-v1'
   });
   const recovery=root.VocabularyClassificationRecovery.mount(words,null,{host:body});
   editor.panel.removeAttribute('style');recovery.panel.removeAttribute('style');
   editor.panel.querySelector(':scope > details').open=true;
   // Keep the selected editor above the result list rather than below 100 rows.
   const results=editor.panel.querySelector('[data-results]');
   results.before(editor.panel.querySelector('[data-editor]'));
   await Promise.all([editor.ready,recovery.ready]);
   loading.textContent='';dialog.scrollTop=0;
   doc.documentElement.dataset.classificationReady='1';
  }
  async function open(){
   dialog.showModal();
   if(!mounting)mounting=mount();
   try{await mounting;}catch(error){loading.textContent='分類管理を起動できません: '+error.message;}
  }
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  const installButton=()=>{
   const toolbar=doc.getElementById('toolbar');if(!toolbar||toolbar.querySelector('[data-open-classifications]'))return;
   const button=doc.createElement('button');button.type='button';button.className='tBtn';
   button.dataset.openClassifications='';button.textContent='カテゴリー・タグ管理';
   button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',dialog.id);
   button.onclick=open;toolbar.insertBefore(button,toolbar.querySelector('#tCount'));
  };
  const oldToolbar=root.renderToolbar;
  root.renderToolbar=function(...args){const result=oldToolbar.apply(this,args);installButton();return result;};
  installButton();doc.documentElement.dataset.classificationLocalAttached='1';
  return {dialog,open};
 }
 return {isLocal,attach};
});
