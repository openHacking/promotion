import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {prepare} from './prepare.mjs';
const c=await prepare(),root=process.cwd();fs.mkdirSync('out/seek',{recursive:true});
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name==='/')name='/index.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.ttf':'font/ttf','.wav':'audio/wav'})[ext]??'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
console.log('Local server ready');const browser=await puppeteer.launch({executablePath:process.env.PROMOTION_BROWSER??process.env.HYPERFRAMES_BROWSER_PATH,headless:true,protocolTimeout:30000,timeout:30000,args:['--no-sandbox','--disable-gpu']});
try{
 console.log('Browser ready');const page=await browser.newPage();page.on('pageerror',e=>console.error(e.message));console.log('Page ready');await page.setViewport({width:c.width,height:c.height,deviceScaleFactor:1});await page.goto(`http://127.0.0.1:${server.address().port}`);console.log('Page loaded');await page.waitForFunction(()=>window.video?.ready===true);
 console.log('Timeline ready');const order=[258,0,198,42,359,138,273,90,12,240,42,258,0,138,359,198,273,90,12,240],hashes=new Map(),checks=[];
 for(const frame of order){await page.evaluate(t=>window.video.seek(t),frame/c.fps);const data=await page.screenshot({path:`out/seek/frame-${frame}.png`}),hash=createHash('sha256').update(data).digest('hex');checks.push({frame,hash,equal:!hashes.has(frame)||hashes.get(frame)===hash});hashes.set(frame,hash)}
 await page.evaluate(()=>window.video.seek(5));const bounds=await page.$eval('#card-1',el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}});
 const targetBounds=bounds.x===410&&bounds.y===340&&bounds.width===1400&&bounds.height===520;
 fs.writeFileSync('out/seek.json',JSON.stringify({engine:'hyperframes',method:'Same browser page, non-monotonic time seeks, screenshot SHA256',order,checks,bounds,targetBounds,fonts:await page.evaluate(()=>document.fonts.status)},null,2));
 if(checks.some(x=>!x.equal)||!targetBounds)throw new Error('Seek residual state or incorrect landing bounds');
 console.log('Seek and repeated-frame checks passed');
}finally{await browser.close();await new Promise(r=>server.close(r))}
