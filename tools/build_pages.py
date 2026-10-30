"""Stage runtime files only; deliver unchanged media from the same pinned Git commit.
No repository files are deleted or rewritten. Run from a checked-out repository.
"""
import argparse,hashlib,importlib.util,json,os,re,shutil,subprocess,sys
from pathlib import Path,PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote,quote
MEDIA={'.png','.webp','.jpg','.jpeg','.gif','.avif','.mp4','.webm','.mp3','.wav','.ogg'}
RUNTIME={'.html','.js','.mjs','.css','.json','.csv','.svg','.ico','.woff','.woff2','.ttf','.otf','.wasm','.xml','.webmanifest','.txt'}
EXCLUDED={'tests','tools','.github','.git','Claude outputs'}

# Only these three newly introduced Explorer dependencies may supplement Git's
# tracked inventory, and only when the tracked entrance actually references them.
REVIEW_NOTES_DEPENDENCIES = (
 ('shared/word-review-notes.js', 'script', 'src'),
 ('shared/word-review-notes.css', 'link', 'href'),
 ('data/generated-etymon/word-review-notes.js', 'script', 'src'),
)

def include_review_notes_dependencies(root, tracked):
 entrance = 'app/vocabulary-master.html'
 path = root / entrance
 if entrance not in tracked or not path.is_file():return tracked
 referenced = set()
 class References(HTMLParser):
  def handle_starttag(self, tag, attrs):
   attrs = dict(attrs)
   for relative, expected_tag, attribute in REVIEW_NOTES_DEPENDENCIES:
    if tag != expected_tag:continue
    if tag == 'link' and 'stylesheet' not in (attrs.get('rel') or '').lower().split():continue
    value = attrs.get(attribute)
    if not isinstance(value, str):continue
    url = urlsplit(value)
    if not url.scheme and not url.netloc and str(PurePosixPath(unquote(url.path))) == relative:
     referenced.add('app/' + relative)
 parser = References(convert_charrefs=True)
 parser.feed(path.read_text(encoding='utf-8-sig'));parser.close()
 result = list(tracked)
 for relative, _, _ in REVIEW_NOTES_DEPENDENCIES:
  name = 'app/' + relative
  if name not in referenced:continue
  dependency = root / name
  if not dependency.is_file() or dependency.resolve() != root.resolve() / name:
   raise ValueError('Referenced review-notes dependency is missing or redirected: ' + name)
  if name not in result:result.append(name)
 return result

def needs_media_router(text):
 # Static URLs have already been rewritten by the build. Script-free entry
 # pages need no parser-blocking bootstrap or DOM observer. Event handlers and
 # javascript links can create media without a script element, so keep those.
 return bool(re.search(r'<script\b|\bon[a-z]+\s*=|javascript\s*:',text,re.I))

def externalize_explorer_snapshot(text,out):
 pattern=re.compile(r'(<script\b(?=[^>]*\bid\s*=\s*[\'"]pieData[\'"])(?=[^>]*\btype\s*=\s*[\'"]application/gzip-base64[\'"])[^>]*>)(.*?)(</script\s*>)',re.I|re.S)
 matches=list(pattern.finditer(text))
 if not matches:return text,None
 if len(matches)!=1:raise ValueError('Expected one Explorer fallback snapshot')
 match=matches[0];payload=match[2].strip()
 if not payload:return text,None
 sha=hashlib.sha256(payload.encode('utf-8')).hexdigest()
 name='app/data/generated-etymon/explorer-fallback-'+sha+'.txt'
 target=out/name;target.parent.mkdir(parents=True,exist_ok=True)
 target.write_text(payload,encoding='utf-8',newline='\n')
 tag=match[1][:-1]+' data-src="'+name.removeprefix('app/')+'">'+match[3]
 return text[:match.start()]+tag+text[match.end():],{'page':'app/vocabulary-master.html','payload':name,'sha256':sha,'bytes':len(payload.encode('utf-8'))}

