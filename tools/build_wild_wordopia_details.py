from pathlib import Path
import json,gzip,base64,hashlib
base=Path(__file__).resolve().parents[1]
def load(n):
 s=(base/n).read_text(encoding='utf-8'); return json.loads(s[s.index('{'):].rstrip(';\n')) if n.endswith('.js') else json.loads(s)
d=load('app/data/wild-wordopia-dictionary.js'); words=load('app/data/generated-etymon/words.json'); basics=load('app/data/generated-etymon/dictionary-basics.js'); basics=json.loads(gzip.decompress(base64.b64decode(basics['data'])))
key=lambda x:json.dumps([x['w'],x.get('p',[]),x.get('ja',''),x.get('en','')],ensure_ascii=False)
index={}
for i,x in enumerate(words):index.setdefault(key(x),[]).append((i,x))
bidx={x['dictionaryIndex']:x for x in basics['entries']}
rows=[]
for i,row in enumerate(words):
 if i not in bidx or any(bidx[i].get(k,'')!=row.get(k,'') for k in ['w','p','ja','en','pos']):
  raise ValueError('Dictionary basics identity differs at index '+str(i))
 detail={k:row[k] for k in ['w','p','ja','en','pos','g','gs','r','pre','suf','b','k','pic','pica'] if k in row}
 detail['dictionaryIndex']=i
 detail.update({k:bidx.get(i,{}).get(k,'') for k in ['phonetic','syllables','kana']})
 rows.append(detail)
extras=[]
roots={r['key']:r for r in load('app/data/generated-etymon/roots.json')}
sources=['app/data/wild-wordopia-dictionary.js','app/data/generated-etymon/words.json','app/data/generated-etymon/roots.json','app/data/generated-etymon/dictionary-basics.js']
out={'schema':1,'rows':rows,'extras':extras,'roots':roots,'aliases':d['aliases'],'sourceHashes':{p:hashlib.sha256((base/p).read_bytes()).hexdigest() for p in sources}}
payload=json.dumps(out,ensure_ascii=False,separators=(',',':')).encode()
env={'schema':1,'encoding':'gzip-base64','sha256':hashlib.sha256(payload).hexdigest(),'data':base64.b64encode(gzip.compress(payload,mtime=0)).decode()}
(base/'app/data/wild-wordopia-word-details.js').write_bytes(('window.WILDWORDOPIA_WORD_DETAILS_GZIP='+json.dumps(env,separators=(',',':'))+';\n').encode())
print(json.dumps({'rows':len(rows),'matched':sum(x is not None for x in rows),'missing':sum(x is None for x in rows),'extras':len(extras)}))
