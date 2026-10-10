import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Img,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,Chrome,Cursor,Document,Kinetic,Mark,Product,ProductScreen,Text} from './parts';
import {WindowDemo} from './WindowDemo';
import {BrowserStory} from './BrowserStory';
import {clamp,curve,ease,mix,ramp,sceneStarts,settle} from './motion';
export type FilmProps={config:Product};
const layer=(opacity:number,extra:React.CSSProperties={}):React.CSSProperties=>({position:'absolute',inset:0,opacity:clamp(opacity),...extra});
const header=(c:Product,dark=false)=><><div style={{position:'absolute',left:86,top:55,display:'flex',gap:16,alignItems:'center',fontSize:24,fontWeight:650}}><Mark c={c} size={32}/>{c.brand}</div><div style={{position:'absolute',left:86,bottom:44,fontSize:20,color:dark?'#a1adc2':'#657983'}}>{c.evidenceLabel}</div><div style={{position:'absolute',right:86,bottom:44,fontSize:18,opacity:.5}}>{c.category}</div></>;

const MinimalFilm:React.FC<{c:Product;f:number;fps:number;b:number[]}>=({c,f,fps,b})=>{
 const a=settle(f,b[1],fps,.85),toCards=ramp(f,b[2],fps*.7),toFocus=ramp(f,b[3],fps*.75),out=ramp(f,b[4],fps*.5);
 return <AbsoluteFill style={{background:c.backgroundImage?'transparent':c.background,color:c.foreground}}>
  <div style={{position:'absolute',width:1100,height:1000,top:-200,right:-250,background:`radial-gradient(ellipse,${c.accent}44,transparent 65%)`,transform:`translate(${Math.sin(f/fps)*35}px,${Math.cos(f/fps)*25}px)`}}/>
  <div style={layer(1-ramp(f,b[1]-fps*.2,fps*.3))}><Brand c={c} frame={f} start={0} fps={fps}/></div>
  <div style={layer(a*(1-out))}>
   <div style={{position:'absolute',top:330,left:130,width:780,opacity:1-toCards,transform:`translateX(${(1-a)*-90}px)`}}><Kinetic text={c.title} frame={f} start={b[1]} fps={fps} size={100} width={780}/><div style={{fontSize:30,lineHeight:1.7,marginTop:35,opacity:.7}}>{c.description}</div></div>
   <div style={{position:'absolute',top:145,left:160,right:160,textAlign:'center',opacity:toCards*(1-toFocus)}}><Kinetic text={c.title} frame={f} start={b[2]} fps={fps} size={90}/></div>
   <div style={{position:'absolute',left:mix(mix(1050,900,toCards),350,toFocus),top:mix(mix(285,420,toCards),240,toFocus),width:mix(700,1220,toFocus),height:mix(550,660,toFocus),opacity:1-toCards+toFocus,transform:`perspective(1900px) rotateY(${mix(-15,0,toFocus)}deg) rotateX(${mix(7,0,toFocus)}deg) rotateZ(${mix(2,0,toFocus)}deg) translateY(${(1-a)*160}px) scale(${mix(.8,1,a)})`}}><Chrome label={c.brand} style={{height:'100%'}}><div style={{height:'calc(100% - 50px)'}}><ProductScreen c={c} index={toFocus>.4?1:0} progress={ramp(f,b[1]+fps*.7,fps*.8)}/></div></Chrome></div>
   <div style={layer(toCards*(1-toFocus))}>{c.features.map((v,i)=>{const p=settle(f,b[2]+i*fps*.12,fps,.7);return <div key={i} style={{position:'absolute',left:175+i*540,top:390,width:490,height:390,borderRadius:30,padding:40,background:c.surface,border:'1px solid #a9e5ec25',boxShadow:'0 35px 70px #0003',transform:`translateY(${mix(200,0,p)}px) rotate(${mix((i-1)*10,0,p)}deg) scale(${mix(.85,1,p)})`}}><div style={{fontSize:66,fontWeight:250,color:c.accent,marginBottom:65}}>0{i+1}</div><Text size={44} max={16}>{v}</Text><div style={{fontSize:23,lineHeight:1.6,marginTop:24,opacity:.65}}>{c.featureDescriptions?.[i]??c.description}</div></div>})}</div>
   <div style={{position:'absolute',top:142,left:160,right:160,textAlign:'center',opacity:toFocus}}><Kinetic text={c.result} frame={f} start={b[3]} fps={fps} size={70}/></div>
  </div><div style={layer(out)}><Brand c={c} frame={f} start={b[4]} fps={fps} out/></div>{header(c,true)}
 </AbsoluteFill>;
};

