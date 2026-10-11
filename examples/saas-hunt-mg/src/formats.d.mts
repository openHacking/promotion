export const FORMATS:Record<string,{width:number;height:number}>;
export function resolveFormat<T>(config:T,name?:string):T;
export function discoveryLayout(width:number,height:number,safe?:Partial<{top:number;right:number;bottom:number;left:number}>):{portrait:boolean;inset:{top:number;right:number;bottom:number;left:number};panel:{x:number;y:number;width:number;height:number};titleY:number;introY:number;finalY:number;carouselY:number;cardY:number;contentHeight:number;titleSize:number;cardWidth:number};
