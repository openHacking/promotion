import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const c=JSON.parse(fs.readFileSync('config.json')),file=process.argv[2]??'out/video.mp4';
const p=JSON.parse(execFileSync('ffprobe',['-v','error','-count_frames','-show_streams','-of','json',file])),v=p.streams.find(s=>s.codec_type==='video');
const checks={resolution:v.width===c.width&&v.height===c.height,frames:Number(v.nb_read_frames)===Math.round(c.duration*c.fps),fps:v.avg_frame_rate==='60/1',audioPresence:c.audio?!!p.streams.find(s=>s.codec_type==='audio'):!p.streams.find(s=>s.codec_type==='audio'),duration:Math.abs(Number(v.duration)-c.duration)<1/c.fps};
fs.writeFileSync('out/check.json',JSON.stringify({checks,decodedFrames:Number(v.nb_read_frames),listening:'not-performed'},null,2));console.log(checks);if(Object.values(checks).some(v=>!v))process.exitCode=1;
