import React from 'react';
import {AbsoluteFill,Img,staticFile,useVideoConfig} from 'remotion';
import type {Product} from './parts';
import {progress,lerp,palette,relayTimes} from './phrase-motion.mjs';
const abs:React.CSSProperties={position:'absolute'};
// The same actors persist from incoming catalogue through filtered set and detail.
export const RelayFilm:React.FC<{c:Product;f:number;fps:number}>=({c,f,fps})=>{
 const {width:w,height:h}=useVideoConfig(),v=h>w,a=c.architecture!,p=palette(c),times=relayTimes(fps,c.timeline?.events);
 const q=(s:number,e:number)=>progress(f,s*fps,e*fps),event=(id:keyof typeof times,lead:number)=>progress(f,times[id]-lead*fps,times[id]);
 const introOut=q(1.9,3.1),group=event('group',1.4),filter=event('filter',1.25),detail=event('detail',1.35),maker=event('maker',1.4),more=event('more',1.6),peak=event('peak',1.25),close=event('cta',1.05);
 const disappear=q(22,23.5),selected=a.products[a.selected],atlas=a.direction==='atlas',aperture=a.direction==='aperture';
 const gutter=w*.065,cardW=v?430:430,cardH=v?250:250;
 const detailX=gutter,detailY=v?h*.22:h*.21,detailW=w-2*gutter,detailH=v?h*.63:h*.66;
 const badge=(text:string,bg=p.accent,fg=p.ink)=><span style={{display:'inline-block',background:bg,color:fg,padding:'10px 19px',borderRadius:24,fontSize:v?24:20,fontWeight:700,whiteSpace:'nowrap'}}>{text}</span>;
 const words=(text:string,start:number,size:number,style:React.CSSProperties={})=><div style={{fontSize:size,lineHeight:.96,fontWeight:850,letterSpacing:-size*.06,...style}}>{text.split(' ').map((word,i)=><span key={i} style={{display:'inline-block',overflow:'hidden',paddingRight:'.24em',paddingBottom:'.12em',verticalAlign:'top'}}><span style={{display:'inline-block',transform:`translateY(${(1-q(start+i*.085,start+.48+i*.085))*115}%)`}}>{word}</span></span>)}</div>;
 const stageOpacity=1-q(23.35,23.5);
 return <AbsoluteFill style={{background:p.canvas,color:p.ink,overflow:'hidden'}}>
  {/* A single brand mark becomes the category lens, then the selected outline. */}
  <svg width={w} height={h} style={{...abs,inset:0,opacity:1-detail}}>
   <circle cx={lerp(w*.83,w*.5,introOut)} cy={lerp(h*.72,h*.54,introOut)} r={lerp(w*.105,atlas?w*.3:w*.19,introOut)*(1-filter*.6)} fill={p.accent} opacity={lerp(1,.10,introOut)}/>
   {aperture&&<circle cx={w*.5} cy={h*.54} r={w*.30*(.8+.2*group)} fill="none" stroke={p.secondary} strokeWidth={55} opacity={.2*(1-filter)}/>}
   {atlas&&[0,1,2].map(i=><ellipse key={i} cx={w*.5} cy={h*.52} rx={w*(.20+i*.065)} ry={h*(.20+i*.05)} fill="none" stroke={p.secondary} opacity={.25*introOut*(1-filter)} strokeWidth={2}/>)}
  </svg>
  <div style={{...abs,left:gutter,top:h*.055,display:'flex',alignItems:'center',gap:14,fontSize:27,fontWeight:800,zIndex:40}}><span style={{display:'inline-block',width:26,height:26,background:p.accent,borderRadius:8,transform:'rotate(-12deg)'}}/>{c.brand}</div>
  <div style={{...abs,right:gutter,top:h*.057,fontSize:17,letterSpacing:3,opacity:.6}}>A USEFUL DISCOVERY</div>
  <div style={{...abs,left:gutter,top:v?h*.24:h*.27,width:w*.87,opacity:1-introOut,transform:`translateY(${-130*introOut}px)`}}>
   {words('Find your',.08,v?158:210)}
   {words('next SaaS.',.40,v?158:210,{color:p.accent})}
   <div style={{fontSize:27,marginTop:38,opacity:q(.8,1.3)}}>Small teams. Big possibilities.</div>
  </div>
  <div style={{...abs,left:gutter,top:v?h*.145:h*.14,opacity:introOut*(1-detail),zIndex:22,display:'flex',gap:18,alignItems:'center'}}>{badge(filter>.5?a.category:'Explore the directory',filter>.5?p.accent:p.surface)}<span style={{fontSize:23,opacity:.6}}>{filter>.5?'A clearer set.':'Follow what interests you.'}</span></div>
  <div style={{...abs,inset:0,opacity:stageOpacity,transform:`translateX(${disappear*w}px)`}}>
   {a.categories.map((cat,j)=>{
    const active=cat===a.category; const x=v?gutter+(j%2)*w*.46:gutter+j*w*.305,y=v?h*.20+Math.floor(j/2)*58:h*.235;
    return <div key={cat} style={{...abs,left:x,top:y,zIndex:25,opacity:group*(1-detail)*(active?1:1-filter),transform:`translateY(${(1-group)*35}px)`}}>{badge(cat,active?p.accent:p.secondary,active?p.ink:p.canvas)}</div>
   })}
   {a.products.map((item,i)=>{
    const chosen=i===a.selected,cat=a.categories.indexOf(item.category),rank=a.products.slice(0,i).filter(x=>x.category===item.category).length,kept=item.category===a.category;
    const entry=progress(f,times.enter-fps*1.35+i*fps*.11,times.enter+i*fps*.11);
    const angle=i*Math.PI/3-.3;
    const scatter=atlas?{x:w*.5+Math.cos(angle)*w*.33-cardW/2,y:h*.53+Math.sin(angle)*h*.29-cardH/2}:aperture?{x:w*.5+Math.cos(angle)*w*.31-cardW/2,y:h*.56+Math.sin(angle)*h*.28-cardH/2}:{x:v?gutter+(i%2)*w*.47:gutter+(i%3)*w*.307,y:v?h*.33+Math.floor(i/2)*310:h*.34+Math.floor(i/3)*310};
    const grouped={x:v?gutter+rank*w*.47:gutter+cat*w*.307,y:v?h*.35+cat*290:h*.34+rank*300};
    const keptRank=a.products.slice(0,i).filter(x=>x.category===a.category).length;
    const focus={x:v?gutter+keptRank*70:w*.18+keptRank*580,y:v?h*.36+keptRank*320:h*.36+keptRank*55};
    let x=lerp(scatter.x+(i%2?900:-1000)*(1-entry),grouped.x,group),y=lerp(scatter.y+(1-entry)*(i%2?-360:420),grouped.y,group);
    x=lerp(x,kept?focus.x:x+(i%2?800:-800),filter);y=lerp(y,kept?focus.y:y-150,filter);
    if(chosen){x=lerp(x,detailX,detail);y=lerp(y,detailY,detail)}
    const width=chosen?lerp(cardW,detailW,detail):cardW,height=chosen?lerp(cardH,detailH,detail):cardH;
    const rot=lerp((i%2?13:-11)*(1-entry),atlas?(i-2.5)*3:aperture?(i-2.5)*7:0,entry)*(1-group)*(1-filter);
    const bg=chosen?p.ink:p.surface,fg=chosen?p.canvas:p.ink;
    return <div key={item.name} style={{...abs,left:x,top:y,width,height,borderRadius:lerp(24,36,chosen?detail:0),background:bg,color:fg,boxSizing:'border-box',padding:v?30:32,opacity:entry*(kept?1:1-filter)*(chosen?1:1-detail),transform:`rotate(${rot}deg) translateY(${-more*110}px) scale(${1-more*.025})`,zIndex:chosen?15:5,boxShadow:`0 16px 45px ${p.ink}12`,border:`2px solid ${chosen?p.accent:p.ink+'18'}`,overflow:'hidden'}}>
     <div>
     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',opacity:chosen?1-q(18.15,18.7):1}}><span style={{fontSize:18,letterSpacing:2,opacity:.7}}>{item.category.toUpperCase()}</span><span style={{width:48,height:48,borderRadius:15,background:chosen?p.accent:p.secondary,color:p.canvas,display:'grid',placeItems:'center',fontWeight:800,fontSize:28}}>{item.name.slice(0,1)}</span></div>
     <div style={{opacity:chosen?1-q(18.15,18.7):1,marginTop:22,fontSize:chosen?lerp(49,v?93:119,detail):Math.min(49,370/(item.name.length*.57)),fontWeight:850,letterSpacing:-2.5,lineHeight:1.1,whiteSpace:'nowrap'}}>{item.name}</div>
     <div style={{marginTop:20,fontSize:21,opacity:(1-detail)*.65}}>by {item.maker}</div>
     {chosen&&<>
      <div style={{...abs,left:v?30:40,top:v?210:240,width:v?width-60:width*.49,opacity:detail*(1-q(18.15,18.7))}}>
       {words(item.description,10.05,v?42:45,{fontWeight:600,letterSpacing:-1,lineHeight:1.16})}
       <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:32}}>{item.tags.map((tag,j)=><div key={tag} style={{opacity:q(11.5+j*.15,12+j*.15),transform:`translateX(${(1-q(11.5+j*.15,12+j*.15))*50}px)`}}>{badge(tag,p.secondary,p.canvas)}</div>)}</div>
      </div>
      {a.detailCrop&&<div style={{...abs,left:v?30:width*.56,top:v?height*.55:height*.31,width:v?width-60:width*.40,opacity:q(12.1,13)*(1-q(18.15,18.7)),transform:`translateY(${(1-q(12.1,13))*90}px)`,borderRadius:18,overflow:'hidden',background:p.canvas,padding:12,boxSizing:'border-box'}}><Img src={staticFile(a.detailCrop)} style={{width:'100%',display:'block'}}/><div style={{fontSize:17,color:p.ink,padding:'14px 5px 5px'}}>From the product detail page</div></div>}
      <div style={{...abs,left:32,bottom:30,opacity:detail*(1-maker),fontSize:20,letterSpacing:2,color:p.accent}}>ONE CARD. THE DETAILS THAT MATTER.</div>
      <div style={{...abs,left:lerp(v?30:width*.56,32,more),top:lerp(v?height*.76:height*.68,v?115:92,more),opacity:maker,transform:`translateX(${(1-maker)*100}px)`,width:v?width-60:width*.40,borderTop:`2px solid ${p.accent}`,paddingTop:24}}><div style={{fontSize:18,letterSpacing:3,color:p.accent,opacity:1-more}}>MEET THE MAKER</div><div style={{fontSize:lerp(v?55:53,v?82:100,more),lineHeight:1,fontWeight:750,marginTop:10}}>{selected.maker}</div></div>
     </>}
     </div>
    </div>;
   })}
  </div>
  {/* The detail hands its maker identity to a new set; cards continue moving into the closing typography. */}
  <div style={{...abs,inset:0,opacity:more*(1-disappear),zIndex:30,pointerEvents:'none'}}>
   <div style={{...abs,left:gutter+32,top:v?h*.25+115:h*.22+170,color:p.canvas}}>{words('More possibilities.',20.3,v?76:100,{color:p.accent})}</div>
   {a.products.filter(x=>x.maker===selected.maker&&x.name!==selected.name).slice(0,3).map((item,i)=>{const u=q(19.2+i*.2,20.25+i*.2),exit=q(21.1+i*.3,23.2+i*.15);return <div key={item.name} style={{...abs,left:v?gutter:w*.10+i*w*.29,top:v?h*.45+i*240:h*.52,width:v?w*.87:w*.27,height:200,borderRadius:24,background:i===1?p.accent:p.secondary,color:p.canvas,padding:30,boxSizing:'border-box',opacity:u,transform:`translate(${exit*(v?1100:1800)}px,${(1-u)*380}px) rotate(${(1-u)*(i-1)*14+exit*15}deg)`}}><div style={{fontSize:19,letterSpacing:2}}>{item.category.toUpperCase()}</div><div style={{fontSize:48,fontWeight:800,marginTop:22}}>{item.name}</div></div>})}
  </div>
  <div style={{...abs,left:0,top:h*.43,width:w,height:190,background:p.accent,zIndex:32,transform:`translateX(${lerp(-w,w,q(22.1,23.5))}px) rotate(-7deg)`,opacity:q(21.8,22.1)*(1-q(23.4,23.6))}}/>
  <div style={{...abs,inset:0,zIndex:35,opacity:disappear}}>
   <div style={{...abs,left:gutter,top:v?h*.30:h*.28,width:w*.9,opacity:1-q(25.8,26.25),transform:`translateY(${-120*q(25.8,26.25)}px)`}}>{words('Discover',23.0,v?161:230)}{words('early.',23.3,v?161:230,{color:p.accent})}</div>
   <svg width={w} height={h} style={{...abs,inset:0,opacity:peak*(1-close)}}><path d={`M ${w*.65} ${h*.75} Q ${w*.86} ${h*.49} ${w*.88} ${h*.69} T ${w*.65} ${h*.78}`} fill="none" stroke={p.secondary} strokeWidth={v?26:38} pathLength={1} strokeDasharray={1} strokeDashoffset={1-peak}/></svg>
   <div style={{...abs,left:gutter,top:v?h*.29:h*.29,width:w*.86,opacity:close}}>{words('Your next',26.2,v?133:180)}{words('starts here.',26.4,v?133:180,{color:p.accent})}<div style={{marginTop:50,fontSize:v?55:62,fontWeight:750,display:'inline-flex',alignItems:'center',gap:40,borderBottom:`4px solid ${p.secondary}`,paddingBottom:18}}>{c.url}<span style={{color:p.secondary}}>↗</span></div></div>
  </div>
  <div style={{...abs,left:gutter,bottom:h*.045,fontSize:16,opacity:.52,zIndex:40}}>Music: {c.audio.credit} · CC BY 4.0</div>
 </AbsoluteFill>;
};
