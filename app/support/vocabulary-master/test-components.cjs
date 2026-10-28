'use strict';
// All invented entities below are software fixtures, not etymological claims.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const C = require('../../shared/etymological-components.js');
const ROOT = path.resolve(__dirname, '../../..');
const source = 'https://example.test/software-fixture';
const evidence = [{ source, note: 'Software fixture only.' }];
function entity(id, kind = 'attested_lexeme', extra = {}) {
  return { id, kind, language: 'fixture-language', form: id, meaning: 'fixture meaning',
    status: 'dictionary_attested', evidence, ...extra };
}
function word(w = 'fixture', p = [], extra = {}) {
  return { w, p, ja: 'fixture meaning', en: 'fixture', pos: '名', b: 'fixture note', ...extra };
}
function lineage(id, refs, extra = {}) {
  return { id, role: 'lexical', refs, word_ref: refs[0], deepest_confirmed_ref: refs[0],
    link_status: 'source_supported', evidence, edges: [], ...extra };
}
function edge(from, to, relation = 'derived_from', link_status = 'reviewed') {
  return { from, to, relation, link_status, evidence };
}
function row(w, lineages, extra = {}) {
  return { w: w.w, p: [...w.p], etymology_id: w.etymology_id || w.origin_id || '',
    word_guard: { ja: w.ja, en: w.en, pos: w.pos, b: w.b }, guard_valid: true,
    stale_reasons: [], components_complete: false, status: 'source_supported', lineages, ...extra };
}
function setup(w, entities, lineages, options = {}) {
  const payload = { schema: 1, entities, aliases: [], words: [row(w, lineages)], legacy_root_types: [], ...options };
  const prepared = C.prepare(payload, options.roots || []);
  return { payload, prepared, binding: C.bind(options.currentWords || [w], prepared) };
}
function cover(w, entities, lineages, options = {}) { return setup(w, entities, lineages, options).binding.coverage(w); }

const fixtureCases = JSON.parse(fs.readFileSync(path.join(ROOT, 'work/non-pie-components-20261028/STATE_FIXTURES.json'), 'utf8')).cases;
assert.equal(fixtureCases.length, 12);
const implementedFixtures = new Set();
function fixture(id, fn) {
  assert.ok(fixtureCases.some(x => x.id === id), id); implementedFixtures.add(id); test(id, fn);
}

