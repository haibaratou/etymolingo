const test=require('node:test'),assert=require('node:assert/strict');
const api=require('./rarity-presentation.js');
test('current custom level is the exact star count for all ten levels',()=>{
 for(let n=1;n<=10;n++){
  const model=api.learning(n,'detail'),html=api.html(model);
  assert.equal(model.stars,n);assert.equal(model.scale,10);
  assert.equal(model.scheme,'custom-learning-level-v1');
  assert.equal((html.match(/class="er-star"/g)||[]).length,n);
  assert.ok(api.title(model).includes('独自レベル '+n+' / 10'));
  assert.ok(!html.includes('別の指標'));assert.ok(!html.includes('レア度'));
 }
});
test('unclassified level never falls back to an old frequency rank',()=>{
 for(const n of [null,undefined,0,11,-1,1.5,'3',NaN]){
  const model=api.learning(n);assert.equal(model.stars,0);assert.match(api.title(model),/未分類/);
 }
});
