const { test } = require('node:test');
const assert = require('node:assert/strict');
const { advanceSelection, sweptHits } = require('./gesture.js');

test('a sparse pointer segment picks up every crossed letter in travel order', () => {
  const nodes = [{ id: 2, x: 180, y: 0 }, { id: 0, x: 0, y: 0 }, { id: 1, x: 90, y: 0 }, { id: 3, x: 90, y: 40 }];
  assert.deepEqual(sweptHits(nodes, { x: -30, y: 0 }, { x: 210, y: 0 }, () => 25), [0, 1, 2]);
  assert.deepEqual(sweptHits(nodes, { x: 210, y: 0 }, { x: -30, y: 0 }, () => 25), [2, 1, 0]);
});

test('sweeping backwards unwinds several letters without resubmitting', () => {
  const nodes = [0, 1, 2, 3].map(id => ({ id, x: id * 90, y: 0 }));
  let path = [0, 1, 2, 3];
  for (const id of sweptHits(nodes, { x: 270, y: 0 }, { x: 0, y: 0 }, () => 25)) path = advanceSelection(path, id, 4);
  assert.deepEqual(path, [0]);
  path = advanceSelection(path, 2, 4);
  assert.deepEqual(path, [0, 2]);
});

test('two identical letters have distinct physical identities', () => {
  const letters = ['R', 'A', 'B', 'B', 'I', 'T'];
  let path = [];
  for (const id of [0, 1, 2, 2, 3, 4, 5]) path = advanceSelection(path, id, 6);
  assert.equal(path.map(id => letters[id]).join(''), 'RABBIT');
  assert.deepEqual(advanceSelection(path, 2, 6), [0, 1, 2]);
});

test('the last letter can be held without repeating it and the answer cannot overflow', () => {
  const path = [0, 1, 2];
  assert.equal(advanceSelection(path, 2, 3), path);
  assert.equal(advanceSelection(path, 3, 3), path);
  assert.deepEqual(advanceSelection(path, 1, 3), [0, 1]);
});

test('stationary and near-miss events do not invent hits', () => {
  const nodes = [{ id: 1, x: 50, y: 0 }];
  assert.deepEqual(sweptHits(nodes, { x: 0, y: 30 }, { x: 100, y: 30 }, () => 25), []);
  assert.deepEqual(sweptHits(nodes, { x: 50, y: 0 }, { x: 50, y: 0 }, () => 25), []);
  assert.deepEqual(sweptHits(nodes, { x: 0, y: 24 }, { x: 100, y: 24 }, () => 25), [1]);
});
