import sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import workflow_io as w
from PIL import Image
d=json.loads((w.HERE/'tmp/epa-final-adoption.json').read_text(encoding='utf-8'))
p=w.HERE/'_illust/eicosapentaenoic_acid.png'
if sys.argv[1]=='prepare':
 assert not p.exists()
 with Image.open(d['path']) as im:
  im=im.convert('RGBA');im.thumbnail((512,512),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',(512,512));canvas.alpha_composite(im,((512-im.width)//2,(512-im.height)//2));canvas.save(p)
  out=Image.new('RGB',(1536,512))
  for i,c in enumerate(['white','#15243b','#ff9dbc']):
   bg=Image.new('RGBA',canvas.size,c);bg.alpha_composite(canvas);out.paste(bg.convert('RGB'),(i*512,0))
  out.save(w.HERE/'tmp/epa-adopt-review.png')
 print(canvas.size,canvas.mode,canvas.getchannel('A').getextrema())
else:
 r=next(r for r in w.read_csv(w.DEFAULT_CSV)[2] if r['filename']==p.name)
 data=p.read_bytes();stamp=w.now()
 v={'実行プロンプト':r['実行プロンプト']+'\nFINAL BRANCH: Return to fourth candidate exec-770f484b-b3ae-4d38-a13e-766dc6156ee9.png.\n'+d['edit'],'解説英語':'Eicosapentaenoic acid is a twenty-carbon omega-three fatty acid with five cis double bonds.','解説日本語':'炭素二十個の鎖に五つのシス二重結合を持つオメガ三脂肪酸の模型。','制作状態':'reviewed','画像SHA256':w.sha(data),'画像GitBlobSHA':w.blob(data),'検品日時':stamp,'検品メモ':'灰色炭素20、赤色酸素2、白色水素1。C=C位置5-6,8-9,11-12,14-15,17-18、全てcisを目視確認。512x512 RGBA、実透過。','画像保存先':str(p),'検品方法':'完成PNGを白・濃紺・ピンク背景で開き、原子数・鎖順・単結合と二重結合・cis配置・輪郭・透過を目視確認','生成要求ID':Path(d['path']).stem,'生成結果ID':d['path'],'生成保存日時':stamp}
 print(w.record(w.DEFAULT_CSV,json.loads(w.state_path(w.DEFAULT_CSV).read_text())['token'],r['identity'],v))
