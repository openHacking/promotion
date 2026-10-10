import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateConfig,motionEvents} from './config.mjs';
const original=JSON.parse(fs.readFileSync('config.json'));const copy=()=>structuredClone(original);
test('valid product and exact timeline',()=>assert.equal(validateConfig(copy(),process.cwd()).duration,original.duration));
for(const [name,mutate] of [['missing background',c=>c.backgroundImage='missing-background.png'],['invalid background motion',c=>c.backgroundMotion='spin'],['missing image',c=>c.screenshots=[{file:'missing.png',label:'test'}]],['font load',c=>c.fontFile='missing.ttf'],['remote image',c=>c.logo='https://example.com/a.png'],['path traversal',c=>c.fontFile='../font.ttf'],['timeline mismatch',c=>c.sceneDurations[0]+=.1],['unreadable long copy',c=>c.title='\u957f'.repeat(61)]])test('reject '+name,()=>{const c=copy();mutate(c);assert.throws(()=>validateConfig(c,process.cwd()))});
test('shot cues are exact integer frames',()=>{const events=motionEvents(copy());assert.ok(events.every(e=>Number.isInteger(e.frame)&&e.frame>=0&&e.frame<original.duration*original.fps))});

test('file audio paths remain public-relative across repeated validation',()=>{const c=copy();c.audio={mode:'file',source:c.fontFile};const before=structuredClone(c);validateConfig(c,process.cwd());validateConfig(c,process.cwd());assert.deepEqual(c,before)});

test('freeform stories support arbitrary shot counts and shared events',()=>{const c=copy();c.template='story';c.sceneDurations=[2,2,2,2,2,2];c.duration=12;c.story=c.sceneDurations.map((_,i)=>({id:'s'+i,kind:'brand',title:'Shot '+i}));c.timeline={events:[{id:'landing',frame:60,kind:'select'}],beatFrames:[0,30,60]};assert.equal(validateConfig(c,process.cwd()).story.length,6);assert.equal(motionEvents(c)[0].frame,60);c.story[1].eventId='missing';assert.throws(()=>validateConfig(c,process.cwd()));});
test('reject duplicated event identities and out-of-range cue frames',()=>{for(const events of [[{id:'a',frame:30,kind:'select'},{id:'a',frame:60,kind:'resolve'}],[{id:'a',frame:original.duration*original.fps,kind:'select'}]]){const c=copy();c.timeline={events};assert.throws(()=>validateConfig(c,process.cwd()));}});
test('reject invalid source offset and UI region',()=>{const c=copy();c.audio.sourceOffsetSeconds=-1;assert.throws(()=>validateConfig(c,process.cwd()));delete c.audio.sourceOffsetSeconds;c.uiShell={file:c.fontFile,contentRect:{x:1800,y:0,width:300,height:100}};assert.throws(()=>validateConfig(c,process.cwd()));});
