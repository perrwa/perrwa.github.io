// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://perrwa.github.io',
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Joan',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['Charter', 'Georgia', 'serif'],
    },
  ],
});
