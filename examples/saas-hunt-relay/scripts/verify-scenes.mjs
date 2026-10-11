import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {stop} from 'esbuild';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
import {validateConfig} from './config.mjs';
import {run,writeJSON} from './lib.mjs';
const root=process.cwd(),out=path.join(root,'out/qa/scenes');fs.mkdirSync(out,{recursive:true});
const name='scene video fixture.mp4',file=path.join(root,'public',name);
if(fs.existsSync(file))throw new Error('Fixture already exists');
try{
 await run('ffmpeg',['-y','-v','error','-f','lavfi','-i','color=c=0x22cc44:s=320x180:r=60:d=1','-f','lavfi','-i','color=c=0x2255ee:s=320x180:r=60:d=1','-filter_complex','[0:v][1:v]concat=n=2:v=1:a=0','-c:v','libx264','-pix_fmt','yuv420p',file]);
 const base=JSON.parse(fs.readFileSync('config.json')),c={...base,template:'story',duration:8,sceneDurations:[4,4],fps:60,timeline:undefined,shader:false,shaderAsset:undefined,backgroundImage:null};
 c.story=[{id:'blank',kind:'scene',scene:{background:'#000000',layers:[{id:'hidden',kind:'shape',color:'#ffffff',x:0,y:0,width:1,height:1,keys:[{frame:0,opacity:0}]}]}},{id:'test',kind:'scene',scene:{background:'#000000',layers:[{id:'video',kind:'video',file:name,x:0,y:0,width:1920,height:1080,startFrame:30,endFrame:120},{id:'masked',kind:'shape',color:'#ed4b08',x:50,y:50,width:300,height:300,startFrame:130,mask:'left',keys:[{frame:130,reveal:0},{frame:190,reveal:1}]},{id:'unicode',kind:'text',text:'\u6d4b\u8bd5 / Test',x:500,y:500,width:800,height:150,fontSize:60,color:'#ffffff',startFrame:130}]}}];
 validateConfig(c,root);
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});stop();
 const common={serveUrl,inputProps:{config:c},browserExecutable:process.env.PROMOTION_BROWSER||process.env.VIDEO_CREATE_BROWSER||undefined},composition=await selectComposition({...common,id:'ProductFilm'});
 const samples=[];
 for(const frame of [269,270,300,350,360,430]){
  const output=path.join(out,frame+'.png');await renderStill({...common,composition,frame,output,imageFormat:'png'});
  // Read a one-pixel center sample using a file to avoid text decoding binary output.
  const pixel=path.join(out,'pixel.rgb');await run('ffmpeg',['-y','-v','error','-i',output,'-vf','crop=1:1:960:540,format=rgb24','-f','rawvideo',pixel]);
  const rgb=[...fs.readFileSync(pixel)];samples.push({frame,rgb});
  if(frame===300)assert.ok(rgb[1]>150&&rgb[2]<100,'Video must start at shot-local lifetime, not global film time');
  if(frame===350)assert.ok(rgb[2]>150&&rgb[1]<150,'Video must advance source frames');
  if(frame===269||frame===360)assert.ok(rgb.every(v=>v<5),'Video must respect lifetime boundaries');
  if(frame===430){const again=path.join(out,'repeat.png');await renderStill({...common,composition,frame,output:again,imageFormat:'png'});assert.equal(createHash('sha256').update(fs.readFileSync(output)).digest('hex'),createHash('sha256').update(fs.readFileSync(again)).digest('hex'));
   await run('ffmpeg',['-y','-v','error','-i',output,'-vf','crop=1:1:100:100,format=rgb24','-f','rawvideo',pixel]);const revealed=[...fs.readFileSync(pixel)];assert.ok(revealed[0]>180&&revealed[1]<120,'Mask must reveal subject');}
 }
 const spatial=structuredClone(c);spatial.story[1].scene={background:'#000000',perspective:2400,camera:[{frame:0,x:300},{frame:60,x:0}],layers:[{id:'subject',kind:'shape',color:'#ed4b08',x:900,y:450,width:200,height:200}]};
 const spatialCommon={...common,inputProps:{config:spatial}},spatialComposition=await selectComposition({...spatialCommon,id:'ProductFilm'});
 for(const [frame,x,visible] of [[240,650,true],[240,960,false],[300,960,true]]){
  const output=path.join(out,'camera-'+frame+'.png');await renderStill({...spatialCommon,composition:spatialComposition,frame,output,imageFormat:'png'});
  const pixel=path.join(out,'pixel.rgb');await run('ffmpeg',['-y','-v','error','-i',output,'-vf',`crop=1:1:${x}:540,format=rgb24`,'-f','rawvideo',pixel]);const rgb=[...fs.readFileSync(pixel)];assert.equal(rgb[0]>180,visible,'Camera must translate the world inversely on shot-local frames');
 }
 spatial.story[1].scene.camera=[];delete spatial.story[1].scene.camera;spatial.story[1].scene.layers[0].depth=-1200;
 const depthCommon={...common,inputProps:{config:spatial}},depthComposition=await selectComposition({...depthCommon,id:'ProductFilm'}),depthOutput=path.join(out,'depth.png');
 await renderStill({...depthCommon,composition:depthComposition,frame:300,output:depthOutput,imageFormat:'png'});
 await run('ffmpeg',['-y','-v','error','-i',depthOutput,'-vf','crop=1:1:1070:540,format=rgb24','-f','rawvideo',path.join(out,'pixel.rgb')]);assert.ok(fs.readFileSync(path.join(out,'pixel.rgb'))[0]<5,'Negative depth must recede under perspective');
 fs.rmSync(path.join(out,'pixel.rgb'));writeJSON(path.join(out,'verification.json'),{passed:true,samples,checks:['title-free scenes','shot-local video source time','exclusive layer lifetime','revealed mask','repeat-frame determinism','Unicode text render','camera tracking','perspective depth']});console.log('Scene renderer integration passed');
}finally{stop();if(fs.existsSync(file))fs.unlinkSync(file)}
process.exit(0);
