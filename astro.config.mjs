import { defineConfig } from 'astro/config';

// 站点真实地址（用于生成正确的 sitemap / RSS / canonical 链接）
// 优先取构建环境变量 PUBLIC_SITE_URL（Netlify / Cloudflare Pages 后台均可配置），
// 未设置时回落到下方默认值。以后换域名只改变量、不用改代码。
// 例：PUBLIC_SITE_URL=https://mystyle.pages.dev
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://blog-via-ai.netlify.app',
  trailingSlash: 'ignore',
});
