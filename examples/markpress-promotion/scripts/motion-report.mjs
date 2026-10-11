import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
const file=path.resolve(process.argv[2]??'out/video.mp4'),root=path.dirname(path.dirname(file));
const c=JSON.parse(fs.readFileSync(path.join(root,'config.json')));
const stream=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=avg_frame_rate,nb_frames','-of','json',file])).streams[0];
const [num,den]=stream.avg_frame_rate.split('/').map(Number),fps=num/den;
const width=160,height=90,size=width*height,rows=[];let pending=Buffer.alloc(0),previous=null,index=0,error='';
const child=spawn('ffmpeg',['-v','error','-i',file,'-vf','scale=160:90,format=gray','-f','rawvideo','pipe:1']);
child.stderr.on('data',v=>error+=v);child.stdout.on('data',chunk=>{pending=Buffer.concat([pending,chunk]);while(pending.length>=size){const frame=Buffer.from(pending.subarray(0,size));if(previous){let whole=0,center=0,n=0;for(let y=0;y<height;y++)for(let x=0;x<width;x++){const d=Math.abs(frame[y*width+x]-previous[y*width+x]);whole+=d;if(x>=24&&x<136&&y>=18&&y<78){center+=d;n++}}rows.push({frame:index,time:index/fps,whole:whole/size,center:center/n})}previous=frame;pending=pending.subarray(size);index++}});
await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(new Error(error)))});
if(pending.length||index!==Math.round(c.duration*fps))throw new Error('Incomplete decoded timeline');
const threshold=.35; // Diagnostic only, gray levels at this downsampled resolution, not an aesthetic acceptance gate.
const quiet=[];let first=null;for(const row of rows){if(row.center<threshold){if(first===null)first=row.frame}else if(first!==null){quiet.push({start:first/fps,end:row.frame/fps,seconds:(row.frame-first)/fps});first=null}}if(first!==null)quiet.push({start:first/fps,end:index/fps,seconds:(index-first)/fps});
const mean=c.sceneDurations.reduce((a,b)=>a+b,0)/c.sceneDurations.length,cv=Math.sqrt(c.sceneDurations.reduce((a,b)=>a+(b-mean)**2,0)/c.sceneDurations.length)/mean;
const out=path.join(root,'out/qa');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'motion.csv'),'frame,time,wholeMeanDifference,centerMeanDifference\n'+rows.map(r=>[r.frame,r.time.toFixed(6),r.whole.toFixed(6),r.center.toFixed(6)].join(',')).join('\n')+'\n');
const report={file,fps,decodedFrames:index,sceneDurations:c.sceneDurations,durationVariation:cv,analysisSize:[width,height],centralRegion:[24,18,112,60],quietThreshold:threshold,centralQuietIntervals:quiet,wholePeak:Math.max(...rows.map(x=>x.whole)),centerPeak:Math.max(...rows.map(x=>x.center)),semanticContinuity:'Not measured. Review named foreground carriers at planned boundaries.',note:'Difference curves include background, light and texture changes. Quiet intervals are diagnostic estimates, not proof of rest, readability or quality.'};
fs.writeFileSync(path.join(out,'motion-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
