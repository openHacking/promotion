import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {prepare} from './prepare.mjs';
const c=await prepare(),start=performance.now();fs.mkdirSync('out',{recursive:true});
const r=spawnSync(process.execPath,['node_modules/hyperframes/bin/hyperframes.mjs','render','--output','out/video.mp4','--fps',String(c.fps),'--quality','delivery','--workers','2','--no-browser-gpu'],{stdio:'inherit',env:{...process.env,...(process.env.PROMOTION_BROWSER?{HYPERFRAMES_BROWSER_PATH:process.env.PROMOTION_BROWSER}:{})}});
if(r.status!==0)throw new Error('Hyperframes render failed');
fs.writeFileSync('out/render.json',JSON.stringify({engine:'hyperframes',seconds:(performance.now()-start)/1000,fps:c.fps,duration:c.duration,listening:'not-performed'},null,2));
