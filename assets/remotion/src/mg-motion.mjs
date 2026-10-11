// Stateless frame-time primitives shared by films and recipe studies.
export const clamp=v=>Math.max(0,Math.min(1,v));
export const mix=(a,b,t)=>a+(b-a)*t;
export function progress(frame,start,end){if(end<=start)throw new Error("Motion interval must increase");return clamp((frame-start)/(end-start));}
export const smooth=(f,a,b)=>{const p=progress(f,a,b);return p*p*(3-2*p)};
export const punch=(f,a,b)=>{const p=progress(f,a,b);return p===1?1:1-Math.pow(1-p,3)};
export function elastic(f,a,b,amount=.12){const p=progress(f,a,b);return p===0?0:p===1?1:1-Math.pow(1-p,3)+Math.sin(p*Math.PI*2)*amount*(1-p);}
export function pathPoint(points,p){const q=clamp(p),u=1-q;return {x:u*u*points[0].x+2*u*q*points[1].x+q*q*points[2].x,y:u*u*points[0].y+2*u*q*points[1].y+q*q*points[2].y};}
export function recipePose(recipe,frame,fps,index,count,selected=0,options={}){
 const t=frame/fps,entryStart=(options.entryStartFrame??fps*.1)/fps,entryDuration=(options.entryDurationFrames??fps*.7)/fps,stagger=(options.staggerFrames??fps*.08)/fps,actionStart=(options.actionStartFrame??fps*2)/fps,actionEnd=actionStart+(options.actionDurationFrames??fps*.7)/fps;
 const p=punch(t,entryStart+index*stagger,entryStart+entryDuration+index*stagger),q=smooth(t,actionStart,actionEnd),r=smooth(t,actionEnd+.4,actionEnd+1.1),x=(index-(count-1)/2)*(options.spacing??300);
 const pose={x,y:0,scale:1,rotate:0,opacity:p,reveal:p};
 if(recipe==='path')Object.assign(pose,pathPoint((options.pathPoints??[{x:-300,y:400},{x:200,y:-220},{x:0,y:0}]).map(point=>({x:x+point.x,y:point.y})),p));
 if(recipe==='aggregate')Object.assign(pose,{x:mix(x,(index%2-.5)*(options.groupSpacingX??380),q),y:mix(Math.sin(index*2)*180,(Math.floor(index/2)-(Math.ceil(count/2)-1)/2)*(options.groupSpacingY??220),q),rotate:mix((index-2)*9,0,q)});
 if(recipe==='filter')Object.assign(pose,{x:mix(x,0,q),y:mix(0,(index-selected)*170,q),opacity:index===selected?p:p*(1-q)});
 if(recipe==='expand')Object.assign(pose,{x:mix(x,0,q),scale:index===selected?1+q*(options.expandScale??.7):1-q*.25,opacity:index===selected?p:p*(1-q)});
 const orbitTime=options.focusFrame===undefined?t:Math.min(t,options.focusFrame/fps);
 if(recipe==='spatial')Object.assign(pose,{x:Math.sin(index*2*Math.PI/count+orbitTime*(options.angularSpeed??.6))*(options.radius??580),y:Math.cos(index*2*Math.PI/count+orbitTime*(options.angularSpeed??.6))*(options.depth??100),scale:.8+.2*(Math.cos(index*2*Math.PI/count+orbitTime*(options.angularSpeed??.6))+1)/2,rotate:Math.sin(index*2*Math.PI/count+orbitTime*(options.angularSpeed??.6))*12});
 if(recipe==='morph')Object.assign(pose,{rotate:q*(options.rotation??90),scale:1+.3*Math.sin(q*Math.PI),x:mix(x,0,r),opacity:p*(1-r*.65)});
 if(recipe==='type')Object.assign(pose,{y:(1-elastic(t,entryStart+index*stagger,entryStart+entryDuration+index*stagger))*200,rotate:(1-p)*-12});
 if(recipe==='flow')Object.assign(pose,{x,scale:.9+.1*p});
 return pose;
}
