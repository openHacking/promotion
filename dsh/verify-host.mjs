import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {verifyRegistry} from './registry-check.mjs';

// DSH_PACKAGE selects an isolated installed host, never the user's profile.
assert.ok(process.env.DSH_PACKAGE, 'Set DSH_PACKAGE to the installed @deepseek-ai/dsh/package.json.');
const hostManifest = path.resolve(process.env.DSH_PACKAGE);
const hostRequire = createRequire(hostManifest);
const host = JSON.parse(await fs.readFile(hostManifest, 'utf8'));
const {Context} = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/cordis')).href);
const {SkillRegistry, renderSkillContent} = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/dsh-skill')).href);
const bin = path.resolve(path.dirname(hostManifest), host.bin.dsh);
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'promotion dsh \u6d4b\u8bd5 '));
const env = {...process.env, DSH_HOME: path.join(temporary, 'home'), DSH_AGENTS_HOME: path.join(temporary, 'agents'), CI: 'true'};
function run(command, args, options = {}) {
  return execFileSync(command, args, {cwd: temporary, env, encoding: 'utf8', timeout: 180_000, maxBuffer: 8 * 1024 * 1024, ...options});
}
const cli = (...args) => run(process.execPath, [bin, ...args]);
try {
  const [packed] = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', temporary], {cwd: root}));
  const forbidden = /(^|\/)(node_modules|out|\.cache|\.internal|__pycache__|private-analysis|\.git|\.github|\.DS_Store|\._[^/]*|\.env[^/]*)(\/|$)|\.partial\.mp4$/;
  assert.deepEqual(packed.files.filter(file => forbidden.test(file.path)), []);
  const packedPaths = new Set(packed.files.map(file => file.path));
  for (const file of ['dsh/index.mjs', 'cordis.patch.yml', 'SKILL.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'assets/remotion/package-lock.json', 'assets/remotion/public/font.ttf', 'assets/music/energetic-electro.ogg']) {
    assert.ok(packedPaths.has(file), `Package is missing ${file}`);
  }
  const tarball = path.join(temporary, packed.filename);
  run('tar', ['-xzf', tarball, '-C', temporary]);
  const unpacked = path.join(temporary, 'package');
  const project = path.join(temporary, 'video project');
  run('python3', [path.join(unpacked, 'scripts/init.py'), project, '--template', 'minimal']);
  for (const file of ['package.json', 'src/Root.tsx', 'public/font.ttf', 'public/music/energetic-electro.ogg']) {
    await fs.access(path.join(project, file));
  }
  console.log(`Package verified: ${packed.files.length} files; Remotion initialization passed.`);

  cli('plugin', '--profile', 'promotion-test', 'add', tarball);
  const profile = path.join(env.DSH_HOME, 'profiles/promotion-test');
  const profileManifest = path.join(profile, 'package.json');
  let manifest = JSON.parse(await fs.readFile(profileManifest, 'utf8'));
  assert.ok(manifest.dsh.profile.bundles.includes('dsh-promotion'));
  assert.match(cli('--profile', 'promotion-test', '--dump-config'), /dsh-promotion/);
  const installed = createRequire(profileManifest).resolve('dsh-promotion');
  const plugin = await import(pathToFileURL(installed).href);
  await verifyRegistry({Context, SkillRegistry}, plugin);
  const ctx = new Context();
  const service = await ctx.plugin(SkillRegistry);
  const fiber = await ctx.plugin(plugin);
  try {
    const rendered = renderSkillContent(await ctx.skills.get('promotion'));
    assert.match(rendered, /<skill_content name="promotion">/);
    assert.match(rendered, /Base directory for this skill:/);
    assert.match(rendered, /scripts\/init\.py/);
  } finally {
    await fiber.dispose();
    await service.dispose();
  }
  cli('plugin', '--profile', 'promotion-test', 'remove', 'dsh-promotion');
  manifest = JSON.parse(await fs.readFile(profileManifest, 'utf8'));
  assert.ok(!manifest.dsh.profile.bundles.includes('dsh-promotion'));
  assert.ok(!manifest.dependencies?.['dsh-promotion']);
  assert.doesNotMatch(cli('--profile', 'promotion-test', '--dump-config'), /dsh-promotion/);
  cli('plugin', '--profile', 'promotion-test', 'add', root);
  assert.match(cli('--profile', 'promotion-test', '--dump-config'), /dsh-promotion/);
  cli('plugin', '--profile', 'promotion-test', 'remove', 'dsh-promotion');
  assert.doesNotMatch(cli('--profile', 'promotion-test', '--dump-config'), /dsh-promotion/);
  console.log(`DSH ${host.version}: tarball and checkout installation, config, skill loading, overrides, disposal and removal passed.`);
} finally {
  await fs.rm(temporary, {recursive: true, force: true});
}
