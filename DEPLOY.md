# 部署指南（Cloudflare Pages · 推荐 Git 自动部署）

> 站点为 Astro 纯静态构建，读者侧不连数据库，国内外均可访问。
> 代码仓库：https://github.com/Passto-go/styleblog_V2.0 （分支 `main`）

## 一、为什么从 Netlify 迁到 Cloudflare Pages

| | Netlify 免费版 | Cloudflare Pages 免费版 |
|---|---|---|
| 带宽 | 100 GB/月 | **无限** |
| 构建额度 | 300 分钟/月 | **500 次/月** |
| 免费子域名 | xxx.netlify.app | xxx.pages.dev |
| 自定义域名 | 免费 | 免费（SSL 自动） |
| Deploy Hook（发布后一键重建） | 支持 | 支持 |

本站全部产物约 50+ 个文件、1 MB 上下，远低于「20,000 文件 / 单文件 25 MiB」的上限；带宽无限意味着不再有「额度焦虑」。Netlify 站点过渡期保留不动，两个地址都能访问，内容以最新一次部署为准。

## 二、推荐：Git 自动部署（push 即上线）

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages → Overview → Create application → Pages → Connect to Git**
2. 授权 GitHub，选择仓库 `Passto-go/styleblog_V2.0`，Production branch 选 `main`
3. 构建设置（Framework preset 选 **Astro** 后通常自动填好）：
   - Framework preset：**Astro**
   - Build command：**npm run build**
   - Build output directory：**dist**
4. **Environment variables**（Production 环境）添加：

   | 变量 | 值 | 说明 |
   |---|---|---|
   | `PUBLIC_SUPABASE_URL` | `https://wgqdqbstibhojmrfhtmg.supabase.co` | 必填，构建时拉线上文章 |
   | `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` 开头的那串 anon public key | 必填，与 Netlify 后台已填的同一串 |
   | `PUBLIC_SITE_URL` | `https://<项目名>.pages.dev` | 建议填，sitemap/RSS/canonical 地址才正确 |
   | `NODE_VERSION` | `22` | 建议填（仓库已有 `.nvmrc`，双保险） |
   | `PUBLIC_BUILD_HOOK` | 见下方「创建 Deploy Hook」 | 可选，配了才有一键上线 |

   > anon key 本就设计为可公开（已烘进线上 JS），安全靠 RLS：未登录只能读已发布文章。
5. 点 **Save and Deploy**，等约 1–2 分钟，得到 `https://<项目名>.pages.dev`
6. 以后每次 `git push` 到 main 自动重新构建部署；每个 PR 还会自动生成预览部署

### 创建 Deploy Hook（可选，配 PUBLIC_BUILD_HOOK 用）

项目 → **Settings → Builds & deployments → Deploy hooks → Add deploy hook**（旧界面叫 Builds → Add deploy hook）：

- 名称随意（如 `blog-publish`），**Branch to build 选 `main`**
- 复制形如 `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxx` 的 URL
- 填进上面的 `PUBLIC_BUILD_HOOK` 环境变量，**重新部署一次**（环境变量要构建时才生效）
- 之后在 `/login` 后台点「发布并上线」即自动触发一次重建，约 1 分钟全站生效

> Deploy Hook URL 无需鉴权即有效，等同密码：不要提交进仓库、不要外发。

## 三、备选：直接上传（不接 GitHub，像当年 Netlify 拖文件夹）

适合先看效果、或暂不想授权 GitHub：

1. 本地构建并打包（或直接用我已打好的 `blog-dist-*.zip`，解压即 `dist`）：
   ```bash
   PUBLIC_SITE_URL=https://<项目名>.pages.dev \
   PUBLIC_SUPABASE_URL=https://wgqdqbstibhojmrfhtmg.supabase.co \
   PUBLIC_SUPABASE_ANON_KEY=eyJ... \
   npm run build
   ```
2. Cloudflare → **Workers & Pages → Create → Pages → Upload assets**，把 `dist` 文件夹拖进去
3. 上传部署同样**不消耗构建次数、不限带宽**
4. 缺点：每次更新都要重新 build 再拖；且此路与 Git 部署是两套入口，长期只用这一条的话，Git 那边的自动部署就不会被触发

> 建议：先上传看效果，确认没问题后再接 Git 作为唯一入口。

## 四、自定义域名（eu.org 批下来后）

1. Pages 项目 → **Custom domains → Set up a custom domain** → 填 `mystyle.eu.org`
2. 解析（二选一，按你域名 DNS 在哪）：
   - DNS 在 Cloudflare：自动配置，无需手工加记录
   - 在别处（注册商 / Netlify DNS）：加 `CNAME`，主机记录 `mystyle`（或 `@`）指向 `<项目名>.pages.dev`
3. SSL 证书自动签发
4. 最后把环境变量 `PUBLIC_SITE_URL` 改成 `https://mystyle.eu.org` 并重新部署一次，RSS / sitemap / canonical 随之更新

## 五、上线后验证清单

- [ ] 首页 200，文章列表与 Supabase 已发布文章一致（含《在陪伴学生成长中遇见更好的自己》）
- [ ] `/en/`、`/ja/` 英文/日文版正常，语言切换不 404
- [ ] `/login` 能登录，草稿保存 / 发布 / 粘贴图片上传正常
- [ ] `/rss.xml`、`/sitemap-index.xml` 里的域名是 `pages.dev`（或你的自定义域名）
- [ ] 文章页评论能加载、能发（评论按页面路径绑定，换域名不影响）
- [ ] 深色模式、手机宽度（约 375px）显示正常
- [ ] Deployments 列表能看到本次部署，Source 列显示 Git push / Deploy hook / 上传

## 六、常见问题与应对

| 现象 | 原因 | 处理 |
|---|---|---|
| 构建在安装依赖阶段就失败，提示 Node 版本 | 构建镜像默认 Node 太低 | 仓库已带 `.nvmrc`(22)；再在后台环境变量加 `NODE_VERSION=22`，然后 Retry deployment |
| 首页还是旧文章 / 只有示例文章 | 构建时没拉到 Supabase | 检查后台 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` 是否加在 **Production** 环境；改完要重新部署才生效 |
| 后台提示「未检测到 Supabase 配置」 | 同上 | 同上；这两个值是构建时烘进静态文件的，不是运行时读取 |
| 发布后站点没更新 | 静态站两段式：写库 ≠ 上线 | 配 Deploy Hook 自动触发；或手动 Deployments → Retry / 重新部署 |
| 某些路径 404 但本地正常 | 尾斜杠 / 重定向差异 | 本站 `trailingSlash: 'ignore'`，一般无此问题；真遇到再加 `public/_redirects` |
| 文件数超限 | 超过 20,000 文件 | 本站约 50+ 个，无需担心 |
| Netlify 那边还能访问吗 | 能 | 不断链、不删站点，过渡期两地址并存；以最新部署方的内容为准 |
| 评论数对不上 | 评论按 `page` 路径绑定 | 换域名不影响旧评论；只有页面路径变了才会分开计 |
