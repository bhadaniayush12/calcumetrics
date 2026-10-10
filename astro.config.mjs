// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { LEGACY_REDIRECTS } from './src/lib/redirects.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://calcumetrics.com',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  redirects: LEGACY_REDIRECTS,
  vite: {
    plugins: [tailwindcss()]
  }
});