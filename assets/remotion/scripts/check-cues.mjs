import fs from 'node:fs';
import path from 'node:path';
import {readConfig,writeJSON} from './lib.mjs';
import {motionEvents} from './config.mjs';
const root=process.cwd(),c=readConfig(root),file=path.join(root,'out/.internal/sfx.wav'),data=fs.readFileSync(file);
if(data.toString('ascii',0,4)!=='RIFF'||data.readUInt16LE(20)!==1||data.readUInt16LE(22)!==2||data.readUInt16LE(34)!==16)throw new Error('Expected internal stereo PCM16 WAV');
const rate=data.readUInt32LE(24),rows=motionEvents(c).map(event=>{const first=Math.round(event.frame/c.fps*rate);let onset=null;for(let n=first;n<first+rate*.04&&44+n*4+2<data.length;n++)if(Math.abs(data.readInt16LE(44+n*4))>=33){onset=n;break}return {...event,time:event.frame/c.fps,onsetAfterScheduledMs:onset===null?null:(onset-first)/rate*1000,within40ms:onset!==null}});
const report={method:'PCM SFX stem onset above 0.001 full-scale within 40ms of shared event frame; not a listening assessment',sampleRate:rate,cues:rows,allPassed:rows.every(e=>e.within40ms)};
writeJSON(path.join(root,'out/qa/cue-alignment.json'),report);console.log(JSON.stringify({passed:report.allPassed,cues:rows.length}));if(!report.allPassed)process.exitCode=1;
