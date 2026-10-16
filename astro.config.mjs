import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { loadEnv } from 'vite';

// 站点真实地址（用于生成正确的 sitemap / RSS / canonical 链接）
// 注意：Astro 不会把 .env 自动注入 config 加载时的 process.env（只有 import.meta.env 能拿到），
// 必须用 Vite 的 loadEnv 显式读取；Cloudflare Git 构建等 CI 环境下构建变量在 process.env 里，两者都兜。
const fileEnv = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const SITE_URL = fileEnv.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://example.com';

export default defineConfig({
  site: SITE_URL,
  // SSR：内容页（首页/文章/分类/归档/RSS/sitemap/搜索索引）每请求现查 Supabase，
  // 后台发布文章后即时生效，无需重新构建。关于页/登录/404 仍预渲染为静态。
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  trailingSlash: 'ignore',
});
