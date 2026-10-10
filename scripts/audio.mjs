import fs from 'node:fs';
import path from 'node:path';
import {run,writeJSON} from './lib.mjs';
const SR=48000;
function wav(file,samples){const data=Buffer.alloc(44+samples.length*4);data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(samples.length*4,40);let peak=0;for(let i=0;i<samples.length;i++){peak=Math.max(peak,Math.abs(samples[i]));const v=Math.round(Math.max(-1,Math.min(1,samples[i]))*32767);data.writeInt16LE(v,44+i*4);data.writeInt16LE(v,46+i*4);}fs.writeFileSync(file,data);return peak;}
export async function buildAudio(root,c,out){
 if(c.audio.mode==='none'){writeJSON(path.join(out,'audio.json'),{mode:'none',cues:[]});return null;}
 const n=Math.round(c.duration*SR),music=new Float64Array(n),sfx=new Float64Array(n),cues=[];
 const add=(dst,start,len,fn,gain=1)=>{const first=Math.round(start*SR),count=Math.round(len*SR);for(let j=0;j<count&&first+j<n;j++)if(first+j>=0)dst[first+j]+=fn(j/SR,j/count)*gain;};
 const bpm=c.audio.bpm??100;if(!Number.isFinite(bpm)||bpm<30||bpm>240)throw new Error('audio.bpm must be 30–240');
 const beat=60/bpm;
 if(c.audio.mode==='procedural'){
  const chords=[[130.81,196,261.63,329.63],[110,164.81,220,261.63],[87.31,130.81,174.61,220],[98,146.83,196,246.94]];
  for(let i=0;i<n;i++){const t=i/SR,chord=chords[Math.floor(t/(beat*8))%4],fade=Math.min(1,t/.25,(c.duration-t)/.6);music[i]=chord.reduce((a,f,j)=>a+Math.sin(2*Math.PI*f*t)*(j===0?.042:.012),0)*Math.max(0,fade);}
  for(let t=0;t<c.duration;t+=beat){add(music,t,.2,(s)=>Math.sin(2*Math.PI*(48*s+5*(1-Math.exp(-s*18))))*Math.exp(-s*26),.105);add(music,t+beat/2,.065,(s)=>Math.sin(2*Math.PI*3700*s)*Math.exp(-s*100),.018);}
 }
 let start=0;for(let i=0;i<5;i++){if(i>0){const t=Math.round(start*c.fps)/c.fps;cues.push({time:t,frame:Math.round(t*c.fps),kind:'scene-change'});add(sfx,t,.22,(s,p)=>Math.sin(2*Math.PI*(410*s+1100*s*s))*Math.sin(Math.PI*p)**2,.115);}
 if((i===1||i===2)&&!c.screenshots.length){const t=Math.round((start+c.sceneDurations[i]*.40)*c.fps)/c.fps;cues.push({time:t,frame:Math.round(t*c.fps),kind:'action-confirm'});add(sfx,t,.11,(s)=>Math.sin(2*Math.PI*880*s)*Math.exp(-s*45),.13);}
 start+=c.sceneDurations[i];}
 const mv=c.audio.musicVolume??.6,sv=c.audio.sfxVolume??.75;
 if(!Number.isFinite(mv)||!Number.isFinite(sv)||mv<0||mv>2||sv<0||sv>2)throw new Error('audio volumes must be 0–2');
 for(let i=0;i<n;i++){music[i]*=mv;sfx[i]*=sv;}
 const sfxPeak=wav(path.join(out,'sfx.wav'),sfx),musicPeak=wav(path.join(out,'music.wav'),music);
 const target=path.join(out,'soundtrack.wav');
 if(c.audio.mode==='file'){
  const source=path.resolve(root,c.audio.source),real=fs.realpathSync(source),rr=fs.realpathSync(root);
  if(!real.startsWith(rr+path.sep))throw new Error('Audio source must be inside the project');
  await run('ffmpeg',['-y','-v','error','-i',source,'-i',path.join(out,'sfx.wav'),'-filter_complex',`[0:a]aresample=48000,volume=${mv},apad,atrim=duration=${c.duration},afade=t=out:st=${Math.max(0,c.duration-.5)}:d=0.5[a];[a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.8:level=0:latency=1[out]`,'-map','[out]','-t',String(c.duration),'-c:a','pcm_s16le',target]);
 }else{for(let i=0;i<n;i++)music[i]+=sfx[i];wav(target,music);}
 writeJSON(path.join(out,'audio.json'),{mode:c.audio.mode,bpm,sampleRate:SR,duration:c.duration,origin:c.audio.mode==='procedural'?'Original procedural sine pads, percussion and chirps':'User-provided local audio plus original cues',source:c.audio.source??null,license:c.audio.license??null,musicPeak,sfxPeak,cues});return target;
}
