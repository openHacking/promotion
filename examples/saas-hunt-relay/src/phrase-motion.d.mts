export function unit(x:number):number;
export function progress(frame:number,start:number,end:number):number;
export function lerp(a:number,b:number,p:number):number;
export function colorMix(a:string,b:string,p:number):string;
export function relayTimes(fps:number,events?:{id:string;frame:number}[]):Record<'enter'|'group'|'filter'|'detail'|'maker'|'more'|'peak'|'cta',number>;
export function palette(c:{background:string;foreground:string;surface:string;accent:string;architecture?:{secondary?:string}}):{canvas:string;ink:string;surface:string;accent:string;secondary:string};
