---
name: astro-site
description: How this site uses Astro 7 - content collections, components, styling conventions, and version-specific gotchas. Load for .astro components, blog content, routing, or config work.
---

# Astro site conventions

## Scope

This site builds with Astro's static output and no SSR adapter configured, so everything below assumes build-time rendering. The "Out of scope" section at the bottom lists what needs an adapter.

## Architecture

Server-render by default and ship no client JavaScript unless a feature actually needs interactivity. The site is a multi-page app with full navigations rather than client-side routing. When a page needs a small enhancement, reach for a plain script tag before pulling in a UI framework.

## Content collections

Follow the pattern already in `content.config.ts`. Loaders come from `glob()`, the schema's `z` import comes from `astro/zod` rather than `astro:content`, and the schema itself is a flat `z.object()`. Query collections with `getCollection()` or `getEntry()`. New blog posts are markdown or MDX files under `src/content/blog/` with frontmatter matching that schema; nothing else needs registering.

After changing `content.config.ts` or `astro.config.mjs`, run `npx astro sync` so `.astro/types.d.ts` regenerates. If the zod schema itself changes, also update the duplicated copy in `tests/content.test.ts`, since that test can't import `astro:content` outside the Astro build.

## Components

Write `.astro` files for static content, name them in PascalCase, and put the frontmatter script above the template with a typed `Props` interface, following the shape in `src/components/BaseHead.astro`. The compiler is strict about HTML validity. An unclosed tag or a block element nested inside a paragraph fails the build rather than rendering oddly.

## Astro 7 gotcha

`compressHTML` now defaults to `'jsx'`, so whitespace between inline elements gets stripped the same way JSX strips it. A `<span>` followed directly by an `<em>` will render with no space between them unless an explicit `{" "}` is added where the space needs to survive.

## Styling

Each component keeps its own scoped style block, and shared tokens like accent and gray colors live as CSS custom properties in `src/styles/global.css`. Write mobile-first.

For type, prefer a fluid `clamp()` scale over hard breakpoint jumps, but keep it restrained for an editorial, serif site. Display type should not reach anything like `12vw`, and body copy should stay at 16px or larger. Animate only `transform` and `opacity`, since properties that affect box size or position, such as `width` or `top`, trigger layout. Reserve `will-change` for elements that are actually animating, limit it to `transform`, `opacity`, or `filter`, and drop it once the animation ends. Hover-only affordances belong behind a hover-capable media query so touch devices don't get stuck in a hover state, and anything beyond minor motion belongs behind a reduced-motion query.

For anything more specific to visual polish, like border radius, shadows, icon states, or hover and press timing, defer to the `make-interfaces-feel-better` skill. It's more specific and wins if the two disagree.

## Images

Use `astro:assets`'s `Image` component for content images. Sharp is the default service and needs no configuration for a static build. Always provide `alt` text, and lazy-load anything below the fold.

## SEO

`BaseHead.astro` already owns the canonical URL, Open Graph and Twitter meta, the sitemap link, and the RSS link. Extend that component rather than adding page-specific meta tags, and put any future JSON-LD there too.

## Out of scope until an adapter exists

No SSR adapter is configured, so Actions, Sessions, Server Islands, API routes, and middleware are all off the table for now. Each of those needs on-demand rendering.

## Authority

For anything version-specific about the Astro API, check the `astro-docs` MCP server rather than relying on memory. The API surface has moved fast across major versions.
