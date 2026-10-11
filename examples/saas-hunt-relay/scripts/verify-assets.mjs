import fs from 'node:fs';
import {stop} from 'esbuild';
import path from 'node:path';
import assert from 'node:assert/strict';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
import {validateConfig} from './config.mjs';
const root=process.cwd(),base=JSON.parse(fs.readFileSync('config.json')),file=path.join(root,'public','invalid font fixture.ttf');
if(fs.existsSync(file))throw new Error('Fixture exists');fs.writeFileSync(file,'invalid-font');
try{
 const c={...base,fontFile:path.basename(file)},serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();validateConfig(c,root);
 const common={serveUrl,inputProps:{config:c},browserExecutable:process.env.PROMOTION_BROWSER||process.env.VIDEO_CREATE_BROWSER||undefined},composition=await selectComposition({...common,id:'ProductFilm'});
 let failure=null;try{await renderStill({...common,composition,frame:90,output:path.join(root,'out/qa/invalid-font.png'),timeoutInMilliseconds:10000})}catch(e){failure=e.message}
 assert.ok(failure,'An invalid existing font must stop rendering');assert.match(failure,/font|decode|network|cancel/i);
 fs.mkdirSync(path.join(root,'out/qa'),{recursive:true});fs.writeFileSync(path.join(root,'out/qa/font-failure.json'),JSON.stringify({passed:true,existingLocalFont:true,rendererRejected:true,error:failure},null,2)+'\n');console.log('Actual renderer rejected the corrupt local font.');
}finally{stop();fs.unlinkSync(file)}

// All output and cleanup are awaited; release any remaining bundler worker handles.
process.exit(0);
