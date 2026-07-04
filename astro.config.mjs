import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  base: '/resumemaker-agent',
  server: { host: '0.0.0.0', port: 4321 },
  integrations: [tailwind({ applyBaseStyles: false })],
});