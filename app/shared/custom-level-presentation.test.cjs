const test=require('node:test'),assert=require('node:assert/strict');
const api=require('./rarity-presentation.js');
test('all ten stored levels display as half-stars on a five-star scale',()=>{
 for(let n=1;n<=10;n++){
  const model=api.learning(n,'detail'),html=api.html(model);
  assert.equal(model.stars,n/2);assert.equal(model.scale,5);assert.equal(model.level,n);
  assert.equal(model.scheme,'custom-learning-level-v1');
  assert.equal((html.match(/class="er-star(?: er-star-half)?"/g)||[]).length,Math.ceil(n/2));
  assert.equal((html.match(/er-star-half/g)||[]).length,n%2);
  assert.ok(html.includes('data-learning-level="'+n+'"'));
  assert.ok(html.includes('data-rarity-stars="'+n/2+'"'));
  assert.ok(api.title(model).includes('星'+n/2+' / 5'));
  assert.ok(api.title(model).includes('独自レベル '+n+' / 10'));
  assert.ok(!html.includes('別の指標'));assert.ok(!html.includes('レア度'));
 }
});
test('unclassified level never falls back to an old frequency rank',()=>{
 for(const n of [null,undefined,0,11,-1,1.5,'3',NaN]){
  const model=api.learning(n);assert.equal(model.stars,0);assert.match(api.title(model),/未分類/);
 }
});
