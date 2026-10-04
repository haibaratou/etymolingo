// Compatibility command for dictionary links. The schema2 catalog is the only
// source of row identity, readings, image binding and language availability.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const output=`// Generated compatibility view. Load before or after catalog.js; never copy stale rows into the game.
((root) => {
  'use strict';
  Object.defineProperty(root, 'PICTURE_WORDS_DICTIONARY_LINKS', {
    configurable: true,
    get() {
      const meta = root.PICTURE_WORDS_CATALOG_META, rows = root.PICTURE_WORDS_CATALOG;
      if (meta?.schema !== 2 || !Array.isArray(rows)) return Object.freeze([]);
      return Object.freeze(rows.filter(row => row.bindingStatus === 'bound'));
    }
  });
})(window);
`;
function validateCatalog(base=root) {
 const context={window:{}};
 for(const relative of ['app/games/picture-words/catalog.js','app/eigo-no-e/data.js'])vm.runInNewContext(fs.readFileSync(path.join(base,relative),'utf8'),context,{filename:relative});
 const {PICTURE_WORDS_CATALOG:rows,PICTURE_WORDS_CATALOG_META:meta,EIGO_NO_E:dictionary}=context.window;
 if(meta?.schema!==2 || dictionary?.schema!==4 || !Array.isArray(rows) || !Array.isArray(dictionary.words))throw Error('Refresh the common schema2/schema4 catalogs before validating dictionary links');
 const sources={words_sha256:meta.sourceWordsSha256,scenes_sha256:meta.scenesSha256,illustration_index_sha256:meta.indexSha256};
 for(const [key,hash] of Object.entries(sources))if(!/^[0-9a-f]{64}$/.test(hash||'')||dictionary.sources?.[key]!==hash)throw Error('Mismatched catalog provenance: '+key);
 for(const [key,file] of [['sourceWordsSha256','app/data/generated-etymon/words.json'],['scenesSha256','app/data/generated-etymon/illustration-scenes.json'],['indexSha256','assets/word/illustration-index.js']])if(crypto.createHash('sha256').update(fs.readFileSync(path.join(base,file))).digest('hex')!==meta[key])throw Error('Stale catalog input: '+file);
 const official=new Map(dictionary.words.map(w=>[w.id,w])),ids=new Set();
 if(official.size!==dictionary.words.length || rows.length!==meta.count)throw Error('Duplicate or incomplete dictionary identities');
 for(const row of rows){
  if(ids.has(row.id))throw Error('Duplicate game ID: '+row.id);ids.add(row.id);
  const word=official.get(row.id);
  if(!word || row.en!==word.w || row.pic!==word.art || row.image?.path!==word.image?.path || row.image?.sha256!==word.image?.sha256 || row.image?.git_blob_sha!==word.image?.git_blob_sha || JSON.stringify(row.availability)!==JSON.stringify(word.availability) || JSON.stringify(row.description)!==JSON.stringify(word.description))throw Error('Mismatched exact dictionary identity: '+row.id);
 }
 return {rows:rows.length,links:rows.filter(row=>row.bindingStatus==='bound').length};
}
function main(args=process.argv.slice(2)) {
 if(args.some(arg=>arg!=='--check'))throw Error('Usage: node build-dictionary-links.cjs [--check]');
 const counts=validateCatalog(),dest=path.join(__dirname,'dictionary-links.js');
 if(args.includes('--check')){if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==output)throw Error('Compatibility view is stale; run build-dictionary-links.cjs');}
 else fs.writeFileSync(dest,output);
 console.log(`${counts.links} current exact dictionary identities; ${counts.rows} catalog images; no copied rows or added packs`);
}
if(require.main===module){try{main();}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={output,validateCatalog,main};
