import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildAudio} from './audio.mjs';
import {run} from './lib.mjs';

const config=(audio={mode:'procedural'})=>({duration:1,fps:60,audio,motionEvents:[{id:'touch',frame:12,kind:'select',sound:{pan:-.7}},{id:'land',frame:36,kind:'brand'}]});
async function fixture(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),'promotion-audio-'));fs.mkdirSync(path.join(root,'public'));const out=path.join(root,'out');fs.mkdirSync(out);try{await fn(root,out);}finally{fs.rmSync(root,{recursive:true,force:true});}}
const report=out=>JSON.parse(fs.readFileSync(path.join(out,'audio.json')));
test('material score is repeatable, stereo, frame aligned and leaves headroom',()=>fixture(async(root,out)=>{
 const c=config();await buildAudio(root,c,out);const first=fs.readFileSync(path.join(out,'soundtrack.wav'));await buildAudio(root,c,out);assert.deepEqual(fs.readFileSync(path.join(out,'soundtrack.wav')),first);
 assert.equal(first.length,44+48000*4);assert.equal(first.readUInt16LE(22),2);assert.equal(report(out).cues[0].time,.2);assert.ok(report(out).finalPeak<=.750001);assert.equal(report(out).listening.status,'not-performed');
 const stem=fs.readFileSync(path.join(out,'.internal/sfx.wav'));let l=0,r=0;for(let i=9600;i<13920;i++){l+=stem.readInt16LE(44+i*4)**2;r+=stem.readInt16LE(46+i*4)**2;}assert.ok(l>r*2,'pan must change channel energy');
}));
test('overlapping loud cues reduce master gain without clipping',()=>fixture(async(root,out)=>{
 const c=config({mode:'procedural',musicVolume:2,sfxVolume:2});c.motionEvents=Array.from({length:25},(_,i)=>({id:'hit'+i,frame:20,kind:'brand',sound:{gain:2}}));await buildAudio(root,c,out);assert.ok(report(out).masterGain<1);assert.ok(report(out).finalPeak<=.750001);
}));
test('recorded music produces a measured nonzero music stem and smooth ducking',()=>fixture(async(root,out)=>{
 await run('ffmpeg',['-y','-v','error','-f','lavfi','-i','sine=frequency=440:duration=2','-c:a','pcm_s16le',path.join(root,'public/music.wav')]);
 const c=config({mode:'file',source:'music.wav',sourceOffsetSeconds:.2,musicVolume:.4,duckAmount:0});await buildAudio(root,c,out);const dry=fs.readFileSync(path.join(out,'.internal/music.wav'));c.audio.duckAmount=.6;await buildAudio(root,c,out);const ducked=fs.readFileSync(path.join(out,'.internal/music.wav'));assert.ok(report(out).musicPeak>0);assert.match(report(out).sourceSha256,/^[a-f0-9]{64}$/);
 const energy=(buf,a,b)=>{let s=0;for(let i=a;i<b;i++)s+=buf.readInt16LE(44+i*4)**2;return s;};assert.ok(energy(ducked,9600,12000)<energy(dry,9600,12000)*.7);
 c.audio.sourceOffsetSeconds=1.8;await assert.rejects(buildAudio(root,c,out),/shorter/);assert.ok(!fs.existsSync(path.join(out,'.internal/decode.f32')));
}));
test('recorded cue override, muted event and leading sweep use the shared timeline',()=>fixture(async(root,out)=>{
 await run('ffmpeg',['-y','-v','error','-f','lavfi','-i','sine=frequency=1000:duration=1',path.join(root,'public/click.wav')]);
 const c=config();c.motionEvents=[{id:'sweep',frame:18,kind:'transition',sound:{material:'air',leadSeconds:.15}},{id:'sample',frame:30,kind:'select',sound:{source:'click.wav',durationSeconds:.1}},{id:'quiet',frame:40,kind:'brand',sound:false}];await buildAudio(root,c,out);assert.equal(report(out).cues.length,2);assert.equal(report(out).cues[0].startFrame,9);assert.equal(report(out).cues[1].material,'recorded');
}));
test('decoded audio cannot escape the public directory through a symlink',()=>fixture(async(root,out)=>{
 fs.writeFileSync(path.join(root,'outside.wav'),'fixture');fs.symlinkSync(path.join(root,'outside.wav'),path.join(root,'public/escape.wav'));await assert.rejects(buildAudio(root,config({mode:'file',source:'escape.wav'}),out),/inside/);
}));

test('a decoded cue within the 10 ms codec tolerance stays finite',()=>fixture(async(root,out)=>{
 await run('ffmpeg',['-y','-v','error','-f','lavfi','-i','sine=frequency=1000:duration=0.095',path.join(root,'public/short.wav')]);
 const c=config();c.motionEvents=[{id:'short',frame:30,kind:'select',sound:{source:'short.wav',durationSeconds:.1}}];await buildAudio(root,c,out);assert.ok(Number.isFinite(report(out).finalPeak));assert.ok(Number.isFinite(report(out).cues[0].window.sfxRms));
}));
