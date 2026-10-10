#!/usr/bin/env python3
"""Build the small static gallery site; exclude dependencies and production assets."""
import argparse, shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=root / '_site')
args = parser.parse_args()
destination = args.output.absolute()
if destination.exists():
    parser.error('Output already exists; choose an empty destination')
if destination == root or destination in root.parents:
    parser.error('Output must not replace the repository or a parent')
files = list((root / 'assets/gallery').glob('*'))
files += list((root / 'assets/templates').glob('*.json'))
files += [root / 'assets/engine/font.ttf', root / 'assets/engine/FONT-LICENSE.txt']
files += [root / 'examples/saas-hunt' / name for name in ('video.mp4', 'cover.png')]
for source in files:
    if not source.is_file() or source.name.startswith('.'):
        continue
    target = destination / source.relative_to(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
html = (root / 'assets/gallery/index.html').read_text()
(destination / 'index.html').write_text(html.replace('<head>', '<head><base href="./assets/gallery/">', 1))
(destination / '.nojekyll').touch()
print('Static gallery built: ' + str(destination))
