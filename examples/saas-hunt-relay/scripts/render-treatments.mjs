import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {stop} from 'esbuild';
import {buildAudio} from './audio.mjs';
import {run} from './lib.mjs';
const root=process.cwd(),base=JSON.parse(fs.readFileSync('config.json')),out=path.join(root,'treatments');fs.mkdirSync(out,{recursive:true});
const url=await bundle({entryPoint:path.join(root,'src/treatment-index.tsx'),publicDir:path.join(root,'public')});stop();
const directions=[{id:'ribbon',background:'#f2f0e9',foreground:'#20232a',surface:'#ffffff',accent:'#f26945',secondary:'#465de2',music:'Cipher2.mp3',credit:'Cipher',offset:25.6},{id:'atlas',background:'#132c36',foreground:'#e5eee9',surface:'#25424b',accent:'#ffa56c',secondary:'#73cbb4',music:'Funkorama.mp3',credit:'Funkorama',offset:20},{id:'aperture',background:'#ede6fa',foreground:'#302642',surface:'#ffffff',accent:'#ed7550',secondary:'#7960bd',music:'Carefree.mp3',credit:'Carefree',offset:32},{id:'transfer',music:'Carefree.mp3',credit:'Carefree',offset:32}];
const results=[];
for(const d of directions.filter(d=>!process.argv[2]||process.argv[2].split(',').includes(d.id))){
 const dir=path.join(out,d.id);fs.mkdirSync(dir,{recursive:true});const transfer=d.id==='transfer',c=structuredClone(base);
 if(!transfer){for(const key of ['background','foreground','surface','accent'])c[key]=d[key];c.architecture.direction=d.id;c.architecture.secondary=d.secondary;}
 c.audio.source='music/'+d.music;c.audio.credit=d.credit+' — Kevin MacLeod';c.audio.sourceOffsetSeconds=d.offset;
 const common={serveUrl:url,inputProps:{config:c},browserExecutable:process.env.PROMOTION_BROWSER},composition=await selectComposition({...common,id:transfer?'Transfer':'Treatment'}),first=transfer?0:132,last=transfer?599:731,t0=performance.now();
 await renderMedia({...common,composition,frameRange:[first,last],scale:.5,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:path.join(dir,'silent.mp4'),concurrency:2});
 const ac=structuredClone(c);ac.duration=10;ac.audio.sourceOffsetSeconds+=first/60;ac.timeline.events=c.timeline.events.filter(e=>e.frame>=first&&e.frame<=last).map(e=>({...e,frame:e.frame-first}));if(transfer)ac.timeline.events=[];
 const audio=await buildAudio(root,ac,dir);
 await run('ffmpeg',['-y','-v','error','-i',path.join(dir,'silent.mp4'),'-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','10','-movflags','+faststart',path.join(dir,'video.mp4')]);
 fs.unlinkSync(path.join(dir,'silent.mp4'));
 const sampleFrames=transfer?[30,110,215,330,425,550]:[180,280,350,430,535,620,730];
 for(let i=0;i<sampleFrames.length;i++)await renderStill({...common,composition,frame:sampleFrames[i],scale:.5,output:path.join(dir,`frame-${i}.png`)});
 await run('ffmpeg',['-y','-v','error','-i',path.join(dir,'video.mp4'),'-vf','fps=2,scale=480:-2,tile=5x4','-frames:v','1',path.join(dir,'contact.png')]);
 const hashes=[];for(const frame of [first+340,first,first+180,last,first+340]){const buffer=await renderStill({...common,composition,frame,scale:.25});hashes.push({frame,sha256:createHash('sha256').update(buffer.buffer).digest('hex')});}
 results.push({id:d.id,seconds:(performance.now()-t0)/1000,sourceFrameRange:[first,last],music:{file:d.music,offset:ac.audio.sourceOffsetSeconds,listening:'not-performed'},seek:hashes,repeatEqual:hashes[0].sha256===hashes[4].sha256});
 console.log('Rendered '+d.id);
}
const previous=fs.existsSync(path.join(out,'render.json'))?JSON.parse(fs.readFileSync(path.join(out,'render.json'))):[];fs.writeFileSync(path.join(out,'render.json'),JSON.stringify([...previous.filter(x=>!results.some(r=>r.id===x.id)),...results],null,2)+'\n');stop();process.exit(0);
