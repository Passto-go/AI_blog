import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts.js';

export async function GET(context) {
  const posts = await getPosts('zh');
  return rss({
    title: '皮蛋solo粥',
    description: '生活随笔、跑步与日常观察 — 中文 RSS 订阅',
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: new Date(p.published_at),
      description: p.excerpt || '',
      link: `/posts/${p.slug}/`,
    })),
  });
}
