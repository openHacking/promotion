import {validateArchitecture} from './architecture-config.mjs';
import {validateDiscovery} from './discovery-config.mjs';
import {FORMATS} from '../src/formats.mjs';
import {validateMG} from './mg-config.mjs';
import {validateScene} from './scene-config.mjs';
import fs from 'node:fs';
import path from 'node:path';
export function validateConfig(c,root){
 const scenesOnly=c.template==='story'&&Array.isArray(c.story)&&c.story.length>0&&c.story.every(s=>s?.kind==='scene');
 for(const field of (scenesOnly?['brand','url','evidenceLabel']:['brand','title','task','result','tagline','category','description','url','evidenceLabel']))if(typeof c[field]!=='string'||!c[field].trim())throw new Error(`config.${field} must be nonempty text`);
 if(!['minimal','window','command','workflow','story','discovery','architecture'].includes(c.template))throw new Error('Unknown template');
 if(![30,60].includes(c.fps)||!Object.values(FORMATS).some(v=>v.width===c.width&&v.height===c.height))throw new Error('Supported formats: 1920×1080, 1080×1920 at 30/60fps');
 if(c.format!==undefined&&(!FORMATS[c.format]||FORMATS[c.format].width!==c.width||FORMATS[c.format].height!==c.height))throw new Error('Format preset does not match dimensions');
 if((c.width!==1920||c.height!==1080)&&!['discovery','architecture'].includes(c.template)&&!scenesOnly)throw new Error('Legacy templates and MG recipes require landscape; use discovery or natively authored scene layouts for other formats');
 if(!Number.isFinite(c.duration)||c.duration<8||c.duration>300||Math.abs(c.duration*c.fps-Math.round(c.duration*c.fps))>1e-6)throw new Error('Duration must be 8–300 seconds and frame aligned');
 if(!Array.isArray(c.sceneDurations)||(['story','discovery','architecture'].includes(c.template)?c.sceneDurations.length<2:c.sceneDurations.length!==5)||c.sceneDurations.some(d=>!Number.isFinite(d)||d*c.fps<1||Math.abs(d*c.fps-Math.round(d*c.fps))>1e-6)||Math.abs(c.sceneDurations.reduce((a,b)=>a+b,0)-c.duration)>1e-6)throw new Error('Positive, frame-aligned scene durations must sum to duration');
 if(!(scenesOnly&&c.features===undefined)&&(!Array.isArray(c.features)||c.features.length!==3||c.features.some(s=>typeof s!=='string'||!s.trim())))throw new Error('Three feature texts required');
 if(!Array.isArray(c.screenshots)&&!(scenesOnly&&c.screenshots===undefined))throw new Error('screenshots must be an array');
 for(const key of ['accent','background','foreground','surface'])if(!/^#[\da-f]{6}$/i.test(c[key]))throw new Error(key+' must be #RRGGBB');
 const asset=(rel)=>{if(typeof rel!=='string'||!rel||path.isAbsolute(rel)||rel.split(/[\\/]/).includes('..')||/^[a-z]+:/i.test(rel))throw new Error('Assets must be local public-relative paths');const base=fs.realpathSync(path.join(root,'public')),file=fs.realpathSync(path.join(base,rel));if(!file.startsWith(base+path.sep)||!fs.statSync(file).isFile())throw new Error('Asset escapes public directory');return file};
 if(c.workspaceName!==undefined&&(typeof c.workspaceName!=='string'||!c.workspaceName.trim()||c.workspaceName.length>40))throw new Error('Invalid workspaceName');if(c.motionStyle!==undefined&&!['standard','dynamic'].includes(c.motionStyle))throw new Error('Invalid motionStyle');if(c.shader!==undefined&&typeof c.shader!=='boolean')throw new Error('shader must be boolean');
 if(c.shaderAsset!==undefined){if(c.shaderAsset!=='shader-background.mp4')throw new Error('shaderAsset is generated locally');if(fs.existsSync(path.join(root,'public',c.shaderAsset)))asset(c.shaderAsset)}
 if(c.backgroundImage!==undefined&&c.backgroundImage!==null)asset(c.backgroundImage);if(c.backgroundMotion!==undefined&&!['still','drift'].includes(c.backgroundMotion))throw new Error('backgroundMotion must be still or drift');
 if(c.uiShell){asset(c.uiShell.file);const v=c.uiShell.contentRect;if(!v||!['x','y','width','height'].every(k=>Number.isFinite(v[k]))||v.x<0||v.y<0||v.width<=0||v.height<=0||v.x+v.width>1920||v.y+v.height>1080)throw new Error('Invalid uiShell contentRect');}
 if(c.template==='story'){if(!Array.isArray(c.story)||c.story.length!==c.sceneDurations.length)throw new Error('Story shots must match scene durations');const ids=new Set();for(const [index,shot] of c.story.entries()){if(typeof shot.id!=='string'||!shot.id||ids.has(shot.id))throw new Error('Story IDs must be unique');ids.add(shot.id);if(!['brand','page','cards','detail','outro','scene','mg'].includes(shot.kind)||(shot.title!==undefined&&typeof shot.title!=='string'))throw new Error('Invalid story shot');if(shot.transition){const t=shot.transition;if(!['wipe','dissolve','slide','cut'].includes(t.type)||(t.direction!==undefined&&!['left','right','up','down'].includes(t.direction))||(t.frames!==undefined&&(!Number.isInteger(t.frames)||t.frames<1||t.frames>=c.sceneDurations[index]*c.fps)))throw new Error('Invalid story transition');}if(shot.transitionFrames!==undefined&&(!Number.isInteger(shot.transitionFrames)||shot.transitionFrames<0||shot.transitionFrames>=c.sceneDurations[index]*c.fps))throw new Error('Invalid transition frames');if(shot.kind==='mg'){validateMG(shot.mg,asset);continue;}if(shot.kind==='scene'){validateScene(shot.scene,Math.round(c.sceneDurations[index]*c.fps),asset);continue;}if(shot.cards&&(!Array.isArray(shot.cards)||shot.cards.length>4||shot.cards.some(card=>!card.crop||!['x','y','width','height'].every(k=>Number.isFinite(card.crop[k]))||card.crop.width<=0||card.crop.height<=0||card.crop.x<0||card.crop.y<0)))throw new Error('Invalid montage cards');if(shot.imageWidth!==undefined&&(!Number.isFinite(shot.imageWidth)||shot.imageWidth<=0))throw new Error('Invalid source image width');if(shot.carrierFile)asset(shot.carrierFile);if(shot.file)asset(shot.file);else if(!['brand','outro'].includes(shot.kind))throw new Error('Page shots need a local image');for(const key of ['crop','fromCrop','focus','carrierCrop'])if(shot[key]){const q=shot[key];if(!['x','y','width','height'].every(k=>Number.isFinite(q[k]))||q.x<0||q.y<0||q.width<=0||q.height<=0)throw new Error('Invalid shot rectangle');}}}
 if(c.template==='discovery')validateDiscovery(c,asset);
 if(c.template==='architecture')validateArchitecture(c,asset);
 if(c.rhythm&&(!['brisk','measured'].includes(c.rhythm.profile)||(c.rhythm.requireOnsetAlignment!==undefined&&typeof c.rhythm.requireOnsetAlignment!=='boolean')||(c.rhythm.analysisSourceSha256!==undefined&&!/^[a-f0-9]{64}$/.test(c.rhythm.analysisSourceSha256))))throw new Error('Invalid rhythm profile or source hash');
 if(c.timeline){if(!Array.isArray(c.timeline.events))throw new Error('Timeline events required');const ids=new Set();for(const e of c.timeline.events){if(!e.id||ids.has(e.id)||!Number.isInteger(e.frame)||e.frame<0||e.frame>=c.duration*c.fps||!['transition','select','resolve','brand'].includes(e.kind))throw new Error('Invalid timeline event');ids.add(e.id);}for(const key of ['beatFrames','phraseFrames'])if(c.timeline[key]&&(!Array.isArray(c.timeline[key])||c.timeline[key].some(f=>!Number.isInteger(f)||f<0||f>=c.duration*c.fps)))throw new Error('Invalid musical frame');if(c.story?.some(s=>(s.eventId&&!ids.has(s.eventId))||s.cards?.some(card=>card.eventId&&!ids.has(card.eventId))))throw new Error('Unknown shot eventId');}
 asset(c.fontFile);if(c.logo)asset(c.logo);for(const s of c.screenshots??[]){asset(s.file);if(typeof s.label!=='string')throw new Error('Screenshot label required')}
 if(!c.audio||!['none','procedural','file'].includes(c.audio.mode))throw new Error('Invalid audio mode');if(c.audio.mode==='file'){asset(c.audio.source)}
 for(const [key,min,max] of [['bpm',30,240],['musicVolume',0,2],['sfxVolume',0,2]])if(c.audio[key]!==undefined&&(!Number.isFinite(c.audio[key])||c.audio[key]<min||c.audio[key]>max))throw new Error('Invalid audio '+key);
 for(const event of c.timeline?.events??[]){
  if(event.sound===undefined||event.sound===false)continue;
  const sound=event.sound;
  if(!sound||typeof sound!=='object'||Array.isArray(sound))throw new Error('Invalid event sound');
  if(sound.material!==undefined&&!['air','click','impact'].includes(sound.material))throw new Error('Invalid sound material');
  if(sound.source!==undefined)asset(sound.source);
  for(const [key,min,max] of [['gain',0,2],['pan',-1,1],['leadSeconds',0,2],['durationSeconds',.02,10],['sourceOffsetSeconds',0,36000]])if(sound[key]!==undefined&&(!Number.isFinite(sound[key])||sound[key]<min||sound[key]>max))throw new Error('Invalid sound '+key);
 }
 if(c.audio.sourceOffsetSeconds!==undefined&&(!Number.isFinite(c.audio.sourceOffsetSeconds)||c.audio.sourceOffsetSeconds<0))throw new Error('Invalid source offset');if(c.audio.duckAmount!==undefined&&(!Number.isFinite(c.audio.duckAmount)||c.audio.duckAmount<0||c.audio.duckAmount>.8))throw new Error('Invalid duck amount');
 for(const [key,max] of [['brand',36],['title',60],['task',100],['result',60],['description',140]])if((!scenesOnly||c[key]!==undefined)&&Array.from(c[key]).length>max)throw new Error(`${key} is too long (${max} characters maximum); rewrite or redesign`);
 if((c.features??[]).some(v=>Array.from(v).length>36))throw new Error('Feature too long; rewrite or redesign');
 return c;
}
export function motionEvents(c){
 if(c.timeline)return c.timeline.events.map(e=>({...e})).sort((a,b)=>a.frame-b.frame);
 const starts=[];let sum=0;for(const d of c.sceneDurations){starts.push(Math.round(sum*c.fps));sum+=d}
 const events=starts.slice(1).map((frame,i)=>({frame,kind:'scene-change',...(i===starts.length-2?{sound:{material:'impact',gain:.8}}:{})}));
 if(c.template==='window'&&!c.screenshots.length){events.push({frame:starts[2]+Math.round(c.fps*.95),kind:'action-confirm'});events.push({frame:starts[3],kind:'action-confirm'})}
 if(c.template==='command')events.push({frame:starts[2],kind:'action-confirm'});

 return events.filter(e=>e.frame<Math.round(c.duration*c.fps)).sort((a,b)=>a.frame-b.frame);
}
