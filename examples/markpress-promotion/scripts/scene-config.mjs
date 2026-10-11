// Scene validation shares the existing public-directory asset boundary.
export function validateScene(scene,frames,asset){
 const fail=message=>{throw new Error('Invalid scene: '+message)};
 const number=(v,label,min=-100000,max=100000)=>{if(!Number.isFinite(v)||v<min||v>max)fail(label)};
 const color=v=>{if(!/^#[\da-f]{6}$/i.test(v))fail('color must be #RRGGBB')};
 const keys=(values,label)=>{if(values===undefined)return;if(!Array.isArray(values)||!values.length)fail(label+' keyframes');let previous=-1;
  for(const key of values){if(!key||typeof key!=='object'||Array.isArray(key))fail(label+' key');if(!Number.isInteger(key.frame)||key.frame<=previous||key.frame>=frames)fail(label+' frames must be ordered and inside the shot');previous=key.frame;
   for(const channel of ['x','y','z','rotate','rotateX','rotateY'])if(key[channel]!==undefined)number(key[channel],channel);
   if(key.scale!==undefined)number(key.scale,'scale',.001,100);
   for(const channel of ['opacity','reveal'])if(key[channel]!==undefined)number(key[channel],channel,0,1);
   if(key.easing!==undefined&&!['linear','smooth'].includes(key.easing))fail('easing');
  }
 };
 if(!scene||typeof scene!=='object'||!Array.isArray(scene.layers)||scene.layers.length<1||scene.layers.length>100)fail('one to 100 layers required');
 if(scene.background!==undefined)color(scene.background);
 if(scene.perspective!==undefined)number(scene.perspective,'perspective',500,10000);
 keys(scene.camera,'camera');
 if(scene.light){const l=scene.light;number(l.x,'light x');number(l.y,'light y');number(l.size,'light size',1,10000);number(l.opacity,'light opacity',0,1);color(l.color)}
 const ids=new Set();
 for(const l of scene.layers){
  if(!l||typeof l.id!=='string'||!l.id||ids.has(l.id))fail('unique layer IDs required');ids.add(l.id);
  if(!['image','video','text','shape'].includes(l.kind))fail('layer kind');
  number(l.x,'x');number(l.y,'y');number(l.width,'width',1,10000);number(l.height,'height',1,10000);
  if(l.depth!==undefined)number(l.depth,'depth',-2000,400);
  if(l.radius!==undefined)number(l.radius,'radius',0,5000);
  if(l.fontSize!==undefined)number(l.fontSize,'font size',1,500);
  if(l.shadow!==undefined&&typeof l.shadow!=='boolean')fail('shadow');
  if(l.color!==undefined)color(l.color);
  if(l.kind==='shape'&&!l.color)fail('shape color');
  if(l.kind==='text'&&(typeof l.text!=='string'||!l.text.trim()))fail('text');
  if(l.kind==='image'||l.kind==='video')asset(l.file);
  if(l.mask!==undefined&&!['left','circle'].includes(l.mask))fail('mask');
  const start=l.startFrame??0,end=l.endFrame??frames;
  if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>frames||start>=end)fail('layer lifetime');
  if(l.videoStartFrame!==undefined&&(!Number.isInteger(l.videoStartFrame)||l.videoStartFrame<0))fail('video start frame');
  if(l.imageWidth!==undefined)number(l.imageWidth,'source image width',1,100000);
  if(l.crop){if(l.kind!=='image')fail('crop needs image');for(const channel of ['x','y'])number(l.crop[channel],'crop '+channel,0);for(const channel of ['width','height'])number(l.crop[channel],'crop '+channel,1)}
  keys(l.keys,'layer');
 }
}
