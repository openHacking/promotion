const stage=document.querySelector('#stage'), controls=document.querySelector('#controls');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)), ease=v=>1-(1-clamp(v))**3;
let c,currentScene=-1,time=0,playing=false,origin=0,playStart=0;
const qs=new URLSearchParams(location.search),exporting=qs.has('export');
if(exporting)document.body.classList.add('export');
const logo=()=>`<div class="logo">${c.logo?`<img src="${esc(c.logo)}" alt="Brand mark">`:esc(Array.from(c.brand)[0])}</div>`;
const lock=()=>`<div class="brandlock">${logo()}<div class="wordmark">${esc(c.brand)}</div></div>`;
const meta=i=>`<div class="meta"><span class="brand-small">${esc(c.brand)}</span><span>${String(i+1).padStart(2,'0')} / 05</span></div><div class="foot"><span>${esc(c.evidenceLabel)}</span><span>${esc(c.category)}</span></div>`;
const intro=out=>`<section class="intro ${out?'outro':''}"><div class="eyebrow motion" data-delay="0">${esc(c.category)}</div><div class="motion" data-delay="0.10">${lock()}</div><div class="tagline motion" data-delay="0.24">${esc(out?c.tagline:c.description)}</div>${out?`<div class="url motion" data-delay="0.35">${esc(c.url)}</div>`:''}</section>`;
const chrome=()=>`<header class="chrome"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span class="address">${esc(c.brand)} — Workspace</span></header>`;
const sidebar=()=>`<aside class="sidebar"><strong>${esc(c.brand)}</strong><div class="selected">Workspace</div><div>Recent projects</div><div>Saved items</div><div>Shared content</div></aside>`;
const genericApp=()=>`<div class="paper app">${chrome()}<div class="appbody">${sidebar()}<div class="appmain"><span class="caption">Make room for the next idea</span><h3>${esc(c.task)}</h3><div class="tiles">${c.features.map((f,i)=>`<div class="tile"><b>${['◈','▤','↗'][i]}</b>${esc(f)}</div>`).join('')}</div><div class="rows">${c.features.map((f,i)=>`<div class="row"><i class="check"></i><span>${esc(f)}</span><small>${['In progress','Ready','Shared'][i]}</small></div>`).join('')}</div></div></div></div>`;
const screenshot=step=>{const s=c.screenshots[Math.min(step,c.screenshots.length-1)];return s?`<img class="screenshot" src="${esc(s.file)}" alt="${esc(s.label)}">`:'';};
const desktop=()=>`<div class="paper app">${chrome()}<div class="desktopbody">${sidebar()}<div class="conversation"><h3>Work with ${esc(c.brand)}</h3><div class="bubble" id="typed"></div>${c.features.map((f,i)=>`<div class="activity" data-step="${i}"><span class="status">✓</span>${esc(f)}</div>`).join('')}<div class="resultbox" data-step="3">${esc(c.result)}</div><div class="inputbox">Describe the task <span style="float:right;color:var(--accent)">↑</span></div></div></div></div>`;
const title=(s,sub='')=>`<div class="title-top motion">${esc(s)}${sub?`<span class="accent"> ${esc(sub)}</span>`:''}</div>`;
const featureCards=()=>`<div class="features">${c.features.map((f,i)=>`<article class="feature motion" data-delay="${i*.12}"><span class="num">0${i+1}</span><h3>${esc(f)}</h3><p>${esc(c.featureDescriptions?.[i]??['Fewer interruptions. More focus.','Give information a place.','A clear next step.'][i])}</p></article>`).join('')}</div>`;
const command=()=>`<div class="command-shell"><div class="command-input"><i class="search-icon"></i><span id="typed"></span></div><div class="command-results">${c.features.map((f,i)=>`<div class="command-row ${i===0?'active':''}" data-step="${i}"><span class="accent">${['⌘','↗','◈'][i]}</span>${esc(f)}<kbd>${i===0?'↵':'⌘ '+(i+1)}</kbd></div>`).join('')}</div><div class="command-footer"><span>${esc(c.brand)}</span><span>Type an idea · choose an action</span></div></div>`;
const doc=()=>`<article class="document"><span class="inline-brand">${esc(c.brand)} / RESULT</span><h3>${esc(c.result)}</h3><div class="line"></div><div class="line" style="width:65%"></div>${c.features.map((f,i)=>`<div class="row motion" data-delay="${.15+i*.15}"><span class="accent">✓</span>${esc(f)}</div>`).join('')}</article>`;
function html(i){
 if(i===0)return intro(false);if(i===4)return intro(true);
 if(c.template==='minimal'){
  if(i===1)return `<div class="split"><div class="copy motion"><div class="eyebrow">${esc(c.category)}</div><h1 class="big" style="margin-top:28px">${esc(c.title)}</h1><p class="sub">${esc(c.description)}</p></div><div class="motion" data-delay=".15">${c.screenshots.length?`<div class="paper app">${screenshot(0)}</div>`:genericApp()}</div></div>`;
  if(i===2)return `${title(c.result)}<div class="product-large" id="camera">${c.screenshots.length?`<div class="paper app">${screenshot(1)}</div>`:genericApp()}</div>`;
  return title(c.tagline)+featureCards();
 }
 if(c.template==='window'){
  const text=[c.title,c.task,c.result][i-1];return `${title(text)}<div class="window-stage" id="camera">${c.screenshots.length?`<div class="paper app">${screenshot(i-1)}</div>`:desktop()}</div>`;
 }
 if(c.template==='command'){
  if(i===1)return title(c.title)+command();
  if(i===2)return `${title(c.result)}<div id="camera">${c.screenshots.length?`<div class="result-focus" style="padding:0;height:530px">${screenshot(1)}</div>`:`<div class="result-focus"><div class="checkmark">↗</div><h3>${esc(c.result)}</h3><p>${esc(c.task)}</p><span class="pill">${esc(c.features[0])}</span></div>`}</div>`;
  return title(c.tagline)+featureCards();
 }
 if(i===1)return `${title(c.title)}<div class="paperbits">${['Input','Ideas','Next steps'].map((s,j)=>`<article class="paperbit motion" data-delay="${j*.12}" style="transform:rotate(${[-4,2,-2][j]}deg)"><span class="inline-brand">${esc(s)}</span><h3>${esc(c.features[j])}</h3><p>${esc(c.description)}</p></article>`).join('')}</div>`;
 if(i===2)return `${title(c.task)}<div class="flowline"></div><div class="flowcards">${c.features.map((f,j)=>`<article class="flowcard motion" data-delay="${j*.25}"><span class="num">STEP 0${j+1}</span><h3>${esc(f)}</h3><p>${esc(c.featureDescriptions?.[j]??['Collect scattered inputs.','Give every step a clear order.','Turn ideas into deliverable work.'][j])}</p></article>`).join('')}</div>`;
 return `${title(c.result)}<div id="camera">${c.screenshots.length?`<div class="document" style="padding:0;height:580px">${screenshot(2)}</div>`:doc()}</div>`;
}
function fitText(){for(const e of stage.querySelectorAll('.big,.wordmark,.title-top,.feature h3,.flowcard h3,.tagline,.bubble,.result-focus h3')){let size=parseFloat(getComputedStyle(e).fontSize);for(let j=0;j<40&&(e.scrollWidth>e.clientWidth+2);j++){size*=.96;e.style.fontSize=size+'px';}}}
async function seek(t){
 if(!Number.isFinite(t))throw new Error('seek expects a finite number');
 time=clamp(t,0,c.duration-1/c.fps);let i=0,start=0;
 while(i<4&&time>=start+c.sceneDurations[i])start+=c.sceneDurations[i++];
 let local=time-start,d=c.sceneDurations[i];
 if(currentScene!==i){stage.innerHTML=`<div class="scene" id="scene">${meta(i)}${html(i)}</div>`;currentScene=i;await Promise.all(Array.from(stage.querySelectorAll("img")).map(im=>im.decode()));fitText();}
 for(const el of stage.querySelectorAll('.motion')){let delay=Number(el.dataset.delay||0),a=ease((local-delay)/.65);el.style.opacity=String(.08+.92*a);el.style.translate=`0 ${(1-a)*45}px`;}
 const cam=stage.querySelector('#camera');if(cam){let p=c.template==='window'&&i>1?1:ease(local/Math.min(d,1.2));cam.style.scale=String(c.template==='window'?.97+.03*p: .95+.05*p);cam.style.translate=`0 ${(1-p)*24}px`;cam.style.opacity=String(.15+.85*p);}
 const typed=stage.querySelector('#typed');if(typed){let chars=Array.from(c.task),count=Math.floor(chars.length*clamp(c.template==='window'&&i>1?1:local/(d*.38)));typed.textContent=chars.slice(0,count).join('')+(count<chars.length?'│':'');}
 for(const e of stage.querySelectorAll('[data-step]')){let step=Number(e.dataset.step),a=ease((local/d*.95-step*.13-.28)*7);if(c.template==='window'){if(i===1)a=0;else if(i===2&&step===3)a=0;else if(i===3)a=step===3?ease(local/.45):1;}e.style.opacity=String(.08+.92*a);e.style.translate=`0 ${(1-a)*12}px`;}
 // Deliberately hold the final readable state; no end fade or blank last frame.
 document.querySelector('#scrub').value=String(time);document.querySelector('#time').textContent=`${time.toFixed(2)} / ${c.duration.toFixed(2)}`;
 stage.dataset.scene=String(i);stage.dataset.frame=String(Math.round(time*c.fps));
 await new Promise(r=>requestAnimationFrame(()=>r()));
}
function resize(){if(!c)return;const vp=document.querySelector('#viewport');stage.style.transform=`scale(${Math.min(vp.clientWidth/c.width,vp.clientHeight/c.height)})`;}
window.video={ready:null,seek:async t=>{await window.video.ready;await seek(t)},get time(){return time},get config(){return c}};
window.video.ready=(async()=>{
 const response=await fetch('config.json');if(!response.ok)throw new Error('config.json is missing');c=await response.json();
 if(!['minimal','window','command','workflow'].includes(c.template))throw new Error('Unknown template');
 if(c.width!==1920||c.height!==1080)throw new Error('v1 composition is 1920×1080; re-layout before changing aspect ratio');
 if(!(c.duration>0&&c.fps>0)||c.sceneDurations?.length!==5||c.sceneDurations.some(x=>!Number.isFinite(x)||x<=0)||Math.abs(c.sceneDurations.reduce((a,b)=>a+b,0)-c.duration)>1e-6)throw new Error('Five positive sceneDurations must sum to duration');
 if(!c.brand||c.features?.length!==3)throw new Error('brand and exactly three features required');
 for(const path of [c.fontFile,c.logo,...c.screenshots.map(s=>s.file)].filter(Boolean)){if(/^(https?:|\/\/|data:)/i.test(path)||path.startsWith('/')||path.split('/').includes('..'))throw new Error('Assets must be local relative paths: '+path);}
 const font=new FontFace(c.fontFamily,`url("${c.fontFile}")`,{weight:'100 900'});await font.load();document.fonts.add(font);await document.fonts.ready;
 await Promise.all([c.logo,...c.screenshots.map(s=>s.file)].filter(Boolean).map(src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>im.decode().then(resolve,reject);im.onerror=()=>reject(new Error('Missing image: '+src));im.src=src;})));
 for(const [name,key] of Object.entries({accent:'accent',bg:'background',fg:'foreground',surface:'surface'})){if(!CSS.supports('color',c[key]))throw new Error('Invalid color: '+key);stage.style.setProperty('--'+name,c[key]);}
 stage.style.setProperty('--muted',`color-mix(in srgb,${c.foreground} 56%,${c.background})`);stage.style.setProperty('--line',`color-mix(in srgb,${c.foreground} 12%,${c.surface})`);
 stage.style.fontFamily=`"${c.fontFamily}",sans-serif`;document.querySelector('#scrub').max=String(c.duration-1/c.fps);resize();await seek(0);return true;
})();
window.video.ready.catch(e=>{const el=document.querySelector('#error');el.hidden=false;el.textContent=e.stack;});
const audio=new Audio('out/soundtrack.wav');audio.preload='none';
function toggle(){playing=!playing;document.querySelector('#play').textContent=playing?'Pause':'Play';if(playing){if(time>=c.duration-2/c.fps)time=0;origin=performance.now();playStart=time;audio.currentTime=time;audio.play().catch(()=>{});tick();}else audio.pause();}
async function tick(){if(!playing)return;let t=playStart+(performance.now()-origin)/1000;if(t>=c.duration){playing=false;document.querySelector('#play').textContent='Play';audio.pause();await seek(c.duration);return;}await seek(t);requestAnimationFrame(tick);}
function stop(){playing=false;audio.pause();document.querySelector('#play').textContent='Play';}
document.querySelector('#play').onclick=async()=>{await window.video.ready;toggle();};
for(const [id,delta] of [['back',-1],['next',1]])document.querySelector('#'+id).onclick=async()=>{await window.video.ready;stop();await seek(time+delta/c.fps);audio.currentTime=time;};
document.querySelector('#scrub').oninput=async e=>{await window.video.ready;stop();await seek(Number(e.target.value));audio.currentTime=time;};
window.addEventListener('resize',resize);window.addEventListener('keydown',async e=>{if(['Space','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();await window.video.ready;if(e.code==='Space')toggle();else{stop();await seek(time+(e.code==='ArrowRight'?1:-1)/c.fps);}}});
