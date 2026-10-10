import fs from 'node:fs';import path from 'node:path';import {stop} from 'esbuild';
import {bundle} from '@remotion/bundler';import {selectComposition,renderStill} from '@remotion/renderer';
import {validateConfig} from './config.mjs';import {resolveFormat} from '../src/formats.mjs';
const root=process.cwd(),base=JSON.parse(fs.readFileSync('config.json')),out=path.join(root,'out/qa/formats');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();
const results=[];for(const name of ['landscape','portrait']){const c=validateConfig(resolveFormat(base,name),root),inputProps={config:c},common={serveUrl,inputProps,browserExecutable:process.env.PROMOTION_BROWSER||undefined},composition=await selectComposition({...common,id:'ProductFilm'});
 if(composition.width!==c.width||composition.height!==c.height)throw new Error('Format metadata mismatch');
 for(const frame of [80,c.timeline.events.find(v=>v.id==='browse').frame,c.timeline.events.find(v=>v.id==='detail').frame,c.timeline.events.find(v=>v.id==='cta').frame]){await renderStill({...common,composition,frame,output:path.join(out,`${name}-${frame}.png`),imageFormat:'png'});results.push({format:name,frame,width:c.width,height:c.height});}
}
fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(results,null,2)+'\n');stop();console.log('Two native aspect layouts rendered with shared timing');process.exit(0);
