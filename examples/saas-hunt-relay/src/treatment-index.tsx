import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,useVideoConfig,delayRender,continueRender,cancelRender,staticFile} from 'remotion';
import {Film} from './Film';
import {progress} from './phrase-motion.mjs';
import type {Product} from './parts';
import config from '../config.json';
const RelayTreatment:React.FC<{config:Product}>=({config:c})=><Film config={c}/>;
// Reconstructed Markdown-to-live-preview behavior, verified against typora.io.
const WritingTransfer:React.FC=()=>{
 const [handle]=useState(()=>delayRender('Local reading font'));useEffect(()=>{new FontFace('VideoSans',`url("${staticFile('font.ttf')}")`).load().then(font=>{(document.fonts as unknown as {add:(font:FontFace)=>void}).add(font);continueRender(handle)}).catch(cancelRender)},[handle]);
 const f=useCurrentFrame(),{fps}=useVideoConfig(),q=(a:number,b:number)=>progress(f,a*fps,b*fps),select=q(1.2,2.2),edit=q(3.0,4.4),page=q(5.7,7.1),end=q(8.5,9.3);
 return <AbsoluteFill style={{background:'#eee8db',color:'#193d35',fontFamily:'VideoSans, sans-serif',padding:80}}>
  <div style={{fontFamily:'VideoSans, sans-serif',fontSize:22,letterSpacing:4}}>TYPORA / MARKDOWN, WITHOUT THE CLUTTER</div>
  <div style={{position:'absolute',left:100,top:150,fontSize:72,opacity:1-page,transform:`translateY(${-35*page}px)`}}>Make room for the idea.</div>
  <div style={{position:'absolute',left:100+page*630,top:340-page*170,width:1650-page*760,height:550+page*280,background:'#fffdf7',padding:60,boxSizing:'border-box',boxShadow:'0 12px 40px #193d3514',transform:`rotate(${-2*page}deg) scale(${1-end*.04})`}}>
   <div style={{fontSize:18,letterSpacing:2,fontFamily:'VideoSans, sans-serif',opacity:page,marginBottom:32}}>LIVE PREVIEW</div>
   <div style={{position:'relative',fontSize:57+edit*12-page*15,lineHeight:1.5}}><span style={{background:`rgba(220,182,102,${select*(1-edit)*.65})`}}><span style={{display:'inline-block',width:75*(1-edit),opacity:1-edit,overflow:'hidden',verticalAlign:'bottom',color:'#ac7946'}}># </span><span style={{fontWeight:400+Math.round(edit*300)}}>A clearer thought.</span></span></div>
   <div style={{marginTop:38,opacity:page}}>{[.86,.94,.63].map((n,i)=><div key={i} style={{height:12,background:'#193d3515',width:`${n*100}%`,marginBottom:24}}/>)}</div>
   <div style={{position:'absolute',right:45,bottom:40,fontSize:22,fontFamily:'VideoSans, sans-serif',opacity:edit*(1-page),color:'#193d35'}}>Markdown becomes a heading.</div>
  </div>
  <div style={{position:'absolute',left:100,top:400,width:560,fontSize:84,opacity:q(6.7,7.2),lineHeight:1.1}}>Write.<br/>See it.</div>
  <div style={{position:'absolute',left:100,bottom:65,fontSize:18,fontFamily:'VideoSans, sans-serif'}}>Reconstructed live preview · typora.io · Music: Carefree — Kevin MacLeod · CC BY 4.0</div>
 </AbsoluteFill>;
};
registerRoot(()=> <><Composition id="Treatment" component={RelayTreatment} defaultProps={{config:config as unknown as Product}} width={1920} height={1080} fps={60} durationInFrames={1800}/><Composition id="Transfer" component={WritingTransfer} width={1920} height={1080} fps={60} durationInFrames={600}/></>);
