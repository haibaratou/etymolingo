#!/usr/bin/env python3
"""Build Pictpedia from all current generated PNGs, with honest description status.

Run from a clean PUBLIC etymolingo checkout:
  python3 app/eigo-no-e/build.py
  python3 app/eigo-no-e/build.py --check

No source-repository/private data, WordNet notes, gloss overrides, file mtimes,
or guessed image filenames are used. Originals and canonical data are read-only.
"""
from __future__ import annotations
import argparse, hashlib, io, json, re, sys, unicodedata
from collections import Counter
from pathlib import Path
from PIL import Image, __version__ as PILLOW_VERSION
from categories import CATEGORIES

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
BUILD_VERSION = 4

def normalized(value):
    return ' '.join(unicodedata.normalize('NFKC',str(value or '')).translate(str.maketrans({'’':"'",'‘':"'",'‐':'-','‑':'-'})).split())
def compact(value):
    return json.dumps(value,ensure_ascii=False,separators=(',',':'))
def sha256(raw):
    return hashlib.sha256(raw).hexdigest()
def git_blob(raw):
    return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
def key(word):
    return word['w'], tuple(word.get('p',[]))
def identity(entry):
    return (*key(entry),entry['art'])
def first_senses(word):
    return normalized(word.get('ja','').split('、')[0]),normalized(word.get('en','').split(' / ')[0])
def sense_digest(w,p,ja,en):
    return sha256(compact([normalized(w),p,normalized(ja),normalized(en)]).encode())
def index_key(word):
    return compact([word['w'],'+'.join(word.get('p',[]))])
def load_index(path):
    text=path.read_text(encoding='utf-8')
    return json.loads(text[text.index('{'):text.rindex('}')+1])

def eligibility(entry,canonical,art_index,root):
    """Return a reason when unsafe; both editorial and exported status fail closed."""
    if entry.get('status',entry.get('review',{}).get('status'))!='reviewed' or entry.get('review',{}).get('status')!='reviewed':return 'not_reviewed'
    en=normalized(entry.get('scene',{}).get('en',''));ja=normalized(entry.get('scene',{}).get('ja',''))
    if not en:return 'missing_english_description'
    if not ja:return 'missing_japanese_description'
    w=normalized(entry.get('w',''))
    if not re.search(r'(?<!\w)'+re.escape(w).replace(r'\ ',r'\s+')+r'(?!\w)',en,re.I):return 'headword_missing'
    if len(re.findall(r"[\w]+(?:['-][\w]+)*",en))>18:return 'description_too_long'
    bare=re.sub(r'[.!?]+$','',en).strip().casefold()
    if bare in {w.casefold(),'a '+w.casefold(),'an '+w.casefold(),'the '+w.casefold(),'this is '+w.casefold(),'this is a '+w.casefold(),'this is an '+w.casefold()}:return 'headword_only_description'
    art=entry.get('art','')
    if not re.fullmatch(r'[A-Za-z0-9_@-]+',art):return 'invalid_art_identity'
    word=canonical.get(key(entry))
    if not word:return 'missing_canonical_identity'
    sense=entry.get('sense',{})
    if sense.get('index')!=0 or first_senses(word)!=(normalized(sense.get('ja','')),normalized(sense.get('en',''))):return 'stale_first_sense'
    if sense.get('sha256')!=sense_digest(entry['w'],entry.get('p',[]),sense.get('ja',''),sense.get('en','')):return 'invalid_sense_digest'
    # This index records exceptional filenames; an absent key does not authorize
    # deriving a name. The reviewed sidecar supplies the exact filename in all cases.
    mapped=art_index.get(index_key(entry))
    if mapped and mapped!=art:return 'stale_art_mapping'
    image=entry.get('image',{})
    if image.get('path')!=f'assets/word/{art}.png':return 'invalid_image_path'
    path=root/image['path']
    if not path.is_file():return 'missing_image'
    raw=path.read_bytes()
    if sha256(raw)!=image.get('sha256') or git_blob(raw)!=image.get('git_blob_sha'):return 'stale_image'
    try:
        with Image.open(io.BytesIO(raw)) as im:
            if im.format!='PNG':return 'invalid_image_format'
            im.verify()
    except Exception:return 'invalid_image_bytes'
    return None

