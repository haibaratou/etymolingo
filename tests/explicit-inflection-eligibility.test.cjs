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

test('explicit nonstandard forms remain grammatical while lexical meanings stay eligible',()=>{
 assert.equal(evaluate({w:'brung',pos:'動',ja:'非標準的な過去形',en:'nonstandard past form of bring'}).eligible,false);
 assert.equal(evaluate({w:'hove',pos:'動',ja:'過去形・過去分詞',en:'past form of heave'}).eligible,false);
 assert.equal(evaluate({w:'begotten',pos:'動',ja:'過去分詞',en:'past participle of beget'}).eligible,false);
 assert.equal(evaluate({w:'rogue',pos:'名',ja:'ならず者',en:'nonstandard software implementation'}).eligible,true);
});
