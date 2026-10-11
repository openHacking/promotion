import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {stop} from 'esbuild';
import {buildAudio} from './audio.mjs';
import {run} from './lib.mjs';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
const root=process.cwd(),out=path.resolve('out/benchmark');fs.mkdirSync(out,{recursive:true});
const start=performance.now(),serveUrl=await bundle({entryPoint:path.join(root,'src/benchmark-index.tsx'),publicDir:path.join(root,'public')}),common={serveUrl,browserExecutable:process.env.PROMOTION_BROWSER},composition=await selectComposition({...common,id:'MotionBenchmark'});
await renderMedia({...common,composition,codec:'h264',crf:18,outputLocation:path.join(out,'video.mp4'),concurrency:2});const renderSeconds=(performance.now()-start)/1000;
const order=[258,0,198,42,359,138,258,42,0,138,359,198],hashes=new Map(),checks=[];
for(const frame of order){const output=path.join(out,`seek-${frame}.png`);await renderStill({...common,composition,frame,output});const hash=createHash('sha256').update(fs.readFileSync(output)).digest('hex');checks.push({frame,hash,equal:!hashes.has(frame)||hashes.get(frame)===hash});hashes.set(frame,hash)}
fs.writeFileSync(path.join(out,'render.json'),JSON.stringify({engine:'remotion',renderSeconds,frames:360,order,checks,randomSeekMethod:'Independent frame requests through renderer; fresh page may be used. Stateful same-page test belongs to Hyperframes.'},null,2));const audioConfig=JSON.parse(fs.readFileSync('benchmark-config.json'));const score=await buildAudio(process.cwd(),{...audioConfig,motionEvents:audioConfig.timeline.events},out);await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-i',score,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-shortest',path.join(out,'video-audible.mp4')]);
stop();if(checks.some(c=>!c.equal))throw new Error('Seek mismatch');process.exit(0);
