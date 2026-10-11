import fs from 'node:fs';
import path from 'node:path';
import {buildAudio} from './audio.mjs';
export async function prepare(root=process.cwd()){
 const c=JSON.parse(fs.readFileSync(path.join(root,'config.json')));
 validate(c);
 if(c.audio){const file=path.resolve(root,'public',c.audio.source),publicRoot=fs.realpathSync(path.join(root,'public'));if(!fs.realpathSync(file).startsWith(publicRoot+path.sep))throw new Error('Audio must be local');}
 fs.mkdirSync(path.join(root,'out'),{recursive:true});if(c.audio){const score=await buildAudio(root,{...c,motionEvents:c.timeline?.events??[]},path.join(root,'out'));fs.copyFileSync(score,path.join(root,'public/soundtrack.wav'));}
 const html=fs.readFileSync(path.join(root,'composition.template'),'utf8');const marker='<!-- LOCAL_AUDIO -->';const audio=c.audio?`<audio id="soundtrack" data-start="0" data-duration="${c.duration}" data-track-index="3" src="public/soundtrack.wav"></audio>`:'';fs.writeFileSync(path.join(root,'index.html'),html.replaceAll('data-duration="6"',`data-duration="${c.duration}"`).replace(marker,audio));
 fs.copyFileSync(path.join(root,'node_modules/gsap/dist/gsap.min.js'),path.join(root,'public/gsap.min.js'));
 return c;
}
export function validate(c){
 if(!Number.isInteger(c.fps)||c.fps!==60||!Number.isFinite(c.duration)||c.duration<6||c.duration>300||!Number.isInteger(c.duration*c.fps))throw new Error('Hyperframes starter requires 60fps and 6–300 seconds');
 if(typeof c.brand!=='string'||!c.brand.trim()||!Array.isArray(c.items)||c.items.length!==4||c.items.some(v=>typeof v!=='string'||!v.trim()||Array.from(v).length>22)||!/^#[a-f\d]{6}$/i.test(c.accent))throw new Error('Invalid brand, four short labels, or accent');
 if(c.width!==1920||c.height!==1080)throw new Error('This starter is authored for landscape');
 if(c.audio&&(c.audio.mode!=='file'||typeof c.audio.source!=='string'||!c.audio.source||path.isAbsolute(c.audio.source)||c.audio.source.split(/[\\/]/).includes('..')||/^https?:/.test(c.audio.source)||(c.audio.sourceOffsetSeconds??0)<0))throw new Error('Recorded audio requires a local source and nonnegative offset');
 const ids=['type','aggregate','filter','expand','details'];let previous=0;
 for(const id of ids){const events=c.timeline?.events.filter(e=>e.id===id);if(events?.length!==1)throw new Error('Missing or duplicated landing '+id);const event=events[0];if(!Number.isInteger(event.frame)||event.frame<=previous||event.frame>=c.duration*c.fps)throw new Error('Landing events must increase within duration');previous=event.frame;}
 return c;
}
