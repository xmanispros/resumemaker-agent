import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const base = process.env.CF_PAGES ? '/' : '/resumemaker-agent';

export default defineConfig({
  output: 'static',
  base,
  server: { host: '0.0.0.0', port: 4321 },
  integrations: [tailwind({ applyBaseStyles: false })],
});