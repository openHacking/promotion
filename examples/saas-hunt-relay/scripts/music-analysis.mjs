import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {run,writeJSON} from './lib.mjs';
// Independent deterministic analysis. Meter and phrases remain candidates for audition.
function spectrum(input,start,size){
 const real=new Float64Array(size),imag=new Float64Array(size);
 for(let i=0;i<size;i++)real[i]=(input[start+i]??0)*(.5-.5*Math.cos(2*Math.PI*i/(size-1)));
 for(let i=1,j=0;i<size;i++){let bit=size>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j)[real[i],real[j]]=[real[j],real[i]];}
 for(let len=2;len<=size;len<<=1){const a=-2*Math.PI/len;for(let i=0;i<size;i+=len)for(let j=0;j<len/2;j++){const co=Math.cos(a*j),si=Math.sin(a*j),k=i+j,l=k+len/2,r=real[l]*co-imag[l]*si,v=real[l]*si+imag[l]*co;real[l]=real[k]-r;imag[l]=imag[k]-v;real[k]+=r;imag[k]+=v;}}
 return real.slice(0,size/2).map((v,i)=>Math.log1p(Math.hypot(v,imag[i])));
}
export function analyzePCM(samples,{sampleRate=22050,fps=60,bpmHint}={}){
 const size=1024,hop=256,rows=[],old=new Float64Array(size/2);let maxFlux=0;
 for(let start=0;start+size<=samples.length;start+=hop){const spec=spectrum(samples,start,size);let flux=0,energy=0,low=0;
  for(let i=1;i<spec.length;i++){flux+=Math.max(0,spec[i]-old[i]);if(i<12)low+=Math.max(0,spec[i]-old[i]);old[i]=spec[i];}
  for(let i=0;i<size;i++)energy+=samples[start+i]**2;
  const time=(start+size/2)/sampleRate;rows.push({time,flux,low,rms:Math.sqrt(energy/size)});maxFlux=Math.max(maxFlux,flux);
 }
 const onsets=[];let last=-1;
 for(let i=2;i<rows.length-2;i++){const r=rows[i],neighbors=rows.slice(Math.max(0,i-18),Math.min(rows.length,i+19)).map(v=>v.flux).sort((a,b)=>a-b),median=neighbors[Math.floor(neighbors.length/2)]??0;
  if(r.flux>maxFlux*.06&&r.flux>median*1.6&&r.flux>=rows[i-1].flux&&r.flux>rows[i+1].flux&&r.time-last>.13){onsets.push({frame:Math.round(r.time*fps),time:Number(r.time.toFixed(5)),strength:maxFlux?r.flux/maxFlux:0,lowStrength:r.low,kind:'detected-onset'});last=r.time;}
 }
 if(maxFlux<1e-9||onsets.length<4)return {fps,sampleRate,duration:samples.length/sampleRate,tempo:null,onsets,beats:[],strongBeatCandidates:[],phraseCandidates:[],energy:[],warnings:['Insufficient rhythmic evidence; author markers manually after listening.']};
 let best={score:-1,bpm:0,lag:0};const dt=hop/sampleRate;
 for(let bpm=70;bpm<=180;bpm+=.5){const lag=Math.round(60/bpm/dt);let score=0;
  for(let i=lag;i<rows.length;i++)score+=rows[i].flux*rows[i-lag].flux;
  score/=Math.max(1,rows.length-lag);if(bpmHint)score*=.8+.2*Math.exp(-(((bpm-bpmHint)/12)**2));
  if(score>best.score)best={score,bpm,lag};
 }
 const period=best.lag*dt;let phase=0,phaseScore=-1;
 for(let shift=0;shift<best.lag;shift++){let sum=0;for(let i=shift;i<rows.length;i+=best.lag)sum+=rows[i].flux;if(sum>phaseScore){phaseScore=sum;phase=rows[shift].time;}}
 const beats=[];for(let time=phase,index=0;time<samples.length/sampleRate;time+=period,index++){
  const near=onsets.filter(v=>Math.abs(v.time-time)<.075).sort((a,b)=>b.strength-a.strength)[0];
  beats.push({index,frame:near?.frame??Math.round(time*fps),time:near?.time??Number(time.toFixed(5)),strength:near?.strength??0,kind:near?'onset-supported-beat':'estimated-beat'});
 }
 const strongBeatCandidates=beats.filter(v=>v.kind==='onset-supported-beat'&&v.strength>=.3).map(v=>({...v,kind:'strong-beat-candidate'}));
 const energy=[];for(let time=0;time<samples.length/sampleRate;time+=.5){const window=rows.filter(v=>v.time>=time&&v.time<time+.5);energy.push({frame:Math.round(time*fps),rms:Math.sqrt(window.reduce((s,v)=>s+v.rms**2,0)/Math.max(1,window.length))});}
 const phraseCandidates=[];for(let i=2;i<energy.length-2;i++){const before=(energy[i-2].rms+energy[i-1].rms)/2,after=(energy[i].rms+energy[i+1].rms)/2,change=Math.abs(after-before);if(change>.025&&(!phraseCandidates.length||energy[i].frame-phraseCandidates.at(-1).frame>fps*1.5))phraseCandidates.push({frame:energy[i].frame,change,kind:'energy-change-candidate'});}
 return {fps,sampleRate,duration:samples.length/sampleRate,tempo:{bpm:60/period,bpmHint:bpmHint??null,method:'Spectral-flux autocorrelation; half/double tempo ambiguity remains'},onsets,beats,strongBeatCandidates,phraseCandidates,energy,warnings:['Strong beats, energy changes and musical climax require audition; this detector does not establish downbeat meter or semantic musical climax.']};
}
export function verifyMusicAlignment(c,analysis){
 if(c.rhythm?.analysisSourceSha256&&c.rhythm.analysisSourceSha256!==analysis.sourceSha256)throw new Error('Music changed; reanalyze and review event placement');
 if(c.rhythm?.requireOnsetAlignment&&c.timeline?.events.some(e=>!analysis.onsets.some(v=>Math.abs(v.frame-e.frame)<=1)))throw new Error('A required event is not within one frame of a detected music onset; reanalyze the selected music range');
 return (c.timeline?.events??[]).map(e=>{const nearest=analysis.onsets.reduce((a,b)=>!a||Math.abs(b.frame-e.frame)<Math.abs(a.frame-e.frame)?b:a,null);return {id:e.id,eventFrame:e.frame,detectedMusicFrame:nearest?.frame??null,deltaFrames:nearest?e.frame-nearest.frame:null};});
}
export async function analyzeMusic(root,c,out){
 if(c.audio.mode!=='file')throw new Error('Music analysis needs a local recorded track');
 const base=fs.realpathSync(path.join(root,'public')),file=fs.realpathSync(path.join(base,c.audio.source));if(!file.startsWith(base+path.sep))throw new Error('Music escapes public directory');
 fs.mkdirSync(out,{recursive:true});const raw=path.join(out,'.music-analysis.f32');
 try{
  await run('ffmpeg',['-y','-v','error','-ss',String(c.audio.sourceOffsetSeconds??0),'-i',file,'-t',String(c.duration),'-ac','1','-ar','22050','-f','f32le',raw]);
  const data=fs.readFileSync(raw),samples=new Float32Array(data.length/4);for(let i=0;i<samples.length;i++)samples[i]=data.readFloatLE(i*4);
  if(samples.length/22050<c.duration-.01)throw new Error('Music is shorter than selected range');
  const result={source:c.audio.source,sourceSha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex'),sourceOffsetSeconds:c.audio.sourceOffsetSeconds??0,...analyzePCM(samples,{fps:c.fps,bpmHint:c.audio.bpm})};writeJSON(path.join(out,'music-analysis.json'),result);return result;
 }finally{fs.rmSync(raw,{force:true});}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const root=process.cwd(),c=JSON.parse(fs.readFileSync('config.json'));const r=await analyzeMusic(root,c,path.join(root,'out'));console.log(JSON.stringify({tempo:r.tempo,onsets:r.onsets.length,strongBeats:r.strongBeatCandidates.length,phraseCandidates:r.phraseCandidates.length,warnings:r.warnings}));}
