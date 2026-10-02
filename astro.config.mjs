// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://calcumetrics.com',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  redirects: {
    '/privacy': '/privacy-policy'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});