def category_memberships(rows):
    by_art={r['art']:r for r in rows};by_spell={}
    for row in sorted(rows,key=lambda r:(r['r'],r['w'],r['art'])):by_spell.setdefault(row['w'],[]).append(row)
    cats=[]
    for cid,ja,en,preferred_icon,subs in CATEGORIES:
        out_subs=[]
        for sid,sja,sen,tokens in subs:
            members=[]
            for token in tokens.split():
                candidates=[by_art[token]] if token in by_art and '@' in token else by_spell.get(token,[])
                for row in candidates:
                    if row['art'] not in members:members.append(row['art'])
                    full=f'{cid}/{sid}'
                    if full not in row['c']:row['c'].append(full)
            if members:out_subs.append({'id':sid,'ja':sja,'en':sen,'n':len(members)})
        if out_subs:
            members=[r for r in rows if any(c.startswith(cid+'/') for c in r['c'])]
            icon=next((r['art'] for r in members if r['art']==preferred_icon or r['w']==preferred_icon),members[0]['art'])
            cats.append({'id':cid,'ja':ja,'en':en,'icon':icon,'subs':out_subs})
    remaining=[r for r in rows if not r['c']]
    if remaining:
        # Explicitly unclassified, not an invented semantic category. Keep every
        # otherwise eligible entry searchable while editorial categories grow.
        for row in remaining:row['c']=['more/words']
        cats.append({'id':'more','ja':'いろいろなことば','en':'More words','icon':remaining[0]['art'],'subs':[{'id':'words','ja':'そのほかのことば','en':'More words','n':len(remaining)}]})
    return cats

def render_thumbnail(raw,size):
    with Image.open(io.BytesIO(raw)) as image:
        image=image.convert('RGBA');image.thumbnail((size,size),Image.Resampling.LANCZOS)
        output=io.BytesIO();image.save(output,'WEBP',quality=82,method=4,exact=True)
        return output.getvalue()

