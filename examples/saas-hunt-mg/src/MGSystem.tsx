import React from 'react';
import {AbsoluteFill,useVideoConfig} from 'remotion';
import type {RecipeOptions} from './mg-motion.mjs';
import {recipePose,smooth} from './mg-motion.mjs';
export const SYSTEM_RECIPES=['type','path','morph','aggregate','filter','expand','flow','spatial'] as const;
export type SystemSpec={recipe:typeof SYSTEM_RECIPES[number];headline:string;items?:string[];selected?:number;label?:string;motion?:RecipeOptions};
export const MGSystem:React.FC<{spec:SystemSpec;frame:number;fps:number;accent:string}>=({spec,frame,fps,accent})=>{
 const {width,height}=useVideoConfig(),portrait=height>width,u=width/1920,items=spec.items??['Discover','Category','Product','Maker'];
 const flowStart=spec.motion?.actionStartFrame??fps*.8,flowEnd=flowStart+(spec.motion?.actionDurationFrames??fps*1.6),morphStart=spec.motion?.actionStartFrame??fps*2,morphEnd=morphStart+(spec.motion?.actionDurationFrames??fps*.7);
 return <AbsoluteFill style={{background:'#f5f1e8',color:'#141414',overflow:'hidden'}}>
  <div style={{position:'absolute',left:width*.06,top:height*.06,fontSize:28*u,letterSpacing:3}}>MOTION STUDY / {spec.recipe.toUpperCase()}</div>
  <div style={{position:'absolute',left:width*.06,top:height*.18,width:width*.88,fontSize:portrait?width*.1:110*u,fontWeight:800,lineHeight:1.02,letterSpacing:-4*u}}>{spec.headline}</div>
  {spec.recipe==='flow'&&<svg width={width} height={height} style={{position:'absolute'}}><path d={`M${width*.14} ${height*.64} H${width*.86}`} fill="none" stroke={accent} strokeWidth={8*u} pathLength={1} strokeDasharray={1} strokeDashoffset={1-smooth(frame,flowStart,flowEnd)}/></svg>}
  {items.map((text,i)=>{const p=recipePose(spec.recipe,frame,fps,i,items.length,spec.selected??0,spec.motion);return <div key={i} style={{position:'absolute',left:width/2-130*u+p.x*u,top:height*.6+p.y*u,width:260*u,height:180*u,padding:24*u,boxSizing:'border-box',background:i%2?accent:'#171717',color:i%2?'#141414':'#f5f1e8',borderRadius:spec.recipe==='morph'?(spec.motion?.radius??90)*smooth(frame,morphStart,morphEnd)*u:18*u,opacity:p.opacity,clipPath:`inset(${(1-p.reveal)*100}% 0 0 0)`,transform:`rotate(${p.rotate}deg) scale(${p.scale})`,zIndex:Math.round(p.scale*100),fontSize:38*u,fontWeight:750}}><div style={{fontSize:20*u,opacity:.6,marginBottom:36*u}}>0{i+1}</div>{text}</div>})}
 </AbsoluteFill>;
};
