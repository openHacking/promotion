import {test} from 'node:test';
import assert from 'node:assert/strict';
import {progress,colorMix,palette,relayTimes} from '../src/phrase-motion.mjs';
import {validateArchitecture} from './architecture-config.mjs';
test('overlapping actions remain independent across reverse and repeated frame evaluation',()=>{
 const pose=f=>({group:progress(f,100,220),filter:progress(f,180,280)}),expected=pose(200);
 assert.ok(expected.group>0&&expected.group<1&&expected.filter>0&&expected.filter<1);
 for(const f of [0,500,219,181,1,279])pose(f);assert.deepEqual(pose(200),expected);
 assert.deepEqual(pose(-1),{group:0,filter:0});assert.deepEqual(pose(500),{group:1,filter:1});assert.throws(()=>progress(1,10,10));
});
test('configured palette controls every semantic role and interpolation preserves endpoints',()=>{
 const c={background:'#123456',foreground:'#fedcba',surface:'#abcdef',accent:'#654321',architecture:{secondary:'#aa88cc'}};
 assert.deepEqual(palette(c),{canvas:'#123456',ink:'#fedcba',surface:'#abcdef',accent:'#654321',secondary:'#aa88cc'});
 assert.equal(colorMix(c.background,c.foreground,0),c.background);assert.equal(colorMix(c.background,c.foreground,1),c.foreground);
 assert.equal(palette({...c,architecture:undefined}).secondary,c.accent);
});
test('authored relay validates shared contacts and preserves Unicode product records',()=>{
 const times=relayTimes(60),events=Object.entries(times).map(([id,frame])=>({id,frame}));
 const c={duration:30,fps:60,timeline:{events},architecture:{choreography:'relay',direction:'ribbon',secondary:'#465de2',categories:['A','B','C'],category:'A',selected:0,products:['\u5de5\u5177','B','C'].map((name,i)=>({name,category:['A','B','C'][i],maker:'\u521b\u4f5c\u8005',description:'Useful',tags:[],source:'https://example.com'}))}};
 validateArchitecture(c,()=>{});assert.equal(relayTimes(60,[{id:'group',frame:350}]).group,350);
 c.timeline.events.find(e=>e.id==='filter').frame=700;assert.throws(()=>validateArchitecture(c,()=>{}));
});
