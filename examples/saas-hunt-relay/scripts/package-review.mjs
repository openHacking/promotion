import fs from 'node:fs';
import path from 'node:path';
import {run} from './lib.mjs';
const root=process.cwd(),qa=path.join(root,'qa');fs.mkdirSync(qa,{recursive:true});const formats=[];
for(const format of ['landscape','portrait']){
 const dir=path.join(root,'out',format),record=JSON.parse(fs.readFileSync(path.join(dir,'render.json')));
 if(record.determinism.some(x=>!x.equal))throw new Error('Repeat-frame verification failed: '+format);
 await run(process.execPath,['scripts/check.mjs',path.join('out',format,'video.mp4')]);
 const checks=JSON.parse(fs.readFileSync(path.join(dir,'qa/video-check.json')));
 if(checks.checks.some(x=>!x.pass))throw new Error('Encoding verification failed: '+format);
 const destination=path.join(qa,format);fs.mkdirSync(destination,{recursive:true});
 fs.copyFileSync(path.join(dir,'video.mp4'),path.join(root,format==='landscape'?'video.mp4':'portrait-video.mp4'));
 fs.copyFileSync(path.join(dir,'storyboard.png'),path.join(root,format+'-storyboard.png'));
 fs.copyFileSync(path.join(dir,'qa/contact.png'),path.join(destination,'contact.png'));
 await run('ffmpeg',['-y','-v','error','-i',path.join(dir,'video.mp4'),'-vf','select=eq(n\\,1500)','-frames:v','1',path.join(root,format+'-cover.png')]);
 for(const start of [1120,1210,1568])await run('ffmpeg',['-y','-v','error','-i',path.join(dir,'video.mp4'),'-vf',`select=between(n\\,${start}\\,${start+19}),scale=320:-2,tile=5x4`,'-frames:v','1',path.join(destination,`boundary-${start}.png`)]);
 const report={format,frames:record.frames,renderSeconds:record.seconds,determinism:record.determinism,checks:checks.checks,scan:checks.scan,audio:checks.audio,sha256:checks.sha256,visual:'pending final encoded review',listening:'not-performed'};
 fs.writeFileSync(path.join(destination,'checks.json'),JSON.stringify(report,null,2)+'\n');formats.push(report);
}
fs.copyFileSync('out/landscape/soundtrack.wav','soundtrack.wav');
const treatments=[];
for(const id of ['ribbon','atlas','aperture','transfer']){
 const file=path.join('treatments',id,'video.mp4'),probe=JSON.parse((await run('ffprobe',['-v','error','-count_frames','-show_streams','-of','json',file])).stdout),v=probe.streams.find(x=>x.codec_type==='video'),a=probe.streams.find(x=>x.codec_type==='audio');
 if(Number(v.nb_read_frames)!==600||v.avg_frame_rate!=='60/1'||!a||Math.abs(Number(a.duration)-10)>.05)throw new Error('Invalid treatment '+id);
 const peaks=(await run('ffmpeg',['-v','info','-i',file,'-vn','-af','astats=metadata=0:reset=0','-f','null','-'])).stderr;const peakDb=Math.max(...Array.from(peaks.matchAll(/Peak level dB:\s*(-?\d+(?:\.\d+)?)/g),m=>Number(m[1])));if(peakDb>=-.2)throw new Error('Clipping in '+id);
 treatments.push({id,frames:600,fps:60,width:v.width,height:v.height,duration:Number(v.duration),audioDuration:Number(a.duration),peakDb,listening:'not-performed'});
}
fs.writeFileSync('treatments/encoding-checks.json',JSON.stringify(treatments,null,2)+'\n');
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({technical:'passed',formats,treatments,listening:'not-performed'},null,2)+'\n');console.log('Packaged checked review cuts. Visual and listening review remain separate.');
