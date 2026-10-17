"""Dates are optional, independent evidence bound to the observed PNG hash.

A catalog's previous date, a filename-only ledger, file mtime and Git import
dates are not creation evidence. Missing/stale evidence produces unknown dates.
"""
import datetime,json,pathlib,re

EVIDENCE_RELATIVE='work/etymopedia/image_content_evidence.json'
def load_evidence(root,inventory):
 path=pathlib.Path(root)/EVIDENCE_RELATIVE
 if not path.exists():return {},None
 raw=path.read_bytes();payload=json.loads(raw)
 if payload.get('schema')!=1 or not isinstance(payload.get('entries'),list):raise ValueError('Unsupported hash-bound date evidence schema')
 accepted={}
 for row in payload['entries']:
  if not isinstance(row,dict):continue
  name=row.get('path','');art=pathlib.PurePosixPath(name).stem
  if name!='assets/word/'+art+'.png'or art not in inventory or row.get('sha256')!=inventory[art]['sha256']:continue
  source=row.get('source',{})
  if row.get('kind')not in ('generation_execution','existed_by')or source.get('type')not in ('generation_record','content_snapshot'):continue
  # Never accept a derived game/catalog as the source of its own date.
  origin=str(source.get('path','')).replace('\\','/').lower()
  if not origin or 'catalog' in origin or 'updated-art.json'in origin or 'generated-image-'in origin:continue
  if not re.fullmatch(r'[0-9a-f]{64}',str(source.get('sha256',''))):continue
  try:stamp=datetime.datetime.fromisoformat(row['timestamp'].replace('Z','+00:00'))
  except (KeyError,ValueError,TypeError):continue
  if not stamp.tzinfo:continue
  accepted.setdefault(art,[]).append(dict(row,timestamp=stamp.astimezone(datetime.timezone.utc).isoformat()))
 return accepted,raw
def apply_evidence(assets,evidence):
 for asset in assets:
  rows=evidence.get(asset['art'],[])
  # Discard legacy/resolver dates; the current observed hash is the authority.
  asset['recordedUpdatedAt']=[r['timestamp']for r in rows if r['kind']=='generation_execution']
  asset['imageDateProvenance']={'source':'hash_bound_independent_evidence','evidence':rows}if rows else {'source':'unknown','reason':'no_independent_evidence_for_current_png_hash'}
