// Run: node tests/nominal-adjective-inflections.test.cjs
const assert=require('node:assert/strict');
const m=require('../app/shared/nominal-adjective-inflections.js');
function val(w,pos,label){return m.lookup(w,pos).flatMap(g=>g.forms).find(x=>x.label===label)?.value;}
assert.equal(val('child','名','複数形'),'children');
assert.equal(val('mouse','名','複数形'),'mice');
assert.equal(val('city','名','複数形'),'cities');
assert.equal(val('good','形','比較級'),'better');
assert.equal(val('good','形','最上級'),'best');
assert.equal(val('beautiful','形','比較級'),'more beautiful');
assert.equal(val('big','形','最上級'),'biggest');
assert.equal(m.lookup('saw','名').length,0,'unlisted homograph must not inherit verb forms');
assert.equal(m.lookup('good','名').length,0,'adjective forms must not apply to noun');
assert.equal(m.lookup('child','形').length,0,'plural forms must not apply to adjective');
assert.equal(m.lookup('unique','形').length,0,'unreviewed comparison must not be invented');
assert.equal(m.lookup('city','名/形').length,1,'mixed POS should retain reviewed plural');
console.log('Reviewed noun/adjective forms: OK');