fixture('same_component_two_stages', () => {
  const w = word(), l = lineage('base', ['latin', 'pie'], { deepest_confirmed_ref: 'pie', edges: [edge('latin', 'pie')] });
  const { binding } = setup(w, [entity('latin'), entity('pie', 'pie_reconstruction')], [l]);
  const c = binding.coverage(w);
  assert.equal(c.confirmed_pie_lexical_count, 1); assert.equal(c.confirmed_attested_lexical_count, 0);
  assert.equal(c.state, 'pie_confirmed'); assert.equal(c.mixed_basis, false);
  assert.deepEqual(binding.rootRefs(w).map(x => x.id), ['pie']);
  assert.equal(binding.byEntity('latin')[0], w); assert.equal(binding.byEntity('pie')[0], w);
});
fixture('independent_components_different_terminal_bases', () => {
  const w = word(); const c = cover(w, [entity('p', 'pie_reconstruction'), entity('a')], [lineage('one', ['p']), lineage('two', ['a'])]);
  assert.equal(c.confirmed_pie_lexical_count, 1); assert.equal(c.confirmed_attested_lexical_count, 1);
  assert.equal(c.mixed_basis, true); assert.equal(c.state, 'mixed_basis_confirmed');
});
fixture('proposed_older_edge_does_not_advance_terminal', () => {
  const w = word(); const c = cover(w, [entity('a'), entity('proposal', 'proposed_reconstruction', { status: 'proposed' })],
    [lineage('base', ['a', 'proposal'], { edges: [edge('a', 'proposal', 'proposed_from', 'proposed')] })]);
  assert.equal(c.confirmed_attested_lexical_count, 1); assert.equal(c.confirmed_pie_lexical_count, 0);
  assert.equal(c.mixed_basis, false); assert.equal(c.uncertain_count, 1);
});
fixture('prefix_without_confirmed_stem', () => {
  const w = word(); const c = cover(w, [entity('prefix', 'attested_formative')], [lineage('prefix', ['prefix'], { role: 'formative' })]);
  assert.equal(c.confirmed_formative_count, 1); assert.equal(c.confirmed_attested_lexical_count, 0);
  assert.equal(c.has_confirmed_lexical, false); assert.equal(c.state, 'formative_only');
});
fixture('named_lemma_group_without_word_link', () => {
  const w = word('fixture', ['ferrum']);
  const prepared = C.prepare({ schema: 1, entities: [entity('ferrum')], words: [], aliases: [], legacy_root_types: [] }, [{ key: 'ferrum', kind: 'latin_lemma' }]);
  const c = C.bind([w], prepared).coverage(w);
  assert.equal(c.legacy_ref_count, 1); assert.equal(c.confirmed_attested_lexical_count, 0);
  assert.equal(c.state, 'legacy_registered'); assert.equal(c.confidence, 'legacy');
});
fixture('missing_kind_is_registration_not_new_verification', () => {
  const w = word('fixture', ['old']);
  const c = cover(w, [], [], { words: [], roots: [{ key: 'old' }] });
  assert.equal(c.legacy_basis, 'pie_registered'); assert.equal(c.confidence, 'legacy');
  assert.equal(c.confirmed_pie_lexical_count, 0); assert.equal(c.has_pie_root, false);
});
fixture('unknown_key_not_PIE', () => {
  const w = word('fixture', ['missing-id']); const c = cover(w, [], [], { words: [] });
  assert.equal(c.state, 'unavailable'); assert.equal(c.confirmed_pie_lexical_count, 0);
  assert.equal(c.unknown_legacy_ref_count, 1);
});
fixture('word_or_source_guard_drift', () => {
  const w = word(); const r = row(w, [lineage('base', ['a'])], { guard_valid: false, stale_reasons: ['source_hash_drift'] });
  const { binding } = setup(w, [entity('a')], [], { words: [r] }); const c = binding.coverage(w);
  assert.equal(c.state, 'unavailable'); assert.equal(c.stale_count, 1);
  assert.equal(c.confirmed_attested_lexical_count, 0); assert.deepEqual(binding.rootRefs(w), []);
});
fixture('three_transmission_languages_one_component', () => {
  const w = word(); const c = cover(w, [entity('a')], [lineage('base', ['a'], { transmission_families: ['ロマンス', 'テュルク', 'セム'] })]);
  assert.equal(c.confirmed_attested_lexical_count, 1); assert.equal(c.mixed_basis, false);
});
fixture('Greek_cognate_not_a_borrowing_parent', () => {
  const w = word('fixture', ['kannabis']);
  const prepared = C.prepare({ schema: 1, entities: [entity('greek')], words: [], aliases: [], legacy_root_types: [] }, [{ key: 'kannabis', kind: 'greek_lemma' }]);
  const binding = C.bind([w], prepared);
  assert.equal(binding.coverage(w).confirmed_attested_lexical_count, 0); assert.deepEqual(binding.byEntity('greek'), []);
});
fixture('same_surface_different_language', () => {
  const w = word(), a = entity('arabic', 'attested_formative', { form: 'al', language: 'Arabic', meaning: 'the' });
  const b = entity('latin', 'attested_formative', { form: '-al', language: 'Latin', meaning: 'adjective formative' });
  const good = setup(w, [a, b], [lineage('a', ['arabic'], { role: 'formative' }), lineage('b', ['latin'], { role: 'formative' })]);
  assert.notEqual(good.binding.entity('arabic'), good.binding.entity('latin'));
  assert.equal(good.binding.coverage(w).confirmed_formative_count, 2);
  const bad = setup(w, [a, b], [lineage('a', ['arabic'])], { aliases: [{ from: 'arabic', to: 'latin', relation: 'orthographic_alias', status: 'reviewed', evidence }] });
  assert.equal(bad.binding.coverage(w).state, 'unavailable');
});
fixture('legacy_alias_com_to_kom', () => {
  const w = word('fixture', ['com-']);
  const c = cover(w, [], [], { words: [], roots: [{ key: 'com-', kind: 'legacy_alias', target: 'kom' }, { key: 'kom' }],
    legacy_root_types: [{ key: 'com-', type: 'legacy_group_reference', registered_kind: 'legacy_alias', target: 'kom', basis: 'legacy' }] });
  assert.equal(c.confirmed_pie_lexical_count, 0); assert.equal(c.state, 'legacy_registered');
  assert.equal(c.legacy_refs[0].type, 'legacy_group_reference');
});
test('all 12 published design states have executable cases', () => assert.equal(implementedFixtures.size, 12));

