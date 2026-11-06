"""Refresh all generated image entries, independent of description completeness.

The historical command filename is retained for local Windows workflows.
Descriptions and Japanese readings are never fabricated to admit a puzzle.
"""
from pathlib import Path
import argparse,hashlib,json,re,sys,shutil,subprocess,os
GAME=Path('app/support/picture-words');HTML=Path('app/pictlingo-game.html')
def sha256(raw):return hashlib.sha256(raw).hexdigest()
def json_bytes(data,pretty=False):return (json.dumps(data,ensure_ascii=False,indent=2 if pretty else None,separators=None if pretty else (',',':'))+'\n').encode()
def read_previous_catalog(path):
 if not Path(path).is_file():return []
 text=Path(path).read_text(encoding='utf-8');m=re.search(r'window\.PICTURE_WORDS_CATALOG\s*=\s*',text)
 if not m:raise ValueError('Missing catalog assignment')
 return json.JSONDecoder().raw_decode(text[m.end():])[0]
def bind_catalog_html(html_raw,catalog_raw):
 pattern=rb'''(<script\b[^>]*?\bsrc\s*=\s*["']support/picture-words/catalog\.js\?v=)([^"'&\s<>]+)''';matches=list(re.finditer(pattern,html_raw,re.I))
 if len(matches)!=1:raise ValueError('Expected exactly one picture-words/catalog.js?v= script')
 a,b=matches[0].span(2);return html_raw[:a]+sha256(catalog_raw)[:12].encode()+html_raw[b:]
def signature(path):
 try:
  s=Path(path).stat();return (s.st_size,s.st_mtime_ns,s.st_ctime_ns,s.st_ino)
 except FileNotFoundError:return None

def fingerprint(path):return sha256(Path(path).read_bytes()) if Path(path).is_file() else None

class BuildGuard:
 """Preserve edits made while the read-only catalog/thumbnail build runs."""
 def __init__(self,root,out,html,previous_catalog=None,game_only=False):
  self.root=Path(root);out=Path(out);html=Path(html)
  names=['app/data/generated-etymon/words.json','app/data/generated-etymon/illustration-scenes.json',
   'app/data/generated-etymon/manifest.json','app/data/generated-etymon/semantic-classifications.json',
   'assets/word/illustration-index.js','app/data/generated-image-issues.json',
   'app/data/generated-image-legacy-ids.json','app/data/puzzle-ja-answers.json',
   'work/etymopedia/image_content_evidence.json','app/data/generated_image_resolver.py',
   'app/data/build_generated_image_catalog.py','app/data/image_content_evidence.py',
   'app/data/inflection_policy.py','app/data/semantic_classifications.py',
   'app/support/picture-words/catalog.js','app/support/picture-words/updated-art.json',
   'app/support/picture-words/build_catalog.py','app/support/picture-words/build-dictionary-links.cjs',
   'app/support/picture-words/refresh_reviewed_catalog.py','app/support/picture-words/build-selection.cjs',
   'app/support/picture-words/reviewed-scenes.js','app/shared/custom-learning-levels.js',
   'app/data/generated-etymon/custom-learning-levels.js','app/data/generated-etymon/learning-levels.js',
   'app/data/generated-etymon/puzzle-visual-scores.js','app/data/generated-etymon/puzzle-eligibility.js']
  if not game_only:names+=['app/eigo-no-e/build.py','app/eigo-no-e/categories.py',
   'app/eigo-no-e.html','app/pictlingo-dictionary.html']
  paths={self.root/name for name in names}|{html,self.root/HTML}
  if previous_catalog:paths.add(Path(previous_catalog))
  self.inputs={p:fingerprint(p) for p in paths}
  self.images=self.image_signatures()
  managed={out/'catalog.js',out/'reviewed-catalog-report.json',html,
   self.root/GAME/'dictionary-links.js'}|set((out/'scene-assets').glob('*.js'))
  if not game_only:managed|={self.root/'app/eigo-no-e/data.js',self.root/'app/eigo-no-e/build-manifest.json',
   self.root/'app/eigo-no-e.html',self.root/'app/pictlingo-dictionary.html'}|set((self.root/'app/eigo-no-e/thumbs').glob('*.webp'))
  self.outputs={p:signature(p) for p in managed}
 def image_signatures(self):
  return {p.name:signature(p) for p in (self.root/'assets/word').glob('*.png')}
 def assert_inputs(self):
  for path,before in self.inputs.items():
   if fingerprint(path)!=before:raise ValueError('Build input changed during generation: '+str(path))
  if self.image_signatures()!=self.images:raise ValueError('PNG inventory changed during generation')
 def publish(self,outputs,check=False):
  self.assert_inputs();plan=[]
  # All output baselines are preflighted before the first replacement. Stats
  # cover the long generation window; SHA256 covers preflight through write.
  for path,raw in outputs.items():
   path=Path(path)
   if signature(path)!=self.outputs.get(path):raise ValueError('Build output changed during generation: '+str(path))
   before=fingerprint(path)
   if before!=sha256(raw):plan.append((path,raw,before))
  self.assert_inputs()
  if not check:
   for path,raw,before in plan:
    if fingerprint(path)!=before:raise ValueError('Build output changed before replacement: '+str(path))
    path.parent.mkdir(parents=True,exist_ok=True);tmp=path.with_name(path.name+'.'+str(os.getpid())+'.tmp')
    if tmp.exists():raise ValueError('Unexpected output temporary file: '+str(tmp))
    try:tmp.write_bytes(raw);tmp.replace(path)
    finally:
     if tmp.exists():tmp.unlink()
  return [str(path) for path,_,_ in plan]

