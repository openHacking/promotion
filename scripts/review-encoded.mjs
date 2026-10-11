// Playback evidence is separate from decoded signal checks and human listening.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from '../assets/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const files=process.argv.slice(2).map(f=>path.resolve(f));if(!files.length)throw new Error('Provide local encoded MP4 files');
const server=http.createServer((req,res)=>{const index=Number(new URL(req.url,'http://local').pathname.slice(1)),file=files[index];if(!file){res.writeHead(404).end();return}const size=fs.statSync(file).size,range=/bytes=(\d+)-(\d*)/.exec(req.headers.range??'');let start=0,end=size-1;if(range){start=Number(range[1]);if(range[2])end=Math.min(end,Number(range[2]))}res.writeHead(range?206:200,{'Content-Type':'video/mp4','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});fs.createReadStream(file,{start,end}).pipe(res)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await puppeteer.launch({executablePath:process.env.PROMOTION_BROWSER,headless:true,protocolTimeout:60000,args:['--autoplay-policy=no-user-gesture-required','--no-sandbox']});
try{for(const [index,file] of files.entries()){
 const page=await browser.newPage(),out=path.join(path.dirname(file),'qa/playback');fs.mkdirSync(out,{recursive:true});await page.setViewport({width:640,height:640});await page.setContent(`<body style="margin:0;background:#222"><video muted playsinline style="width:640px;height:640px;object-fit:contain" src="http://127.0.0.1:${server.address().port}/${index}"></video></body>`);
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 await page.evaluate(async()=>{const v=document.querySelector('video');window.reviewFrames=[];const cb=(now,meta)=>{window.reviewFrames.push({time:meta.mediaTime,presentedFrames:meta.presentedFrames});if(!v.ended)v.requestVideoFrameCallback(cb)};v.requestVideoFrameCallback(cb);await v.play();});
 for(const second of [1.5,6,9,15,20,23.5,25,28]){await page.waitForFunction(t=>document.querySelector('video').currentTime>=t,{timeout:45000},second);await page.screenshot({path:path.join(out,`time-${second}.png`)})}
 await page.waitForFunction(()=>document.querySelector('video').ended,{timeout:10000});
 const record=await page.evaluate(()=>{const v=document.querySelector('video');return {ended:v.ended,duration:v.duration,currentTime:v.currentTime,frames:window.reviewFrames,purpose:'Muted actual encoded playback; no listening evidence'}});fs.writeFileSync(path.join(out,'playback.json'),JSON.stringify(record,null,2));await page.close();console.log(path.basename(path.dirname(file))+': encoded playback reached end');
}}finally{await browser.close();await new Promise(r=>server.close(r))}
