import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { SITE_DESCRIPTION, SITE_TITLE } from '../src/consts';

// Mirrors the schema in src/content.config.ts. Kept in sync manually since
// astro:content is a virtual module only resolvable inside the Astro build,
// not in a plain Vitest/Node process.
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
});

const BLOG_DIR = join(import.meta.dirname, '../src/content/blog');

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter block found');
  const fields: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const lineMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    fields[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
  return fields;
}

describe('blog post frontmatter', () => {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  it('finds at least one post', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s matches the content schema', (file) => {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf-8');
    const fields = parseFrontmatter(raw);
    expect(() => blogSchema.parse(fields)).not.toThrow();
  });
});

describe('site consts', () => {
  it('SITE_TITLE and SITE_DESCRIPTION are non-empty', () => {
    expect(SITE_TITLE.length).toBeGreaterThan(0);
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });
});
