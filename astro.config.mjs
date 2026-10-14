import { defineConfig } from 'astro/config';

  // 站点真实地址（用于生成正确的 sitemap / RSS / canonical 链接）
export default defineConfig({
  site: 'https://blog-via-ai.netlify.app',
  trailingSlash: 'ignore',
});
