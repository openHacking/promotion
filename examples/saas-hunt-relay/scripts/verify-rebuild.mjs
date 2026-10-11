import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {stop} from 'esbuild';
import {bundle} from '@remotion/bundler';import {selectComposition,renderStill} from '@remotion/renderer';
const root=process.cwd(),serveUrl=await bundle({enableCaching:false,entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();const results=[];
for(const suffix of ['', 'portrait']){const out=path.join(root,'out',suffix),file=path.join(out,'render.json');if(!fs.existsSync(file))continue;const record=JSON.parse(fs.readFileSync(file)),common={serveUrl,inputProps:{config:record.config},browserExecutable:process.env.PROMOTION_BROWSER||undefined},composition=await selectComposition({...common,id:'ProductFilm'});
 for(const repeat of record.determinism){const output=path.join(out,'qa','rebuilt-'+repeat.frame+'.png');await renderStill({...common,composition,frame:repeat.frame,output,imageFormat:'png'});const hash=createHash('sha256').update(fs.readFileSync(output)).digest('hex'),equal=repeat.hashes[0]===hash;results.push({format:suffix||'landscape',frame:repeat.frame,equal});}
}
fs.writeFileSync(path.join(root,'out/qa/rebuild.json'),JSON.stringify(results,null,2)+'\n');stop();console.log(JSON.stringify(results));if(results.some(v=>!v.equal))throw new Error('Editable source differs from the recorded render frames');process.exit(0);
