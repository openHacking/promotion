import React,{useRef,useLayoutEffect} from 'react';
import {cancelRender,continueRender,delayRender} from 'remotion';
import {createRendererFromJSON} from 'shaders/core';
import MeshGradient from 'shaders/core/MeshGradient';
// Analytic effect only: fresh clock per requested frame supports backwards seeks and concurrency.
// Stateful fluid/trail simulations need sequential baking, not this adapter.
export const ShaderBackdrop:React.FC<{frame:number;fps:number;accent:string}>=({frame,fps,accent})=>{
 const canvas=useRef<HTMLCanvasElement>(null);
 useLayoutEffect(()=>{
  const handle=delayRender('Frame-locked WebGPU background');let active=true;
  const renderer=createRendererFromJSON({components:[{id:'product-mesh',type:'MeshGradient',props:{stops:[{color:'#081720',position:0},{color:accent,position:.52},{color:'#163950',position:1}],seed:19,speed:1.5,drift:.7,swirl:.6,wrapping:.1}}]},{components:[MeshGradient],forceFullFrameRate:true});
  (async()=>{await renderer.initialize(canvas.current!);if(renderer.getFailureReason())throw new Error('WebGPU unavailable: '+JSON.stringify(renderer.getFailureReason()));await renderer.renderFrame({deltaSeconds:frame/fps,waitForGpu:true});if(active)continueRender(handle)})().catch(e=>{if(active)cancelRender(e)});
  return()=>{active=false;renderer.dispose()};
 },[frame,fps,accent]);
 return <canvas ref={canvas} width={960} height={540} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:1}}/>;
};
