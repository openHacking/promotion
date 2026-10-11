import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {validateConfig} from './config.mjs';
const root=process.cwd(),c=validateConfig(JSON.parse(fs.readFileSync('config.json')),root);const p=spawnSync('npx',['remotion','studio','src/index.ts'],{stdio:'inherit'});process.exit(p.status??1);
