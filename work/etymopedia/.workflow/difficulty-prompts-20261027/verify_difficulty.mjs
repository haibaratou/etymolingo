import fs from 'node:fs';import vm from 'node:vm';import{createRequire}from'node:module';
const root='D:/Projects/etymolingo',dir=root+'/work/etymopedia/.workflow/difficulty-prompts-20261027';
const require=createRequire(import.meta.url),api=require(root+'/app/shared/explorer-difficulty-v2.js');
const ctx={window:{}};vm.createContext(ctx);
for(const name of['weblio-learning-levels.js','learning-levels.js'])vm.runInContext(fs.readFileSync(root+'/app/data/generated-etymon/'+name,'utf8'),ctx);
const index=api.makeIndex(ctx.window.ETYMON_WEBLIO_LEVELS,ctx.window.ETYMON_LEARNING_LEVELS);
const ranked=JSON.parse(fs.readFileSync(dir+'/ranked-candidates.json','utf8'));
const selected=JSON.parse(fs.readFileSync(dir+'/final-selection.json','utf8'));
const mismatches=[];let previous=0;
for(const row of selected.selection){
 const word=ranked.ranked[row.candidate_rank-1],actual=api.evaluate(word,index);
 if(JSON.stringify(actual)!==JSON.stringify(row.difficulty)||actual.level===null||actual.level<previous)mismatches.push({rank:row.candidate_rank,actual,recorded:row.difficulty});
 previous=actual.level;
}
const result={csv_sha256:selected.csv_sha256,checked:selected.selection.length,method:'Fresh call to current explorer-difficulty-v2.js evaluate() for every selected word using the current Weblio/CEFR-J indexes',mismatches};
fs.writeFileSync(dir+'/difficulty-verification.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));if(mismatches.length)process.exitCode=1;