def produce(root,inventory_path=None,previous_catalog=None,*,return_snapshot=False):
 root=Path(root);sys.path.insert(0,str(root/'app/data'))
 from build_generated_image_catalog import build_catalog_rows
 rows,meta,packs,report=build_catalog_rows(root)
 previous=read_previous_catalog(previous_catalog or root/GAME/'catalog.js');old={r['id']:n for n,r in enumerate(previous)}
 # Existing order remains stable; new entries follow the common deterministic order.
 seq={r['id']:n for n,r in enumerate(rows)};rows.sort(key=lambda r:(0,old[r['id']]) if r['id'] in old else (1,seq[r['id']]))
 text='// Generated image-complete catalog; descriptions and language availability are independent.\nwindow.PICTURE_WORDS_CATALOG_META = '+json.dumps(meta,separators=(',',':'))+';\nwindow.PICTURE_WORDS_CATALOG = [\n'+',\n'.join('  '+json.dumps(r,ensure_ascii=False,separators=(',',':')) for r in rows)+'\n];\n'
 result=({'catalog.js':text.encode(),'reviewed-catalog-report.json':json_bytes(report,True),**packs},report)
 return (*result,(rows,meta,packs,report)) if return_snapshot else result

def main(argv=None):
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[3]);p.add_argument('--output-dir',type=Path);p.add_argument('--html-output',type=Path);p.add_argument('--previous-catalog',type=Path);p.add_argument('--inventory',type=Path,help='Retained for compatibility; full current PNG inventory is always scanned');p.add_argument('--check',action='store_true');p.add_argument('--game-only',action='store_true',help='Refresh only the game outputs; normal refresh updates both applications');a=p.parse_args(argv)
 try:
  out=a.output_dir or a.root/GAME;html=a.html_output or (out.parent/HTML.name if a.output_dir else a.root/HTML)
  guard=BuildGuard(a.root,out,html,a.previous_catalog,a.game_only)
  src=html if html.exists() else a.root/HTML;html_before=src.read_bytes()
  files,report,snapshot=produce(a.root,a.inventory,a.previous_catalog,return_snapshot=True)
  outputs={out/k:b for k,b in files.items()};outputs[html]=bind_catalog_html(html_before,files['catalog.js'])
  if not a.game_only:
   import importlib.util
   site=a.root/'app/eigo-no-e';sys.path.insert(0,str(site))
   spec=importlib.util.spec_from_file_location('pictpedia_build',site/'build.py');mod=importlib.util.module_from_spec(spec)
   try:spec.loader.exec_module(mod)
   except ModuleNotFoundError as err:
    if err.name=='PIL':raise ValueError('Pillow is required to refresh Pictpedia thumbnails. Install Pillow in the selected Python environment, then rerun.') from err
    raise
   official,_=mod.build(a.root,catalog_snapshot=snapshot,reuse_thumbnails=True)
   outputs.update({a.root/k:b for k,b in official.items()})
   # Preserve the direct-link compatibility view alongside reviewed sidecars.
   compatibility=a.root/GAME/'build-dictionary-links.cjs'
   if compatibility.is_file():
    source=compatibility.read_text(encoding='utf-8')
    match=re.search(r'const output=`(.*?)`;',source,re.S)
    if not match or '${' in match[1] or '\\' in match[1]:raise ValueError('Unsupported compatibility-view template; review build-dictionary-links.cjs')
    game=json.JSONDecoder().raw_decode(files['catalog.js'].decode().split('window.PICTURE_WORDS_CATALOG = ',1)[1])[0]
    dictionary=json.loads(official['app/eigo-no-e/data.js'].decode().split('window.EIGO_NO_E=',1)[1].strip().removesuffix(';'))
    by_id={row['id']:row for row in dictionary['words']}
    if len(by_id)!=len(game):raise ValueError('Dictionary compatibility identity count differs')
    for row in game:
     word=by_id.get(row['id'])
     if not word or row['en']!=word['w'] or row['pic']!=word['art'] or row['image']!=word['image'] or row['availability']!=word['availability'] or row['description']!=word['description']:raise ValueError('Dictionary compatibility identity mismatch: '+row['id'])
    for key,field in [('words_sha256','sourceWordsSha256'),('scenes_sha256','scenesSha256'),('illustration_index_sha256','indexSha256')]:
     if dictionary['sources'][key]!=report['meta'][field]:raise ValueError('Dictionary compatibility provenance differs')
    outputs[a.root/GAME/'dictionary-links.js']=match[1].encode()
  canonical_output=out.resolve()==(a.root/GAME).resolve()
  node=shutil.which('node') if not a.check and canonical_output else None
  if not a.check and canonical_output and not node:raise ValueError('Node.js is required to refresh reviewed prototype sidecars')
  changed=guard.publish(outputs,check=a.check)
  if a.check and changed:raise ValueError('Generated outputs stale: '+', '.join(changed[:10]))
  if node:
   scripts=[a.root/GAME/'build-selection.cjs']
   if not a.game_only:scripts.append(a.root/'app/eigo-no-e/build-caption-snapshot.cjs')
   for script in scripts:
    try:subprocess.run([node,str(script.resolve()),'--root',str(a.root.resolve())],check=True)
    except subprocess.CalledProcessError as err:raise ValueError('Reviewed sidecar refresh failed: '+script.name) from err
  print(('Verified' if a.check else 'Wrote')+f" {report['emittedRows']} image entries; {report['meta']['wordEntryCount']} bound words; playable {report['meta']['playableCounts']}; {report['lazyAssets']} lazy reviewed-image packs.")
  return 0
 except (OSError,ValueError,KeyError,AssertionError) as e:print('Image catalog refresh failed: '+str(e),file=sys.stderr);return 1
if __name__=='__main__':raise SystemExit(main())
