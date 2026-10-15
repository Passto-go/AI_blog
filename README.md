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

- **方式 A（写作后台，推荐）**：打开 `<域名>/login`，用 Supabase 账号登录 → 写标题/正文 → 「发布并上线」。发布只是写进 Supabase，**全站更新还需一次部署**（配了部署钩子则后台自动触发，否则手动到 Cloudflare 点一次部署）。
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

构建出纯静态文件：
```bash
npm run build     # 生成 dist/
```
`dist/` 是纯静态站点，传到任何静态托管都行。**以下方案都不花钱（仅域名续费另算）。**

**方案 A（现在就用，¥0）：Cloudflare Pages 免费版（当前方案）**
1. 仓库已推到 GitHub（`Passto-go/styleblog_V2.0`），在 Cloudflare 关联它：**Workers & Pages → Create → Pages → Connect to Git**；框架选 **Astro**，构建命令 `npm run build`，输出目录 `dist`。
2. **Settings → Environment variables** 添加 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` / `PUBLIC_SITE_URL`（详见 `DEPLOY.md`）。
3. 绑域名：**Custom domains → Set up a custom domain** → 填你的域名 → DNS 加 `CNAME` 指向 `<项目名>.pages.dev`（免费 HTTPS）。
4. 以后发文：`/login` 发布 → 配了 Deploy Hook 就自动上线，否则回 Cloudflare 点一次部署。

> Cloudflare Pages 免费版**带宽无限 + 500 次构建/月**，没有 Netlify「300 分钟 + 100 GB」的额度焦虑。
> 国内访问预期：Cloudflare 在大陆同样「能用但偏慢」。等每月有 ¥15 左右，把 `dist/` 传到腾讯云 COS+CDN 即变快，代码一行不用改。

> ⚠️ 写作后台 `/login` 需要连通 Supabase；若你人在国内访问不畅，需在能联网的环境（代理）里登录写作。读者侧纯静态不受影响。

**方案 B（备选）：直接上传 dist**
Cloudflare → **Workers & Pages → Create → Pages → Upload assets**，拖入本地构建出的 `dist` 文件夹即可，同样不花构建额度。适合先看效果。

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
├─ public/_headers         # 缓存头（Cloudflare/Netlify 通用）
├─ astro.config.mjs       # site 默认值，可用 PUBLIC_SITE_URL 环境变量覆盖
├─ .nvmrc                 # Node 22（Cloudflare Pages 构建版本）
└─ netlify.toml           # Netlify 构建配置（过渡期保留，Cloudflare 忽略此文件）
```

> 改站点名 / 版权起始年 / 外链：编辑 `src/data/site.js`。
> 改导航或文案：编辑 `src/i18n/ui.js`（中英两栏）。
