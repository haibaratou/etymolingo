/* Add conservative verb-form details only when the Explorer expands its
   native detail row. This does not mutate dictionary records or render a
   generic past form as a standalone illustrated word. */
(function(root){
'use strict';
if(!root?.document||!/\/etymon-explorer\.html$/.test(root.location.pathname))return;
const doc=root.document;
const morphologyScript=doc.createElement('script');morphologyScript.src='shared/nominal-adjective-inflections.js';morphologyScript.onload=()=>schedule();doc.head.append(morphologyScript);
const style=doc.createElement('style');
style.textContent='.ety-inflection-detail{margin:12px 0 8px;padding:10px 12px;border:1px solid #bdd1c7;border-radius:10px;background:#f7faf8;color:#273c33;font-size:13px}.ety-inflection-detail strong{display:block;margin-bottom:6px}.ety-inflection-detail .ety-form-items{display:flex;flex-wrap:wrap;gap:7px 16px}.ety-inflection-detail .ety-form-items span{white-space:nowrap}.ety-inflection-detail .ety-form-note{font-size:11px;margin-top:7px;color:#52665d}';
doc.head.append(style);
function column(tr,name){
 const table=tr.closest('table'),heads=[...(table?.querySelector('thead tr')?.children||[])];
 const index=heads.findIndex(th=>th.textContent.replace(/\s+/g,'').trim()===name);
 return index>=0?tr.children[index]?.textContent?.trim()||'':'';
}
function esc(v){return String(v||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function add(tr){
 const details=tr.querySelector('td[colspan]')||tr.querySelector('td');if(!details||details.querySelector('.ety-inflection-detail'))return;
 const parent=tr.previousElementSibling;if(!parent?.hasAttribute('data-i'))return;
 const word=parent.querySelector('td.cW .spk[data-say]')?.dataset.say?.trim();
 if(!word)return;
 const pos=column(parent,'品詞'),en=column(parent,'パラフレーズ'),ja=column(parent,'語義');
 const api=root.EtymonVerbInflections;
 let forms=api?.lookup(word,pos),lemma=null;
 if(!forms&&pos.split('/').includes('動')&&(
    /\b(?:past|past participle|preterite)\b/i.test(en)||
    /過去形|過去分詞/.test(ja)||['went','was','were'].includes(word.toLowerCase()))){
  lemma=api?.lemmaForForm(word,'past')||api?.lemmaForForm(word,'past_participle');
  if(lemma)forms=api.lookup(lemma,'動');
 }
 const nominal=root.EtymonNominalAdjectiveInflections?.lookup(word,pos)||[];
 if(!forms&&!nominal.length)return;
 const node=doc.createElement('section');node.className='ety-inflection-detail';
 const title=lemma?'基本動詞 '+lemma+' の活用形':'動詞の活用形';
 const verb= forms?'<strong>'+esc(title)+'</strong><div class="ety-form-items">'+forms.map(f=>'<span>'+esc(f.label)+'：<b lang="en">'+esc(f.value)+'</b></span>').join('')+'</div>':'';
 const other=nominal.map(group=>'<strong>'+esc(group.category)+'の活用形</strong><div class="ety-form-items">'+group.forms.map(f=>'<span>'+esc(f.label)+'：<b lang="en">'+esc(f.value)+'</b></span>').join('')+'</div>').join('');
 node.innerHTML=verb+other+'<div class="ety-form-note">確認済みの語形のみ表示します。語義・品詞が異なる同綴語には流用しません。</div>';
 details.append(node);
}
let pending=false;
function scan(){
 pending=false;
 for(const tr of doc.querySelectorAll('#tableWrap table tr.detRow'))add(tr);
}
function schedule(){if(!pending){pending=true;queueMicrotask(scan);}}
const observe=()=>{const wrap=doc.getElementById('tableWrap');if(!wrap)return;
 new MutationObserver(schedule).observe(wrap,{childList:true,subtree:true});
 schedule();
};
if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})(typeof window==='object'?window:null);
