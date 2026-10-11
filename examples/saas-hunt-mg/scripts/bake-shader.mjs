import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
export async function bakeShader(root,c){
 if(!c.shader)return;
 const key=createHash('sha256').update(JSON.stringify({accent:c.accent,duration:c.duration,fps:c.fps,version:1})).update(fs.readFileSync(path.join(root,'src/ShaderBackdrop.tsx'))).digest('hex');
 const file=path.join(root,'public/shader-background.mp4'),manifest=file+'.json';
 if(!fs.existsSync(file)||!fs.existsSync(manifest)||JSON.parse(fs.readFileSync(manifest)).key!==key||JSON.parse(fs.readFileSync(manifest)).sha256!==createHash('sha256').update(fs.readFileSync(file)).digest('hex')){
  console.log('Baking frame-locked WebGPU texture');
  const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
  const common={serveUrl,inputProps:{config:c},browserExecutable:process.env.PROMOTION_BROWSER||process.env.VIDEO_CREATE_BROWSER||undefined,chromiumOptions:{gl:'angle',enableUnsafeWebGPU:true}};
  const composition=await selectComposition({...common,id:'ShaderTexture'});
  const partial=file+'.partial.mp4';await renderMedia({...common,composition,outputLocation:partial,codec:'h264',crf:16,pixelFormat:'yuv420p',concurrency:1});fs.renameSync(partial,file);
  fs.writeFileSync(manifest,JSON.stringify({key,frames:composition.durationInFrames,fps:c.fps,width:960,height:540,license:'Original palette and animation using MIT shader dependency',note:'GPU material baked once; final compositing seeks immutable video frames. GPU re-bakes may differ at subvisual rounding precision.',sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex')},null,2)+'\n');
 }
 c.shaderAsset='shader-background.mp4';
 const configFile=path.join(root,'config.json'),original=JSON.parse(fs.readFileSync(configFile));if(original.shaderAsset!==c.shaderAsset){original.shaderAsset=c.shaderAsset;fs.writeFileSync(configFile,JSON.stringify(original,null,2)+'\n')}
}
