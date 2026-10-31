/* Reassemble an already-reviewed development payload; never a product-profile filter. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymonComponentTransport=api;})(globalThis,function(){
'use strict';
const CAP=3*1024*1024,MAX_BODY=64*1024*1024;
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const hex=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const assert=(ok,code)=>{if(!ok)throw Error(code);};
const bytes=s=>new TextEncoder().encode(s);
async function digest(b){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('');}
const jsonHash=v=>digest(bytes(JSON.stringify(v)));
function schema(e){
 assert(exact(e,['schema','encoding','body_bytes','body_sha256','payload_sha256','legacy_root_source','counts','parts'])&&e.schema===1&&e.encoding==='gzip-base64','transport_schema');
 assert(Number.isSafeInteger(e.body_bytes)&&e.body_bytes>0&&e.body_bytes<=MAX_BODY&&hex(e.body_sha256)&&hex(e.payload_sha256),'transport_bounds');
 assert(exact(e.counts,['words','entities'])&&Object.values(e.counts).every(x=>Number.isSafeInteger(x)&&x>=0),'transport_counts');
 assert(exact(e.legacy_root_source,['schema','semantic_projection','reviewed_root_input_sha256','root_file_sha256','file_hash_scope'])&&e.legacy_root_source.schema===1&&e.legacy_root_source.semantic_projection==='legacy-root-semantic-v1'&&hex(e.legacy_root_source.reviewed_root_input_sha256)&&hex(e.legacy_root_source.root_file_sha256)&&e.legacy_root_source.file_hash_scope==='matching_exporter_file','transport_root_source');
 assert(Array.isArray(e.parts)&&e.parts.length>0&&e.parts.length<=64,'transport_parts');const seen=new Set();
 for(const p of e.parts){assert(exact(p,['file','bytes','file_sha256','encoded_sha256','encoded_bytes'])&&/^etymological-components-part-[a-f0-9]{64}\.js$/.test(p.file)&&!seen.has(p.file),'transport_part_name');seen.add(p.file);assert(hex(p.file_sha256)&&hex(p.encoded_sha256)&&p.file===`etymological-components-part-${p.encoded_sha256}.js`,'transport_part_hash');assert(Number.isSafeInteger(p.bytes)&&p.bytes>0&&p.bytes<=CAP+512&&Number.isSafeInteger(p.encoded_bytes)&&p.encoded_bytes>0&&p.encoded_bytes<=CAP,'transport_part_size');}
}
async function defaultRead(p,baseURL){
 const url=new URL(p.file,new URL(baseURL,location.href));assert(url.protocol===location.protocol&&url.origin===location.origin,'transport_origin');
 if(location.protocol!=='file:'){
  const response=await fetch(url.href,{cache:'force-cache'});assert(response.ok,'transport_fetch');// Count decoded stream bytes, not Content-Length (HTTP content-encoding can compress it).
  const reader=response.body.getReader(),pieces=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;assert(size<=p.bytes,'transport_file_hash');pieces.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const raw=new Uint8Array(size);let offset=0;for(const piece of pieces){raw.set(piece,offset);offset+=piece.length;}assert(raw.length===p.bytes&&await digest(raw)===p.file_sha256,'transport_file_hash');
  const text=new TextDecoder('utf-8',{fatal:true}).decode(raw),prefix='globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(p.file)+']=';
  assert(text.startsWith(prefix)&&text.endsWith(';\n'),'transport_wrapper');return JSON.parse(text.slice(prefix.length,-2));
 }
 // file:// has opaque origins: browser SRI/CORS cannot authorize sibling files.
 // Trust the local application bundle (as with its other scripts), not arbitrary downloaded JS.
 // Validate canonical data-wrapper bytes and all payload hashes before consuming data;
 // unlike HTTP this cannot authenticate executable local code before execution.
 if(!Object.hasOwn(globalThis.ETYMON_COMPONENT_PARTS||{},p.file))await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url.href;script.onload=resolve;script.onerror=()=>reject(Error('transport_file_load'));document.head.append(script);});
 const value=globalThis.ETYMON_COMPONENT_PARTS?.[p.file];
 assert(typeof value==='string'&&value.length===p.encoded_bytes,'transport_encoded_hash');
 const canonical=bytes('globalThis.ETYMON_COMPONENT_PARTS=globalThis.ETYMON_COMPONENT_PARTS||{};globalThis.ETYMON_COMPONENT_PARTS['+JSON.stringify(p.file)+']='+JSON.stringify(value)+';\n');
 assert(canonical.length===p.bytes&&await digest(canonical)===p.file_sha256,'transport_file_hash');return value;
}
// Validate one complete RFC1951 stream inside one RFC1952 member before platform
// decompression. DecompressionStream implementations differ on concatenated members.
// This scanner emits no text; CRC/header-CRC validation still belongs to the decoder.
function assertSingleGzipMember(input,expectedBytes){
 const fail=()=>{throw Error('transport_gzip_boundary');};
 if(input.length<18||input[0]!==31||input[1]!==139||input[2]!==8||(input[3]&224))fail();
 const flags=input[3];let start=10;
 if(flags&4){if(start+2>input.length-8)fail();start+=2+input[start]+256*input[start+1];}
 for(const flag of [8,16])if(flags&flag){
  if(start>=input.length-8)fail();while(start<input.length-8&&input[start]!==0)start++;
  if(start>=input.length-8)fail();start++;
 }
 if(flags&2)start+=2;
 if(start>=input.length-8)fail();
 let bit=start*8,produced=0;
 const limit=(input.length-8)*8;
 function read(n){if(bit+n>limit)fail();let value=0;for(let i=0;i<n;i++,bit++)value|=((input[bit>>>3]>>>(bit&7))&1)<<i;return value;}
 function tree(lengths){
  const count=new Uint16Array(16),next=new Uint16Array(16),codes=Array.from({length:16},()=>new Map());let max=0;
  for(const n of lengths){if(!Number.isInteger(n)||n<0||n>15)fail();if(n){count[n]++;max=Math.max(max,n);}}
  let available=1,code=0;
  for(let n=1;n<=15;n++){available=available*2-count[n];if(available<0)fail();code=(code+count[n-1])*2;next[n]=code;}
  lengths.forEach((n,symbol)=>{if(n)codes[n].set(next[n]++,symbol);});return {codes,max};
 }
 function symbol(t){let code=0;for(let n=1;n<=t.max;n++){code=code*2+read(1);const value=t.codes[n].get(code);if(value!==undefined)return value;}fail();}
 const fixedLengths=Array.from({length:288},(_,n)=>n<144?8:n<256?9:n<280?7:8);
 const fixedLit=tree(fixedLengths),fixedDist=tree(Array(32).fill(5));
 const lengthBase=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
 const lengthExtra=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 const distanceBase=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
 const distanceExtra=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
 let last;
 do{
  last=read(1);const type=read(2);
  if(type===0){
   bit=Math.ceil(bit/8)*8;const length=read(16),inverse=read(16);if((length^inverse)!==65535)fail();
   if(bit+length*8>limit)fail();bit+=length*8;produced+=length;
  }else{
   if(type===3)fail();let literal=fixedLit,distance=fixedDist;
   if(type===2){
    const literals=read(5)+257,distances=read(5)+1,codeCount=read(4)+4;if(literals>286)fail();
    const order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],codeLengths=Array(19).fill(0);
    for(let i=0;i<codeCount;i++)codeLengths[order[i]]=read(3);
    const codeTree=tree(codeLengths),lengths=[];
    while(lengths.length<literals+distances){
     const n=symbol(codeTree);
     if(n<16)lengths.push(n);
     else{let count,value=0;if(n===16){if(!lengths.length)fail();value=lengths[lengths.length-1];count=read(2)+3;}
      else if(n===17)count=read(3)+3;else if(n===18)count=read(7)+11;else fail();
      if(lengths.length+count>literals+distances)fail();for(let i=0;i<count;i++)lengths.push(value);
     }
    }
    if(!lengths[256])fail();literal=tree(lengths.slice(0,literals));distance=tree(lengths.slice(literals));
   }
   for(;;){
    const n=symbol(literal);if(n===256)break;
    if(n<256)produced++;
    else{if(n<257||n>285)fail();const size=lengthBase[n-257]+read(lengthExtra[n-257]),d=symbol(distance);
     if(d>29)fail();const back=distanceBase[d]+read(distanceExtra[d]);if(back>produced)fail();produced+=size;
    }
    if(produced>expectedBytes)fail();
   }
  }
  if(produced>expectedBytes)fail();
 }while(!last);
 const end=Math.ceil(bit/8);
 if(end+8!==input.length||produced!==expectedBytes)fail();
 const isize=(input[end+4]+input[end+5]*256+input[end+6]*65536+input[end+7]*16777216)>>>0;
 if(isize!==produced)fail();
}

async function decode(e,{expectedEnvelopeSHA256,roots,expectedRootFileSHA256,readPart,baseURL='data/generated-etymon/'}={}){
 schema(e);assert(hex(expectedEnvelopeSHA256)&&await jsonHash(e)===expectedEnvelopeSHA256,'transport_envelope_hash');
 assert(Array.isArray(roots)&&roots.length>0&&await jsonHash(roots)===e.legacy_root_source.reviewed_root_input_sha256,'transport_root_input');
 if(expectedRootFileSHA256!==undefined)assert(hex(expectedRootFileSHA256)&&expectedRootFileSHA256===e.legacy_root_source.root_file_sha256,'transport_root_file');
 const parts=[];for(const p of e.parts){const v=await(readPart?readPart(p):defaultRead(p,baseURL));assert(typeof v==='string'&&v.length===p.encoded_bytes&&/^[A-Za-z0-9+/]*={0,2}$/.test(v)&&await digest(bytes(v))===p.encoded_sha256,'transport_encoded_hash');parts.push(v);}
 const compressed=Uint8Array.from(atob(parts.join('')),x=>x.charCodeAt(0));assertSingleGzipMember(compressed,e.body_bytes);const reader=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();let count=0;const chunks=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;count+=value.length;assert(count<=e.body_bytes,'transport_expansion');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 assert(count===e.body_bytes,'transport_body_length');const raw=new Uint8Array(count);let pos=0;for(const c of chunks){raw.set(c,pos);pos+=c.length;}assert(await digest(raw)===e.body_sha256,'transport_body_hash');const body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));assert(!Object.hasOwn(body,'legacy_root_source')&&Array.isArray(body.words)&&body.entities&&body.words.length===e.counts.words&&Object.keys(body.entities).length===e.counts.entities,'transport_payload_counts');body.legacy_root_source=e.legacy_root_source;assert(await jsonHash(body)===e.payload_sha256,'transport_payload_hash');return body;
}
async function load(options){
 // Explicit legacy mode only; never fall back after a broken new-generation envelope.
 if(options.mode==='legacy'){assert(options.legacyPayload&&options.legacyPayload.schema,'transport_legacy_missing');return options.legacyPayload;}
 assert(options.mode==='envelope','transport_mode');return decode(options.envelope,options);
}
return {decode,load,schema,jsonHash};
});
