import React from 'react';
import {AbsoluteFill,Img,staticFile,spring,interpolate,Easing} from 'remotion';
import type {Product} from './parts';
export type MGSpec={recipe:'orbit'|'elastic'|'split';headline:string;label?:string;items?:string[];selected?:number;file?:string};
const unit=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.76,0,.24,1)});
const box:React.CSSProperties={position:'absolute'};
// Each recipe owns a motion system, not a decoration behind a fixed headline.
export const MotionGraphics:React.FC<{spec:MGSpec;c:Product;frame:number;fps:number}>=({spec:s,c,frame:f,fps})=>{
 const t=f/fps, pop=(start:number,damping=15)=>spring({frame:Math.max(0,f-start*fps),fps,config:{damping,stiffness:130,mass:1}}),q=(a:number,b:number)=>unit(t,a,b);
 const ink=c.foreground,paper=c.background,accent=c.accent,items=s.items??c.features;
 const dark=s.recipe==='elastic';
 const stamp=<div style={{...box,left:90,top:58,fontSize:25,fontWeight:750,color:dark?paper:ink}}>{c.brand}<span style={{marginLeft:22,fontWeight:400,opacity:.55}}> / {s.label??'Original motion study'}</span></div>;
 if(s.recipe==='orbit'){
  const select=q(2.7,3.45),wipe=q(4.15,4.85),entry=pop(.05),angle=-.75+q(.3,2.6)*1.3;
  return <AbsoluteFill style={{background:paper,color:ink,overflow:'hidden'}}>{stamp}
   <svg width="1920" height="1080" style={box}><ellipse cx="960" cy="570" rx="800" ry="250" fill="none" stroke={ink} strokeOpacity=".12" strokeWidth="2"/><ellipse cx="960" cy="570" rx="630" ry="195" fill="none" stroke={ink} strokeOpacity=".08" strokeWidth="2" strokeDasharray="5 14"/></svg>
   <div style={{...box,left:100,top:155,fontSize:112,fontWeight:800,letterSpacing:-6,transform:`translateY(${(1-entry)*120}px)`,opacity:entry}}>{s.headline}</div>
   {items.map((v,i)=>{const a=angle+i*Math.PI*2/items.length,x=960+Math.sin(a)*660,y=590+Math.cos(a)*125,z=(Math.cos(a)+1)/2,chosen=i===(s.selected??0),p=pop(.18+i*.1),sx=x+(960-x)*select,sy=y+(565-y)*select;return <div key={i} style={{...box,left:sx-190,top:sy-160,width:380,height:320,padding:30,boxSizing:'border-box',borderRadius:30,background:chosen?accent:'#fff',color:chosen?'#fff':ink,border:`2px solid ${chosen?accent:'#dedbd5'}`,boxShadow:'0 24px 55px #19181720',zIndex:chosen&&select>.1?20:Math.round(z*10),opacity:chosen?Math.min(1,p):Math.min(1,p)*(1-select),transform:`translateY(${(1-p)*450}px) rotate(${Math.sin(a)*12*(1-select)}deg) scale(${(.78+z*.22)*(1-select)+(1+select*.36)*select})`}}><div style={{fontSize:17,letterSpacing:2,opacity:.65}}>DISCOVERY / 0{i+1}</div><div style={{marginTop:68,fontSize:43,fontWeight:750,letterSpacing:-2}}>{v}</div><div style={{marginTop:35,fontSize:34}}>↗</div></div>})}
   <div style={{...box,left:90,bottom:70,fontSize:24,opacity:q(1.2,1.5)*(1-wipe)}}>Explore tools. Follow a useful lead.</div>
   <div style={{...box,left:960,top:565,width:20,height:20,borderRadius:'50%',background:accent,transform:`translate(-50%,-50%) scale(${wipe*125})`,zIndex:30}}/>
  </AbsoluteFill>;
 }
 if(s.recipe==='split'){
  const reveal=q(.1,1.05),finish=q(.75,1.25),intro=pop(.4,20),exit=q(3.1,3.8);
  return <AbsoluteFill style={{background:paper,color:ink,overflow:'hidden'}}>{stamp}
   <div style={{...box,left:100,top:160,fontSize:83,fontWeight:800,letterSpacing:-4,transform:`translateX(${(1-intro)*-160}px)`}}>{s.headline}</div>
   <div style={{...box,left:110,top:310,width:1700,height:660,borderRadius:24,overflow:'hidden',boxShadow:'0 25px 80px #0002',transform:`scale(${.93+.07*finish-.28*exit})`,transformOrigin:'0 50%'}}>
    {Array.from({length:6},(_,i)=>{const p=unit(t,.1+i*.08,.8+i*.08);return <div key={i} style={{...box,left:i*1700/6,top:0,width:1700/6+1,height:660,overflow:'hidden',clipPath:`inset(${(1-p)*100}% 0 0 0)`}}><Img src={staticFile(s.file!)} style={{...box,width:1700,maxWidth:'none',left:-i*1700/6,top:0}}/></div>})}
   </div>
   {Array.from({length:6},(_,i)=><div key={i} style={{...box,left:i*320,top:0,width:321,height:1080,background:accent,transform:`translateY(${-1080*unit(t,.05+i*.06,.75+i*.06)}px)`,opacity:1-finish}}/>)}
   <div style={{...box,left:1380,top:410,width:440,fontSize:38,fontWeight:750,opacity:exit,transform:`translateX(${(1-exit)*200}px)`}}>{(s.items??['Public listing','Product overview']).map((item,i)=><div key={i} style={{padding:'28px 0',borderBottom:'2px solid #191a1c22',transform:`translateY(${(1-pop(3.25+i*.15,22))*60}px)`}}>{item}</div>)}</div>
   <div style={{...box,right:110,top:265,fontSize:19,opacity:reveal}}>PUBLIC PRODUCT CAPTURE</div>
  </AbsoluteFill>;
 }
 const collapse=q(1.9,2.65),fan=q(2.6,3.55),end=q(5.4,6.15);
 return <AbsoluteFill style={{background:ink,color:paper,overflow:'hidden'}}>{stamp}
  <div style={{...box,left:100,top:185,fontSize:115,fontWeight:800,letterSpacing:-6,lineHeight:1.06,width:1500}}>{s.headline.split(' ').map((word,i)=>{const p=pop(.06+i*.09,12);return <span key={i} style={{display:'inline-block',marginRight:30,transform:`translateY(${(1-p)*180}px) scaleX(${1+(1-p)*.5}) scaleY(${Math.max(.1,p)})`,opacity:Math.min(1,p)}}>{word}</span>})}</div>
  <svg width="1920" height="1080" style={box}><path d="M390 710 C680 370 1220 1000 1560 640" fill="none" stroke={accent} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-q(.5,1.6)}/></svg>
  {items.map((v,i)=>{const p=pop(.55+i*.11,14),x=310+i*350+(960-(310+i*350))*collapse,y=670+Math.sin(i*1.7)*65,dx=(i-(items.length-1)/2)*380*fan;return <div key={i} style={{...box,left:x-145+(960-x)*fan+dx,top:y-105+(610-y)*Math.max(collapse,fan),width:290,height:210,borderRadius:24,background:i%2?paper:accent,color:i%2?ink:'#fff',padding:26,boxSizing:'border-box',boxShadow:'0 25px 45px #0004',transform:`translateY(${(1-p)*320}px) rotate(${(i-(items.length-1)/2)*(12*(1-collapse)+5*fan)}deg) scale(${1-collapse*.4+fan*.4})`,opacity:Math.min(1,p),zIndex:10+i}}><div style={{fontSize:18,opacity:.6}}>{fan>.5?'READY TO EXPLORE':'DISCOVERED FORMAT'}</div><div style={{fontSize:51,fontWeight:800,marginTop:45,letterSpacing:-2}}>{v}</div></div>})}
  <div style={{...box,left:100,bottom:90,fontSize:25,opacity:q(3.5,3.8)}}>{s.file?'Product capability illustration':c.url}</div>
  {s.file&&<div style={{...box,inset:0,background:paper,transform:`translateY(${1080*(1-end)}px)`}}/>}
 </AbsoluteFill>;
};
