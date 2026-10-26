/* Lexical eligibility for family-friendly English spelling puzzles.
   An eligible headword is only a CANDIDATE: image, sense, caption and game
   reviews must still pass separately. Do not turn this into a published game
   availability flag. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.EtymonSpellingEligibility=api;
})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const excludedWords=new Set(`
ass asshole bastard bitch blowjob cock cunt dildo ejaculation erotic fuck fucking
genital genitals intercourse masturbation orgasm penis porn pornography prostitute
prostitution pussy rape rapist semen sexy sexuality shit slut sperm vagina vaginal whore
nigger nigga faggot
`.trim().split(/\s+/));
const historicalPeople=new Set(`
Einstein Newton Darwin Galileo Cleopatra Aristotle Socrates Plato Napoleon
Shakespeare Beethoven Mozart Gandhi Lincoln Tesla Edison Confucius Caesar
Copernicus Archimedes Hippocrates Voltaire
`.trim().split(/\s+/));
const grammarOnly=new Set(['助','冠','前','接','代','間','不定詞']);
const contentParts=new Set(['名','動','形','副']);
const grammarForms=new Set(['been','am','are','was','were','is','ought','could','would','should','shall']);
const explicitMeaning=/(?:誤字|誤記|誤綴|廃語|侮蔑語|差別語|陰茎|性交|膣|腟|自慰|射精|強姦|わいせつ|ポルノ|卑猥|性器)/;
const ordinaryName=/(?:男性名|女性名|人名|人の名前|姓名|名字|名前として)|(?:\b(?:male name|female name|given name|personal name|first name|forename|surname)\b)/i;
const purePastGloss=/^(?:past(?:\\s+tense)?(?:\\s+and\\s+past\\s+participle)?|past\\s+participle|past\\s+form|simple\\s+past(?:\\s+tense)?|preterite)\\s+of\\s+[a-z][a-z'-]*\\b/i;
const legacyPastOnly=new Set(['went','was','were']);
function inflectionOnly(w,pos,ja,en){
 const parts=String(en||'').trim().split(' / ').map(s=>s.trim()).filter(Boolean);
 if(parts.length&&parts.every(s=>purePastGloss.test(s)))return true;
 if(!parts.length&&/過去形|過去分詞/.test(ja)&&String(pos).split('/').includes('動'))return true;
 return legacyPastOnly.has(String(w).toLowerCase())&&pos==='動';
}
function evaluate(row){
 const w=String(row?.w||'').trim(),pos=String(row?.pos||'').trim();
 const ja=String(row?.ja||''),en=String(row?.en||'');
 if(!/^[a-zA-Z]{3,14}$/.test(w))return {eligible:false,reason:'3〜14文字の英字だけが対象'};
 if(excludedWords.has(w.toLowerCase())||explicitMeaning.test(ja))return {eligible:false,reason:'全年齢向け出題に不適切な表現'};
 if(!ja.trim()&&!en.trim())return {eligible:false,reason:'代表語義が未登録'};
 if(inflectionOnly(w,pos,ja,en))return {eligible:false,reason:'単純な過去形・過去分詞のみ。基本語の活用形として扱う'};
 const isHistoric=historicalPeople.has(w);
 if((/^[A-Z]/.test(w)||ordinaryName.test(ja+' '+en))&&!isHistoric)
  return {eligible:false,reason:'一般的人名・固有名詞は対象外'};
 const parts=pos.split(/[\/・,、]/).map(s=>s.trim()).filter(Boolean);
 if(!parts.length)return {eligible:false,reason:'品詞が未確定'};
 if(parts.some(x=>grammarOnly.has(x)))return {eligible:false,reason:'助動詞・機能語は対象外'};
 if(grammarForms.has(w.toLowerCase())&&!isHistoric)return {eligible:false,reason:'助動詞・文法的な活用形'};
 if(!parts.some(x=>contentParts.has(x)))return {eligible:false,reason:'スペリング問題向けの自立語ではない'};
 return {eligible:true,reason:'単語の基本条件に適合。画像・語義・解説の検品は別途必要'};
}
return {evaluate};
});
