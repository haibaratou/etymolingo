"""Refresh all generated image entries, independent of description completeness.

The historical command filename is retained for local Windows workflows.
Descriptions and Japanese readings are never fabricated to admit a puzzle.
"""
from pathlib import Path
import argparse,hashlib,json,re,sys
GAME=Path('app/games/picture-words');HTML=Path('app/games/picture-words.html')
def sha256(raw):return hashlib.sha256(raw).hexdigest()
def json_bytes(data,pretty=False):return (json.dumps(data,ensure_ascii=False,indent=2 if pretty else None,separators=None if pretty else (',',':'))+'\n').encode()
def read_previous_catalog(path):
 if not Path(path).is_file():return []
 text=Path(path).read_text();m=re.search(r'window\.PICTURE_WORDS_CATALOG\s*=\s*',text)
 if not m:raise ValueError('Missing catalog assignment')
 return json.JSONDecoder().raw_decode(text[m.end():])[0]
def bind_catalog_html(html_raw,catalog_raw):
 pattern=rb'''(<script\b[^>]*?\bsrc\s*=\s*["']picture-words/catalog\.js\?v=)([^"'&\s<>]+)''';matches=list(re.finditer(pattern,html_raw,re.I))
 if len(matches)!=1:raise ValueError('Expected exactly one picture-words/catalog.js?v= script')
 a,b=matches[0].span(2);return html_raw[:a]+sha256(catalog_raw)[:12].encode()+html_raw[b:]
def produce(root,inventory_path=None,previous_catalog=None):
 root=Path(root);sys.path.insert(0,str(root/'app/data'))
 from build_generated_image_catalog import build_catalog_rows
 rows,meta,packs,report=build_catalog_rows(root)
 previous=read_previous_catalog(previous_catalog or root/GAME/'catalog.js');old={r['id']:n for n,r in enumerate(previous)}
 # Existing order remains stable; new entries follow the common deterministic order.
 seq={r['id']:n for n,r in enumerate(rows)};rows.sort(key=lambda r:(0,old[r['id']]) if r['id'] in old else (1,seq[r['id']]))
 text='// Generated image-complete catalog; descriptions and language availability are independent.\nwindow.PICTURE_WORDS_CATALOG_META = '+json.dumps(meta,separators=(',',':'))+';\nwindow.PICTURE_WORDS_CATALOG = [\n'+',\n'.join('  '+json.dumps(r,ensure_ascii=False,separators=(',',':')) for r in rows)+'\n];\n'
 return {'catalog.js':text.encode(),'reviewed-catalog-report.json':json_bytes(report,True),**packs},report

def main(argv=None):
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[3]);p.add_argument('--output-dir',type=Path);p.add_argument('--html-output',type=Path);p.add_argument('--previous-catalog',type=Path);p.add_argument('--inventory',type=Path,help='Retained for compatibility; full current PNG inventory is always scanned');p.add_argument('--check',action='store_true');p.add_argument('--game-only',action='store_true',help='Refresh only the game outputs; normal refresh updates both applications');a=p.parse_args(argv)
 try:
  out=a.output_dir or a.root/GAME;html=a.html_output or out.parent/HTML.name
  files,report=produce(a.root,a.inventory,a.previous_catalog);src=html if html.exists() else a.root/HTML
  outputs={out/k:b for k,b in files.items()};outputs[html]=bind_catalog_html(src.read_bytes(),files['catalog.js'])
  if not a.game_only:
   import importlib.util
   site=a.root/'app/eigo-no-e';sys.path.insert(0,str(site))
   spec=importlib.util.spec_from_file_location('pictpedia_build',site/'build.py');mod=importlib.util.module_from_spec(spec)
   try:spec.loader.exec_module(mod)
   except ModuleNotFoundError as err:
    if err.name=='PIL':raise ValueError('Pillow is required to refresh Pictpedia thumbnails. Install Pillow in the selected Python environment, then rerun.') from err
    raise
   official,_=mod.build(a.root)
   outputs.update({a.root/k:b for k,b in official.items()})
   # Preserve the user's direct-link command without a new Node requirement
   # for the existing Python/Windows refresh. Its output is a constant lazy view.
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
  changed=[]
  for path,raw in outputs.items():
   if not path.exists() or path.read_bytes()!=raw:
    changed.append(str(path))
    if not a.check:path.parent.mkdir(parents=True,exist_ok=True);tmp=path.with_name(path.name+'.tmp');tmp.write_bytes(raw);tmp.replace(path)
  if a.check and changed:raise ValueError('Generated outputs stale: '+', '.join(changed[:10]))
  print(('Verified' if a.check else 'Wrote')+f" {report['emittedRows']} image entries; {report['meta']['wordEntryCount']} bound words; playable {report['meta']['playableCounts']}; {report['lazyAssets']} lazy reviewed-image packs.")
  return 0
 except (OSError,ValueError,KeyError,AssertionError) as e:print('Image catalog refresh failed: '+str(e),file=sys.stderr);return 1
if __name__=='__main__':raise SystemExit(main())
