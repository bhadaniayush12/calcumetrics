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
    '/privacy': '/privacy-policy',
    '/ppf-calculator': '/in/ppf-calculator',
    '/401k-calculator': '/us/401k-calculator',
    '/income-tax-calculator': '/in/income-tax-calculator',
    '/gst-calculator': '/in/gst-calculator',
    '/hra-calculator': '/in/hra-calculator',
    '/upi-mdr-calculator': '/in/upi-mdr-calculator',
    '/tds-calculator': '/in/tds-calculator',
    '/capital-gains-tax-calculator': '/in/capital-gains-tax-calculator',
    '/advance-tax-calculator': '/in/advance-tax-calculator',
    '/salary-ctc-calculator': '/in/salary-ctc-calculator',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});