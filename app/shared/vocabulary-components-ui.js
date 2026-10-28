/* Display and cached predicates for individually sourced components. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabularyComponentsUI=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const choices=[['','語根・部品：すべて'],['confirmed','確認済みの形・部品あり'],['pie','PIE語根の登録あり'],['attested','非PIEの確認形あり'],['mixed','PIE・確認形の混成'],['formative','確認済みの部品のみ'],['multiple','確認済みの構成要素が複数'],['legacy','旧参照のみ'],['uncertain','未確定の参照を含む'],['none','参照未登録'],['unavailable','照合できない参照']];
 const labels={pie_confirmed:'PIE語根確認',attested_confirmed:'確認形あり',mixed_basis_confirmed:'PIE・確認形の混成',formative_only:'部品のみ確認',source_supported:'資料支持',legacy_registered:'旧登録',uncertain:'未確定の旧参照',not_registered:'参照未登録',unavailable:'参照の照合不可'};
 const kinds={pie_reconstruction:'PIE再建語根',attested_lexeme:'確認された語形',attested_morphological_root:'確認された語根',pie_formative:'PIEの語形成要素',proposed_reconstruction:'未確定の再建形',attested_formative:'確認された接辞・部品'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function hasPie(c){return !!c&&(c.confirmed_pie_lexical_count>0||c.legacy_pie_ref_count>0);}
 function matches(c,selected){
  if(!selected)return true;if(!c)return selected==='unavailable';
  switch(selected){
   case 'confirmed':return c.has_confirmed_components;
   case 'pie':return hasPie(c);
   case 'attested':return c.confirmed_attested_lexical_count>0;
   case 'mixed':return c.mixed_basis;
   case 'formative':return c.confirmed_formative_count>0&&!c.has_confirmed_lexical;
   case 'multiple':return c.confirmed_pie_lexical_count+c.confirmed_attested_lexical_count+c.confirmed_formative_count>1;
   case 'legacy':return c.legacy_ref_count>0&&!c.has_confirmed_components;
   case 'uncertain':return c.uncertain_count>0||c.legacy_has_uncertain_references;
   case 'none':return c.state==='not_registered';
   case 'unavailable':return c.state==='unavailable';
   default:return false;
  }
 }
 function badge(c){
  const state=c?.state||'unavailable';
  let label=labels[state]||state;
  if(state==='legacy_registered'&&c.legacy_pie_ref_count)label='PIE旧登録';
  if(c?.has_confirmed_components&&c.confidence==='source_supported')label+='（資料支持）';
  const note=c?.has_confirmed_components?'語ごとの資料で確認した形です。構成要素すべての確認完了を意味しません。':state==='not_registered'?'参照が未登録です。語源や語根が存在しないという意味ではありません。':state==='unavailable'?'データ未読込・語義変更・参照不整合などのため確認できません。': '従来の関連付けです。語ごとの直接の由来は未検証です。';
  return `<small class="componentState" data-root-state="${esc(state)}" title="${esc(note)}">${esc(label)}</small>`;
 }
 function chips(binding,word){
  return (binding?.rootRefs(word)||[]).map(ref=>`<span class="chip verifiedComponent" data-k="${esc(ref.key)}" title="${esc(ref.language+'：'+ref.entity.meaning+' / '+(kinds[ref.kind]||ref.kind))}">${ref.kind==='pie_reconstruction'?'*':''}${esc(ref.form)}<i>${esc(ref.entity.meaning)}</i><small>${esc(ref.language)}</small></span>`).join(' ');
 }
 function info(binding,node){
  if(!node.component_id)return '<div class="componentNote">従来の関連グループです。各語の直接の由来・確認状態は表の「語根・部品」で確認できます。</div>';
  const e=binding?.entity(node.component_id);if(!e)return '';
  const sources=[...new Set((e.evidence||[]).map(x=>x.source).filter(x=>/^https?:\/\//.test(x)))];
  return `<div class="componentNote"><b>${esc(kinds[e.kind]||e.kind)}</b> · ${esc(e.language)}<br>語別の資料が支持する範囲で遡った形です。絶対的な最古形・全構成要素の確認を意味しません。${(e.forms||[]).length?'<br>別表記：'+e.forms.map(f=>esc(typeof f==='string'?f:f.form||'')).join(' / '):''}<div>${sources.map((url,i)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">辞書資料${i+1}</a>`).join(' · ')}</div></div>`;
 }
 function sourceBadge(word){
  if(!word.src)return '';
  const entry={etymonline:['EO','Etymonline'],wiktionary:['Wt','Wiktionary'],sense_add:['追加','語義の追加資料'],nonpie_etymology:['語源','非PIE語源の追加資料']}[word.src]||[word.src,word.src];
  return `<span class="srcEO" title="出典: ${esc(entry[1])}">${esc(entry[0])}</span>`;
 }
 function details(binding,word){
  const lineages=binding?.wordLineages(word)||[],c=binding?.coverage(word);
  if(!lineages.length)return '';
  const rows=lineages.filter(l=>l.confirmed).map(l=>{
   const e=l.terminal_entity,others=l.confirmed_path_refs.filter(id=>id!==e.id).map(id=>binding.entity(id)).filter(Boolean);
   const sources=[...new Set([...(l.evidence||[]),...(e.evidence||[])].map(x=>x.source).filter(x=>/^https?:\/\//.test(x)))];
   return `<div class="componentNote"><b>${l.role==='formative'?'接辞・部品':'語彙を担う要素'}：${esc(e.form)}</b>（${esc(e.language)}）${esc(e.meaning)}${others.length?'<br>確認した伝承・派生段階：'+others.map(x=>esc(x.form)+'（'+esc(x.language)+'）').join(' / '):''}${l.uncertain_edges?.length?'<br>さらに古い由来の説は確認形と分けて保留しています。':''}<div>${sources.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">資料${i+1}</a>`).join(' · ')}</div></div>`;
  }).join('');
  return rows?`<div class="detSec"><b>語根・部品の個別確認</b>${badge(c)}${rows}<small>各要素で資料が支持する最深の形を表示しています。${c.components_complete?'':'全構成要素の確認は未完了です。'}</small></div>`:'';
 }
 return {choices,labels,kinds,hasPie,matches,badge,chips,info,sourceBadge,details};
});
