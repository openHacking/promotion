import {spring} from 'remotion';
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const ease=(p:number)=>{p=clamp(p);return p*p*(3-2*p)};
export const ramp=(f:number,start:number,length:number)=>ease((f-start)/length);
export const settle=(f:number,start:number,fps:number,seconds=.7)=>f<start?0:spring({frame:f-start,fps,durationInFrames:Math.max(1,Math.round(seconds*fps)),config:{damping:17,stiffness:145,mass:.8}});
export const curve=(p:number)=>{const q=1-p;return {x:q*q*q*680+3*q*q*p*830+3*q*p*p*1050+p*p*p*1220,y:q*q*q*565+3*q*q*p*390+3*q*p*p*400+p*p*p*555}};
export const sceneStarts=(durations:number[],fps:number)=>{let sum=0;return durations.map(d=>{const n=Math.round(sum*fps);sum+=d;return n})};
