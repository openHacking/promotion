import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sampleKeys} from '../src/scene-motion.mjs';
const base={x:0,y:0,z:0,scale:1,rotate:0,rotateX:0,rotateY:0,opacity:1,reveal:1};
test('sparse poses inherit channels and holds are exact',()=>{
 const keys=[{frame:10,x:100,opacity:0},{frame:30,x:300,opacity:1,easing:'linear'},{frame:60,scale:2}];
 assert.equal(sampleKeys(keys,0,base).x,100);
 const middle=sampleKeys(keys,20,base);assert.equal(middle.x,200);assert.equal(middle.opacity,.5);
 const end=sampleKeys(keys,100,base);assert.equal(end.x,300);assert.equal(end.scale,2);assert.equal(end.opacity,1);
 assert.deepEqual(sampleKeys(keys,20,base),middle);
});
test('smooth masks reach exact endpoints without overshoot',()=>{
 const keys=[{frame:0,reveal:0},{frame:60,reveal:1}];
 for(let frame=0;frame<=90;frame++){const v=sampleKeys(keys,frame,base);assert.ok(v.reveal>=0&&v.reveal<=1)}
 assert.equal(sampleKeys(keys,0,base).reveal,0);assert.equal(sampleKeys(keys,60,base).reveal,1);
});
