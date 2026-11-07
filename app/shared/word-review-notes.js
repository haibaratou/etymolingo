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
 // Reader notes and audit records share binding checks, not presentation.
 // Never promote returned reviews or machine checks to dictionary prose.
 // Exact generated word-note metadata observed in the canonical payload.
 // Match only its recorded paragraph/sentence position; never classify arbitrary
 // English, scholarly uncertainty, lineage notes, authored memos or source text.
 const WORD_NOTE_AUDIT_TRAILER='Cache history is a guarded snapshot only; exact-word external history is the origin evidence. Caption alignment and all-ancient-morphology completion are different states.';
 const JAPANESE_NOTE_PROSE='名詞の-tusを省かない訂正。品詞別の語形史と資料差を区別し、全ての古い語尾・再建語根を確認したとはしない。';
 const JAPANESE_EDIT_STATUS='既存JA/EN/POS/b/p/画像/難易度は変更しない。';
 const CAPTION_EDIT_STATUS='Caption-only correction individually verified against the cited primary history; exact caption materials are now connected.';
 const CAPTION_LIMITATION='This does not certify all older morphology or complete ancient ancestry.';
 const CAPTION_SCOPE='Displayed caption correspondence is reviewed; full ancient morphology remains incomplete.';
 const MORPHOLOGY_LIMITATION='full ancient morphology remains incomplete.';
 function readerNoteText(note){
  const text=note.text;if(note.kind!=='word')return text;
  if(text===WORD_NOTE_AUDIT_TRAILER)return '';
  const suffix=' '+WORD_NOTE_AUDIT_TRAILER;
  if(text.endsWith(suffix))return text.slice(0,-suffix.length);
  // These four records share the entire paragraph, not just a common phrase.
  if(text===JAPANESE_NOTE_PROSE+JAPANESE_EDIT_STATUS)return JAPANESE_NOTE_PROSE;
  // Keep the original independent limitation sentence following the work record.
  const captionTail=' '+CAPTION_EDIT_STATUS+' '+CAPTION_LIMITATION;
  if(text.endsWith(captionTail)&&text.slice(0,-captionTail.length).endsWith('.'))return text.slice(0,-captionTail.length)+' '+CAPTION_LIMITATION;
  // In this mixed sentence, remove only the work-status clause. Preserve the
  // original remaining clause byte for byte, including its lowercase first word.
  const scopeTail=' '+CAPTION_SCOPE;
  return text.split('\n').map(paragraph=>paragraph.endsWith(scopeTail)&&paragraph.slice(0,-scopeTail.length).endsWith('.')?paragraph.slice(0,-scopeTail.length)+' '+MORPHOLOGY_LIMITATION:paragraph).join('\n');
 }
 function readerState(binding,w){
  const state=binding?.get(w)||{existing_notes:[],diagnostics:[],needsReview:false};
  const memo=typeof w?.b==='string'&&w.b.trim()?w.b:'';
  const existingNotes=state.existing_notes.map(note=>({...note,text:readerNoteText(note)})).filter(note=>note.text.trim());
  return {state,memo,existingNotes,hasContent:!!memo||existingNotes.length>0};
 }
 function safeSourceURL(value){
  if(typeof value!=='string'||!/^https:\/\//.test(value)||/[\u0000-\u0020\u007f]/.test(value))return '';
  try{const url=new URL(value);return url.protocol==='https:'&&url.hostname&&!url.username&&!url.password?url.href:'';}catch{return '';}
 }
 function sourceHTML(binding,w,sources){
  if(!sources||sources.status==='loading')return '<small class="reviewSourceStatus">出典原文を確認中…</small>';
  const index=binding?.index(w)??w.i;
  const failed=sources.status==='error'||sources.status==='partial';
  const saved=sources.hasSaved&&Number.isInteger(index)?'<button type="button" class="reviewSourceButton" data-review-source-word="'+index+'">出典原文（保存データ）</button>':'';
  const url=safeSourceURL(sources.etymonlineURL);
  const external=url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Etymonlineの当該見出し ↗</a>':'';
  return (saved||external?'<div class="reviewSources">'+saved+external+'</div>':'')+(failed?'<small class="reviewSourceStatus">出典原文の一部を読み込めませんでした。対応は未確認です。</small>':sources.status==='unverified'?'<small class="reviewSourceStatus">この語源に対応するEtymonline原文は未確認です。</small>':!saved&&!external?'<small class="reviewSourceStatus">この語に対応する保存原文は登録されていません。</small>':'');
 }
 function bodyHTML(binding,w,sources){
  const {state,memo,existingNotes,hasContent}=readerState(binding,w);if(!hasContent)return '';
  const main=memo?'<section class="reviewMemo"><b>語源メモ</b><p>'+esc(memo)+'</p></section>':'';
  const existing=existingNotes.length?'<section class="reviewExisting"><b>既存の語源備考</b>'+existingNotes.map(n=>'<p>'+esc(n.text)+'</p>').join('')+'</section>':'';
  const stale=state.diagnostics.length?'<p class="reviewStale">現在の語義と一致しない過去の備考は表示していません。</p>':state.needsReview?'<p class="reviewStale">この語の語源記録には未解決の確認事項があります。</p>':'';
  return main+existing+stale+sourceHTML(binding,w,sources);
 }
 function summaryText(state){return state.needsReview?'備考（要確認）':'備考';}
 function html(binding,w){
  const {state,hasContent}=readerState(binding,w),index=binding?.index(w)??w.i;
  if(!hasContent||!Number.isInteger(index))return '';
  return '<details class="reviewNotes" data-review-owner="'+index+'"'+(state.needsReview?' data-needs-review="true"':'')+'><summary>'+summaryText(state)+'</summary><div class="reviewNotesBody" data-review-lazy="true"></div></details>';
 }
 function hydrate(element,binding,w,sources){
  const body=element?.querySelector?.('.reviewNotesBody');if(!body)return;
  const {state}=readerState(binding,w),summary=element.querySelector(':scope > summary');
  if(summary)summary.textContent=summaryText(state);
  if(state.needsReview)element.setAttribute?.('data-needs-review','true');else element.removeAttribute?.('data-needs-review');
  if(!element.open){body.replaceChildren();return;}body.innerHTML=bodyHTML(binding,w,sources);
 }
 function pendingHTML(binding){return !binding?.pendingScopes.length?'':'<details class="reviewPending"><summary>対象範囲が未確定の保留 '+binding.pendingScopes.length+'件</summary>'+binding.pendingScopes.map(p=>'<p>'+esc(p.reason)+(Number.isInteger(p.reported_word_count)?'（申告 '+p.reported_word_count+'語）':'')+'</p>').join('')+'</details>';}
 return {prepare,bind,html,bodyHTML,hydrate,pendingHTML,identity,wordMatches};
});
