export function validateMG(spec,asset){
 if(!spec||!['orbit','elastic','split'].includes(spec.recipe))throw new Error('Unknown MG recipe');
 if(typeof spec.headline!=='string'||!spec.headline.trim()||Array.from(spec.headline).length>60)throw new Error('MG headline must contain 1–60 characters');
 if(spec.label!==undefined&&(typeof spec.label!=='string'||spec.label.length>90))throw new Error('Invalid MG label');
 if(spec.file!==undefined)asset(spec.file);
 if(spec.recipe==='split'&&!spec.file)throw new Error('Split reveal needs a local image');
 if(spec.items!==undefined&&(!Array.isArray(spec.items)||spec.items.length<1||spec.items.length>6||spec.items.some(v=>typeof v!=='string'||!v.trim()||Array.from(v).length>24)))throw new Error('MG items must contain 1–6 short labels');
 if(spec.recipe==='orbit'&&(!spec.items||spec.items.length<3))throw new Error('Orbit needs 3–6 items');
 if(spec.selected!==undefined&&(!Number.isInteger(spec.selected)||spec.selected<0||spec.selected>=(spec.items?.length??0)))throw new Error('Invalid MG selection');
}
