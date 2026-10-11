import React,{useEffect,useState} from 'react';
import {AbsoluteFill,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Product,SceneProduct} from './parts';
import {progress,lerp} from './phrase-motion.mjs';
export type FilmProps={config:Product|SceneProduct};
const mix=lerp;
const Text:React.FC<{x:number;y:number;size:number;children:React.ReactNode;fill?:string;anchor?:'start'|'middle'|'end';weight?:number;opacity?:number}>=({x,y,size,children,fill='currentColor',anchor='start',weight=750,opacity=1})=><text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontWeight={weight} opacity={opacity} letterSpacing={-size*.045}>{children}</text>;
export const Film:React.FC<FilmProps>=({config:c})=>{
 const [handle]=useState(()=>delayRender('Load local typography'));
 useEffect(()=>{new FontFace('VideoSans',`url("${staticFile(c.fontFile)}")`,{weight:"100 900"}).load().then(font=>{(document.fonts as unknown as {add:(font:FontFace)=>void}).add(font);return document.fonts.ready}).then(()=>continueRender(handle)).catch(cancelRender)},[handle,c.fontFile]);
 const f=useCurrentFrame(),{width:W,height:H}=useVideoConfig(),P=H>W,cx=W/2,cy=H/2;
 const q=(a:number,b:number)=>progress(f,a,b),blue=c.accent,ink=c.background,paper=c.foreground,white=c.surface,lime='#dcff54';
 const ev=(id:string,fallback:number)=>c.timeline?.events?.find(e=>e.id===id)?.frame??fallback;
 const E=ev('editor',218),V=ev('preview',452),L=ev('local',695),D=ev('export',870),C=ev('cards',1070),F=ev('fan',1180),B=ev('brand',1650);
 const pageW=P?800:940,pageH=P?650:580,px=cx-pageW/2,py=cy-pageH/2;
 const rule=(x:number,y:number,w:number,color:string,h=10)=><rect x={x} y={y} width={Math.max(0,w)} height={h} rx={h/2} fill={color}/>;
 const star=(x:number,y:number,r:number,color:string,rotation=0)=><g transform={`translate(${x} ${y}) rotate(${rotation})`}>{Array.from({length:8},(_,i)=><rect key={i} x={-r} y={-r*.09} width={r*2} height={r*.18} fill={color} transform={`rotate(${i*22.5})`}/>)}</g>;
 const label=(text:string,n:string,color=paper)=><g fill={color}><Text x={P?70:90} y={P?155:112} size={24} fill={color} weight={500}>{n} / MARKPRESS</Text><Text x={P?70:90} y={P?225:170} size={P?45:42} fill={color}>{text}</Text></g>;
 const footer=(color=paper)=><Text x={W-65} y={H-65} size={20} fill={color} anchor="end" weight={500}>LOCAL-FIRST MARKDOWN</Text>;
 const wipe=(start:number,end:number,color:string,children:React.ReactNode)=><g clipPath={`url(#wipe-${start})`}><defs><clipPath id={`wipe-${start}`}><rect width={W*q(start,end)} height={H}/></clipPath></defs><rect width={W} height={H} fill={color}/>{children}</g>;
 return <AbsoluteFill style={{background:ink,fontFamily:'VideoSans, sans-serif'}}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{color:paper}}>
 <defs><clipPath id="canvas"><rect width={W} height={H}/></clipPath></defs><g clipPath="url(#canvas)">
 {/* The Markdown hash is assembled, then expands into the editor divider. */}
 {f<E&&<g><rect width={W} height={H} fill={blue}/>{Array.from({length:8},(_,i)=>{const a=q(i*3,32+i*3),out=q(135,192);return <rect key={i} x={cx-((i%2)?70:210)} y={cy-170+Math.floor(i/2)*105} width={((i%2)?55:400)*(1+out*7)} height={45} fill={i%3===0?lime:paper} transform={`translate(${(1-a)*(i%2?W:-W)} 0) rotate(${mix((i-4)*35,-12,a)+out*80} ${cx} ${cy})`} opacity={1-q(58+i*3,80+i*3)}/>})}
 {['MAKE','IDEAS','MOVE.'].map((word,i)=>{const a=q(30+i*24,54+i*24),out=q(140+i*4,182+i*4),size=P?222:245;return <g key={word} transform={`translate(${cx} ${cy+(i-1)*(P?255:235)+75}) rotate(${mix(-12,0,a)}) scale(${mix(.3,1,a)*(1+out*.25)})`} opacity={a*(1-out)}><Text x={0} y={0} size={size} anchor="middle" fill={i===1?lime:paper}>{word}</Text></g>})}
 {star(P?890:1630,P?380:285,68,lime,f*.8)}<Text x={65} y={H-65} size={25} fill={paper} weight={500}>A little Markdown. A lot of possibility.</Text></g>}
 {/* Raw syntax and preview share the same baseline and scan event. */}
 {f>=162&&f<L&&wipe(162,E,ink,<>
 {label('Write it. See it.','01')}
 {(()=>{const enter=q(E-55,E),preview=q(V-58,V),expand=q(585,635),local=q(L-55,L);const x=P?70:135,y=P?520:310,w=P?940:1650,h=P?810:590,split=P?.59:.5;return <g transform={`translate(${0} ${(1-enter)*250-local*140}) scale(${1-local*.08})`} style={{transformOrigin:`${cx}px ${cy}px`}}>
 <rect x={x} y={y} width={w} height={h} rx={16} fill={white}/><rect x={x} y={y} width={w} height={54} rx={16} fill="#e6e8ef"/><Text x={x+28} y={y+36} size={21} fill={ink} weight={500}>launch-note.md</Text>
 <g opacity={1-q(555,575)}><Text x={x+38} y={y+150} size={P?35:47} fill={blue}># Make ideas move.</Text><Text x={x+38} y={y+235} size={P?28:33} fill={ink} weight={500}>## Start with a thought</Text>{['- Write in Markdown','- Preview as you go','- Keep the source'].map((t,i)=><g key={t} clipPath={`url(#line-${i})`}><defs><clipPath id={`line-${i}`}><rect x={x+38} y={y+285+i*65} width={w*.47*q(E+20+i*28,E+58+i*28)} height={60}/></clipPath></defs><Text x={x+38} y={y+325+i*65} size={P?25:30} fill={ink} weight={500}>{t}</Text></g>)}</g>
 {P?<line x1={x+35} x2={x+w-35} y1={y+h*split} y2={y+h*split} stroke={blue} strokeWidth={4} opacity={preview*(1-q(555,575))}/>:<line x1={x+w*split} x2={x+w*split} y1={y+85} y2={y+h-40} stroke={blue} strokeWidth={4} opacity={preview*(1-q(555,575))}/>}
 <g transform={`translate(${mix(P?x+45:x+w*.55,x+75,expand)} ${mix(P?y+h*.69:y+180,y+200,expand)})`} opacity={preview}>
 <Text x={0} y={0} size={mix(P?65:70,P?100:135,expand)} fill={ink}>Make ideas</Text><Text x={0} y={mix(78,145,expand)} size={mix(P?65:70,P?100:135,expand)} fill={blue}>move.</Text>
 {[.75,.92,.62].map((v,i)=><g key={i} opacity={q(V+10+i*8,V+35+i*8)}>{rule(0,mix(P?135:145,220,expand)+i*37,mix(P?690:630,w-170,expand)*v,ink+'28',9)}</g>)}
 </g><rect x={mix(x+25,x+w-20,preview)} y={y+80} width={4} height={h-105} fill={blue} opacity={Math.sin(Math.PI*preview)}/>
 </g>})()}
 {footer()}
 </>)}
 {/* The page contracts into browser-local storage; no cloud path is implied. */}
 {f>=L-52&&f<D&&wipe(L-52,L,blue,<>
 {label('Your browser. Your draft.','02')}
 {(()=>{const a=q(L-40,L),spin=q(L,L+92),out=q(D-60,D);return <g transform={`translate(${cx} ${cy}) scale(${mix(1.6,1,a)-out*.22})`}>
 {[0,1,2].map(i=><rect key={i} x={-310-i*38} y={-310-i*38} width={620+i*76} height={620+i*76} rx={150-i*30} fill="none" stroke={i===1?lime:paper} strokeWidth={i===1?3:2} opacity={.3+i*.16} transform={`rotate(${mix(i*80,i*20,spin)} 0 0)`}/>)}
 <rect x={-235} y={-285} width={470} height={570} rx={24} fill={paper}/><rect x={-235} y={-285} width={470} height={65} rx={24} fill={ink}/>{[0,1,2].map(i=><circle key={i} cx={-197+i*24} cy={-252} r={6} fill={i===0?lime:paper}/>)}
 <Text x={0} y={-72} size={152} fill={blue} anchor="middle">#</Text>{[.95,.72,.88].map((v,i)=><g key={i}>{rule(-155,12+i*38,310*v,blue+'40')}</g>)}
 <circle cx={155} cy={200} r={52} fill={lime}/><path d="M132 201 l16 16 32 -36" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={85} strokeDashoffset={85*(1-q(L+10,L+35))}/></g>})()}
 <Text x={cx} y={P?1450:970} size={P?70:66} fill={paper} anchor="middle">Local by default.</Text>
 </>)}
 {/* The same document is framed as the actual portable Markdown format. */}
 {f>=D-48&&f<C&&wipe(D-48,D,paper,<>
 {label('Take the source with you.','03',ink)}
 {(()=>{const a=q(D-45,D),exit=q(C-65,C),rot=mix(-24,0,a);return <g transform={`translate(${cx+exit*(P?0:220)} ${cy-exit*100}) rotate(${rot}) scale(${mix(.65,1,a)-exit*.18})`}>
 <path d="M-280 -310 H130 L280 -160 V310 H-280 Z" fill={blue}/><path d="M130 -310 V-160 H280" fill={lime}/><Text x={0} y={80} size={205} fill={paper} anchor="middle">.md</Text>
 <path d={`M0 ${-450+q(D+20,D+50)*80} V-335 m-26 -26 l26 26 26 -26`} fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" opacity={1-exit}/>
 {star(330,240,70,lime,mix(-60,30,q(D,D+90)))}
 </g>})()}
 <Text x={cx} y={P?1475:985} size={P?40:34} fill={ink} anchor="middle" weight={500}>Download your Markdown.</Text>
 </>)}
 {/* A named separate tool transforms the source into illustrative share cards. */}
 {f>=C-55&&f<1395&&wipe(C-55,C,ink,<>
 {label('One draft. More ways to share.','04')}
 <Text x={cx} y={P?355:245} size={P?32:26} fill={lime} anchor="middle" weight={500}>MARKDOWN TO CARD GENERATOR</Text>
 {(()=>{const a=q(C-50,C),fan=q(F-70,F),settle=q(1250,1290),out=q(1350,1410);return <g transform={`translate(${cx} ${cy+(P?50:60)}) rotate(${-out*12}) scale(${1-out*.22})`}>
 {[2,0,1].map(i=>{const k=i-1,cw=P?440:440,ch=P?700:550;return <g key={i} transform={`translate(${k*(P?175:520)*fan} ${Math.abs(k)*(P?80:35)*fan+(1-a)*(450-i*140)}) rotate(${k*mix(24,8,settle)*fan}) scale(${mix(.6,1,a)})`}>
 <rect x={-cw/2} y={-ch/2} width={cw} height={ch} rx={16} fill={[blue,lime,paper][i]}/><Text x={-cw/2+38} y={-ch/2+65} size={21} fill={ink} weight={500}>MARKPRESS / 0{i+1}</Text>
 {i===0?<><Text x={-cw/2+35} y={-80} size={P?83:77} fill={paper}>Make</Text><Text x={-cw/2+35} y={10} size={P?83:77} fill={paper}>ideas</Text><Text x={-cw/2+35} y={100} size={P?83:77} fill={paper}>move.</Text></>:i===1?<><Text x={-cw/2+35} y={-70} size={P?82:73} fill={ink}>Start</Text><Text x={-cw/2+35} y={20} size={P?82:73} fill={ink}>with a</Text><Text x={-cw/2+35} y={110} size={P?82:73} fill={ink}>thought.</Text></>:<><Text x={-cw/2+35} y={-40} size={P?81:75} fill={blue}>Keep</Text><Text x={-cw/2+35} y={50} size={P?81:75} fill={blue}>moving.</Text></>}
 {rule(-cw/2+35,ch/2-95,cw-70,i===0?paper:ink,5)}<Text x={-cw/2+35} y={ch/2-43} size={20} fill={i===0?paper:ink} weight={500}>From one Markdown draft</Text>
 </g>})}</g>})()}
 <Text x={cx} y={H-135} size={P?25:24} fill={paper} anchor="middle" weight={500}>Illustrative card styling · Export images with the free tool</Text>
 </>)}
 {/* Alternating spatial directions use the same line, frame and paper motifs. */}
 {f>=1360&&f<B&&wipe(1360,1395,blue,<>
 {['WRITE.','SHAPE.','SHARE.'].map((t,i)=>{const start=[1370,1447,1525][i],a=q(start,start+25),out=i===2?q(1625,1660):q(start+64,start+87);return <g key={t} transform={`translate(${cx+(i===1?-1:1)*W*(1-a-out)} ${cy+70}) rotate(${(1-a)*-12+out*12})`} opacity={a*(1-out)}>
 <Text x={0} y={0} size={P?230:365} fill={i===1?lime:paper} anchor="middle">{t}</Text>
 <rect x={P?-420:-780} y={70} width={(P?840:1560)*a} height={16} fill={lime}/>{star(P?0:720,P?-350:-415,P?105:65,paper,f*.9)}
 </g>})}<Text x={70} y={H-75} size={30} fill={paper} weight={500}>ONE SOURCE. KEEP THE POSSIBILITIES OPEN.</Text>
 </>)}
 {f>=B-45&&wipe(B-45,B,paper,<>
 {(()=>{const a=q(B-35,B),z=q(B,B+35);return <g transform={`translate(${cx} ${cy-(P?160:65)})`}>
 <g transform={`translate(0 ${P?-210:-190}) rotate(${mix(-90,0,a)}) scale(${a})`}>
 <rect x={-74} y={-74} width={148} height={148} rx={30} fill={blue}/><Text x={0} y={39} size={110} fill={paper} anchor="middle">#</Text></g>
 <Text x={0} y={P?35:95} size={P?155:205} fill={ink} anchor="middle">MarkPress</Text>
 <Text x={0} y={P?150:205} size={P?49:52} fill={ink} anchor="middle" weight={500}>Make ideas move.</Text>
 <g transform={`translate(0 ${P?350:340}) scale(${mix(.85,1,z)})`} opacity={z}><rect x={P?-380:-350} y={-58} width={P?760:700} height={116} rx={58} fill={blue}/><Text x={-25} y={15} size={P?45:44} fill={paper} anchor="middle" weight={600}>{c.url}</Text><path d="M250 0 h35 m-16 -16 l16 16 -16 16" stroke={paper} strokeWidth={5} fill="none"/></g>
 <Text x={0} y={P?475:435} size={P?28:25} fill={ink} anchor="middle" weight={500}>Open the editor. No account required.</Text>
 </g>})()}
 </>)}
 </g></svg></AbsoluteFill>;
};
