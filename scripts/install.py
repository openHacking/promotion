#!/usr/bin/env python3
"""Install Promotion; archive recognized previous installations outside the skill catalog."""
import argparse,datetime,json,os,re,shutil,tempfile
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--destination',type=Path,default=Path(os.environ.get('CODEX_HOME',str(Path.home()/'.codex')))/'skills/promotion')
p.add_argument('--replace',action='store_true')
a=p.parse_args();source=Path(__file__).resolve().parent.parent;dest=a.destination.expanduser().absolute()
if dest==source or source in dest.parents or dest in source.parents:p.error('Install outside the source repository')
if dest.is_symlink():p.error('Destination is a symlink; resolve it explicitly')
if dest.exists() and not a.replace:p.error('Destination exists; use --replace to back it up and update')
legacy=dest.parent/'video-create'
if dest.name=='promotion' and legacy.exists():
 if legacy.is_symlink() or not (legacy/'SKILL.md').is_file() or not re.search(r'^name: video-create$',(legacy/'SKILL.md').read_text(),re.M):p.error('Ambiguous legacy folder; relocate it explicitly before migration')
else:legacy=None
dest.parent.mkdir(parents=True,exist_ok=True)
stage=Path(tempfile.mkdtemp(prefix='.promotion-install-',dir=dest.parent));backups=[]
try:
 shutil.copytree(source,stage/'skill',ignore=shutil.ignore_patterns('.git','node_modules','out','.cache','.DS_Store','._*','__pycache__'))
 for old in [dest,legacy]:
  if old and old.exists():
   backup_root=dest.parent.parent/'promotion-backups';backup_root.mkdir(parents=True,exist_ok=True)
   backup=backup_root/(old.name+'-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f'));old.rename(backup);backups.append((old,backup))
 (stage/'skill').rename(dest)
except Exception:
 for old,backup in reversed(backups):
  if not old.exists():backup.rename(old)
 raise
finally:shutil.rmtree(stage,ignore_errors=True)
print(dest)
for old,backup in backups:print('Previous version: '+str(backup))
