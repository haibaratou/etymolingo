'use strict';
// All invented entities below are software fixtures, not etymological claims.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const C = require(process.env.ETYMON_COMPONENTS_HELPER || '../../shared/etymological-components.js');
const evidence = [{ source: 'https://example.test/independently-verified-software-fixture', note: 'Software fixture only.' }];
const clone = value => JSON.parse(JSON.stringify(value));
const entity = (id, extra = {}) => ({ id, form: id, language: 'fixture-stage', meaning: 'fixture meaning',
  kind: 'attested_lexeme', status: 'dictionary_attested', evidence, ...extra });
function fixture() {
  const word = { w: 'fixture', p: [], ja: 'fixture meaning', en: 'fixture', pos: '名', b: 'fixture note' };
  const line = (id, ref) => ({ id, role: 'lexical', refs: [ref], word_ref: ref,
    deepest_confirmed_ref: ref, link_status: 'source_supported', edges: [], evidence });
  const row = { w: word.w, p: [], etymology_id: '', word_guard: { ja: word.ja, en: word.en, pos: word.pos, b: word.b },
    guard_valid: true, stale_reasons: [], components_complete: false, status: 'source_supported',
    lineages: [line('material-a', 'a'), line('material-b', 'b')] };
  const payload = { schema: 1, entities: [entity('a'), entity('b'), entity('whole'), entity('older-whole')], aliases: [], words: [row] };
  return { word, row, payload };
}
function history(extra = {}) {
  return { id: 'word-transmission', kind: 'form_history', label: 'Explicit attested whole-word history',
    status: 'source_supported', segments: [{ entity_ref: 'whole' }, { entity_ref: 'older-whole' }], evidence, ...extra };
}
function bind(f) { return C.bind([f.word], C.prepare(f.payload, [])); }
function checkMaterials(binding, f) {
  const c = binding.coverage(f.word);
  assert.equal(c.guard_valid, true);
  assert.equal(c.state, 'attested_confirmed');
  assert.equal(c.confirmed_attested_lexical_count, 2);
  assert.equal(c.confirmed_pie_lexical_count, 0);
  assert.equal(c.confirmed_formative_count, 0);
  assert.equal(c.uncertain_count, 0);
  assert.equal(c.components_complete, false);
  assert.deepEqual(binding.rootRefs(f.word).map(r => r.id), ['a', 'b']);
  assert.equal(binding.matches(f.word, { hasLexical: true, hasPie: false, hasAttested: true }), true);
  assert.equal(binding.matches(f.word, { kinds: ['pie_reconstruction'] }), false);
  return c;
}
test('supported attested whole-word history stays browsable without a third material', () => {
  const f = fixture(), before = bind(f), oldCoverage = before.coverage(f.word);
  f.row.historical_analyses = [history()];
  const snapshot = JSON.stringify(f), binding = bind(f);
  assert.deepEqual(checkMaterials(binding, f), oldCoverage);
  for (const id of ['whole', 'older-whole']) {
    assert.deepEqual(binding.byEntity(id), [f.word]);
    assert.equal(binding.matches(f.word, { entityIds: [id] }), true);
    assert.ok(binding.syntheticRoots().some(r => r.component_id === id));
  }
  assert.equal(JSON.stringify(f), snapshot);
});
test('validated material parent is browsable even without a direct caption slot', () => {
  const f = fixture();
  f.row.historical_analyses = [{ id: 'whole-materials', kind: 'material_composition', label: 'Whole composition',
    parent_entity_ref: 'whole', status: 'source_supported', evidence,
    segments: [{ entity_ref: 'a', lineage_id: 'material-a' }, { entity_ref: 'b', lineage_id: 'material-b' }] }];
  const binding = bind(f); checkMaterials(binding, f);
  assert.deepEqual(binding.byEntity('whole'), [f.word]);
  assert.equal(binding.matches(f.word, { entities: ['whole'] }), true);
  assert.deepEqual(binding.displayRefs(f.word), []);
});
test('history aliases and repeated explicit references resolve once', () => {
  const f = fixture();
  f.payload.entities.push(entity('whole-alias', { form: 'whole-variant' }));
  f.payload.aliases = [{ from: 'whole-alias', to: 'whole', relation: 'orthographic_alias', status: 'reviewed' }];
  f.row.historical_analyses = [history({ segments: [{ entity_ref: 'whole-alias' }, { entity_ref: 'whole' }, { entity_ref: 'a' }] })];
  const binding = bind(f); checkMaterials(binding, f);
  assert.deepEqual(binding.byEntity('whole-alias'), [f.word]);
  assert.deepEqual(binding.byEntity('whole'), [f.word]);
  assert.equal(binding.matches(f.word, { entityIds: ['whole-alias'] }), true);
  assert.equal(binding.syntheticRoots().filter(r => r.component_id === 'whole').length, 1);
  assert.equal(binding.syntheticRoots().some(r => r.component_id === 'whole-alias'), false);
});
for (const [name, edit] of [
  ['hypothesis', f => { f.row.historical_analyses[0].kind = 'hypothesis'; }],
  ['analogy', f => { f.row.historical_analyses[0].kind = 'analogy'; }],
  ['missing explicit history status', f => { delete f.row.historical_analyses[0].status; }],
  ['uncertain history status', f => { f.row.historical_analyses[0].status = 'uncertain'; }],
  ['unconfirmed entity', f => { f.payload.entities.find(e => e.id === 'whole').status = 'uncertain'; }],
  ['PIE reconstruction', f => { f.payload.entities.find(e => e.id === 'whole').kind = 'pie_reconstruction'; }],
  ['PIE formative cannot be an attested history reference', f => { f.payload.entities.find(e => e.id === 'whole').kind = 'pie_formative'; }],
  ['proposed reconstruction', f => { f.payload.entities.find(e => e.id === 'whole').kind = 'proposed_reconstruction'; }]
]) test(name + ' never becomes a confirmed history browse reference', () => {
  const f = fixture(); f.row.historical_analyses = [history()]; edit(f);
  const binding = bind(f); checkMaterials(binding, f);
  assert.deepEqual(binding.byEntity('whole'), []);
  assert.equal(binding.matches(f.word, { entityIds: ['whole'] }), false);
  assert.equal(binding.syntheticRoots().some(r => r.component_id === 'whole'), false);
});
test('guard drift clears history lookup as well as all material references', () => {
  const f = fixture(); f.row.historical_analyses = [history()]; f.word.b += ' changed';
  const binding = bind(f);
  assert.equal(binding.coverage(f.word).state, 'unavailable');
  assert.deepEqual(binding.rootRefs(f.word), []);
  assert.deepEqual(binding.byEntity('whole'), []);
  assert.equal(binding.matches(f.word, { entityIds: ['whole'] }), false);
});
test('invalid material parent cannot create a browse registration', () => {
  const f = fixture();
  f.row.historical_analyses = [{ id: 'bad-composition', kind: 'material_composition', label: 'Invalid path fixture',
    parent_entity_ref: 'whole', status: 'source_supported', evidence,
    segments: [{ entity_ref: 'older-whole', lineage_id: 'material-a' }] }];
  const binding = bind(f);
  assert.equal(binding.coverage(f.word).state, 'unavailable');
  assert.deepEqual(binding.byEntity('whole'), []);
  assert.deepEqual(binding.rootRefs(f.word), []);
});
test('duplicate current identities cannot receive retained-history matches', () => {
  const f = fixture(); f.row.historical_analyses = [history()];
  const binding = C.bind([f.word, clone(f.word)], C.prepare(f.payload, []));
  assert.equal(binding.coverage(f.word).state, 'unavailable');
  assert.deepEqual(binding.byEntity('whole'), []);
  assert.equal(binding.matches(f.word, { entityIds: ['whole'] }), false);
});

test('confirmed attested formative history stays browsable without becoming another material', () => {
  const f=fixture();f.row.historical_analyses=[history()];f.payload.entities.find(e=>e.id==='whole').kind='attested_formative';
  const binding=bind(f);checkMaterials(binding,f);
  assert.deepEqual(binding.byEntity('whole'),[f.word]);assert.equal(binding.matches(f.word,{entityIds:['whole']}),true);
  assert.equal(binding.syntheticRoots().filter(r=>r.component_id==='whole').length,1);
  assert.equal(binding.rootRefs(f.word).some(r=>r.id==='whole'),false);
});
