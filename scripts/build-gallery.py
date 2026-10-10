#!/usr/bin/env python3
"""Render English previews and replacement films; resume completed workspace stages."""
import argparse,json,shutil,subprocess,sys
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('workspace',type=Path);a=p.parse_args();r=Path(__file__).resolve().parent.parent
for template in ['minimal','window','command','workflow']:
 d=a.workspace/template
 if not d.exists():
  subprocess.run([sys.executable,str(r/'scripts/init.py'),str(d),'--template',template,'--duration','12'],check=True)
  (d/'node_modules').symlink_to(r/'assets/remotion/node_modules',target_is_directory=True)
 for sub in ['scripts','src']:shutil.copytree(r/'assets/remotion'/sub,d/sub,dirs_exist_ok=True)
 for name in ['package.json','package-lock.json']:shutil.copy2(r/'assets/remotion'/name,d/name)
 def run(command):subprocess.run(['npm','run',command],cwd=d,check=True)
 if not (d/'original-output').exists():
  if not (d/'out/render.json').exists():run('render')
  run('check')
  for name,target in [('video.mp4',template+'.mp4'),('cover.png',template+'.png')]:shutil.copy2(d/'out'/name,r/'assets/gallery'/target)
  c=json.loads((d/'config.json').read_text());c.update(brand='Nova Notes',title='Turn scattered ideas into clear next steps.',task='Organize meeting notes into a shared action plan.',result='Your next steps are ready.',features=['Capture the discussion','Organize the decisions','Share the next steps'],accent='#9167d9',screenshots=[{'file':'replacement image.svg','label':'Original local fixture'}])
  (d/'public/replacement image.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#ed29b6"/><text x="70" y="300" font-size="60" fill="white">NOVA NOTES / LOCAL ASSET</text></svg>')
  (d/'config.json').write_text(json.dumps(c,indent=2)+'\n');(d/'out').rename(d/'original-output')
 if not (d/'out/render.json').exists():run('render')
 checkfile=d/'out/qa/video-check.json'
 if not checkfile.exists() or not all(x['pass'] for x in json.loads(checkfile.read_text())['checks']):run('check')
 if not (d/'out/qa/reuse/verification.json').exists():run('verify')
print('Four previews and four replacement films rendered and checked.')
