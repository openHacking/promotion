export function transitionStyle(type,progress,direction='right'){
 const p=Math.max(0,Math.min(1,progress));
 if(type==='cut')return {opacity:1};
 if(type==='dissolve')return {opacity:p};
 if(type==='wipe'){const hidden=(1-p)*100;return {clipPath:direction==='left'?`inset(0 0 0 ${hidden}%)`:direction==='up'?`inset(${hidden}% 0 0 0)`:direction==='down'?`inset(0 0 ${hidden}% 0)`:`inset(0 ${hidden}% 0 0)`};}
 const sign=['left','up'].includes(direction)?-1:1;
 return {transform:['up','down'].includes(direction)?`translateY(${sign*(1-p)*100}%)`:`translateX(${sign*(1-p)*100}%)`};
}
