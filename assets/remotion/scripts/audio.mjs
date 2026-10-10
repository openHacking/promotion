import fs from 'node:fs';
import path from 'node:path';
import {run,writeJSON} from './lib.mjs';
const SR=48000;
function wav(file,samples){const data=Buffer.alloc(44+samples.length*4);data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(samples.length*4,40);let peak=0;for(let i=0;i<samples.length;i++){peak=Math.max(peak,Math.abs(samples[i]));const v=Math.round(Math.max(-1,Math.min(1,samples[i]))*32767);data.writeInt16LE(v,44+i*4);data.writeInt16LE(v,46+i*4);}fs.writeFileSync(file,data);return peak;}
export async function buildAudio(root,c,out){
 if(c.audio.mode==='none'){writeJSON(path.join(out,'audio.json'),{mode:'none',cues:[]});return null;}
 const internal=path.join(out,'.internal');fs.mkdirSync(internal,{recursive:true});
 const n=Math.round(c.duration*SR),music=new Float64Array(n),sfx=new Float64Array(n),cues=[];
 const add=(dst,start,len,fn,gain=1)=>{const first=Math.round(start*SR),count=Math.round(len*SR);for(let j=0;j<count&&first+j<n;j++)if(first+j>=0)dst[first+j]+=fn(j/SR,j/count)*gain;};
 const bpm=c.audio.bpm??100;if(!Number.isFinite(bpm)||bpm<30||bpm>240)throw new Error('audio.bpm must be 30–240');
 const beat=60/bpm;
 if(c.audio.mode==='procedural'){
  // Original, reproducible electro groove: authored beat grid, no samples or randomness.
  const chords=[[130.81,164.81,196,261.63],[110,130.81,164.81,220],[87.31,110,130.81,174.61],[98,123.47,146.83,196]];
  for(let i=0;i<n;i++){const t=i/SR,chord=chords[Math.floor(t/(beat*8))%4],fade=Math.max(0,Math.min(1,t/.18,(c.duration-t)/.65));music[i]=chord.slice(1).reduce((a,f)=>a+Math.sin(2*Math.PI*f*t)*.014,0)*fade;}
  for(let k=0;k*beat<c.duration-.65;k++){
   const t=k*beat,chord=chords[Math.floor(k/8)%4],bass=chord[0]/2;
   add(music,t,.25,(s)=>Math.sin(2*Math.PI*(48*s+5*(1-Math.exp(-s*18))))*Math.exp(-s*22),.19);
   add(music,t,.32,(s)=> (Math.sin(2*Math.PI*bass*s)+.18*Math.sin(2*Math.PI*bass*2*s))*Math.exp(-s*10),.085);
   if(k%2===1)add(music,t,.11,(s)=>Math.sin(2*Math.PI*180*s)*Math.exp(-s*38)+.35*Math.sin(2*Math.PI*3417*s)*Math.sin(2*Math.PI*4723*s)*Math.exp(-s*50),.065);
   for(let j=0;j<2;j++)add(music,t+j*beat/2,.065,(s)=>Math.sin(2*Math.PI*6317*s)*Math.sin(2*Math.PI*4871*s)*Math.exp(-s*95),j?.035:.022);
   for(let j=0;j<2;j++){const note=chord[(k+j)%4]*2;add(music,t+j*beat/2,.36,(s)=> (Math.sin(2*Math.PI*note*s)+.22*Math.sin(2*Math.PI*note*2*s))*Math.exp(-s*14),.035);}
  }
  const end=Math.max(0,c.duration-3);for(const note of chords[0])add(music,end,2.8,(s)=>Math.sin(2*Math.PI*note*s)*Math.exp(-s*1.4),.022);
 }
 for(const event of c.motionEvents??[]){const t=event.frame/c.fps;cues.push({time:t,...event});
 if(event.kind==='select'||event.kind==='action-confirm')add(sfx,t,.10,(s)=>Math.sin(2*Math.PI*720*s)*Math.exp(-s*44),.1);
 else if(event.kind==='resolve'||event.kind==='brand'){
  add(sfx,t,.3,(s)=>Math.sin(2*Math.PI*659.25*s)*Math.exp(-s*16),.055);
  add(sfx,t+.045,.3,(s)=>Math.sin(2*Math.PI*987.77*s)*Math.exp(-s*16),.042);
 }else add(sfx,t,.19,(s,p)=>Math.sin(2*Math.PI*(180*s+540*s*s))*Math.sin(Math.PI*p)**2,.025);
 }
 const mv=c.audio.musicVolume??.6,sv=c.audio.sfxVolume??.75;
 if(!Number.isFinite(mv)||!Number.isFinite(sv)||mv<0||mv>2||sv<0||sv>2)throw new Error('audio volumes must be 0–2');
 const duck=c.audio.duckAmount??.22,duckTimes=cues.filter(e=>e.kind!=='transition'&&e.kind!=='scene-change').map(e=>e.time);
 for(let i=0;i<n;i++){const time=i/SR;let d=0;for(const hit of duckTimes){const delta=time-hit;if(delta>=-.045&&delta<.35)d=Math.max(d,delta<0?(delta+.045)/.045:Math.exp(-delta*9));}music[i]*=mv*(1-duck*d);sfx[i]*=sv;}
 const sfxPeak=wav(path.join(internal,'sfx.wav'),sfx),musicPeak=wav(path.join(internal,'music.wav'),music);
 const target=path.join(out,'soundtrack.wav');
 if(c.audio.mode==='file'){
  const source=path.resolve(root,'public',c.audio.source),real=fs.realpathSync(source),rr=fs.realpathSync(path.join(root,'public'));
  if(!real.startsWith(rr+path.sep))throw new Error('Audio source must be inside the project');
  const expr=duckTimes.map(t=>`if(between(t,${Math.max(0,t-.045)},${t+.35}),${1-duck},1)`).join('*')||'1';
  await run('ffmpeg',['-y','-v','error','-ss',String(c.audio.sourceOffsetSeconds??0),'-i',source,'-i',path.join(internal,'sfx.wav'),'-filter_complex',`[0:a]aresample=48000,volume='${mv}*(${expr})':eval=frame,apad,atrim=duration=${c.duration},afade=t=in:st=0:d=0.08,afade=t=out:st=${Math.max(0,c.duration-.5)}:d=0.5[a];[a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.8:level=0:latency=1[out]`,'-map','[out]','-t',String(c.duration),'-c:a','pcm_s16le',target]);
 }else{for(let i=0;i<n;i++)music[i]+=sfx[i];wav(target,music);}
 writeJSON(path.join(out,'audio.json'),{mode:c.audio.mode,bpm,sampleRate:SR,duration:c.duration,origin:c.audio.mode==='procedural'?'Original procedural sine pads, percussion and chirps':'Local licensed audio plus original cues',source:c.audio.source??null,sourceOffsetSeconds:c.audio.sourceOffsetSeconds??0,duckAmount:duck,beatFrames:c.timeline?.beatFrames??[],phraseFrames:c.timeline?.phraseFrames??[],license:c.audio.license??null,credit:c.audio.credit??null,sourcePage:c.audio.sourcePage??null,musicPeak,sfxPeak,cues});return target;
}
