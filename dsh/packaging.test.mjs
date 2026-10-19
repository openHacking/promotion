import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

test('package allowlist and nested ignores exclude local artifacts', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'promotion packaging '));
  try {
    await fs.copyFile(new URL('../package.json', import.meta.url), path.join(temporary, 'package.json'));
    const expected = ['assets/remotion/src/Root.tsx', 'examples/demo/public/font.ttf', 'SKILL.md', 'dsh/index.mjs', 'cordis.patch.yml'];
    const excluded = ['assets/remotion/node_modules/dep/index.js', 'assets/remotion/out/video.mp4', 'assets/remotion/.cache/frame.png', 'assets/remotion/.internal/soundtrack.wav', 'examples/demo/node_modules/dep/index.js', 'examples/demo/out/video.mp4', 'examples/demo/.env.local', 'examples/demo/._font.ttf', 'private-analysis/notes.md', 'scripts/__pycache__/init.pyc'];
    for (const file of [...expected, ...excluded]) {
      await fs.mkdir(path.dirname(path.join(temporary, file)), {recursive: true});
      await fs.writeFile(path.join(temporary, file), 'fixture');
    }
    for (const directory of ['assets', 'examples']) {
      await fs.copyFile(new URL(`../${directory}/.npmignore`, import.meta.url), path.join(temporary, directory, '.npmignore'));
    }
    const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {cwd: temporary, encoding: 'utf8'}));
    const files = new Set(packed.files.map(file => file.path));
    for (const file of expected) assert.ok(files.has(file), `Missing runtime resource: ${file}`);
    for (const file of excluded) assert.ok(!files.has(file), `Local artifact included: ${file}`);
  } finally {
    await fs.rm(temporary, {recursive: true, force: true});
  }
});
