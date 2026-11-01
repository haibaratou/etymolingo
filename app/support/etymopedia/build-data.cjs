/* Public projection only. Private input is read-only and must be explicitly supplied.
 * node app/support/etymopedia/build-data.cjs --input-dir /private/verified-generated-runtime
 * node app/support/etymopedia/build-data.cjs --check
 * Preserve the existing page's identity/layout selection and public pronunciation.
 * Never fall back to the shared (possibly older) dictionary or export audit records.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const key=w=>JSON.stringify([w.w,w.p||[]]);
const wordFields=['w','p','ja','en','pos','g','r','b','phonetic','origin_languages'];
const rootFields=['key','ja','d','definition_reviewed'];
function csv(text){
 const rows=[];let row=[],cur='',q=false;text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}else if(c==='"')q=true;else if(c===','){row.push(cur);cur='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cur);if(row.length>1||row[0])rows.push(row);row=[];cur='';}else cur+=c;}
 if(cur||row.length){row.push(cur);rows.push(row);}
 const head=rows.shift();return rows.filter(r=>r.length>1).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]||''])));
}

function decode(script){const m=script.match(/globalThis\.ETYMOPEDIA_CURRENT_DATA=(\{.*\});\s*$/);if(!m)throw Error('Invalid projection script');const envelope=JSON.parse(m[1]);const raw=zlib.gunzipSync(Buffer.from(envelope.data,'base64'));if(hash(raw)!==envelope.sha256)throw Error('Projection checksum mismatch');return JSON.parse(raw);}
function validate(data){
 if(data.schema!==1||!Array.isArray(data.words)||!Array.isArray(data.roots))throw Error('Invalid projection');
 const top=['schema','source','layoutSha256','wordsSha256','rootsSha256','canonicalWordCount','words','roots'];
 if(Object.keys(data).some(k=>!top.includes(k)))throw Error('Non-public top-level field');
 if(data.source!=='app/data/generated-etymon/'||!Number.isInteger(data.canonicalWordCount)||!['wordsSha256','rootsSha256'].every(k=>/^[a-f0-9]{64}$/.test(data[k])))throw Error('Invalid metadata');
 if(!data.layoutSha256||Object.keys(data.layoutSha256).some(k=>!['words.csv','lexicon.csv','roots.csv'].includes(k))||Object.values(data.layoutSha256).some(v=>!Array.isArray(v)||v.some(h=>typeof h!=='string'||!/^[a-f0-9]{64}$/.test(h))))throw Error('Invalid layout hashes');
 for(const [rows,fields]of[[data.words,wordFields],[data.roots,rootFields]])for(const row of rows)if(Object.keys(row).some(k=>!fields.includes(k)))throw Error('Non-public field');
 for(const w of data.words){for(const k of wordFields.filter(k=>!['p','r','origin_languages'].includes(k)))if(typeof w[k]!=='string')throw Error('Invalid public text '+k);if(!Array.isArray(w.origin_languages)||w.origin_languages.some(x=>typeof x!=='string'||x.length>60))throw Error('Invalid origin language labels');if(!Array.isArray(w.p)||w.p.some(p=>typeof p!=='string')||!(typeof w.r==='number'||w.r===''))throw Error('Invalid word identity/rank');}
 for(const r of data.roots){if(typeof r.definition_reviewed!=='boolean'||['key','ja','d'].some(k=>typeof r[k]!=='string'))throw Error('Invalid public root');}
}
function project(old,dir){const read=f=>fs.readFileSync(path.join(dir,f));const wb=read('words.json'),rb=read('roots.json');const words=JSON.parse(wb),roots=JSON.parse(rb);const wanted=new Set(old.words.map(key)),rootKeys=new Set(old.roots.map(r=>r.key)),previous=new Map();for(const row of old.words){const k=key(row);previous.set(k,previous.has(k)?null:row);}const out={schema:1,source:'app/data/generated-etymon/',layoutSha256:old.layoutSha256,wordsSha256:hash(wb),rootsSha256:hash(rb),canonicalWordCount:words.length,words:[],roots:[]};
for(const w of words){if(!wanted.has(key(w)))continue;const row=Object.fromEntries(['w','p','ja','en','pos','g','r','b'].map(k=>[k,w[k]??(k==='p'?[]:'')]));row.phonetic=previous.get(key(w))?.phonetic||'';row.origin_languages=Array.isArray(w.origin_languages)?[...new Set(w.origin_languages)]:[];out.words.push(row);}
for(const r of roots)if(rootKeys.has(r.key))out.roots.push({key:r.key,ja:r.ja||'',d:r.d||'',definition_reviewed:r.editorial_summary_reviewed===true});
if(JSON.stringify(out.words.map(key).sort())!==JSON.stringify(old.words.map(key).sort())||JSON.stringify(out.roots.map(r=>r.key).sort())!==JSON.stringify(old.roots.map(r=>r.key).sort()))throw Error('Layout identity change requires separate review');validate(out);if(!wb.equals(read('words.json'))||!rb.equals(read('roots.json')))throw Error('Input changed during build');return out;}
function encode(data){const raw=Buffer.from(JSON.stringify(data));return '/* Generated public Etymopedia projection; no original quotations, audit prose, artwork or saved selections. */\nglobalThis.ETYMOPEDIA_CURRENT_DATA='+JSON.stringify({schema:1,encoding:'gzip-base64',sha256:hash(raw),data:zlib.gzipSync(raw,{level:9}).toString('base64')})+';\n';}
function main(){const args=process.argv.slice(2),check=args.includes('--check'),i=args.indexOf('--input-dir');if(args.some((a,j)=>a!=='--check'&&a!=='--input-dir'&&j!==i+1))throw Error('Unknown argument');const dir=i<0?null:args[i+1];if(i>=0&&!dir)throw Error('Missing input directory');if(!check&&!dir)throw Error('Explicit --input-dir is required; shared dictionary fallback is disabled');const target=path.join(__dirname,'current-data.js'),htmlPath=path.resolve(__dirname,'../../etymopedia.html');const original=fs.readFileSync(target,'utf8'),old=decode(original);if(!dir)validate(old);const data=dir?project(old,path.resolve(dir)):old;const script=dir?encode(data):original;let html=fs.readFileSync(htmlPath,'utf8'),updated=html;for(const name of ['current-data.js','learning-levels.js']){const digest=hash(name==='current-data.js'?script:fs.readFileSync(path.join(__dirname,name))).slice(0,12);const pattern=new RegExp('(support/etymopedia/'+name.replace('.','\\.')+'\\?v=)[^"\\s]+','g');let n=0;updated=updated.replace(pattern,(_,prefix)=>{n++;return prefix+digest});if(n!==1)throw Error('Missing or duplicate dependency '+name);}
if(check){if(script!==original||html!==updated)throw Error('Projection/references stale');}else{fs.writeFileSync(target+'.tmp',script);fs.renameSync(target+'.tmp',target);fs.writeFileSync(htmlPath+'.tmp',updated);fs.renameSync(htmlPath+'.tmp',htmlPath);}console.log(JSON.stringify({check,projectedWords:data.words.length,roots:data.roots.length,wordsSha256:data.wordsSha256,bytes:Buffer.byteLength(script)}));}
if(require.main===module)main();module.exports={csv,decode,validate,project,encode};
