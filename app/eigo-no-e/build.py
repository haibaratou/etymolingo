#!/usr/bin/env python3
"""Build えいごのえ from reviewed English illustration scenes only.

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
BUILD_VERSION = 3

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
    root=Path(root);gen=root/'app/data/generated-etymon';folder=root/'app/eigo-no-e'
    word_bytes=(gen/'words.json').read_bytes();scene_bytes=(gen/'illustration-scenes.json').read_bytes();index_bytes=(root/'assets/word/illustration-index.js').read_bytes()
    words=json.loads(word_bytes);payload=json.loads(scene_bytes)
    if payload.get('schema')!=1 or not isinstance(payload.get('entries'),list):raise ValueError('Unsupported illustration scene schema')
    canonical={}
    for word in words:
        k=key(word)
        if k in canonical and first_senses(canonical[k])!=first_senses(word):raise ValueError(f'Ambiguous canonical word identity: {k!r}')
        canonical[k]=word
    art_index=load_index(root/'assets/word/illustration-index.js')
    rows=[];excluded=[];seen=set();used_art=set();thumb_outputs={};bindings=[]
    for entry in payload['entries']:
        ident=identity(entry)
        if ident in seen:raise ValueError(f'Duplicate scene identity: {ident!r}')
        seen.add(ident)
        reason=eligibility(entry,canonical,art_index,root)
        if reason:
            excluded.append({'w':entry.get('w'),'art':entry.get('art'),'reason':reason});continue
        if entry['art'] in used_art:raise ValueError('Two eligible identities claim the same art ID; resolve before publication')
        used_art.add(entry['art']);word=canonical[key(entry)];ja,en=first_senses(word)
        # Intentionally exclude b/etymology, WordNet d/syn/h/rel, and JA_OVERRIDE.
        row={'id':entry['art'],'art':entry['art'],'w':entry['w'],'p':entry.get('p',[]),'ja':ja,'en':en,'pos':word.get('pos',''),'r':word.get('r') or 99999,'c':[],
             'sense':entry['sense'],'scene':entry['scene'],'image':entry['image'],'status':'reviewed','review':{'status':'reviewed'}}
        reading=next((x.get('kana') for x in word.get('ja_readings',[]) if normalized(x.get('gloss',''))==ja and x.get('kana')),None)
        if reading:row['k']=reading
        if word.get('tags') is not None:row['tags']=word['tags']
        raw=(root/entry['image']['path']).read_bytes();thumb=render_thumbnail(raw,thumb_size)
        relative=f"app/eigo-no-e/thumbs/{row['art']}.{entry['image']['sha256'][:12]}.webp"
        row['thumb']={'path':relative.removeprefix('app/'),'sha256':sha256(thumb),'source_sha256':entry['image']['sha256'],'width':thumb_size}
        thumb_outputs[relative]=thumb;bindings.append({'art':row['art'],'image_path':entry['image']['path'],'image_sha256':entry['image']['sha256'],'image_git_blob':entry['image']['git_blob_sha'],'thumbnail_path':relative,'thumbnail_sha256':sha256(thumb)})
        rows.append(row)
    if not rows:raise ValueError('No current, reviewed bilingual illustration scenes; refusing to replace the catalog with an empty one')
    rows.sort(key=lambda r:(r['r'],r['w'],r['art']))
    cats=category_memberships(rows)
    sources={'words_sha256':sha256(word_bytes),'scenes_sha256':sha256(scene_bytes),'illustration_index_sha256':sha256(index_bytes)}
    data={'schema':3,'build_version':BUILD_VERSION,'total_art':len(rows),'sources':sources,'categories':cats,'words':rows}
    script=('// Generated by build.py. Only current reviewed English illustration descriptions.\nwindow.EIGO_NO_E='+compact(data)+';\n').encode()
    report={'schema':1,'build_version':BUILD_VERSION,'sources':sources,'eligible':len(rows),'input_scenes':len(payload['entries']),'excluded':excluded,'categories':len(cats),'unclassified':sum(r['c']==['more/words'] for r in rows),'thumbnail':{'size':thumb_size,'quality':82,'method':4,'pillow':PILLOW_VERSION},'data_sha256':sha256(script),'bindings':bindings}
    outputs={'app/eigo-no-e/data.js':script,'app/eigo-no-e/build-manifest.json':(json.dumps(report,ensure_ascii=False,indent=2)+'\n').encode(),**thumb_outputs}
    html=root/'app/eigo-no-e.html'
    if html.exists():
        source=html.read_text(encoding='utf-8')
        updated,n=re.subn(r'eigo-no-e/data\.js(?:\?[^"\s]*)?',f"eigo-no-e/data.js?v={sha256(script)[:12]}",source)
        if n!=1:raise ValueError('Expected exactly one data.js reference in eigo-no-e.html')
        outputs['app/eigo-no-e.html']=updated.encode()
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