const CommandFilm:React.FC<{c:Product;f:number;fps:number;b:number[]}>=({c,f,fps,b})=>{
 const a=settle(f,b[1],fps,.7),pick=ramp(f,b[2],fps*.65),caps=ramp(f,b[3],fps*.7),out=ramp(f,b[4],fps*.5),typed=clamp((f-b[1]-fps*.45)/(fps*.75));
 return <AbsoluteFill style={{background:c.backgroundImage?'transparent':c.background,color:c.foreground}}>
  <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 60%,${c.accent}22,transparent 64%)`}}/>
  <div style={layer(1-ramp(f,b[1]-fps*.15,fps*.3))}><Brand c={c} frame={f} start={0} fps={fps}/></div>
  <div style={layer(a*(1-out))}>
   <div style={{position:'absolute',top:150,left:120,right:120,textAlign:'center'}}><Kinetic text={pick>.5?c.result:c.title} frame={f} start={pick>.5?b[2]:b[1]} fps={fps} size={90}/></div>
   <div style={{position:'absolute',left:mix(410,360,pick),top:mix(350,300,pick),width:mix(1100,1200,pick),height:mix(455,580,pick),borderRadius:28,background:c.surface,border:'1px solid #74658555',boxShadow:'0 45px 100px #0008',transform:`translateY(${(1-a)*170}px) scale(${mix(.8,1,a)})`,overflow:'hidden',opacity:1-caps}}>
    <div style={{height:100,borderBottom:'1px solid #665b7233',display:'flex',gap:25,alignItems:'center',padding:'0 36px',opacity:1-pick}}><span style={{fontSize:40,color:c.accent}}>⌘</span><Text size={32}>{c.task.slice(0,Math.floor(c.task.length*typed))+(typed<1?'▏':'')}</Text><span style={{marginLeft:'auto',color:'#ada1bb',fontSize:19}}>ENTER ↵</span></div>
    <div style={{position:'absolute',inset:'100px 0 0',opacity:1-pick}}>{c.features.map((v,i)=>{const p=settle(f,b[1]+fps*(1+i*.15),fps,.55);return <div key={i} style={{margin:'12px 22px',padding:'22px 26px',display:'flex',gap:20,borderRadius:15,background:i===0?`${c.accent}22`:'#ffffff04',border:i===0?`1px solid ${c.accent}77`:'1px solid transparent',opacity:clamp(p),transform:`translateX(${(1-p)*80}px)`}}><span style={{fontSize:24,color:c.accent}}>↗</span><Text size={29}>{v}</Text><span style={{marginLeft:'auto',fontSize:22,color:'#a395b4'}}>0{i+1}</span></div>})}</div>
    <div style={{position:'absolute',inset:0,opacity:pick,transform:`translateY(${(1-pick)*160}px)`}}>{c.screenshots.length?<ProductScreen c={c} index={1}/>:<Document c={c} dark progress={ramp(f,b[2]+fps*.35,fps*.8)}/>}</div>
   </div>
   <div style={layer(caps)}>{c.features.map((v,i)=>{const p=settle(f,b[3]+fps*i*.1,fps,.7);return <div key={i} style={{position:'absolute',left:255+i*480,top:420,width:450,height:310,borderRadius:26,background:c.surface,border:`1px solid ${c.accent}44`,padding:40,transform:`translateY(${mix(170,0,p)}px) rotate(${mix((i-1)*13,0,p)}deg)`}}><div style={{display:'inline-block',border:'1px solid #9988af44',borderBottomWidth:5,borderRadius:16,fontSize:50,padding:'12px 26px',color:c.accent,marginBottom:35}}>⌘ {i+1}</div><Text size={34} max={18}>{v}</Text></div>})}</div>
   {pick<.01&&<Cursor x={mix(1320,1060,ramp(f,b[2]-fps*.65,fps*.5))} y={mix(800,500,ramp(f,b[2]-fps*.65,fps*.5))} click={ramp(f,b[2]-fps*.2,fps*.4)} accent={c.accent}/>}
  </div><div style={layer(out)}><Brand c={c} frame={f} start={b[4]} fps={fps} out/></div>{header(c,true)}
 </AbsoluteFill>;
};

const WorkflowFilm:React.FC<{c:Product;f:number;fps:number;b:number[]}>=({c,f,fps,b})=>{
 const a=settle(f,b[1],fps,.8),flow=ramp(f,b[2],fps*.8),result=ramp(f,b[3],fps*.8),out=ramp(f,b[4],fps*.5);
 return <AbsoluteFill style={{background:c.backgroundImage?'transparent':c.background,color:c.foreground}}>
  <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(#203c4320 1px,transparent 1px)',backgroundSize:'26px 26px',opacity:.25}}/>
  <div style={layer(1-ramp(f,b[1]-fps*.15,fps*.3))}><Brand c={c} frame={f} start={0} fps={fps}/></div>
  <div style={layer(a*(1-out))}>
   <div style={{position:'absolute',top:155,left:140,right:140,textAlign:'center'}}><Kinetic text={result>.5?c.result:flow>.5?c.task:c.title} frame={f} start={result>.5?b[3]:flow>.5?b[2]:b[1]} fps={fps} size={80}/></div>
   <svg width="1920" height="1080" style={{position:'absolute',inset:0,opacity:flow*(1-result)}}><path d="M570 580 H1360" stroke={c.accent} strokeWidth="4" strokeDasharray="8 12" fill="none"/><circle cx={mix(570,1360,((f-b[2])/fps*.45)%1)} cy="580" r="9" fill={c.accent}/></svg>
   {c.features.map((v,i)=>{const p=settle(f,b[1]+fps*i*.12,fps,.7);const x=mix(660+i*45,190+i*530,flow),y=mix(360+i*32,390,flow);return <div key={i} style={{position:'absolute',left:mix(x,785,result),top:mix(y,465,result),width:450,height:340,borderRadius:24,padding:35,background:c.surface,border:'1px solid #d8ddd3',boxShadow:'0 25px 50px #293c4314',opacity:1-result,transform:`translateY(${(1-p)*180}px) rotate(${mix((i-1)*10,0,flow)}deg) scale(${mix(.8,1,p)})`}}><div style={{display:'flex',gap:18,alignItems:'center',marginBottom:70}}><span style={{width:45,height:45,display:'grid',placeItems:'center',borderRadius:12,background:`${c.accent}18`,color:c.accent,fontSize:26}}>0{i+1}</span><div style={{fontSize:17,letterSpacing:2,opacity:.45}}>{flow>.5?'WORKFLOW':'INPUT'}</div></div><Text size={37} max={16}>{v}</Text><div style={{marginTop:25,fontSize:23,opacity:.6,lineHeight:1.5}}>{c.featureDescriptions?.[i]??c.description}</div></div>})}
   <div style={{position:'absolute',left:515,top:315,width:890,height:590,opacity:result,transform:`translateY(${(1-result)*120}px) rotate(${mix(-5,0,result)}deg) scale(${mix(.7,1,result)})`}}><Chrome label={c.brand+' · Result'} style={{height:'100%'}}><div style={{height:'calc(100% - 50px)'}}><ProductScreen c={c} index={2} progress={ramp(f,b[3]+fps*.2,fps*.8)}/></div></Chrome></div>
  </div><div style={layer(out)}><Brand c={c} frame={f} start={b[4]} fps={fps} out/></div>{header(c)}
 </AbsoluteFill>;
};

export const Film:React.FC<FilmProps>=({config:c})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const [handle]=useState(()=>delayRender('Load local product font'));
 useEffect(()=>{let active=true;const font=new FontFace('VideoSans',`url("${staticFile(c.fontFile)}")`);font.load().then(v=>{(document.fonts as unknown as {add:(font:FontFace)=>void}).add(v);return document.fonts.ready}).then(()=>{if(active)continueRender(handle)}).catch(e=>cancelRender(e));return ()=>{active=false}},[c.fontFile,handle]);
 const b=sceneStarts(c.sceneDurations,fps),props={c,f,fps,b};return <AbsoluteFill style={{fontFamily:'VideoSans, sans-serif',fontWeight:500,background:c.background}}>{c.backgroundImage&&<Img src={staticFile(c.backgroundImage)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:c.backgroundMotion==='drift'?`scale(${1.025+.015*f/(c.duration*fps)})`:'none'}}/>}{c.template==='story'?<BrowserStory {...props}/>:c.template==='window'?<WindowDemo {...props}/>:c.template==='command'?<CommandFilm {...props}/>:c.template==='workflow'?<WorkflowFilm {...props}/>:<MinimalFilm {...props}/>}</AbsoluteFill>;
};
