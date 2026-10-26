const test=require('node:test');
const assert=require('node:assert/strict');
const {evaluate,inflectionOnly}=require('../app/shared/spelling-puzzle-eligibility.js');

test('explicit plural and comparison-only records belong to the lemma',()=>{
 for(const [w,en,pos] of [
  ['children','plural of child','名'],['mice','plural of mouse','名'],
  ['bigger','comparative of big','形'],['biggest','superlative of big','形'],
  ['reads','third-person singular simple present of read','動'],
  ['reading','present participle of read','動'],['wrote','past of write','動']
 ])assert.equal(evaluate({w,en,pos,ja:'語形'}).eligible,false,w);
});

test('independent lexical senses are preserved for inflected spellings',()=>{
 for(const [w,en,pos] of [
  ['glasses','spectacles','名'],['reading','interpretation','名'],
  ['broken','damaged','形'],['saw','cutting tool','名'],
  ['found','establish','動'],['better','superior','形'],
  ['spat','quarrel / past of spit','名/動']
 ])assert.equal(evaluate({w,en,pos,ja:'意味'}).eligible,true,w);
});

test('a grammatical phrase embedded in a lexical definition is not form-only',()=>{
 assert.equal(inflectionOnly('children','名','','plural of child in a legal context'),false);
 assert.equal(inflectionOnly('pastel','名','','color from the past'),false);
});
