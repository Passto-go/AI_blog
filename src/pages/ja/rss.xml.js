import rss from '@astrojs/rss';
import { getPosts } from '../../lib/posts.js';

export async function GET(context) {
  const posts = await getPosts('ja');
  return rss({
    title: '吾道一以贯之',
    description: '日常の雑記、ランニング、日々の気づき — 日本語 RSS フィード',
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: new Date(p.published_at),
      description: p.excerpt || '',
      link: `/ja/posts/${p.slug}/`,
    })),
  });
}
