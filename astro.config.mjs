import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// 站点真实地址（用于生成正确的 sitemap / RSS / canonical 链接）
// 优先取构建环境变量 PUBLIC_SITE_URL，未设置时回落到默认值。
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://blog-via-ai.netlify.app',
  // SSR：内容页（首页/文章/分类/归档/RSS/sitemap/搜索索引）每请求现查 Supabase，
  // 后台发布文章后即时生效，无需重新构建。关于页/登录/404 仍预渲染为静态。
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  trailingSlash: 'ignore',
});
