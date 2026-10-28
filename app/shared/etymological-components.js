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
    const cache = new WeakMap(), lineageCache = new WeakMap(), refCache = new WeakMap(), entityWords = new Map(), nodes = new Map();
    const summary = { total: input.length, curated: 0, linked: 0, stale: 0, duplicate: 0, unavailable: 0 };
    for (const word of input) {
      if (!word || typeof word !== 'object') continue;
      prepared.stats.bound_words++;
      const key = identity(word), entry = prepared.entries.get(key); let reasons = [], lineages = [];
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
      reasons = unique(reasons);
      if (reasons.length) lineages = [];
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
        for (const member of lineage.confirmed_path_refs) {
          if (!entityWords.has(member)) entityWords.set(member, new Set());
          entityWords.get(member).add(word);
        }
      }
      refCache.set(word, Object.freeze(refs));
    }
    const fallback = makeCoverage({}, { ...prepared, available: false }, null, ['word_not_bound'], []);
    const get = word => {
      prepared.stats.coverage_lookups++;
      return word && typeof word === 'object' ? cache.get(word) || fallback : fallback;
    };
    const binding = {
      coverage: get, basis: word => get(word).basis, confidence: word => get(word).confidence,
      entity: prepared.entity, wordLineages: word => lineageCache.get(word) || EMPTY,
      rootRefs: word => refCache.get(word) || EMPTY,
      syntheticRoots: () => Object.freeze([...nodes.values()]),
      byEntity: id => Object.freeze([...(entityWords.get(prepared.aliases.get(id)) || [])]),
      summary: Object.freeze(summary), stats: prepared.stats,
      matches: (word, filter) => matchesCoverage(get(word), refCache.get(word) || EMPTY, filter, prepared)
    };
    latestPrepared = prepared; latestBinding = binding;
    return Object.freeze(binding);
  }

  function matchesCoverage(coverage, refs, filter, prepared) {
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
    if (ids.length && !refs.some(ref => ids.includes(ref.id))) return false;
    if (list(filter.kinds).length && !refs.some(ref => list(filter.kinds).includes(ref.kind))) return false;
    if (list(filter.roles).length && !refs.some(ref => list(filter.roles).includes(ref.role))) return false;
    if (filter.rootPresence) {
      const presence = coverage.has_confirmed_lexical ? 'present' : coverage.state === 'not_registered' ? 'none' : 'unknown';
      if (!list(filter.rootPresence).includes(presence)) return false;
    }
    return true;
  }
  const unavailable = () => latestBinding || bind([], latestPrepared || prepare(null, []));
  return { prepare, bind, identity, kinds: Object.freeze([...KINDS]),
    coverage: word => unavailable().coverage(word), basis: word => unavailable().basis(word),
    confidence: word => unavailable().confidence(word),
    entity: id => latestPrepared ? latestPrepared.entity(id) : null,
    wordLineages: word => unavailable().wordLineages(word), rootRefs: word => unavailable().rootRefs(word),
    syntheticRoots: () => unavailable().syntheticRoots(), byEntity: id => unavailable().byEntity(id),
    matches: (word, filter) => unavailable().matches(word, filter) };
});
