import fs from 'node:fs';
import {stop} from 'esbuild';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
import {validateConfig} from './config.mjs';
import {run,writeJSON} from './lib.mjs';
// Real renderer integration: swapped text + local image path containing spaces.
const root=process.cwd(),out=path.join(root,'out/qa/reuse');fs.mkdirSync(out,{recursive:true});
const fixture='verify local image.svg',file=path.join(root,'public',fixture);
if(fs.existsSync(file))throw new Error('Fixture name already exists');
fs.writeFileSync(file,'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#ed29b6"/><text x="70" y="300" font-family="sans-serif" font-size="80" fill="white">LOCAL IMAGE / NOVA</text></svg>');
try{
 const base=JSON.parse(fs.readFileSync('config.json')),serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();const results=[];
 for(const template of ['minimal','window','command','workflow']){
  const c={...base,story:undefined,timeline:undefined,sceneDurations:[1.2,3,3,2.8,2],duration:12,shader:false,shaderAsset:undefined,template,brand:'Nova Notes',title:'\u628a\u96f6\u6563\u60f3\u6cd5，\u6574\u7406\u6210\u4e0b\u4e00\u6b65\u884c\u52a8。',task:'\u5c06\u4f1a\u8bae\u4e2d\u7684\u4e0d\u540c\u60f3\u6cd5\u6574\u7406\u4e3a\u56e2\u961f\u4e0b\u4e00\u6b65\u4efb\u52a1\u6e05\u5355。',result:'\u4e0b\u4e00\u6b65\u4efb\u52a1\u6e05\u5355，\u5b8c\u6574\u5448\u73b0。',accent:'#9167d9',screenshots:[{file:fixture,label:'Original test image'}]};validateConfig(c,root);
  const inputProps={config:c},common={serveUrl,inputProps,browserExecutable:process.env.PROMOTION_BROWSER||process.env.VIDEO_CREATE_BROWSER||undefined};const composition=await selectComposition({...common,id:'ProductFilm'});const frame=Math.round(c.duration*c.fps*(template==='command'?.5:.68)),hashes=[];
  for(let i=0;i<2;i++){const output=path.join(out,template+'-'+i+'.png');await renderStill({...common,composition,frame,output,imageFormat:'png'});hashes.push(createHash('sha256').update(fs.readFileSync(output)).digest('hex'))}
  if(hashes[0]!==hashes[1])throw new Error(template+' non-deterministic');
  const pixels=execFileSync('ffmpeg',['-v','error','-i',path.join(out,template+'-0.png'),'-vf','scale=192:108','-f','rawvideo','-pix_fmt','rgb24','pipe:1']);let magentaPixels=0;
  for(let i=0;i<pixels.length;i+=3)if(pixels[i]>180&&pixels[i+1]<100&&pixels[i+2]>100)magentaPixels++;
  if(magentaPixels<200)throw new Error(template+' did not display the local image');
  let backgroundChangedPixels=null;if(c.backgroundImage){const without=path.join(out,template+'-without-background.png');const withoutProps={config:{...c,backgroundImage:null}};const withoutComposition=await selectComposition({...common,inputProps:withoutProps,id:'ProductFilm'});await renderStill({...common,inputProps:withoutProps,composition:withoutComposition,frame,output:without,imageFormat:'png'});const baseline=execFileSync('ffmpeg',['-v','error','-i',without,'-vf','scale=192:108','-f','rawvideo','-pix_fmt','rgb24','pipe:1']);backgroundChangedPixels=0;for(let i=0;i<pixels.length;i+=3)if(Math.abs(pixels[i]-baseline[i])+Math.abs(pixels[i+1]-baseline[i+1])+Math.abs(pixels[i+2]-baseline[i+2])>12)backgroundChangedPixels++;if(backgroundChangedPixels<500)throw new Error(template+' background plate did not reach output pixels')}
  results.push({template,frame,hashes,equal:true,backgroundChangedPixels,localImagePath:fixture,rendered:true,magentaPixels});
 }
 writeJSON(path.join(out,'verification.json'),results);console.log('Four templates: local image, changed product, long Chinese and repeat frames rendered');
}finally{stop();fs.unlinkSync(file)}

// All output and cleanup are awaited; release any remaining bundler worker handles.
process.exit(0);
