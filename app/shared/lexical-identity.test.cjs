const test=require('node:test'),assert=require('node:assert/strict');
const api=require('./lexical-identity.js');
const fish={w:'roach',p:[],etymology_id:'roach-fish',ja:'魚',en:'freshwater fish'};
const insect={w:'roach',p:[],etymology_id:'roach-cockroach',ja:'ゴキブリ',en:'cockroach'};
test('rootless origins have distinct lexical, image and dictionary guards',()=>{
 assert.notEqual(api.key(fish),api.key(insect));
 assert.notEqual(api.artKey(fish),api.artKey(insect));
 assert.notDeepEqual(api.dictionaryAnchor(fish),api.dictionaryAnchor({...fish,etymology_id:insect.etymology_id}));
});
test('artwork never falls back to the old ambiguous rootless key',()=>{
 const words=[{...fish,pic:true,pica:'roach'},{...insect,pic:true,pica:'roach'}];
 api.applyArtwork(words,{'["roach",""]':'roach',[api.artKey(fish)]:'roach@np-fish'});
 assert.equal(words[0].pica,'roach@np-fish');assert.equal(words[0].pic,true);
 assert.equal(words[1].pic,false);assert.equal(words[1].pica,undefined);
});
test('ordinary legacy dictionary and artwork keys stay compatible',()=>{
 const row={w:'cat',p:['kat-'],ja:'猫',en:'cat'};
 assert.equal(api.artKey(row),'["cat","kat-"]');
 assert.deepEqual(api.dictionaryAnchor(row),['cat',['kat-'],'猫','cat']);
});
test('other-language filter checks every family and excludes unknowns',()=>{
 assert.equal(api.familyMatches({g:'G',gs:['G','Ce']},'x'),true);
 assert.equal(api.familyMatches({g:'Gr',gs:['Gr','L']},'L'),true);
 assert.equal(api.familyMatches({g:''},'x'),false);
 assert.equal(api.familyMatches({g:'L',gs:['Gr','L']},'G'),false);
});
test('personal notes never cross origins; unique old spelling notes remain usable',()=>{
 const note={note:'fish note'},memos={[api.memoKey(fish)]:note,roach:{note:'ambiguous old note'},cat:{note:'old cat note'}};
 assert.equal(api.memoFor(fish,memos,[fish,insect]),note);
 assert.equal(api.memoFor(insect,memos,[fish,insect]),null);
 assert.deepEqual(api.memoFor({w:'cat',p:[]},memos,[{w:'cat',p:[]}]),{note:'old cat note'});
});
test('multilingual and scene lookups reject another rootless origin',()=>{
 const multilingual=require('./multilingual-answers.js'),scenes=require('./illustration-scenes.js');
 const entry={...fish,art:'fish',sense:{ja:fish.ja,en:fish.en},senses:[]};
 const index=multilingual.index({schema:1,entries:[entry]});
 assert.equal(index.has(multilingual.key(insect)),false);
 assert.equal(scenes.find({entries:[entry]},insect,'fish'),null);
 assert.equal(scenes.firstSenseMatches(entry,{...fish,etymology_id:insect.etymology_id}),false);
});
