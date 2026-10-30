/* Portable display selections only. Never edits artwork or browser review records. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WildSiteImageStore=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const filename='site-image-selections.js';
 function normalize(value,appURL,strict=false){
  const app=new URL('./',appURL),project=new URL('../',app),out={};
  const entries=value?.schema===1?value.selections:value;
  if(!entries||typeof entries!=='object'||Array.isArray(entries)){if(strict)throw Error('共有する画像選択が不正です。');return out;}
  for(const [root,item]of Object.entries(entries)){
   try{
    if(!/^[a-z][a-z0-9-]{0,79}$/.test(root)||!item||typeof item.id!=='string'||!/^[a-zA-Z0-9_.-]{1,180}$/.test(item.id))throw Error();
    const source=item.path||item.src;if(typeof source!=='string')throw Error();
    const url=new URL(source,app),queryRevision=url.searchParams.get('v');url.search='';url.hash='';
    const same=url.protocol===app.protocol&&(app.protocol==='file:'?url.host===app.host:url.origin===app.origin);
    const pathname=decodeURIComponent(url.pathname),prefix=decodeURIComponent(project.pathname);
    const inside=app.protocol==='file:'?pathname.toLowerCase().startsWith(prefix.toLowerCase()):pathname.startsWith(prefix);
    if(pathname.includes('\\')||pathname.split('/').some(part=>part==='.'||part==='..'))throw Error();
    if(!same||!['file:','http:','https:'].includes(url.protocol)||!inside||!pathname.toLowerCase().endsWith('.png')||url.username||url.password)throw Error();
    const path='../'+url.pathname.slice(project.pathname.length);
    const record={id:item.id,path,src:url.href,updatedAt:typeof item.updatedAt==='string'?item.updatedAt:''};
    for(const key of ['selectedAt','fileUpdatedAt'])if(typeof item[key]==='string')record[key]=item[key];
    if(['explicit','automatic'].includes(item.selectionMode))record.selectionMode=item.selectionMode;
    if(/^[a-f0-9]{64}$/.test(item.imageSha256||''))record.imageSha256=item.imageSha256;
    const revision=record.imageSha256||item.revision||queryRevision;
    if(/^[a-f0-9]{12,64}$/.test(revision||'')){record.revision=revision;url.searchParams.set('v',revision);record.src=url.href;}
    out[root]=record;
   }catch(error){if(strict)throw Error(root+' の画像がプロジェクト内のPNGとして確認できません。');}
  }
  return out;
 }
 function resolve(common,local,appURL,latest){
  const defaults=normalize(latest,appURL),shared=common?.schema===1?normalize(common,appURL):{},preview=normalize(local,appURL);
  const saved=Date.parse(common?.savedAt)||0,out={...defaults},times={};
  for(const [root,item]of Object.entries(defaults))times[root]=Date.parse(item.updatedAt)||0;
  for(const [root,item]of Object.entries(shared)){
   if(item.selectionMode==='automatic'&&defaults[root]&&(Date.parse(item.updatedAt)||0)<=times[root])continue;
   out[root]=item;times[root]=item.selectionMode==='automatic'?(Date.parse(item.updatedAt)||0):Math.max(saved,Date.parse(item.selectedAt)||0);
  }
  // Legacy publish timestamps describe a browser action, not an explicit choice
  // or the current PNG. Keep those records, but do not let them pin old artwork.
  for(const [root,item]of Object.entries(preview)){
   const explicit=item.selectionMode==='explicit'&&(Date.parse(item.selectedAt)||0)>0;
   if(!out[root]||(explicit&&(Date.parse(item.selectedAt)||0)>(times[root]||0)))out[root]=item;
  }
  // A pin chooses a file; it must not pin stale bytes at that same file path.
  const imageRows=Array.isArray(latest?.images)?normalize(Object.fromEntries(latest.images.map((item,i)=>['image'+i,item])),appURL):{};
  const pathKey=item=>{const url=new URL(item.src);return url.protocol==='file:'?url.pathname.toLowerCase():url.pathname;};
  const paths=new Map([...Object.values(defaults),...Object.values(imageRows)].filter(item=>item.imageSha256).map(item=>[pathKey(item),item]));
  for(const [root,item]of Object.entries(out)){
   const current=paths.get(pathKey(item));if(!current)continue;
   out[root]=normalize({[root]:{...item,imageSha256:current.imageSha256,fileUpdatedAt:current.fileUpdatedAt}},appURL)[root];
  }
  return out;
 }
 function bundle(common,local,appURL,now=new Date().toISOString()){
  const selected={...(common?.schema===1?normalize(common,appURL):{}),...normalize(local,appURL,true)};
  if(!Object.keys(selected).length)throw Error('反映済みの画像選択がありません。先に画像を選んで反映してください。');
  const selections={};for(const [root,item]of Object.entries(selected)){
   const {src,...portable}=item;
   selections[root]={...portable,selectionMode:item.selectionMode||'explicit'};
   if(selections[root].selectionMode==='explicit'&&!selections[root].selectedAt)selections[root].selectedAt=now;
  }
  return {schema:1,savedAt:now,selections};
 }
 function serialize(value){return '/* Shared character image selections; artwork and browser history are unchanged. */\nwindow.WILDWORDOPIA_SITE_IMAGE_SELECTIONS='+JSON.stringify(value,null,2).replace(/</g,'\\u003c')+';\n';}
 async function save(value,env){
  const text=serialize(value);
  if(typeof env.showSaveFilePicker==='function'){
   const handle=await env.showSaveFilePicker({suggestedName:filename,types:[{description:'キャラ画像の共通選択',accept:{'text/javascript':['.js']}}]});
   let writer;try{writer=await handle.createWritable();await writer.write(text);await writer.close();}catch(error){try{await writer?.abort?.();}catch{}throw error;}
   return {status:'saved'};
  }
  const url=env.URL.createObjectURL(new env.Blob([text],{type:'text/javascript;charset=utf-8'})),a=env.document.createElement('a');
  a.href=url;a.download=filename;env.document.body.append(a);a.click();a.remove();env.setTimeout(()=>env.URL.revokeObjectURL(url),60000);
  return {status:'downloaded'};
 }
 return {filename,normalize,resolve,bundle,serialize,save};
});
