/* Display and cached predicates for individually sourced components. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabularyComponentsUI=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const choices=[['','語根・部品：すべて'],['confirmed','確認済みの形・部品あり'],['pie','PIE語根の登録あり'],['attested','非PIEの確認形あり'],['mixed','PIE・確認形の混成'],['formative','確認済みの部品のみ'],['multiple','確認済みの構成要素が複数'],['legacy','旧参照のみ'],['uncertain','未確定の参照を含む'],['none','参照未登録'],['unavailable','照合できない参照']];
 const labels={pie_confirmed:'PIE語根確認',attested_confirmed:'確認形あり',mixed_basis_confirmed:'PIE・確認形の混成',formative_only:'部品のみ確認',source_supported:'資料支持',legacy_registered:'旧登録',uncertain:'未確定の旧参照',not_registered:'参照未登録',unavailable:'参照の照合不可'};
 const kinds={pie_reconstruction:'PIE再建語根',attested_lexeme:'確認された語形',attested_morphological_root:'確認された語根',pie_formative:'PIEの語形成要素',proposed_reconstruction:'未確定の再建形',attested_formative:'確認された接辞・部品'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Dictionary registration is independent of a word's evidence/binding validity.
 function registeredPie(word,roots){
  return Array.isArray(word?.p)&&word.p.some(key=>{
   if(typeof key!=='string')return false;
   const r=roots instanceof Map?roots.get(key):roots&&Object.prototype.hasOwnProperty.call(roots,key)?roots[key]:null;
   if(!r||r.unresolved||r.component_id||r.alias_of)return false;
   const kind=r.kind||'pie_registered';
   return ['pie_registered','pie','pie_root','pie_reconstruction'].includes(kind)
    &&(!r.origin_language||r.origin_language==='PIE')
    &&typeof (r.pie||r.key)==='string'&&!!(r.pie||r.key);
  });
 }
 function hasPie(c,word,roots){return !!(c?.confirmed_pie_lexical_count>0||(roots?registeredPie(word,roots):(c?.eligible_legacy_pie_ref_count??c?.legacy_pie_ref_count)>0));}
 function matches(c,selected,word,roots){
  if(!selected)return true;if(selected==='pie')return hasPie(c,word,roots);if(!c)return selected==='unavailable';
  switch(selected){
   case 'confirmed':return c.has_confirmed_components;
   case 'pie':return hasPie(c,word,roots);
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
 function confirmedRefs(binding,word){
  // A context-invalid row must never revive cached confirmed chips.
  if(!binding?.coverage?.(word)?.guard_valid||!annotations(binding,word))return [];
  const seen=new Set();
  return (binding.rootRefs(word)||[]).filter(ref=>{
   const key=ref.reference_type==='legacy_root'?'legacy:'+ref.key:ref.id||ref.entity_id||ref.key;
   if(!ref.entity||seen.has(key))return false;seen.add(key);return true;
  });
 }
 function chips(binding,word,exclude){
  return confirmedRefs(binding,word).filter(ref=>!exclude?.has(ref.id||ref.entity_id)).map(ref=>`<span class="chip verifiedComponent" data-k="${esc(ref.key)}" title="${esc(ref.language+'：'+displayMeaning(binding,word,ref.entity)+' / '+(kinds[ref.kind]||ref.kind))}">${ref.kind==='pie_reconstruction'&&!ref.form.startsWith('*')?'*':''}${esc(ref.form)}<i>${esc(displayMeaning(binding,word,ref.entity))}</i><small>${esc(ref.language)}</small></span>`).join(' ');
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
   const segments=options?.includeParent&&a.parent_entity_ref?[{entity_ref:a.parent_entity_ref},...a.segments]:a.segments;
   const nodes=segments.map(s=>{
    const e=binding.entity(s.entity_ref);if(!e||options?.seen?.has(e.id))return '';
    options?.seen?.add(e.id);const chip=entityChip(binding,e.id);return displayMeaning(binding,word,e)===e.meaning?chip:'<span class="componentGeneralMeaning"><small>共有部品の一般義</small>'+chip+'</span>';
   }).filter(Boolean);
   const note=a.note&&!options?.seenNotes?.has(a.note)?a.note:'';
   if(!nodes.length&&!note)return '';
   if(note)options?.seenNotes?.add(note);
   const urls=[...new Set((a.evidence||[]).map(e=>e.source).filter(u=>/^https?:\/\//.test(u)))];
   return `<div class="componentLayer${a.kind==='hypothesis'?' componentHypothesis':''}" data-analysis-kind="${esc(a.kind)}"><small>${esc(a.label)}</small><div>${nodes.join(`<span class="componentJoin">${esc(a.separator||'＋')}</span>`)}</div>${note?`<div class="componentNote">${esc(note)}</div>`:''}<span class="componentSources">${urls.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">資料${i+1}</a>`).join(' · ')}</span></div>`;
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
 function displayCoverage(binding,word){
  const c=binding?.coverage?.(word);
  return c?.guard_valid&&c.has_confirmed_components&&!annotations(binding,word)?{...c,state:'unavailable',guard_valid:false,has_confirmed_components:false}:c;
 }
 function equivalentRegisteredPie(binding,word,ref,registered){
  if(ref.kind!=='pie_reconstruction'||ref.reference_type==='legacy_root'||!ref.entity?.id)return null;
  // Identity comes from explicit, guarded terminal-to-legacy links. A shared
  // entity may carry that link on another word; spelling/meaning never merge roots.
  const candidates=new Set(),members=[word,...(binding?.byEntity?.(ref.entity.id)||[])];
  for(const member of new Set(members)){
   if(!binding?.coverage?.(member)?.guard_valid||!annotations(binding,member))continue;
   for(const line of binding?.wordLineages?.(member)||[]){
    if(!line.confirmed||line.uncertain_edges||line.terminal_entity?.id!==ref.entity.id
      ||line.terminal_entity.kind!=='pie_reconstruction'||line.deepest_confirmed_ref!==ref.entity.id
      ||!line.confirmed_path_refs?.includes(ref.entity.id))continue;
    const keys=line.legacy_root_keys;
    if(!Array.isArray(keys)||!keys.length)continue;
    // Multiple or conflicting explicit targets are not safe display equivalences.
    if(keys.length!==1||typeof keys[0]!=='string')return null;
    const key=keys[0],r=binding?.legacyInfo?.(key);
    if(!member.p?.includes(key)||(binding?.bindingStale?.(member)||[]).some(row=>row.root_key===key))continue;
    const types=['pie_registered','pie','pie_root','pie_reconstruction'];
    if(!r||!types.includes(r.type)||!types.includes(r.kind||'pie_registered')
      ||(r.origin_language&&r.origin_language!=='PIE')||!r.form?.trim())continue;
    candidates.add(key);
   }
  }
  const keys=[...candidates];
  return keys.length===1&&registered.includes(keys[0])?keys[0]:null;
 }
 function mixedAttestedRefs(binding,word,refs,registered){
  // A separately confirmed source material is not a transmission stage on
  // the PIE branch. Keep it visible without promoting it to a PIE root.
  if(!registered.length&&!refs.some(ref=>ref.kind==='pie_reconstruction'))return [];
  const lines=binding?.wordLineages?.(word)||[];
  const pieLines=lines.filter(line=>line.confirmed&&!line.uncertain_edges
   &&refs.some(ref=>ref.kind==='pie_reconstruction'&&ref.lineage_id===line.id
    &&ref.entity?.id===line.terminal_entity?.id));
  if(!pieLines.length&&!registered.length)return [];
  return refs.filter(ref=>{
   if(!['attested_lexeme','attested_morphological_root'].includes(ref.kind)||ref.role!=='formative')return false;
   const matches=lines.filter(line=>line.id===ref.lineage_id);
   if(matches.length!==1)return false;
   const line=matches[0];
   if(!pieLines.length){
    const segments=annotations(binding,word)?.assembly_alignment?.segments||[];
    const aligned=segments.some(segment=>segment.lineage_id===line.id&&line.confirmed_path_refs?.includes(binding.entity(segment.entity_ref)?.id));
    const other=lines.some(peer=>peer.id!==line.id&&peer.confirmed&&!peer.uncertain_edges&&peer.role==='lexical'
     &&segments.some(segment=>segment.lineage_id===peer.id&&peer.confirmed_path_refs?.includes(binding.entity(segment.entity_ref)?.id)));
    if(!aligned||!other)return false;
    // Reuse the identity of an already verified independent source material,
    // not an inferred link from the current row's unrelated legacy root list.
    const shared=(binding?.byEntity?.(ref.entity.id)||[]).some(member=>{
     if(!binding.coverage(member)?.guard_valid||!annotations(binding,member))return false;
     const peers=binding.wordLineages(member)||[];
     const sources=peers.filter(peer=>peer.confirmed&&!peer.uncertain_edges&&peer.role==='formative'
      &&peer.terminal_entity?.id===ref.entity.id&&peer.deepest_confirmed_ref===ref.entity.id
      &&peer.confirmed_path_refs?.includes(ref.entity.id)
      &&!peer.confirmed_path_refs.some(id=>binding.entity(id)?.kind==='pie_reconstruction'));
     return sources.length===1&&peers.some(peer=>peer.id!==sources[0].id&&peer.confirmed&&!peer.uncertain_edges
      &&peer.terminal_entity?.kind==='pie_reconstruction'&&!peer.confirmed_path_refs?.includes(ref.entity.id));
    });
    if(!shared)return false;
   }
   return line.confirmed&&!line.uncertain_edges&&line.role==='formative'
    &&line.deepest_confirmed_ref===ref.entity?.id&&line.terminal_entity?.id===ref.entity?.id
    &&Array.isArray(line.confirmed_path_refs)&&line.confirmed_path_refs.includes(ref.entity.id)
    &&!line.confirmed_path_refs.some(id=>binding.entity(id)?.kind==='pie_reconstruction')
    &&pieLines.every(pie=>pie.id!==line.id&&!pie.confirmed_path_refs?.includes(ref.entity.id));
  });
 }
 function rootCell(binding,word,renderLegacy){
  const refs=confirmedRefs(binding,word),c=displayCoverage(binding,word);
  const blocked=new Set((binding?.bindingStale?.(word)||[]).map(row=>row.root_key));
  const keys=[...new Set(Array.isArray(word?.p)?word.p:[])].filter(key=>!blocked.has(key));
  const pieTypes=new Set(['pie_registered','pie','pie_root','pie_reconstruction']);
  // Registration is not word-specific proof. Keep existing root types intact.
  const registered=keys.filter(key=>{
   const r=binding?.legacyInfo?.(key);
   return r&&pieTypes.has(r.type)&&pieTypes.has(r.kind||'pie_registered')
    &&(!r.origin_language||r.origin_language==='PIE')&&typeof r.form==='string'&&!!r.form.trim();
  });
  const pieRefs=refs.filter(ref=>ref.kind==='pie_reconstruction');
  // PIE formatives remain separately typed elements, never lexical roots.
  const formativeKeys=keys.filter(key=>{
    const r=binding?.legacyInfo?.(key);
    return r?.type==='pie_formative'&&r.kind==='pie_formative'&&r.origin_language==='PIE';
  });
  if(registered.length||pieRefs.length||formativeKeys.length||refs.some(ref=>ref.kind==='pie_formative')){
   // Keep the legacy tag and its broad PIE-group navigation when both refer
   // to the same root. The confirmed entity remains unchanged in details.
   const selected=refs.filter(ref=>(ref.kind==='pie_reconstruction'||ref.kind==='pie_formative')
    &&!equivalentRegisteredPie(binding,word,ref,registered));
   const verifiedKeys=new Set(selected.filter(ref=>ref.reference_type==='legacy_root').map(ref=>ref.key));
   // Only this cell uses the shared PIE meaning. Assembly and details keep
   // their existing contextual glosses and are not affected by this renderer.
   const verified=selected.map(ref=>`<span class="chip verifiedComponent" data-k="${esc(ref.key)}" title="${esc(ref.language+'：'+ref.entity.meaning+' / '+(kinds[ref.kind]||ref.kind))}">${ref.kind==='pie_reconstruction'&&!ref.form.startsWith('*')?'*':''}${esc(ref.form)}<i>${esc(ref.entity.meaning)}</i><small>${esc(ref.language)}${ref.kind==='pie_formative'?'・語形成要素':''}</small></span>`).join(' ');
   const oldPie=registered.filter(key=>!verifiedKeys.has(key));
   const legacy=oldPie.length?'<span class="registeredPieReferences" data-pie-status="registered">'+oldPie.map(renderLegacy).join(' ')+'</span>':'';
   const formatives=formativeKeys.filter(key=>!verifiedKeys.has(key)).map(renderLegacy).join(' ');
   const mixed=mixedAttestedRefs(binding,word,refs,registered);
   const attested=mixed.length?chips({...binding,rootRefs:()=>mixed},word):'';
   return [verified,legacy,formatives,attested].filter(Boolean).join(' ');
  }
  // No registered/confirmed PIE root: retain known forms and the existing
  // uncertain, alias, formative and non-PIE classifications without inference.
  const classified=keys.filter(key=>{const r=binding?.legacyInfo?.(key);return r&&typeof r.form==='string'&&!!r.form.trim();});
  if(classified.length)return keys.map(renderLegacy).join(' ');
  if(refs.length)return chips(binding,word);
  return keys.map(renderLegacy).join(' ')+badge(c);
 }
 function legacyDetails(binding,word){
  const active=new Set(binding?.legacyRootKeys?.(word)||[]);
  const keys=[...new Set(Array.isArray(word?.p)?word.p:[])].filter(key=>!active.has(key));
  if(!keys.length)return '';
  const links=keys.map(key=>{
   const r=binding?.legacyInfo?.(key),pie=['pie_registered','pie','pie_root','pie_reconstruction'].includes(r?.type);
   const form=r?.form||key;
   return `<span class="chip legacyComponentReference" data-k="${esc(key)}" title="${esc('従来の関連グループ：'+key)}">${pie&&!form.startsWith('*')?'*':''}${esc(form)}${r?.meaning?`<i>${esc(r.meaning)}</i>`:''}</span>`;
  }).join(' ');
  return `<details class="legacyRootLayer"><summary>従来の関連グループ</summary><small>語ごとの由来確認とは別の登録です。</small><div>${links}</div></details>`;
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
  const refs=confirmedRefs(binding,word),lineages=annotations(binding,word)?binding?.wordLineages?.(word)||[]:[],c=displayCoverage(binding,word);
  // When PIE-priority hides old non-PIE/uncertain groups on an unbound row,
  // keep those existing registrations accessible in the existing detail layer.
  const unblockedKeys=[...new Set(Array.isArray(word?.p)?word.p:[])].filter(key=>!(binding?.bindingStale?.(word)||[]).some(row=>row.root_key===key));
  const pieKeys=unblockedKeys.filter(key=>{
   const r=binding?.legacyInfo?.(key),types=['pie_registered','pie','pie_root','pie_reconstruction'];
   return r&&((types.includes(r.type)&&types.includes(r.kind||'pie_registered')&&(!r.origin_language||r.origin_language==='PIE')&&typeof r.form==='string'&&!!r.form.trim())
    ||(r.type==='pie_formative'&&r.kind==='pie_formative'&&r.origin_language==='PIE'));
  });
  const hiddenLegacy=!refs.length&&pieKeys.length&&unblockedKeys.some(key=>!pieKeys.includes(key));
  const rows=refs.map(ref=>{
   const e=ref.entity,sources=[...new Set([...(e.evidence||[]),...lineages.filter(l=>l.confirmed&&(l.terminal_entity?.id===e.id||l.id===ref.lineage_id)).flatMap(l=>l.evidence||[])].map(x=>x.source).filter(x=>/^https?:\/\//.test(x)))];
   return `<div class="componentNote" data-confirmed-ref="${esc(ref.id||ref.key)}">${chips({...binding,rootRefs:()=>[ref]},word)}${sources.length?`<div>${sources.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">資料${i+1}</a>`).join(' · ')}</div>`:''}</div>`;
  }).join('');
  const seen=new Set(refs.map(ref=>ref.id||ref.entity_id)),seenNotes=new Set();
  const histories=historicalAnalyses(binding,word,{seen,seenNotes,includeParent:true});
  const stages=[];
  for(const l of lineages)if(l.confirmed)for(const id of l.confirmed_path_refs||[]){
   const e=binding.entity(id);if(!e||seen.has(e.id))continue;
   seen.add(e.id);stages.push(entityChip(binding,e.id));
  }
  const routes=histories+(stages.length?`<div class="componentLayer"><small>ほかの確認された伝承・派生段階</small>${stages.join(' ')}</div>`:'');
  const qualified=lineages.some(l=>l.uncertain_edges?.length)?'<small>さらに古い由来の説は、確認された形と分けて保留しています。</small>':'';
  return (rows?`<div class="detSec"><b>語根・部品の確認資料</b>${badge(c)}${rows}${c?.components_complete?'':'<small>確認できた範囲を表示しています。全構成要素の確認は未完了です。</small>'}</div>`:'')
   +(routes?`<div class="detSec componentHistory"><b>伝承・派生の経路</b>${routes}${qualified}</div>`:'')
   +((refs.length||hiddenLegacy)?legacyDetails(binding,word):'')+staleNote(binding,word);
 }

 function integrateRootMembers(byRoot,binding,roots){
  for(const root of roots)if(!root.component_id&&(binding?.byLegacyRoot?.(root.key)||[]).length)byRoot.set(root.key,Object.freeze([...new Set([...(byRoot.get(root.key)||[]),...(binding?.rootMembers?.(root.key)||[])])]));
  return byRoot;
 }
 function navigationCount(root,binding,byRoot){
  return (binding?.byLegacyRoot?.(root.key)||[]).length?(byRoot.get(root.key)||binding?.rootMembers?.(root.key)||[]).length:(root.all??root.dict);
 }
 return {choices,labels,kinds,registeredPie,hasPie,matches,badge,chips,assemblyChips,rootCell,legacyRelation,historicalAnalyses,info,sourceBadge,details,integrateRootMembers,navigationCount};
});
