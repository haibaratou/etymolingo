/* Refresh shared image metadata without launching a browser or changing a choice. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pathToFileURL,fileURLToPath}=require('node:url');
const relativeSupport='app/support/character-manager';
const header='/* Generated from the character manager. Explicit saved selections take precedence. */\n';
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

function assignment(source,name){
 const match=source.match(new RegExp('(?:^|\\n)window\\.'+name+'\\s*=\\s*'));
 if(!match)throw Error('Missing '+name);
 return JSON.parse(source.slice(match.index+match[0].length).trim().replace(/;\s*$/,''));
}
function decode(value){return value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi,(_,entity)=>{
 if(entity[0]==='#')return String.fromCodePoint(entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):Number(entity.slice(1)));
 return {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'}[entity.toLowerCase()];
});}
function attributes(source){
 const result={};
 for(const m of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))result[m[1].toLowerCase()]=decode(m[2]??m[3]??m[4]??'');
 return result;
}
function cardsFromMarkup(markup){
 const cards=[],stack=[],voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 for(let at=0;(at=markup.indexOf('<',at))!==-1;){
  if(markup.startsWith('<!--',at)){const close=markup.indexOf('-->',at+4);if(close<0)throw Error('Unclosed comment');at=close+3;continue;}
  let quote='',end=at+1;
  for(;end<markup.length;end++){
   const ch=markup[end];if(quote){if(ch===quote)quote='';}else if(ch==='"'||ch==="'")quote=ch;else if(ch==='>')break;
  }
  if(end===markup.length)throw Error('Unclosed HTML tag');
  const token=markup.slice(at,end+1);at=end+1;
  const m=token.match(/^<\s*(\/?)\s*([a-z][\w:-]*)\b([\s\S]*?)>$/i);if(!m)continue;
  const tag=m[2].toLowerCase();
  if(m[1]){const i=stack.map(node=>node.tag).lastIndexOf(tag);if(i>=0)stack.length=i;continue;}
  if(tag==='script'||tag==='style')throw Error('Unexpected executable content in comparison fragment');
  const attrs=attributes(m[3]),parent=stack.at(-1);let card=parent?.card;
  if(tag==='article'&&parent?.tag==='main'&&attrs['data-root']){
   card={root:attrs['data-root'],id:attrs['data-image-id'],updated:Number(attrs['data-updated'])||0,src:null};cards.push(card);
  }
  if(tag==='img'&&card&&!card.src&&stack.some(node=>node.card===card&&node.visual))card.src=attrs.src||null;
  if(!voids.has(tag)&&!token.endsWith('/>'))stack.push({tag,card,visual:(attrs.class||'').split(/\s+/).includes('visual')});
 }
 return cards;
}
function pickLatest(cards){
 const picked={};for(const card of cards){
  // Preserve the original DOM algorithm: first equal timestamp wins.
  if(card.src&&(!picked[card.root]||card.updated>picked[card.root].updated))picked[card.root]=card;
 }
 return picked;
}
function produce(root){
 root=path.resolve(root);
 const source=fs.readFileSync(path.join(root,relativeSupport,'comparison-markup.js'),'utf8');
 const markup=assignment(source,'WILDWORDOPIA_COMPARISON_MARKUP');if(typeof markup!=='string')throw Error('Comparison fragment must be a string');
 const cards=cardsFromMarkup(markup),picked=pickLatest(cards),selections={},images=[],missingImages=[],content=new Map();
 const base=pathToFileURL(path.join(root,'work/wildwordopia/sample/exploration-20261014/'));
 function imageMetadata(item,strict){
  const url=new URL(item.src,base);if(url.protocol!=='file:')return null;
  const file=fileURLToPath(url),relative=path.relative(root,file);
  if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative)){
   if(strict)throw Error('Outside project '+file);missingImages.push({id:item.id,reason:'outside_project'});return null;
  }
  const imagePath=path.relative(path.join(root,'app'),file).replace(/\\/g,'/');
  if(!fs.existsSync(file)){
   if(strict)throw Error('Missing '+file);missingImages.push({id:item.id,path:imagePath,reason:'missing_file'});return null;
  }
  if(!content.has(imagePath)){
   const bytes=fs.readFileSync(file),stat=fs.statSync(file);
   content.set(imagePath,{path:imagePath,imageSha256:digest(bytes),fileUpdatedAt:stat.mtime.toISOString()});
  }
  return content.get(imagePath);
 }
 for(const [key,item]of Object.entries(picked)){
  const metadata=imageMetadata(item,true);if(!metadata)continue;
  selections[key]={id:item.id,path:metadata.path,updatedAt:new Date(item.updated).toISOString(),imageSha256:metadata.imageSha256,fileUpdatedAt:metadata.fileUpdatedAt};
 }
 const included=new Set();for(const item of cards){
  if(!item.src)continue;const metadata=imageMetadata(item,false);if(!metadata||included.has(metadata.path))continue;
  included.add(metadata.path);images.push({id:item.id,...metadata});
 }
 return {schema:1,selections,images,...(missingImages.length?{missingImages}:{})};
}
function serialize(manifest){return header+'window.WILDWORDOPIA_LATEST_CHARACTER_IMAGES='+JSON.stringify(manifest,null,2)+';\n';}
function choiceChanges(before,after){
 const changes=[],keys=[...new Set([...Object.keys(before.selections||{}),...Object.keys(after.selections||{})])].sort();
 for(const root of keys){
  const old=before.selections?.[root],next=after.selections?.[root];
  if(!old||!next||old.id!==next.id||old.path!==next.path)changes.push({root,before:old?{id:old.id,path:old.path}:null,after:next?{id:next.id,path:next.path}:null});
 }
 return changes;
}
function assertSameChoices(before,after){
 const changes=choiceChanges(before,after);if(changes.length)throw Error('Latest choices changed for '+changes.map(x=>x.root).join(', ')+'; metadata-only refresh stopped');
}
function plannedEntryVersions(root,raw){
 const version=digest(raw).slice(0,12),changes=[];
 for(const relative of ['app/wild-wordopia.html','tools/wild-wordopia-template.html']){
  const file=path.join(root,relative);if(!fs.existsSync(file))continue;
  const before=fs.readFileSync(file,'utf8');let count=0;
  const after=before.replace(/(<script\b[^>]*\bsrc=["']support\/character-manager\/latest-site-images\.js)(?:\?[^"']*)?(["'])/gi,(_,prefix,quote)=>{count++;return prefix+'?v='+version+quote;});
  if(count!==1)throw Error('Expected one latest image manifest reference in '+relative);
  if(before!==after)changes.push({relative,file,before,after});
 }
 return changes;
}
function atomicWrite(file,raw){const temporary=file+'.metadata-'+process.pid+'.tmp';fs.writeFileSync(temporary,raw);fs.renameSync(temporary,file);}
function backupWrites(root,oldRaw,raw,entries,changes,accepted){
 const name=new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID().slice(0,8);
 const directory=path.join(root,'work/wild-image-refresh-20261030/builder/runs',name);fs.mkdirSync(directory,{recursive:true});
 if(oldRaw!==null)fs.writeFileSync(path.join(directory,'before-latest-site-images.js'),oldRaw);
 for(const entry of entries){const target=path.join(directory,'before',entry.relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,entry.before);}
 fs.writeFileSync(path.join(directory,'identity-changes.json'),JSON.stringify({accepted:accepted&&changes.length>0,changes,beforeSha256:oldRaw===null?null:digest(oldRaw),afterSha256:digest(raw),entryVersions:entries.map(entry=>entry.relative)},null,2)+'\n');
 return directory;
}
function main(argv=process.argv.slice(2)){
 let root=path.resolve(__dirname,'../../..'),check=false,accept=false;
 for(let i=0;i<argv.length;i++){
  if(argv[i]==='--root'&&argv[i+1])root=path.resolve(argv[++i]);
  else if(argv[i]==='--check')check=true;else if(argv[i]==='--accept-choice-changes')accept=true;else throw Error('Unknown argument '+argv[i]);
 }
 const target=path.join(root,relativeSupport,'latest-site-images.js'),manifest=produce(root);
 const oldRaw=fs.existsSync(target)?fs.readFileSync(target,'utf8'):null,changes=oldRaw===null?[]:choiceChanges(assignment(oldRaw,'WILDWORDOPIA_LATEST_CHARACTER_IMAGES'),manifest);
 if(changes.length){console.log(JSON.stringify({choiceChanges:changes},null,2));if(!accept)throw Error('Latest choices changed; review then use --accept-choice-changes for an intentional registration');}
 const raw=serialize(manifest),same=oldRaw===raw,entries=plannedEntryVersions(root,raw);
 if(check){if(!same||entries.length)throw Error('Latest image metadata or entry version is stale');}
 else if(!same||entries.length){
  // Refuse to overwrite another editor's newer HTML snapshot.
  for(const entry of entries)if(fs.readFileSync(entry.file,'utf8')!==entry.before)throw Error('Entry changed concurrently: '+entry.relative);
  const backup=backupWrites(root,oldRaw,raw,entries,changes,accept);
  if(!same)atomicWrite(target,raw);
  for(const entry of entries){if(fs.readFileSync(entry.file,'utf8')!==entry.before)throw Error('Entry changed concurrently: '+entry.relative);atomicWrite(entry.file,entry.after);}
  console.log('Before-files and identity report: '+path.relative(root,backup));
 }
 console.log((check?'Verified':'Refreshed')+' '+Object.keys(manifest.selections).length+' shared image choices and '+manifest.images.length+' image revisions'+(changes.length?' (explicit choice changes accepted)':' (choices unchanged)'));
 return manifest;
}
module.exports={assignment,decode,attributes,cardsFromMarkup,pickLatest,produce,serialize,choiceChanges,assertSameChoices,plannedEntryVersions,main};
if(require.main===module){try{main();}catch(error){console.error(error.message);process.exitCode=1;}}
