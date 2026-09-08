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

- Astro 7 defaults `compressHTML` to `'jsx'`: whitespace between inline elements is stripped like JSX, not preserved like HTML. Add explicit `{" "}` where a visible space matters.
- The Astro compiler errors on unclosed tags and does not auto-correct invalid nesting — a build failure, not a rendering quirk.
- Run `npx astro sync` after editing `src/content.config.ts` or `astro.config.mjs` to regenerate `.astro/types.d.ts`.
- Editing the zod schema in `content.config.ts` also requires updating the duplicated copy in `tests/content.test.ts` (see Architecture above).

## Style

- Prettier is the source of truth for formatting (`.prettierrc.mjs`): single quotes, semicolons, 100 print width, `prettier-plugin-astro` for `.astro` files. ESLint explicitly disables `astro/semi` since Prettier owns that.
- Visual direction: editorial serif typography, high contrast, restrained motion. Avoid drifting toward generic sans-serif SaaS styling or heavy animation.

## Agent harness

- `.claude/skills/astro-site/`: Astro 7 conventions and gotchas — load for component/content/routing/config work.
- `.claude/skills/make-interfaces-feel-better/`: UI polish details (borders, shadows, animation, icons) — takes precedence over `astro-site` on any styling conflict.
- `astro-docs` MCP server (`mcp__astro-docs__search_astro_docs`): prefer this over memory for version-specific Astro API questions.
