import json,pathlib,subprocess,sys
from PIL import Image
manifest=pathlib.Path(sys.argv[2]); pairs=json.loads(manifest.read_text(encoding='utf-8'))
if sys.argv[1]=='prepare':
 out=Image.new('RGB',(1536,512*len(pairs)))
 for i,p in enumerate(pairs):
  subprocess.run([sys.executable,'-X','utf8','tmp/session_image_io.py','prepare',p['filename'],p['path']],check=True)
  with Image.open('tmp/session-review.png') as im:out.paste(im,(0,512*i))
 out.save('tmp/batch-review.png')
elif sys.argv[1]=='record':
 for p in pairs:
  a=[sys.executable,'-X','utf8','tmp/session_image_io.py','record',p['filename'],p['path'],*p['captions']]
  if p.get('edit'):a.append(p['edit'])
  r=subprocess.run(a,capture_output=True,text=True,encoding='utf-8')
  print(r.stdout.splitlines()[0] if r.returncode==0 else r.stderr,flush=True)
  assert r.returncode==0
