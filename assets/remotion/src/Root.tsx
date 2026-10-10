import React from 'react';
import {Composition,useCurrentFrame,useVideoConfig} from 'remotion';
import config from '../config.json';
import {ShaderBackdrop} from './ShaderBackdrop';
import {Film, FilmProps} from './Film';
const Texture:React.FC<FilmProps>=({config:c})=>{const frame=useCurrentFrame(),{fps}=useVideoConfig();return <ShaderBackdrop frame={frame} fps={fps} accent={c.accent}/>};
export const Root: React.FC = () => <><Composition id="ProductFilm" component={Film} width={1920} height={1080} fps={60} durationInFrames={720} defaultProps={{config} as unknown as FilmProps} calculateMetadata={({props})=>({durationInFrames:Math.round(props.config.duration*props.config.fps),fps:props.config.fps,width:props.config.width,height:props.config.height})}/><Composition id="ShaderTexture" component={Texture} width={960} height={540} fps={60} durationInFrames={720} defaultProps={{config} as unknown as FilmProps} calculateMetadata={({props})=>({durationInFrames:Math.round(props.config.duration*props.config.fps),fps:props.config.fps})}/></>;
