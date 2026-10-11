export function validateArchitecture(c,asset){
 const a=c.architecture;
 if(!a||!Array.isArray(a.products)||a.products.length<3||a.products.length>6)throw new Error('Architecture needs 3–6 products');
 if(!Array.isArray(a.categories)||a.categories.length!==3||new Set(a.categories).size!==3||a.categories.some(v=>typeof v!=='string'||!v.trim()||Array.from(v).length>20))throw new Error('Architecture needs three short categories');
 if(!Number.isInteger(a.selected)||a.selected<0||a.selected>=a.products.length||!a.categories.includes(a.category)||a.products[a.selected].category!==a.category)throw new Error('Selected product must belong to the focused category');
 if(c.duration!==30)throw new Error('Architecture film is authored for 30 seconds');
 const ids=new Set();
 for(const p of a.products){
  if(!p||ids.has(p.name))throw new Error('Product names must be unique');ids.add(p.name);
  for(const [key,max] of [['name',22],['maker',24],['description',120]])if(typeof p[key]!=='string'||!p[key].trim()||Array.from(p[key]).length>max)throw new Error('Invalid product '+key);
  if(!a.categories.includes(p.category)||typeof p.source!=='string'||!/^https:\/\//.test(p.source))throw new Error('Product category and evidence URL required');
  if(!Array.isArray(p.tags)||p.tags.length>4||p.tags.some(v=>typeof v!=='string'||!v.trim()||Array.from(v).length>24))throw new Error('Invalid product tags');
 }
 if(a.detailCrop)asset(a.detailCrop);
 if(a.choreography!==undefined&&a.choreography!=='relay')throw new Error('Unknown architecture choreography');
 if(a.direction!==undefined&&!['ribbon','atlas','aperture'].includes(a.direction))throw new Error('Unknown relay direction');
 if(a.secondary!==undefined&&!/^#[0-9a-f]{6}$/i.test(a.secondary))throw new Error('Invalid secondary color');
 const windows=a.choreography==='relay'?{enter:[3,4.5],group:[5,6.5],filter:[7,8.3],detail:[9,10.5],maker:[16,18],more:[19,21],peak:[24,25.5],cta:[27,28]}:{group:[5,7],filter:[8,10],detail:[13,15],maker:[19,21]};
 for(const [id,[min,max]] of Object.entries(windows)){const e=c.timeline?.events.find(e=>e.id===id);if(!e||e.frame/c.fps<min||e.frame/c.fps>max)throw new Error('Architecture event missing or outside authored window: '+id);}
}
