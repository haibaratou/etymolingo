from pathlib import Path
import sys
destination = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parents[1] / "app/wild-wordopia.html"
template = Path(__file__).with_name("wild-wordopia-template.html")
destination.write_text(template.read_text(encoding="utf-8"), encoding="utf-8")
print("Wild Wordopia introduction built.")
