import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import {createRequire}from'node:module';
const root='D:/Projects/etymolingo',here=root+'/work/etymopedia/.workflow/difficulty-prompts-20261027';
const require=createRequire(import.meta.url);const api=require(root+'/app/shared/explorer-difficulty-v2.js');
const context={window:{}};vm.createContext(context);
for(const name of ['weblio-learning-levels.js','learning-levels.js'])vm.runInContext(fs.readFileSync(root+'/app/data/generated-etymon/'+name,'utf8'),context,{timeout:5000});
const index=api.makeIndex(context.window.ETYMON_WEBLIO_LEVELS,context.window.ETYMON_LEARNING_LEVELS);
const data=JSON.parse(fs.readFileSync(here+'/image-missing-candidates.json','utf8'));
const rated=[],unclassified=[];
for(const word of data.candidates){const difficulty=api.evaluate(word,index);const row={...word,difficulty};(difficulty.level===null?unclassified:rated).push(row);}
rated.sort((a,b)=>a.difficulty.level-b.difficulty.level||a.w.localeCompare(b.w,'en')||JSON.stringify(a.p).localeCompare(JSON.stringify(b.p),'en')||a.filename.localeCompare(b.filename,'en'));
const distribution={};for(const word of rated)distribution[word.difficulty.level]=(distribution[word.difficulty.level]||0)+1;
const sourceFiles=['app/shared/explorer-difficulty-v2.js','app/data/generated-etymon/weblio-learning-levels.js','app/data/generated-etymon/learning-levels.js'];
const result={schema:1,ranked_count:rated.length,unclassified_excluded:unclassified.length,distribution,difficulty_sources:sourceFiles.map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(root+'/'+path)).digest('hex')})),sort:'actual evaluate().level ascending, then English headword, ordered roots, literal filename; no rarity-only substitution',ranked:rated};
fs.writeFileSync(here+'/ranked-candidates.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,ranked:undefined}));
console.log(rated.slice(0,100).map((w,i)=>`${i+1}|${w.w}|${w.first_ja}|${w.pos}|${w.filename}|${w.difficulty.level}|${w.difficulty.basis}`).join('\n'));
