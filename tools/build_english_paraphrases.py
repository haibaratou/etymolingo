"""Compile explicitly reviewed English meanings; structural checks do not approve semantics."""
from pathlib import Path
import json,hashlib,argparse,collections
EXPECTED_WORDS_SHA='305562a11a2516f4265c86a652173386a85533e045302bc5c58aeb4de60b6040'
def compile_reviews(words,ledger):
 entries=[];holds=[];seen=set()
 for e in ledger['entries']:
  i=e.get('dictionaryIndex');reason=None
  if not isinstance(i,int) or not 0<=i<len(words):reason='dictionary_id_missing'
  else:
   w=words[i];identity=(e['w'],tuple(e['p']))
   if identity in seen:raise ValueError('Duplicate reviewed sense: '+e['w'])
   seen.add(identity)
   if (e['w'],e['p'],e['sourcePos'],e['senseJa'],e['sourceEnglish'])!=(w['w'],w['p'],w.get('pos',''),w['ja'].split('\u3001')[0],w.get('en','')):reason='canonical_sense_changed'
   elif e.get('status')!='sense_checked':reason=e.get('holdReason','editorial_hold')
   elif not e.get('text','').strip() or len(e['text'].split())<4:raise ValueError('Missing explanatory text: '+e['w'])
   elif not e.get('reviewProvenance',{}).get('reviewNote'):raise ValueError('Missing editorial provenance: '+e['w'])
   elif e.get('targetPos') not in w['pos'].split('/') and not e.get('sourcePosMismatch'):raise ValueError('Undocumented target POS disagreement: '+e['w'])
  if reason:holds.append({'w':e['w'],'p':e['p'],'dictionaryIndex':i,'reason':reason})
  else:entries.append(e)
 return entries,holds

def build(root,report):
 gen=root/'app/data/generated-etymon';raw=(gen/'words.json').read_bytes();source_sha=hashlib.sha256(raw).hexdigest()
 if source_sha!=EXPECTED_WORDS_SHA:raise ValueError('Canonical snapshot changed; recheck selected senses before updating profile')
 words=json.loads(raw);ledger=json.loads((root/'app/data/english-paraphrase-reviews.json').read_bytes())
 if ledger['sourceWordsSha256']!=source_sha:raise ValueError('Review ledger source differs')
 entries,holds=compile_reviews(words,ledger)
 data={'schema':1,'version':'english-meaning-v1','sourceWordsSha256':source_sha,'scope':'Explicit first-sense AI editorial assessments; incomplete coverage, no claim of external verification.','entries':entries}
 script='window.ETYMON_ENGLISH_PARAPHRASES='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n';(gen/'english-paraphrases.js').write_text(script,encoding='utf-8')
 methods=collections.Counter(e['method'] for e in entries)
 audit={'sourceRows':len(words),'nonemptyEnglish':sum(bool(w.get('en','').strip()) for w in words),'missingEnglish':sum(not w.get('en','').strip() for w in words),'displayApproved':len(entries),'editorialHolds':holds,'methodCounts':dict(methods),'notYetSenseChecked':len(words)-len(entries),'automaticBulkApproval':False,'semanticReviewType':'AI editorial assessment of canonical sense and POS; not external dictionary verification','structuralTestsAreNotSemanticVerification':True,'sourceWordsSha256':source_sha,'entries':entries}
 report.mkdir(parents=True,exist_ok=True);(report/'coverage.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in audit.items() if k not in ['entries','editorialHolds']}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--report-dir',type=Path,required=True);a=p.parse_args();build(a.root,a.report_dir)
