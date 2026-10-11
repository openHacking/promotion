import React from 'react';
import {AbsoluteFill,Img,staticFile,useVideoConfig} from 'remotion';
import {RelayFilm} from './RelayFilm';
import {colorMix} from './phrase-motion.mjs';
import type {Product} from './parts';
import {smooth,punch,mix,pathPoint,elastic} from './mg-motion.mjs';
export type ArchitectureSpec={choreography?:'relay';direction?:'ribbon'|'atlas'|'aperture';secondary?:string;products:{name:string;category:string;maker:string;description:string;tags:string[];source:string}[];categories:string[];selected:number;category:string;detailCrop?:string};
const abs:React.CSSProperties={position:'absolute'};
const LegacyArchitectureFilm:React.FC<{c:Product;f:number;fps:number}>=({c,f,fps})=>{
 const {width:w,height:h}=useVideoConfig(),portrait=h>w,a=c.architecture!,orange=c.accent,paper=c.background,ink=c.foreground;
 const hit=(id:string,fallback:number)=>(c.timeline?.events.find(e=>e.id===id)?.frame??fallback*fps)/fps;
 const t=f/fps,group=smooth(t,hit('group',6)-.75,hit('group',6)),filter=smooth(t,hit('filter',9)-.7,hit('filter',9)),expand=smooth(t,hit('detail',14)-.85,hit('detail',14)),maker=smooth(t,hit('maker',20)-.8,hit('maker',20)),more=smooth(t,22.5,23.6),peak=smooth(t,hit('peak',24.5)-.5,hit('peak',24.5)),close=smooth(t,hit('cta',27)-.4,hit('cta',27));
 const shade=filter*(1-expand),background=colorMix(paper,ink,shade);
 const opening=t<3,closing=t>=24,selected=a.products[a.selected],cw=portrait?w*.40:w*.255,ch=portrait?240:220,baseY=portrait?h*.35:h*.4;
 const title=(lines:string[],start:number,size:number,color=ink)=><div style={{...abs,left:w*.06,top:portrait?h*.16:h*.17,width:w*.88,color,fontSize:size,fontWeight:850,lineHeight:.94,letterSpacing:-size*.055}}>{lines.map((v,i)=>{const p=elastic(t,start+i*.11,start+.55+i*.11,.2);return <div key={i} style={{overflow:'hidden',paddingBottom:size*.07}}><div style={{transform:`translateY(${(1-p)*120}%) skewX(${(1-p)*-12}deg)`}}>{v}</div></div>})}</div>;
 const badge=(text:string,color=orange)=><span style={{display:'inline-block',padding:portrait?'12px 22px':'9px 18px',background:color,color:ink,borderRadius:40,fontSize:portrait?27:23,fontWeight:700}}>{text}</span>;
 return <AbsoluteFill style={{background:opening||closing?orange:background,color:ink,overflow:'hidden'}}>
  <div style={{...abs,left:w*.06,top:h*.05,fontSize:portrait?30:26,fontWeight:750,display:'flex',gap:15,alignItems:'center',color:filter>.5&&expand<.1?paper:ink}}>{c.logo&&<Img src={staticFile(c.logo)} style={{width:36,height:36}}/>}{c.brand}</div>
  <div style={{...abs,right:w*.06,top:h*.053,fontSize:portrait?24:20,letterSpacing:3,color:filter>.5&&expand<.1?paper:ink}}>DISCOVER / EARLY</div>
  {opening&&<>
   <svg width={w} height={h} style={{...abs,inset:0}}><circle cx={w*.83} cy={h*.76} r={mix(0,portrait?390:280,punch(t,.15,.85))} fill={ink}/><path d={`M${w*.73} ${h*.76} H${w*.91} M${w*.85} ${h*.68} L${w*.91} ${h*.76} L${w*.85} ${h*.84}`} stroke={paper} strokeWidth={portrait?20:16} fill="none" style={{transformOrigin:`${w*.83}px ${h*.76}px`,transform:`rotate(${mix(-55,0,elastic(t,.3,1))}deg)`}}/></svg>
   {title(['Find your','next SaaS.'],hit('intro',.72)-.66,portrait?150:215)}
   <div style={{...abs,left:w*.06,bottom:h*.14,fontSize:32,width:portrait?w*.52:w*.45,opacity:punch(t,.9,1.3)}}>New products.<br/>Useful possibilities.</div>
   <div style={{...abs,inset:0}}><svg width={w} height={h} style={{...abs,inset:0}}><circle cx={w*.83} cy={h*.76} r={smooth(t,2.55,3)*Math.hypot(w,h)} fill={paper}/></svg><div style={{...abs,inset:0,opacity:smooth(t,2.7,3)}}><div style={{...abs,left:w*.06,top:portrait?h*.14:h*.17,width:w*.88,fontSize:portrait?69:108,fontWeight:850,letterSpacing:-5,lineHeight:1}}>A world of tools.</div><div style={{...abs,left:w*.06,top:h*.05,fontSize:portrait?30:26,fontWeight:750,display:'flex',gap:15,alignItems:'center'}}>{c.logo&&<Img src={staticFile(c.logo)} style={{width:36,height:36}}/>}{c.brand}</div><div style={{...abs,right:w*.06,top:h*.053,fontSize:portrait?24:20,letterSpacing:3}}>DISCOVER / EARLY</div></div></div>
  </>}
  {!opening&&!closing&&<>
   <div style={{...abs,left:w*.06,top:portrait?h*.14:h*.17,width:w*.88,fontSize:portrait?69:108,fontWeight:850,letterSpacing:-5,lineHeight:1,opacity:1-expand,color:filter>.5?paper:ink}}>{filter>.5?'Find your category.':'A world of tools.'}</div>
   <div style={{...abs,left:w*.06,top:portrait?h*.25:h*.3,display:'flex',gap:16,flexWrap:'wrap',width:w*.88,opacity:group*(1-expand)}}>{a.categories.map(cat=><div key={cat} style={{opacity:filter&&cat!==a.category?1-filter*.8:1,transform:`translateY(${(1-group)*40}px)`}}>{badge(cat,cat===a.category&&filter>0?orange:c.surface)}</div>)}</div>
   {a.products.map((v,i)=>{
    const cat=a.categories.indexOf(v.category),row=a.products.slice(0,i).filter(vv=>vv.category===v.category).length;
    const grid={x:portrait?w*.07+(i%2)*(cw+30):w*.06+(i%3)*(cw+30),y:baseY+Math.floor(i/(portrait?2:3))*(ch+32)};
    const grouped={x:portrait?w*.07+row*(cw+30):w*.06+cat*(cw+30),y:baseY+(portrait?cat:row)*(ch+32)};
    const filteredIndex=a.products.slice(0,i).filter(vv=>vv.category===a.category).length;
    const target={x:portrait?w*.30:w*.15+filteredIndex*(cw+70),y:portrait?baseY+filteredIndex*(ch+35):baseY+70};
    const entry=punch(t,hit('enter',3.75)-.75+i*.075,hit('enter',3.75)+i*.075),point=pathPoint([{x:grid.x+(i%2?900:-800),y:grid.y+400},{x:grid.x+(i%2?-250:250),y:grid.y-150},grid],entry);
    let x=mix(point.x,grouped.x,group),y=mix(point.y,grouped.y,group);x=mix(x,target.x,filter);y=mix(y,target.y,filter);
    const chosen=i===a.selected,visible=v.category===a.category?1:1-filter;
    const detailX=w*.06,detailY=portrait?h*.24:h*.27,detailW=w*.88,detailH=portrait?h*.57:h*.6;
    if(chosen){x=mix(x,detailX,expand);y=mix(y,detailY,expand)}
    const width=chosen?mix(cw,detailW,expand):cw,height=chosen?mix(ch,detailH,expand):ch;
    return <div key={v.name} style={{...abs,left:x,top:y,width,height,boxSizing:'border-box',padding:portrait?32:28,borderRadius:mix(24,8,expand),border:`${chosen?3:1}px solid ${chosen?orange:c.foreground+'44'}`,background:chosen&&expand>.1?ink:c.surface,color:chosen&&expand>.1?paper:ink,opacity:entry*visible*(chosen?1-more:1-expand),transform:`rotate(${(1-entry)*(i%2?18:-18)}deg) scale(${1-maker*.06})`,transformOrigin:'50% 50%',zIndex:chosen?10:1,overflow:'hidden',boxShadow:'0 18px 45px #00000012'}}>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>{badge(v.category)}<span style={{fontSize:24}}>↗</span></div>
     <div style={{fontSize:chosen?mix(Math.min(46,(cw-60)/(v.name.length*.55)),portrait?82:105,expand):Math.min(46,(cw-60)/(v.name.length*.55)),fontWeight:850,letterSpacing:-2,marginTop:22,whiteSpace:'nowrap'}}>{v.name}</div>
     <div style={{fontSize:portrait?25:22,opacity:1-expand*.35,marginTop:12}}>{v.maker}</div>
     {chosen&&<div style={{opacity:expand,marginTop:portrait?34:25}}>
      <div style={{fontSize:portrait?39:34,lineHeight:1.2,width:portrait?'100%':'53%'}}>{v.description}</div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:28,width:portrait?'100%':'53%'}}>{v.tags.map(tag=><span key={tag} style={{border:'1px solid '+paper+'55',borderRadius:30,padding:'10px 18px',fontSize:portrait?25:22}}>{tag}</span>)}</div>
      {a.detailCrop&&<div style={{...abs,left:portrait?32:width*.61,top:portrait?height*.66:height*.30,width:portrait?width-64:width*.34,height:portrait?height*.21:height*.32,border:'1px solid '+paper+'44',overflow:'hidden',borderRadius:12,opacity:smooth(t,15,15.6),transform:`translateY(${(1-smooth(t,15,15.6))*60}px)`}}><Img src={staticFile(a.detailCrop)} style={{width:'100%'}}/></div>}
      <div style={{...abs,left:portrait?32:28,bottom:28,fontSize:portrait?26:23,opacity:1-maker}}>View product details ↗</div>
     </div>}
    </div>;
   })}
   {maker>0&&<>
    <svg width={w} height={h} style={{...abs,inset:0,zIndex:12,opacity:1-more}}><path d={portrait?`M${w*.5} ${h*.63} V${h*.7}`:`M${w*.38} ${h*.65} H${w*.61}`} stroke={orange} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1-maker} fill="none"/></svg>
    <div style={{...abs,left:portrait?w*.12:w*.59,top:portrait?h*.66:h*.57,width:portrait?w*.76:w*.32,padding:32,boxSizing:'border-box',background:orange,borderRadius:18,zIndex:15,opacity:maker*(1-more),transform:`translateY(${(1-maker)*100}px)`}}><div style={{fontSize:24,letterSpacing:3}}>MEET THE MAKER</div><div style={{fontSize:portrait?62:60,fontWeight:850,margin:'20px 0'}}>{selected.maker}</div><div style={{fontSize:28}}>Products from this maker ↗</div></div>
   </>}
   {more>0&&<div style={{...abs,inset:0,background:ink,color:paper,opacity:more,zIndex:20}}><div style={{...abs,left:w*.06,top:h*.15,fontSize:portrait?115:160,fontWeight:850,lineHeight:.95,letterSpacing:-6}}>One useful lead.<br/><span style={{color:orange}}>More to discover.</span></div>{a.products.filter(v=>v.maker===selected.maker&&v.name!==selected.name).slice(0,3).map((v,i)=><div key={v.name} style={{...abs,left:portrait?w*.08+(i%2)*w*.46:w*.08+i*w*.3,top:portrait?h*.48+Math.floor(i/2)*240:h*.62,background:orange,color:ink,padding:portrait?'26px 22px':'24px 35px',width:portrait?w*.4:w*.26,borderRadius:22,boxSizing:'border-box',transform:`translateY(${(1-punch(t,22.6+i*.08,23.3+i*.08))*300}px) rotate(${(i-1)*-7}deg)`}}><div style={{fontSize:portrait?29:24,marginBottom:20}}>{v.category} ↗</div><div style={{fontSize:portrait?42:48,fontWeight:850}}>{v.name}</div><div style={{fontSize:22,marginTop:15}}>{v.maker}</div></div>)}</div>}
  </>}
  {closing&&<>
   {a.categories.map((cat,i)=>{const p=punch(t,24+i*.09,24.6+i*.09),angle=i*Math.PI*2/3+peak*.25,radius=portrait?150:235;return <div key={cat} style={{...abs,left:(portrait?w*.66:w*.78)+Math.cos(angle)*radius,top:h*.75+Math.sin(angle)*radius,background:ink,color:paper,borderRadius:60,padding:'14px 24px',fontSize:portrait?28:27,zIndex:2,opacity:p*(1-close),transform:`translate(-50%,-50%) scale(${.65+.35*p}) rotate(${(1-p)*(i-1)*25}deg)`}}>{cat}</div>})}
   <svg width={w} height={h} style={{...abs,inset:0}}>{Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6+peak*.3;return <rect key={i} x={w*.8-12} y={h*.75-250} width={24} height={180} rx={12} fill={ink} style={{transformOrigin:`${w*.8}px ${h*.75}px`,transform:`rotate(${angle*180/Math.PI}deg) scale(${(1-close)*peak})`}}/>})}</svg>
   <AbsoluteFill style={{opacity:1-smooth(t,hit('cta',27)-.6,hit('cta',27)-.35),transform:`translateY(${-80*close}px)`}}>{title(['Discover','early.'],24,portrait?142:215)}</AbsoluteFill><AbsoluteFill style={{opacity:smooth(t,hit('cta',27)-.45,hit('cta',27))}}>{title(['SaaS Hunt.','Explore now.'],hit('cta',27)-.66,portrait?142:215)}</AbsoluteFill>
   <div style={{...abs,left:w*.06,bottom:h*.13,fontSize:portrait?57:66,fontWeight:750,opacity:close,background:ink,color:paper,padding:'22px 35px',borderRadius:60}}>{c.url} ↗</div>
  </>}
 </AbsoluteFill>;
};

export const ArchitectureFilm:React.FC<{c:Product;f:number;fps:number}>=(props)=>props.c.architecture?.choreography==='relay'?<RelayFilm {...props}/>:<LegacyArchitectureFilm {...props}/>;
