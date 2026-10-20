import sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import workflow_io as w
d=json.loads((w.HERE/'tmp/intercourse-refusal.json').read_text(encoding='utf-8'))
r=d['row']
suffix='\nUse reference only for visual style. For human figures only: exactly two anatomically coherent naturally attached arms and two hands, normal arm lengths and connected shoulders/elbows/wrists. Do not add faces or limbs to nonhuman objects.'
print(w.record(w.DEFAULT_CSV,json.loads(w.state_path(w.DEFAULT_CSV).read_text())['token'],r['identity'],{'制作状態':'needs_revision','実行プロンプト':r['prompt']+suffix,'検品メモ':d['error'],'検品日時':w.now()}))
