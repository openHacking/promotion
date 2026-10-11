import test from 'node:test';import assert from 'node:assert/strict';
import {resolveFormat,discoveryLayout} from '../src/formats.mjs';
test('format overrides preserve authored timing and legacy default',()=>{const c={width:1920,height:1080,timeline:{events:[{frame:120}]}};assert.equal(resolveFormat(c),c);assert.equal(resolveFormat(c,'portrait').height,1920);assert.throws(()=>resolveFormat(c,'square'),/landscape or portrait/);assert.equal(resolveFormat(c,'portrait').timeline,c.timeline);assert.throws(()=>resolveFormat(c,'reels'));});
test('native aspect layouts change composition and keep panel inside canvas',()=>{const a=discoveryLayout(1920,1080),b=discoveryLayout(1080,1920);assert.ok(b.portrait&&!a.portrait);assert.notEqual(a.panel.width/a.panel.height,b.panel.width/b.panel.height);for(const v of [a,b]){assert.ok(v.panel.x>=v.inset.left);assert.ok(v.panel.y>v.inset.top);assert.ok(v.panel.height>0);}assert.ok(b.panel.y+b.panel.height<1920-b.inset.bottom);});

test('canvas-only overrides cannot silently crop authored scenes',()=>assert.throws(()=>resolveFormat({template:'story',width:1920,height:1080},'portrait')));

test('custom safe insets reposition the canvas content instead of only moving the logo',()=>{const a=discoveryLayout(1080,1920),b=discoveryLayout(1080,1920,{top:250,bottom:250,left:120,right:120});assert.ok(b.panel.y>a.panel.y);assert.ok(b.titleY>a.titleY);assert.equal(b.panel.x,120);assert.ok(b.panel.y+b.panel.height<=1920-250);});
