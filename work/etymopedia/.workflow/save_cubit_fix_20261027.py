import pathlib,json,shutil,sys
from PIL import Image
p=pathlib.Path(__file__).resolve().parents[1]
item=json.loads((p/".workflow/cubit_fix_20261027.json").read_text(encoding="utf-8"))[0]
dst=p/"_illust/cubit.png"
backup=p/".workflow/anatomy_revisions_20261027/cubit.png"
backup.parent.mkdir(parents=True,exist_ok=True)
with backup.open("xb") as out:out.write(dst.read_bytes())
im=Image.open(item["source"]).convert("RGBA").resize((512,512),Image.Resampling.LANCZOS)
im.save(dst)
sys.path.insert(0,str(p/".workflow"))
import resume_save_20261024 as saver
sys.argv=[sys.argv[0],str(p/".workflow/cubit_fix_20261027.json")]
saver.main()
