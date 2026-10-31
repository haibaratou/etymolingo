'use strict';
// Node-only reader. A declared transport is authoritative: errors never revive the frozen legacy file.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,code)=>{if(!ok)throw Error(code);};
const ENVELOPE='etymological-components-envelope.js',LEGACY='etymological-components.js';
function bounded(file,max){check(fs.statSync(file).size<=max,'transport_file_limit');const raw=fs.readFileSync(file);check(raw.length<=max,'transport_file_limit');return raw;}
function unwrap(raw,prefix){const text=new TextDecoder('utf-8',{fatal:true}).decode(raw);check(text.startsWith(prefix)&&text.endsWith(';\n'),'transport_wrapper');return JSON.parse(text.slice(prefix.length,-2));}
// gunzipSync accepts concatenated members and zero padding, unlike formal decode/Python.
// Measure the first deflate stream so exactly one gzip trailer must end the file.
function singleGzip(compressed,maxOutputLength){
 check(compressed.length>=18&&compressed[0]===31&&compressed[1]===139&&compressed[2]===8
   &&(compressed[3]&0xe0)===0,'transport_gzip_header');
 const flags=compressed[3];let start=10;
 if(flags&4){check(start+2<=compressed.length-8,'transport_gzip_header');const n=compressed.readUInt16LE(start);start+=2+n;}
 for(const flag of [8,16])if(flags&flag){
  check(start<compressed.length-8,'transport_gzip_header');const end=compressed.indexOf(0,start);
  check(end>=start&&end<compressed.length-8,'transport_gzip_header');start=end+1;
 }
 if(flags&2)start+=2;
 check(start<compressed.length-8,'transport_gzip_header');
 const first=zlib.inflateRawSync(compressed.subarray(start),{maxOutputLength,info:true});
 check(start+first.engine.bytesWritten+8===compressed.length,'transport_gzip_trailing_data');
 // Retain gunzip's header/trailer CRC/ISIZE validation; the expansion remains bounded.
 return zlib.gunzipSync(compressed,{maxOutputLength});
}
function readPayload(directory,{roots,rootsPath=path.join(directory,'roots.json'),mode='manifest'}={}){
 check(mode==='manifest'||mode==='legacy','transport_mode');
 const manifestPath=path.join(directory,'manifest.json');
 const manifest=fs.existsSync(manifestPath)?JSON.parse(bounded(manifestPath,2*1024*1024).toString('utf8')):null;
 check(manifest||mode==='legacy','transport_manifest_missing');
 const meta=manifest?.files?.etymological_components;
 if(meta&&Object.hasOwn(meta,'transport_schema')){
  check(meta.transport_schema===1,'unknown_transport_schema');
  check(mode!=='legacy','transport_legacy_override');
  check(meta.file===ENVELOPE,'transport_manifest_file');
  const raw=bounded(path.join(directory,ENVELOPE),128*1024);
  check(raw.length===meta.bytes&&sha(raw)===meta.sha256,'transport_manifest_hash');
  const envelopePrefix='globalThis.ETYMON_COMPONENT_ENVELOPE=';
  const e=unwrap(raw,envelopePrefix);
  // Pin exact producer bytes as Python does, in addition to the formal object hash.
  check(sha(raw.subarray(Buffer.byteLength(envelopePrefix),-2))===meta.envelope_sha256,'transport_envelope_raw_hash');
  // Reuse the formal browser decoder's exact envelope, part-name and bounds schema.
  require('./component-transport.js').schema(e);
  check(sha(JSON.stringify(e))===meta.envelope_sha256,'transport_envelope_hash');
  check(meta.body_sha256===e.body_sha256&&meta.payload_sha256===e.payload_sha256
    &&JSON.stringify(meta.parts)===JSON.stringify(e.parts),'transport_manifest_metadata');
  const rootBytes=bounded(rootsPath,16*1024*1024),fileRoots=JSON.parse(rootBytes.toString('utf8'));
  const r=roots===undefined?fileRoots:roots;
  check(Array.isArray(r)&&r.length>0&&sha(JSON.stringify(r))===e.legacy_root_source.reviewed_root_input_sha256,'transport_root_input');
  check(sha(rootBytes)===e.legacy_root_source.root_file_sha256,'transport_root_file');
  const pieces=e.parts.map(part=>{
   const bytes=bounded(path.join(directory,part.file),part.bytes);
   check(bytes.length===part.bytes&&sha(bytes)===part.file_sha256,'transport_file_hash');
   const prefix='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(part.file)+']=';
   const value=unwrap(bytes,prefix);
   check(typeof value==='string'&&value.length===part.encoded_bytes&&/^[A-Za-z0-9+/]*={0,2}$/.test(value)&&sha(value)===part.encoded_sha256,'transport_encoded_hash');return value;
  });
  const encoded=pieces.join(''),compressed=Buffer.from(encoded,'base64');
  check(compressed.toString('base64')===encoded,'transport_base64');
  const bodyBytes=singleGzip(compressed,e.body_bytes);
  check(bodyBytes.length===e.body_bytes&&sha(bodyBytes)===e.body_sha256,'transport_body_hash');
  const body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bodyBytes));
  check(body&&typeof body==='object'&&!Object.hasOwn(body,'legacy_root_source')&&Array.isArray(body.words)&&body.entities
    &&body.words.length===e.counts.words&&Object.keys(body.entities).length===e.counts.entities,'transport_payload_counts');
  body.legacy_root_source=e.legacy_root_source;
  check(sha(JSON.stringify(body))===e.payload_sha256,'transport_payload_hash');return body;
 }
 check(mode==='legacy'||(meta&&meta.file===LEGACY),'transport_legacy_not_declared');
 const raw=bounded(path.join(directory,LEGACY),64*1024*1024);
 if(meta){check(raw.length===meta.bytes&&sha(raw)===meta.sha256,'legacy_manifest_hash');}
 const text=new TextDecoder('utf-8',{fatal:true}).decode(raw);
 const prefix='globalThis.ETYMON_ETYMOLOGICAL_COMPONENTS=';
 const withoutComment=text.replace(/^\/\*[\s\S]*?\*\/\s*/,'');
 check(withoutComment.startsWith(prefix)&&withoutComment.endsWith(';\n'),'legacy_wrapper');
 return JSON.parse(withoutComment.slice(prefix.length,-2));
}
module.exports={readPayload};
