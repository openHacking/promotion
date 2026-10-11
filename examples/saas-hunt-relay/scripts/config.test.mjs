import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateConfig,motionEvents} from './config.mjs';
const original={title:'Test product',task:'Test operation',result:'Test result',tagline:'Test tagline',category:'TEST',description:'Test description',features:['One','Two','Three'],screenshots:[],...JSON.parse(fs.readFileSync('config.json'))};const copy=()=>structuredClone(original);
test('valid product and exact timeline',()=>assert.equal(validateConfig(copy(),process.cwd()).duration,original.duration));
for(const [name,mutate] of [['missing background',c=>c.backgroundImage='missing-background.png'],['invalid background motion',c=>c.backgroundMotion='spin'],['missing image',c=>c.screenshots=[{file:'missing.png',label:'test'}]],['font load',c=>c.fontFile='missing.ttf'],['remote image',c=>c.logo='https://example.com/a.png'],['path traversal',c=>c.fontFile='../font.ttf'],['timeline mismatch',c=>c.sceneDurations[0]+=.1],['unreadable long copy',c=>c.title='\u957f'.repeat(61)]])test('reject '+name,()=>{const c=copy();mutate(c);assert.throws(()=>validateConfig(c,process.cwd()))});
test('shot cues are exact integer frames',()=>{const events=motionEvents(copy());assert.ok(events.every(e=>Number.isInteger(e.frame)&&e.frame>=0&&e.frame<original.duration*original.fps))});

test('file audio paths remain public-relative across repeated validation',()=>{const c=copy();c.audio={mode:'file',source:c.fontFile};const before=structuredClone(c);validateConfig(c,process.cwd());validateConfig(c,process.cwd());assert.deepEqual(c,before)});

test('freeform stories support arbitrary shot counts and shared events',()=>{const c=copy();c.template='story';c.sceneDurations=[2,2,2,2,2,2];c.duration=12;c.story=c.sceneDurations.map((_,i)=>({id:'s'+i,kind:'brand',title:'Shot '+i}));c.timeline={events:[{id:'landing',frame:60,kind:'select'}],beatFrames:[0,30,60]};assert.equal(validateConfig(c,process.cwd()).story.length,6);assert.equal(motionEvents(c)[0].frame,60);c.story[1].eventId='missing';assert.throws(()=>validateConfig(c,process.cwd()));});
test('reject duplicated event identities and out-of-range cue frames',()=>{for(const events of [[{id:'a',frame:30,kind:'select'},{id:'a',frame:60,kind:'resolve'}],[{id:'a',frame:original.duration*original.fps,kind:'select'}]]){const c=copy();c.timeline={events};assert.throws(()=>validateConfig(c,process.cwd()));}});
test('reject invalid source offset and UI region',()=>{const c=copy();c.audio.sourceOffsetSeconds=-1;assert.throws(()=>validateConfig(c,process.cwd()));delete c.audio.sourceOffsetSeconds;c.uiShell={file:c.fontFile,contentRect:{x:1800,y:0,width:300,height:100}};assert.throws(()=>validateConfig(c,process.cwd()));});

test('reject invalid sound controls and nonlocal recordings',()=>{
 for(const sound of [{pan:2},{gain:-1},{leadSeconds:NaN},{durationSeconds:0},{sourceOffsetSeconds:-1},{material:'boing'},{source:'https://example.com/a.wav'},{source:'../outside.wav'},{source:''},true]){const c=copy();c.timeline={events:[{id:'a',frame:30,kind:'select',sound}]};assert.throws(()=>validateConfig(c,process.cwd()));}
 for(const audio of [{bpm:NaN},{musicVolume:3},{sfxVolume:-1}]){const c=copy();Object.assign(c.audio,audio);assert.throws(()=>validateConfig(c,process.cwd()));}
});

const sceneConfig=()=>{const c=copy();c.template='story';c.sceneDurations=[4,4];c.duration=8;c.story=[0,1].map(i=>({id:'scene-'+i,kind:'scene',scene:{layers:[{id:'subject',kind:'shape',color:'#ed4b08',x:100,y:100,width:200,height:200,mask:'left',keys:[{frame:0,reveal:0},{frame:60,reveal:1}]}]}}));delete c.timeline;return c;};
test('title-free scenes and title-free legacy page preserve compatibility',()=>{const c=sceneConfig();assert.equal(validateConfig(c,process.cwd()).story[0].title,undefined);c.story[1]={id:'page',kind:'page',file:c.fontFile};validateConfig(c,process.cwd());});
for(const [name,mutate] of [
 ['unordered keys',s=>s.layers[0].keys=[{frame:60},{frame:30}]],
 ['key outside shot',s=>s.camera=[{frame:240}]],
 ['missing image',s=>Object.assign(s.layers[0],{kind:'image',file:'missing.png'})],
 ['remote video',s=>Object.assign(s.layers[0],{kind:'video',file:'https://example.com/video.mp4'})],
 ['duplicate layer',s=>s.layers.push(structuredClone(s.layers[0]))],
 ['invalid reveal',s=>s.layers[0].keys[0].reveal=2],
 ['invalid lifetime',s=>s.layers[0].endFrame=0],
 ['invalid camera',s=>s.camera=[{frame:0,scale:0}]],
 ['empty text',s=>Object.assign(s.layers[0],{kind:'text',text:''})],
 ['invalid light',s=>s.light={x:0,y:0,size:100,opacity:2,color:'#ffffff'}]
])test('scene rejects '+name,()=>{const c=sceneConfig();mutate(c.story[0].scene);assert.throws(()=>validateConfig(c,process.cwd()));});

test('pure scenes require no legacy promotional copy or screenshots',()=>{const c=sceneConfig();for(const key of ['title','task','result','tagline','category','description','features','screenshots'])delete c[key];validateConfig(c,process.cwd());c.story[1]={id:'legacy',kind:'brand'};assert.throws(()=>validateConfig(c,process.cwd()));});
