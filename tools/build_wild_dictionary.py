"""Build Wild Wordopia's read-only dictionary view from the existing mother export.
Run after export_public_game_data.py; never authors meanings or etymologies.
"""
import json, pathlib, unicodedata, hashlib, argparse

def build(repo):
    data=repo/'app/data/generated-etymon'
    roots=json.loads((data/'roots.json').read_text('utf-8-sig'))
    words=json.loads((data/'words.json').read_text('utf-8-sig'))
    catalog_text=(repo/'assets/chara/brainrot/site-characters.js').read_text('utf-8-sig')
    catalog=json.JSONDecoder().raw_decode(catalog_text.split('window.WILDWORDOPIA_SITE_CATALOG=',1)[1])[0]
    bykey={unicodedata.normalize('NFC',r['key']):r for r in roots}
    selected={}; aliases={}; unresolved=[]
    for c in catalog:
        candidates=[c.get('rootKey',''),c.get('root','').lstrip('*')]
        hits=[bykey[unicodedata.normalize('NFC',k)] for k in candidates if unicodedata.normalize('NFC',k) in bykey]
        if not hits: unresolved.append(c['id']);continue
        r=hits[0];key=r['key'];aliases[c['id']]=key
        selected[key]={k:r.get(k,'') for k in ['key','pie','ja','en','d','all']}
    if unresolved: raise ValueError('Unmapped character roots: '+','.join(unresolved))
    rows=[{k:w[k] for k in ['w','p','ja','en','b','r','g','pic'] if k in w} for w in words if any(p in selected for p in w.get('p',[]))]
    aliases.update({a:aliases[b] for a,b in {'men':'men1','bha':'bha2','genu':'genu1'}.items() if b in aliases})
    out={'roots':selected,'aliases':aliases,'words':rows,'source':'generated-etymon','sourceHashes':{f:hashlib.sha256((data/f).read_bytes()).hexdigest() for f in ['roots.json','words.json']}}
    target=repo/'app/data/wild-wordopia-dictionary.js';target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text('window.WILDWORDOPIA_DICTIONARY='+json.dumps(out,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n',encoding='utf-8')
    print(f'{len(selected)} roots, {len(rows)} word senses -> {target}')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('repo',nargs='?',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]);build(p.parse_args().repo)
