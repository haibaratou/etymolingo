import datetime,json,pathlib,tempfile,unittest
from image_content_evidence import load_evidence,apply_evidence
class EvidenceTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory(dir=pathlib.Path(__file__).resolve().parent);self.addCleanup(self.temp.cleanup);self.root=pathlib.Path(self.temp.name);self.file=self.root/'work/etymopedia/image_content_evidence.json';self.file.parent.mkdir(parents=True);self.inv={'blood':{'sha256':'a'*64}};self.entry={'path':'assets/word/blood.png','sha256':'a'*64,'kind':'generation_execution','timestamp':'2026-10-04T10:00:00+09:00','source':{'type':'generation_record','path':'independent-execution-log.jsonl','sha256':'b'*64}}
 def write(self,entry):self.file.write_text(json.dumps({'schema':1,'entries':[entry]}))
 def test_missing_evidence_and_missing_retired_table_work(self):
  result,raw=load_evidence(self.root,self.inv);self.assertEqual(result,{});a=[{'art':'blood','recordedUpdatedAt':['2099-01-01T00:00:00Z']}];apply_evidence(a,result);self.assertEqual(a[0]['recordedUpdatedAt'],[]);self.assertEqual(a[0]['imageDateProvenance']['source'],'unknown')
 def test_current_hash_required_and_catalog_is_never_date_source(self):
  for changes in [{'sha256':'c'*64},{'source':{'type':'generation_record','path':'previous-catalog.js','sha256':'b'*64}},{'timestamp':'2026-10-04'}]:
   self.write(self.entry|changes);self.assertEqual(load_evidence(self.root,self.inv)[0],{})
 def test_valid_execution_evidence_and_existed_by_distinction(self):
  self.write(self.entry);d,_=load_evidence(self.root,self.inv);a=[{'art':'blood'}];apply_evidence(a,d);self.assertEqual(a[0]['recordedUpdatedAt'],['2026-10-04T01:00:00+00:00'])
  self.write(self.entry|{'kind':'existed_by'});d,_=load_evidence(self.root,self.inv);apply_evidence(a,d);self.assertEqual(a[0]['recordedUpdatedAt'],[]);self.assertEqual(len(a[0]['imageDateProvenance']['evidence']),1)
 def test_full_catalog_build_without_retired_table(self):
  from PIL import Image
  import build_generated_image_catalog as builder
  def write(name,value):
   p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True);data=json.dumps(value,ensure_ascii=False,separators=(',',':')).encode();p.write_bytes(data);return data
  words=write('app/data/generated-etymon/words.json',[]);scenes=write('app/data/generated-etymon/illustration-scenes.json',{'schema':1,'entries':[]});write('app/data/generated-etymon/manifest.json',{'files':{'words':{'sha256':builder.digest(words)},'illustration_scenes':{'sha256':builder.digest(scenes)}}})
  dest=self.root/'assets/word';dest.mkdir(parents=True);Image.new('RGBA',(512,512),(10,30,40,0)).save(dest/'unbound.png');(dest/'illustration-index.js').write_text('window.INDEX = {};',encoding='utf-8')
  for name,value in [('app/support/picture-words/updated-art.json',[]),('app/data/generated-image-legacy-ids.json',{'rows':[]}),('app/data/generated-image-issues.json',{'issues':[]}),('app/data/puzzle-ja-answers.json',{'rows':[]})]:write(name,value)
  for name in ['app/data/generated_image_resolver.py','app/data/build_generated_image_catalog.py']:(self.root/name).write_text('# fixture hash input',encoding='utf-8')
  (self.root/'app/support/picture-words/build_catalog.py').write_text('LEDGER_SENSE_ART=[]\nLEGACY_CHOICES=[]\n',encoding='utf-8')
  self.assertFalse((self.root/'work/etymopedia/png_creation_dates.csv').exists());rows,meta,packs,report=builder.build_catalog_rows(self.root,include_packs=False);self.assertEqual(len(rows),1);self.assertEqual(rows[0]['pic'],'unbound');self.assertIsNone(rows[0]['recordedUpdatedAt']);self.assertFalse(rows[0]['updatedArt']);self.assertIsNone(meta['imageDateEvidenceSha256'])
if __name__=='__main__':unittest.main()
