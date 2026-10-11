export type Product={brand:string;url:string;accent:string;background:string;foreground:string;surface:string;fontFile:string;width:number;height:number;duration:number;fps:number;sceneDurations:number[];audio:{credit?:string;mode:string};timeline?:{events:{id:string;frame:number;kind:string}[]}};
export type SceneProduct=Product;
