// Pure frame-domain motion: actions may overlap without retaining playback state.
export const unit = x => Math.max(0, Math.min(1, x));
export function progress(frame, start, end) {
 if (!Number.isFinite(frame) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('Motion interval must be finite and increasing');
 const p=unit((frame-start)/(end-start)); return p*p*p*(p*(p*6-15)+10);
}
export const lerp=(a,b,p)=>a+(b-a)*p;
export function colorMix(a,b,p){const rgb=s=>s.replace('#','').match(/../g).map(v=>parseInt(v,16));return '#'+rgb(a).map((v,i)=>Math.round(lerp(v,rgb(b)[i],unit(p))).toString(16).padStart(2,'0')).join('');}
export function relayTimes(fps,events=[]){const at=(id,s)=>events.find(e=>e.id===id)?.frame??Math.round(s*fps);return {enter:at('enter',3.8),group:at('group',5.8),filter:at('filter',7.7),detail:at('detail',9.7),maker:at('maker',17.1),more:at('more',20.3),peak:at('peak',24.6),cta:at('cta',27.3)};}
export function palette(c){return {canvas:c.background,ink:c.foreground,surface:c.surface,accent:c.accent,secondary:c.architecture?.secondary??c.accent};}
