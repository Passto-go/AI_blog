# 个人生活随笔博客 · v1.1（ 中英双语）

技术栈：**Astro（纯静态） + Supabase（云端数据库）**。读者端为纯静态页面，国内外均可快速访问；文章写在 Supabase，构建时拉取生成静态页。

> **写作后台在 `/login`**：邮箱密码登录后即可在线撰写、发布文章（需先配置 Supabase，见下）。

---

## 一、本地预览（5 分钟跑起来）

```bash
cd life-blog-v1
npm install
npm run dev                 # 打开 http://localhost:4321
```

未配置 `.env` 时，站点会用 `src/data/sample.js` 的示例文章（含中英双语），照样能跑能构建。

---

## 二、配置 Supabase

1. 后台 → **SQL Editor** 执行 `supabase/schema.sql`（建表 + 权限 + 图床桶；已含 `lang / category / category_slug` 字段）。
2. 后台 → **Project Settings → API** 复制 `Project URL` 和 `anon public` key，填进 `.env`（复制 `.env.example`）：
   ```
   PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=xxxx
   ```
> `anon` key 本就可公开，前端使用安全；读受 RLS 限制，只对已发布文章开放。

---

## 三、如何写文章

三种方式，按习惯选：

- **方式 A（写作后台，推荐）**：打开 `<域名>/login`，用 Supabase 账号登录 → 写标题/正文 → 「发布并上线」。站点为 SSR 动态渲染，**发布即全站生效**，读者刷新即可看到，无需任何部署操作。
- **方式 B（Supabase 表）**：Supabase 后台 → **Table Editor → posts** 手动加一行：
  `title / slug / content(Markdown) / excerpt / lang('zh'|'en') / category / category_slug / published=true / published_at`，再触发一次部署。
- **方式 C（本地）**：直接编辑 `src/data/sample.js` 的示例数组，把内容换成你自己的，提交即更新。

> 图片：传到 Supabase Storage 的 `images` 桶，复制公开 URL 填到 `cover`。

---

## 四、页面与功能

| 路径 | 说明 |
|---|---|
| `/` | 中文首页（Hero + 最新随笔卡片） |
| `/en/` | 英文首页（中英切换见导航右上「EN / 中文」） |
| `/about/`、`/en/about/` | 关于 |
| `/categories/`、`/en/categories/` | 分类列表 |
| `/categories/<slug>/` | 单个分类下的文章 |
| `/archive/`、`/en/archive/` | 按时间归档 |
| `/search/`、`/en/search/` | 站内搜索（纯前端，读取 `/search-index.json`） |
| `/posts/<slug>/` | 单篇文章（Markdown 渲染） |
| `/rss.xml`、`/en/rss.xml` | RSS 订阅（中文 / 英文） |
| `/sitemap-index.xml` | 站点地图 |
| `/search-index.json` | 搜索索引（构建生成） |

顶部导航：**主页 / 分类 / 关于 / 归档 / EN（语言切换）**，右侧三个图标分别是 **RSS / 站点地图 / 搜索**。
底部栏：**主页 / 分类 / 关于 / 归档 / RSS** + 版权「YOUR NAME」+ *Licensed under CC BY-NC 4.0* + *Powered by Astro* + *Hosted by Cloudflare*。

---

## 五、发布到线上（零成本优先）

构建产物（含 SSR Worker）：
```bash
npm run build     # 生成 dist/（含 _worker.js）
```
站点为 **SSR 模式**：内容页每请求现查 Supabase，**发布文章无需重新构建**；只有改代码才需要构建部署。`dist/` 含 Cloudflare Worker 运行时（`_worker.js`），部署到 **Cloudflare Workers（Git 构建 / Workers Builds）**。

**方案 A（现在就用，¥0）：Cloudflare Workers 免费版（当前方案）**
1. 仓库已推到 GitHub（`Passto-go/styleblog_V2.0`），在 Cloudflare 关联它：**Workers & Pages → Create → Connect to Git**（选 **Workers**，不是 Pages）；框架选 **Astro**，构建命令 `npm run build`，输出目录 `dist`，Deploy command 自动为 `npx wrangler deploy`。
2. **Settings → Builds → Build environment variables** 添加 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` / `PUBLIC_SITE_URL` / `NODE_VERSION=22`（详见 `DEPLOY.md`）。
3. 绑域名：**Settings → Triggers → Custom Domains → Add Custom Domain** → 填你的域名 → DNS 加 `CNAME` 指向 `<项目名>.workers.dev`（免费 HTTPS）。
4. 以后发文：`/login` 发布 → **即时生效，无需任何部署操作**；只有改代码才需 push 触发重建。

> Cloudflare Workers 免费版**带宽无限 + 3,000 构建分钟/月 + 10 万请求/天**，没有 Netlify「300 分钟 + 100 GB」的额度焦虑。发文零构建，几乎用不完。
> 国内访问预期：Cloudflare 在大陆同样「能用但偏慢」。等每月有 ¥15 左右，可迁移到国内 CDN，代码一行不用改。

> ⚠️ 写作后台 `/login` 需要连通 Supabase；若你人在国内访问不畅，需在能联网的环境（代理）里登录写作。读者侧走 Cloudflare 边缘现查，不受影响。

---

## 六、目录结构

```
life-blog-v1/
├─ src/
│  ├─ i18n/ui.js          # 中英双语文案 + 路由辅助
│  ├─ data/site.js         # 站名 / 版权 / 外链配置
│  ├─ data/sample.js       # 无 Supabase 时的示例文章（双语）
│  ├─ lib/posts.js         # 构建时从 Supabase 拉文章 + 分类/归档
│  ├─ lib/format.js        # 日期/分组格式化
│  ├─ layouts/Base.astro   # 页面骨架（含头/尾、SEO、hreflang）
│  ├─ components/          # Header / Footer / PostCard / Icon / 各页面体
│  └─ pages/
│     ├─ index.astro about.astro archive.astro search.astro
│     ├─ categories/  posts/[slug].astro
│     ├─ rss.xml.js  sitemap-index.xml.js  search-index.json.js
│     └─ en/          # 全部页面的英文版（结构同中文）
├─ supabase/schema.sql     # 建表+权限+图床
├─ public/styles.css
├─ public/avatar.png       # 头像（放到 public/ 即自动启用）
├─ public/_headers         # 静态资源缓存头
├─ astro.config.mjs       # site 默认值；output:server + Cloudflare 适配器
├─ wrangler.toml          # Cloudflare Workers 配置（main + assets + nodejs_compat）
├─ .nvmrc                 # Node 22（Cloudflare 构建版本）
└─ .env.example           # 环境变量样例
```

> 改站点名 / 版权起始年 / 外链：编辑 `src/data/site.js`。
> 改导航或文案：编辑 `src/i18n/ui.js`（中英两栏）。
