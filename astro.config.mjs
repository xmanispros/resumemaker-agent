import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isProd = process.env.DEPLOY === 'true';

export default defineConfig({
  output: 'static',
  base: isProd ? '/resumemaker-agent' : '',
  server: { host: '0.0.0.0', port: 4321 },
  integrations: [tailwind({ applyBaseStyles: false })],
});