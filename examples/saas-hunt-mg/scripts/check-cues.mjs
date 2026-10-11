import fs from 'node:fs';
import path from 'node:path';
import {readConfig,writeJSON} from './lib.mjs';
const root=process.cwd(),c=readConfig(root),file=path.join(root,'out/.internal/sfx.wav'),data=fs.readFileSync(file);
if(data.toString('ascii',0,4)!=='RIFF'||data.readUInt16LE(20)!==1||data.readUInt16LE(22)!==2||data.readUInt16LE(34)!==16)throw new Error('Expected internal stereo PCM16 WAV');
const rate=data.readUInt32LE(24),audio=JSON.parse(fs.readFileSync(path.join(root,'out/audio.json')));
const rows=(audio.sfxVolume===0?[]:audio.cues).map(event=>{
 const first=Math.max(0,Math.round(event.startTime*rate)),window=event.material==='air'?.08:.04;
 let onset=null;
 for(let n=first;n<first+rate*window&&44+n*4+4<=data.length;n++)if(Math.max(Math.abs(data.readInt16LE(44+n*4)),Math.abs(data.readInt16LE(46+n*4)))>=33){onset=n;break;}
 return {...event,onsetAfterStartMs:onset===null?null:(onset-first)/rate*1000,attackWindowMs:window*1000,passed:onset!==null};
});
const report={method:'Stereo PCM SFX bus onset above 0.001 full-scale after emitted cue start (80 ms air / 40 ms contact). Overlapping bus audio can produce false positives; inspect isolated cues and audible contact separately. This is not a listening assessment.',sampleRate:rate,cues:rows,allPassed:rows.every(e=>e.passed)};
writeJSON(path.join(root,'out/qa/cue-alignment.json'),report);console.log(JSON.stringify({passed:report.allPassed,cues:rows.length}));if(!report.allPassed)process.exitCode=1;
