---
name: astro-site
description: Astro 7 conventions for this site — content collections, component structure, styling, and version-specific gotchas. Use when adding or editing .astro components, blog content, routing, or astro.config.mjs.
---

# Astro site conventions

## Scope

This site is static-site-generated with no SSR adapter configured. Everything below assumes build-time rendering only — see **Out of scope** at the end for the features that require an adapter.

## Architecture

- Server-render by default; ship zero client JS unless a feature genuinely needs interactivity.
- Multi-page app, not single-page app — full navigations, not client-side routing.
- For a small enhancement, a plain `<script>` tag beats pulling in a UI framework.

## Content collections

Follow the existing pattern in `src/content.config.ts`: `glob()` loader, `z` imported from `astro/zod` (not `astro:content`), schema as a flat `z.object()`. Query with `getCollection()` / `getEntry()`. New blog posts are markdown/MDX files under `src/content/blog/` with frontmatter matching that schema — no registration elsewhere needed.

Run `npx astro sync` after changing `content.config.ts` or `astro.config.mjs` so `.astro/types.d.ts` regenerates. If you touch the zod schema, also update the duplicated copy in `tests/content.test.ts` (it can't import `astro:content` outside the Astro build).

## Components

`.astro` for static content, PascalCase filenames, frontmatter script above the template, typed `Props` interface (see `src/components/BaseHead.astro`). Write valid, fully-closed HTML — the compiler errors on unclosed tags and does not auto-correct invalid nesting (e.g. a block element inside `<p>`).

## Astro 7 gotchas

- **`compressHTML` defaults to `'jsx'`** as of v7.0 — whitespace between inline elements is stripped like JSX/React, not preserved like HTML. `<span>hello</span><em>world</em>` renders as `helloworld`. Add an explicit `{" "}` wherever a visible space between inline elements matters.
- The compiler errors on unclosed tags rather than auto-correcting them — a missing closing tag fails the build, it doesn't just render oddly.

## Styling

Scoped `<style>` blocks per component; shared tokens as CSS custom properties in `src/styles/global.css` (see `--accent`, `--gray`, etc.). Mobile-first.

- Prefer fluid type scales (`clamp()`) over fixed breakpoint jumps, but keep it restrained for an editorial/serif site — no `12vw` display type; body copy stays ≥16px.
- Animate only `transform` and `opacity`; avoid `width`, `height`, `top`, `margin` in transitions/keyframes (they trigger layout).
- Use `will-change` only on elements actively animating, and only for `transform`/`opacity`/`filter`; never `will-change: all`.
- Guard hover-only affordances with `@media (hover: hover) and (pointer: fine)` so touch devices don't get stuck hover states.
- Guard non-essential motion with `@media (prefers-reduced-motion: reduce)`.
- For any visual-polish detail (border radius, shadows, icons, hover/press states, animation timing), defer to the `make-interfaces-feel-better` skill — it's more specific and wins on conflict.

## Images

Use `astro:assets`' `<Image />` for content images (Sharp is the default service, no config needed for SSG). Always provide `alt`; lazy-load below-the-fold images.

## SEO

`src/components/BaseHead.astro` already owns canonical URL, OG/Twitter meta, sitemap link, and RSS link. Extend it rather than adding ad hoc per-page `<meta>` tags; add JSON-LD there too if it's ever needed.

## Out of scope until an SSR adapter is added

No adapter is configured, so don't reach for: Actions (`src/actions/`), Sessions (`Astro.session`), Server Islands (`server:defer`), API routes (`src/pages/api/`), or middleware. These all require on-demand rendering.

## Authority

For version-specific Astro API questions, check the `astro-docs` MCP server (`mcp__astro-docs__search_astro_docs`) rather than relying on training data — Astro's API surface moves fast across major versions.
