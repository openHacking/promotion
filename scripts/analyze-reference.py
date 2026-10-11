#!/usr/bin/env python3
"""Decode every source frame and preserve PTS; private images stay in the selected output."""
import argparse, json, subprocess, hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageStat
p=argparse.ArgumentParser(description=__doc__);p.add_argument("files",nargs="+");p.add_argument("--out",type=Path,required=True);p.add_argument('--split',action='store_true',help='Decode and index left and right halves independently');p.add_argument('--width',type=int,default=160);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
if a.width<160 or a.width>1280:p.error('Width must be 160–1280')
for file in a.files:
 src=Path(file);dest=a.out/src.stem;dest.mkdir(exist_ok=True)
 data=json.loads(subprocess.check_output(["ffprobe","-v","error","-select_streams","v:0","-show_frames","-show_entries","frame=best_effort_timestamp_time","-of","json",str(src)]))
 pts=[float(f["best_effort_timestamp_time"]) for f in data["frames"]]
 width=a.width;height=round(width*9/16);per=120;columns=10
 process=subprocess.Popen(["ffmpeg","-v","error","-i",str(src),"-vf",f"scale={width}:{height}","-f","rawvideo","-pix_fmt","rgb24","-"],stdout=subprocess.PIPE)
 records=[];previous=None;sheets=[];sheet=None
 for i,t in enumerate(pts):
  raw=process.stdout.read(width*height*3)
  if len(raw)!=width*height*3:raise RuntimeError("Incomplete frame decode")
  frame=Image.frombytes("RGB",(width,height),raw)
  delta=0 if previous is None else sum(ImageStat.Stat(ImageChops.difference(frame,previous)).mean)/3
  records.append({"frame":i,"pts":t,"difference":round(delta,4),"thumbnailSha256":hashlib.sha256(raw).hexdigest()})
  if i%120==0:
   sheet=Image.new("RGB",(width*columns,(height+18)*12),(25,25,25))
   if a.split:left=Image.new('RGB',(width//2*columns,(height+18)*12),(25,25,25));right=left.copy()
  x=(i%120)%10*width;y=(i%120)//10*(height+18);sheet.paste(frame,(x,y));ImageDraw.Draw(sheet).text((x+3,y+height+1),f"{i:04d} / {t:.3f}s",fill="white")
  if a.split:
   for side,box in [(left,(0,0,width//2,height)),(right,(width//2,0,width,height))]:
    sx=x//2;side.paste(frame.crop(box),(sx,y));ImageDraw.Draw(side).text((sx+3,y+height+1),f'{i:04d} / {t:.3f}s',fill='white')
  if i%120==119 or i==len(pts)-1:
   name=f"frames-{i//120:03d}.jpg";sheet.save(dest/name,quality=88);sheets.append(name)
   if a.split:
    left.save(dest/f'left-{i//120:03d}.jpg',quality=90);right.save(dest/f'right-{i//120:03d}.jpg',quality=90)
  previous=frame
 if process.wait()!=0:raise RuntimeError("Decode failed")
 manifest={"source":src.name,"sha256":hashlib.sha256(src.read_bytes()).hexdigest(),"decodedFrames":len(records),"lastPTS":pts[-1],"reviewResolution":[width,height],"split":a.split,"sheets":sheets,"frames":records,"visualReview":"pending","listening":"not-performed"}
 (dest/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
 print(json.dumps({k:manifest[k] for k in ["source","decodedFrames","lastPTS"]}))