def build_ja_dictionary_local_data(root,out):
 # Rebuild the file:// transport from the staged canonical JSON, so copied
 # local sidecars cannot silently lag behind a newly published dictionary.
 data=out/'app/data/ja'
 if not (out/'app/japanese-dictionary.html').is_file() or not (data/'ja_index.json').is_file():return None
 source=root/'app/support/ja-dict/build_local_data.py'
 spec=importlib.util.spec_from_file_location('_ja_dict_local_data_builder',source)
 if spec is None or spec.loader is None:raise RuntimeError('Cannot load Japanese dictionary local-data builder')
 module=importlib.util.module_from_spec(spec)
 sys.modules[spec.name]=module
 spec.loader.exec_module(module)
 return module.build(data,data/'file')

def build(root,out,repo,commit):
 if not re.fullmatch(r'[0-9a-f]{40}',commit):raise ValueError('Commit must be immutable SHA')
 tracked=subprocess.check_output(['git','-C',str(root),'ls-files','-z']).decode().split('\0');tracked=[x for x in tracked if x]
 tracked=include_review_notes_dependencies(root,tracked)
 media={x for x in tracked if (Path(x).suffix.lower() in MEDIA or x.startswith('app/support/picture-words/scene-assets/')) and not x.startswith('assets/ui/') and not set(PurePosixPath(x).parts)&{'.git'}}
 raw=f'https://raw.githubusercontent.com/{repo}/{commit}/'
 template=(root/'tools/pages-assets.template.js').read_text()
 # Runtime routing needs the build's media policy, not tens of thousands of
 # individual paths. Existing media keep identical pinned URLs. Unknown media
 # paths still fail with 404, at the pinned raw origin instead of Pages.
 router_code=template.replace('__RAW_BASE__',json.dumps(raw)).replace('__MEDIA_EXTENSIONS__',json.dumps(sorted(MEDIA),separators=(',',':')))
 router_version=hashlib.sha256(router_code.encode('utf-8')).hexdigest()[:12]
 if out.exists():raise ValueError('Use a fresh staging directory')
 out.mkdir(parents=True)
 def mapped(url,base):
  s=urlsplit(url)
  if s.scheme or s.netloc or url.startswith('#'):return url
  p=unquote(s.path)
  if p.startswith('/'+repo.split('/')[-1]+'/'):p=p[len(repo.split('/')[-1])+2:]
  elif p.startswith('/'):return url
  else:p=os.path.normpath(str(PurePosixPath(base).parent/p)).replace('\\','/')
  if p not in media:return url
  return raw+'/'.join(quote(a,safe='') for a in p.split('/'))+('?' + s.query if s.query else '')+('#'+s.fragment if s.fragment else '')
 def css(text,base):
  return re.sub(r'url\(\s*([\'"]?)([^)\'"\s]+)\1\s*\)',lambda m:'url('+m[1]+mapped(m[2],base)+m[1]+')',text)
 count=0;bootstraps=0;snapshots=[]
 for name in tracked:
  p=PurePosixPath(name)
  if p.parts[0] in EXCLUDED or name in media or (Path(name).suffix.lower() not in RUNTIME and not name.startswith('assets/ui/')):continue
  if name.startswith('app/data/pie/'):raise ValueError('Forbidden source data in distribution repository')
  if p.parts[0] not in {'app','assets','mobile','work'} and name not in {'robots.txt','index.html','404.html','favicon.ico'}:continue
  source=root/name;target=out/name;target.parent.mkdir(parents=True,exist_ok=True)
  if name == 'app/support/picture-words-sw.js':
   text=source.read_text(encoding='utf-8');assert text.count('const SHELL = [')==1
   target.write_text(text.replace('const SHELL = [',"const SHELL = ['../pages-assets.js?v="+router_version+"',"),encoding='utf-8')
  elif name == 'app/support/picture-words/reviewed-scenes.js':
   text=source.read_text(encoding='utf-8')
   marker='    async loadPack(word) {'
   assert text.count(marker)==1
   injected='''
      if (root.ETYMON_ASSET_URL) {
        if (!hasPack(word)) throw new Error('pack-unavailable');
        const url=new URL('support/'+word.sceneAsset.split('/').map(encodeURIComponent).join('/'),this.location.href).href;
        let response;
        if(root.caches) response=await root.caches.match(url);
        if(!response) response=await this.fetcher(url,{signal:AbortSignal.timeout(15000)});
        if(!response.ok) throw new Error('pack-unavailable');
        const text=await response.text();
        await verifyPackScript(word,text,this.crypto);
        const prefix='(window.PICTURE_WORDS_SCENE_ASSETS ||= {})['+JSON.stringify(imageFor(word).sha256)+'] = ';
        const pack=JSON.parse(text.trim().slice(prefix.length,-1));
        return Uint8Array.from(root.atob(pack.base64),c=>c.charCodeAt(0));
      }
'''
   target.write_text(text.replace(marker,marker+injected),encoding='utf-8')
  elif source.suffix.lower() in {'.html','.css','.svg'}:
   text=source.read_text(encoding='utf-8-sig');text=css(text,name)
   if source.suffix.lower()=='.html':
    def attr(m):
     key,q,v=m[1],m[2],m[3]
     if key.lower()=='srcset':v=re.sub(r'(^|,\s*)([^,\s]+)([^,]*)',lambda a:a[1]+mapped(a[2],name)+a[3],v)
     else:v=mapped(v,name)
     return key+'='+q+v+q
    text=re.sub(r'\b(src|poster|srcset)\s*=\s*([\'"])(.*?)\2',attr,text,flags=re.I)
    if name=='app/vocabulary-master.html':
     text,snapshot=externalize_explorer_snapshot(text,out)
     if snapshot:snapshots.append(snapshot)
    if needs_media_router(text):
     router_path=os.path.relpath('pages-assets.js',str(p.parent)).replace('\\','/')
     tag='<script src="'+router_path+'?v='+router_version+'"></script>'
     if re.search(r'<head\b[^>]*>',text,re.I):text=re.sub(r'(<head\b[^>]*>)',lambda m:m[1]+tag,text,count=1,flags=re.I)
     else:text=tag+text
     bootstraps+=1
   target.write_text(text,encoding='utf-8')
  else:shutil.copyfile(source,target)
  count+=1
 (out/'pages-assets.js').write_text(router_code,encoding='utf-8',newline='\n')
 (out/'.nojekyll').touch()
 if not (out/'index.html').exists():(out/'index.html').write_text('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=app/index.html"><a href="app/index.html">サイトへ</a>')
 ja_local_data=build_ja_dictionary_local_data(root,out)
 total=sum(p.stat().st_size for p in out.rglob('*') if p.is_file())
 report={'commit':commit,'runtimeFiles':count,'externalMediaFiles':len(media),'runtimeBytes':total,'mediaBase':raw,'originalMediaUnchanged':True,
         'pagesAssetsBytes':len(router_code.encode('utf-8')),'pagesAssetsVersion':router_version,'bootstrapHtmlFiles':bootstraps,'externalizedSnapshots':snapshots,
         'mediaRouting':'extensions-and-scene-assets; unknown media remain missing at the pinned raw origin'}
 if ja_local_data is not None:report['jaDictionaryLocalData']=ja_local_data
 (out/'deployment-manifest.json').write_text(json.dumps(report,indent=2))
 print(json.dumps(report))
 if total>900_000_000:raise ValueError('Runtime bundle exceeds 900 MB safety budget')
 return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path('.'));p.add_argument('--out',type=Path,default=Path('_site'));p.add_argument('--repository',required=True);p.add_argument('--commit',required=True);a=p.parse_args();build(a.root,a.out,a.repository,a.commit)
