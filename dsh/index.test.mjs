import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Context} from '@deepseek-ai/cordis';
import {SkillRegistry} from '@deepseek-ai/dsh-skill';
import * as plugin from './index.mjs';
import {verifyRegistry} from './registry-check.mjs';

test('canonical skill metadata and instructions come from SKILL.md', async () => {
  const text = await fs.readFile(new URL('../SKILL.md', import.meta.url), 'utf8');
  const skill = plugin.parseSkill(text);
  assert.equal(skill.name, 'promotion');
  assert.match(skill.description, /editable product launch videos/);
  assert.match(skill.content, /scripts\/init\.py/);
  assert.ok(!skill.content.startsWith('---'));
  const translated = plugin.parseSkill('---\r\nname: promotion\r\ndescription: "\u89c6\u9891"\r\n---\r\n# \u521b\u4f5c\r\n');
  assert.equal(translated.description, '\u89c6\u9891');
  assert.equal(translated.content, '# \u521b\u4f5c\r\n');
});

test('invalid metadata and empty instructions fail with an actionable error', () => {
  for (const input of [
    '', '---\n- promotion\n---\nbody', '---\nname: [\n---\nbody',
    '---\nname: other\ndescription: valid\n---\nbody',
    '---\nname: promotion\ndescription: 42\n---\nbody',
    '---\nname: promotion\ndescription: " "\n---\nbody',
    '---\nname: promotion\ndescription: valid\n---\n  ',
  ]) assert.throws(() => plugin.parseSkill(input));
});

test('real registry loads, prioritizes and disposes the provider', async () => {
  await verifyRegistry({Context, SkillRegistry}, plugin);
});

test('package paths support spaces and Unicode; missing or invalid skills fail before registration', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'promotion \u6d4b\u8bd5 '));
  try {
    await fs.mkdir(path.join(temporary, 'dsh'));
    await fs.copyFile(new URL('./index.mjs', import.meta.url), path.join(temporary, 'dsh/index.mjs'));
    await fs.symlink(path.resolve('node_modules'), path.join(temporary, 'node_modules'), 'junction');
    const relocated = await import(pathToFileURL(path.join(temporary, 'dsh/index.mjs')).href);
    let registrations = 0;
    const fake = {skills: {registerProvider: () => { registrations++; }}};
    await assert.rejects(relocated.apply(fake), {message: 'Unable to load the bundled Promotion SKILL.md.'});
    await fs.writeFile(path.join(temporary, 'SKILL.md'), 'invalid');
    await assert.rejects(relocated.apply(fake), error => {
      assert.equal(error.cause.message, 'Promotion SKILL.md must have YAML frontmatter.');
      return true;
    });
    assert.equal(registrations, 0);
    await fs.copyFile(new URL('../SKILL.md', import.meta.url), path.join(temporary, 'SKILL.md'));
    for (const resource of ['scripts/init.py', 'assets/remotion/package.json', 'references/production.md']) {
      await fs.mkdir(path.dirname(path.join(temporary, resource)), {recursive: true});
      await fs.copyFile(new URL(`../${resource}`, import.meta.url), path.join(temporary, resource));
    }
    await verifyRegistry({Context, SkillRegistry}, relocated);
  } finally {
    await fs.rm(temporary, {recursive: true, force: true});
  }
});
