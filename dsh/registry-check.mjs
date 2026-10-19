import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

/** Exercise the real host registry without starting a model or a server. */
export async function verifyRegistry({Context, SkillRegistry}, plugin) {
  const ctx = new Context();
  const service = await ctx.plugin(SkillRegistry);
  let fiber;
  let overrides;
  try {
    fiber = await ctx.plugin(plugin);
    const catalog = await ctx.skills.list();
    assert.equal(catalog.length, 1);
    assert.equal(catalog[0].name, 'promotion');
    const skill = await ctx.skills.get('promotion');
    assert.ok(skill);
    assert.equal(skill.source, 'bundled');
    assert.equal(skill.provider, 'promotion');
    assert.deepEqual(skill.invocation, {modelInvocable: true, userInvocable: true});
    assert.equal(skill.resourceBase.kind, 'directory');
    assert.ok(path.isAbsolute(skill.resourceBase.path));
    assert.equal(skill.path, path.join(skill.resourceBase.path, 'SKILL.md'));
    const original = await fs.readFile(skill.path, 'utf8');
    assert.equal(skill.content, plugin.parseSkill(original).content);
    for (const resource of ['scripts/init.py', 'assets/remotion/package.json', 'references/production.md']) {
      await fs.access(path.join(skill.resourceBase.path, resource));
    }
    // A user contribution and a project contribution must each beat the bundle.
    for (const [source, rank] of [['user-dsh', 400], ['project-dsh', 100]]) {
      overrides = await ctx.plugin({
        name: `override-${source}`,
        inject: ['skills'],
        apply(overrideCtx) {
          const definition = {...skill, source, provider: source, content: source};
          overrideCtx.skills.registerProvider(() => ({
            name: source,
            async list() { return [{...definition, rank, locator: source}]; },
            async get() { return definition; },
          }));
        },
      });
      assert.equal((await ctx.skills.get('promotion')).content, source);
      await overrides.dispose();
      assert.equal((await ctx.skills.get('promotion')).provider, 'promotion');
    }
    await fiber.dispose();
    assert.deepEqual(await ctx.skills.list(), []);
    assert.equal(await ctx.skills.get('promotion'), undefined);
    // Re-enabling must not leave a duplicate provider from the previous mount.
    fiber = await ctx.plugin(plugin);
    assert.equal((await ctx.skills.list()).length, 1);
  } finally {
    await overrides?.dispose();
    await fiber?.dispose();
    await service.dispose();
  }
}
