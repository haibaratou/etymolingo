const test=require('node:test'),assert=require('node:assert/strict');
const {languageFamilies}=require('./explorer-difficulty-v2.js');
test('a Japanese etymology sentence is never parsed into language tags',()=>{
 const b='古英語 steam は 熱い物から立ちのぼる蒸気 においを表した。';
 assert.deepEqual(languageFamilies({w:'steam',g:'',gs:[],b}),[]);
 assert.deepEqual(languageFamilies({w:'steam',g:'G',gs:['G'],b}),['G']);
});
test('reviewed hybrid component order survives and duplicate codes collapse',()=>{
 assert.deepEqual(languageFamilies({g:'Gr',gs:['Gr','L','Gr']}),['Gr','L']);
});
test('only registered language codes can become tags',()=>{
 assert.deepEqual(languageFamilies({gs:['古英語','steam','は','G','熱い蒸気']}),['G']);
 assert.deepEqual(languageFamilies({g:'J'}),['J']);
});
