import React from 'react';
import {Composition,registerRoot,useCurrentFrame} from 'remotion';
import {MGSystem,SYSTEM_RECIPES} from './MGSystem';
const Study:React.FC=()=>{const f=useCurrentFrame(),index=Math.floor(f/360),recipe=SYSTEM_RECIPES[index%8],replacement=index>=8;return <><style>{`@font-face{font-family:VideoSans;src:url(/public/font.ttf)}`}</style><div style={{fontFamily:'VideoSans'}}><MGSystem spec={{recipe,headline:replacement?'A different product, same mechanism.':'Make the relationship visible.',items:replacement?['Sketch','Build','Measure','Publish']:['Discover','Category','Product','Maker'],selected:1}} frame={f%360} fps={60} accent={replacement?'#81d6c2':'#ff784f'}/></div></>};
registerRoot(()=> <Composition id="RecipeStudies" component={Study} width={1920} height={1080} fps={60} durationInFrames={5760}/>);
