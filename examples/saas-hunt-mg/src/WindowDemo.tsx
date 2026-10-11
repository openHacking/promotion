import React from 'react';
import {AbsoluteFill,Freeze,Img,OffthreadVideo,staticFile} from 'remotion';
import {Brand,Chrome,Kinetic,Mark,Product,ProductScreen,Text} from './parts';
import {clamp,mix,ramp,settle} from './motion';
export const WindowDemo:React.FC<{c:Product;f:number;fps:number;b:number[]}>=({c,f,fps,b})=>{
 const enter=settle(f,b[1],fps,.75),expand=ramp(f,b[2],fps*.7),close=ramp(f,b[4],fps*.55),result=ramp(f,b[3],fps*.35);
 const width=mix(690,1520,expand),height=mix(360,620,expand),left=(1920-width)/2,top=mix(400,300,expand);
 const ready=c.motionEvents?.find(e=>e.kind==='action-confirm')?.frame??b[2]+Math.round(fps*.95);
 const shell=c.uiShell?.contentRect;
 return <AbsoluteFill style={{background:c.backgroundImage?'transparent':c.background,color:c.foreground}}>
 {c.shaderAsset&&<Freeze frame={Math.min(f,b[2])}><OffthreadVideo src={staticFile(c.shaderAsset)} muted style={{position:'absolute',inset:0,width:1920,height:1080,objectFit:'cover',opacity:.08}}/></Freeze>}
 <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 70% 40%,${c.accent}0c,transparent 62%)`}}/>
 <div style={{opacity:1-ramp(f,b[1]-fps*.2,fps*.3)}}><Brand c={c} frame={f} start={0} fps={fps}/></div>
 <div style={{opacity:clamp(enter)*(1-close)}}>
 <div style={{position:'absolute',top:135,width:1920,textAlign:'center'}}><Kinetic text={expand>.6?(result>.5?c.result:c.task):c.title} frame={f} start={result>.5?b[3]:expand>.6?b[2]:b[1]} fps={fps} size={76}/></div>
 {c.uiShell&&<Img src={staticFile(c.uiShell.file)} style={{position:'absolute',inset:0,width:1920,height:1080,objectFit:'contain'}}/>}
 <Chrome label={c.workspaceName??c.brand+' / Workspace'} style={{position:'absolute',left:shell?.x??left,top:shell?.y??top,width:shell?.width??width,height:shell?.height??height,transform:`translateY(${(1-enter)*90}px) perspective(1800px) rotateX(${mix(6,0,expand)}deg)`,borderRadius:24}}>
 <div style={{position:'absolute',top:50,bottom:0,insetInline:0}}>
 {c.screenshots.length?<ProductScreen c={c} index={result>.4?2:expand>.5?1:0}/>:<div style={{display:'flex',height:'100%',background:c.surface}}>
 <div style={{width:220,padding:28,background:'#f5f7f8',opacity:expand}}><Mark c={c} size={35}/>{['Workspace','Recent','Projects','Current task'].map((v,i)=><div key={v} style={{marginTop:30,fontSize:21,color:i===3?c.accent:'#71818a'}}>{v}</div>)}</div>
 <div style={{padding:42,flex:1}}><Text size={32}>{c.brand}</Text><div style={{marginTop:25,fontSize:27,color:'#536770'}}>{c.task.slice(0,Math.floor(c.task.length*ramp(f,b[2]+fps*.2,fps*.7)))}</div>
 {c.features.map((v,i)=>{const p=ramp(f,ready+i*fps*.25,fps*.3);return <div key={v} style={{marginTop:20,display:'flex',gap:18,opacity:p,transform:`translateY(${(1-p)*20}px)`}}><span style={{color:c.accent}}>✓</span><Text size={25}>{v}</Text></div>})}
 <div style={{marginTop:25,padding:23,borderRadius:15,background:`${c.accent}12`,opacity:result}}><Text size={32}>{c.result}</Text></div></div></div>}
 </div></Chrome></div>
 <div style={{opacity:close}}><Brand c={c} frame={f} start={b[4]} fps={fps} out/></div>
 <div style={{position:'absolute',bottom:40,left:90,fontSize:18,opacity:.5}}>{c.evidenceLabel}</div>
 </AbsoluteFill>;
};
