"""Stage runtime files only; deliver unchanged media from the same pinned Git commit.
No repository files are deleted or rewritten. Run from a checked-out repository.
"""
import argparse,json,os,re,shutil,subprocess
from pathlib import Path,PurePosixPath
from urllib.parse import urlsplit,unquote,quote
MEDIA={'.png','.webp','.jpg','.jpeg','.gif','.avif','.mp4','.webm','.mp3','.wav','.ogg'}
RUNTIME={'.html','.js','.mjs','.css','.json','.csv','.svg','.ico','.woff','.woff2','.ttf','.otf','.wasm','.xml','.webmanifest','.txt'}
EXCLUDED={'tests','tools','.github','.git','Claude outputs'}
def build(root,out,repo,commit):
 if not re.fullmatch(r'[0-9a-f]{40}',commit):raise ValueError('Commit must be immutable SHA')
 tracked=subprocess.check_output(['git','-C',str(root),'ls-files','-z']).decode().split('\0');tracked=[x for x in tracked if x]
 media={x for x in tracked if (Path(x).suffix.lower() in MEDIA or x.startswith('app/games/picture-words/scene-assets/')) and not x.startswith('assets/ui/') and not set(PurePosixPath(x).parts)&{'.git'}}
 raw=f'https://raw.githubusercontent.com/{repo}/{commit}/'
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
 count=0
 for name in tracked:
  p=PurePosixPath(name)
  if p.parts[0] in EXCLUDED or name in media or (Path(name).suffix.lower() not in RUNTIME and not name.startswith('assets/ui/')):continue
  if name.startswith('app/data/pie/'):raise ValueError('Forbidden source data in distribution repository')
  if p.parts[0] not in {'app','assets','mobile','work'} and name not in {'robots.txt','index.html','404.html','favicon.ico'}:continue
  source=root/name;target=out/name;target.parent.mkdir(parents=True,exist_ok=True)
  if name == 'app/games/picture-words-sw.js':
   text=source.read_text(encoding='utf-8');assert text.count('const SHELL = [')==1
   target.write_text(text.replace('const SHELL = [',"const SHELL = ['../../pages-assets.js',"),encoding='utf-8')
  elif name == 'app/games/picture-words/reviewed-scenes.js':
   text=source.read_text(encoding='utf-8')
   marker='    async loadPack(word) {'
   assert text.count(marker)==1
   injected='''
      if (root.ETYMON_ASSET_URL) {
        if (!hasPack(word)) throw new Error('pack-unavailable');
        const url=new URL(word.sceneAsset.split('/').map(encodeURIComponent).join('/'),this.location.href).href;
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
    script=os.path.relpath('pages-assets.js',str(p.parent)).replace('\\','/')
    tag='<script src="'+script+'"></script>'
    if re.search(r'<head\b[^>]*>',text,re.I):text=re.sub(r'(<head\b[^>]*>)',lambda m:m[1]+tag,text,count=1,flags=re.I)
    else:text=tag+text
   target.write_text(text,encoding='utf-8')
  else:shutil.copyfile(source,target)
  count+=1
 template=(root/'tools/pages-assets.template.js').read_text()
 script=template.replace('__RAW_BASE__',json.dumps(raw)).replace('__MEDIA_PATHS__',json.dumps(sorted(media),ensure_ascii=False,separators=(',',':')))
 (out/'pages-assets.js').write_text(script)
 (out/'.nojekyll').touch()
 if not (out/'index.html').exists():(out/'index.html').write_text('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=app/index.html"><a href="app/index.html">サイトへ</a>')
 total=sum(p.stat().st_size for p in out.rglob('*') if p.is_file())
 report={'commit':commit,'runtimeFiles':count,'externalMediaFiles':len(media),'runtimeBytes':total,'mediaBase':raw,'originalMediaUnchanged':True}
 (out/'deployment-manifest.json').write_text(json.dumps(report,indent=2))
 print(json.dumps(report))
 if total>900_000_000:raise ValueError('Runtime bundle exceeds 900 MB safety budget')
 return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path('.'));p.add_argument('--out',type=Path,default=Path('_site'));p.add_argument('--repository',required=True);p.add_argument('--commit',required=True);a=p.parse_args();build(a.root,a.out,a.repository,a.commit)
