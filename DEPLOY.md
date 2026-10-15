# 部署指南（Cloudflare Pages · SSR 动态模式）

> 站点为 Astro SSR：内容页（首页/文章/分类/归档/RSS/sitemap/搜索索引）每请求现查 Supabase，
> **后台发布文章后即时生效，无需重新构建**。读者始终只访问 Cloudflare，不直连 Supabase。
> 代码仓库：https://github.com/Passto-go/styleblog_V2.0 （分支 `main`）

## 一、为什么选 Cloudflare Pages

| | Netlify 免费版 | Cloudflare Pages 免费版 |
|---|---|---|
| 带宽 | 100 GB/月 | **无限** |
| 构建额度 | 300 分钟/月 | **500 次/月** |
| 免费子域名 | xxx.netlify.app | xxx.pages.dev |
| 自定义域名 | 免费 | 免费（SSL 自动） |

本站为 SSR 模式：**内容更新走 Supabase（零构建）**，只有改代码才需要构建部署，
500 次/月对个人博客绰绰有余；带宽无限，没有额度焦虑。

## 二、部署：Git 自动部署（唯一推荐路径）

> ⚠️ Cloudflare 的「直接上传（Direct Upload）」项目**创建后无法转为 Git 集成**。
> 本仓库为 SSR（依赖构建生成的 `_worker.js`），请务必用 Git 方式创建项目。

1. Cloudflare Dashboard → **Workers & Pages → Overview → Create application → Pages → Connect to Git**
2. 授权 GitHub，选择仓库 `Passto-go/styleblog_V2.0`，Production branch 选 `main`
3. 构建设置（Framework preset 选 **Astro** 后通常自动填好）：
   - Framework preset：**Astro**
   - Build command：**npm run build**
   - Build output directory：**dist**
   （适配器会在 `dist` 里生成 `_worker.js`，Pages 自动识别并以 Functions 运行）
4. **Environment variables**（Production 环境）添加：

   | 变量 | 值 | 必填 |
   |---|---|---|
   | `PUBLIC_SUPABASE_URL` | `https://wgqdqbstibhojmrfhtmg.supabase.co` | 是 |
   | `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` 那串 anon public key | 是 |
   | `PUBLIC_SITE_URL` | `https://<项目名>.pages.dev` | 建议 |
   | `NODE_VERSION` | `22` | 建议（仓库已有 `.nvmrc`，双保险） |

5. **Save and Deploy**，约 1–2 分钟得到 `https://mystyle.pages.dev`
6. 以后**只有改代码才需要 push**；发文不触发任何构建

### 兼容性标志（`wrangler.toml` 已带，无需手动配）

SSR 依赖 Node 兼容层，仓库根目录的 `wrangler.toml` 已写好：

```toml
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2025-07-18"
```

缺 `nodejs_compat` 时 Worker 里任何 Node 内建调用会直接 500。
**不要**加 `disable_nodejs_process_v2`：本地 wrangler 3.x 运行时不识别该标志会启动失败。

## 三、发布文章的完整流程（SSR 版）

1. 打开 `<域名>/login` 登录写作后台
2. 写/改文章 → 点「**发布并上线**」
3. 后台提示「已发布 ✓ 已即时生效」——**到此结束**，读者刷新即可看到

- 写库与上线合一：Supabase 是唯一事实源，不存在"库里改了、线上还是旧的"
- 改错别字同样即时生效
- 评论原本就是 realtime 动态，不受影响
- 下架文章同样即时（`published=false` 后下一请求即消失）

## 四、应急：直接上传（仅作备用，别当主路径）

1. 本地构建：`bash /workspace/build-and-package.sh`（或手动 `npm run build`）
2. Cloudflare → **Workers & Pages → Create → Pages → Upload assets** → 拖入解压出的 `dist`
3. `_worker.js` 随目录一起上传，SSR 可工作（拖拽支持 `_worker.js`，不支持 functions 目录编译，本仓库不涉及）

> ⚠️ 该方式创建的项目**以后无法转成 Git 集成**，且每次代码更新都要重新构建再拖。
> 只在 Cloudflare 账号刚注册、Git 授权还没就绪时应急用，用完尽快迁到 Git 路径（新建 Git 项目即可）。

## 五、自定义域名（eu.org 批下来后）

1. Pages 项目 → **Custom domains → Set up a custom domain** → 填 `mystyle.eu.org`
2. DNS 在 Cloudflare 则自动配置；在别处则加 `CNAME` 指向 `<项目名>.pages.dev`
3. SSL 自动签发
4. 把 `PUBLIC_SITE_URL` 改成 `https://mystyle.eu.org`，**重新部署一次**（RSS/sitemap/canonical 随之更新；文章内容不受影响）

## 六、上线后验证清单

- [ ] 首页 200，文章列表 = Supabase 已发布文章
- [ ] 后台发布一篇测试文章 → **不做任何部署操作**，刷新首页应立刻出现
- [ ] `/posts/<slug>/` 200；乱写的 slug 返回 404（带 404 页面内容）
- [ ] `/en/`、`/ja/` 正常，语言切换不 404
- [ ] `/rss.xml`、`/sitemap-index.xml` 域名正确；`/search-index.json` 能返回文章
- [ ] `/login` 能登录、粘贴图片上传正常；发布提示为「已即时生效」
- [ ] 文章页评论能加载、能发
- [ ] 深色模式、手机宽度正常；设计与此前静态版一致

## 七、常见问题与应对

| 现象 | 原因 | 处理 |
|---|---|---|
| 全站 500，日志提到 Node 内建模块 | 缺 nodejs_compat | `wrangler.toml` 已带；确认仓库根目录有该文件 |
| 本地 `wrangler pages dev` 起不来，报 No such compatibility flag | 加了新版才有的标志（如 disable_nodejs_process_v2） | 删掉它，只留 nodejs_compat |
| 文章发布了但页面没有 | 几乎不可能（无构建环节）；先确认 `published=true` | 访问 `/search-index.json` 看文章在不在 |
| 页面 404 但文章确实存在 | slug 输错 / 语言不匹配（`/en/posts/` 只列 en 文章） | 从列表页点进去，别手拼 URL |
| Supabase 临时故障 | 拉取失败会回退示例文章（保留的降级逻辑） | 站点不崩，恢复后自动正常 |
| Worker CPU 超限（免费 10ms/调用） | 超长文 marked 渲染耗时 | 当前文章量级远未触顶；真触顶再加边缘缓存 |
| 想给动态页加缓存 | 默认无缓存，发布零延迟 | 需要时在响应加 `s-maxage=60` 让边缘缓存 60 秒；个人博客当前没必要 |
