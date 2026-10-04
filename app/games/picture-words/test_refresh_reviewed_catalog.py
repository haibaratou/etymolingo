"""Generated-image producer tests: missing descriptions never remove images."""
import base64,copy,hashlib,json,os,sys,tempfile,unittest
from pathlib import Path
import refresh_reviewed_catalog as R
ROOT=Path(os.environ.get('PICTURE_WORDS_TEST_ROOT',Path(__file__).resolve().parents[3]));sys.path.insert(0,str(ROOT/'app/data'))
import build_generated_image_catalog as C

def dump(path,x):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(x,ensure_ascii=False))
def catalog(files):s=files['catalog.js'].decode().split('window.PICTURE_WORDS_CATALOG = ',1)[1];return json.JSONDecoder().raw_decode(s)[0]
class ProducerTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup);self.root=Path(self.temp.name)
  self.words=[{'w':'cat','p':[],'ja':'ねこ','en':'cat','pos':'名','r':1},{'w':'I','p':['eg'],'ja':'私','en':'first person','pos':'代','r':2,'ja_readings':[{'gloss':'私','kana':'わたし','status':'candidate'}]}]
  self.images={};self.root.joinpath('assets/word').mkdir(parents=True)
  png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6d0AAAAASUVORK5CYII=')
  for art in ['cat','i','unbound']:
   (self.root/f'assets/word/{art}.png').write_bytes(png);self.images[art]={'path':f'assets/word/{art}.png','sha256':C.digest(png),'git_blob_sha':C.blob(png)}
  (self.root/'assets/word/illustration-index.js').write_text('globalThis.ETYMON_WORD_ART = '+json.dumps({'["I","eg"]':'i'})+';')
  g=self.root/R.GAME;g.mkdir(parents=True);(g/'build_catalog.py').write_text('LEDGER_SENSE_ART=[]\nLEGACY_CHOICES=[]\n');dump(g/'updated-art.json',[])
  dump(self.root/'app/data/generated-image-legacy-ids.json',{'schema':1,'rows':[]});dump(self.root/'app/data/generated-image-issues.json',{'schema':1,'issues':[]});self.scenes=[];self.save()
 def save(self):
  gen=self.root/C.GEN;dump(gen/'words.json',self.words);dump(gen/'illustration-scenes.json',{'schema':1,'entries':self.scenes});dump(gen/'manifest.json',{'files':{k:{'sha256':C.digest((gen/f).read_bytes())} for k,f in [('words','words.json'),('illustration_scenes','illustration-scenes.json')]}})
  # Report fingerprints name current producer sources; fixtures carry exact originals.
  for file in ['generated_image_resolver.py','build_generated_image_catalog.py']:
   (self.root/'app/data'/file).write_bytes((ROOT/'app/data'/file).read_bytes())
 def reviewed(self):
  w=self.words[0];return {'w':w['w'],'p':[],'art':'cat','sense':C.sense_of(w),'scene':{'en':'A cat sits on a chair.','ja':'ねこがいすに座っている。'},'image':self.images['cat'],'status':'reviewed','review':{'status':'reviewed'}}
 def test_all_images_present_without_any_caption(self):
  rows,meta,_,_=C.build_catalog_rows(self.root);self.assertEqual(len(rows),3);self.assertEqual(meta['wordEntryCount'],2);self.assertEqual(meta['descriptionCounts'],{'missing':3});self.assertTrue(next(r for r in rows if r['en']=='I')['availability']['en']['playable'])
 def test_caption_addition_changes_status_not_membership(self):
  old,_,_,_=C.build_catalog_rows(self.root);self.scenes=[self.reviewed()];self.save();new,_,packs,_=C.build_catalog_rows(self.root);self.assertEqual([r['id'] for r in old],[r['id'] for r in new]);self.assertEqual(len(packs),1);self.assertEqual(next(r for r in new if r['en']=='cat')['description']['status'],'reviewed')
 def test_stale_sense_disables_only_caption(self):
  self.scenes=[self.reviewed()];self.words[0]['en']='feline';self.save();rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertEqual(r['description']['status'],'stale');self.assertEqual(r['description']['en'],'');self.assertTrue(r['availability']['en']['playable'])
 def test_candidate_japanese_is_not_promoted(self):
  rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='I');self.assertFalse(r['availability']['ja']['playable']);self.assertEqual(r['w'],'')
 def test_unknown_asset_has_no_fake_headword(self):
  rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['pic']=='unbound');self.assertEqual(r['bindingStatus'],'ownership_pending');self.assertEqual(r['en'],'');self.assertFalse(r['availability']['en']['playable'])
 def test_current_hash_bound_hold_quarantines_without_hiding(self):
  w=self.words[0];dump(self.root/'app/data/generated-image-issues.json',{'issues':[{'w':'cat','p':[],'art':'cat','imageSha256':self.images['cat']['sha256'],'senseSha256':C.sense_of(w)['sha256'],'codes':['image_first_sense_mismatch'],'detail':'fixture'}]});rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertFalse(r['availability']['en']['playable']);self.assertEqual(r['description']['status'],'held')
 def test_changed_image_does_not_clear_known_hold(self):
  w=self.words[0];dump(self.root/'app/data/generated-image-issues.json',{'issues':[{'w':'cat','p':[],'art':'cat','imageSha256':'0'*64,'senseSha256':C.sense_of(w)['sha256'],'codes':['image_first_sense_mismatch'],'detail':'previous image issue'}]});rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertFalse(r['availability']['en']['playable']);self.assertEqual(r['issues'][0]['code'],'known_issue_needs_review')
 def test_explicit_exact_resolution_clears_previous_hold(self):
  w=self.words[0];dump(self.root/'app/data/generated-image-issues.json',{'issues':[{'w':'cat','p':[],'art':'cat','imageSha256':'0'*64,'senseSha256':C.sense_of(w)['sha256'],'codes':['image_first_sense_mismatch'],'detail':'previous image issue'}],'resolutions':[{'w':'cat','p':[],'art':'cat','imageSha256':self.images['cat']['sha256'],'senseSha256':C.sense_of(w)['sha256'],'reason':'actual current pixels explicitly accepted','reviewed_at':'2026-10-04','resolvesIssueSha256':[C.issue_digest({'w':'cat','p':[],'art':'cat','imageSha256':'0'*64,'senseSha256':C.sense_of(w)['sha256'],'codes':['image_first_sense_mismatch'],'detail':'previous image issue'})]}]});rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertTrue(r['availability']['en']['playable'])
 def test_long_vowel_mark_only_is_not_an_answer(self):
  self.words[0]['ja']='ーー';self.save();rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertFalse(r['availability']['ja']['playable'])
 def test_one_kana_literal_answer_is_allowed_without_inference(self):
  self.words[0]['ja']='ね';self.save();rows,_,_,_=C.build_catalog_rows(self.root);r=next(r for r in rows if r['en']=='cat');self.assertEqual(r['w'],'ね');self.assertTrue(r['availability']['ja']['playable'])
 def test_empty_snapshot_is_valid_and_deterministic(self):
  self.words=[];self.save()
  for p in (self.root/'assets/word').glob('*.png'):p.unlink()
  a=C.build_catalog_rows(self.root);b=C.build_catalog_rows(self.root);self.assertEqual(a,b);self.assertEqual(a[0],[])
 def test_html_rebind_changes_only_catalog_token(self):
  raw=b'<body data-x="keep"><script src="picture-words/catalog.js?v=old"></script></body>';out=R.bind_catalog_html(raw,b'data');self.assertEqual(out,raw.replace(b'v=old',b'v='+R.sha256(b'data')[:12].encode()))
if __name__=='__main__':unittest.main()
