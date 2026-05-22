// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://factu.guide',
  integrations: [preact(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
