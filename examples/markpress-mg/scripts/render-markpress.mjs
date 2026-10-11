import fs from 'node:fs';
import {stop} from 'esbuild';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {buildAudio} from './audio.mjs';
import {run,writeJSON} from './lib.mjs';
import {validateConfig,motionEvents} from './config.mjs';
import {resolveFormat} from '../src/formats.mjs';
import {analyzeMusic,verifyMusicAlignment} from './music-analysis.mjs';
const root=process.cwd(),args=process.argv.slice(2),format=args.includes('--format')?args[args.indexOf('--format')+1]:undefined;
if(args.length&&(!format||args.length!==2||args[0]!=='--format'))throw new Error('Usage: npm run render -- [--format landscape|portrait]');
const c=validateConfig(JSON.parse(fs.readFileSync(path.join(root,format==='portrait'?'config.portrait.json':'config.json'),'utf8')),root),out=path.resolve(root,'out',...(format?[format]:[]));fs.mkdirSync(path.join(out,'qa'),{recursive:true});
const start=performance.now();console.log('Rendering review cut. Export checks do not establish visual or listening approval.');if(c.audio.mode==='file'){const analysis=await analyzeMusic(root,c,out);writeJSON(path.join(out,'music-alignment.json'),{events:verifyMusicAlignment(c,analysis),method:'Detected music markers on shared video frame grid; listening required separately'});}else if(c.rhythm?.requireOnsetAlignment)throw new Error('Onset alignment requires recorded music');c.motionEvents=motionEvents(c);const inputProps={config:c};
const serveUrl=await bundle({enableCaching:false,entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();
const browserExecutable=process.env.PROMOTION_BROWSER||process.env.VIDEO_CREATE_BROWSER||undefined,common={serveUrl,inputProps,browserExecutable,chromiumOptions:c.shader&&!c.shaderAsset?{gl:'angle',enableUnsafeWebGPU:true}:undefined};
const composition=await selectComposition({...common,id:'ProductFilm'});
const internal=path.join(out,'.internal');fs.mkdirSync(internal,{recursive:true});const partial=path.join(internal,'video.partial.mp4');
await renderMedia({...common,composition,codec:'h264',colorSpace:'bt709',crf:18,pixelFormat:'yuv420p',outputLocation:partial,concurrency:2,onProgress:({progress})=>{if(progress===1)console.log('Video frames rendered')}});
fs.renameSync(partial,path.join(internal,'video.mp4'));
const audio=await buildAudio(root,c,out);
if(audio){await run('ffmpeg',['-y','-v','error','-i',path.join(internal,'video.mp4'),'-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t',String(c.duration),'-movflags','+faststart',path.join(out,'video.partial.mp4')]);fs.renameSync(path.join(out,'video.partial.mp4'),path.join(out,'video.mp4'))}else fs.copyFileSync(path.join(internal,'video.mp4'),path.join(out,'video.mp4'));
const total=composition.durationInFrames,starts=[0];let sum=0;for(const d of c.sceneDurations){sum+=d;starts.push(Math.round(sum*c.fps))}
const samples=[...new Set([0,total-1,...starts.slice(1,-1).flatMap(n=>[n-1,n,n+Math.round(c.fps*.65)]),...c.sceneDurations.map((d,i)=>starts[i]+Math.round(d*c.fps*.5))])].sort((a,b)=>a-b).filter(n=>n<total);
for(const [i,n] of samples.entries())await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-vf',`select=eq(n\\,${n}),scale=640:-2`,'-frames:v','1',path.join(out,'qa',`sample-${String(i).padStart(2,'0')}.png`)]);
await run('ffmpeg',['-y','-v','error','-framerate','1','-i',path.join(out,'qa','sample-%02d.png'),'-vf',`tile=5x${Math.ceil(samples.length/5)}`,'-frames:v','1',path.join(out,'qa/contact.png')]);
await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-vf',`select=eq(n\\,${starts[1]+Math.round(c.sceneDurations[1]*c.fps*.75)})`,'-frames:v','1',path.join(out,'cover.png')]);
const mids=c.sceneDurations.map((d,i)=>starts[i]+Math.round(d*c.fps*.5));for(const [i,n] of mids.entries())await run('ffmpeg',['-y','-v','error','-i',path.join(out,'video.mp4'),'-vf',`select=eq(n\\,${n}),scale=640:-2`,'-frames:v','1',path.join(out,'qa',`story-${i}.png`)]);
await run('ffmpeg',['-y','-v','error','-framerate','1','-i',path.join(out,'qa/story-%d.png'),'-vf',`tile=${mids.length===5?'5x1':'4x'+Math.ceil(mids.length/4)}:color=0xf4f1ed`,'-frames:v','1',path.join(out,'storyboard.png')]);
const determinism=[];for(const n of [Math.round(total*.27),Math.round(total*.58)]){const hashes=[];for(let i=0;i<2;i++){const output=path.join(out,'qa',`repeat-${n}-${i}.png`);await renderStill({...common,composition,frame:n,output,imageFormat:'png'});hashes.push(createHash('sha256').update(fs.readFileSync(output)).digest('hex'))}determinism.push({frame:n,hashes,equal:hashes[0]===hashes[1]})}
writeJSON(path.join(out,'render.json'),{engine:'remotion',review:{visual:'pending',listening:'not-performed',musicSelection:c.audio.selectionStatus??'unspecified'},frames:total,config:c,sampleFrames:samples,cutFrames:c.template==='discovery'?[]:c.template==='architecture'?(c.architecture?.choreography==='relay'?[]:[Math.round(24*c.fps)]):starts.slice(1,-1),determinism,seconds:(performance.now()-start)/1000});if(determinism.some(r=>!r.equal))throw new Error('Non-deterministic render');stop();console.log('Done: '+path.join(out,'video.mp4'));

// All output and cleanup are awaited; release any remaining bundler worker handles.
process.exit(0);
