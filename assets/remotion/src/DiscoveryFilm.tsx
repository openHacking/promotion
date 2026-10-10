import React from 'react';
import {AbsoluteFill,Img,staticFile,useVideoConfig} from 'remotion';
import type {Product} from './parts';
import {discoveryLayout} from './formats.mjs';
export type Capture={file:string;imageWidth:number;crop:{x:number;y:number;width:number;height:number}};
export type DiscoverySpec={home:Capture;catalog:Capture;category:Capture;detail:Capture;selected:Capture;categories?:string[];categoryFocusY:number;categoryName:string;selectedName:string;cards:{name:string;category:string}[];headlines:[string,string,string,string,string];closing:string;safeInsets?:Partial<{top:number;right:number;bottom:number;left:number}>};
const smooth=(f:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(f-a)/(b-a)));return t*t*(3-2*t)};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const pos:React.CSSProperties={position:'absolute'};
const CaptureView:React.FC<{source:Capture;w:number;h:number;panY?:number}>=({source,w,h,panY=0})=>{
 const scale=w/source.crop.width;
 return <div style={{...pos,inset:0,overflow:'hidden',background:'#0d0d0d'}}><Img src={staticFile(source.file)} style={{...pos,width:source.imageWidth*scale,maxWidth:'none',left:-source.crop.x*scale,top:-(source.crop.y+panY)*scale}}/></div>;
};
// One persistent coordinate system carries the UI, selected row and brand between phases.
export const DiscoveryFilm:React.FC<{c:Product;f:number;fps:number}>=({c,f,fps})=>{
 const {width:w,height:h}=useVideoConfig(),s=c.discovery!,l=discoveryLayout(w,h,s.safeInsets),r=l.panel;
 const event=(id:string)=>c.timeline!.events.find(e=>e.id===id)!.frame;
 const home=event('home'),catalog=event('catalog'),browse=event('browse'),filter=event('filter'),select=event('select'),detail=event('detail'),expand=event('expand'),cta=event('cta');
 const phase=(hit:number,seconds=c.rhythm?.profile==='measured'?1:.65)=>smooth(f,hit-fps*seconds,hit),homeIn=phase(home),catalogIn=phase(catalog),filterIn=phase(filter),selectIn=phase(select),detailIn=phase(detail),expandIn=phase(expand,.9),ctaIn=phase(cta,.65);
 const introOut=phase(home,.7),introIn=smooth(f,0,fps*.65);
 const u=Math.min(w,h)/1080,accent=c.accent,ink=c.foreground;
 const pan=smooth(f,filter+fps*.2,select-fps*.8)*(s.categoryFocusY-s.category.crop.y);
 const content=(capture:Capture,amount:number,extra:React.CSSProperties={},panY=0)=><div style={{...pos,inset:0,clipPath:`inset(0 ${(1-amount)*100}% 0 0)`,...extra}}><CaptureView source={capture} w={r.width} h={r.height} panY={panY}/></div>;
 const heading=f<catalog-fps*.65?s.headlines[0]:f<filter-fps*.65?s.headlines[1]:f<detail-fps*.65?s.headlines[2]:f<expand-fps*.9?s.headlines[3]:s.headlines[4];
 const headHit=f<catalog-fps*.65?home:f<filter-fps*.65?catalog:f<detail-fps*.65?filter:f<expand-fps*.9?detail:expand;
 const titleVisible=homeIn*(1-expandIn),titleReveal=phase(headHit,.55);
 const cardW=l.cardWidth,cardH=cardW*.48,selectedY=r.y+(s.selected.crop.y-s.categoryFocusY)*r.width/s.category.crop.width;
 const focusW=r.width*(l.portrait?.95:.7);
 const selectedW=lerp(r.width,focusW,selectIn),selectedH=s.selected.crop.height*selectedW/s.selected.crop.width;
 const carrier={x:lerp(w/2-selectedW/2,r.x,detailIn),y:lerp(selectedY,r.y,detailIn),width:lerp(selectedW,r.width,detailIn),height:lerp(selectedH,r.height,detailIn)};
 return <AbsoluteFill style={{background:c.background,color:ink,overflow:'hidden'}}>
  <div style={{...pos,inset:0,opacity:.35,backgroundImage:'radial-gradient(#ffffff25 1px,transparent 1px)',backgroundSize:`${34*u}px ${34*u}px`,transform:`translateY(${Math.sin(f/fps*.3)*8*u}px)`}}/>
  <div style={{...pos,left:w*.35,top:h*.12,width:w*.6,height:h*.9,background:`radial-gradient(ellipse,${accent}1d,transparent 68%)`,transform:`translateX(${(1-homeIn)*w*.12}px)`}}/>
  <div style={{...pos,left:l.inset.left,top:l.inset.top,fontSize:Math.max(24,32*u),display:'flex',alignItems:'center',gap:14*u,fontWeight:750}}>{c.logo&&<Img src={staticFile(c.logo)} style={{width:40*u,height:40*u,borderRadius:10*u}}/>}{c.brand}</div>
  <div style={{...pos,right:l.inset.right,top:l.inset.top+10*u,fontSize:16*u,letterSpacing:2,opacity:.5}}>DISCOVER EARLY</div>
  <div style={{...pos,left:l.inset.left,top:l.introY,width:w-l.inset.left-l.inset.right,opacity:introIn*(1-introOut),transform:`translateY(${(1-introIn)*90*u-introOut*70*u}px) scale(${1-introOut*.05})`}}>
   <div style={{fontSize:l.portrait?132*u:155*u,fontWeight:800,letterSpacing:-7*u,lineHeight:.96}}>Find your<br/><span style={{color:accent}}>next SaaS.</span></div>
   <div style={{fontSize:29*u,opacity:.65,marginTop:30*u}}>New launches. Useful tools. Real makers.</div>
  </div>
  {/* Intro cards become the discovery panel rather than disappearing at a cut. */}
  {s.cards.slice(0,3).map((card,i)=>{const p=smooth(f,i*fps*.13,fps*(.8+i*.13)),x=l.portrait?r.x+(i%2)*r.width*.24:r.x+i*r.width*.32,y=l.cardY+(l.portrait?i*cardH*.62:(i%2)*40*u);return <div key={card.name} style={{...pos,left:lerp(x,r.x,homeIn),top:lerp(y,r.y,homeIn),width:lerp(cardW,r.width,homeIn),height:lerp(cardH,r.height,homeIn),padding:28*u,boxSizing:'border-box',borderRadius:24*u,background:i===1?accent:'#1e2225',border:'1px solid #ffffff22',boxShadow:'0 25px 60px #0005',transform:`translateY(${(1-p)*200*u}px) rotate(${(i-1)*-6*(1-homeIn)}deg)`,opacity:p*(1-homeIn),zIndex:i+1}}><div style={{fontSize:17*u,opacity:.6}}>{card.category}</div><div style={{marginTop:25*u,fontSize:Math.min(36*u,cardW/Math.max(8,card.name.length)*1.45),fontWeight:750}}>{card.name}</div><div style={{...pos,right:25*u,bottom:24*u,fontSize:30*u}}>↗</div></div>})}
  <div style={{...pos,left:r.x,top:l.titleY,width:r.width,fontSize:l.titleSize,fontWeight:800,lineHeight:1.08,letterSpacing:-3*u,opacity:titleVisible,clipPath:`inset(0 0 ${(1-titleReveal)*100}% 0)`,transform:`translateY(${(1-titleReveal)*25*u}px)`}}>{heading}</div>
  {/* The same panel rectangle remains visible during every factual handoff. */}
  <div style={{...pos,left:r.x,top:r.y,width:r.width,height:r.height,borderRadius:25*u,overflow:'hidden',border:'1px solid #ffffff26',boxShadow:'0 30px 90px #0008',opacity:homeIn*(1-expandIn),transform:`translateY(${(1-homeIn)*100*u}px) scale(${1-(1-homeIn)*.07})`}}>
   <CaptureView source={s.home} w={r.width} h={r.height}/>
   {content(s.catalog,catalogIn,{},smooth(f,catalog+fps*.2,browse)*330)}
   {content(s.category,filterIn,{},pan)}
   <div style={{...pos,inset:0,background:'#090b0c',opacity:selectIn*.85*(1-detailIn)}}/>
   <div style={{...pos,left:0,top:0,width:r.width,height:4*u,background:accent,transformOrigin:'0 0',transform:`scaleX(${phase(browse,.45)*(1-filterIn)})`}}/>
  </div>
  {/* A category badge keeps its location as the contents change underneath it. */}
  <div style={{...pos,left:r.x+r.width*.65,top:r.y-28*u,padding:`13px ${24*u}px`,fontSize:l.portrait?28*u:23*u,borderRadius:50,background:filterIn>.1?accent:'#202428',border:'1px solid #ffffff33',opacity:smooth(f,browse-fps*.4,browse)*(1-selectIn),transform:`translateY(${(1-phase(filter))*20*u}px)`,zIndex:8}}>{filterIn>.1?s.categoryName:'Browse categories'} <span style={{marginLeft:14*u}}>↗</span></div>
  <div style={{...pos,left:carrier.x,top:lerp(carrier.y,h*.65,expandIn),width:carrier.width,height:carrier.height,borderRadius:lerp(22,25,detailIn)*u,overflow:'hidden',border:`${2*u}px solid ${accent}`,boxShadow:'0 25px 80px #0008',opacity:selectIn*(1-expandIn),transform:`scale(${(.96+.04*selectIn)*(1-expandIn*.7)})`,transformOrigin:'0 0',zIndex:10}}>
   <CaptureView source={s.selected} w={carrier.width} h={carrier.height}/>
   <div style={{...pos,inset:0,opacity:detailIn,clipPath:`inset(${(1-detailIn)*100}% 0 0 0)`}}><CaptureView source={s.detail} w={carrier.width} h={carrier.height}/></div>
  </div>
  <div style={{...pos,left:r.x,top:r.y+r.height+25*u,fontSize:18*u,opacity:homeIn*(1-expandIn)*.55}}>PUBLIC UI CAPTURES / EDITORIAL MOTION</div>
  {/* The product panel returns to the platform proposition on the measured accent. */}
  <div style={{...pos,left:r.x,top:l.finalY,width:r.width,opacity:expandIn,transform:`translateY(${(1-expandIn)*100*u}px)`}}>
   <div style={{fontSize:l.portrait?100*u:132*u,fontWeight:800,letterSpacing:-5*u,lineHeight:1.02}}>Discover early.<br/><span style={{color:accent}}>Find what comes next.</span></div>
   <div style={{display:'flex',flexDirection:l.portrait?'column':'row',gap:20*u,marginTop:60*u}}>{['Products','Categories','Makers'].map((text,i)=>{const p=smooth(f,expand+fps*(.2+i*.35),expand+fps*(.65+i*.35));return <div key={text} style={{fontSize:31*u,padding:`22px ${30*u}px`,border:'1px solid #ffffff30',borderRadius:20*u,background:'#171b1f',opacity:p,transform:`translateY(${(1-p)*55*u}px)`}}><span style={{color:accent,marginRight:16*u}}>0{i+1}</span>{text} ↗</div>})}</div>
   <div style={{fontSize:27*u,marginTop:35*u,opacity:smooth(f,expand+fps*2,expand+fps*2.5)*.6}}>Explore launches and the people building them.</div>
  </div>
  <div style={{...pos,left:r.x,top:l.carouselY,width:r.width,height:85*u,overflow:'hidden',opacity:smooth(f,expand+fps*2.6,expand+fps*3.2)}}>{(s.categories??['Design','Analytics',s.categoryName]).map((text,i)=>{const travel=smooth(f,expand+fps*3.2,expand+fps*4.4),spacing=l.portrait?250*u:300*u,x=i*spacing-travel*spacing*.75;return <div key={text} style={{...pos,left:x,top:5*u,padding:`15px ${25*u}px`,fontSize:25*u,borderRadius:60,border:'1px solid #ff784f55',background:'#ff784f0d',whiteSpace:'nowrap',transform:`translateX(${(1-smooth(f,expand+fps*(2.6+i*.06),expand+fps*(3.2+i*.06)))*150*u}px)`}}>{text}</div>})}</div>
  <div style={{...pos,left:r.x,bottom:l.inset.bottom,width:r.width,display:'flex',flexDirection:l.portrait?'column':'row',justifyContent:'space-between',gap:20*u,alignItems:l.portrait?'flex-start':'center',opacity:ctaIn,transform:`translateY(${(1-ctaIn)*55*u}px)`}}><div style={{fontSize:30*u}}>{s.closing}</div><div style={{background:accent,color:'#111',borderRadius:50,padding:`20px ${35*u}px`,fontSize:35*u,fontWeight:750}}>{c.url} ↗</div></div>
 </AbsoluteFill>;
};
