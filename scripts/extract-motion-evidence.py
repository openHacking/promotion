#!/usr/bin/env python3
"""Keep consecutive frames of an indexed motion interval with original frame/PTS labels."""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw
p=argparse.ArgumentParser(description=__doc__);p.add_argument('source',type=Path);p.add_argument('first',type=int);p.add_argument('last',type=int);p.add_argument('--out',required=True,type=Path);a=p.parse_args()
data=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',str(a.source)]));pts=[float(f['best_effort_timestamp_time']) for f in data['frames']]
if not 0<=a.first<=a.last<len(pts):p.error('Interval must be within source frames')
a.out.mkdir(parents=True,exist_ok=True);width,height=320,180
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(a.source),'-vf',f'select=between(n\\,{a.first}\\,{a.last}),scale={width}:{height}','-fps_mode','passthrough','-f','rawvideo','-pix_fmt','rgb24','-'])
count=a.last-a.first+1;size=width*height*3
if len(raw)!=count*size:raise RuntimeError('Decoded interval does not match indexed frame count')
records=[]
for j in range(count):
 frame=a.first+j;image=Image.frombytes('RGB',(width,height),raw[j*size:(j+1)*size]);image.save(a.out/f'frame-{frame:04d}.png')
 if j%24==0:sheet=Image.new('RGB',(width*6,(height+20)*4),(20,20,20))
 x=j%6*width;y=j%24//6*(height+20);sheet.paste(image,(x,y));ImageDraw.Draw(sheet).text((x+4,y+height+2),f'{frame:04d} / {pts[frame]:.6f}s',fill='white');records.append({'frame':frame,'pts':pts[frame]})
 if j%24==23 or j==count-1:sheet.save(a.out/f'interval-{j//24:03d}.jpg',quality=92)
(a.out/'index.json').write_text(json.dumps({'source':a.source.name,'resolution':[width,height],'frames':records},indent=2)+'\n')
print(f'{count} consecutive frames retained')
