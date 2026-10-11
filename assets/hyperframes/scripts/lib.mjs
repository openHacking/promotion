import fs from 'node:fs';
import {spawn} from 'node:child_process';
export const writeJSON=(file,v)=>fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n');
export function run(bin,args){return new Promise((resolve,reject)=>{const p=spawn(bin,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';p.stdout.on('data',b=>stdout+=b);p.stderr.on('data',b=>stderr+=b);p.on('error',reject);p.on('close',code=>code===0?resolve({stdout,stderr}):reject(new Error(stderr.slice(-3000))));});}
