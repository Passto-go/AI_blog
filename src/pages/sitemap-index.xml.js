import { getAllPosts } from '../lib/posts.js';

export async function GET(context) {
  const base = context.site || new URL('https://example.com');
  const staticPages = [
    '/', '/about/', '/categories/', '/archive/', '/search/',
    '/en/', '/en/about/', '/en/categories/', '/en/archive/', '/en/search/',
  ];
  const posts = await getAllPosts();
  const postUrls = posts.map((p) =>
    p.lang === 'en' ? `/en/posts/${p.slug}/` : `/posts/${p.slug}/`
  );
  const urls = [...staticPages, ...postUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u, base).href}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
