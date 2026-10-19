import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {load} from 'js-yaml';

export const name = 'promotion';
export const inject = ['skills'];

const root = fileURLToPath(new URL('../', import.meta.url));
const skillPath = fileURLToPath(new URL('../SKILL.md', import.meta.url));

/**
 * Parse the canonical skill, keeping instructions and metadata in one place.
 * @param {string} text
 * @returns {{name: string, description: string, content: string}}
 */
export function parseSkill(text) {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error('Promotion SKILL.md must have YAML frontmatter.');
  const metadata = load(match[1]);
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('Promotion SKILL.md frontmatter must be an object.');
  }
  const fields = /** @type {Record<string, unknown>} */ (metadata);
  if (fields.name !== 'promotion' || typeof fields.description !== 'string' || !fields.description.trim()) {
    throw new Error('Promotion SKILL.md requires name: promotion and a non-empty description.');
  }
  if (!match[2].trim()) throw new Error('Promotion SKILL.md must contain instructions.');
  return {name: fields.name, description: fields.description, content: match[2]};
}

/** @param {import('@deepseek-ai/cordis').Context} ctx */
export async function apply(ctx) {
  let skill;
  try {
    skill = parseSkill(await readFile(skillPath, 'utf8'));
  } catch (cause) {
    throw new Error('Unable to load the bundled Promotion SKILL.md.', {cause});
  }
  /** @type {import('@deepseek-ai/dsh-skill').SkillDefinition} */
  const definition = {
    ...skill,
    source: 'bundled',
    provider: 'promotion',
    invocation: {modelInvocable: true, userInvocable: true},
    path: skillPath,
    resourceBase: {kind: 'directory', path: root},
  };
  ctx.skills.registerProvider(() => ({
    name: 'promotion',
    async list() {
      return [{...definition, rank: 600, locator: skillPath}];
    },
    async get(candidate) {
      return candidate.locator === skillPath ? definition : undefined;
    },
  }));
}
