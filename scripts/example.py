#!/usr/bin/env python3
"""Create a standalone SaaS Hunt project using captured local material."""
import argparse,shutil,subprocess,sys
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('destination',type=Path);p.add_argument('--variant',choices=['classic','mg','rhythm'],default='rhythm');a=p.parse_args()
r=Path(__file__).resolve().parent.parent
subprocess.run([sys.executable,str(r/'scripts/init.py'),str(a.destination),'--template','minimal','--duration','30'],check=True)
example=r/'examples'/({'classic':'saas-hunt','mg':'mg-templates','rhythm':'saas-hunt-rhythm'}[a.variant])
shutil.copy2(example/'config.json',a.destination/'config.json')
shutil.copytree(example/'public',a.destination/'public',dirs_exist_ok=True)
print('SaaS Hunt source ready. Run npm ci, npm run studio, and npm run render.')
