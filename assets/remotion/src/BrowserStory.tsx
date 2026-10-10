import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {Cursor,Kinetic,Mark,Product,Shot} from './parts';
import {clamp,ease,mix,ramp,settle} from './motion';
const Picture:React.FC<{file:string;crop:{x:number;y:number;width:number;height:number};width:number;height:number;imageWidth?:number;fit?:string}>=({file,crop,width,height,imageWidth=1440,fit})=>{const scale=fit==='width'?width/crop.width:Math.max(width/crop.width,height/crop.height);return <div style={{position:'absolute',top:0,left:0,right:0,height:fit==='width'?Math.min(height,crop.height*scale):height,overflow:'hidden',background:'#fcfcfc'}}><Img src={staticFile(file)} style={{position:'absolute',maxWidth:'none',width:imageWidth*scale,left:-crop.x*scale,top:-crop.y*scale}}/></div>};
const ShotView:React.FC<{c:Product;shot:Shot;f:number;start:number;fps:number;index:number;last:boolean}>=({c,shot,f,start,fps,index,last})=>{
 const p=clamp(settle(f,start,fps,.62)),t=(f-start)/fps,brand=shot.kind==='brand'||shot.kind==='outro';
 const event=c.timeline?.events.find(e=>e.id===shot.eventId),hit=event?.frame??start+Math.round(1.1*fps),focus=ramp(f,hit-fps*.18,fps*.18),focusOut=1-ramp(f,hit+fps*.85,fps*.2);
 const crop=shot.crop??{x:0,y:0,width:1440,height:900},from=shot.fromCrop??crop,pan=ease(ramp(f,start+fps*.35,fps*.85));
 const area={x:mix(from.x,crop.x,pan),y:mix(from.y,crop.y,pan)+mix(0,shot.scrollTo??0,ease(ramp(f,start+fps*1.7,fps*.9))),width:mix(from.width,crop.width,pan),height:mix(from.height,crop.height,pan)};
 if(brand)return <div style={{position:'absolute',inset:0}}>
 <div style={{position:'absolute',top:270,left:180,right:180,display:'flex',alignItems:'center',justifyContent:'center',gap:28,transform:`translateY(${(1-p)*45}px)`,opacity:.2+.8*p}}><Mark c={c} size={100}/><div style={{fontSize:96,fontWeight:800,letterSpacing:-5}}>{c.brand}</div></div>
 <div style={{position:'absolute',top:430,left:160,right:160,textAlign:'center'}}><Kinetic text={shot.title} frame={f} start={start+8} fps={fps} size={104} width={1600}/></div>
 <div style={{position:'absolute',top:610,left:230,right:230,textAlign:'center',fontSize:30,color:'#72716d',opacity:ramp(f,start+fps*.55,fps*.3)}}>{shot.subtitle}</div>
 {last&&<div style={{position:'absolute',top:725,left:800,width:320,padding:'20px 0',borderRadius:40,textAlign:'center',background:c.accent,color:'white',fontSize:29,fontWeight:650,opacity:ramp(f,start+fps*.8,fps*.25)}}>{c.url}</div>}
 {!last&&<div style={{position:'absolute',bottom:170,left:300,right:300,display:'flex',gap:24,justifyContent:'center'}}>{c.features.map((v,i)=><div key={v} style={{border:'1px solid #e9e3df',borderRadius:45,padding:'14px 30px',fontSize:23,opacity:ramp(f,start+fps*(.85+i*.13),fps*.25),transform:`translateY(${(1-ramp(f,start+fps*(.85+i*.13),fps*.35))*24}px)`}}>{v}</div>)}</div>}
 </div>;
 const w=1520,h=640,x=200,y=310,fan=shot.cards?ramp(f,start+fps*.4,fps*.6):0;
 return <div style={{position:'absolute',inset:0}}>
 <div style={{position:'absolute',top:145,left:150,right:150,textAlign:'center'}}><Kinetic text={shot.title} frame={f} start={start+4} fps={fps} size={78} width={1600}/><div style={{fontSize:25,marginTop:14,color:'#81786f',opacity:ramp(f,start+fps*.35,fps*.25)}}>{shot.subtitle}</div></div>
 <div style={{position:'absolute',left:x,top:y,width:w,height:h,opacity:1-fan,borderRadius:22,background:'#fff',border:'1px solid #ddd7d2',boxShadow:'0 30px 70px #33210b14',overflow:'hidden',transform:`translateY(${(1-p)*55}px) scale(${mix(.965,1,p)})`,transformOrigin:'50% 50%'}}>
 <div style={{height:42,display:'flex',alignItems:'center',padding:'0 18px',gap:9,borderBottom:'1px solid #e6e3e0',background:'#faf9f8'}}>{['#ff756c','#e8bd55','#69be83'].map(v=><span key={v} style={{width:10,height:10,borderRadius:10,background:v}}/>)}<span style={{margin:'auto',fontSize:17,color:'#837e79'}}>{c.url} <span style={{opacity:.5}}> / {shot.id}</span></span><span style={{fontSize:16,color:'#958c84'}}>↗</span></div>
 <div style={{position:'absolute',top:42,left:0,right:0,bottom:0}}>{shot.file&&<Picture file={shot.file} crop={area} imageWidth={shot.imageWidth} width={w} height={h-42}/>}
 {shot.focus&&<div style={{position:'absolute',left:shot.focus.x,top:shot.focus.y,width:shot.focus.width,height:shot.focus.height,border:`3px solid ${c.accent}`,borderRadius:14,boxShadow:`0 0 0 7px ${c.accent}12`,opacity:focus*focusOut,transform:`scale(${mix(1.04,1,focus)})`}}/>}
 </div></div>
 {shot.cards&&shot.file&&shot.cards.map((card,j)=>{const landing=c.timeline?.events.find(e=>e.id===card.eventId)?.frame??start+fps*(1+j*.5),lift=ease(ramp(f,landing-fps*.55,fps*.55));return <div key={j} style={{position:'absolute',left:mix(220,180+j*90,lift),top:mix(385+j*185,345+j*195,lift),width:1320,height:159,borderRadius:20,overflow:'hidden',border:'1px solid #e2d9d1',boxShadow:'0 22px 55px #33210b12',opacity:lift,transform:`perspective(1600px) rotateY(${mix(6,0,lift)}deg) rotate(${mix(0,(j-1)*2.5,lift)}deg) translateY(${(1-lift)*30}px)`}}><Picture file={shot.file!} crop={card.crop} width={1320} height={159} imageWidth={shot.imageWidth}/></div>})}
 {shot.carrierFile&&shot.carrierCrop&&t<.8&&<div style={{position:'absolute',left:mix(258,200,ease(ramp(f,start,fps*.65))),top:mix(773,310,ease(ramp(f,start,fps*.65))),width:mix(1403,1520,ease(ramp(f,start,fps*.65))),height:mix(182,640,ease(ramp(f,start,fps*.65))),borderRadius:22,overflow:'hidden',border:'1px solid #e2d5cb',boxShadow:'0 25px 65px #35200e20',opacity:1-ramp(f,start+fps*.4,fps*.3)}}><Picture file={shot.carrierFile} crop={shot.carrierCrop} fit="width" imageWidth={shot.imageWidth} width={mix(1403,1520,ease(ramp(f,start,fps*.65)))} height={mix(182,640,ease(ramp(f,start,fps*.65)))}/></div>}
 {shot.focus&&f>hit-fps*.55&&f<hit+fps*.55&&<Cursor x={x+shot.focus.x+shot.focus.width*.7+mix(70,0,ease(ramp(f,hit-fps*.55,fps*.55)))} y={y+42+shot.focus.y+shot.focus.height*.6+mix(50,0,ease(ramp(f,hit-fps*.55,fps*.55)))} click={ramp(f,hit,fps*.35)} accent={c.accent}/>}
 <div style={{position:'absolute',left:202,bottom:71,fontSize:17,color:'#a19b94'}}>0{index+1} <span style={{marginLeft:12}}>PRODUCT DISCOVERY</span></div>
 </div>;
};
export const BrowserStory:React.FC<{c:Product;f:number;fps:number;b:number[]}>=({c,f,fps,b})=>{
 const shots=c.story??[];let i=shots.length-1;for(let n=0;n<shots.length;n++)if(f<b[n+1]){i=n;break}const start=b[i],fade=ramp(f,start,fps*.35);
 return <AbsoluteFill style={{background:`linear-gradient(145deg,#faf9f7,${c.background})`,color:c.foreground}}>
 <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 80% 15%,${c.accent}08,transparent 52%)`}}/>
 {i>0&&fade<1&&<div style={{position:'absolute',inset:0,opacity:1-fade,transform:`translateX(${-fade*28}px)`}}><ShotView c={c} shot={shots[i-1]} f={start-1} start={b[i-1]} fps={fps} index={i-1} last={false}/></div>}
 <div style={{position:'absolute',inset:0,opacity:i===0?1:fade}}><ShotView c={c} shot={shots[i]} f={f} start={start} fps={fps} index={i} last={i===shots.length-1}/></div>
 <div style={{position:'absolute',top:48,left:80,display:'flex',alignItems:'center',gap:12,fontSize:22,fontWeight:750}}><Mark c={c} size={32}/>{c.brand}</div><div style={{position:'absolute',top:56,right:85,fontSize:16,letterSpacing:2,color:'#8c8178'}}>DISCOVER / EXPLORE / LAUNCH</div>
 <div style={{position:'absolute',bottom:28,left:80,color:'#a19b94',fontSize:14}}>{c.evidenceLabel}</div>
 <div style={{position:'absolute',bottom:0,left:0,height:3,width:1920*f/(c.duration*fps-1),background:c.accent,opacity:.55}}/>
 </AbsoluteFill>;
};
