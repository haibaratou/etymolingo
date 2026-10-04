#!/usr/bin/env python3
"""Small synthetic fixtures plus optional real-output reproducibility check."""
import copy,hashlib,importlib.util,io,json,tempfile,unittest
from pathlib import Path
from PIL import Image
import build

def fixture(root):
    art=root/'assets/word';art.mkdir(parents=True)
    image=Image.new('RGBA',(16,16),(200,100,60,255));image.putpixel((0,0),(0,0,0,0));image.save(art/'book.png')
    raw=(art/'book.png').read_bytes()
    word={'w':'book','p':['root'],'ja':'本、予約する','en':'volume / reserve','pos':'名/動','r':2,'ja_readings':[{'gloss':'本','kana':'ほん','status':'reviewed'}]}
    entry={'w':'book','p':['root'],'art':'book','sense':{'index':0,'ja':'本','en':'volume','sha256':build.sense_digest('book',['root'],'本','volume')},'scene':{'en':'An open book rests on a wooden stand.','ja':'開いた本が木の台に置かれている。'},'image':{'path':'assets/word/book.png','sha256':build.sha256(raw),'git_blob_sha':build.git_blob(raw)},'review':{'status':'reviewed'},'status':'reviewed'}
    return word,entry

class EligibilityTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.word,self.entry=fixture(self.root)
    def tearDown(self):self.tmp.cleanup()
    def reason(self,entry=None,word=None,index=None):
        e=entry or self.entry;w=word or self.word
        return build.eligibility(e,{build.key(w):w},index or {},self.root)
    def test_valid(self):self.assertIsNone(self.reason())
    def test_exported_stale_excluded(self):self.entry['status']='stale_image';self.assertEqual(self.reason(),'not_reviewed')
    def test_editorial_unreviewed_excluded(self):self.entry['review']['status']='unreviewed';self.assertEqual(self.reason(),'not_reviewed')
    def test_wordnet_cannot_supply_description(self):self.entry['scene']['en']='';self.entry['d']='a volume of pages';self.assertEqual(self.reason(),'missing_english_description')
    def test_missing_japanese(self):self.entry['scene']['ja']='';self.assertEqual(self.reason(),'missing_japanese_description')
    def test_wrong_headword(self):self.entry['scene']['en']='An open volume rests on a wooden stand.';self.assertEqual(self.reason(),'headword_missing')
    def test_short_phrase_allowed(self):self.entry['scene']['en']='An open book.';self.assertIsNone(self.reason())
    def test_headword_only_excluded(self):self.entry['scene']['en']='This is a book.';self.assertEqual(self.reason(),'headword_only_description')
    def test_too_long(self):self.entry['scene']['en']='book '+'word '*18;self.assertEqual(self.reason(),'description_too_long')
    def test_canonical_japanese_first_sense(self):self.word['ja']='予約する、本';self.assertEqual(self.reason(),'stale_first_sense')
    def test_canonical_english_first_sense(self):self.word['en']='reserve / volume';self.assertEqual(self.reason(),'stale_first_sense')
    def test_root_identity(self):self.word['p']=['other'];self.assertEqual(self.reason(),'missing_canonical_identity')
    def test_sense_digest(self):self.entry['sense']['sha256']='0'*64;self.assertEqual(self.reason(),'invalid_sense_digest')
    def test_image_sha(self):self.entry['image']['sha256']='0'*64;self.assertEqual(self.reason(),'stale_image')
    def test_image_git_blob(self):self.entry['image']['git_blob_sha']='0'*40;self.assertEqual(self.reason(),'stale_image')
    def test_current_exception_mapping(self):self.assertEqual(self.reason(index={build.index_key(self.entry):'book@other'}),'stale_art_mapping')
    def test_unsafe_path(self):self.entry['image']['path']='../../outside.png';self.assertEqual(self.reason(),'invalid_image_path')
    def test_missing_image(self):(self.root/'assets/word/book.png').unlink();self.assertEqual(self.reason(),'missing_image')
    def test_no_gloss_override(self):self.word['ja']='本、予約する';self.assertIsNone(self.reason());self.assertEqual(build.first_senses(self.word),('本','volume'))
    def test_complete_reproducible_build(self):
        gen=self.root/'app/data/generated-etymon';gen.mkdir(parents=True)
        (gen/'words.json').write_text(json.dumps([self.word],ensure_ascii=False));(gen/'illustration-scenes.json').write_text(json.dumps({'schema':1,'entries':[self.entry]},ensure_ascii=False))
        (self.root/'assets/word/illustration-index.js').write_text('window.X={};')
        (self.root/'app/eigo-no-e.html').write_text('<script src="eigo-no-e/data.js?v=old"></script>')
        a,report=build.build(self.root);b,_=build.build(self.root)
        self.assertEqual(a,b);self.assertEqual(report['eligible'],1)
        text=a['app/eigo-no-e/data.js'].decode();self.assertNotIn('"d":',text);self.assertNotIn('"b":',text)
        data=json.loads(text[text.index('{'):text.rindex('}')+1]);row=data['words'][0]
        self.assertEqual(row['ja'],'本');self.assertEqual(row['k'],'ほん');self.assertIn('c',row)
        thumb=a['app/'+row['thumb']['path']];self.assertEqual(build.sha256(thumb),row['thumb']['sha256'])
    def test_unclassified_kept(self):
        rows=[{'id':'unclassified','art':'unclassified','w':'unclassified','r':1,'c':[]}]
        cats=build.category_memberships(rows);self.assertEqual(rows[0]['c'],['more/words']);self.assertEqual(cats[0]['subs'][0]['n'],1)

if __name__=='__main__':unittest.main()
