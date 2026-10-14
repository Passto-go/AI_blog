import { getAllPosts } from '../lib/posts.js';
import { formatDate } from '../lib/format.js';

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    content: p.content || '',
    category: p.category || '',
    lang: p.lang || 'zh',
    date: formatDate(p.published_at, p.lang || 'zh'),
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
