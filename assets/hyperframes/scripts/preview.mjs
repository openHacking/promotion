import {spawnSync} from 'node:child_process';
import {prepare} from './prepare.mjs';
await prepare();const r=spawnSync(process.execPath,['node_modules/hyperframes/bin/hyperframes.mjs','preview'],{stdio:'inherit',env:{...process.env,...(process.env.PROMOTION_BROWSER?{HYPERFRAMES_BROWSER_PATH:process.env.PROMOTION_BROWSER}:{})}});process.exitCode=r.status??1;
