// Keyframes use shot-local frames. Missing channels inherit the previous pose.
export function sampleKeys(keys,frame,defaults){
 if(!keys?.length)return {...defaults};
 let previous={...defaults,...keys[0]};
 if(frame<=keys[0].frame)return previous;
 for(let i=1;i<keys.length;i++){
  const next={...previous,...keys[i]};
  if(frame<=next.frame){
   let t=Math.max(0,Math.min(1,(frame-previous.frame)/(next.frame-previous.frame)));
   if(keys[i].easing!=='linear')t=t*t*(3-2*t);
   const result={};for(const channel of Object.keys(defaults))result[channel]=previous[channel]+(next[channel]-previous[channel])*t;
   return result;
  }
  previous=next;
 }
 return previous;
}
