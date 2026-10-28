window.attachCharacterComparison=function(runtime,comparison){
  const{document,window,parent}=runtime,{main,initialRoots}=comparison,channel='wildwordopia-character-manager';
  function post(message){parent.postMessage({channel,...message});}
  function share(){let rejected=[];try{for(const key of ['wildwordopia.root-candidate-review.top100-backup.v1','wildwordopia.root-candidate-review.backup.v1','wildwordopia.root-candidate-review.v1']){const state=JSON.parse(localStorage.getItem(key)||'{}');for(const[id,review]of Object.entries(state.reviews||{}))if(review.decision==='reject')rejected.push(id);}}catch{}parent.postMessage({type:'wildwordopia-history-state',removed:comparison.getRemoved(),rejected});}
  const header=document.querySelector('header');header.querySelector('h1').textContent='正式画像・参考デザイン';
  const toolbar=document.createElement('div');toolbar.className='comparison-note-toolbar';
  const reset=document.createElement('button');reset.type='button';reset.hidden=true;reset.onclick=()=>{comparison.setRoot('all');reset.hidden=true;};
  const folder=document.createElement('button'),status=document.createElement('span');folder.type='button';folder.textContent='管理画面の保存場所を開く';status.setAttribute('role','status');
  folder.onclick=async()=>{try{const response=await fetch('http://127.0.0.1:8964/api/reveal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'__manager_html__'})});if(!response.ok)throw Error();const result=await response.json();status.textContent='エクスプローラーで選択しました：'+result.path;}catch{status.textContent='保存場所を開くには既存のローカル履歴サーバーが必要です。';}};
  toolbar.append(reset,folder,status);header.append(toolbar);
  for(const card of main.children){const button=document.createElement('button');button.type='button';button.className='clan-history';button.textContent='この一族の全履歴';button.onclick=()=>{share();post({type:'navigate',mode:'history',root:card.dataset.root});};card.querySelector('.copy').append(button);}
  window.addEventListener('message',event=>{if(event.source!==parent||event.data?.channel!==channel)return;if(event.data.type==='activate'){share();return;}if(event.data.type==='show-root'){const root=event.data.root;if(typeof root!=='string')return;if(!initialRoots.includes(root))post({type:'root-unavailable',root});document.querySelectorAll('[data-trait-value="all"]').forEach(button=>button.click());document.getElementById('comparison-search').value='';reset.textContent=root+'一族を表示中 · 全一族に戻る';reset.hidden=false;comparison.setRoot(root);window.scrollTo(0,0);}});
  document.addEventListener('input',share);document.addEventListener('click',()=>queueMicrotask(share));window.addEventListener('storage',share);post({type:'ready',count:main.children.length});share();
};
