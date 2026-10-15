import rss from '@astrojs/rss';
import { getPosts } from '../../lib/posts.js';

export async function GET(context) {
  const posts = await getPosts('en');
  return rss({
    title: '吾道一以贯之',
    description: 'Life notes, running and daily observations — English RSS feed',
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: new Date(p.published_at),
      description: p.excerpt || '',
      link: `/en/posts/${p.slug}/`,
    })),
  });
}
