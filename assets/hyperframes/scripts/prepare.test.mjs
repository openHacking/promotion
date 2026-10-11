import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validate} from './prepare.mjs';
const base=()=>JSON.parse(fs.readFileSync('config.json'));
test('frame aligned timeline accepts replacement Unicode product labels',()=>{const c=base();c.brand='\u4ea7\u54c1';c.items=['\u53d1\u73b0','Build','Measure','Publish'];assert.equal(validate(c).items[0],'\u53d1\u73b0')});
for(const [name,mutate] of [['fractional frames',c=>c.duration=6.001],['reordered events',c=>c.timeline.events[2].frame=100],['missing event',c=>c.timeline.events.pop()],['duplicate event',c=>c.timeline.events.push(c.timeline.events[0])],['escaping recording',c=>c.audio.source='../outside.wav'],['remote recording',c=>c.audio.source='https://example.com/audio.wav'],['unreadable labels',c=>c.items[0]='Long'.repeat(20)],['unsupported format',c=>c.height=1920]])test('reject '+name,()=>{const c=base();mutate(c);assert.throws(()=>validate(c))});