def build(root=ROOT,thumb_size=320):
    root=Path(root);sys.path.insert(0,str(root/'app/data'))
    from build_generated_image_catalog import build_catalog_rows
    game_rows,meta,packs,common=build_catalog_rows(root,include_packs=False)
    rows=[];thumb_outputs={};bindings=[]
    for g in game_rows:
        bound=g['bindingStatus']=='bound';sense=g.get('sense',{})
        row={'id':g['id'],'art':g['pic'],'w':g['en'],'p':g['roots'],'ja':g['ja'],'en':sense.get('en',''),'pos':g.get('pos',''),'r':g['rank'],'c':[],
             'sense':sense,'scene':{'en':g['description']['en'],'ja':g['description']['ja']},'image':g['image'],'status':g['description']['status'],
             'review':{'status':g['description']['status']},'description':g['description'],'availability':g['availability'],'bindingStatus':g['bindingStatus'],
             'issues':g['issues'],'recordedUpdatedAt':g['recordedUpdatedAt'],'imageDateProvenance':g['imageDateProvenance'],'dictionaryIndex':g['dictionaryIndex']}
        if g.get('w'):row['k']=g['w']
        if 'tags' in g:row['tags']=g['tags']
        if not bound:
            row['assetRole']=g.get('assetRole');row['primaryArt']=g.get('primaryArt');row['c']=['assets/unresolved' if g['bindingStatus']=='ownership_pending' else 'assets/alternates']
        image=g['image'];relative=f"app/eigo-no-e/thumbs/{g['pic']}.{image['sha256'][:12]}.webp"
        # Reviewed images retain optimized, immutable thumbnails. Other existing PNGs
        # load lazily without requiring thousands of redundant generated files.
        if g['description']['status']=='reviewed':
            thumb=render_thumbnail((root/image['path']).read_bytes(),thumb_size)
            row['thumb']={'path':relative.removeprefix('app/'),'sha256':sha256(thumb),'source_sha256':image['sha256'],'width':thumb_size}
            thumb_outputs[relative]=thumb
        else:row['thumb']={'path':'../'+image['path'],'sha256':image['sha256'],'source_sha256':image['sha256'],'width':512,'original':True}
        rows.append(row);bindings.append({'id':g['id'],'art':g['pic'],'image_path':image['path'],'image_sha256':image['sha256'],'image_git_blob':image['git_blob_sha'],'thumbnail_path':row['thumb']['path'],'thumbnail_sha256':row['thumb']['sha256']})
    rows.sort(key=lambda r:(r['bindingStatus']!='bound',r['r'],r['w'],r['art']))
    primary=[r for r in rows if r['bindingStatus']=='bound'];cats=category_memberships(primary)
    art_ids={r['art']:r['id'] for r in rows}
    for cat in cats:cat['icon']=art_ids.get(cat['icon'],cat['icon'])
    asset_subs=[]
    for sid,ja,en in [('unresolved','画像の対応確認中','Unresolved image ownership'),('alternates','別の画像・旧版','Alternate images')]:
        members=[r for r in rows if r['c']==['assets/'+sid]]
        if members:asset_subs.append({'id':sid,'ja':ja,'en':en,'n':len(members)})
    if asset_subs:cats.append({'id':'assets','ja':'画像の確認','en':'Image records','icon':next(r['id'] for r in rows if r['bindingStatus']!='bound'),'subs':asset_subs})
    sources={'words_sha256':meta['sourceWordsSha256'],'scenes_sha256':meta['scenesSha256'],'illustration_index_sha256':meta['indexSha256'],'image_dates_sha256':meta.get('imageDatesSha256')}
    data={'schema':4,'build_version':4,'total_art':len(rows),'word_entry_count':len(primary),'distinct_word_count':len({r['w'] for r in primary}),
          'ownership_pending_count':sum(r['bindingStatus']=='ownership_pending' for r in rows),'alternate_image_count':sum(r['bindingStatus']=='alternate' for r in rows),
          'description_counts':meta['descriptionCounts'],'playable_counts':meta['playableCounts'],'sources':sources,'categories':cats,'words':rows}
    script=('// Generated image-complete Pictpedia snapshot. Missing descriptions remain explicit.\nwindow.EIGO_NO_E='+compact(data)+';\n').encode()
    report={'schema':2,'build_version':4,'sources':sources,'eligible':len(rows),'word_entries':len(primary),'input_scenes':common['sceneEntries'],'excluded':[],'categories':len(cats),'unclassified':sum(r['c']==['more/words'] for r in rows),'thumbnail':{'size':thumb_size,'quality':82,'method':4,'pillow':PILLOW_VERSION,'unreviewed_fallback':'lazy exact original PNG'},'data_sha256':sha256(script),'bindings':bindings,'ownership':common['ownership'],'description_counts':meta['descriptionCounts'],'playable_counts':meta['playableCounts']}
    outputs={'app/eigo-no-e/data.js':script,'app/eigo-no-e/build-manifest.json':(json.dumps(report,ensure_ascii=False,indent=2)+'\n').encode(),**thumb_outputs}
    html=root/'app/eigo-no-e.html'
    if html.exists():
        source=html.read_text(encoding='utf-8');updated,n=re.subn(r'eigo-no-e/data\.js(?:\?[^"\s]*)?',f"eigo-no-e/data.js?v={sha256(script)[:12]}",source)
        if n!=1:raise ValueError('Expected exactly one data.js reference')
        outputs['app/eigo-no-e.html']=updated.encode()
    # 別名の入口 Pictpedia(app/pictpedia.html)も同じ data.js を読むので、版を合わせる
    alias=root/'app/pictpedia.html'
    if alias.exists():
        source=alias.read_text(encoding='utf-8');updated,n=re.subn(r'eigo-no-e/data\.js(?:\?[^"\s]*)?',f"eigo-no-e/data.js?v={sha256(script)[:12]}",source)
        if n==1:outputs['app/pictpedia.html']=updated.encode()
    return outputs,report

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--root',type=Path,default=ROOT);ap.add_argument('--thumb',type=int,default=320);ap.add_argument('--check',action='store_true',help='Verify outputs without writing');a=ap.parse_args()
    if not 64<=a.thumb<=1024:ap.error('--thumb must be64–1024')
    outputs,report=build(a.root,a.thumb)
    changed=[]
    for relative,raw in outputs.items():
        target=a.root/relative
        if not target.exists() or target.read_bytes()!=raw:
            changed.append(relative)
            if not a.check:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
    print(f"eligible={report['eligible']} excluded={len(report['excluded'])} categories={report['categories']} unclassified={report['unclassified']} changed={len(changed)}")
    for reason,n in sorted(Counter(x['reason'] for x in report['excluded']).items()):print(f'  excluded {reason}: {n}')
    if a.check and changed:
        print('Rebuild required: '+' '.join(changed[:12]),file=sys.stderr);return 1
    return 0
if __name__=='__main__':raise SystemExit(main())
