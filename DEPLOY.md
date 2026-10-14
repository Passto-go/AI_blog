# 部署指南（Netlify · 推荐 Git 自动部署）

> 站点已用 Astro 静态构建，读者侧完全不连数据库，国内可正常访问。
> 代码已 `git init` 并提交，构建配置已写入 `netlify.toml`。

## 一、关于域名

**不买自己的域名也完全能上线**：Netlify 自动给免费子域名 `xxx.netlify.app`，立等可用、零费用、国内基本能打开。

「自定义域名」= 绑定你自己的域名（如 `xxx.com`）。需先去注册商买（几十元/年），在 Netlify 后台绑定**免费**，做一条 CNAME 解析即可，随时可加、不影响已有内容。
域名命名若想保持匿名，避免沿用任何实名账号用过的标识；并务必开启 **WHOIS 隐私保护**，否则注册人真实姓名/邮箱会公开。

## 二、推荐方案：Git 自动部署（push 即上线）

你已用拖文件夹方式上过一个站点，不用新建，**直接在现有站点连接 Git** 即可，地址不变：

1. 在 GitHub 新建一个**空仓库**（不要勾 README）
2. 把本仓库代码推上去（两种方式见下方）
3. 打开 Netlify 那个站点 → **Site settings → Build & deploy → Deploy contexts → Connect to Git**
   → 选 GitHub → 选这个仓库
4. 构建配置已在 `netlify.toml`（`npm run build` + 发布目录 `dist`，Node 18），保存后即自动构建一次
5. 以后 `git push` 就自动重新部署

### 把代码推到 GitHub 的两种方式

**方式 A（你本地操作，最稳）**
把 `/workspace/life-blog-v1` 整个文件夹下载到本地（仓库已含 `.git`），在本地执行：
```bash
cd life-blog-v1
git remote add origin https://github.com/你的名/仓库名.git
git branch -M main
git push -u origin main
```

**方式 B（我代你推，需授权）**
你生成一个 GitHub **Personal Access Token**（勾 `repo` 权限），把 token + 仓库 clone URL 发我，
我直接执行 `git remote add` + `git push` 推到你的仓库。

## 三、备选：拖文件夹（临时/一次性）

1. `npm install && npm run build` 生成 `dist/`
2. Netlify → **Add new project**（旧版叫 Add new site）→ **Deploy manually**
3. 把 `dist` 文件夹拖进虚线框，几秒得 `xxx.netlify.app`

> 缺点：每次改内容要重新 build 再拖。仅适合先看效果。

## 四、上线前需你填的两处

1. `astro.config.mjs` 的 `site`
   拿到地址（`xxx.netlify.app` 或自己的域名）后改成它，RSS / sitemap / canonical 链接才正确。
2. `src/data/site.js`
   - `countdown.target`：真实目标日期 + 标签
   - `socials`：GitHub / 邮箱 / RSS / 微信 / 抖音 链接

## 五、接入真实 Supabase（可选，发文用）

不配也能上线，默认用内置示例文章。要发真实文章：
1. Netlify 后台 → **Environment variables** 加 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`
2. 触发一次 Deploy
3. 访问 `/login` 写文章，保存后回 Netlify 点 Deploy 重新构建

> 读者访问纯静态不直连 Supabase；只有写文章后台 `/login` 才需要它（国内访问可能需代理）。
