/* Guarded development review notes, separate from dictionary prose. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabularyReviewNotes=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const WORD_FIELDS=['ja','en','pos','b'],ENTITY_FIELDS=['id','form','language','kind','meaning','status'];
 const ISSUE_STATUSES=new Set(['held','conflict','known_issue','resolved','dismissed']);
 const ACTIVE=new Set(['held','conflict','known_issue']);
 const identity=x=>JSON.stringify([x?.w||'',x?.p||[],x?.etymology_id||x?.origin_id||'']);
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const array=x=>Array.isArray(x)?x:[];
 const wordValue=(w,k)=>w[k]===undefined?'':w[k];
 function freeze(value){if(value&&typeof value==='object'){for(const x of Object.values(value))freeze(x);Object.freeze(value);}return value;}
 function requireValue(ok,why){if(!ok)throw Error('Review notes: '+why);}
 function targetValid(x){return x&&same(Object.keys(x).sort(),['w','p','etymology_id'].sort())&&typeof x.w==='string'&&!!x.w&&Array.isArray(x.p)&&x.p.every(y=>typeof y==='string')&&typeof x.etymology_id==='string';}
 function guardValid(g,fields){return g&&same(Object.keys(g).sort(),[...fields].sort())&&fields.every(k=>typeof g[k]==='string');}
 function wordMatches(word,entry){return identity(word)===identity(entry.target)&&WORD_FIELDS.every(k=>wordValue(word,k)===entry.word_guard[k]);}
 function validateRecord(row,batches,ids){
  requireValue(row&&typeof row.id==='string'&&row.id&&!ids.has(row.id),'duplicate/invalid note id');ids.add(row.id);
  requireValue(batches.has(row.batch_id),'unknown batch');
  requireValue(typeof row.summary==='string'&&typeof row.source_review_text==='string','summary/original text must be strings');
  for(const k of ['confirmed_scope','unreviewed_scope'])requireValue(Array.isArray(row[k])&&row[k].every(x=>typeof x==='string'),'invalid '+k);
  requireValue(Array.isArray(row.machine_checks),'machine checks must remain separate');
  requireValue(Array.isArray(row.issues),'issues must be explicit');
  const codes=new Set();
  for(const issue of row.issues){
   requireValue(issue&&typeof issue.code==='string'&&issue.code&&!codes.has(issue.code),'duplicate/invalid issue code');codes.add(issue.code);
   requireValue(ISSUE_STATUSES.has(issue.status)&&typeof issue.reason==='string'&&!!issue.reason,'issue status/reason');
   requireValue(Array.isArray(issue.component_refs)&&issue.component_refs.every(x=>typeof x==='string'),'issue component refs');
  }
 }
 function prepare(payload){
  payload=JSON.parse(JSON.stringify(payload));
  requireValue(payload?.schema===1,'unsupported schema');
  requireValue(Array.isArray(payload.batches)&&Array.isArray(payload.word_notes)&&Array.isArray(payload.component_issues),'invalid registry lists');
  const batches=new Map(),ids=new Set();
  for(const b of payload.batches){requireValue(typeof b.id==='string'&&b.id&&!batches.has(b.id),'duplicate/invalid batch');batches.set(b.id,b);}
  for(const n of payload.word_notes){validateRecord(n,batches,ids);requireValue(targetValid(n.target)&&guardValid(n.word_guard,WORD_FIELDS),'word context guard');}
  for(const n of payload.component_issues){
   validateRecord(n,batches,ids);requireValue(typeof n.component_ref==='string'&&guardValid(n.entity_guard,ENTITY_FIELDS)&&n.entity_guard.id===n.component_ref,'canonical component guard');
   requireValue(Array.isArray(n.affected_words),'explicit affected word list required');
   const seen=new Set();for(const a of n.affected_words){requireValue(targetValid(a.target)&&guardValid(a.word_guard,WORD_FIELDS)&&!seen.has(identity(a.target)),'invalid/duplicate affected word');seen.add(identity(a.target));}
  }
  for(const p of array(payload.pending_scopes))requireValue(typeof p.id==='string'&&typeof p.reason==='string'&&p.target_identities_confirmed===false&&batches.has(p.batch_id),'pending scope cannot imply word identities');
  freeze(payload);return {payload,batches};
 }
 function bind(words,prepared,options={}){
  const {payload,batches}=prepared,groups=new Map(),candidates=new WeakMap(),tracked=new Set(),stateCache=new WeakMap(),wordIndices=new WeakMap();
  const entities=new Map(array(options.componentPayload?.entities).map(e=>[e.id,e])),usersByEntity=new Map(),canonicalRows=new WeakMap();
  const stats={word_notes:payload.word_notes.length,component_issues:payload.component_issues.length,bound_notes:0,missing:0,ambiguous:0};
  const binding=()=>typeof options.getBinding==='function'?options.getBinding():options.binding;
  const entity=id=>{if(typeof options.getEntity==='function')return options.getEntity(id)||null;const current=binding();if(typeof current?.entity==='function')return current.entity(id)||null;if(typeof options.getBinding==='function')return null;return entities.get(id)||null;};
  for(const [i,w]of words.entries()){wordIndices.set(w,i);const k=identity(w);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(w);}
  function registeredRefs(c){
   const refs=new Set();
   for(const l of array(c?.lineages))for(const id of array(l.refs))if(typeof id==='string')refs.add(id);
   for(const s of array(c?.assembly_alignment?.segments))if(typeof s.entity_ref==='string')refs.add(s.entity_ref);
   for(const a of array(c?.historical_analyses)){if(typeof a.parent_entity_ref==='string')refs.add(a.parent_entity_ref);for(const s of array(a.segments))if(typeof s.entity_ref==='string')refs.add(s.entity_ref);}
   return new Set([...refs].map(id=>entity(id)?.id).filter(Boolean));
  }
  function literalLineageRefs(c){return new Set(array(c?.lineages).flatMap(l=>array(l.refs)).filter(id=>typeof id==='string'));}
  // A cached canonical-reference index, distinct from confirmed ancestry or affected scope.
  for(const c of array(options.componentPayload?.words)){
   const group=groups.get(identity(c))||[];if(group.length!==1)continue;const w=group[0];canonicalRows.set(w,c);
   if(c.review_note||array(c.lineages).some(l=>l.review_note))tracked.add(w);
   if(!c.word_guard||!wordMatches(w,{target:c,word_guard:c.word_guard}))continue;
   for(const id of registeredRefs(c)){if(!usersByEntity.has(id))usersByEntity.set(id,new Set());usersByEntity.get(id).add(w);}
  }
  function add(entry,n,shared){const group=groups.get(identity(entry.target))||[];if(!group.length){stats.missing++;return;}if(group.length!==1)stats.ambiguous++;
   for(const w of group){const list=candidates.get(w)||[];list.push({record:n,target:entry.target,word_guard:entry.word_guard,shared_component:shared||null});candidates.set(w,list);tracked.add(w);stats.bound_notes++;}}
  for(const n of payload.word_notes)add(n,n,null);
  for(const n of payload.component_issues)for(const a of n.affected_words)add(a,n,n.component_ref);
  function existingMeta(w){return binding()?.annotations?.(w)||null;}
  function signature(w,list,meta){return JSON.stringify([identity(w),WORD_FIELDS.map(k=>wordValue(w,k)),list.filter(n=>n.shared_component).map(n=>[n.shared_component,ENTITY_FIELDS.map(k=>entity(n.shared_component)?.[k]),[...literalLineageRefs(canonicalRows.get(w))]]),meta?.word_guard||null]);}
  function get(w){
   const list=candidates.get(w)||[],meta=existingMeta(w),sig=signature(w,list,meta),cached=stateCache.get(w);if(cached?.signature===sig)return cached.value;
   const notes=[],diagnostics=[],existing_notes=[],seen=new Set();
   const conflict=(id,reason)=>diagnostics.push({id,reason,code:'review_context_conflict',status:'conflict',issue_type:'saved_review_context_not_etymology_verdict'});
   for(const n of list){
    const currentGroup=(groups.get(identity(n.target))||[]).filter(x=>identity(x)===identity(n.target));
    if(currentGroup.length!==1){conflict(n.record.id,'duplicate_exact_identity');continue;}
    if(!wordMatches(w,n)){conflict(n.record.id,'word_context_drift');continue;}
    if(n.shared_component){const e=entity(n.shared_component);
     if(!e||!ENTITY_FIELDS.every(k=>e[k]===n.record.entity_guard[k])){conflict(n.record.id,'component_context_drift');continue;}
     if(!literalLineageRefs(canonicalRows.get(w)).has(n.shared_component)){conflict(n.record.id,'component_not_in_registered_word_references');continue;}
    }
    notes.push({record:n.record,shared_component:n.shared_component});
   }
   if(meta){
    const hasNotes=typeof meta.review_note==='string'&&!!meta.review_note.trim()||array(meta.lineages).some(l=>typeof l.review_note==='string'&&!!l.review_note.trim());
    if(hasNotes&&(!meta.word_guard||!wordMatches(w,{target:meta,word_guard:meta.word_guard})))conflict('existing-canonical-note','existing_note_word_context_drift');
    else{const keep=(text,kind)=>{if(typeof text==='string'&&text.trim()&&!seen.has(text)){seen.add(text);existing_notes.push({text,kind,read_scope:'existing_canonical_note_reference_not_new_review'});}};keep(meta.review_note,'word');for(const l of array(meta.lineages))keep(l.review_note,'lineage');}
   }
   const issues=notes.flatMap(n=>n.record.issues.filter(i=>ACTIVE.has(i.status)).map(i=>({...i,note_id:n.record.id,shared_component:n.shared_component}))).concat(diagnostics);
   const value={notes,issues,needsReview:issues.length>0,existing_notes,diagnostics};stateCache.set(w,{signature:sig,value});return value;
  }
  function needsReview(w){return tracked.has(w)?get(w).needsReview:false;}
  Object.defineProperties(stats,{specific_issue_words:{enumerable:true,get:()=>[...tracked].reduce((n,w)=>n+Number(needsReview(w)),0)},stale:{enumerable:true,get:()=>[...tracked].reduce((n,w)=>n+get(w).diagnostics.length,0)}});
  function componentUsers(id){const canonical=entity(id)?.id;if(!canonical)return [];return [...(usersByEntity.get(canonical)||[])];}
  return {get,needsReview,componentUsers,entity,batches,stats,pendingScopes:array(payload.pending_scopes),words,index:w=>wordIndices.get(w),identity};
 }
 function listHTML(label,items){return array(items).length?'<div class="reviewScope"><b>'+esc(label)+'</b><ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>':'';}
 function usersHTML(binding,id){const users=binding.componentUsers(id),e=binding.entity(id);return '<details class="reviewUsers"><summary>'+esc(e?.form||id)+' の登録参照 '+users.length+'語</summary><small>登録された参照です。保留対象の自動拡張や語源の正しさの確認とは別です。</small><ul>'+users.map(w=>'<li><button type="button" title="検索・絞り込みを解除してこの語を開く" data-review-open-word="'+binding.index(w)+'">'+esc(w.w)+'</button> '+esc(w.ja)+'（'+esc(w.pos)+'）</li>').join('')+'</ul></details>';}
 function bodyHTML(binding,w){
  if(!binding)return '';const state=binding.get(w);if(!state.notes.length&&!state.existing_notes.length&&!state.diagnostics.length)return '';
  const noteRows=state.notes.map(({record:n,shared_component:id})=>{
   const issues=n.issues.map(i=>'<div class="reviewIssue" data-issue-status="'+esc(i.status)+'"><b>'+esc(({held:'保留',conflict:'不整合',known_issue:'具体的課題',resolved:'解消済み',dismissed:'対象外'})[i.status])+' · '+esc(i.code)+'</b><p>'+esc(i.reason)+'</p></div>').join('');
   const checks=n.machine_checks.length?'<details class="reviewMachine"><summary>機械検査（語源の正しさとは別）</summary><pre>'+esc(JSON.stringify(n.machine_checks,null,2))+'</pre></details>':'';
   const refs=[...new Set([...(id?[id]:[]),...n.issues.flatMap(i=>i.component_refs)].filter(ref=>binding.entity(ref)))];
   const batch=binding.batches.get(n.batch_id),missing=batch?.source_review_status==='raw_returned_reviews_unavailable'?'<small>返却レビュー原文は未取得です。</small>':'';
   return '<section data-review-note="'+esc(n.id)+'"><b>'+esc(n.summary)+'</b>'+issues+listHTML('確認済みの範囲',n.confirmed_scope)+listHTML('未確認の範囲',n.unreviewed_scope)+(n.source_review_text?'<details><summary>レビュー・備考原文</summary><pre>'+esc(n.source_review_text)+'</pre></details>':'')+checks+missing+refs.map(ref=>usersHTML(binding,ref)).join('')+'<small>作業単位: '+esc(n.batch_id)+'</small></section>';
  }).join('');
  const fallback=state.existing_notes.length?'<details><summary>既存の語源備考</summary><small>既存の記録を参照しています。今回の再審査完了を表しません。</small>'+state.existing_notes.map(n=>'<p>'+esc(n.text)+'</p>').join('')+'</details>':'';
  const stale=state.diagnostics.length?'<p class="reviewStale">保存時の文脈と一致しない備考があります。旧レビュー本文は適用していません。</p>':'';
  return noteRows+fallback+stale;
 }
 function summaryText(state){return state.diagnostics.length?'保存文脈の競合 '+state.diagnostics.length:state.needsReview?'要確認 '+state.issues.length:'備考';}
 function html(binding,w){if(!binding)return '';const state=binding.get(w);if(!state.notes.length&&!state.existing_notes.length&&!state.diagnostics.length)return '';return '<details class="reviewNotes" data-review-owner="'+binding.index(w)+'"'+(state.needsReview?' data-needs-review="true"':'')+'><summary>'+summaryText(state)+'</summary><div class="reviewNotesBody" data-review-lazy="true"></div></details>';}
 function hydrate(element,binding,w){const body=element?.querySelector?.('.reviewNotesBody');if(!body||!binding)return;const state=binding.get(w),summary=element.querySelector(':scope > summary');if(summary)summary.textContent=summaryText(state);if(state.needsReview)element.setAttribute?.('data-needs-review','true');else element.removeAttribute?.('data-needs-review');if(!element.open){body.replaceChildren();return;}body.innerHTML=bodyHTML(binding,w);}
 function pendingHTML(binding){return !binding?.pendingScopes.length?'':'<details class="reviewPending"><summary>対象範囲が未確定の保留 '+binding.pendingScopes.length+'件</summary>'+binding.pendingScopes.map(p=>'<p>'+esc(p.reason)+(Number.isInteger(p.reported_word_count)?'（申告 '+p.reported_word_count+'語）':'')+'</p>').join('')+'</details>';}
 return {prepare,bind,html,bodyHTML,hydrate,pendingHTML,identity,wordMatches};
});
