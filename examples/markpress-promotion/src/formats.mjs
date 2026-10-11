export const FORMATS={landscape:{width:1920,height:1080},portrait:{width:1080,height:1920}};
export function resolveFormat(config,name){if(!name)return config;if(!FORMATS[name])throw new Error('Format must be landscape or portrait');if(config.template&&config.template!=='discovery'&&(config.width!==FORMATS[name].width||config.height!==FORMATS[name].height))throw new Error('Canvas-only format overrides are disabled; use discovery or an independently authored scene config');return {...config,...FORMATS[name],format:name};}
export function discoveryLayout(width,height,safe={}){
 const portrait=height>width,pad=width*.065;
 const inset={top:safe.top??height*.055,right:safe.right??width*.065,bottom:safe.bottom??height*.075,left:safe.left??pad};
 const available=width-inset.left-inset.right,contentHeight=height-inset.top-inset.bottom;
 const mapY=ratio=>inset.top+(height*ratio-height*.055)*contentHeight/(height*.87);
 const panel={x:inset.left,y:mapY(portrait?.31:.29),width:available,height:(portrait?height*.43:height*.57)*contentHeight/(height*.87)};
 const titleSize=Math.min((portrait?width*.095:width*.058)*available/(width*.87),120);
 return {portrait,inset,panel,contentHeight,titleY:mapY(portrait?.165:.145),introY:mapY(portrait?.15:.17),finalY:mapY(portrait?.18:.24),carouselY:mapY(portrait?.66:.765),cardY:mapY(portrait?.53:.63),titleSize,cardWidth:portrait?available*.7:available*.3};
}
