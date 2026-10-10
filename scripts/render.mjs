import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {openComposition,run,writeJSON} from './lib.mjs';
import {buildAudio} from './audio.mjs';
const root=path.resolve(process.argv[2]||'.'),out=path.join(root,'out');fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(out,'.internal'),{recursive:true});fs.mkdirSync(path.join(out,'qa'),{recursive:true});
const began=Date.now();let comp,encoder;
try{
 comp=await openComposition(root);const{c,page}=comp,N=Math.round(c.duration*c.fps);
 const screenshot=()=>page.screenshot({type:'png',animations:'disabled'});
 const seek=t=>page.evaluate(async t=>{await window.video.seek(t)},t);
 let repeats=[];for(const t of [0,c.duration*.37,c.duration-1/c.fps]){await seek(t);let a=createHash('sha256').update(await screenshot()).digest('hex');await seek(c.duration*.8);await seek(t);let b=createHash('sha256').update(await screenshot()).digest('hex');repeats.push({time:t,a,b,equal:a===b});if(a!==b)throw new Error('Non-deterministic seek at '+t);}
 // Stream images to FFmpeg. No multi-gigabyte intermediate frame sequence.
 const silentTmp=path.join(out,'.internal/video.partial.mp4');
 encoder=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(c.fps),'-c:v','png','-i','pipe:0','-an','-c:v','libx264','-threads','4','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',silentTmp],{stdio:['pipe','ignore','pipe']});
 let errorText='',encError;encoder.stderr.on('data',b=>errorText+=b);encoder.stdin.on('error',e=>encError=e);
 const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('close',code=>code===0?resolve():reject(new Error('Encoder failed: '+errorText)));});finished.catch(()=>{});
 for(let f=0;f<N;f++){if(encError)throw encError;await seek(f/c.fps);let image=await screenshot();if(!encoder.stdin.write(image))await Promise.race([once(encoder.stdin,'drain'),finished.then(()=>{throw new Error('Encoder closed before all frames')})]);if(f%c.fps===0&&f%(c.fps*2)===0)console.log(`${f}/${N} frames`);}
 encoder.stdin.end();await finished;fs.renameSync(silentTmp,path.join(out,'.internal/video.mp4'));
 const soundtrack=await buildAudio(root,c,out);
 const videoTmp=path.join(out,'video.partial.mp4');
 if(soundtrack)await run('ffmpeg',['-y','-v','error','-i',path.join(out,'.internal/video.mp4'),'-i',soundtrack,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t',String(c.duration),'-movflags','+faststart',videoTmp]);else fs.copyFileSync(path.join(out,'.internal/video.mp4'),videoTmp);
 fs.renameSync(videoTmp,path.join(out,'video.mp4'));
 let times=[0,c.duration-1/c.fps],midpoints=[],cuts=[],t=0;for(let i=0;i<5;i++){midpoints.push(t+c.sceneDurations[i]*.6);if(i>0){cuts.push(t);times.push(t-1/c.fps,t);}t+=c.sceneDurations[i];}times.push(...midpoints);times=[...new Set(times.map(t=>Math.round(t*c.fps)))].sort((a,b)=>a-b);
 // Inspection images come from the encoded MP4, not the authoring browser.
 for(let j=0;j<times.length;j++)await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-vf',`select=eq(n\\,${times[j]})`,'-frames:v','1',path.join(out,'qa',`sample-${String(j).padStart(2,'0')}.png`)]);
 await run('ffmpeg',['-y','-v','error','-framerate','1','-i',path.join(out,'qa','sample-%02d.png'),'-vf','scale=384:216,tile=5x3','-frames:v','1',path.join(out,'qa','contact.png')]);
 for(let i=0;i<5;i++)await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-vf',`select=eq(n\\,${Math.round(midpoints[i]*c.fps)})`,'-frames:v','1',path.join(out,'qa',`story-${i}.png`)]);
 fs.copyFileSync(path.join(out,'qa','story-1.png'),path.join(out,'cover.png'));
 await run('ffmpeg',['-y','-v','error','-framerate','1','-i',path.join(out,'qa','story-%d.png'),'-vf','scale=640:360,tile=3x2','-frames:v','1',path.join(out,'storyboard.png')]);
 if(comp.failures.length)throw new Error(comp.failures.join('\n'));
 writeJSON(path.join(out,'render.json'),{config:c,frames:N,seconds:(Date.now()-began)/1000,browser:await comp.browser.version(),determinism:repeats,cutFrames:cuts.map(t=>Math.round(t*c.fps)),sampleFrames:times,source:'Encoded MP4 decoded frames',pageErrors:comp.failures});
 console.log(`Done: ${path.join(out,'video.mp4')} (${((Date.now()-began)/1000).toFixed(1)}s)`);
}catch(e){if(encoder&&!encoder.killed)encoder.kill('SIGTERM');console.error(e.stack);process.exitCode=1;}finally{if(comp)await comp.close();}
