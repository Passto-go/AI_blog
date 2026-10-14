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
    'site.name': '皮蛋solo粥',
    'site.tagline': '记录日常、跑步，和重新出发的日子。一个独居者的真实写作。',
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
    'about.lead': '你好，我是皮蛋solo粥。',
    'about.body':
      '这里记录我的日常：跑步、独居生活，以及一些零散的观察和想法。\n\n不追热点，不刻意更新，只写当下真正想写的东西。文章以中文为主，也提供英文版本，方便海外的朋友阅读。',

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

    'footer.copyright': 'Copyright © {year} 皮蛋solo粥',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Netlify',

    '404.title': '页面不存在',
    '404.desc': '你访问的页面可能已被移除或从未存在。',
    '404.back': '返回首页',
  },
  en: {
    'site.name': '皮蛋solo粥',
    'site.tagline': 'Notes on everyday life, running, and starting over — written by a solo dweller.',
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
    'about.lead': "Hi, I'm 皮蛋solo粥.",
    'about.body':
      'This is where I keep my everyday notes: running, living alone, and scattered thoughts.\n\nNo chasing trends, no forced schedule — I only write what I actually want to write. Posts are mainly in Chinese, with English versions for friends abroad.',

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

    'footer.copyright': 'Copyright © {year} 皮蛋solo粥',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Netlify',

    '404.title': 'Page not found',
    '404.desc': 'The page you requested may have been removed or never existed.',
    '404.back': 'Back to home',
  },
  ja: {
    'site.name': '皮蛋solo粥',
    'site.tagline': '日常、ランニング、そしてもう一度歩き出す日々。ひとり暮らしの等身大の記録。',
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
    'about.lead': 'こんにちは、皮蛋solo粥です。',
    'about.body':
      'ここには僕の日常——ランニング、ひとり暮らし、ちょっとした気づき——を綴ります。\n\nトレンドを追わず、無理に更新もしません。そのとき本当に書きたいことを書くだけ。記事は中国語が中心ですが、海外の友だちのために英語版も用意しています。',

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

    'footer.copyright': 'Copyright © {year} 皮蛋solo粥',
    'footer.license': 'Licensed under CC BY-NC 4.0',
    'footer.powered': 'Powered by Astro',
    'footer.hosted': 'Hosted by Netlify',

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
