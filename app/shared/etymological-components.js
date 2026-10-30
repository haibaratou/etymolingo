/* Explicit, guarded word-to-component links. No legacy-root projection or
   etymological inference takes place here. Works in browsers, file:// and Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EtymonComponents = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const KINDS = new Set(['pie_reconstruction', 'attested_lexeme', 'attested_morphological_root',
    'pie_formative', 'proposed_reconstruction', 'attested_formative']);
  const ENTITY_CONFIRMED = new Set(['dictionary_attested', 'individually_confirmed', 'reviewed']);
  const LINK_CONFIRMED = new Set(['source_supported', 'reviewed', 'confirmed']);
  const ANCESTRAL = new Set(['derived_from', 'borrowed_from', 'reflex_of', 'inflected_from']);
  const RELATIONS = new Set([...ANCESTRAL, 'proposed_from', 'cognate_with']);
  const COUNT_KEYS = ['legacy_ref_count', 'confirmed_pie_lexical_count', 'confirmed_attested_lexical_count',
    'confirmed_formative_count', 'source_supported_count', 'uncertain_count', 'stale_count',
    'legacy_pie_ref_count', 'legacy_formative_ref_count', 'legacy_uncertain_ref_count',
    'legacy_attested_group_ref_count', 'legacy_group_reference_count', 'legacy_sound_symbolic_ref_count'];
  const LEGACY_PIE = new Set(['pie_registered', 'pie', 'pie_root', 'pie_reconstruction']);
  const LEGACY_FORMATIVE = new Set(['pie_formative', 'attested_formative']);
  const LEGACY_UNCERTAIN = new Set(['unverified_reconstruction', 'proposed_reconstruction']);
  const LEGACY_ATTESTED = new Set(['latin_lemma', 'greek_lemma', 'germanic_lemma', 'attested_lexeme', 'attested_morphological_root']);
  const EMPTY = Object.freeze([]);
  const own = (object, field) => Object.prototype.hasOwnProperty.call(object || {}, field);
  const strings = value => Array.isArray(value) && value.every(x => typeof x === 'string');
  const list = value => Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const unique = value => [...new Set(value)];
  const idOf = row => row && (row.etymology_id || row.origin_id || '');
  function identity(row) { return JSON.stringify([row && row.w || '', row && row.p || [], idOf(row)]); }
  function validIdentity(row) { return !!row && typeof row.w === 'string' && strings(row.p) && typeof idOf(row) === 'string'; }
  function confirmed(entity) {
    return !!entity && ENTITY_CONFIRMED.has(entity.status) && entity.kind !== 'proposed_reconstruction';
  }
  function terminalBasis(entity) {
    if (!confirmed(entity)) return '';
    if (entity.kind === 'pie_reconstruction') return 'pie';
    if (entity.kind === 'attested_lexeme' || entity.kind === 'attested_morphological_root') return 'attested';
    if (entity.kind === 'pie_formative' || entity.kind === 'attested_formative') return 'formative';
    return '';
  }
  function publicEntity(entity) {
    const copy = { ...entity };
    if (Array.isArray(entity.forms)) copy.forms = Object.freeze(entity.forms.map(x => typeof x === 'object' ? Object.freeze({ ...x }) : x));
    if (Array.isArray(entity.evidence)) copy.evidence = Object.freeze(entity.evidence.map(x => Object.freeze({ ...x })));
    return Object.freeze(copy);
  }
  function rootNode(entity) {
    return Object.freeze({ key: 'component:' + entity.id, pie: entity.form, ja: entity.meaning,
      en: entity.meaning, def: entity.meaning, kind: entity.kind, component_id: entity.id,
      language: entity.language, status: entity.status, basis: terminalBasis(entity),
      component: true, evidence: entity.evidence || EMPTY, forms: entity.forms || EMPTY });
  }

  let latestPrepared = null, latestBinding = null;
  function prepare(payload, roots) {
    const prepared = { available: !!payload && payload.schema === 1 && Array.isArray(payload.entities)
        && Array.isArray(payload.words) && Array.isArray(payload.aliases),
      entries: new Map(), ambiguous: new Set(), entities: new Map(), invalidEntities: new Set(),
      aliases: new Map(), aliasTargets: new Map(), edgesByFrom: new Map(), legacy: new Map(), errors: [],
      stats: { graph_walks: 0, bound_words: 0, coverage_lookups: 0 } };
    const rootsArray = Array.isArray(roots) ? roots : roots && typeof roots === 'object'
      ? Object.entries(roots).map(([key, value]) => ({ ...value, key })) : [];
    // Keep typed legacy dictionary metadata separate from legacy coverage refs.
    // This immutable display snapshot never changes counts or infers ancestry.
    const legacyMetadata = new Map(), duplicateLegacyMetadata = new Set();
    for (const row of rootsArray) if (row && typeof row.key === 'string') {
      if (legacyMetadata.has(row.key) || duplicateLegacyMetadata.has(row.key)) {
        legacyMetadata.delete(row.key); duplicateLegacyMetadata.add(row.key); continue;
      }
      legacyMetadata.set(row.key, Object.freeze({ key: row.key,
        form: typeof row.pie === 'string' ? row.pie : '',
        meaning: typeof row.ja === 'string' ? row.ja : '',
        kind: typeof row.kind === 'string' ? row.kind : '',
        origin_language: typeof row.origin_language === 'string' ? row.origin_language : '',
        stage: (row.stage !== undefined && typeof row.stage !== 'string') || (row.language_stage !== undefined && typeof row.language_stage !== 'string')
          ? '[invalid-stage]' : row.stage || row.language_stage || '',
        definition_reviewed: row.definition_reviewed === true,
        definition_source: typeof row.definition_source === 'string' ? row.definition_source : '' }));
    }
    for (const row of rootsArray) if (row && typeof row.key === 'string') {
      prepared.legacy.set(row.key, Object.freeze({ key: row.key, type: row.kind || 'pie_registered',
        registered_kind: row.kind || '', basis: 'legacy', target: row.target || '' }));
    }
    if (prepared.available) {
      const types = Array.isArray(payload.legacy_root_types) ? payload.legacy_root_types
        : payload.legacy_root_types && typeof payload.legacy_root_types === 'object'
          ? Object.entries(payload.legacy_root_types).map(([key, value]) => typeof value === 'string'
            ? { key, type: value } : { ...value, key }) : [];
      for (const row of types) if (row && typeof row.key === 'string') {
        prepared.legacy.set(row.key, Object.freeze({ ...row, type: row.type || row.kind || 'pie_registered', basis: 'legacy' }));
      }
      for (const entity of payload.entities) {
        const id = entity && entity.id;
        if (typeof id !== 'string' || !id || !KINDS.has(entity.kind)
            || typeof entity.form !== 'string' || !entity.form
            || typeof entity.language !== 'string' || !entity.language
            || typeof entity.meaning !== 'string' || !entity.meaning) {
          if (typeof id === 'string') prepared.invalidEntities.add(id);
          prepared.errors.push('invalid_entity:' + String(id)); continue;
        }
        if (prepared.entities.has(id) || prepared.invalidEntities.has(id)) {
          prepared.entities.delete(id); prepared.invalidEntities.add(id);
          prepared.errors.push('duplicate_entity:' + id); continue;
        }
        prepared.entities.set(id, publicEntity(entity));
      }
      for (const alias of payload.aliases) {
        const from = alias && alias.from, to = alias && alias.to;
        const left = prepared.entities.get(from), right = prepared.entities.get(to);
        const stage = e => e && (e.stage || e.language_stage || '');
        const valid = left && right && from !== to && alias.relation === 'orthographic_alias'
          && alias.status === 'reviewed' && left.kind === right.kind
          && left.language === right.language && left.meaning === right.meaning && stage(left) === stage(right);
        if (!valid || prepared.aliasTargets.has(from)) {
          if (typeof from === 'string') prepared.invalidEntities.add(from);
          prepared.errors.push('invalid_alias:' + String(from));
        } else prepared.aliasTargets.set(from, to);
      }
      // Resolve each alias chain once. Cycles/dangling targets invalidate only
      // affected references, without throwing away unrelated curated words.
      const memo = new Map();
      for (const id of prepared.entities.keys()) {
        if (memo.has(id)) continue;
        let at = id; const path = [], seen = new Set(); let result = null;
        while (true) {
          if (memo.has(at)) { result = memo.get(at); break; }
          if (!prepared.entities.has(at) || prepared.invalidEntities.has(at) || seen.has(at)) break;
          path.push(at); seen.add(at);
          if (!prepared.aliasTargets.has(at)) { result = at; break; }
          at = prepared.aliasTargets.get(at);
        }
        for (const member of path) {
          memo.set(member, result);
          if (result === null) prepared.invalidEntities.add(member);
        }
      }
      prepared.aliases = memo;
      if (payload.edges !== undefined && !Array.isArray(payload.edges)) prepared.errors.push('invalid_global_edges');
      for (const edge of Array.isArray(payload.edges) ? payload.edges : []) {
        const from = edge && memo.get(edge.from);
        if (!from) { prepared.errors.push('invalid_global_edge_from'); continue; }
        if (!prepared.edgesByFrom.has(from)) prepared.edgesByFrom.set(from, []);
        prepared.edgesByFrom.get(from).push(Object.freeze({ ...edge }));
      }
      for (const row of payload.words) {
        if (!validIdentity(row)) { prepared.errors.push('invalid_word_identity'); continue; }
        const key = identity(row);
        if (prepared.entries.has(key) || prepared.ambiguous.has(key)) {
          prepared.entries.delete(key); prepared.ambiguous.add(key);
        } else prepared.entries.set(key, row);
      }
    } else prepared.errors.push(payload ? 'invalid_payload' : 'missing_payload');
    prepared.entity = id => {
      const target = prepared.aliases.get(id);
      return target && !prepared.invalidEntities.has(id) ? prepared.entities.get(target) || null : null;
    };
    prepared.legacyInfo = key => {
      const info = legacyMetadata.get(key), classification = prepared.legacy.get(key);
      return info && classification ? Object.freeze({ ...info, type: classification.type }) : null;
    };
    latestPrepared = prepared; latestBinding = null;
    return prepared;
  }

  function checkGuard(word, entry) {
    const reasons = [];
    if (entry.guard_valid === false) reasons.push('producer_guard_invalid');
    if (Array.isArray(entry.stale_reasons)) reasons.push(...entry.stale_reasons.filter(x => typeof x === 'string' && x));
    const fields = ['ja', 'en', 'pos', 'b'], checked = new Set();
    const guard = entry.word_guard;
    if (guard && typeof guard === 'object' && !Array.isArray(guard)) {
      for (const field of Object.keys(guard)) {
        if (!fields.includes(field)) { reasons.push('unsupported_guard_field:' + field); continue; }
        checked.add(field);
        if (guard[field] !== (word[field] === undefined ? '' : word[field])) reasons.push('word_guard:' + field);
      }
    }
    for (const field of fields) if (own(entry, 'before_' + field)) {
      checked.add(field);
      if (entry['before_' + field] !== (word[field] === undefined ? '' : word[field])) reasons.push('word_guard:' + field);
    }
    for (const field of ['ja', 'en', 'pos']) if (!checked.has(field)) reasons.push('missing_word_guard:' + field);
    if (entry.root_state === 'unavailable' || entry.root_state === 'stale') reasons.push('producer_unavailable');
    if (entry.counts && Number(entry.counts.stale_count) > 0) reasons.push('producer_stale');
    return unique(reasons);
  }

  function inspectLineage(lineage, prepared) {
    prepared.stats.graph_walks++;
    const bad = reason => ({ invalid: reason });
    if (!lineage || typeof lineage.id !== 'string' || !lineage.id
        || !['lexical', 'formative'].includes(lineage.role) || !strings(lineage.refs) || !lineage.refs.length) return bad('invalid_lineage');
    const canonical = id => prepared.aliases.get(id) || null;
    if (lineage.refs.some(id => !canonical(id) || prepared.invalidEntities.has(id))) return bad('dangling_or_invalid_ref');
    const refs = unique(lineage.refs.map(canonical)), have = new Set(refs);
    const start = canonical(lineage.word_ref || lineage.refs[0]);
    if (!start || !have.has(start)) return bad('invalid_word_ref');
    const localEdges = lineage.edges === undefined ? [] : lineage.edges;
    if (!Array.isArray(localEdges)) return bad('invalid_edges');
    // A global relationship is relevant only when both endpoints were authored
    // into this particular word lineage. It never expands the declared refs.
    const globalEdges = [];
    for (const ref of refs) for (const edge of prepared.edgesByFrom.get(ref) || []) {
      if (have.has(canonical(edge.to))) globalEdges.push(edge);
    }
    const edgeKeys = new Set(), edges = [];
    for (const edge of [...localEdges, ...globalEdges]) {
      const key = JSON.stringify(edge && [edge.from, edge.to, edge.relation, edge.link_status]);
      if (!edgeKeys.has(key)) { edgeKeys.add(key); edges.push(edge); }
    }
    const next = new Map(refs.map(id => [id, []])), ancestry = new Map(refs.map(id => [id, []])); let uncertainEdges = 0;
    for (const edge of edges) {
      if (!edge || !RELATIONS.has(edge.relation)) return bad('invalid_edge_relation');
      const from = canonical(edge.from), to = canonical(edge.to);
      if (!from || !to || !have.has(from) || !have.has(to)) return bad('dangling_edge');
      if (edge.relation === 'inflected_from' && prepared.entity(from).language !== prepared.entity(to).language) return bad('cross_language_inflection');
      if (edge.relation !== 'cognate_with') ancestry.get(from).push(to);
      if (ANCESTRAL.has(edge.relation) && LINK_CONFIRMED.has(edge.link_status)
          && confirmed(prepared.entity(from)) && confirmed(prepared.entity(to))) next.get(from).push(to);
      else if (edge.relation !== 'cognate_with') uncertainEdges++;
    }
    // Check the entire declared confirmed subgraph, including unreachable refs.
    const colors = new Map();
    for (const ref of refs) {
      if (colors.get(ref) === 2) continue;
      const stack = [[ref, false]];
      while (stack.length) {
        const [id, leave] = stack.pop();
        if (leave) { colors.set(id, 2); continue; }
        if (colors.get(id) === 1) return bad('cyclic_lineage');
        if (colors.get(id) === 2) continue;
        colors.set(id, 1); stack.push([id, true]);
        for (const parent of ancestry.get(id)) stack.push([parent, false]);
      }
    }
    const reachable = new Set(), stack = [start], terminals = [];
    while (stack.length) {
      const id = stack.pop(); if (reachable.has(id)) continue;
      reachable.add(id); const parents = next.get(id);
      if (!parents.length) terminals.push(id); else stack.push(...parents);
    }
    if (terminals.length !== 1) return bad('non_unique_terminal');
    const terminal = terminals[0];
    if (lineage.deepest_confirmed_ref && canonical(lineage.deepest_confirmed_ref) !== terminal) return bad('terminal_mismatch');
    const entity = prepared.entity(terminal), basis = terminalBasis(entity);
    const linked = LINK_CONFIRMED.has(lineage.link_status) && confirmed(prepared.entity(start)) && !!basis;
    const role = lineage.role === 'formative' || basis === 'formative' ? 'formative' : 'lexical';
    return Object.freeze({ ...lineage, refs: Object.freeze([...lineage.refs]), edges: Object.freeze([...edges]),
      word_ref: start, deepest_confirmed_ref: terminal, terminal_entity: entity, terminal_basis: basis,
      role, confirmed: linked, uncertain_edges: uncertainEdges,
      confirmed_path_refs: Object.freeze(linked ? [...reachable] : []) });
  }

  function validEvidence(value) {
    return Array.isArray(value) && value.length > 0 && value.every(x => x && typeof x.source === 'string'
      && (/^https:\/\//.test(x.source) || /^app\/data\/generated-etymon\/det\/[a-z_]\.json#\d+\[[012]\]$/.test(x.source)));
  }
  function alignmentSurface(segment, entity) {
    for (const field of ['surface_form', 'surface_meaning']) if (own(segment, field)
        && (typeof segment[field] !== 'string' || !segment[field].trim())) return null;
    const form = own(segment, 'surface_form') ? segment.surface_form : entity.form;
    const meaning = own(segment, 'surface_meaning') ? segment.surface_meaning : entity.meaning;
    if (/[（）＋{}]/.test(form)) return null;
    if (form !== entity.form || meaning !== entity.meaning || own(segment, 'correspondence') || own(segment, 'evidence')) {
      if (segment.correspondence !== 'source_supported_surface' || !validEvidence(segment.evidence)) return null;
    }
    const style = own(segment, 'render_style') ? segment.render_style : 'form_meaning';
    if (style === 'form_only') return form;
    if (style === 'form_corner_quote') return form + '「' + meaning + '」';
    return style === 'form_meaning' ? form + '（' + meaning + '）' : null;
  }
  function unmappedLiteralForms(literal, word) {
    const escaped = String(word || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escaped) literal = literal.replace(new RegExp('→\\s*' + escaped, 'g'), '→');
    const labels = new Set(['PIE', 'AHD', 'MW', 'EO']), result = []; let current = '';
    for (const char of literal) {
      const japanese = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〻]/u.test(char);
      const foreign = /\p{L}/u.test(char) && !japanese;
      if (foreign || (current && /[\p{M}\p{N}\-'’ʿʾ*]/u.test(char))) current += char;
      else { if (current && !labels.has(current)) result.push(current); current = ''; }
    }
    if (current && !labels.has(current)) result.push(current);
    return result;
  }
  function renderAlignmentTemplate(template, rendered, word) {
    if (typeof template !== 'string' || !template.trim()) return null;
    const matches = [...template.matchAll(/\{(0|[1-9][0-9]*)\}/g)];
    const indices = matches.map(m => Number(m[1]));
    if (indices.length !== rendered.length || [...indices].sort((a,b) => a-b).some((n,i) => n !== i)) return null;
    let output = '', cursor = 0;
    for (const match of matches) {
      const literal = template.slice(cursor, match.index);
      if (/[{}]/.test(literal) || unmappedLiteralForms(literal, word).length) return null;
      output += literal + rendered[Number(match[1])]; cursor = match.index + match[0].length;
    }
    const tail = template.slice(cursor);
    return /[{}]/.test(tail) || unmappedLiteralForms(tail, word).length ? null : output + tail;
  }
  function inspectDisplayMetadata(entry, lineages, prepared) {
    const bad = invalid => ({ invalid }), canonical = id => typeof id === 'string' && prepared.aliases.get(id);
    const confirmedLineages = new Map(lineages.filter(l => l.confirmed).map(l => [l.id, l]));
    const pathHas = (id, ref) => confirmedLineages.has(id) && confirmedLineages.get(id).confirmed_path_refs.includes(canonical(ref));
    const analyses = entry.historical_analyses === undefined ? [] : entry.historical_analyses;
    if (!Array.isArray(analyses)) return bad('invalid_historical_analyses');
    const analysisById = new Map(), materialLineages = new Map(), contributionRefs = new Map(), historyRefs = new Set();
    for (const analysis of analyses) {
      if (!analysis || typeof analysis.id !== 'string' || !analysis.id || analysisById.has(analysis.id)
          || !['analogy','hypothesis','form_history','material_composition'].includes(analysis.kind)
          || typeof analysis.label !== 'string' || !analysis.label.trim()
          || !Array.isArray(analysis.segments) || !analysis.segments.length || !validEvidence(analysis.evidence)) return bad('invalid_historical_analysis');
      if (analysis.segments.some(s => own(s, 'covered_lineage_ids'))) return bad('unsupported_historical_covered_lineages');
      if (analysis.segments.some(s => !s || !canonical(s.entity_ref) || !prepared.entity(s.entity_ref))) return bad('dangling_historical_analysis');
      if (own(analysis, 'parent_entity_ref') && !prepared.entity(analysis.parent_entity_ref)) return bad('dangling_analysis_parent');
      if (own(analysis, 'caption_binding')) {
        if (analysis.kind !== 'form_history' || analysis.caption_binding !== 'attested_word_contribution'
            || !LINK_CONFIRMED.has(analysis.status)) return bad('unconfirmed_attested_contribution');
        const refs = analysis.segments.map(s => canonical(s.entity_ref));
        const all = own(analysis, 'parent_entity_ref') ? [...refs, canonical(analysis.parent_entity_ref)] : refs;
        if (all.some(ref => terminalBasis(prepared.entity(ref)) !== 'attested')) return bad('unattested_contribution_form');
        contributionRefs.set(analysis.id, new Set(refs));
      }
      if (analysis.kind === 'material_composition') {
        const parent = prepared.entity(analysis.parent_entity_ref), covered = new Set();
        if (!LINK_CONFIRMED.has(analysis.status) || !confirmed(parent) || terminalBasis(parent) !== 'attested') return bad('unconfirmed_material_composition');
        for (const segment of analysis.segments) {
          if (typeof segment.lineage_id !== 'string' || !pathHas(segment.lineage_id, segment.entity_ref)) return bad('material_outside_confirmed_path');
          covered.add(segment.lineage_id);
        }
        materialLineages.set(analysis.id, covered);
        historyRefs.add(parent.id);
      }
      // An explicitly supported attested history remains browsable when its
      // whole-word lineage is replaced by the actual material lineages. These
      // references never enter lexical counts, rootRefs or ancestry walks.
      if (analysis.kind === 'form_history' && LINK_CONFIRMED.has(analysis.status)) {
        const refs = analysis.segments.map(s => s.entity_ref);
        if (own(analysis, 'parent_entity_ref')) refs.push(analysis.parent_entity_ref);
        for (const ref of refs) {
          const entity = prepared.entity(ref);
          if (terminalBasis(entity) === 'attested'
              || (entity && entity.kind === 'attested_formative' && confirmed(entity))) historyRefs.add(entity.id);
        }
      }
      analysisById.set(analysis.id, analysis);
    }
    const alignment = entry.assembly_alignment;
    if (alignment === undefined) return entry.component_display === 'layered'
      ? bad('missing_assembly_alignment') : { aligned: false, display_refs: EMPTY, history_refs: Object.freeze([...historyRefs]) };
    if (!alignment || typeof alignment !== 'object' || Array.isArray(alignment)
        || typeof alignment.caption !== 'string' || !alignment.caption.trim()
        || !Array.isArray(alignment.segments) || !alignment.segments.length || !validEvidence(alignment.evidence)) return bad('invalid_assembly_alignment');
    const refs = [], rendered = [];
    for (const segment of alignment.segments) {
      const entity = segment && prepared.entity(segment.entity_ref);
      if (own(segment, 'covered_lineage_ids') && !own(alignment, 'caption_template')) return bad('covered_lineages_require_template');
      if (!entity || !confirmed(entity) || segment.language !== entity.language) return bad('assembly_entity_or_stage_mismatch');
      const surface = alignmentSurface(segment, entity);
      if (surface === null) return bad('unconfirmed_assembly_surface');
      refs.push(entity.id); rendered.push(surface);
    }
    let expected;
    if (own(alignment, 'caption_template')) {
      if (own(alignment, 'caption_prefix') || own(alignment, 'caption_suffix')) return bad('mixed_assembly_caption_styles');
      const covered = new Set(); let contributionUsed = false;
      for (const segment of alignment.segments) {
        if (own(segment, 'lineage_id') === own(segment, 'analysis_id')) return bad('ambiguous_assembly_connection');
        if (own(segment, 'covered_lineage_ids')) {
          const ids = segment.covered_lineage_ids;
          if (!own(segment, 'lineage_id') || !Array.isArray(ids) || !ids.length
              || ids.some(id => typeof id !== 'string' || !id.trim())
              || new Set(ids).size !== ids.length || !ids.includes(segment.lineage_id)) return bad('invalid_covered_lineage_ids');
          const ref = canonical(segment.entity_ref);
          for (const id of ids) {
            const lineage = confirmedLineages.get(id), raw = entry.lineages.find(row => row.id === id);
            const direct = raw && (raw.word_ref || raw.refs[0]);
            if (!lineage || segment.entity_ref !== direct || canonical(direct) !== ref
                || !pathHas(id, segment.entity_ref)) return bad('covered_lineage_not_same_direct_form');
            covered.add(id);
          }
        } else if (own(segment, 'lineage_id')) {
          if (!pathHas(segment.lineage_id, segment.entity_ref)) return bad('assembly_outside_confirmed_path');
          covered.add(segment.lineage_id);
        } else {
          const analysis = analysisById.get(segment.analysis_id), ids = materialLineages.get(segment.analysis_id);
          if (ids) {
            if (!analysis || canonical(analysis.parent_entity_ref) !== canonical(segment.entity_ref)) return bad('assembly_material_parent_mismatch');
            ids.forEach(id => covered.add(id));
          } else {
            const refs = contributionRefs.get(segment.analysis_id);
            if (!refs || !refs.has(canonical(segment.entity_ref))) return bad('assembly_material_parent_mismatch');
            contributionUsed = true;
          }
        }
      }
      if (contributionUsed && !covered.size) return bad('contribution_only_assembly');
      if (covered.size !== confirmedLineages.size || [...confirmedLineages.keys()].some(id => !covered.has(id))) return bad('missing_assembly_component');
      expected = renderAlignmentTemplate(alignment.caption_template, rendered, entry.w);
    } else {
      if (typeof alignment.caption_prefix !== 'string') return bad('missing_assembly_caption_style');
      const direct = [...confirmedLineages.values()].map(l => l.word_ref);
      if (refs.length !== direct.length || refs.some((id,i) => id !== direct[i])) return bad('missing_assembly_component');
      expected = alignment.caption_prefix + rendered.join('＋');
    }
    if (expected !== alignment.caption) return bad('assembly_caption_mismatch');
    return { aligned: true, display_refs: Object.freeze(unique(refs)), history_refs: Object.freeze([...historyRefs]) };
  }

  function makeCoverage(word, prepared, entry, reasons, lineages) {
    const p = strings(word && word.p) ? word.p : [];
    const counts = Object.fromEntries(COUNT_KEYS.map(key => [key, 0]));
    counts.legacy_ref_count = p.length;
    const legacyRefs = p.map(key => prepared.legacy.get(key) || Object.freeze({ key, type: 'unavailable', basis: 'unavailable' }));
    const unknownLegacy = legacyRefs.filter(ref => ref.type === 'unavailable').length;
    for (const ref of legacyRefs) {
      if (LEGACY_PIE.has(ref.type)) counts.legacy_pie_ref_count++;
      else if (LEGACY_FORMATIVE.has(ref.type)) counts.legacy_formative_ref_count++;
      else if (LEGACY_UNCERTAIN.has(ref.type)) counts.legacy_uncertain_ref_count++;
      else if (LEGACY_ATTESTED.has(ref.type)) counts.legacy_attested_group_ref_count++;
      else if (ref.type === 'legacy_group_reference' || ref.type === 'legacy_alias') counts.legacy_group_reference_count++;
      else if (ref.type === 'germanic_sound_symbolism') counts.legacy_sound_symbolic_ref_count++;
    }
    const legacyUncertainOnly = p.length > 0 && counts.legacy_uncertain_ref_count === p.length;
    const stale = reasons.length > 0;
    if (stale) counts.stale_count = Math.max(1, entry && Array.isArray(entry.lineages) ? entry.lineages.length : 1);
    if (!stale) for (const lineage of lineages) {
      if (lineage.link_status === 'source_supported') counts.source_supported_count++;
      if (!lineage.confirmed) { counts.uncertain_count++; continue; }
      if (lineage.role === 'formative') counts.confirmed_formative_count++;
      else if (lineage.terminal_basis === 'pie') counts.confirmed_pie_lexical_count++;
      else if (lineage.terminal_basis === 'attested') counts.confirmed_attested_lexical_count++;
      if (lineage.uncertain_edges) counts.uncertain_count++;
    }
    const pie = counts.confirmed_pie_lexical_count, attested = counts.confirmed_attested_lexical_count;
    let state = 'not_registered', basis = 'none', confidence = 'unregistered';
    if (!prepared.available || stale) { state = 'unavailable'; basis = 'unavailable'; confidence = 'unavailable'; }
    else if (pie && attested) { state = 'mixed_basis_confirmed'; basis = 'mixed'; }
    else if (pie) { state = 'pie_confirmed'; basis = 'pie'; }
    else if (attested) { state = 'attested_confirmed'; basis = 'attested'; }
    else if (counts.confirmed_formative_count) { state = 'formative_only'; basis = 'formative'; }
    else if (counts.source_supported_count) { state = 'source_supported'; basis = 'source_supported'; confidence = 'source_supported'; }
    else if (counts.uncertain_count) { state = 'uncertain'; basis = 'uncertain'; confidence = 'uncertain'; }
    else if (unknownLegacy) { state = 'unavailable'; basis = 'unavailable'; confidence = 'unavailable'; }
    else if (legacyUncertainOnly) { state = 'uncertain'; basis = 'legacy'; confidence = 'legacy'; }
    else if (p.length) { state = 'legacy_registered'; basis = 'legacy'; confidence = 'legacy'; }
    if (pie || attested || counts.confirmed_formative_count) {
      confidence = counts.source_supported_count ? 'source_supported'
        : lineages.some(lineage => lineage.confirmed && lineage.terminal_entity.status === 'dictionary_attested')
          ? 'dictionary_attested' : 'individually_confirmed';
    }
    const complete = !stale && prepared.available && !!entry && entry.components_complete === true
      && lineages.length > 0 && !counts.source_supported_count && !counts.uncertain_count;
    return Object.freeze({ ...counts, counts: Object.freeze(counts), state, root_state: state, basis, confidence,
      components_complete: complete, components_complete_authored: !!entry && entry.components_complete === true,
      guard_valid: !!entry && !stale && prepared.available, curated: !!entry,
      has_confirmed_lexical: !!(pie || attested), has_confirmed_components: !!(pie || attested || counts.confirmed_formative_count),
      has_pie_root: !!pie, mixed_basis: !!(pie && attested),
      has_qualified_analyses: !!entry && !stale && Array.isArray(entry.historical_analyses) && entry.historical_analyses.some(a=>a.kind==='hypothesis'),
      registered: !!entry || p.length > unknownLegacy,
      legacy_has_uncertain_references: counts.legacy_uncertain_ref_count > 0,
      legacy_uncertain_only: legacyUncertainOnly,
      unknown_legacy_ref_count: unknownLegacy, legacy_refs: Object.freeze(legacyRefs),
      legacy_basis: legacyRefs.length === 1 ? legacyRefs[0].type : Object.freeze(unique(legacyRefs.map(x => x.type))),
      stale_reasons: Object.freeze(reasons), review_status: entry && entry.status || '',
      source_guard_basis: entry && entry.guard_valid === true ? 'producer_validated' : 'producer_not_supplied' });
  }

  function bind(words, prepared) {
    prepared = prepared || prepare(null, []);
    const input = Array.isArray(words) ? words : [], multiplicity = new Map();
    for (const word of input) { const key = identity(word); multiplicity.set(key, (multiplicity.get(key) || 0) + 1); }
    const cache = new WeakMap(), lineageCache = new WeakMap(), refCache = new WeakMap(), displayCache = new WeakMap(), searchCache = new WeakMap(), entityWords = new Map(), nodes = new Map();
    const summary = { total: input.length, curated: 0, linked: 0, stale: 0, duplicate: 0, unavailable: 0 };
    for (const word of input) {
      if (!word || typeof word !== 'object') continue;
      prepared.stats.bound_words++;
      const key = identity(word), entry = prepared.entries.get(key); let reasons = [], lineages = [], display = { aligned: false, display_refs: EMPTY };
      if (!validIdentity(word)) reasons.push('invalid_word_identity');
      if (multiplicity.get(key) !== 1 || prepared.ambiguous.has(key)) { reasons.push('duplicate_word_identity'); summary.duplicate++; }
      if (entry) { summary.curated++; reasons.push(...checkGuard(word, entry)); }
      if (!prepared.available) reasons.push('payload_unavailable');
      if (entry && !reasons.length) {
        if (!Array.isArray(entry.lineages)) reasons.push('invalid_lineages');
        else {
          const ids = new Set();
          for (const raw of entry.lineages) {
            const lineage = inspectLineage(raw, prepared);
            if (lineage.invalid || ids.has(lineage.id)) { reasons.push(lineage.invalid || 'duplicate_lineage_id'); break; }
            ids.add(lineage.id); lineages.push(lineage);
          }
        }
      }
      if (entry && !reasons.length) {
        display = inspectDisplayMetadata(entry, lineages, prepared);
        if (display.invalid) reasons.push(display.invalid);
      }
      reasons = unique(reasons);
      if (reasons.length) { lineages = []; display = { aligned: false, display_refs: EMPTY }; }
      const coverage = makeCoverage(word, prepared, entry, reasons, lineages), refs = [];
      cache.set(word, coverage); lineageCache.set(word, Object.freeze(lineages));
      if (coverage.stale_count) summary.stale++;
      if (coverage.state === 'unavailable') summary.unavailable++;
      if (coverage.has_confirmed_components) summary.linked++;
      for (const lineage of lineages) if (lineage.confirmed) {
        const entity = lineage.terminal_entity, id = entity.id;
        refs.push(Object.freeze({ id, entity_id: id, key: 'component:' + id, form: entity.form,
          language: entity.language, kind: entity.kind, role: lineage.role, basis: lineage.terminal_basis,
          lineage_id: lineage.id, entity }));
        if (!nodes.has(id)) nodes.set(id, rootNode(entity));
        if (entry?.component_display === 'layered') {
          const direct=prepared.entity(lineage.word_ref);
          if (direct && !nodes.has(direct.id)) nodes.set(direct.id,rootNode(direct));
        }
        for (const member of lineage.confirmed_path_refs) {
          if (!entityWords.has(member)) entityWords.set(member, new Set());
          entityWords.get(member).add(word);
        }
      }
      const displayRefs = display.display_refs.map(id => {
        const entity = prepared.entity(id);
        if (!nodes.has(id)) nodes.set(id, rootNode(entity));
        if (!entityWords.has(id)) entityWords.set(id, new Set());
        entityWords.get(id).add(word);
        return Object.freeze({ id, entity_id: id, key: 'component:' + id, form: entity.form,
          language: entity.language, kind: entity.kind, basis: 'display', entity });
      });
      for (const id of display.history_refs || EMPTY) {
        const entity = prepared.entity(id);
        if (!nodes.has(id)) nodes.set(id, rootNode(entity));
        if (!entityWords.has(id)) entityWords.set(id, new Set());
        entityWords.get(id).add(word);
      }
      displayCache.set(word, Object.freeze(displayRefs));
      searchCache.set(word, Object.freeze(unique([...lineages.filter(l => l.confirmed).flatMap(l => l.confirmed_path_refs), ...display.display_refs, ...(display.history_refs || EMPTY)])));
      refCache.set(word, Object.freeze(refs));
    }
    const fallback = makeCoverage({}, { ...prepared, available: false }, null, ['word_not_bound'], []);
    const get = word => {
      prepared.stats.coverage_lookups++;
      return word && typeof word === 'object' ? cache.get(word) || fallback : fallback;
    };
    const binding = {
      coverage: get, basis: word => get(word).basis, confidence: word => get(word).confidence,
      entity: prepared.entity, legacyInfo: prepared.legacyInfo, wordLineages: word => lineageCache.get(word) || EMPTY,
      annotations: word => { const c=get(word); return c.guard_valid ? prepared.entries.get(identity(word)) || null : null; },
      rootRefs: word => refCache.get(word) || EMPTY,
      displayRefs: word => displayCache.get(word) || EMPTY,
      syntheticRoots: () => Object.freeze([...nodes.values()]),
      byEntity: id => Object.freeze([...(entityWords.get(prepared.aliases.get(id)) || [])]),
      summary: Object.freeze(summary), stats: prepared.stats,
      matches: (word, filter) => matchesCoverage(get(word), refCache.get(word) || EMPTY, filter, prepared, searchCache.get(word) || EMPTY)
    };
    latestPrepared = prepared; latestBinding = binding;
    return Object.freeze(binding);
  }

  function matchesCoverage(coverage, refs, filter, prepared, searchIds) {
    if (filter === undefined || filter === null || filter === '') return true;
    if (typeof filter === 'string') return coverage.state === filter;
    if (Array.isArray(filter)) return filter.includes(coverage.state);
    if (typeof filter !== 'object') return false;
    const test = (value, selected) => !list(selected).length || list(selected).includes(value);
    if (!test(coverage.state, filter.states || filter.state || filter.root_state)
        || !test(coverage.basis, filter.basis) || !test(coverage.confidence, filter.confidence)) return false;
    const checks = { hasLexical: coverage.has_confirmed_lexical, hasConfirmed: coverage.has_confirmed_components,
      hasPie: coverage.confirmed_pie_lexical_count > 0, hasAttested: coverage.confirmed_attested_lexical_count > 0,
      componentsComplete: coverage.components_complete, legacy: coverage.legacy_ref_count > 0,
      registered: coverage.registered, known: coverage.has_confirmed_lexical,
      legacyPIE: coverage.legacy_pie_ref_count > 0, legacyFormative: coverage.legacy_formative_ref_count > 0,
      legacyUncertain: coverage.legacy_has_uncertain_references, legacyUncertainOnly: coverage.legacy_uncertain_only,
      legacyAttestedGroup: coverage.legacy_attested_group_ref_count > 0 };
    for (const [key, value] of Object.entries(checks)) if (own(filter, key)) {
      if (coverage.state === 'unavailable' && filter[key] === false && key !== 'legacy') return false;
      if (filter[key] !== value) return false;
    }
    const ids = list(filter.entityIds || filter.entities).map(id => prepared.aliases.get(id) || id);
    if (ids.length && !(searchIds || refs.map(ref => ref.id)).some(id => ids.includes(id))) return false;
    if (list(filter.kinds).length && !refs.some(ref => list(filter.kinds).includes(ref.kind))) return false;
    if (list(filter.roles).length && !refs.some(ref => list(filter.roles).includes(ref.role))) return false;
    if (filter.rootPresence) {
      const presence = coverage.has_confirmed_lexical ? 'present' : coverage.state === 'not_registered' ? 'none' : 'unknown';
      if (!list(filter.rootPresence).includes(presence)) return false;
    }
    return true;
  }
  const unavailable = () => latestBinding || bind([], latestPrepared || prepare(null, []));
  const _componentBaseAPI={ prepare, bind, identity, kinds: Object.freeze([...KINDS]),
    coverage: word => unavailable().coverage(word), basis: word => unavailable().basis(word),
    confidence: word => unavailable().confidence(word),
    entity: id => latestPrepared ? latestPrepared.entity(id) : null,
    legacyInfo: key => unavailable().legacyInfo(key),
    wordLineages: word => unavailable().wordLineages(word), rootRefs: word => unavailable().rootRefs(word),
    displayRefs: word => unavailable().displayRefs(word),
    syntheticRoots: () => unavailable().syntheticRoots(), byEntity: id => unavailable().byEntity(id),
    matches: (word, filter) => unavailable().matches(word, filter) };
 const sha256K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 function assemblyDigest(text){
  const bytes=[];
  for(const char of text){
   let cp=char.codePointAt(0);if(cp>=0xd800&&cp<=0xdfff)cp=0xfffd;
   if(cp<0x80)bytes.push(cp);
   else if(cp<0x800)bytes.push(0xc0|(cp>>>6),0x80|(cp&63));
   else if(cp<0x10000)bytes.push(0xe0|(cp>>>12),0x80|((cp>>>6)&63),0x80|(cp&63));
   else bytes.push(0xf0|(cp>>>18),0x80|((cp>>>12)&63),0x80|((cp>>>6)&63),0x80|(cp&63));
  }
  const byteLength=bytes.length;bytes.push(0x80);
  while(bytes.length%64!==56)bytes.push(0);
  const high=Math.floor(byteLength/0x20000000),low=(byteLength*8)>>>0;
  for(let shift=24;shift>=0;shift-=8)bytes.push((high>>>shift)&255);
  for(let shift=24;shift>=0;shift-=8)bytes.push((low>>>shift)&255);
  const hash=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n)),schedule=new Array(64);
  for(let offset=0;offset<bytes.length;offset+=64){
   for(let i=0;i<16;i++){const j=offset+i*4;schedule[i]=((bytes[j]<<24)|(bytes[j+1]<<16)|(bytes[j+2]<<8)|bytes[j+3])>>>0;}
   for(let i=16;i<64;i++){
    const x=schedule[i-15],y=schedule[i-2],s0=rotr(x,7)^rotr(x,18)^(x>>>3),s1=rotr(y,17)^rotr(y,19)^(y>>>10);
    schedule[i]=(schedule[i-16]+s0+schedule[i-7]+s1)>>>0;
   }
   let [a,b,c,d,e,f,g,h]=hash;
   for(let i=0;i<64;i++){
    const t1=(h+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+sha256K[i]+schedule[i])>>>0;
    const t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
    h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
   }
   for(const [i,value]of [a,b,c,d,e,f,g,h].entries())hash[i]=(hash[i]+value)>>>0;
  }
  return hash.map(n=>n.toString(16).padStart(8,'0')).join('');
 }


 const _withLegacyRootBindings=function(Base,Proof){
 'use strict';
 const allowedPIE=new Set(['pie_registered','pie','pie_root','pie_reconstruction']);
 const confirmed=new Set(['source_supported','confirmed','reviewed']);
 const ancestry=new Set(['derived_from','borrowed_from','reflex_of','inflected_from']);
 const fields=['schema','lineage_id','from_entity_ref','reference','relation','status','certainty','word_context_sha256','root_guard','sense_match','evidence'];
 const exact=(x,names)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===names.length&&names.every(k=>Object.hasOwn(x,k));
 const nonempty=x=>typeof x==='string'&&!!x.trim();
 const digest=x=>Proof.digest(JSON.stringify(x));
 const list=x=>Array.isArray(x)?x:x===undefined||x===null?[]:[x];
 const deepFreeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))deepFreeze(v);Object.freeze(x);}return x;};
 const clone=x=>JSON.parse(JSON.stringify(x));
 const semanticVersion='legacy-root-semantic-v1';
 const semanticFields=['key','pie','display_form','ja','en','kind','origin_language','language','stage','origin_stage','language_stage','def','d','definition_reviewed','definition_source','kind_source','alias_target','eo','eo_en'];
 function semanticProjection(root){
  return Object.fromEntries(semanticFields.map(k=>[k,k==='kind'?(root[k]||'pie_registered'):(Object.hasOwn(root,k)?root[k]:null)]));
 }
 function checkSourceVersion(payload,options){
  const source=payload.legacy_root_source;
  if(!source||source.schema!==1||source.semantic_projection!==semanticVersion||!nonempty(source.reviewed_root_input_sha256))throw Error('legacy_binding_source_version');
  // Optional independent transport evidence from the actual HTTP manifest.
  // Direct-file mode does not independently expose the original raw root bytes.
  if(options?.expectedRootSourceSHA256&&source.root_file_sha256!==options.expectedRootSourceSHA256)return 'legacy_binding_source_file_version';
  return null;
 }

 let latestBinding=null;
 function ownEntrySource(source,word){
  if(typeof source!=='string'||/[^\x21-\x7e]/.test(source)||source.includes('\\'))return false;
  const hit=source.match(/^https:\/\/(?:www\.)?(?:etymonline\.com\/word\/([^/?#]+)|merriam-webster\.com\/dictionary\/([^/?#]+)|dictionary\.com\/browse\/([^/?#]+)|ahdictionary\.com\/word\/search\.html\?q=([^&#]+))$/);
  if(!hit)return false;
  try{return decodeURIComponent(hit.slice(1).find(Boolean)).toLowerCase()===word.toLowerCase();}catch(error){return false;}
 }
 function validReviewDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [year,month,day]=value.split('-').map(Number);if(year<1||month<1||month>12||day<1)return false;
  const leap=year%4===0&&(year%100!==0||year%400===0),days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];return day<=days[month-1];
 }
 function staleRecord(binding,reason){return deepFreeze({schema:1,lineage_id:binding.lineage_id,root_key:binding.reference.key,
  from_entity_ref:binding.from_entity_ref,reviewed_root_sha256:binding.root_guard.sha256,reason,scope:'ultimate_binding_only',binding:clone(binding)});}
 const staleReasons=new Set(['legacy_root_input_unavailable','legacy_root_missing_or_ambiguous','legacy_root_kind_drift','legacy_root_snapshot_drift','legacy_root_semantic_drift','legacy_binding_source_file_version']);
 function sourceStale(record,row,entities){
  const names=['schema','lineage_id','root_key','from_entity_ref','reviewed_root_sha256','reason','scope','binding'];
  if(!exact(record,names)||record.schema!==1||record.scope!=='ultimate_binding_only'||!staleReasons.has(record.reason)
   ||!nonempty(record.root_key)||!/^([a-f0-9]{64})$/.test(record.reviewed_root_sha256||''))throw Error('legacy_binding_stale_record');
  const candidate=record.binding;
  if(candidate?.lineage_id!==record.lineage_id||candidate.reference?.key!==record.root_key||candidate.from_entity_ref!==record.from_entity_ref||candidate.root_guard?.sha256!==record.reviewed_root_sha256)throw Error('legacy_binding_stale_candidate_identity');
  check(candidate,row,new Map(),entities); // structural proof only; never revive this candidate
  const lines=(row.lineages||[]).filter(l=>l.id===record.lineage_id);
  if(lines.length!==1||lines[0].deepest_confirmed_ref!==record.from_entity_ref)throw Error('legacy_binding_stale_lineage');
  return deepFreeze(clone(record));
 }
 function check(binding,row,roots,entities){
  if(!exact(binding,fields)||binding.schema!==1)throw Error('legacy_binding_schema');
  const ref=binding.reference;
  if(!exact(ref,['type','key','kind','language'])||ref.type!=='legacy_root'||ref.kind!=='pie_reconstruction'||ref.language!=='印欧祖語'||!nonempty(ref.key))throw Error('legacy_binding_reference_type');
  if(binding.status!=='source_supported'||binding.certainty!=='supported'||binding.relation!=='ultimately_from')throw Error('legacy_binding_not_confirmed_ancestry');
  if(!exact(row.word_guard,['ja','en','pos','b']))throw Error('legacy_binding_full_context_required');
  const guard=Object.fromEntries(['ja','en','pos','b'].map(k=>[k,row.word_guard[k]]));
  const context=digest([row.w,row.p,row.etymology_id||row.origin_id||'',guard]);
  if(binding.word_context_sha256!==row.evidence_context_sha256||context!==binding.word_context_sha256)throw Error('legacy_binding_context');
  const lines=row.lineages.filter(l=>l.id===binding.lineage_id);
  if(lines.length!==1||!confirmed.has(lines[0].link_status)||lines[0].deepest_confirmed_ref!==binding.from_entity_ref)throw Error('legacy_binding_component_terminal');
  const component=entities.get(binding.from_entity_ref),allowed=lines[0].role==='formative'?['attested_lexeme','attested_morphological_root','attested_formative']:['attested_lexeme','attested_morphological_root'];
  if(!component||!allowed.includes(component.kind)||!['dictionary_attested','individually_confirmed','reviewed'].includes(component.status))throw Error('legacy_binding_component_terminal_kind');
  if((lines[0].edges||[]).some(e=>!ancestry.has(e.relation)||!confirmed.has(e.link_status)))throw Error('legacy_binding_qualified_path');
  const g=binding.root_guard;
  if(!exact(g,['algorithm','sha256','snapshot'])||g.algorithm!=='sha256-compact-json-utf8-v1'||g.snapshot?.key!==ref.key||digest(g.snapshot)!==g.sha256)throw Error('legacy_binding_snapshot_digest');
  const s=binding.sense_match;
  if(!exact(s,['source_form','source_meaning','project_en','project_ja','reviewed','numbering_note','note'])||s.reviewed!==true
   ||!['source_form','source_meaning','project_en','project_ja','numbering_note','note'].every(k=>nonempty(s[k]))
   ||s.project_en!==g.snapshot.en||s.project_ja!==g.snapshot.ja)throw Error('legacy_binding_sense_review');
  if(!Array.isArray(binding.evidence)||!binding.evidence.length||binding.evidence.some(e=>e.claim_status!=='supported'||!nonempty(e.note)
   ||!validReviewDate(e.reviewed_date)
   ||!(e.claim_type==='explicit_word_root_derivation'?ownEntrySource(e.source,row.w):e.claim_type==='root_definition_and_descendant_identity'&&(e.source==='https://www.ahdictionary.com/word/indoeurop.html'||ownEntrySource(e.source,row.w))))
   ||!binding.evidence.some(e=>e.claim_type==='explicit_word_root_derivation'&&ownEntrySource(e.source,row.w))
   ||!binding.evidence.some(e=>e.claim_type==='root_definition_and_descendant_identity'))throw Error('legacy_binding_qualified_evidence');
  const accepted=deepFreeze(clone(binding)),actual=roots.get(ref.key);
  if(!actual)return {binding:accepted,reason:'legacy_root_missing_or_ambiguous'};
  if(!allowedPIE.has(actual.kind||'pie_registered'))return {binding:accepted,reason:'legacy_root_kind_drift'};
  if(JSON.stringify(semanticProjection(actual))!==JSON.stringify(semanticProjection(g.snapshot)))return {binding:accepted,reason:'legacy_root_semantic_drift'};
  return {binding:accepted,reason:null};
 }
 function prepare(payload,roots,options){
  latestBinding=null;
  const entities=new Map((Array.isArray(payload?.entities)?payload.entities:[]).filter(e=>e&&typeof e.id==='string').map(e=>[e.id,e]));
  const groups=new Map(),validByIdentity=new Map(),staleByIdentity=new Map(),typedByIdentity=new Set(),errors=[],allStale=[];
  let touched=false;
  const rootRows=Array.isArray(roots)?roots:roots&&typeof roots==='object'?Object.entries(roots).map(([key,value])=>({...value,key})):[];
  for(const r of rootRows){if(!r||typeof r.key!=='string')continue;if(groups.has(r.key))groups.set(r.key,null);else groups.set(r.key,r);}
  const rows=(Array.isArray(payload?.words)?payload.words:[]).map(row=>{
   if(!row||typeof row!=='object'||(!row.legacy_root_bindings&&!row.binding_stale))return row;
   touched=true;
   try{
    const versionReason=checkSourceVersion(payload,options);
    if(!Array.isArray(row.legacy_root_bindings))throw Error('legacy_bindings_array');
    if(row.binding_stale!==undefined&&!Array.isArray(row.binding_stale))throw Error('legacy_binding_stale_array');
    const seen=new Set(),stale=(row.binding_stale||[]).map(r=>{const x=sourceStale(r,row,entities);if(seen.has(x.lineage_id))throw Error('duplicate_legacy_binding_lineage');seen.add(x.lineage_id);return x;}),valid=[];
    for(const b of row.legacy_root_bindings){
     if(seen.has(b.lineage_id))throw Error('duplicate_legacy_binding_lineage');seen.add(b.lineage_id);
     const result=check(b,row,groups,entities),reason=versionReason||result.reason;
     if(reason)stale.push(staleRecord(b,reason));else valid.push(result.binding);
    }
    const id=Base.identity(row);typedByIdentity.add(id);validByIdentity.set(id,Object.freeze(valid));staleByIdentity.set(id,Object.freeze(stale));
    for(const issue of stale)allStale.push({identity:id,...issue});
    return {...row,legacy_root_bindings:valid,binding_stale:stale};
   }catch(error){errors.push({identity:Base.identity(row),reason:error.message});
    return {...row,guard_valid:false,stale_reasons:[...(row.stale_reasons||[]),error.message]};}
  });
  const base=Base.prepare(touched?{...payload,words:rows}:payload,roots);
  return {...base,base,rootSnapshots:groups,validByIdentity,staleByIdentity,typedByIdentity,bindingErrors:errors,bindingStale:Object.freeze(allStale),legacyBindingSource:payload?.legacy_root_source||null};
 }
 function terminal(binding){
  const root=binding.root_guard.snapshot,key=binding.reference.key;
  return deepFreeze({id:'legacy_root:'+key,key,root_key:key,reference_type:'legacy_root',form:root.pie||key,
    language:'印欧祖語',meaning:root.ja,kind:'pie_reconstruction',status:'individually_confirmed',
    verification_scope:'word_specific_source_supported_not_global_legacy_confirmation',evidence:binding.evidence,forms:[]});
 }
 function projectCoverage(before,bindings,lineages){
  const counts={...before.counts};
  for(const b of bindings)if(lineages.find(l=>l.id===b.lineage_id).role==='lexical'){
   counts.confirmed_attested_lexical_count--;counts.confirmed_pie_lexical_count++;
  }
  const pie=counts.confirmed_pie_lexical_count,attested=counts.confirmed_attested_lexical_count;
  let state=before.state,basis=before.basis;
  if(pie&&attested){state='mixed_basis_confirmed';basis='mixed';}else if(pie){state='pie_confirmed';basis='pie';}else if(attested){state='attested_confirmed';basis='attested';}
  return deepFreeze({...before,...counts,counts,state,root_state:state,basis,has_confirmed_lexical:!!(pie||attested),
    has_confirmed_components:!!(pie||attested||counts.confirmed_formative_count),has_pie_root:!!pie,mixed_basis:!!(pie&&attested)});
 }
 function bind(words,prepared){
  prepared=prepared||prepare(null,[]);
  const input=Array.isArray(words)?words:[];
  const base=Base.bind(input,prepared.base||prepared),cache=new WeakMap(),rootCache=new WeakMap(),lineCache=new WeakMap(),approved=new WeakMap(),staleCache=new WeakMap(),typedWords=new WeakSet(),byKey=new Map();
  for(const word of input){
   if(!word||typeof word!=='object')continue;
   const id=Base.identity(word),bindings=prepared.validByIdentity?.get(id)||[];
   if(!prepared.typedByIdentity?.has(id)||!base.coverage(word).guard_valid)continue;
   const lineages=base.wordLineages(word);
   if(bindings.some(b=>!lineages.some(l=>l.id===b.lineage_id&&l.confirmed&&!l.uncertain_edges&&l.deepest_confirmed_ref===b.from_entity_ref)))continue;
   typedWords.add(word);approved.set(word,bindings);
   const stale=prepared.staleByIdentity?.get(id)||[],activeKeys=new Set(bindings.map(b=>b.reference.key)),blockedKeys=new Set(stale.filter(r=>!activeKeys.has(r.root_key)).map(r=>r.root_key));
   staleCache.set(word,stale);
   const projected=projectCoverage(base.coverage(word),bindings,lineages),eligible=projected.legacy_refs.filter(r=>allowedPIE.has(r.type)&&!blockedKeys.has(r.key)).length;
   cache.set(word,deepFreeze({...projected,typed_legacy_root_scope:true,binding_stale:stale,binding_stale_count:stale.length,eligible_legacy_pie_ref_count:eligible}));
   const byLine=new Map(bindings.map(b=>[b.lineage_id,b]));
   rootCache.set(word,Object.freeze(base.rootRefs(word).map(ref=>{
    const b=byLine.get(ref.lineage_id);if(!b)return ref;
    const e=terminal(b);return deepFreeze({id:e.id,entity_id:null,key:e.key,reference_type:'legacy_root',legacy_root_key:e.key,
      form:e.form,language:e.language,kind:e.kind,role:ref.role,basis:'pie',lineage_id:ref.lineage_id,entity:e});
   })));
   lineCache.set(word,Object.freeze(lineages.map(line=>{
    const b=byLine.get(line.id);if(!b)return line;
    // The component namespace stays intact; the final ultimate terminal is typed.
    return Object.freeze({...line,terminal_entity:terminal(b),terminal_basis:'pie',
      terminal_reference:Object.freeze({type:'legacy_root',key:b.reference.key}),
      deepest_confirmed_component_ref:line.deepest_confirmed_ref});
   })));
   for(const b of bindings){const key=b.reference.key;if(!byKey.has(key))byKey.set(key,new Set());byKey.get(key).add(word);}
  }
  const coverage=w=>cache.get(w)||base.coverage(w),refs=w=>rootCache.get(w)||base.rootRefs(w),lines=w=>lineCache.get(w)||base.wordLineages(w);
  function matches(word,filter){
   const bindings=approved.get(word)||[],rootKeys=new Set(bindings.map(b=>b.reference.key));
   if(filter&&typeof filter==='object'&&!Array.isArray(filter)&&list(filter.legacyRootKeys).length&&!list(filter.legacyRootKeys).some(k=>rootKeys.has(k)))return false;
   if(!typedWords.has(word))return base.matches(word,filter);
   const c=coverage(word),rs=refs(word);
   if(filter===undefined||filter===null||filter==='')return true;
   if(typeof filter==='string')return c.state===filter;
   if(Array.isArray(filter))return filter.includes(c.state);
   if(typeof filter!=='object')return false;
   const test=(value,selected)=>!list(selected).length||list(selected).includes(value);
   if(!test(c.state,filter.states||filter.state||filter.root_state)||!test(c.basis,filter.basis)||!test(c.confidence,filter.confidence))return false;
   const checks={hasLexical:c.has_confirmed_lexical,hasConfirmed:c.has_confirmed_components,hasPie:c.confirmed_pie_lexical_count>0,
    hasAttested:c.confirmed_attested_lexical_count>0,componentsComplete:c.components_complete,legacy:c.legacy_ref_count>0,
    registered:c.registered,known:c.has_confirmed_lexical,legacyPIE:c.eligible_legacy_pie_ref_count>0,legacyFormative:c.legacy_formative_ref_count>0,
    legacyUncertain:c.legacy_has_uncertain_references,legacyUncertainOnly:c.legacy_uncertain_only,legacyAttestedGroup:c.legacy_attested_group_ref_count>0};
   for(const [k,v]of Object.entries(checks))if(Object.hasOwn(filter,k)&&filter[k]!==v)return false;
   if(list(filter.entityIds||filter.entities).length&&!base.matches(word,{entityIds:filter.entityIds||filter.entities}))return false;
   if(list(filter.kinds).length&&!rs.some(r=>list(filter.kinds).includes(r.kind)))return false;
   if(list(filter.roles).length&&!rs.some(r=>list(filter.roles).includes(r.role)))return false;
   if(filter.rootPresence&&!list(filter.rootPresence).includes(c.has_confirmed_lexical?'present':c.state==='not_registered'?'none':'unknown'))return false;
   return true;
  }
  const result={...base,coverage,basis:w=>coverage(w).basis,confidence:w=>coverage(w).confidence,rootRefs:refs,wordLineages:lines,matches,
   legacyRootKeys:w=>Object.freeze((approved.get(w)||[]).map(b=>b.reference.key)),
   legacyRootBindings:w=>approved.get(w)||Object.freeze([]),bindingStale:w=>staleCache.get(w)||Object.freeze([]),
   byLegacyRoot:key=>Object.freeze([...(byKey.get(key)||[])]),
   rootMembers:key=>Object.freeze([...new Set([...input.filter(w=>w&&typeof w==='object'&&Array.isArray(w.p)&&w.p.includes(key)),...(byKey.get(key)||[])])]),
   // No virtual PIE entity or new syntheticRoot is registered.
   syntheticRoots:base.syntheticRoots};
  latestBinding=Object.freeze(result);return latestBinding;
 }
 const current=()=>latestBinding;
 return {...Base,prepare,bind,identity:Base.identity,legacyRootBindingVersion:1,
  coverage:w=>current()?.coverage(w)||Base.coverage(w),basis:w=>current()?.basis(w)||Base.basis(w),
  confidence:w=>current()?.confidence(w)||Base.confidence(w),
  entity:id=>current()?current().entity(id):Base.entity(id),legacyInfo:key=>current()?current().legacyInfo(key):Base.legacyInfo(key),
  wordLineages:w=>current()?current().wordLineages(w):Base.wordLineages(w),rootRefs:w=>current()?current().rootRefs(w):Base.rootRefs(w),
  displayRefs:w=>current()?current().displayRefs(w):Base.displayRefs(w),
  syntheticRoots:()=>current()?current().syntheticRoots():Base.syntheticRoots(),byEntity:id=>current()?current().byEntity(id):Base.byEntity(id),
  matches:(w,f)=>current()?current().matches(w,f):Base.matches(w,f),
  bindingStale:w=>current()?.bindingStale(w)||Object.freeze([]),legacyRootKeys:w=>current()?.legacyRootKeys(w)||Object.freeze([]),byLegacyRoot:key=>current()?.byLegacyRoot(key)||Object.freeze([])};

 };
 return _withLegacyRootBindings(_componentBaseAPI,{digest:assemblyDigest});

});
