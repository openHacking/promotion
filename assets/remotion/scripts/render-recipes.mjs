import fs from 'node:fs';
import path from 'node:path';
import {stop} from 'esbuild';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import {run} from './lib.mjs';
const out=path.resolve('out/recipes');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/recipe-index.tsx'),publicDir:path.resolve('public')}),common={serveUrl,browserExecutable:process.env.PROMOTION_BROWSER},composition=await selectComposition({...common,id:'RecipeStudies'}),start=performance.now();
const only=process.argv[2];
if(!only)await renderMedia({...common,composition,codec:'h264',crf:20,outputLocation:path.join(out,'studies.mp4'),concurrency:2});
const recipes=['type','path','morph','aggregate','filter','expand','flow','spatial'];
for(let i=0;i<16;i++){if(only&&recipes[i%8]!==only)continue;const name=recipes[i%8]+(i>=8?'-replacement':'');if(only)await renderMedia({...common,composition,codec:'h264',crf:20,outputLocation:path.join(out,name+'.mp4'),frameRange:[i*360,i*360+359],concurrency:2});else await run('ffmpeg',['-y','-v','error','-ss',String(i*6),'-i',path.join(out,'studies.mp4'),'-t','6','-an','-c:v','libx264','-crf','18',path.join(out,name+'.mp4')]);await run('ffmpeg',['-y','-v','error','-i',path.join(out,name+'.mp4'),'-vf','fps=2,scale=320:180,tile=4x3','-frames:v','1',path.join(out,name+'.jpg')])}
fs.writeFileSync(path.join(out,'render.json'),JSON.stringify({frames:only?720:5760,studies:only?2:16,selectedRecipes:only?[only]:recipes,durationPerStudy:6,seconds:(performance.now()-start)/1000,audio:'Silent internal recipe validation; not a final score'},null,2));stop();process.exit(0);
