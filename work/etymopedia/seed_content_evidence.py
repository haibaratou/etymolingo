"""Import verified generation-execution evidence, matching current PNG bytes.

Never consumes a filename-only date ledger or a previous generated catalog.
"""
import argparse,csv,datetime,hashlib,json,pathlib
from workflow_io import atomic,compact
def seed(verified_csv,generation_log,assets,output):
 log_bytes=generation_log.read_bytes();log_sha=hashlib.sha256(log_bytes).hexdigest();verified_sha=hashlib.sha256(verified_csv.read_bytes()).hexdigest();records=[json.loads(x)for x in log_bytes.decode('utf-8').splitlines()if x.strip()]
 prior=output.read_bytes()if output.exists()else None;data=json.loads(prior)if prior else {'schema':1,'entries':[]}
 if data.get('schema')!=1 or not isinstance(data.get('entries'),list):raise ValueError('Unsupported evidence schema')
 seen={compact(r)for r in data['entries']};added=0;skipped=0
 with verified_csv.open(encoding='utf-8-sig',newline='')as f:
  for r in csv.DictReader(f):
   target=assets/r['adopted_filename'];line=int(r['generation_record_line']);record=records[line-1]
   if r['source_to_current_transform_verified']!='True'or not target.is_file()or pathlib.PureWindowsPath(r['adopted_filename']).name!=r['adopted_filename']:skipped+=1;continue
   digest=hashlib.sha256(target.read_bytes()).hexdigest()
   if digest!=r['current_sha256']or record.get('sha256')!=digest or float(record['saved_at'])!=float(r['saved_at_epoch']):skipped+=1;continue
   entry={'path':'assets/word/'+r['adopted_filename'],'sha256':digest,'kind':'generation_execution','timestamp':datetime.datetime.fromtimestamp(float(record['saved_at']),datetime.timezone.utc).isoformat(),'timestamp_interpretation':'execution save event, not exact API creation time','source':{'type':'generation_record','path':str(generation_log),'sha256':log_sha,'line':line,'source_to_output_transform_verified':True,'verification_csv_sha256':verified_sha}}
   encoded=compact(entry)
   if encoded not in seen:data['entries'].append(entry);seen.add(encoded);added+=1
 atomic(output,compact(data),prior);return {'added':added,'skipped_changed_or_unverified':skipped,'entries':len(data['entries'])}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--verified-csv',required=True,type=pathlib.Path);p.add_argument('--generation-log',required=True,type=pathlib.Path);p.add_argument('--assets',required=True,type=pathlib.Path);p.add_argument('--output',type=pathlib.Path,default=pathlib.Path(__file__).with_name('image_content_evidence.json'));a=p.parse_args();print(json.dumps(seed(a.verified_csv,a.generation_log,a.assets,a.output)))
