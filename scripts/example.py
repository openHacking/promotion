#!/usr/bin/env python3
"""Create a standalone SaaS Hunt project using captured local material."""
import argparse,shutil,subprocess,sys
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('destination',type=Path);a=p.parse_args()
r=Path(__file__).resolve().parent.parent
subprocess.run([sys.executable,str(r/'scripts/init.py'),str(a.destination),'--template','minimal','--duration','30'],check=True)
shutil.copy2(r/'examples/saas-hunt/config.json',a.destination/'config.json')
shutil.copytree(r/'examples/saas-hunt/public',a.destination/'public',dirs_exist_ok=True)
print('SaaS Hunt source ready. Run npm ci, npm run studio, and npm run render.')
