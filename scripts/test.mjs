import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {openComposition,readConfig,writeJSON} from './lib.mjs';
const root=path.resolve(process.argv[2]||'.'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'video create tests '));
const result=[];
try{
 for(const f of ['index.html','style.css','runtime.js','package.json','config.json'])fs.copyFileSync(path.join(root,f),path.join(tmp,f));fs.cpSync(path.join(root,'assets'),path.join(tmp,'assets'),{recursive:true});if(fs.existsSync(path.join(root,'node_modules')))fs.symlinkSync(path.join(root,'node_modules'),path.join(tmp,'node_modules'));
 fs.writeFileSync(path.join(tmp,'assets/test image.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="1760" height="896"><rect width="1760" height="896" fill="#336699"/><circle cx="800" cy="400" r="200" fill="#ddbb66"/></svg>');const original=readConfig(root);const put=c=>writeJSON(path.join(tmp,'config.json'),c);
 for(const template of ['minimal','window','command','workflow']){
  const c={...original,template,brand:'\u6d4b\u8bd5\u4ea7\u54c1 / Nova',title:'\u8ba9\u590d\u6742\u5de5\u4f5c\u53d8\u5f97\u6e05\u695a，\u8ba9\u6bcf\u4e2a\u60f3\u6cd5\u90fd\u80fd\u7a33\u7a33\u843d\u5730。',tagline:'\u8ba9\u7075\u611f\u627e\u5230\u65b9\u5411，\u8ba9\u5de5\u4f5c\u6301\u7eed\u5411\u524d。',screenshots:[{file:'assets/test image.svg',label:'Original image fixture'}]};put(c);const comp=await openComposition(tmp);
  try{await comp.page.evaluate(async()=>{await window.video.seek(1)});assert.ok(await comp.page.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.wordmark')).fontSize)>=72),'Brand wordmark must remain readable');for(const t of [0,2.8,6.1,c.duration-1/c.fps]){await comp.page.evaluate(async t=>{await window.video.seek(t)},t);let a=createHash('sha256').update(await comp.page.screenshot()).digest('hex');await comp.page.evaluate(async t=>{await window.video.seek(t)},c.duration*.8);await comp.page.evaluate(async t=>{await window.video.seek(t)},t);let b=createHash('sha256').update(await comp.page.screenshot()).digest('hex');assert.equal(a,b,'Repeat-seek pixels');}
   await comp.page.evaluate(async t=>{await window.video.seek(t)},c.sceneDurations[0]+c.sceneDurations[1]/2);
   const overflow=await comp.page.evaluate(()=>Array.from(document.querySelectorAll('.big,.wordmark,.title-top,.feature h3,.flowcard h3,.tagline')).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));assert.deepEqual(overflow,[],'Long Chinese text must fit');result.push({test:template+' long copy and seek determinism',passed:true});
  }finally{await comp.close();}
 }
 for(const [name,patch] of [['missing image',{screenshots:[{file:'assets/missing image.png',label:'missing'}]}],['missing font',{fontFile:'assets/missing font.ttf'}],['remote asset',{logo:'https://example.com/logo.png'}],['bad scene duration',{sceneDurations:[1,1,1,1,1]}]]){
  put({...original,...patch});let failed=false;try{const comp=await openComposition(tmp);await comp.close();}catch{failed=true;}assert.ok(failed,name+' should reject');result.push({test:name,passed:true});
 }
 put(original);const comp=await openComposition(tmp);try{await comp.page.evaluate(async()=>{await window.video.seek(0)});await comp.page.keyboard.press('ArrowRight');await comp.page.waitForTimeout(80);const t=await comp.page.evaluate(()=>window.video.time);assert.equal(t,1/original.fps);result.push({test:'keyboard advances exactly one frame',passed:true});}finally{await comp.close();}
 console.log(JSON.stringify(result,null,2));fs.mkdirSync(path.join(root,'out/qa'),{recursive:true});writeJSON(path.join(root,'out/qa','integration.json'),result);
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
