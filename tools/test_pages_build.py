import tempfile,subprocess,sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent));from build_pages import build
with tempfile.TemporaryDirectory() as t:
 root=Path(t)/'repo';root.mkdir();subprocess.run(['git','init','-q',str(root)],check=True)
 files={'tools/pages-assets.template.js':Path('tools/pages-assets.template.js').read_text(),'app/index.html':'<!doctype html><html><head></head><body><img src="../assets/word/a.png"><script src="code.js"></script></body></html>','app/code.js':'const metadata={path:"assets/word/a.png"};','app/data/generated-etymon/words.json':'{"w":"test"}','assets/word/a.png':'unchanged image bytes','app/games/picture-words/scene-assets/a@abc.js':'packed original','work/etymopedia/foo.csv':'csv source','tools/secret.txt':'not runtime'}
 for n,s in files.items():p=root/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s)
 subprocess.run(['git','-C',str(root),'add','.'],check=True)
 report=build(root,Path(t)/'out','haibaratou/etymolingo','a'*40);out=Path(t)/'out'
 assert not (out/'assets/word/a.png').exists() and not (out/'app/games/picture-words/scene-assets/a@abc.js').exists()
 assert (root/'assets/word/a.png').read_text()=='unchanged image bytes'
 assert (out/'app/code.js').read_bytes()==(root/'app/code.js').read_bytes()
 assert 'https://raw.githubusercontent.com/haibaratou/etymolingo/'+'a'*40+'/assets/word/a.png' in (out/'app/index.html').read_text()
 assert '<head><script src="../pages-assets.js"></script>' in (out/'app/index.html').read_text()
 assert not (out/'tools/secret.txt').exists()
 subprocess.run(['node','--check',str(out/'pages-assets.js')],check=True)
 print('PASS staged runtime, immutable media, unchanged dictionary/JS, no source deletion')
