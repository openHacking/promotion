import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {run,writeJSON} from './lib.mjs';
const SR=48000;
export async function buildAudio(root,c,out){
 if(c.audio.mode==='none'){writeJSON(path.join(out,'audio.json'),{mode:'none',cues:[]});return null;}
 const internal=path.join(out,'.internal');fs.mkdirSync(internal,{recursive:true});
 const n=Math.round(c.duration*SR),music=new Float64Array(n),cues=[];
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
 // Decode recorded music before applying the same envelope to either music mode.
 let decodedMusic;
 if(c.audio.mode==='file'){
  const decoded=await decode(c.audio.source,c.audio.sourceOffsetSeconds??0,c.duration);
  if(decoded.length<n*2-960)throw new Error('Music source is shorter than the selected range; choose another offset or track');
  decodedMusic=decoded;
 }
 const stereoMusic=new Float32Array(n*2),stereoSfx=new Float32Array(n*2);
 for(const [index,event] of (c.motionEvents??[]).entries()){
  if(event.sound===false||event.sound?.gain===0)continue;
  const sound=event.sound??{},contact=event.frame/c.fps;
  const material=sound.material??(['select','action-confirm'].includes(event.kind)?'click':['resolve','brand'].includes(event.kind)?'impact':'air');
  const lead=sound.leadSeconds??(!sound.source&&material==='air'?.16:0),startFrame=event.frame-Math.round(lead*c.fps),start=startFrame/c.fps;
  const duration=sound.durationSeconds??(material==='air'?.32:material==='click'?.09:.48);
  const gain=sound.gain??1,pan=sound.pan??0;
  const mono=sound.source?null:materialSound(material,duration,index+19);
  const recorded=sound.source?await decode(sound.source,sound.sourceOffsetSeconds??0,duration):null;
  if(recorded&&recorded.length<Math.round(duration*SR)*2-960)throw new Error('Sound source is shorter than its selected range');
  const left=Math.sqrt((1-pan)/2),right=Math.sqrt((1+pan)/2),first=Math.round(start*SR),count=Math.round(duration*SR);
  for(let j=0;j<count;j++){
   const sample=first+j;if(sample<0||sample>=n)continue;
   // Recorded stereo keeps its image; synthetic materials use equal-power panning.
   const fade=Math.min(1,j/(SR*.002),(count-1-j)/(SR*.015));
   const l=(recorded?(recorded[j*2]??0)*left*Math.SQRT2:mono[j]*left)*gain*fade;
   const r=(recorded?(recorded[j*2+1]??0)*right*Math.SQRT2:mono[j]*right)*gain*fade;
   stereoSfx[sample*2]+=l;stereoSfx[sample*2+1]+=r;
   // A small, shared early-reflection space; no repeated tonal success chord.
   if(!recorded)for(const [delay,amount] of [[.023,.10],[.047,.06],[.079,.035]]){
    const tail=sample+Math.round(delay*SR);if(tail<n){stereoSfx[tail*2]+=r*amount;stereoSfx[tail*2+1]+=l*amount;}
   }
  }
  cues.push({...event,time:contact,startTime:start,startFrame,material:sound.source?'recorded':material,source:sound.source??null,sourceSha256:sound.source?hash(sound.source):null,durationSeconds:duration,gain,pan});
 }
 const mv=c.audio.musicVolume??.25,sv=c.audio.sfxVolume??.75,duck=c.audio.duckAmount??.35;
 if(!Number.isFinite(mv)||!Number.isFinite(sv)||mv<0||mv>2||sv<0||sv>2)throw new Error('audio volumes must be 0–2');
 const duckTimes=cues.map(e=>e.time);
 for(let i=0;i<n;i++){
  const time=i/SR;let d=0;
  for(const hit of duckTimes){const delta=time-hit;if(delta>=-.06&&delta<.4)d=Math.max(d,delta<0?(delta+.06)/.06:Math.exp(-delta*10));}
  const fade=Math.max(0,Math.min(1,time/.3,(c.duration-time)/.8)),scale=mv*(1-duck*d)*fade;
  for(let channel=0;channel<2;channel++){const j=i*2+channel;stereoMusic[j]=(decodedMusic?.[j]??music[i])*scale;stereoSfx[j]*=sv;}
 }
 const musicPeak=peak(stereoMusic),sfxPeak=peak(stereoSfx);
 for(const cue of cues){
  const first=Math.max(0,Math.round(cue.time*SR))*2,last=Math.min(n,Math.round((cue.time+.15)*SR))*2;
  const rms=samples=>{let sum=0;for(let i=first;i<last;i++)sum+=samples[i]**2;return Math.sqrt(sum/Math.max(1,last-first));};
  const m=rms(stereoMusic),s=rms(stereoSfx);cue.window={durationSeconds:.15,musicRms:m,sfxRms:s,sfxToMusicDb:m&&s?20*Math.log10(s/m):null};
 }
 const mixed=new Float32Array(n*2);for(let i=0;i<mixed.length;i++)mixed[i]=stereoMusic[i]+stereoSfx[i];
 const premasterPeak=peak(mixed),masterGain=Math.min(1,.75/(premasterPeak||1));
 for(let i=0;i<mixed.length;i++){mixed[i]*=masterGain;stereoMusic[i]*=masterGain;stereoSfx[i]*=masterGain;}
 writeStereo(path.join(internal,'music.wav'),stereoMusic);writeStereo(path.join(internal,'sfx.wav'),stereoSfx);
 const target=path.join(out,'soundtrack.wav'),finalPeak=writeStereo(target,mixed);
 writeJSON(path.join(out,'audio.json'),{mode:c.audio.mode,bpm,sampleRate:SR,channels:2,duration:c.duration,origin:c.audio.mode==='procedural'?'Original procedural fallback music and material cues':'Local licensed recording and action cues',source:c.audio.source??null,sourceSha256:c.audio.mode==='file'?hash(c.audio.source):null,sourceOffsetSeconds:c.audio.sourceOffsetSeconds??0,duckAmount:duck,musicVolume:mv,sfxVolume:sv,beatFrames:c.timeline?.beatFrames??[],phraseFrames:c.timeline?.phraseFrames??[],license:c.audio.license??null,credit:c.audio.credit??null,sourcePage:c.audio.sourcePage??null,musicPeak,sfxPeak,premasterPeak,masterGain,finalPeak,listening:{status:'not-performed'},cues});return target;

 function hash(relative){return createHash('sha256').update(fs.readFileSync(path.resolve(root,'public',relative))).digest('hex');}
 async function decode(relative,offset,duration){
  const source=path.resolve(root,'public',relative),real=fs.realpathSync(source),rr=fs.realpathSync(path.join(root,'public'));
  if(!real.startsWith(rr+path.sep))throw new Error('Audio source must be inside the project');
  const raw=path.join(internal,'decode.f32');
  try{
   await run('ffmpeg',['-y','-v','error','-ss',String(offset),'-i',real,'-t',String(duration),'-vn','-ar',String(SR),'-ac','2','-f','f32le',raw]);
   const buffer=fs.readFileSync(raw),samples=new Float32Array(buffer.length/4);
   for(let i=0;i<samples.length;i++)samples[i]=buffer.readFloatLE(i*4);
   return samples;
  }finally{fs.rmSync(raw,{force:true});}
 }
}

