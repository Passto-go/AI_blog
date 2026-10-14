import { defineConfig } from 'astro/config';

// 把 site 改成你的个人域名（用于生成正确的 sitemap / RSS / canonical 链接）
export default defineConfig({
  site: 'https://your-domain.com',
  trailingSlash: 'ignore',
});
