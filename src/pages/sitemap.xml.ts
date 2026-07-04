import type { APIRoute } from 'astro';

const siteUrl = 'https://xmanispros.github.io/resumemaker-agent';

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/templates', priority: '0.9' },
  { path: '/builder', priority: '0.9' },
  { path: '/about', priority: '0.7' },
  { path: '/faq', priority: '0.8' },
  { path: '/download', priority: '0.5' },
  { path: '/contact', priority: '0.4' },
  { path: '/privacy-policy', priority: '0.2' },
  { path: '/terms-and-conditions', priority: '0.2' },
  { path: '/disclaimer', priority: '0.2' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
