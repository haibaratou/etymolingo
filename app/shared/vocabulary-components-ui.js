/* Display and cached predicates for individually sourced components. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabularyComponentsUI=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const choices=[['','語根・部品：すべて'],['confirmed','確認済みの形・部品あり'],['pie','PIE語根の登録あり'],['attested','非PIEの確認形あり'],['mixed','PIE・確認形の混成'],['formative','確認済みの部品のみ'],['multiple','確認済みの構成要素が複数'],['legacy','旧参照のみ'],['uncertain','未確定の参照を含む'],['none','参照未登録'],['unavailable','照合できない参照']];
 const labels={pie_confirmed:'PIE語根確認',attested_confirmed:'確認形あり',mixed_basis_confirmed:'PIE・確認形の混成',formative_only:'部品のみ確認',source_supported:'資料支持',legacy_registered:'旧登録',uncertain:'未確定の旧参照',not_registered:'参照未登録',unavailable:'参照の照合不可'};
 const kinds={pie_reconstruction:'PIE再建語根',attested_lexeme:'確認された語形',attested_morphological_root:'確認された語根',pie_formative:'PIEの語形成要素',proposed_reconstruction:'未確定の再建形',attested_formative:'確認された接辞・部品'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function hasPie(c){return !!c&&(c.confirmed_pie_lexical_count>0||(c.typed_legacy_root_scope?c.eligible_legacy_pie_ref_count:c.legacy_pie_ref_count)>0);}
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
   case 'uncertain':return c.uncertain_count>0||c.legacy_has_uncertain_references||!!c.has_qualified_analyses;
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
 function chips(binding,word,exclude){
  const seen=new Set();
  return (binding?.rootRefs(word)||[]).filter(ref=>{if(seen.has(ref.key)||exclude?.has(ref.id||ref.entity_id))return false;seen.add(ref.key);return true;}).map(ref=>`<span class="chip verifiedComponent" data-k="${esc(ref.key)}" title="${esc(ref.language+'：'+displayMeaning(binding,word,ref.entity)+' / '+(kinds[ref.kind]||ref.kind))}">${ref.kind==='pie_reconstruction'?'*':''}${esc(ref.form)}<i>${esc(displayMeaning(binding,word,ref.entity))}</i><small>${esc(ref.language)}</small></span>`).join(' ');
 }

 function annotations(binding,word){
  const meta=binding?.annotations?.(word)||null,guard=meta?.word_guard;
  // A caller may mutate a bound object; the cached API guard alone is insufficient then.
  if(!guard||meta.w!==word.w||JSON.stringify(meta.p||[])!==JSON.stringify(word.p||[])
   ||(meta.etymology_id||meta.origin_id||'')!==(word.etymology_id||word.origin_id||'')
   ||['ja','en','pos','b'].some(field=>(word[field]??'')!==guard[field]))return null;
  return meta;
 }
 function legacyRelation(binding,word,key){return (annotations(binding,word)?.legacy_relations||[]).find(r=>r.key===key)||null;}
 function displayMeaning(binding,word,entity){
  // Annotation access is gated by the actual component API's context/source guard.
  if(!binding?.coverage?.(word)?.guard_valid)return entity.meaning;
  const segments=annotations(binding,word)?.assembly_alignment?.segments;
  if(!Array.isArray(segments))return entity.meaning;
  const values=segments.filter(s=>binding.entity(s.entity_ref)?.id===entity.id
   &&s.language===entity.language&&s.correspondence==='source_supported_surface'
   &&typeof s.surface_meaning==='string'&&s.surface_meaning.trim()
   &&Array.isArray(s.evidence)&&s.evidence.length&&s.evidence.every(e=>e&&typeof e.source==='string'
    &&(/^https:\/\//.test(e.source)||/^app\/data\/generated-etymon\/det\/[a-z_]\.json#\d+\[[012]\]$/.test(e.source))))
   .map(s=>s.surface_meaning);
  return values.length&&values.every(value=>value===values[0])?values[0]:entity.meaning;
 }
 function entityChip(binding,id,label,note,word){
  const e=binding?.entity(id);if(!e)return '';
  const uncertain=e.status==='proposed'||e.status==='uncertain',meaning=word?displayMeaning(binding,word,e):e.meaning;
  const navigation=binding.byEntity?.(id).length?` data-k="component:${esc(e.id)}"`:'';
  return `<span class="chip verifiedComponent${uncertain?' proposedComponent':''}" data-component-id="${esc(e.id)}"${navigation} title="${esc(e.language+' / '+(kinds[e.kind]||e.kind)+(note?' / '+note:''))}">${esc(label||e.form)}<i>${esc(meaning)}</i><small>${esc(e.language)}${uncertain?'・仮説':''}</small></span>`;
 }
 function assemblyChips(binding,word,seen){
  const alignment=annotations(binding,word)?.assembly_alignment;if(!alignment)return '';
  const nodes=[];
  for(const segment of alignment.segments){
   const e=binding.entity(segment.entity_ref);if(!e||seen.has(e.id))continue;
   seen.add(e.id);
   const form=segment.surface_form||e.form,label=form===e.form?e.form:form+' ← '+e.form;
   const meaning=segment.surface_meaning||e.meaning;
   const display=segment.render_style==='form_only'?form:segment.render_style==='form_corner_quote'?form+'「'+meaning+'」':form+'（'+meaning+'）';
   nodes.push(entityChip(binding,e.id,label,'組み立て表示：'+display,word));
  }
  return nodes.length?`<span class="assemblyComponentRefs" data-assembly-state="verified">${nodes.join(' ')}</span>`:'';
 }
 function historicalAnalyses(binding,word,options){
  const rows=annotations(binding,word)?.historical_analyses;if(!Array.isArray(rows))return '';
  return rows.filter(a=>!options?.kinds||options.kinds.includes(a.kind)).map(a=>{
   if(!Array.isArray(a.segments))return '';
   const nodes=a.segments.map(s=>{
    const e=binding.entity(s.entity_ref);if(!e||options?.seen?.has(e.id))return '';
    options?.seen?.add(e.id);const chip=entityChip(binding,e.id);return displayMeaning(binding,word,e)===e.meaning?chip:'<span class="componentGeneralMeaning"><small>共有部品の一般義</small>'+chip+'</span>';
   }).filter(Boolean);
   if(!nodes.length)return '';
   const urls=[...new Set((a.evidence||[]).map(e=>e.source).filter(u=>/^https?:\/\//.test(u)))];
   return `<div class="componentLayer${a.kind==='hypothesis'?' componentHypothesis':''}" data-analysis-kind="${esc(a.kind)}"><small>${esc(a.label)}</small><div>${nodes.join(`<span class="componentJoin">${esc(a.separator||'＋')}</span>`)}</div>${a.note?`<div class="componentNote">${esc(a.note)}</div>`:''}<span class="componentSources">${urls.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">資料${i+1}</a>`).join(' · ')}</span></div>`;
  }).join('');
 }
 function sameAttestedLegacy(binding,word,key,visible){
  const meta=annotations(binding,word),rows=meta?.legacy_relations;
  if(!Array.isArray(rows)||!binding?.coverage(word)?.guard_valid||!binding.legacyInfo)return null;
  const matching=rows.filter(row=>row?.key===key);if(matching.length!==1)return null;
  const row=matching[0],fields=['key','status','direct_form','direct_meaning','note','relation','entity_ref','legacy_guard','evidence'];
  const exact=(value,names)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===names.length&&names.every(n=>Object.hasOwn(value,n));
  const supported=value=>['source_supported','confirmed','reviewed'].includes(value);
  const evidence=value=>Array.isArray(value)&&value.length&&value.every(x=>x&&typeof x.source==='string'&&/^https:\/\//.test(x.source));
  if(!exact(row,fields)||row.relation!=='same_attested_lemma'||!supported(row.status)
    ||typeof row.note!=='string'||!row.note.trim()||!evidence(row.evidence))return null;
  const old=binding.legacyInfo(key),guard=row.legacy_guard,e=binding.entity(row.entity_ref);
  const legacyFields=['kind','form','origin_language','meaning','definition_reviewed','definition_source'];
  const editorialFields=['kind','form','origin_language','meaning','editorial_summary_reviewed','editorial_summary_source'];
  const editorial=exact(guard,editorialFields),legacy=exact(guard,legacyFields);
  if(!old||(!editorial&&!legacy))return null;
  const guardFields=editorial?editorialFields:legacyFields;
  const source=editorial?old.editorial_summary_source:old.definition_source;
  if(!guardFields.every(field=>guard[field]===old[field])
    ||(editorial?(old.editorial_summary_reviewed!==true||old.editorial_summary_matches_commentary!==true
      ||old.editorial_original_intact!==true||old.legacy_definition_flags_truthy!==false)
      :(old.editorial_schema_present!==false||old.definition_reviewed!==true))
    ||typeof source!=='string'||!/^https:\/\//.test(source)
    ||old.type!=='latin_lemma'||old.kind!=='latin_lemma'||old.origin_language!=='L'||old.stage!==''
    ||!e||e.kind!=='attested_lexeme'||!['dictionary_attested','individually_confirmed','reviewed'].includes(e.status)
    ||e.language!=='ラテン語'||(e.stage||e.language_stage||'')!==''
    ||e.form!==old.form||row.direct_form!==e.form||row.direct_meaning!==e.meaning||!visible.has(e.id))return null;
  const urls=new Set(row.evidence.map(x=>x.source));
  if(!urls.has(source)||!Array.isArray(e.evidence)||!e.evidence.some(x=>urls.has(x.source)))return null;
  const lineages=binding.wordLineages(word).filter(l=>l.confirmed&&l.role==='lexical'&&!l.uncertain_edges
    &&Array.isArray(l.legacy_root_keys)&&l.legacy_root_keys.includes(key)&&l.confirmed_path_refs.includes(e.id)
    &&Array.isArray(l.evidence)&&l.evidence.some(x=>urls.has(x.source)));
  return lineages.length===1?Object.freeze({key,entity_ref:e.id}):null;
 }
 function legacyDisplay(binding,word,keys,renderLegacy,visible){
  const retained=[],navigation=[];
  for(const key of keys){
   const equivalent=sameAttestedLegacy(binding,word,key,visible);
   if(!equivalent)retained.push(renderLegacy(key));
   else navigation.push(`<span class="chip legacyComponentReference" data-k="${esc(key)}" data-equivalent-component="${esc(equivalent.entity_ref)}" aria-label="${esc('従来の語根グループ '+key)}" title="${esc('同じ確認形の従来グループ：'+key)}">↪</span>`);
  }
  return {legacy:retained.join(' '),navigation:navigation.join(' ')};
 }
 function staleNote(binding,word){
  const rows=binding?.bindingStale?.(word)||[];
  return rows.length?'<div class="componentNote legacyRootBindingStale" data-binding-state="stale">'+rows.map(r=>esc(r.root_key)).join(' / ')+'：語根側の照合ができないため、このPIE接続は保留です。確認済みの語形・部品は保持しています。</div>':'';
 }
 function legacyRootProofs(binding,word){
  return (binding?.legacyRootBindings?.(word)||[]).map(b=>'<div class="componentNote legacyRootWordProof">この語の由来として資料で照合：'+esc(b.reference.key)+'。資料の表記：'+esc(b.sense_match.source_form)+'／意味：'+esc(b.sense_match.source_meaning)+'<div>'+[...new Set(b.evidence.map(e=>e.source))].map((u,i)=>'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">資料'+(i+1)+'</a>').join(' · ')+'</div></div>').join('');
 }
 function typedRootLayer(binding,word){
  const refs=(binding?.rootRefs(word)||[]).filter(r=>r.reference_type==='legacy_root');
  if(!refs.length)return '';
  return '<div class="componentLayer"><small>語別の資料で照合したPIE語根</small>'+chips({...binding,rootRefs:()=>refs},word)+'</div>';
 }
 function rootCell(binding,word,renderLegacy){
  // One renderer owns this cell. Keep old memberships and navigation intact.
  const active=new Set(binding?.legacyRootKeys?.(word)||[]),stale=binding?.bindingStale?.(word)||[];
  const suppressed=new Set([...active,...stale.map(row=>row.root_key)]);
  const keys=[...new Set(Array.isArray(word.p)?word.p:[])].filter(key=>!suppressed.has(key)),meta=annotations(binding,word);
  const bindingNote=staleNote(binding,word);
  if(meta?.component_display==='layered'){
   const seen=new Set(),direct=[];
   for(const l of binding.wordLineages(word))if(l.confirmed&&!seen.has(l.word_ref)){
    seen.add(l.word_ref);
    const e=binding.entity(l.word_ref),label=l.surface_form?l.surface_form+' ← '+e.form:e.form;
    direct.push(entityChip(binding,l.word_ref,label,undefined,word));
   }
   const histories=historicalAnalyses(binding,word),visible=new Set(seen);
   for(const a of meta.historical_analyses||[])for(const s of a.segments||[]){const e=binding.entity(s.entity_ref);if(e)visible.add(e.id);}
   const {legacy,navigation}=legacyDisplay(binding,word,keys,renderLegacy,visible);
   const allPie=keys.length&&keys.every(key=>['pie_registered','pie','pie_root','pie_reconstruction'].includes(binding.legacyInfo?.(key)?.type));
   const label=allPie?'従来のPIE参照（直接部品とは別段階）':'従来の語根参照（直接部品とは別段階）';
   return `<div class="componentLayer"><small>直接の構成形</small><div>${direct.join('<span class="componentJoin">＋</span>')}</div></div>`
    +histories
    +(legacy||navigation?`<div class="componentLayer legacyRootLayer"><small>${label}</small>${legacy}${navigation}</div>`:'')+typedRootLayer(binding,word)+badge(binding.coverage(word))+bindingNote;
  }
  if(meta?.assembly_alignment){
   const seen=new Set(),assembly=assemblyChips(binding,word,seen);
   const materials=historicalAnalyses(binding,word,{kinds:['material_composition'],seen});
   const canonical=chips(binding,word,seen),visible=new Set([...seen,...binding.rootRefs(word).map(ref=>ref.id||ref.entity_id)]);
   const {legacy,navigation}=legacyDisplay(binding,word,keys,renderLegacy,visible);
   return legacy+' '+assembly+materials+' '+canonical+navigation+badge(binding?.coverage(word))+bindingNote;
  }
  const canonical=chips(binding,word),visible=new Set((binding?.rootRefs(word)||[]).map(ref=>ref.id||ref.entity_id));
  const {legacy,navigation}=legacyDisplay(binding,word,keys,renderLegacy,visible);
  return legacy+' '+canonical+navigation+badge(binding?.coverage(word))+bindingNote;
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
  if(!lineages.length)return legacyRootProofs(binding,word)+staleNote(binding,word);
  const rows=lineages.filter(l=>l.confirmed).map(l=>{
   const e=l.terminal_entity,others=l.confirmed_path_refs.filter(id=>id!==e.id).map(id=>binding.entity(id)).filter(Boolean);
   const sources=[...new Set([...(l.evidence||[]),...(e.evidence||[])].map(x=>x.source).filter(x=>/^https?:\/\//.test(x)))];
   return `<div class="componentNote"><b>${l.role==='formative'?'接辞・部品':'語彙を担う要素'}：${esc(e.form)}</b>（${esc(e.language)}）${esc(displayMeaning(binding,word,e))}${others.length?'<br>確認した伝承・派生段階：'+others.map(x=>esc(x.form)+'（'+esc(x.language)+'）').join(' / '):''}${l.uncertain_edges?.length?'<br>さらに古い由来の説は確認形と分けて保留しています。':''}<div>${sources.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">資料${i+1}</a>`).join(' · ')}</div></div>`;
  }).join('');
  return (rows?`<div class="detSec"><b>語根・部品の個別確認</b>${badge(c)}${rows}${historicalAnalyses(binding,word)}<small>各要素で資料が支持する最深の形を表示しています。${c.components_complete?'':'全構成要素の確認は未完了です。'}</small></div>`:'')+legacyRootProofs(binding,word)+staleNote(binding,word);
 }
 function integrateRootMembers(byRoot,binding,roots){
  for(const root of roots)if(!root.component_id&&(binding?.byLegacyRoot?.(root.key)||[]).length)byRoot.set(root.key,Object.freeze([...new Set([...(byRoot.get(root.key)||[]),...(binding?.rootMembers?.(root.key)||[])])]));
  return byRoot;
 }
 function navigationCount(root,binding,byRoot){
  return (binding?.byLegacyRoot?.(root.key)||[]).length?(byRoot.get(root.key)||binding?.rootMembers?.(root.key)||[]).length:(root.all??root.dict);
 }
 return {choices,labels,kinds,hasPie,matches,badge,chips,assemblyChips,rootCell,legacyRelation,historicalAnalyses,info,sourceBadge,details,integrateRootMembers,navigationCount};
});