test('source-supported attested links exist without promoting completeness', () => {
  const w = word(); const { binding } = setup(w, [entity('a')], [lineage('base', ['a'])]); const c = binding.coverage(w);
  assert.equal(c.source_supported_count, 1); assert.equal(c.has_confirmed_lexical, true);
  assert.equal(c.components_complete, false); assert.equal(c.confidence, 'source_supported');
  assert.equal(binding.matches(w, { hasLexical: true }), true);
});
test('dictionary support is distinct from proposed lexical links', () => {
  const w = word(); const c = cover(w, [entity('a')], [lineage('base', ['a'], { link_status: 'proposed' })]);
  assert.equal(c.confirmed_attested_lexical_count, 0); assert.equal(c.state, 'uncertain');
});
test('a cognate is never traversed as an ancestor', () => {
  const w = word(); const { binding } = setup(w, [entity('a'), entity('p', 'pie_reconstruction')],
    [lineage('base', ['a', 'p'], { edges: [edge('a', 'p', 'cognate_with')] })]);
  assert.deepEqual(binding.rootRefs(w).map(x => x.id), ['a']); assert.deepEqual(binding.byEntity('p'), []);
});
test('global edges act only inside explicitly authored lineage refs', () => {
  const a = word('both'), b = word('one');
  const payload = { schema: 1, entities: [entity('a'), entity('b')], aliases: [],
    edges: [edge('a', 'b', 'borrowed_from')], words: [
      row(a, [lineage('base', ['a', 'b'], { deepest_confirmed_ref: 'b' })]),
      row(b, [lineage('base', ['a'])])
    ] };
  const binding = C.bind([a, b], C.prepare(payload, []));
  assert.equal(binding.rootRefs(a)[0].id, 'b'); assert.equal(binding.rootRefs(b)[0].id, 'a');
  assert.equal(binding.coverage(a).confirmed_attested_lexical_count, 1);
});
test('explicit same-language inflection is ancestral but is not an alias', () => {
  const w = word(), l = lineage('base', ['plural', 'lemma'], { deepest_confirmed_ref: 'lemma',
    edges: [edge('plural', 'lemma', 'inflected_from')] });
  const entities = [entity('plural', 'attested_lexeme', { meaning: 'plural meaning' }), entity('lemma')];
  const binding = setup(w, entities, [l]).binding;
  assert.equal(binding.rootRefs(w)[0].id, 'lemma'); assert.equal(binding.coverage(w).confirmed_attested_lexical_count, 1);
  assert.equal(binding.entity('plural').id, 'plural');
  assert.equal(setup(w, [entities[0], { ...entities[1], language: 'different-language' }], [l]).binding.coverage(w).state, 'unavailable');
});
test('cycles, dangling edges and a forged deepest ref fail closed', () => {
  for (const l of [
    lineage('base', ['a', 'b'], { edges: [edge('a', 'b'), edge('b', 'a')] }),
    lineage('base', ['a'], { edges: [edge('a', 'missing')] }),
    lineage('base', ['a', 'b'], { deepest_confirmed_ref: 'b' }),
    lineage('base', ['a', 'b', 'c'], { edges: [edge('a', 'b'), edge('a', 'c')] })
  ]) {
    const w = word(); const { binding } = setup(w, [entity('a'), entity('b'), entity('c')], [l]);
    assert.equal(binding.coverage(w).state, 'unavailable'); assert.deepEqual(binding.rootRefs(w), []);
  }
});
test('valid orthographic aliases resolve; alias cycles and reflex aliases do not', () => {
  const w = word(), entities = [entity('a'), entity('b')];
  const alias = { from: 'a', to: 'b', relation: 'orthographic_alias', status: 'reviewed', evidence };
  const good = setup(w, entities, [lineage('base', ['a'])], { aliases: [alias] });
  assert.equal(good.binding.entity('a').id, 'b'); assert.equal(good.binding.rootRefs(w)[0].id, 'b');
  for (const aliases of [[alias, { ...alias, from: 'b', to: 'a' }], [{ ...alias, relation: 'reflex_of' }], [{ ...alias, to: 'missing' }]]) {
    assert.equal(setup(w, entities, [lineage('base', ['a'])], { aliases }).binding.coverage(w).state, 'unavailable');
  }
});
test('exact identities retain p order and etymology/origin IDs', () => {
  const a = word('same', ['one', 'two'], { etymology_id: 'sense1' });
  const reversed = word('same', ['two', 'one'], { etymology_id: 'sense1' });
  const other = word('same', ['one', 'two'], { origin_id: 'sense2' });
  const prepared = C.prepare({ schema: 1, entities: [entity('a')], aliases: [], words: [row(a, [lineage('base', ['a'])])] }, [{ key: 'one' }, { key: 'two' }]);
  const binding = C.bind([a, reversed, other], prepared);
  assert.equal(binding.coverage(a).has_confirmed_lexical, true);
  assert.equal(binding.coverage(reversed).has_confirmed_lexical, false); assert.equal(binding.coverage(other).has_confirmed_lexical, false);
});
test('duplicates isolate every candidate but leave unrelated records available', () => {
  const a = word('same'), duplicate = { ...a, p: [] }, good = word('good');
  const payload = { schema: 1, entities: [entity('a')], aliases: [], words: [row(a, [lineage('base', ['a'])]), row(good, [lineage('base', ['a'])])] };
  let binding = C.bind([a, duplicate, good], C.prepare(payload, []));
  assert.equal(binding.coverage(a).state, 'unavailable'); assert.equal(binding.coverage(duplicate).state, 'unavailable');
  assert.equal(binding.coverage(good).has_confirmed_lexical, true);
  binding = C.bind([a, good], C.prepare({ ...payload, words: [...payload.words, payload.words[0]] }, []));
  assert.equal(binding.coverage(a).state, 'unavailable'); assert.equal(binding.coverage(good).has_confirmed_lexical, true);
});
test('all supplied word-context fields are strict and stale links expose zero refs', () => {
  for (const field of ['ja', 'en', 'pos', 'b']) {
    const w = word(), entry = row(w, [lineage('base', ['a'])]); w[field] += ' changed';
    const { binding } = setup(w, [entity('a')], [], { words: [entry] });
    assert.equal(binding.coverage(w).state, 'unavailable', field); assert.equal(binding.rootRefs(w).length, 0);
  }
});
test('ja, en and pos are required guards; a single supplied field cannot authorize a link', () => {
  const w = word();
  for (const guard of [{ ja: w.ja }, { ja: w.ja, en: w.en }, {}]) {
    const entry = row(w, [lineage('base', ['a'])], { word_guard: guard });
    assert.equal(setup(w, [entity('a')], [], { words: [entry] }).binding.coverage(w).state, 'unavailable');
  }
  const entry = row(w, [lineage('base', ['a'])], { word_guard: { ja: w.ja }, before_en: w.en, before_pos: w.pos });
  assert.equal(setup(w, [entity('a')], [], { words: [entry] }).binding.coverage(w).has_confirmed_lexical, true);
});
test('legacy classification remains visible without creating confirmed word links', () => {
  const roots = [{ key: 'pie' }, { key: 'formative', kind: 'pie_formative' },
    { key: 'uncertain', kind: 'unverified_reconstruction' }, { key: 'lemma', kind: 'latin_lemma' }];
  const mixed = word('mixed', roots.map(x => x.key)), uncertain = word('uncertain', ['uncertain']);
  const prepared = C.prepare({ schema: 1, entities: [], words: [], aliases: [] }, roots);
  const binding = C.bind([mixed, uncertain], prepared), c = binding.coverage(mixed);
  assert.equal(c.legacy_pie_ref_count, 1); assert.equal(c.legacy_formative_ref_count, 1);
  assert.equal(c.legacy_uncertain_ref_count, 1); assert.equal(c.legacy_attested_group_ref_count, 1);
  assert.equal(c.confirmed_pie_lexical_count, 0); assert.equal(c.confirmed_attested_lexical_count, 0);
  assert.equal(c.legacy_has_uncertain_references, true); assert.equal(c.state, 'legacy_registered');
  assert.equal(binding.coverage(uncertain).state, 'uncertain'); assert.equal(binding.coverage(uncertain).confidence, 'legacy');
  assert.equal(binding.matches(uncertain, { legacyUncertainOnly: true }), true);
  assert.equal(binding.matches(mixed, { registered: true, legacyPIE: true, known: false }), true);
});
test('missing payload is unavailable, not an empty or absent root assertion', () => {
  const w = word(); const binding = C.bind([w], C.prepare(null, []));
  assert.equal(binding.coverage(w).state, 'unavailable');
  assert.equal(binding.matches(w, { hasLexical: false }), false);
  assert.equal(binding.matches(w, { rootPresence: 'none' }), false);
  assert.equal(binding.matches(w, { rootPresence: 'unknown' }), true);
});
test('synthetic nodes and form variants are thin display metadata, not new links', () => {
  const w = word(), entities = [entity('a', 'attested_morphological_root', { forms: [{ form: 'variant', type: 'transliteration' }] }), entity('unlinked')];
  const { binding } = setup(w, entities, [lineage('base', ['a'])]);
  assert.equal(binding.syntheticRoots().length, 1); const node = binding.syntheticRoots()[0];
  assert.equal(node.key, binding.rootRefs(w)[0].key); assert.equal(node.forms[0].form, 'variant');
  assert.equal(binding.entity('variant'), null); assert.deepEqual(binding.byEntity('unlinked'), []);
});
test('inputs and legacy fields are never mutated', () => {
  const w = word('fixture', ['old'], { g: 'G', gs: ['G'], origin_families: ['ゲルマン'], pic: 'kept' });
  const payload = { schema: 1, entities: [entity('a')], aliases: [], words: [row(w, [lineage('base', ['a'])])] }, roots = [{ key: 'old', kind: 'latin_lemma' }];
  const before = JSON.stringify([w, payload, roots]);
  const binding = C.bind([w], C.prepare(payload, roots));
  binding.coverage(w); binding.rootRefs(w); binding.wordLineages(w); binding.syntheticRoots();
  assert.equal(JSON.stringify([w, payload, roots]), before);
});
test('UMD loads without CommonJS and exposes the same browser API', () => {
  const sandbox = {}; vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'app/shared/etymological-components.js'), 'utf8'), sandbox);
  assert.equal(typeof sandbox.EtymonComponents.prepare, 'function'); assert.equal(typeof sandbox.EtymonComponents.bind, 'function');
});
test('real coffee prototype binds exactly, then rejects a changed lexical sense', () => {
  const payload = JSON.parse(fs.readFileSync(path.join(ROOT, 'work/non-pie-components-20261028/canonical-prototype.json'), 'utf8'));
  const entry = payload.words[0], w = { w: entry.w, p: entry.p, etymology_id: entry.etymology_id, ...entry.word_guard };
  const binding = C.bind([w], C.prepare(payload, []));
  assert.equal(binding.coverage(w).confirmed_attested_lexical_count, 1);
  assert.equal(binding.rootRefs(w)[0].form, 'qahwa'); assert.equal(binding.coverage(w).components_complete, false);
  const changed = { ...w, ja: w.ja + ' guard drift' };
  assert.equal(C.bind([changed], C.prepare(payload, [])).coverage(changed).state, 'unavailable');
});
test('real public records use cached coverage: filtering never walks the graph again', t => {
  const words = JSON.parse(fs.readFileSync(path.join(ROOT, 'app/data/generated-etymon/words.json'), 'utf8'));
  const roots = JSON.parse(fs.readFileSync(path.join(ROOT, 'app/data/generated-etymon/roots.json'), 'utf8'));
  const payload = JSON.parse(fs.readFileSync(path.join(ROOT, 'work/non-pie-components-20261028/canonical-prototype.json'), 'utf8'));
  const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const before = hash([words, roots, payload]), prepared = C.prepare(payload, roots), binding = C.bind(words, prepared);
  const walks = prepared.stats.graph_walks;
  for (const w of words) binding.matches(w, { states: ['attested_confirmed', 'pie_confirmed'] });
  for (let i = 0; i < 100; i++) for (const w of words.slice(0, 1000)) { binding.coverage(w); binding.matches(w, { rootPresence: ['present', 'unknown'] }); }
  assert.equal(prepared.stats.graph_walks, walks); assert.equal(hash([words, roots, payload]), before);
  assert.equal(binding.summary.total, words.length); assert.ok(words.length > 49000);
  t.diagnostic(`${words.length} real records; graph walks after bind=${walks}, after filters=${prepared.stats.graph_walks}`);
});
