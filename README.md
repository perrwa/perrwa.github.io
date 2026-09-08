# perrwa.github.io

Personal site, built with [Astro](https://astro.build).

## Develop

Needs Node 22.12+.

```sh
npm install
npm run dev
```

## Checks

CI (`.github/workflows/ci.yml`) runs these on every PR:

|                        |                            |
| ---------------------- | -------------------------- |
| `npm run format:check` | Prettier (`format` to fix) |
| `npm run lint`         | ESLint                     |
| `npm run check`        | `astro check`              |
| `npm run build`        | Astro build                |
| `npm test`             | Vitest                     |

## New posts

Drop a markdown file into `src/content/blog/` with frontmatter:

```md
---
title: 'Post title'
description: 'One-line summary.'
pubDate: 2026-01-01
---

Post body here.
```

It shows up on the homepage automatically, newest first.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. PR titles must follow [conventional commits](https://www.conventionalcommits.org/) (enforced by `pr-title.yml`).
