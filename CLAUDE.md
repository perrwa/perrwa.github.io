# CLAUDE.md

This file provides guidance to an Agent when working with code in this repository.

## Overview

Perry Wang's personal site (perrwa.github.io) — an Astro-based blog, deployed to GitHub Pages. Requires Node 22.12+.

## Commands

```sh
npm run dev            # dev server
npm run build           # production build (outputs to dist/)
npm run preview         # preview production build
npm run check           # astro check (type-checking)
npm run lint            # eslint .
npm run format          # prettier --write .
npm run format:check    # prettier --check .
npm test                # vitest run (whole suite)
npx vitest run tests/content.test.ts   # single test file
```

CI (`.github/workflows/ci.yml`) runs format:check, lint, check, build, and test on every PR — all must pass. `pr-title.yml` enforces conventional-commit PR titles (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`).

## Architecture

- **Content collections**: blog posts are markdown/MDX files under `src/content/blog/`, loaded via `glob()` and validated against the zod schema in `src/content.config.ts` (`title`, `description`, `pubDate`, optional `updatedDate`). New posts just need frontmatter matching that schema — no registration elsewhere is needed; `src/pages/index.astro` and `src/pages/blog/[...slug].astro` pick them up automatically via `getCollection('blog')`.
- **Routing**: `src/pages/blog/[...slug].astro` uses `getStaticPaths()` to statically render one page per collection entry, passing the entry's `data` as props into `src/layouts/BlogPost.astro`.
- **Site-wide constants** (title, description) live in `src/consts.ts` and are consumed by both pages and `src/pages/rss.xml.js`. `astro.config.mjs` holds the canonical `site` URL and font config (Source Serif 4 via Google Fonts, configured through Astro's built-in `fonts` API).
- **Tests** (`tests/*.test.ts`) run against the _built_ `dist/` output (they trigger `npm run build` if `dist/` isn't present), not against source directly. `tests/content.test.ts` re-implements a manual frontmatter parser and duplicates the zod schema from `content.config.ts` in a comment-documented way, since `astro:content` is a virtual module unavailable outside the Astro build — keep that schema copy in sync manually when `content.config.ts` changes. `tests/build.test.ts` also checks for dead internal links by scanning `href` attributes in the built homepage.
- Integrations enabled: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`.

### Gotchas

Astro 7 changed the default whitespace handling. `compressHTML` now defaults to `'jsx'`, so whitespace between inline elements gets stripped the same way JSX strips it, and `<span>hello</span><em>world</em>` renders as `helloworld` unless an explicit `{" "}` is added where the space needs to survive. Unclosed tags and invalid nesting fail the build now too; the compiler doesn't try to auto-correct them.

Run `npx astro sync` after editing `src/content.config.ts` or `astro.config.mjs` so `.astro/types.d.ts` regenerates. If the zod schema itself changes, update the duplicated copy in `tests/content.test.ts` as well, since that test can't import `astro:content` outside the Astro build.

## Style

- Prettier is the source of truth for formatting (`.prettierrc.mjs`): single quotes, semicolons, 100 print width, `prettier-plugin-astro` for `.astro` files. ESLint explicitly disables `astro/semi` since Prettier owns that.
- Keep new styling in the site's editorial serif register: high contrast, restrained motion. Generic sans-serif SaaS polish or heavy animation would break that.

## Related skills and tools

The `astro-site` skill covers Astro 7 conventions and gotchas; load it for component, content, routing, or config work. `make-interfaces-feel-better` covers detailed UI polish work, from border treatment to icon states, and wins if the two disagree on a styling question. For anything version-specific about the Astro API, check the `astro-docs` MCP server (`mcp__astro-docs__search_astro_docs`) instead of relying on memory.
