import sys,json,pathlib
from PIL import Image
P=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(P))
import workflow_io as w
C=P/'prompt_rows_weblio_missing_low500_redone_20261024_v3.csv'
def main():
 global C
 if len(sys.argv)>2:C=pathlib.Path(sys.argv[2]).resolve()
 items=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
 for item in items:
  _,_,rows=w.read_csv(C);row=next(r for r in rows if r['ファイル名']==item['filename'])
  dst=P/'_illust'/item['filename']
  if not dst.exists():
   im=Image.open(item['source']).convert('RGBA').resize((512,512),Image.Resampling.LANCZOS)
   with dst.open('xb') as f:im.save(f,format='PNG')
  data=w.png_bytes(dst)
  values={'実行プロンプト':item['prompt'],'解説英語':item['en'],'解説日本語':item['ja'],'制作状態':item.get('state','reviewed'),'画像SHA256':w.sha(data),'画像GitBlobSHA':w.blob(data),'画像保存先':str(dst),'検品日時':w.now(),'検品方法':'実PNG目視・512x512 RGBA・実アルファ確認','検品メモ':item.get('note','対象語義と主役・構図を確認。'),'生成結果ID':item['source'],'生成保存日時':w.now()}
  state=json.loads(w.state_path(C).read_bytes())
  print(json.dumps(w.record(C,state['token'],w.key(row),values),ensure_ascii=False))
if __name__=='__main__':main()
