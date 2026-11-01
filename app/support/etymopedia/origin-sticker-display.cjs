'use strict';
const crypto=require('node:crypto');
const decisions=require('./origin-sticker-display.json');
const key=w=>JSON.stringify([w.w,w.p]);
const digest=w=>crypto.createHash('sha256').update(JSON.stringify([w.ja,w.en,w.pos])).digest('hex');
function apply(data){
 if(decisions.schema!==1||!Array.isArray(decisions.entries))throw Error('Invalid origin sticker decisions');
 const seen=new Set();
 for(const d of decisions.entries){
  if(Object.keys(d).sort().join(',')!=='display_languages,expected_origin_languages,p,sense_sha256,w'||seen.has(key(d)))throw Error('Invalid or duplicate sticker decision');
  seen.add(key(d));
  const matches=data.words.filter(w=>key(w)===key(d));
  if(matches.length!==1)throw Error('Missing or ambiguous sticker identity '+d.w);
  const w=matches[0];
  if(digest(w)!==d.sense_sha256||JSON.stringify(w.origin_languages)!==JSON.stringify(d.expected_origin_languages))throw Error('Stale sticker decision '+d.w);
  if(!Array.isArray(d.display_languages)||!d.display_languages.length||new Set(d.display_languages).size!==d.display_languages.length||d.display_languages.some(l=>!w.origin_languages.includes(l)))throw Error('Unsupported sticker label '+d.w);
  w.origin_sticker_languages=[...d.display_languages];
 }
 for(const w of data.words)if('origin_sticker_languages' in w&&!seen.has(key(w)))throw Error('Unreviewed sticker override');
 return data;
}
function validate(data){
 const expected=apply(JSON.parse(JSON.stringify(data)));
 if(JSON.stringify(expected)!==JSON.stringify(data))throw Error('Origin sticker projection stale');
}
module.exports={apply,validate};
