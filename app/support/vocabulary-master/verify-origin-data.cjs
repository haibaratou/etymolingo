/* Read-only integration check. Reads public files and the existing HTML
   fallback only; never reads canonical app/data/pie or regenerates production. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const api=require('../../shared/etymology-origins.js');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const inputs=new Map();
function read(relative){const p=path.join(root,relative),data=fs.readFileSync(p);inputs.set(relative,hash(data));return data.toString('utf8');}
function classic(relative,globalName){const context={};vm.createContext(context);vm.runInContext(read(relative),context);if(!context[globalName])throw Error('Missing '+globalName);return context[globalName];}
const words=JSON.parse(read('app/data/generated-etymon/words.json'));
const parts=JSON.parse(read('app/data/generated-etymon/word-parts.json'));
const payload=classic('app/data/generated-etymon/etymology-origins.js','ETYMON_ETYMOLOGY_ORIGINS');
const supplement=classic('app/data/generated-etymon/word-parts-supplement.js','ETYMON_WORD_PARTS_SUPPLEMENT');
const html=read('app/vocabulary-master.html');
read('app/shared/etymology-origins.js');
const match=html.match(/<script id="pieData"[^>]*>([\s\S]*?)<\/script>/);
if(!match)throw Error('Existing compressed fallback missing');
const packed=JSON.parse(zlib.gunzipSync(Buffer.from(match[1].trim(),'base64')));
const prepared=api.prepare(payload);
const protectedHash=rows=>hash(JSON.stringify(rows.map(({origin_families,origin_languages,...rest})=>rest)));
const protectedBefore=protectedHash(words),currentOrigins=api.bind(words,prepared),fileOrigins=api.bind(packed.words,prepared);
const protectedAfter=protectedHash(words);
const currentPartsBefore=JSON.stringify(parts),filePartsBefore={...(packed.word_parts||{})};
const currentPartsResult=api.bindWordParts(words,parts,supplement);
const fileParts={...filePartsBefore},filePartsResult=api.bindWordParts(packed.words,fileParts,supplement);
const count=object=>Object.values(object).filter(value=>typeof value==='string'&&value.trim()).length;
const result={validation_status:'passed',classification_complete:currentOrigins.unclassified===0,
 inputs_sha256:Object.fromEntries(inputs),
 origin_tags:{metadata_languages:prepared.languages.size,payload_rows:payload.entries.length,usable_identities:prepared.entries.size,
  current_http_binding:currentOrigins,file_fallback_binding:fileOrigins,
  held_duplicate_identities:[...prepared.ambiguous].map(JSON.parse),
  unrelated_word_fields_preserved:protectedBefore===protectedAfter,
  protected_words_before_sha256:protectedBefore,protected_words_after_sha256:protectedAfter,
  visible_family_count:api.availableFamilies(words).length,visible_language_count:api.availableLanguages(words,prepared).length},
 word_parts:{supplement_entries:supplement.entries.length,current_http_binding:currentPartsResult,file_fallback_binding:filePartsResult,
  current_http_parts_unchanged:JSON.stringify(parts)===currentPartsBefore,
  packed_parts_before:count(filePartsBefore),packed_parts_after:count(fileParts),
  existing_packed_parts_preserved:Object.entries(filePartsBefore).every(([key,value])=>fileParts[key]===value)},
 limitations:['No browser rendering or layout pass is implied.','Coverage counts do not mean all etymologies have received a human linguistic review.']};
if(protectedBefore!==protectedAfter||!result.word_parts.current_http_parts_unchanged||!result.word_parts.existing_packed_parts_preserved)throw Error('Protected data changed in runtime binding');
for(const [relative,expected] of inputs)if(hash(fs.readFileSync(path.join(root,relative)))!==expected)throw Error('Concurrent input change: '+relative);
const output=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'work/etymology-two-tier-20261028/ui/runtime-contract-report.json');
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
