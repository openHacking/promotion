import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {sampleKeys} from './scene-motion.mjs';

export type Pose={x?:number;y?:number;z?:number;scale?:number;rotate?:number;rotateX?:number;rotateY?:number;opacity?:number;reveal?:number};
export type Key=Pose&{frame:number;easing?:'linear'|'smooth'};
export type SceneLayer={id:string;kind:'image'|'video'|'text'|'shape';file?:string;text?:string;x:number;y:number;width:number;height:number;depth?:number;keys?:Key[];color?:string;fontSize?:number;radius?:number;shadow?:boolean;crop?:{x:number;y:number;width:number;height:number};imageWidth?:number;mask?:'left'|'circle';startFrame?:number;endFrame?:number;videoStartFrame?:number};
export type SceneSpec={background?:string;perspective?:number;camera?:Key[];light?:{x:number;y:number;color:string;opacity:number;size:number};layers:SceneLayer[]};
const initial:Required<Pose>={x:0,y:0,z:0,scale:1,rotate:0,rotateX:0,rotateY:0,opacity:1,reveal:1};
export const Scene:React.FC<{scene:SceneSpec;frame:number}>=({scene,frame})=>{
 const globalFrame=useCurrentFrame();
 const camera=sampleKeys(scene.camera,frame,initial);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:scene.background??'transparent',perspective:scene.perspective??2400}}>
 <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`translate3d(${-camera.x}px,${-camera.y}px,${-camera.z}px) scale(${camera.scale}) rotate(${-camera.rotate}deg) rotateX(${-camera.rotateX}deg) rotateY(${-camera.rotateY}deg)`}}>
 {scene.layers.map(layer=>{
  const start=layer.startFrame??0,end=layer.endFrame;
  if(frame<start||(end!==undefined&&frame>=end))return null;
  const pose=sampleKeys(layer.keys,frame,initial),depth=layer.depth??0;
  const mask=layer.mask==='circle'?`circle(${pose.reveal*100}% at 50% 50%)`:layer.mask==='left'?`inset(0 ${(1-pose.reveal)*100}% 0 0)`:undefined;
  const crop=layer.crop,scale=crop?Math.max(layer.width/crop.width,layer.height/crop.height):1;
  return <div key={layer.id} style={{position:'absolute',left:layer.x,top:layer.y,width:layer.width,height:layer.height,transformStyle:'preserve-3d',transform:`translate3d(${pose.x}px,${pose.y}px,${depth+pose.z}px) scale(${pose.scale}) rotate(${pose.rotate}deg) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg)`,opacity:pose.opacity,boxShadow:layer.shadow&&(!layer.mask||pose.reveal>0)?'0 24px 65px #24180e30':undefined,borderRadius:layer.radius??0}}>
  <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:layer.radius??0,clipPath:mask,background:layer.kind==='shape'?layer.color:undefined}}>
  {layer.kind==='image'&&<Img src={staticFile(layer.file!)} style={crop?{position:'absolute',width:(layer.imageWidth??1440)*scale,maxWidth:'none',left:-crop.x*scale,top:-crop.y*scale}:{width:'100%',height:'100%',objectFit:'contain'}}/>}
  {layer.kind==='video'&&<Sequence from={globalFrame-frame+start} durationInFrames={end===undefined?undefined:end-start} layout="none"><OffthreadVideo src={staticFile(layer.file!)} startFrom={layer.videoStartFrame??0} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>}
  {layer.kind==='text'&&<div data-copy style={{color:layer.color??'#191817',fontSize:layer.fontSize??48,fontWeight:700,lineHeight:1.15,whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{layer.text}</div>}
  </div></div>;
 })}
 </div>
 {scene.light&&<div style={{position:'absolute',left:scene.light.x-scene.light.size/2,top:scene.light.y-scene.light.size/2,width:scene.light.size,height:scene.light.size,pointerEvents:'none',opacity:scene.light.opacity,background:`radial-gradient(circle,${scene.light.color},transparent 70%)`,mixBlendMode:'soft-light'}}/>}
 </div>;
};
