import path from 'node:path';
import {serve} from './lib.mjs';
const root=path.resolve(process.argv[2]||'.'),port=Number(process.argv[3]||5199);
const s=await serve(root,port);console.log(s.url);process.on('SIGINT',async()=>{await s.close();process.exit(0)});
