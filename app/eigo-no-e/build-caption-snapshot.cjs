// Limited caption sidecar: no source dictionary export and no PIE reads.
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),zlib=require('zlib'),path=require('path');
const option=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
const root=path.resolve(option('--root')||path.join(__dirname,'../..'));process.chdir(root);
const reportDir=path.resolve(option('--report-dir')||path.join(root,'work/build-reports/pictpedia'));fs.mkdirSync(reportDir,{recursive:true});
const hash=(b,a='sha256')=>crypto.createHash(a).update(b).digest('hex');
const files={catalog:'app/eigo-no-e/data.js',scenes:'app/data/generated-etymon/illustration-scenes.json',index:'assets/word/illustration-index.js',manifest:'app/data/generated-etymon/manifest.json'};
const scope={window:{}};vm.runInNewContext(fs.readFileSync(files.catalog,'utf8'),scope);
const catalog=scope.window.EIGO_NO_E,scenes=JSON.parse(fs.readFileSync(files.scenes)),manifest=JSON.parse(fs.readFileSync(files.manifest));
const indexText=fs.readFileSync(files.index,'utf8'),index=JSON.parse(indexText.slice(indexText.indexOf('{'),indexText.lastIndexOf('}')+1));
if(manifest.files.words.sha256!==catalog.sources.words_sha256)throw Error('Canonical words changed: rebuild requires a reviewed word snapshot');
const after=require(path.join(root,'app/eigo-no-e/catalog-validation.js'));
const words=after.snapshotWords(catalog),key=after.sceneKey,byScene=new Map(scenes.entries.map(s=>[key(s),s]));
const checked=new Map(),currentImageHolds=[];
for(const row of catalog.words){
 const scene=byScene.get(key(row));if(!scene||scene.image?.sha256!==row.image?.sha256||scene.image?.git_blob_sha!==row.image?.git_blob_sha)continue;
 const file=row.image.path;if(checked.has(file))continue;
 const raw=fs.existsSync(file)?fs.readFileSync(file):null;
 const verified=!!raw&&hash(raw)===row.image.sha256&&hash(Buffer.concat([Buffer.from('blob '+raw.length),Buffer.from([0]),raw]),'sha1')===row.image.git_blob_sha;
 checked.set(file,verified);if(!verified)currentImageHolds.push({path:file,reason:raw?'current_image_hash_mismatch':'current_image_missing'});
}
// A failed live-file check is explicit and cannot retain an old reviewed record.
const snapshotScenes={...scenes,entries:scenes.entries.map(s=>checked.get(s.image?.path)===false?{...s,status:'stale_image',review:{...s.review,status:'stale_image'}}:s)};
const old=after.buildSnapshotCatalog(catalog),updated=after.buildCurrentCatalog(catalog,snapshotScenes,words,index);
const sources=Object.fromEntries(Object.entries(files).map(([k,f])=>[k,{path:f,sha256:hash(fs.readFileSync(f))}]));
const report={schema:1,builtAt:new Date().toISOString(),sourceHashes:sources,wordsSha256:catalog.sources.words_sha256,totalRows:catalog.words.length,beforeFile:old.description_counts,after:updated.description_counts,liveImagesChecked:checked.size,currentImageHolds,allCaptionImagesLocallyRehashed:true,prohibitedPieRead:false,representatives:updated.words.filter(w=>['balm','children','lord','real'].includes(w.w)).map(w=>({id:w.id,w:w.w,p:w.p,art:w.art,description:w.description,sense:w.sense,image:w.image}))};
const holds=updated.words.filter(w=>w.bindingStatus==='bound'&&w.description.status!=='reviewed').map(w=>({id:w.id,w:w.w,p:w.p,art:w.art,status:w.description.status,reason:w.description.reason}));
report.holdReasons={};for(const w of holds)report.holdReasons[w.reason]=(report.holdReasons[w.reason]||0)+1;
report.newCaptions=updated.words.filter(w=>w.description.status==='reviewed'&&old.words.find(x=>x.id===w.id)?.description.status!=='reviewed').length;
const compactScenes={schema:1,entries:snapshotScenes.entries.map(({w,p,art,sense,scene,image,status,review})=>({w,p,art,sense,scene,image,status,review:{status:review?.status,reviewed_at:review?.reviewed_at,...(status!=='reviewed'?{reason:review?.reason,notes:review?.notes}:{})}}))};
const payload={schema:1,wordsSha256:report.wordsSha256,report,scenes:compactScenes,index};
const packed={schema:1,encoding:'gzip-base64',sha256:hash(Buffer.from(JSON.stringify(payload))),data:zlib.gzipSync(Buffer.from(JSON.stringify(payload))).toString('base64')};
fs.writeFileSync('app/data/generated-etymon/pictpedia-scenes.js','window.PICTPEDIA_SCENES='+JSON.stringify(packed)+';\n');
fs.writeFileSync(reportDir+'/sync-report.json',JSON.stringify(report,null,2));fs.writeFileSync(reportDir+'/caption-holds.json',JSON.stringify(holds,null,2));
console.log(JSON.stringify({...report,representatives:report.representatives.map(x=>({id:x.id,status:x.description.status,en:x.description.en}))}));

