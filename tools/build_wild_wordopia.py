from pathlib import Path
import sys
from build_wild_dictionary import build

destination = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parents[1] / 'app/wild-wordopia.html'
template = Path(__file__).with_name('wild-wordopia-template.html')
build(destination.resolve().parent.parent)
destination.write_text(template.read_text(encoding='utf-8'), encoding='utf-8')
print('Wild Wordopia introduction and shared dictionary view built.')
