#!/usr/bin/env python3
"""Copy a standalone, editable composition; never overwrite an existing destination."""
import argparse,json,shutil
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('destination',type=Path)
p.add_argument('--template',choices=['minimal','window','command','workflow','discovery'],default='minimal')
p.add_argument('--engine',choices=['remotion','html'],default='remotion')
p.add_argument('--motion',choices=['standard','dynamic'],default=None)
p.add_argument('--shader',action='store_true')
p.add_argument('--music',choices=['procedural','energetic'],default=None)
p.add_argument('--background',type=Path,help='Local PNG/JPEG/WebP background plate; copied into the new Remotion project')
p.add_argument('--brand',default=None)
p.add_argument('--duration',type=float,default=40)
p.add_argument('--format',choices=['landscape','portrait'],default='landscape')
p.add_argument('--fps',type=int,choices=[30,60],default=60)
a=p.parse_args()
if a.template=='discovery' and (a.engine!='remotion' or a.duration<24):p.error('Discovery requires Remotion and at least 24 seconds')
if a.format!='landscape' and (a.engine!='remotion' or a.template!='discovery'):p.error('Non-landscape starters require the responsive discovery template')
if a.music is None:a.music='energetic' if a.engine=='remotion' else 'procedural'
if a.background and (a.engine!='remotion' or a.shader):p.error('--background requires Remotion and uses the image plate instead of --shader')
if a.background and (not a.background.is_file() or a.background.suffix.lower() not in ['.png','.jpg','.jpeg','.webp']):p.error('--background must be an existing PNG/JPEG/WebP file')
if a.music=='energetic' and a.engine=='html':p.error('--music energetic currently supports Remotion')
if a.shader and (a.template!='window' or a.engine!='remotion'):p.error('--shader currently supports the Remotion window template')
if a.destination.exists(): p.error('Destination already exists; choose a new directory.')
if not (8<=a.duration<=300) or abs(a.duration*a.fps-round(a.duration*a.fps))>1e-6:p.error('Duration must be 8–300 seconds and an exact number of frames.')
skill=Path(__file__).resolve().parent.parent
try:
 source=skill/('assets/remotion' if a.engine=='remotion' else 'assets/engine')
 shutil.copytree(source,a.destination,ignore=shutil.ignore_patterns('node_modules','out','.cache'))
 if a.engine=='remotion' and a.template!='discovery':
  (a.destination/'public/discovery-demo.svg').unlink(missing_ok=True)
 if a.engine=='html':
  shutil.copytree(skill/'scripts',a.destination/'scripts',ignore=shutil.ignore_patterns('init.py','__pycache__'))
  (a.destination/'assets').mkdir()
  shutil.move(str(a.destination/'font.ttf'),str(a.destination/'assets/font.ttf'))
  shutil.move(str(a.destination/'FONT-LICENSE.txt'),str(a.destination/'assets/FONT-LICENSE.txt'))
 config=json.loads((skill/'assets/templates'/f'{a.template}.json').read_text())
 original_duration=config['duration'];original_fps=config['fps']
 config['engine']=a.engine
 if a.engine=='remotion':
  config['width'],config['height']={'landscape':(1920,1080),'portrait':(1080,1920)}[a.format];config['format']=a.format
 if a.engine=='html':config['fontFile']='assets/font.ttf'
 if a.engine=='remotion':
  config['fontFile']='font.ttf';config['evidenceLabel']='Illustrative interface · not a live run'
  config['sceneDurations']=[1.2,3,3,2.8,2]
  config['motionStyle']=a.motion or ('dynamic' if a.template=='window' else 'standard');config['shader']=a.shader
  if a.music=='energetic':
   shutil.copytree(skill/'assets/music',a.destination/'public/music')
   config['audio'].update(mode='file',source='music/energetic-electro.ogg',license='CC0-1.0',bpm=125,musicVolume=.25,sfxVolume=.85,duckAmount=.35)
   config['audio']['credit']='Energetic Electro Tune — TinyWorlds';config['audio']['sourcePage']='https://opengameart.org/content/energetic-electro-tune'
 if a.background:
  filename='background-plate'+a.background.suffix.lower();shutil.copy(a.background,a.destination/'public'/filename)
  config['backgroundImage']=filename;config['backgroundMotion']='still'
  (a.destination/'public'/'background-source.json').write_text(json.dumps({'input':a.background.name,'note':'User-provided local background; record generation prompt or license here before distribution.'},ensure_ascii=False,indent=2)+'\n')
 if a.brand:config['brand']=a.brand
 config['duration']=a.duration;config['fps']=a.fps
 if a.template=='discovery':
  for e in config['timeline']['events']:e['frame']=round(e['frame']*a.duration/original_duration*a.fps/original_fps)
  config['timeline'].pop('beatFrames',None);config['timeline'].pop('phraseFrames',None)
 total=round(a.duration*a.fps)
 ratios=[d/12 for d in config['sceneDurations']]
 frames=[round(total*r) for r in ratios[:4]]
 frames.append(total-sum(frames))
 if min(frames)<1:raise ValueError('Duration too short for five scenes')
 config['sceneDurations']=[n/a.fps for n in frames]
 (a.destination/'config.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
 (a.destination/'.gitignore').write_text('node_modules/\nout/\n')
 print(str(a.destination.resolve()))
 print('Next: npm ci; npm run '+('studio' if a.engine=='remotion' else 'preview')+'; npm run render')
except Exception:
 # Only clean the new directory this invocation created, never an existing project.
 shutil.rmtree(a.destination,ignore_errors=True)
 raise