function peak(samples){let value=0;for(const sample of samples)value=Math.max(value,Math.abs(sample));return value;}
function writeStereo(file,samples){
 const data=Buffer.alloc(44+samples.length*2);data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(samples.length*2,40);
 for(let i=0;i<samples.length;i++)data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
 fs.writeFileSync(file,data);return peak(samples);
}

function materialSound(material,duration,seed){
 const samples=new Float32Array(Math.round(duration*SR));let low=0,phase=0;
 for(let i=0;i<samples.length;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const noise=seed/2147483648-1,t=i/SR,p=i/samples.length;
  if(material==='air'){
   const cutoff=500+3600*Math.sin(Math.PI*p)**2;
   low+=(1-Math.exp(-2*Math.PI*cutoff/SR))*(noise-low);
   samples[i]=low*Math.sin(Math.PI*p)**3*.36;
  }else if(material==='click'){
   low+=.18*(noise-low);
   samples[i]=((noise-low)*Math.exp(-t*180)*.24+Math.sin(2*Math.PI*235*t)*Math.exp(-t*65)*.14)*Math.min(1,t/.001);
  }else{
   phase+=2*Math.PI*(58+72*Math.exp(-t*35))/SR;low+=.08*(noise-low);
   samples[i]=Math.tanh(Math.sin(phase)*Math.exp(-t*12)*.27+low*Math.exp(-t*55)*.16)*Math.min(1,t/.003);
  }
 }
 return samples;
}
