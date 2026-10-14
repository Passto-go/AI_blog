// 未配置 Supabase 时的本地示例数据，仅用于本地预览/构建验证。
// 字段：slug / title / excerpt / content(Markdown) / cover / category / categorySlug / lang / published / published_at
export const samplePosts = [
  // ---------- 中文 ----------
  {
    slug: 'hello',
    title: '开博第一篇',
    excerpt: '记录生活的随笔，从这里开始。',
    content:
      '# 开博第一篇\n\n这是一篇示例文章。在 `.env` 配置好 Supabase 后，这里会显示后台写的真实内容。\n\n## 为什么建这个博客\n\n失业之后，我想找一个不依赖平台、完全属于自己的地方，慢慢写点真实的东西。\n\n## 内容会怎么更新\n\n- 支持 **Markdown** 语法\n- 支持列表\n- 支持[链接](https://astro.build)\n\n### 关于纯静态\n\n> 读者端是纯静态页面，国内外都能快速访问。\n\n### 关于写作后台\n\n登录后即可在线发布，保存后重新构建一次即可对读者生效。',
    cover: '',
    category: '随笔',
    categorySlug: 'essays',
    lang: 'zh',
    published: true,
    published_at: '2026-10-14T09:00:00+08:00',
  },
  {
    slug: 'why-i-run',
    title: '跑步五年，我为什么还在跑',
    excerpt: '不是为了成绩，是为了每天有一段只属于自己的时间。',
    content:
      '# 跑步五年，我为什么还在跑\n\n刚开始跑步的时候，我总想着配速、里程、PB。后来发现，**跑量从来不是重点**。\n\n真正让我留下来的，是那一个小时里没人打扰的安静。\n\n- 五公里，不多不少\n- 不戴耳机，听听呼吸\n- 跑完洗个澡，一天才算开始\n\n如果你也在犹豫要不要开始跑，我的建议是：**先别买装备，穿上鞋出门走十分钟**。',
    cover: '',
    category: '跑步',
    categorySlug: 'running',
    lang: 'zh',
    published: true,
    published_at: '2026-10-10T20:30:00+08:00',
  },
  {
    slug: 'living-alone',
    title: '独居的第三年',
    excerpt: '一个人住久了，会和沉默成为朋友。',
    content:
      '# 独居的第三年\n\n一个人住到第三年，很多事都变成了习惯。\n\n回家开灯，做饭只做一份，周末可以一整天不说话。\n\n> 孤独和自在，其实是同一件事的两面。\n\n我不再急着向别人证明什么，只想把日子过得安静一点、真实一点。',
    cover: '',
    category: '独居',
    categorySlug: 'solo-living',
    lang: 'zh',
    published: true,
    published_at: '2026-10-05T21:00:00+08:00',
  },
  {
    slug: 'about-this-blog',
    title: '关于这个博客',
    excerpt: '为什么建它，以及它怎么工作。',
    content:
      '# 关于这个博客\n\n我用 Astro 生成纯静态页面，文章存在 Supabase 云端数据库，发布后重新构建一次，内容就更新到线上了。\n\n整个过程不需要服务器，也不需要改代码。',
    cover: '',
    category: '随笔',
    categorySlug: 'essays',
    lang: 'zh',
    published: true,
    published_at: '2026-09-28T10:00:00+08:00',
  },

  // ---------- English ----------
  {
    slug: 'hello-en',
    title: 'Hello, World',
    excerpt: 'The first note — where it all begins.',
    content:
      '# Hello, World\n\nThis is a sample post. Once `.env` is configured with Supabase, your real posts will show up here.\n\n## Why build this blog\n\nAfter being laid off, I wanted a place of my own — not tied to any platform — to write something real, slowly.\n\n## How content gets updated\n\n- **Markdown** supported\n- Lists supported\n- [Links](https://astro.build) supported\n\n### On static output\n\n> The reader side is fully static, fast everywhere.\n\n### On the writing backend\n\nSign in to publish online; one rebuild after saving makes it live for readers.',
    cover: '',
    category: 'Essays',
    categorySlug: 'essays',
    lang: 'en',
    published: true,
    published_at: '2026-10-14T09:00:00+08:00',
  },
  {
    slug: 'why-i-run-en',
    title: 'Why I Still Run',
    excerpt: "Not for a personal best — for an hour that belongs only to me.",
    content:
      "# Why I Still Run\n\nWhen I started running, I chased pace, mileage, PBs. Later I realized **the numbers were never the point**.\n\nWhat kept me going was the quiet hour with no one else around.\n\n- Five kilometers, no more, no less\n- No headphones — just my breathing\n- A shower after, then the day begins\n\nIf you are hesitating to start: **don't buy gear, just put on your shoes and walk ten minutes**. ",
    cover: '',
    category: 'Running',
    categorySlug: 'running',
    lang: 'en',
    published: true,
    published_at: '2026-10-10T20:30:00+08:00',
  },
  {
    slug: 'living-alone-en',
    title: 'Living Alone, Year Three',
    excerpt: 'Live by yourself long enough and silence becomes a friend.',
    content:
      '# Living Alone, Year Three\n\nBy the third year, most things became habit.\n\nLights on when I get home, cooking for one, entire weekends without speaking.\n\n> Loneliness and freedom are two sides of the same thing.\n\nI stopped rushing to prove anything, and started living a little quieter and a little truer.',
    cover: '',
    category: 'Solo Living',
    categorySlug: 'solo-living',
    lang: 'en',
    published: true,
    published_at: '2026-10-05T21:00:00+08:00',
  },
  {
    slug: 'about-this-blog-en',
    title: 'About This Blog',
    excerpt: 'Why I built it, and how it works.',
    content:
      '# About This Blog\n\nI generate static pages with Astro and keep the posts in a Supabase cloud database. After publishing, one rebuild and the content goes live.\n\nNo server, no code changes needed.',
    cover: '',
    category: 'Essays',
    categorySlug: 'essays',
    lang: 'en',
    published: true,
    published_at: '2026-09-28T10:00:00+08:00',
  },

  // ---------- 日本語 ----------
  {
    slug: 'hello-ja',
    title: 'はじめての投稿',
    excerpt: '日常を綴る雑記、ここから始まる。',
    content:
      '# はじめての投稿\n\nこれはサンプル記事です。`.env` に Supabase を設定すると、ここに管理画面で書いた本物の記事が表示されます。\n\n## このブログを作った理由\n\n失業してから、プラットフォームに依存しない、完全に自分の場所がほしくなりました。ゆっくり、等身大のことを書いていきます。\n\n## 更新はどうやるの\n\n- **Markdown** 対応\n- リスト対応\n- [リンク](https://astro.build) 対応\n\n### 静的サイトについて\n\n> 読者側は完全な静的ページなので、国内外どこでも高速に開きます。\n\n### 管理画面について\n\nログインすればオンラインで公開でき、保存後に一度再構築すれば読者に反映されます。',
    cover: '',
    category: '随筆',
    categorySlug: 'essays',
    lang: 'ja',
    published: true,
    published_at: '2026-10-14T09:00:00+08:00',
  },
  {
    slug: 'why-i-run-ja',
    title: '走り続ける理由',
    excerpt: '記録のためではなく、誰にも邪魔されない一時間のため。',
    content:
      '# 走り続ける理由\n\n走り始めたころは、ペースや距離、PBばかり気にしていました。でも気づいたんです。**数字なんて本質じゃない**と。\n\n僕を走らせてきたのは、誰もいないあの静かな一時間でした。\n\n- 5キロ、多くも少なくもなく\n- イヤホンなし、呼吸を聞く\n- 走り終えて風呂に入ると、一日が始まる\n\n迷っている人へ：**道具を買う前に、靴を履いて10分歩くこと**。',
    cover: '',
    category: 'ランニング',
    categorySlug: 'running',
    lang: 'ja',
    published: true,
    published_at: '2026-10-10T20:30:00+08:00',
  },
  {
    slug: 'living-alone-ja',
    title: 'ひとり暮らし三年目',
    excerpt: 'ひとりで暮らすうち、沈黙が友だちになる。',
    content:
      '# ひとり暮らし三年目\n\n三年目にもなると、たいていのことは習慣になりました。\n\n帰宅して明かりをつけ、一人分のごはんを作り、週末は一日中口をきかないことも。\n\n> 孤独と自由は、裏表の関係にある。\n\n誰かに証明しようと急ぐのはやめて、日々を少し静かに、少し素直に生きるだけ。',
    cover: '',
    category: 'ひとり暮らし',
    categorySlug: 'solo-living',
    lang: 'ja',
    published: true,
    published_at: '2026-10-05T21:00:00+08:00',
  },
  {
    slug: 'about-this-blog-ja',
    title: 'このブログについて',
    excerpt: 'なぜ作ったか、そしてどう動いているか。',
    content:
      '# このブログについて\n\nAstro で静的ページを生成し、記事は Supabase クラウドデータベースに保存しています。公開後に一度再構築すれば、内容がオンラインに反映されます。\n\nサーバーもいらないし、コードをいじる必要もありません。',
    cover: '',
    category: '随筆',
    categorySlug: 'essays',
    lang: 'ja',
    published: true,
    published_at: '2026-09-28T10:00:00+08:00',
  },
];
