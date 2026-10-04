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
 def issue(self):
  return {'w':'cat','p':[],'art':'cat','imageSha256':self.images['cat']['sha256'],'senseSha256':C.sense_of(self.words[0])['sha256'],'codes':['visual_or_caption_ambiguity'],'detail':'A plausible cat image; caption remains held.','status':'held'}
 def scope(self,issue):
  return {**{k:copy.deepcopy(issue[k]) for k in ['w','p','art','imageSha256','senseSha256']},'schema':1,'status':'reviewed','scope':'caption_only','blocksPlay':False,'targetIssueSha256':C.issue_digest(issue),'reviewed_at':'2026-10-04T17:00:00Z','reason':'Exact image remains independently suitable for play.','evidence':{'source':'fixture-pixel-review','reviewer':'independent-fixture-reviewer','observation':'The current image plausibly shows a cat; no caption is accepted.','imageInspected':True}}
 def held_row(self,issues,scopes=None,resolutions=None):
  dump(self.root/'app/data/generated-image-issues.json',{'issues':issues,'scope_reviews':scopes or [],'resolutions':resolutions or []})
  rows,_,packs,_=C.build_catalog_rows(self.root)
  row=next(r for r in rows if r['en']=='cat')
  self.assertEqual(len(rows),3);self.assertEqual(row['description']['status'],'held');self.assertEqual(row['description']['en'],'');self.assertEqual(row['description']['ja'],'');self.assertFalse(row['description']['ttsAllowed']);self.assertNotIn('reviewedScene',row);self.assertNotIn('sceneAsset',row);self.assertEqual(packs,{})
  return row
 def test_caption_only_scope_keeps_identity_playability_and_caption_hold(self):
  issue=self.issue();scope=self.scope(issue);before=copy.deepcopy(issue)
  self.scenes=[self.reviewed()];self.save()
  row=self.held_row([issue],[scope]);self.assertTrue(row['availability']['en']['playable']);self.assertTrue(row['availability']['ja']['playable']);self.assertEqual(row['availability']['en']['reason'],'');self.assertEqual(row['issues'][0]['scope'],'caption_only');self.assertIs(row['issues'][0]['blocksPlay'],False);self.assertEqual(row['issues'][0]['scopeReview'],scope);self.assertEqual(issue,before)
 def test_valid_caption_or_another_scoped_issue_cannot_clear_a_hard_hold(self):
  issue=self.issue();hard={**issue,'codes':['image_first_sense_mismatch'],'detail':'Current pixels have the wrong meaning.'}
  self.scenes=[self.reviewed()];self.save()
  row=self.held_row([issue,hard],[self.scope(issue)]);self.assertFalse(row['availability']['en']['playable']);self.assertFalse(row['availability']['ja']['playable']);self.assertEqual(row['availability']['en']['reason'],'image_first_sense_mismatch');self.assertIs(row['issues'][1]['blocksPlay'],True)
 def test_flags_on_original_issue_are_not_a_review(self):
  issue={**self.issue(),'blocksPlay':False,'scope':'caption_only'}
  row=self.held_row([issue]);self.assertFalse(row['availability']['en']['playable']);self.assertEqual(row['issues'][0]['scope'],'play_blocking')
 def test_malformed_or_forged_scope_reviews_fail_closed(self):
  issue=self.issue();scope=self.scope(issue)
  mutations=[lambda s:s.update(schema=True),lambda s:s.update(status='candidate'),lambda s:s.update(scope='other'),lambda s:s.update(blocksPlay=0),lambda s:s.update(blocksPlay='false'),lambda s:s.update(targetIssueSha256='f'*64),lambda s:s.update(w='dog'),lambda s:s.update(p=['new-root']),lambda s:s.update(art='other'),lambda s:s.update(imageSha256='f'*64),lambda s:s.update(senseSha256='f'*64),lambda s:s.update(reviewed_at='yesterday'),lambda s:s.update(reviewed_at='2026-10-04'),lambda s:s.update(reason=' '),lambda s:s.pop('evidence'),lambda s:s['evidence'].update(imageInspected=False),lambda s:s['evidence'].update(reviewer=''),lambda s:s['evidence'].update(source=''),lambda s:s['evidence'].update(observation='')]
  for mutate in mutations:
   with self.subTest(mutation=mutations.index(mutate)):
    invalid=copy.deepcopy(scope);mutate(invalid);self.assertFalse(self.held_row([issue],[invalid])['availability']['en']['playable'])
  for invalid in [None,True,'caption_only',[]]:
   with self.subTest(invalid=invalid):self.assertFalse(self.held_row([issue],[invalid])['availability']['en']['playable'])
 def test_latest_review_can_revoke_scope_without_rewriting_history(self):
  issue=self.issue();scope=self.scope(issue);revoke={**scope,'scope':'play_blocking','blocksPlay':True,'reason':'Fresh review found a mismatch.'}
  self.assertFalse(self.held_row([issue],[scope,revoke])['availability']['en']['playable'])
  self.assertTrue(self.held_row([issue],[scope,revoke,scope])['availability']['en']['playable'])
 def test_changed_issue_fingerprint_invalidates_the_review(self):
  issue=self.issue();scope=self.scope(issue)
  for changed in [{**issue,'detail':'A new issue detail.'},{**issue,'codes':['image_first_sense_mismatch']},{**issue,'status':'needs_review'}]:
   self.assertFalse(self.held_row([changed],[scope])['availability']['en']['playable'])
 def test_empty_or_malformed_issue_codes_cannot_silently_clear_a_hold(self):
  issue=self.issue();scope=self.scope(issue)
  for codes in [[],None,'visual_or_caption_ambiguity',['']]:
   with self.subTest(codes=codes),self.assertRaisesRegex(ValueError,'Issue must retain'):
    self.held_row([{**issue,'codes':codes}],[scope])
 def test_changed_current_image_meaning_root_or_art_requires_fresh_scope(self):
  issue=self.issue();scope=self.scope(issue);word=self.words[0];image=self.images['cat'];sense=C.sense_of(word)
  for current_word,current_art,current_image,current_sense in [({**word,'w':'dog'},'cat',image,sense),({**word,'p':['other']},'cat',image,C.sense_of({**word,'p':['other']})),(word,'cat@other',image,sense),(word,'cat',{**image,'sha256':'f'*64},sense),({**word,'en':'other'},'cat',image,C.sense_of({**word,'en':'other'}))]:
   self.assertIsNone(C.caption_only_scope(issue,[scope],current_word,current_art,current_image,current_sense))
  self.words[0]['en']='feline';self.save();self.assertFalse(self.held_row([issue],[scope])['availability']['en']['playable'])
 def test_three_existing_repair_resolutions_are_byte_equivalent_records(self):
  ledger=json.loads((ROOT/'app/data/generated-image-issues.json').read_text())
  self.assertGreaterEqual(len(ledger['resolutions']),3)
  self.assertEqual(C.issue_digest(ledger['resolutions'][:3]),'77663d0bcc428dfabadd109dd3efd126b62877e1bac86a8caf9b1a49797e8450')
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
