(()=>{
  if(window.name==='wildwordopia-manager-site-bridge'&&parent!==window)return;
  'use strict';
  const channel='wildwordopia-character-manager',modes=['comparison','history'],views={},ready=new Set(),pending={};
  const buttons=Object.fromEntries(modes.map(mode=>[mode,document.getElementById('tab-'+mode)]));let comparisonState=null;
  function send(mode,message){views[mode]?.receive({channel,...message});}
  function route(){const[name,query='']=location.hash.slice(1).split('?');return{mode:modes.includes(name)?name:'comparison',root:new URLSearchParams(query).get('root')||''};}
  function navigate(mode,root=''){const hash='#'+mode+(root?'?root='+encodeURIComponent(root):'');if(location.hash===hash)activate();else location.hash=hash;}
  function handle(mode,message){
    if(message?.type==='wildwordopia-history-state'&&mode==='comparison'){comparisonState=message;views.history?.receive(message);return;}
    if(message?.channel!==channel)return;
    if(message.type==='history-count'&&mode==='history')document.getElementById('history-count').textContent='('+message.count.toLocaleString('ja-JP')+'件)';
    if(message.type==='root-unavailable')document.getElementById('manager-status').textContent=message.root+'一族の正式画像は未登録です。全履歴から過去の記録を確認できます。';
    if(message.type==='ready'){
      ready.add(mode);if(mode==='history')document.getElementById('history-count').textContent='('+message.count.toLocaleString('ja-JP')+'件)';
      if(pending[mode]){send(mode,{type:'show-root',root:pending[mode]});delete pending[mode];}
      if(mode==='history'&&comparisonState)views.history.receive(comparisonState);
    }
    if(message.type==='navigate'&&modes.includes(message.mode))navigate(message.mode,typeof message.root==='string'?message.root:'');
  }
  function ensure(mode){
    if(views[mode])return;
    const host=document.getElementById('view-'+mode);host.innerHTML=window['WILDWORDOPIA_'+mode.toUpperCase()+'_MARKUP'];
    if(mode==='comparison'){
      const base=new URL('../work/wildwordopia/sample/exploration-20261014/',location.href);
      for(const element of host.querySelectorAll('[src],[href]'))for(const name of ['src','href'])if(element.hasAttribute(name))element.setAttribute(name,new URL(element.getAttribute(name),base).href);
    }
    views[mode]=createCharacterViewRuntime(host,message=>handle(mode,message));
    if(mode==='comparison')startCharacterComparison(views[mode]);else startCharacterHistory(views[mode]);
  }
  function activate(){
    const{mode,root}=route();
    for(const name of modes){const active=name===mode;document.getElementById('panel-'+name).hidden=!active;buttons[name].setAttribute('aria-selected',String(active));buttons[name].tabIndex=active?0:-1;}
    document.getElementById('manager-status').textContent=mode==='comparison'?'正式画像と参考デザイン・制作メモ。各候補から同じ一族の全履歴へ移動できます。':'過去の全データ。削除済み・不採用・未公開の途中版も含み、比較チェックを保持します。';
    ensure(mode);if(root){if(ready.has(mode))send(mode,{type:'show-root',root});else pending[mode]=root;}send(mode,{type:'activate'});
    if(mode==='history'&&comparisonState)views.history.receive(comparisonState);
  }
  for(const mode of modes){buttons[mode].onclick=()=>navigate(mode);buttons[mode].onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?'comparison':event.key==='End'?'history':mode==='comparison'?'history':'comparison';navigate(next);buttons[next].focus();};}
  window.addEventListener('hashchange',activate);
  ensure('comparison');activate();
})();
