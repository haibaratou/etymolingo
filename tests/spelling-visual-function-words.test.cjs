// Run: node tests/spelling-visual-function-words.test.cjs
const assert = require('node:assert/strict');
const {evaluate} = require('../app/shared/spelling-puzzle-eligibility.js');
const row = (w,pos,ja,en)=>({w,pos,ja,en});
for (const pos of ['前','副','前/副']) {
  assert.equal(evaluate(row('over',pos,'〜の上に','above')).eligible,true, 'over '+pos);
}
for(const [w,pos,ja,en] of [
 ['under','前','〜の下に','beneath'],
 ['between','前','〜の間に','in the middle of two things'],
 ['behind','前','〜の後ろに','at the back of'],
 ['this','代','これ','this thing'],
 ['they','代','彼ら','those people']
])assert.equal(evaluate(row(w,pos,ja,en)).eligible,true,w);
for(const [w,pos] of [['could','助'],['would','助'],['should','助'],['been','動']]){
 assert.equal(evaluate(row(w,pos,'文法用語','grammatical form')).eligible,false,w);
}
assert.equal(evaluate(row('went','動','goの過去形','past of go')).eligible,false);
assert.equal(evaluate(row('over','前','','')).eligible,false,'unknown definition still excluded');
console.log('spelling eligibility: visual function words accepted and difficult grammar forms excluded');
