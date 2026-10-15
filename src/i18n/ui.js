// 双语（zh / en / ja）文案与路由辅助
export const defaultLang = 'zh';

// switchLabel = 在“另一种语言”的页面里，这个链接显示的文案（即“切过去”的目标语言）
export const languages = {
  zh: { label: '中文', switchLabel: '中文', htmlLang: 'zh-CN' },
  en: { label: 'English', switchLabel: 'EN', htmlLang: 'en' },
  ja: { label: '日本語', switchLabel: '日本語', htmlLang: 'ja' },
};

export const ui = {
  zh: {
    'site.name': '吾道一以贯之',
    'site.tagline': '记录跑步、生活，以及一些零散的观察和想法。',
    'site.description': '一个普通人的个人博客，记录生活随笔、跑步与日常观察。',

    'nav.home': '主页',
    'nav.categories': '分类',
    'nav.about': '关于',
    'nav.archive': '归档',
    'nav.login': '登录',

    'icon.rss': 'RSS 订阅',
    'icon.sitemap': '站点地图',
    'icon.search': '搜索',
    'icon.login': '登录',
    'icon.theme': '切换日间 / 夜间',

    'home.hero.title': '生活随笔',
    'home.readMore': '阅读最新文章',
    'home.latest': '最新随笔',
    'home.empty': '还没有文章。',

    'widget.quote': '今日寄语',
    'widget.countdown': '倒计时',
    'widget.countdownTo': '距 {label}',

    'profile.posts': '文章',
    'profile.categories': '分类',
    'profile.comments': '评论',
    'profile.visits': '访问',

    'about.title': '关于',
    'about.lead': '你好，我是老一贯。',
    'about.body':
      '这里记录我的日常：跑步、生活，以及一些零散的观察和想法。\n\n不追热点，不刻意更新，只写当下真正想写的东西。文章以中文为主，也提供英文版本，方便海外的朋友阅读。\n\n## 为什么叫“吾道一以贯之”？\n\n出自《论语·里仁》——子曰：“参乎！吾道一以贯之。”曾子曰：“唯。”孔子对曾参说：我的道，用一个东西贯穿始终；曾参答：是。后来曾子解释为“忠恕而已矣”。\n\n内容板块可以是：读书笔记、思想随笔；也可以是个人成长、长期主义；还可以是自己摸索学习的心路历程。\n\n## 到底是什么？\n\n一个普通人的长期主义；读书、思考、写下去；不追热点，只写主线；忠恕而已；做自己。',

    'categories.title': '分类',
    'categories.intro': '按主题浏览全部文章。',
    'categories.count': '共 {n} 篇',
    'categories.empty': '暂无分类。',

    'archive.title': '归档',
    'archive.intro': '按时间回溯所有文章。',
    'archive.count': '共 {n} 篇文章',
    'archive.empty': '暂无文章。',
    'archive.uncategorized': '未分类',

    'search.title': '搜索',
    'search.intro': '输入关键词，检索站内全部文章。',
    'search.placeholder': '输入关键词…',
    'search.tip': '输入关键词开始搜索。',
    'search.noResults': '没有找到相关文章。',
    'search.results': '找到 {n} 篇相关文章',
    'search.reading': '正在加载…',

    'post.back': '← 返回首页',
    'post.filed': '分类：',
    'post.toc': '目录',
    'post.hot': '热门文章',
    'post.catDir': '分类目录',
    'post.words': '约 {n} 字',

    'share.title': '分享这篇文章',
    'share.copy': '复制链接',
    'share.copied': '已复制',
    'share.copyFail': '复制失败，请手动复制',
    'share.email': '邮件',
    'share.wechat': '微信',
    'share.wechatHint': '链接已复制，去微信粘贴给朋友吧',
    'share.native': '系统分享',
    'share.weibo': '微博',
    'share.qq': 'QQ',
    'share.x': 'X',
    'share.telegram': 'Telegram',
    'share.whatsapp': 'WhatsApp',
    'share.facebook': 'Facebook',

    'post.comments': '评论',
    'post.commentName': '昵称（必填）',
    'post.commentEmail': '邮箱（必填）',
    'post.commentPlaceholder': '说点什么吧…（理性发言，友善交流）',
    'post.commentSubmit': '发表评论',
    'post.commentSending': '发送中…',
    'post.commentEmpty': '还没有评论，来抢沙发吧。',
    'post.commentDisabled': '评论功能未启用（站点未配置 Supabase）。',
    'post.commentError': '评论发送失败，请稍后重试。',
    'post.commentRequired': '评论内容不能为空哦。',
    'post.commentNameRequired': '昵称不能为空。',
    'post.commentEmailInvalid': '请输入有效的邮箱地址。',
    'post.commentLoadFailed': '评论加载失败',
    'post.commentRetry': '重试',

    'post.commentPending': '评论已提交，审核通过后会公开展示。',
    'post.commentMyTitle': '我的评论',
    'post.commentMineHint': '仅你本人可见与管理自己提交的评论。',
    'post.commentStatusPending': '待审核',
    'post.commentStatusApproved': '已通过',
    'post.commentStatusRejected': '未通过',
    'post.commentStatusRejectedNote': '该评论未通过审核，已隐藏。',
    'post.commentDelete': '删除',
    'post.commentDeleteConfirm': '确定删除这条评论吗？此操作不可恢复。',
    'post.commentDeleted': '已删除',

    'footer.copyright': 'Copyright © {year} 老一贯',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Cloudflare',

    '404.title': '页面不存在',
    '404.desc': '你访问的页面可能已被移除或从未存在。',
    '404.back': '返回首页',
  },
  en: {
    'site.name': '吾道一以贯之',
    'site.tagline': 'Notes on running, life, and scattered thoughts.',
    'site.description': 'A personal blog about everyday life, running, and quiet observations.',

    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.archive': 'Archive',
    'nav.login': 'Login',

    'icon.rss': 'RSS feed',
    'icon.sitemap': 'Sitemap',
    'icon.search': 'Search',
    'icon.login': 'Login',
    'icon.theme': 'Toggle light / dark',

    'home.hero.title': 'Life Notes',
    'home.readMore': 'Read the latest',
    'home.latest': 'Latest posts',
    'home.empty': 'No posts yet.',

    'widget.quote': "Today's Note",
    'widget.countdown': 'Countdown',
    'widget.countdownTo': 'To {label}',

    'profile.posts': 'Posts',
    'profile.categories': 'Cats',
    'profile.comments': 'Comments',
    'profile.visits': 'Views',

    'about.title': 'About',
    'about.lead': "Hi, I'm 老一贯.",
    'about.body':
      'This is where I keep my everyday notes: running, life, and scattered observations and thoughts.\n\nNo chasing trends, no forced schedule — I only write what I actually want to write. Posts are mainly in Chinese, with English versions for friends abroad.\n\n## Why “吾道一以贯之” (One Thread Through It All)?\n\nFrom the Analects, Book IV (Li Ren) — Confucius said, “Shen! My way is bound together by one single thread.” Master Zeng replied, “Yes.” Confucius meant that the whole of his way is strung upon one thing; Zeng later explained it as “loyalty and reciprocity (zhong shu), that is all.”\n\nThe content can be reading notes or reflective essays; it can also be personal growth, long-termism, or the winding path of learning something on my own.\n\n## So what is it, really?\n\nAn ordinary person’s long-termism: read, think, keep writing; don’t chase trends, just follow the main thread; loyalty and reciprocity; be yourself.',

    'categories.title': 'Categories',
    'categories.intro': 'Browse all posts by topic.',
    'categories.count': '{n} posts',
    'categories.empty': 'No categories yet.',

    'archive.title': 'Archive',
    'archive.intro': 'All posts, in reverse chronological order.',
    'archive.count': '{n} posts in total',
    'archive.empty': 'No posts yet.',
    'archive.uncategorized': 'Uncategorized',

    'search.title': 'Search',
    'search.intro': 'Search every post on this site.',
    'search.placeholder': 'Type a keyword…',
    'search.tip': 'Type a keyword to start searching.',
    'search.noResults': 'No matching posts found.',
    'search.results': '{n} posts found',
    'search.reading': 'Loading…',

    'post.back': '← Back to home',
    'post.filed': 'Filed under:',
    'post.toc': 'Contents',
    'post.hot': 'Popular',
    'post.catDir': 'Categories',
    'post.words': '~{n} words',

    'share.title': 'Share this post',
    'share.copy': 'Copy link',
    'share.copied': 'Copied',
    'share.copyFail': 'Copy failed — please copy manually',
    'share.email': 'Email',
    'share.wechat': 'WeChat',
    'share.wechatHint': 'Link copied — paste it in WeChat',
    'share.native': 'Share',
    'share.weibo': 'Weibo',
    'share.qq': 'QQ',
    'share.x': 'X',
    'share.telegram': 'Telegram',
    'share.whatsapp': 'WhatsApp',
    'share.facebook': 'Facebook',

    'post.comments': 'Comments',
    'post.commentName': 'Name (required)',
    'post.commentEmail': 'Email (required)',
    'post.commentPlaceholder': 'Say something… (be kind, be civil)',
    'post.commentSubmit': 'Post comment',
    'post.commentSending': 'Sending…',
    'post.commentEmpty': 'No comments yet — be the first.',
    'post.commentDisabled': 'Comments are disabled (Supabase not configured).',
    'post.commentError': 'Failed to post. Please try again later.',
    'post.commentRequired': 'Comment cannot be empty.',
    'post.commentNameRequired': 'Name is required.',
    'post.commentEmailInvalid': 'Please enter a valid email address.',
    'post.commentLoadFailed': 'Failed to load comments',
    'post.commentRetry': 'Retry',

    'post.commentPending': 'Comment submitted. It will appear after moderation.',
    'post.commentMyTitle': 'My comments',
    'post.commentMineHint': 'Only you can see and manage the comments you submitted.',
    'post.commentStatusPending': 'Pending',
    'post.commentStatusApproved': 'Approved',
    'post.commentStatusRejected': 'Rejected',
    'post.commentStatusRejectedNote': 'This comment was rejected and is hidden.',
    'post.commentDelete': 'Delete',
    'post.commentDeleteConfirm': 'Delete this comment? This cannot be undone.',
    'post.commentDeleted': 'Deleted',

    'footer.copyright': 'Copyright © {year} 老一贯',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Cloudflare',

    '404.title': 'Page not found',
    '404.desc': 'The page you requested may have been removed or never existed.',
    '404.back': 'Back to home',
  },
  ja: {
    'site.name': '吾道一以贯之',
    'site.tagline': 'ランニング、暮らし、そしてちょっとした想いの記録。',
    'site.description': '普通の人の個人ブログ。日常の雑記、ランニング、日々の気づきを綴る。',

    'nav.home': 'ホーム',
    'nav.categories': 'カテゴリ',
    'nav.about': 'About',
    'nav.archive': 'アーカイブ',
    'nav.login': 'ログイン',

    'icon.rss': 'RSS 購読',
    'icon.sitemap': 'サイトマップ',
    'icon.search': '検索',
    'icon.login': 'ログイン',
    'icon.theme': 'ライト / ダーク切替',

    'home.hero.title': '日常の雑記',
    'home.readMore': '最新記事を読む',
    'home.latest': '最新記事',
    'home.empty': 'まだ記事がありません。',

    'widget.quote': '今日のことば',
    'widget.countdown': 'カウントダウン',
    'widget.countdownTo': '{label}まで',

    'profile.posts': '記事',
    'profile.categories': 'カテゴリ',
    'profile.comments': 'コメント',
    'profile.visits': '閲覧',

    'about.title': 'About',
    'about.lead': 'こんにちは、老一贯です。',
    'about.body':
      'ここには僕の日常——ランニング、暮らし、ちょっとした観察や想い——を綴ります。\n\n流行は追わず、無理に更新もしません。今ほんとうに書きたいことだけを書く。記事は中国語が中心で、海外の友だちのために英語版も用意しています。\n\n## なぜ「吾道一以貫之（吾が道は一以て之を貫く）」なのか\n\n『論語』里仁篇より——子曰く、「参や、吾が道は一以て之を貫く。」曾子曰く、「唯。」孔子は曾参に、自分の道はたったひとつのもので貫かれている、と説いた。曾子はのちにそれを「忠恕のみ」と解した。\n\nコンテンツは読書ノートや思想エッセイ、あるいは個人の成長、長期主義、自分で手探りに学んでいく心の軌跡でもあります。\n\n## 結局、何なのか\n\n一人の普通の人の長期主義。読み、考え、書き続ける。流行は追わず、ただ本筋を書く。忠恕のみ。自分らしくあること。',

    'categories.title': 'カテゴリ',
    'categories.intro': 'テーマ別にすべての記事を眺める。',
    'categories.count': '全 {n} 件',
    'categories.empty': 'まだカテゴリがありません。',

    'archive.title': 'アーカイブ',
    'archive.intro': 'これまでのすべての記事を時系列に。',
    'archive.count': '全 {n} 件の記事',
    'archive.empty': 'まだ記事がありません。',
    'archive.uncategorized': '未分類',

    'search.title': '検索',
    'search.intro': 'キーワードを入力して、サイト内の記事を検索。',
    'search.placeholder': 'キーワードを入力…',
    'search.tip': 'キーワードを入力して検索。',
    'search.noResults': '該当する記事が見つかりませんでした。',
    'search.results': '{n} 件の記事が見つかりました',
    'search.reading': '読み込み中…',

    'post.back': '← ホームへ',
    'post.filed': 'カテゴリ：',
    'post.toc': '目次',
    'post.hot': '人気記事',
    'post.catDir': 'カテゴリ',
    'post.words': '約 {n} 文字',

    'share.title': 'この記事をシェア',
    'share.copy': 'リンクをコピー',
    'share.copied': 'コピーしました',
    'share.copyFail': 'コピーに失敗しました',
    'share.email': 'メール',
    'share.wechat': '微信',
    'share.wechatHint': 'リンクをコピーしました。WeChat に貼り付けてください',
    'share.native': 'シェア',
    'share.weibo': '微博',
    'share.qq': 'QQ',
    'share.x': 'X',
    'share.telegram': 'Telegram',
    'share.whatsapp': 'WhatsApp',
    'share.facebook': 'Facebook',

    'post.comments': 'コメント',
    'post.commentName': 'ニックネーム（必須）',
    'post.commentEmail': 'メールアドレス（必須）',
    'post.commentPlaceholder': '何か書いてください…（冷静に、丁寧に）',
    'post.commentSubmit': 'コメントする',
    'post.commentSending': '送信中…',
    'post.commentEmpty': 'まだコメントはありません。最初の一本を。',
    'post.commentDisabled': 'コメントは無効です（Supabase が未設定）。',
    'post.commentError': '送信に失敗しました。後ほどお試しください。',
    'post.commentRequired': 'コメントを入力してください。',
    'post.commentNameRequired': 'ニックネームは必須です。',
    'post.commentEmailInvalid': '有効なメールアドレスを入力してください。',
    'post.commentLoadFailed': 'コメントの読み込みに失敗しました',
    'post.commentRetry': '再試行',

    'post.commentPending': 'コメントを送信しました。承認後に公開されます。',
    'post.commentMyTitle': '自分のコメント',
    'post.commentMineHint': '自分が投稿したコメントだけが表示・管理できます。',
    'post.commentStatusPending': '承認待ち',
    'post.commentStatusApproved': '承認済み',
    'post.commentStatusRejected': '非公開',
    'post.commentStatusRejectedNote': 'このコメントは非承認となり非表示です。',
    'post.commentDelete': '削除',
    'post.commentDeleteConfirm': 'このコメントを削除しますか？元に戻せません。',
    'post.commentDeleted': '削除しました',

    'footer.copyright': 'Copyright © {year} 老一贯',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Cloudflare',

    '404.title': 'ページが見つかりません',
    '404.desc': 'お探しのページは削除されたか、存在しません。',
    '404.back': 'ホームへ',
  },
};

export function getLangFromUrl(url) {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'en' || seg === 'ja' ? seg : defaultLang;
}

export function useTranslations(lang) {
  const dict = ui[lang] || ui[defaultLang];
  const fallback = ui[defaultLang];
  return function t(key, vars) {
    let str = dict[key] ?? fallback[key] ?? key;
    if (vars) {
      for (const k of Object.keys(vars)) str = str.replaceAll(`{${k}}`, String(vars[k]));
    }
    return str;
  };
}

// 把「默认语言」的路径（如 '/about'、'/posts/hello'）转成目标语言路径
export function localizePath(path, lang) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

export function altLang(lang) {
  return lang === 'zh' ? 'en' : 'zh';
}

// 从当前 pathname 生成「切换到目标语言」的链接（用于导航里的语言菜单）
export function switchLangPath(pathname, targetLang) {
  const nonDefault = Object.keys(languages).filter((l) => l !== defaultLang);
  let p = pathname.replace(new RegExp(`^/(${nonDefault.join('|')})(?=/|$)`), '');
  if (p === '') p = '/';
  return localizePath(p, targetLang);
}
