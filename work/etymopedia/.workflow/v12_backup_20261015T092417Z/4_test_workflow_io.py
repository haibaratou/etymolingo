import csv,hashlib,importlib.util,io,json,pathlib,shutil,tempfile,unittest
from unittest.mock import patch
from PIL import Image
import workflow_io as w

class WorkflowTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory(dir=pathlib.Path(__file__).resolve().parent);self.addCleanup(self.temp.cleanup);self.root=pathlib.Path(self.temp.name);self.csv=self.root/'targets.csv';self.source=self.root/'source';(self.source/'tools').mkdir(parents=True)
  shutil.copyfile(w.SOURCE/'tools/illustration_scenes.py',self.source/'tools/illustration_scenes.py')
  with (self.source/'tools/word-art-todo.csv').open('w',encoding='utf-8-sig',newline='')as f:
   a=csv.DictWriter(f,fieldnames=['ファイル名','単語','語根','語義','英語']);a.writeheader();a.writerow({'ファイル名':'balloon.png','単語':'balloon','語根':'root2+root1','語義':'風船','英語':'inflated bag'})
  self.row={'identity':'stable-1','word':'balloon','roots':'root2+root1','filename':'balloon.png','ja':'風船','en':'inflated bag','prompt':'Subject: balloon. Composition: One round balloon.','workflow_status':'ready','unknown_user_column':'KEEP EXACTLY'}
  self.write_rows([self.row]);self.image=self.root/'generated.png';Image.new('RGBA',(512,512),(20,50,80,0)).save(self.image);self.assets=self.root/'assets';self.assets.mkdir();self.canonical=self.root/'scenes.json';self.manifest=self.root/'import_manifest.json'
 def write_rows(self,rows):
  with self.csv.open('w',encoding='utf-8-sig',newline='')as f:a=csv.DictWriter(f,fieldnames=list(rows[0]));a.writeheader();a.writerows(rows)
 def session(self,role):return w.begin(self.csv,role,w.sha(self.csv.read_bytes()))['token']
 def values(self):
  b=self.image.read_bytes();return {'制作状態':'reviewed','画像保存先':str(self.image),'実行プロンプト':self.row['prompt'],'解説英語':'A round balloon floats above the ground.','解説日本語':'丸い風船が地面の上に浮かんでいる。','画像SHA256':w.sha(b),'画像GitBlobSHA':w.blob(b),'検品日時':'2026-10-15T09:00:00+00:00','検品方法':'human inspected actual saved PNG against first sense','検品メモ':'Actual image and both sentences inspected; fixture evidence only.'}
 def reviewed(self):
  t=self.session('works');w.record(self.csv,t,'stable-1',self.values(),self.source);w.end(self.csv,t)
 def test_exclusive_role_and_unchanged_values(self):
  token=self.session('works')
  with self.assertRaises(RuntimeError):self.session('dot')
  with self.assertRaises(PermissionError):w.append(self.csv,token,[])
  w.record(self.csv,token,'stable-1',self.values(),self.source);_,fields,rows=w.read_csv(self.csv)
  for k,v in self.row.items():self.assertEqual(rows[0][k],v)
  self.assertEqual(fields[:len(self.row)],list(self.row));self.assertEqual(rows[0]['制作状態'],'reviewed');w.end(self.csv,token)
 def test_concurrent_external_edit_is_not_overwritten(self):
  token=self.session('works');self.csv.write_bytes(self.csv.read_bytes()+b'\r\n');new=self.csv.read_bytes()
  with self.assertRaises(RuntimeError):w.record(self.csv,token,'stable-1',self.values(),self.source)
  self.assertEqual(new,self.csv.read_bytes())
 def test_wrong_caption_and_missing_review_evidence_fail(self):
  token=self.session('works');before=self.csv.read_bytes();v=self.values();v['解説英語']='A round ball floats.'
  with self.assertRaises(ValueError):w.record(self.csv,token,'stable-1',v,self.source)
  self.assertEqual(before,self.csv.read_bytes());v=self.values();v['検品方法']=''
  with self.assertRaises(ValueError):w.record(self.csv,token,'stable-1',v,self.source)
 def test_image_replacement_requires_new_hash(self):
  token=self.session('works');v=self.values();Image.new('RGBA',(512,512),(10,20,30,10)).save(self.image)
  with self.assertRaises(ValueError):w.record(self.csv,token,'stable-1',v,self.source)
 def test_root_order_and_source_drift_are_not_silently_changed(self):
  r=self.row.copy();r['roots']='root1+root2';self.write_rows([r]);t=self.session('works')
  with self.assertRaises(ValueError):w.record(self.csv,t,'stable-1',self.values(),self.source)
 def test_windows_filename_collision(self):
  t=self.session('dot');r=self.row.copy();r['identity']='stable-2';r['filename']='BALLOON.png'
  with self.assertRaises(ValueError):w.append(self.csv,t,[r])
 def test_pair_import_and_idempotent_recovery(self):
  self.reviewed();(self.assets/'balloon.png').write_bytes(self.image.read_bytes());baseline=w.baseline(self.csv,self.canonical,self.assets);t=self.session('importer');result=w.apply_reviewed(self.csv,t,self.canonical,self.assets,baseline,self.manifest,self.source)
  self.assertEqual(result[0]['status'],'applied');self.assertEqual((self.assets/'balloon.png').read_bytes(),self.image.read_bytes());data=json.loads(self.canonical.read_bytes());self.assertEqual(data['entries'][0]['p'],['root2','root1']);self.assertEqual(w.read_csv(self.csv)[2][0]['制作状態'],'applied')
  self.assertTrue(list((self.root/'backups').glob('*')));w.end(self.csv,t)
  # Simulate interruption after canonical save but before CSV state save.
  rows=w.read_csv(self.csv)[2];rows[0]['制作状態']='reviewed';self.write_rows(rows);t=self.session('importer');before=self.canonical.read_bytes();result=w.apply_reviewed(self.csv,t,self.canonical,self.assets,baseline,self.manifest,self.source);self.assertEqual(result[0]['status'],'already_applied');self.assertEqual(before,self.canonical.read_bytes());self.assertEqual(w.read_csv(self.csv)[2][0]['制作状態'],'applied')
 def test_stale_baseline_preserves_another_edit(self):
  self.reviewed();baseline=w.baseline(self.csv,self.canonical,self.assets);self.canonical.write_text(json.dumps({'schema':1,'entries':[{'w':'balloon','p':['root2','root1'],'art':'balloon','other_editor':'keep'}]}),encoding='utf-8');before=self.canonical.read_bytes();t=self.session('importer');result=w.apply_reviewed(self.csv,t,self.canonical,self.assets,baseline,self.manifest,self.source);self.assertEqual(result[0]['status'],'skipped');self.assertEqual(before,self.canonical.read_bytes());self.assertFalse((self.assets/'balloon.png').exists())
 def test_canonical_failure_never_writes_official_image(self):
  self.reviewed();old=self.image.read_bytes();(self.assets/'balloon.png').write_bytes(old);base=w.baseline(self.csv,self.canonical,self.assets);t=self.session('importer');original=w.atomic
  def fail(path,*args):
   if path==self.canonical:raise OSError('simulated write failure')
   return original(path,*args)
  with patch.object(w,'atomic',side_effect=fail):result=w.apply_reviewed(self.csv,t,self.canonical,self.assets,base,self.manifest,self.source)
  self.assertEqual(result[0]['status'],'skipped');self.assertEqual((self.assets/'balloon.png').read_bytes(),old);self.assertFalse(self.canonical.exists())
 def test_before_user_copy_does_not_adopt_caption_or_write_image(self):
  self.reviewed();target=self.assets/'balloon.png';old=b'existing official image';target.write_bytes(old);base=w.baseline(self.csv,self.canonical,self.assets);t=self.session('importer');result=w.apply_reviewed(self.csv,t,self.canonical,self.assets,base,self.manifest,self.source)
  self.assertEqual(result[0]['status'],'skipped');self.assertIn('Awaiting user inspection',result[0]['reason']);self.assertEqual(target.read_bytes(),old);self.assertFalse(self.canonical.exists());self.assertEqual(w.read_csv(self.csv)[2][0]['制作状態'],'reviewed')
if __name__=='__main__':unittest.main()
