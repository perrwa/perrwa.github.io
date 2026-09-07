# perrwa.github.io

Personal site, built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev
```

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

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
