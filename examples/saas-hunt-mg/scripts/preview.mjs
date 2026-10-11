import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {validateConfig} from './config.mjs';
import {bakeShader} from './bake-shader.mjs';
const root=process.cwd(),c=validateConfig(JSON.parse(fs.readFileSync('config.json')),root);await bakeShader(root,c);const p=spawnSync('npx',['remotion','studio','src/index.ts'],{stdio:'inherit'});process.exit(p.status??1);
