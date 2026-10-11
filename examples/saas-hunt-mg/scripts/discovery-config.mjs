export const DISCOVERY_EVENTS=['home','catalog','browse','filter','select','detail','expand','cta'];
export function validateDiscovery(c,asset){
 const d=c.discovery;if(!d||typeof d!=='object')throw new Error('Discovery template needs discovery material');
 for(const key of ['home','catalog','category','detail','selected']){const p=d[key];if(!p)throw new Error('Missing discovery '+key);asset(p.file);if(!Number.isFinite(p.imageWidth)||p.imageWidth<=0)throw new Error('Invalid discovery source width');const v=p.crop;if(!v||!['x','y','width','height'].every(k=>Number.isFinite(v[k]))||v.x<0||v.y<0||v.width<=0||v.height<=0||v.x+v.width>p.imageWidth)throw new Error('Invalid discovery crop');}
 for(const key of ['categoryName','selectedName','closing'])if(typeof d[key]!=='string'||!d[key].trim()||Array.from(d[key]).length>60)throw new Error('Invalid discovery '+key);
 if(!Number.isFinite(d.categoryFocusY)||d.categoryFocusY<d.category.crop.y)throw new Error('Invalid category focus');
 if(!Array.isArray(d.headlines)||d.headlines.length!==5||d.headlines.some(v=>typeof v!=='string'||!v.trim()||Array.from(v).length>60))throw new Error('Five short discovery headlines required');
 if(!Array.isArray(d.cards)||d.cards.length<3||d.cards.length>6||d.cards.some(v=>!v||typeof v.name!=='string'||!v.name.trim()||Array.from(v.name).length>40||typeof v.category!=='string'||!v.category.trim()||Array.from(v.category).length>30))throw new Error('Invalid discovery cards');
 if(d.categories&&(!Array.isArray(d.categories)||d.categories.length>8||new Set(d.categories).size!==d.categories.length||d.categories.some(v=>typeof v!=='string'||!v.trim()||v.length>24)))throw new Error('Invalid discovery category labels');
 if(d.safeInsets){for(const [key,value] of Object.entries(d.safeInsets))if(!['top','right','bottom','left'].includes(key)||!Number.isFinite(value)||value<0||value>(['top','bottom'].includes(key)?c.height:c.width)*.25)throw new Error('Invalid safe inset');}
 if((d.safeInsets?.top??0)+(d.safeInsets?.bottom??0)>c.height*.4||(d.safeInsets?.left??0)+(d.safeInsets?.right??0)>c.width*.4)throw new Error('Safe insets leave insufficient canvas');
 let previous=-1;for(const id of DISCOVERY_EVENTS){const e=c.timeline?.events.find(v=>v.id===id);if(!e||e.frame<=previous||e.frame>=c.duration*c.fps-c.fps||e.frame<.8*c.fps)throw new Error('Discovery events must exist in chronological order with reading room');if(previous>=0&&e.frame-previous<c.fps*.65)throw new Error('Discovery events need room for continuous handoffs');previous=e.frame;}
}
