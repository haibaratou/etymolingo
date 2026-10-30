"""Build a read-only compact basics index from public mother exports, never private pie files.
Dictionary-source provenance remains unverified unless a separate reviewed profile supplies it.
"""
from pathlib import Path
import argparse,json,unicodedata,gzip,base64,hashlib,subprocess,re

def build(words,shards,commit):
 by_index={};holds=[];digests={}
 for letter,raw in shards.items():
  digests[letter]=hashlib.sha256(raw).hexdigest()
  for id,v in json.loads(raw).items():
   if not str(id).isdigit() or not isinstance(v,list) or len(v)<7:continue
   i=int(id)
   if i>=len(words) or unicodedata.normalize('NFC',words[i]['w'])!=unicodedata.normalize('NFC',v[3]):holds.append({'shard':letter,'record':str(id)});continue
   by_index[i]={'phonetic':str(v[4] or ''),'kana':str(v[5] or ''),'syllables':str(v[6] or ''),'record':str(id),'shard':letter}
 entries=[]
 for i,w in enumerate(words):
  e={k:w.get(k,[] if k=='p' else '') for k in ['w','p','ja','en','pos']};e['dictionaryIndex']=i;e.update(by_index.get(i,{}));entries.append(e)
 return {'schema':1,'sourceCommit':commit,'sourcePath':'app/data/generated-etymon/','sourceStatus':'legacy_unverified','shardSha256':digests,'entries':entries,'identityHolds':holds}
def script(data):
 raw=json.dumps(data,ensure_ascii=False,separators=(',',':')).encode();packed=base64.b64encode(gzip.compress(raw,mtime=0)).decode()
 return 'window.ETYMON_DICTIONARY_BASICS_GZIP='+json.dumps({'schema':1,'encoding':'gzip-base64','data':packed},separators=(',',':'))+';\n'
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);a=p.parse_args();gen=a.root/'app/data/generated-etymon';words=json.loads((gen/'words.json').read_bytes());commit=subprocess.check_output(['git','-C',str(a.root),'rev-parse','HEAD'],text=True).strip()
 dirty=subprocess.check_output(['git','-C',str(a.root),'status','--porcelain','--','app/data/generated-etymon/words.json','app/data/generated-etymon/det'],text=True).strip();commit=None if dirty else commit
 d=build(words,{f.stem:f.read_bytes() for f in (gen/'det').glob('*.json')},commit);raw=script(d);(gen/'dictionary-basics.js').write_text(raw);digest=hashlib.sha256(raw.encode()).hexdigest()[:12]
 for name in ['app/pictlingo-dictionary.html','app/eigo-no-e.html']:
  html=a.root/name
  if html.exists():html.write_text(re.sub(r'data/generated-etymon/dictionary-basics\.js(?:\?[^"\s]*)?','data/generated-etymon/dictionary-basics.js?v='+digest,html.read_text()))
 print('Dictionary basics:',len(d['entries']),'records; identity holds:',len(d['identityHolds']))
