import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzePCM,verifyMusicAlignment} from './music-analysis.mjs';
test('offset pulse train produces onset-supported markers rather than a zero-origin BPM grid',()=>{
 const sr=22050,samples=new Float32Array(sr*8);for(let t=.23;t<8;t+=.5)for(let i=0;i<sr*.04;i++)samples[Math.round(t*sr)+i]=(samples[Math.round(t*sr)+i]??0)+Math.sin(i*.4)*Math.exp(-i/(sr*.008));
 const r=analyzePCM(samples,{sampleRate:sr,fps:60,bpmHint:120});assert.ok(r.onsets.length>=14);assert.ok(Math.abs(r.onsets[0].time-.23)<.04);assert.ok(Math.abs(r.tempo.bpm-120)<3);assert.ok(r.beats.filter(v=>v.kind==='onset-supported-beat').length>=10);assert.deepEqual(r,analyzePCM(samples,{sampleRate:sr,fps:60,bpmHint:120}));
});
test('silence produces no fabricated beats or musical climax',()=>{const r=analyzePCM(new Float32Array(22050*2));assert.equal(r.tempo,null);assert.deepEqual(r.beats,[]);assert.ok(r.warnings.length);});

test('changed sources and shifted event schedules cannot retain an alignment claim',()=>{const c={rhythm:{analysisSourceSha256:'a',requireOnsetAlignment:true},timeline:{events:[{id:'reveal',frame:240}]}},analysis={sourceSha256:'a',onsets:[{frame:240}]};assert.equal(verifyMusicAlignment(c,analysis)[0].deltaFrames,0);assert.throws(()=>verifyMusicAlignment(c,{...analysis,sourceSha256:'b'}));assert.throws(()=>verifyMusicAlignment(c,{...analysis,onsets:[{frame:246}]}));});
