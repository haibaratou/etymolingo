'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),zlib=require('node:zlib');
const D=path.resolve(__dirname,'../../..'),formalPath=path.join(D,'app/shared/component-transport.js');
const sandbox=fs.mkdtempSync(path.join(os.tmpdir(),'component-node-reader-'));fs.copyFileSync(D+'/app/shared/component-payload-node.cjs',sandbox+'/reader.cjs');fs.copyFileSync(formalPath,sandbox+'/component-transport.js');
const {readPayload}=require(sandbox+'/reader.cjs'),formal=require(formalPath),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
process.on('exit',()=>fs.rmSync(sandbox,{recursive:true,force:true}));
function fixture(){const dir=fs.mkdtempSync(path.join(sandbox,'data-')),roots=[{key:'fixture',ja:'検証'}],rootBytes=JSON.stringify(roots)+'\n';fs.writeFileSync(dir+'/roots.json',rootBytes);
 const payload={schema:1,words:[{w:'fixture',p:['fixture']}],entities:[{id:'x'}],aliases:[],legacy_root_source:{schema:1,semantic_projection:'legacy-root-semantic-v1',reviewed_root_input_sha256:sha(JSON.stringify(roots)),root_file_sha256:sha(rootBytes),file_hash_scope:'matching_exporter_file'}};
 const body={...payload};delete body.legacy_root_source;const raw=JSON.stringify(body),value=zlib.gzipSync(raw,{mtime:0}).toString('base64'),encoded_sha256=sha(value),file=`etymological-components-part-${encoded_sha256}.js`;
 const prefix='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(file)+']=';
 const bytes=prefix+JSON.stringify(value)+';\n';fs.writeFileSync(path.join(dir,file),bytes);
 const part={file,bytes:Buffer.byteLength(bytes),file_sha256:sha(bytes),encoded_sha256,encoded_bytes:value.length};
 const e={schema:1,encoding:'gzip-base64',body_bytes:Buffer.byteLength(raw),body_sha256:sha(raw),payload_sha256:sha(JSON.stringify(payload)),legacy_root_source:payload.legacy_root_source,counts:{words:1,entities:1},parts:[part]};
 const f={dir,roots,payload,e};pin(f);fs.writeFileSync(dir+'/etymological-components.js','/* frozen */\nglobalThis.ETYMON_ETYMOLOGICAL_COMPONENTS='+JSON.stringify({schema:1,words:['FROZEN_NOT_CURRENT']})+';\n');return f;
}
function pin(f){const raw='globalThis.ETYMON_COMPONENT_ENVELOPE='+JSON.stringify(f.e)+';\n';fs.writeFileSync(f.dir+'/etymological-components-envelope.js',raw);f.meta={file:'etymological-components-envelope.js',bytes:Buffer.byteLength(raw),sha256:sha(raw),envelope_sha256:sha(JSON.stringify(f.e)),body_sha256:f.e.body_sha256,payload_sha256:f.e.payload_sha256,parts:f.e.parts,transport_schema:1};saveMeta(f);}
function saveMeta(f){fs.writeFileSync(f.dir+'/manifest.json',JSON.stringify({files:{etymological_components:f.meta}}));}
async function formalRead(f){return formal.decode(f.e,{expectedEnvelopeSHA256:f.meta.envelope_sha256,roots:f.roots,expectedRootFileSHA256:sha(fs.readFileSync(f.dir+'/roots.json')),readPart:async p=>{const bytes=fs.readFileSync(path.join(f.dir,p.file));if(bytes.length!==p.bytes||sha(bytes)!==p.file_sha256)throw Error('transport_file_hash');const text=bytes.toString('utf8'),prefix='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(p.file)+']=';if(!text.startsWith(prefix)||!text.endsWith(';\n'))throw Error('transport_wrapper');return JSON.parse(text.slice(prefix.length,-2));}});}
test('new transport matches formal decode, current payload wins over frozen monolith',async()=>{const f=fixture();assert.deepEqual(readPayload(f.dir),f.payload);assert.deepEqual(readPayload(f.dir),await formalRead(f));});
for(const [name,mutate] of [
 ['envelope schema',f=>f.e.schema=2],['unexpected envelope field',f=>f.e.extra=true],['part path traversal',f=>f.e.parts[0].file='../private.js'],['duplicate part',f=>f.e.parts.push({...f.e.parts[0]})],['bad encoded digest',f=>f.e.parts[0].encoded_sha256='0'.repeat(64)],['invalid counts',f=>f.e.counts.words=-1],['counts mismatch',f=>f.e.counts.words=9],['root projection mismatch',f=>f.e.legacy_root_source.reviewed_root_input_sha256='0'.repeat(64)],['root file mismatch',f=>f.e.legacy_root_source.root_file_sha256='0'.repeat(64)],['body hash',f=>f.e.body_sha256='0'.repeat(64)],['payload hash',f=>f.e.payload_sha256='0'.repeat(64)],['expansion over declared size',f=>f.e.body_bytes--],['invalid maximum body size',f=>f.e.body_bytes=65*1024*1024],['part file hash',f=>f.e.parts[0].file_sha256='0'.repeat(64)]])test('sync/formal both reject '+name,async()=>{const f=fixture();mutate(f);pin(f);assert.throws(()=>readPayload(f.dir));await assert.rejects(()=>formalRead(f));});
for(const [name,mutate] of [
 ['unknown manifest schema',f=>{f.meta.transport_schema=2;saveMeta(f)}],['manifest envelope traversal',f=>{f.meta.file='../private.js';saveMeta(f)}],['manifest envelope hash',f=>{f.meta.sha256='0'.repeat(64);saveMeta(f)}],['manifest parts mismatch',f=>{f.meta.parts=[];saveMeta(f)}],['missing envelope',f=>fs.unlinkSync(f.dir+'/etymological-components-envelope.js')],['missing part',f=>fs.unlinkSync(path.join(f.dir,f.e.parts[0].file))],['malformed manifest',f=>fs.writeFileSync(f.dir+'/manifest.json','{')],['new wrapper executable tail',f=>{fs.appendFileSync(f.dir+'/etymological-components-envelope.js','globalThis.PWNED=1;');}],['wrong roots argument',f=>f.options={roots:[{key:'changed'}]}]])test('reader fails closed without legacy fallback: '+name,()=>{const f=fixture();mutate(f);assert.throws(()=>readPayload(f.dir,f.options));assert.equal(global.PWNED,undefined);});
test('declared transport cannot be bypassed by explicit legacy mode',()=>{const f=fixture();assert.throws(()=>readPayload(f.dir,{mode:'legacy'}),/legacy_override/);});
test('old manifest remains supported with strict legacy JSON wrapper and file hash',()=>{const f=fixture(),raw=fs.readFileSync(f.dir+'/etymological-components.js');f.meta={file:'etymological-components.js',bytes:raw.length,sha256:sha(raw)};saveMeta(f);assert.deepEqual(readPayload(f.dir),{schema:1,words:['FROZEN_NOT_CURRENT']});});
test('manifest-free old fixture requires explicit legacy mode',()=>{const f=fixture();fs.unlinkSync(f.dir+'/manifest.json');assert.throws(()=>readPayload(f.dir),/manifest_missing/);assert.equal(readPayload(f.dir,{mode:'legacy'}).schema,1);});
test('legacy wrapper rejects executable code and never executes data',()=>{const f=fixture();fs.unlinkSync(f.dir+'/manifest.json');fs.writeFileSync(f.dir+'/etymological-components.js','globalThis.ETYMON_ETYMOLOGICAL_COMPONENTS={};globalThis.PWNED=1;\n');assert.throws(()=>readPayload(f.dir,{mode:'legacy'}));assert.equal(global.PWNED,undefined);});
test('Node reader is synchronous, keeping contextFor caller API unchanged',()=>{const f=fixture();assert.equal(typeof readPayload(f.dir).then,'undefined');});
test('existing generated full transport: sync/formal payload parity without reading frozen monolith',{skip:!process.env.ETYMON_TRANSPORT_FIXTURE},async()=>{
 const dir=process.env.ETYMON_TRANSPORT_FIXTURE,meta=JSON.parse(fs.readFileSync(dir+'/manifest.json')).files.etymological_components;
 const text=fs.readFileSync(dir+'/'+meta.file,'utf8'),e=JSON.parse(text.slice('globalThis.ETYMON_COMPONENT_ENVELOPE='.length,-2));
 const roots=JSON.parse(fs.readFileSync(dir+'/roots.json')),f={dir,e,meta,roots};
 const sync=readPayload(dir),asyncPayload=await formalRead(f);assert.equal(sha(JSON.stringify(sync)),meta.payload_sha256);assert.deepEqual(sync,asyncPayload);
});
function repackCompressed(f,edit){
 const old=f.e.parts[0],text=fs.readFileSync(path.join(f.dir,old.file),'utf8'),prefix='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(old.file)+']=';
 const compressed=edit(Buffer.from(JSON.parse(text.slice(prefix.length,-2)),'base64')),encoded=compressed.toString('base64'),digest=sha(encoded),file=`etymological-components-part-${digest}.js`;
 const raw='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(file)+']='+JSON.stringify(encoded)+';\n';fs.writeFileSync(path.join(f.dir,file),raw);
 f.e.parts=[{file,bytes:Buffer.byteLength(raw),file_sha256:sha(raw),encoded_sha256:digest,encoded_bytes:encoded.length}];pin(f);
}
for(const [name,tail] of [['junk',Buffer.from('JUNK')],['zero padding',Buffer.alloc(8)],['extra empty member',zlib.gzipSync(Buffer.alloc(0))]])test('repinned '+name+' cannot bypass single gzip member policy',async()=>{const f=fixture();repackCompressed(f,b=>Buffer.concat([b,tail]));assert.throws(()=>readPayload(f.dir),/transport_gzip_trailing_data/);await assert.rejects(()=>formalRead(f));});
test('single member optional filename remains a valid gzip stream',async()=>{const f=fixture();repackCompressed(f,b=>{const h=Buffer.from(b.subarray(0,10));h[3]|=8;return Buffer.concat([h,Buffer.from('fixture.json\0'),b.subarray(10)]);});assert.deepEqual(readPayload(f.dir),await formalRead(f));});
test('single member optional extra field remains a valid gzip stream',async()=>{const f=fixture();repackCompressed(f,b=>{const h=Buffer.from(b.subarray(0,10));h[3]|=4;return Buffer.concat([h,Buffer.from([3,0,1,2,3]),b.subarray(10)]);});assert.deepEqual(readPayload(f.dir),await formalRead(f));});
test('repinned CRC corruption remains rejected after single-member hardening',async()=>{const f=fixture();repackCompressed(f,b=>{const bad=Buffer.from(b);bad[bad.length-8]^=1;return bad;});assert.throws(()=>readPayload(f.dir));await assert.rejects(()=>formalRead(f));});

test('repinned envelope whitespace cannot bypass exact raw JSON hash',()=>{
 const f=fixture(),file=path.join(f.dir,f.meta.file),text=fs.readFileSync(file,'utf8');
 const changed=text.replace('={','= {');fs.writeFileSync(file,changed);
 f.meta.bytes=Buffer.byteLength(changed);f.meta.sha256=sha(changed);saveMeta(f);
 // Canonical object hash is unchanged; Python-compatible raw byte pin must still reject.
 assert.equal(sha(JSON.stringify(f.e)),f.meta.envelope_sha256);
 assert.throws(()=>readPayload(f.dir),/transport_envelope_raw_hash/);
});
