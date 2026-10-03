const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function particleHarness() {
  const source = fs.readFileSync(require.resolve('./game.js'), 'utf8');
  const classSource = source.slice(source.indexOf('  class Petals {'), source.indexOf('  const petals = new Petals();'));
  const calls = [];
  const context = new Proxy({}, {get: (_, key) => (...args) => calls.push([key, ...args]), set: () => true});
  const canvas = {width: 0, height: 0, getBoundingClientRect: () => ({width: 390, height: 740}), getContext: () => context};
  const scope = { $: () => canvas, window: {devicePixelRatio: 2, addEventListener() {}}, reducedMotion: {matches: false}, document: {hidden: false},
    getComputedStyle: () => ({getPropertyValue: () => '#ff7a45'}), performance: {now: () => 0}, requestAnimationFrame: () => 1, cancelAnimationFrame() {} };
  vm.runInNewContext(classSource + ';this.particles = new Petals();', scope);
  return {particles: scope.particles, canvas, calls};
}

test('particle clear resets transforms and erases the complete DPR backing store', () => {
  const {particles, canvas, calls} = particleHarness();
  assert.equal(canvas.width, 780); assert.equal(canvas.height, 1480);
  particles.clear();
  assert.deepEqual(calls.slice(-3), [['setTransform',1,0,0,1,0,0],['clearRect',0,0,780,1480],['setTransform',2,0,0,2,0,0]]);
  assert.equal(particles.items.length, 0); assert.equal(particles.frame, 0);
});

test('confetti expires by wall time even after a delayed animation frame', () => {
  const {particles} = particleHarness();
  particles.burst(380, 100, 20, 'gold');
  particles.draw(5000); particles.draw(5016);
  assert.equal(particles.items.length, 0); assert.equal(particles.frame, 0);
});
