'use strict';
// Invented software fixtures only. The publisher-shaped URLs below are parser
// inputs; they are never fetched and make no linguistic or source-existence claim.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../../shared/etymological-components.js');
const UI = require('../../shared/vocabulary-components-ui.js');
const ROOT = path.resolve(__dirname, '../../..');
const copy = value => JSON.parse(JSON.stringify(value));
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
const softwareEvidence = [{ source: 'https://example.test/software-fixture', note: 'Software fixture only.' }];
const privateText = 'PRIVATE_REVIEW_NOTE_MUST_NOT_RENDER';

function fixture(roles = ['lexical', 'lexical']) {
  const roots = roles.map((role, index) => ({ key: 'software-root-' + index,
    pie: '*software-' + index, ja: '試験用の意味' + index, en: 'software meaning ' + index,
    kind: 'pie_registered', def: 'Software fixture; not an etymological claim.',
    definition_reviewed: false, definition_source: 'https://example.test/software-root', rank: index + 1, all: 0 }));
  const word = { w: 'software-binding-fixture', p: roots.map(r => r.key),
    ja: '試験用', en: 'software fixture', pos: '名', b: 'Software fixture only.' };
  const guard = Object.fromEntries(['ja', 'en', 'pos', 'b'].map(k => [k, word[k]]));
  const context = digest([word.w, word.p, '', guard]);
  const entities = roles.map((role, index) => ({ id: 'software-attested-' + index,
    form: 'software-form-' + index, language: 'fixture-language', meaning: '試験部品' + index,
    kind: role === 'formative' ? 'attested_formative' : 'attested_lexeme',
    status: 'dictionary_attested', evidence: copy(softwareEvidence) }));
  const lineages = roles.map((role, index) => ({ id: 'material-' + index, role,
    refs: [entities[index].id], word_ref: entities[index].id, deepest_confirmed_ref: entities[index].id,
    link_status: 'source_supported', edges: [], evidence: copy(softwareEvidence) }));
  const bindings = roots.map((r, index) => ({ schema: 1, lineage_id: lineages[index].id,
    from_entity_ref: entities[index].id,
    reference: { type: 'legacy_root', key: r.key, kind: 'pie_reconstruction', language: '印欧祖語' },
    relation: 'ultimately_from', status: 'source_supported', certainty: 'supported',
    word_context_sha256: context,
    root_guard: { algorithm: 'sha256-compact-json-utf8-v1', sha256: digest(r), snapshot: copy(r) },
    sense_match: { source_form: '*software-source-' + index, source_meaning: '試験用の語根義' + index,
      project_en: r.en, project_ja: r.ja, reviewed: true, numbering_note: privateText, note: privateText },
    evidence: [
      { source: 'https://www.etymonline.com/word/' + word.w, claim_type: 'explicit_word_root_derivation',
        claim_status: 'supported', reviewed_date: '2024-02-29', note: privateText },
      { source: 'https://www.ahdictionary.com/word/indoeurop.html', claim_type: 'root_definition_and_descendant_identity',
        claim_status: 'supported', reviewed_date: '2024-02-29', note: privateText }
    ] }));
  const row = { w: word.w, p: [...word.p], word_guard: guard, evidence_context_sha256: context,
    guard_valid: true, stale_reasons: [], components_complete: false, lineages,
    legacy_root_bindings: bindings, binding_stale: [] };
  const payload = { schema: 1, entities, aliases: [], edges: [], words: [row],
    legacy_root_types: roots.map(r => ({ key: r.key, type: r.kind, basis: 'legacy', independently_confirmed: false })),
    legacy_root_source: { schema: 1, semantic_projection: 'legacy-root-semantic-v1',
      reviewed_root_input_sha256: digest(roots), root_file_sha256: digest(roots) } };
  return { word, roots, payload };
}
function bind(f, roots = f.roots, word = f.word) {
  const prepared = C.prepare(f.payload, roots);
  return { prepared, binding: C.bind([word], prepared) };
}
function staleRecord(binding, reason = 'legacy_root_snapshot_drift') {
  return { schema: 1, lineage_id: binding.lineage_id, root_key: binding.reference.key,
    from_entity_ref: binding.from_entity_ref, reviewed_root_sha256: binding.root_guard.sha256,
    reason, scope: 'ultimate_binding_only', binding: copy(binding) };
}
const legacyChip = key => '<span data-k="' + key + '"></span>';
const chipCount = (html, key) => (html.match(/data-k="[^"]*"/g) || []).filter(x => x === 'data-k="' + key + '"').length;
function rejects(edit) {
  const f = fixture(); edit(f.payload.words[0].legacy_root_bindings[0], f);
  const { prepared, binding } = bind(f);
  assert.ok(prepared.bindingErrors.length);
  assert.equal(binding.coverage(f.word).state, 'unavailable');
  assert.deepEqual(binding.legacyRootKeys(f.word), []);
}

test('software fixture: typed terminals reuse existing keys without new PIE entities or global mutation', () => {
  const f = fixture(), before = JSON.stringify(f), { binding } = bind(f), c = binding.coverage(f.word);
  assert.equal(C.legacyRootBindingVersion, 1);
  assert.equal(c.state, 'pie_confirmed'); assert.equal(c.confirmed_pie_lexical_count, 2);
  assert.equal(c.confirmed_attested_lexical_count, 0); assert.equal(c.components_complete, false);
  assert.equal(binding.rootRefs(f.word).length, 2);
  for (const r of f.roots) {
    assert.ok(binding.byLegacyRoot(r.key).includes(f.word));
    assert.equal(binding.entity('legacy_root:' + r.key), null);
    assert.equal(binding.legacyInfo(r.key).definition_reviewed, false);
    assert.ok(!binding.syntheticRoots().some(n => n.key === r.key || n.component_id === 'legacy_root:' + r.key));
    assert.equal(chipCount(UI.rootCell(binding, f.word, legacyChip), r.key), 1);
  }
  for (const e of f.payload.entities) assert.ok(binding.byEntity(e.id).includes(f.word));
  assert.equal(JSON.stringify(f), before);
});

test('software fixture: both own derivation and root definition claims are required', () => {
  for (const retained of ['explicit_word_root_derivation', 'root_definition_and_descendant_identity'])
    rejects(b => { b.evidence = b.evidence.filter(e => e.claim_type === retained); });
  rejects(b => { b.evidence[0].source = 'https://www.etymonline.com/word/unrelated-fixture'; });
  rejects(b => { b.evidence[0].claim_status = 'possible'; });
  rejects(b => { b.relation = 'proposed_from'; });
});

test('software fixture: every review date is a real ISO calendar day', () => {
  for (const index of [0, 1]) {
    rejects(b => { delete b.evidence[index].reviewed_date; });
    for (const date of ['2026-2-01', '2025-02-29', '2026-13-01', '0000-01-01', '2026-01-01T00:00:00Z', '', null, 20260101])
      rejects(b => { b.evidence[index].reviewed_date = date; });
  }
  assert.deepEqual(bind(fixture()).prepared.bindingErrors, []); // 2024-02-29 is valid.
});

test('software fixture: word/source/context drift remains fail closed', () => {
  for (const key of ['ja', 'en', 'pos', 'b']) {
    const f = fixture(), changed = { ...f.word, [key]: f.word[key] + ' changed' }, { binding } = bind(f, f.roots, changed);
    assert.equal(binding.coverage(changed).state, 'unavailable'); assert.deepEqual(binding.rootRefs(changed), []);
  }
  rejects(b => { b.word_context_sha256 = '0'.repeat(64); });
  const f = fixture(); f.payload.words[0].guard_valid = false;
  f.payload.words[0].stale_reasons = ['software_source_hash_drift'];
  assert.equal(bind(f).binding.coverage(f.word).state, 'unavailable');
});

test('software fixture: roots-only drift keeps attested materials, isolates only stale terminals and excludes their PIE filter', () => {
  const f = fixture(), changed = copy(f.roots); changed[0].ja += ' changed';
  const { binding } = bind(f, changed), c = binding.coverage(f.word);
  assert.equal(c.guard_valid, true); assert.equal(c.state, 'mixed_basis_confirmed');
  assert.equal(c.confirmed_pie_lexical_count, 1); assert.equal(c.confirmed_attested_lexical_count, 1);
  assert.equal(c.legacy_pie_ref_count, 2); assert.equal(c.eligible_legacy_pie_ref_count, 1);
  assert.equal(binding.bindingStale(f.word).length, 1);
  assert.deepEqual(binding.byLegacyRoot(changed[0].key), []);
  assert.ok(binding.byEntity(f.payload.entities[0].id).includes(f.word));
  const allChanged = copy(f.roots); allChanged.forEach(r => { r.en += ' changed'; });
  const held = bind(f, allChanged).binding, h = held.coverage(f.word), html = UI.rootCell(held, f.word, legacyChip);
  assert.equal(h.state, 'attested_confirmed'); assert.equal(h.has_confirmed_lexical, true);
  assert.equal(h.confirmed_attested_lexical_count, 2); assert.equal(h.confirmed_pie_lexical_count, 0);
  assert.equal(h.legacy_pie_ref_count, 2); assert.equal(h.eligible_legacy_pie_ref_count, 0);
  assert.equal(UI.hasPie(h), false); assert.equal(UI.matches(h, 'pie'), false);
  assert.equal(held.matches(f.word, { rootPresence: ['present'] }), true);
  assert.ok(html.includes('data-binding-state="stale"'));
  for (const r of f.roots) { assert.equal(chipCount(html, r.key), 0); assert.deepEqual(held.byLegacyRoot(r.key), []); }
});

test('software fixture: source-stale proof never revives even if runtime roots look current', () => {
  const f = fixture(), row = f.payload.words[0], stale = row.legacy_root_bindings.shift();
  row.binding_stale = [staleRecord(stale)];
  const { prepared, binding } = bind(f);
  assert.deepEqual(prepared.bindingErrors, []); assert.equal(binding.coverage(f.word).state, 'mixed_basis_confirmed');
  assert.deepEqual(binding.byLegacyRoot(stale.reference.key), []);
  assert.equal(binding.bindingStale(f.word).length, 1);
});

test('software fixture: stale candidate key/hash/date/path forgery is rejected', () => {
  const edits = [
    s => { s.root_key = 'unrelated-key'; }, s => { s.reviewed_root_sha256 = '0'.repeat(64); },
    s => { s.binding.root_guard.snapshot.ja = 'tampered'; }, s => { delete s.binding.evidence[0].reviewed_date; },
    s => { s.binding.relation = 'proposed_from'; }, s => { s.binding.from_entity_ref = 'unregistered'; }
  ];
  for (const edit of edits) {
    const f = fixture(), row = f.payload.words[0], b = row.legacy_root_bindings.shift(), stale = staleRecord(b);
    edit(stale); row.binding_stale = [stale]; const result = bind(f);
    assert.ok(result.prepared.bindingErrors.length); assert.equal(result.binding.coverage(f.word).state, 'unavailable');
  }
});

test('software fixture: PIE prefix remains formative and does not add a lexical material', () => {
  const f = fixture(['formative']), { binding } = bind(f), c = binding.coverage(f.word);
  assert.equal(c.state, 'formative_only'); assert.equal(c.confirmed_formative_count, 1);
  assert.equal(c.confirmed_pie_lexical_count, 0); assert.equal(c.confirmed_attested_lexical_count, 0);
  assert.equal(binding.rootRefs(f.word)[0].role, 'formative');
});

test('software fixture: native UI keeps one terminal per key in all rendering branches and hides private review notes', () => {
  const f = fixture(), { binding } = bind(f);
  for (const mode of ['ordinary', 'assembly', 'layered']) {
    const proxy = { ...binding, annotations: w => {
      const original = binding.annotations(w) || {};
      return mode === 'layered' ? { ...original, component_display: 'layered' } : original;
    } };
    // The assembly branch is exercised with a renderer-only explicit mapping;
    // this does not claim validation of a historical caption.
    if (mode === 'assembly') proxy.annotations = w => ({ ...binding.annotations(w), assembly_alignment: {
      segments: f.payload.entities.map(e => ({ entity_ref: e.id, language: e.language }))
    } });
    const html = UI.rootCell(proxy, f.word, legacyChip);
    for (const r of f.roots) assert.equal(chipCount(html, r.key), 1);
    assert.equal((html.match(/componentState/g) || []).length, 1);
    assert.ok(!html.includes(privateText));
  }
  const detail = UI.details(binding, f.word);
  assert.ok(detail.includes('資料の表記')); assert.ok(detail.includes('*software-source-0'));
  assert.ok(!detail.includes(privateText));
});

test('software fixture: immutable navigation union, null helpers and ordinary legacy behavior remain compatible', () => {
  const f = fixture(), { binding } = bind(f), existing = Object.freeze([{ w: 'external-software-row' }]), index = new Map([[f.roots[0].key, existing]]);
  UI.integrateRootMembers(index, binding, f.roots);
  assert.notEqual(index.get(f.roots[0].key), existing); assert.ok(index.get(f.roots[0].key).includes(existing[0]));
  assert.ok(index.get(f.roots[0].key).includes(f.word)); assert.equal(existing.length, 1);
  assert.equal(UI.navigationCount(f.roots[0], binding, index), index.get(f.roots[0].key).length);
  assert.doesNotThrow(() => UI.integrateRootMembers(index, null, f.roots));
  assert.equal(UI.navigationCount({ key: 'old', all: 7 }, null, index), 7);
  const data = copy(f.payload); delete data.words[0].legacy_root_bindings; delete data.words[0].binding_stale; delete data.legacy_root_source;
  const noBinding = C.bind([f.word], C.prepare(data, f.roots)), c = noBinding.coverage(f.word);
  assert.equal(c.state, 'attested_confirmed'); assert.equal(c.typed_legacy_root_scope, undefined);
  assert.equal(c.confirmed_attested_lexical_count, 2); assert.equal(UI.hasPie(c), true); // Existing legacy-only filter semantics.
  const legacyOnly = C.bind([f.word], C.prepare({ schema: 1, entities: [], aliases: [], words: [] }, f.roots));
  const old = legacyOnly.coverage(f.word);
  assert.equal(old.state, 'legacy_registered'); assert.equal(old.confidence, 'legacy');
  assert.equal(old.confirmed_pie_lexical_count, 0); assert.deepEqual(legacyOnly.rootRefs(f.word), []);
  for (const r of f.roots) assert.equal(chipCount(UI.rootCell(legacyOnly, f.word, legacyChip), r.key), 1);
});

test('malformed/omitted runtime inputs retain the base unavailable behavior without throwing', () => {
  for (const bad of [{}, [null]]) {
    const f = fixture(); f.payload.entities = bad;
    assert.doesNotThrow(() => C.prepare(f.payload, f.roots));
    assert.equal(C.bind([f.word], C.prepare(f.payload, f.roots)).coverage(f.word).state, 'unavailable');
  }
  for (const input of [undefined, null, {}, 'not-an-array']) {
    const binding = C.bind(input); assert.equal(binding.summary.total, 0);
    assert.equal(binding.coverage({}).state, 'unavailable');
  }
  const f = fixture(), binding = C.bind([null, f.word], C.prepare(f.payload, f.roots));
  assert.doesNotThrow(() => binding.rootMembers(f.roots[0].key));
  assert.ok(binding.rootMembers(f.roots[0].key).includes(f.word));
});

test('optional deployed public-data contract preserves words/roots and resolves current typed terminals', t => {
  const data = path.join(ROOT, 'app/data/generated-etymon');
  const hasManifest=fs.existsSync(path.join(data,'manifest.json'));
  const paths = ['words.json', 'roots.json', hasManifest?'manifest.json':'etymological-components.js'].map(name => path.join(data, name));
  if (!paths.every(p => fs.existsSync(p))) { t.skip('Public data is absent from this staged candidate.'); return; }
  const raw = paths.map(p => fs.readFileSync(p)), words = JSON.parse(raw[0]), roots = JSON.parse(raw[1]);
  const payload = require('../../shared/component-payload-node.cjs').readPayload(data,{roots,mode:hasManifest?'manifest':'legacy'}), before = JSON.stringify([words, roots, payload]);
  const meta=hasManifest?JSON.parse(raw[2]).files.etymological_components:{file:'etymological-components.js'};
  const componentPaths=[meta.file,...(meta.transport_schema===1?meta.parts.map(p=>p.file):[])].map(name=>path.join(data,name));
  const componentBytes=componentPaths.map(p=>fs.readFileSync(p));
  const binding = C.bind(words, C.prepare(payload, roots));
  for (const word of words) if (binding.coverage(word).guard_valid) {
    const html = UI.rootCell(binding, word, legacyChip);
    for (const key of new Set(binding.legacyRootKeys(word))) assert.equal(chipCount(html, key), 1);
    for (const issue of binding.bindingStale(word)) if (!binding.legacyRootKeys(word).includes(issue.root_key))
      assert.ok(!binding.byLegacyRoot(issue.root_key).includes(word));
  }
  assert.equal(JSON.stringify([words, roots, payload]), before);
  paths.forEach((p, index) => assert.deepEqual(fs.readFileSync(p), raw[index]));
  componentPaths.forEach((p,index)=>assert.deepEqual(fs.readFileSync(p),componentBytes[index]));
});
