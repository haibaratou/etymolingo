(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MultilingualAnswers=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const norm=x=>String(x||'').normalize('NFC').trim();
  const input=x=>String(x||'').normalize('NFKC').toLowerCase().trim();
  const key=w=>JSON.stringify([w.w,w.p||[],...(w.etymology_id?[w.etymology_id]:[])]);
  const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function index(data){if(data?.schema!==1||!Array.isArray(data.entries))throw Error('Unsupported multilingual data');return new Map(data.entries.map(e=>[key(e),e]));}
  function current(s,w){const ja=String(w.ja||'').split('、'),en=String(w.en||'').split(' / ');return s.binding_status!=='stale_sense'&&norm(ja[s.index])===norm(s.ja_gloss)&&norm(en[s.index])===norm(s.en_gloss);}
  function lines(data,w,lang){
    const entry=data.get(key(w));
    return String(w.ja||'').split('、').map((_,i)=>{
      const s=entry?.senses.find(x=>x.index===i),a=s?.[lang];
      if(!s||!a||a.status==='missing')return `${i+1}. 未入力`;
      if(!current(s,w))return `${i+1}. 語義変更・要再確認`;
      const label=a.status==='reviewed'?'確認済み':'候補・未確認';
      const reading=lang==='ja'?a.romanization:a.pinyin;
      const forms=Array.isArray(a.accepted_inputs)?a.accepted_inputs.join(' / '):'';
      return `${i+1}. ${a.text} / ${reading}［${label}］${forms?' · 入力: '+forms:''}`;
    });
  }
  function html(data,w,lang){return lines(data,w,lang).map(x=>`<div>${esc(x)}</div>`).join('');}
  function accepts(data,w,senseIndex,lang,typed){const e=data.get(key(w)),s=e?.senses.find(x=>x.index===senseIndex),a=s?.[lang];return !!(s&&current(s,w)&&a?.status==='reviewed'&&a.accepted_inputs.some(x=>input(x)===input(typed)));}
  return {index,lines,html,accepts,key,current};
});
