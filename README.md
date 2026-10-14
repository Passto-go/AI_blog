# 个人生活随笔博客 · v1.1（ 中英双语）

技术栈：**Astro（纯静态） + Supabase（云端数据库）**。读者端为纯静态页面，国内外均可快速访问；文章写在 Supabase，构建时拉取生成静态页。

> **写作后台已按需求关闭**：站点不再提供 `/admin` 页面。发布文章请见下方「如何写文章」。

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

## 三、如何写文章（无需后台、不碰代码）

写作后台已关闭，但**你仍可以零代码发文**，二选一：

- **方式 A（云端，推荐）**：打开 Supabase 后台 → **Table Editor → posts**，手动加一行：
  `title / slug / content(Markdown) / excerpt / lang('zh'|'en') / category / category_slug / published=true / published_at`。保存后重新构建，文章即上线。
- **方式 B（本地）**：直接编辑 `src/data/sample.js` 的示例数组，把内容换成你自己的，提交即更新。

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
底部栏：**主页 / 分类 / 关于 / 归档 / RSS** + 版权「皮蛋solo粥」+ *Licensed under CC BY-NC 4.0* + *Powered by Astro* + *Hosted by Netlify*。

---

## 五、发布到线上（零成本优先）

构建出纯静态文件：
```bash
npm run build     # 生成 dist/
```
`dist/` 是纯静态站点，传到任何静态托管都行。**以下方案都不花钱（仅域名续费另算）。**

**方案 A（现在就用，¥0）：Netlify 免费版（你选定的方案）**
1. 把仓库推到 GitHub，在 Netlify 关联仓库；构建命令 `npm run build`，发布目录 `dist`。
2. **Site settings → Environment variables** 添加 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`。
3. 绑域名：**Domain settings → Add custom domain** → 填你的个人域名 → DNS 的 CNAME 指向 Netlify 给的地址（免费 HTTPS）。
4. 以后发文：Supabase 表加一行 → 回 Netlify 点 “Deploy” 重新构建（或用 Build Hook 自动触发）。

> 国内访问预期：Netlify 免费版在大陆通常「能用但偏慢」。等每月有 ¥15 左右，把 `dist/` 传到腾讯云 COS+CDN 即变快，代码一行不用改。

> ⚠️ 写作时 `/admin` 已不存在；若你人在国内、登录 Supabase 后台不便，可在能联网时操作，或以后让我把写作端换成免费国产 CloudBase。

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
├─ astro.config.mjs       # 记得把 site 改成你的域名
└─ netlify.toml
```

> 改站点名 / 版权起始年 / 外链：编辑 `src/data/site.js`。
> 改导航或文案：编辑 `src/i18n/ui.js`（中英两栏）。
