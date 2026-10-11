import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMG} from './mg-config.mjs';
test('MG recipes preserve Unicode copy and local image checks',()=>{
 const files=[];validateMG({recipe:'orbit',headline:'\u53d1\u73b0',items:['A','B','C'],selected:2},v=>files.push(v));
 validateMG({recipe:'split',headline:'Inspect',file:'page.png'},v=>files.push(v));assert.deepEqual(files,['page.png']);
});
for(const spec of [{recipe:'unknown',headline:'Hi'},{recipe:'split',headline:'Hi'},{recipe:'orbit',headline:'Hi',items:['A','B']},{recipe:'orbit',headline:'Hi',items:['A','B','C'],selected:3},{recipe:'elastic',headline:' '},{recipe:'elastic',headline:'Hi',items:[]}])test('MG rejects '+JSON.stringify(spec),()=>assert.throws(()=>validateMG(spec,()=>{})));

test('MG frame parameters and custom paths validate before rendering',()=>{validateMG({recipe:'path',headline:'Carry identity',motion:{actionStartFrame:90,actionDurationFrames:48,pathPoints:[{x:-200,y:100},{x:50,y:-100},{x:0,y:0}]}},()=>{});for(const motion of [{actionDurationFrames:0},{staggerFrames:-1},{unknown:1},{pathPoints:[{x:0,y:0}]}])assert.throws(()=>validateMG({recipe:'path',headline:'Test',motion},()=>{}));});
