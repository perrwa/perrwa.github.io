import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { SITE_TITLE } from '../src/consts';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');

function distPath(...segments: string[]) {
  return join(DIST, ...segments);
}

// Resolve a same-site href (as it appears in built HTML) to a file under dist/.
function resolveHref(href: string): string | null {
  if (/^https?:\/\//.test(href) || href.startsWith('#')) return null; // external / anchor
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return distPath('index.html');
  if (/\.[a-z0-9]+$/i.test(clean)) return distPath(clean.replace(/^\//, ''));
  return distPath(clean.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

describe('production build', () => {
  beforeAll(() => {
    if (!existsSync(distPath('index.html'))) {
      execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
    }
  }, 60_000);

  it('emits the homepage with the site title', () => {
    const html = readFileSync(distPath('index.html'), 'utf-8');
    expect(html).toContain(SITE_TITLE);
  });

  it('emits the seed blog post page', () => {
    expect(existsSync(distPath('blog', 'hello-world', 'index.html'))).toBe(true);
  });

  it('emits an RSS feed containing the seed post', () => {
    const rss = readFileSync(distPath('rss.xml'), 'utf-8');
    expect(rss).toContain('Hello, world');
  });

  it('emits a sitemap', () => {
    expect(existsSync(distPath('sitemap-index.xml'))).toBe(true);
  });

  it('has no dead internal links on the homepage', () => {
    const html = readFileSync(distPath('index.html'), 'utf-8');
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);

    const broken: string[] = [];
    for (const href of hrefs) {
      const target = resolveHref(href);
      if (target && !existsSync(target)) broken.push(`${href} -> ${target}`);
    }
    expect(broken).toEqual([]);
  });
});
