// 站点全局配置：改这里即可换站名、作者、版权、外链、资料卡、今日寄语、倒计时
export const site = {
  name: '皮蛋solo粥',
  author: '皮蛋solo粥',
  // 版权起始年份（页脚显示为「起始年–今年」）；若想只显示单年，把 startYear 设为空字符串
  startYear: '',

  // 头像：把图片放到 public/avatar.png 即可自动启用；留空则用 avatarFallback 首字占位
  avatar: '/avatar.png',
  avatarFallback: '粥',
  // 资料卡一句话简介
  tagline: '记录日常、跑步，和重新出发的日子。一个独居者的真实写作。',

  license: { name: 'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  // Powered by 为数组：本博客是 Astro 生成的静态站，文章数据存于 Supabase
  poweredBy: [
    { name: 'Astro', url: 'https://astro.build' },
    { name: 'Supabase', url: 'https://supabase.com' },
  ],
  hostedBy: { name: 'Netlify', url: 'https://www.netlify.com' },

  // 社交入口（资料卡底部）：icon 名称见 src/components/Icon.astro（github/email/rss/wechat/tiktok/link）
  // url 留空则该图标不显示
  socials: [
    { icon: 'github', label: 'GitHub', url: 'https://github.com/' },
    { icon: 'email', label: 'Email', url: 'mailto:you@example.com' },
    { icon: 'rss', label: 'RSS', url: '/rss.xml' },
    { icon: 'wechat', label: '微信', url: '' },
    { icon: 'tiktok', label: '抖音', url: '' },
  ],

  // 资料卡统计：文章数、分类数由系统自动统计（真实）；不再放评论/访问占位数字，避免造假。

  // 今日寄语：按语言每日轮换（脚本按「年内第几天」取一条）。想加句子直接往数组里加。
  quotes: {
    zh: [
      '把日子过得安静一点、真实一点。',
      '孤独和自在，其实是同一件事的两面。',
      '先别买装备，穿上鞋出门走十分钟。',
      '跑量从来不是重点，重要的是那一个小时里没人打扰。',
      '与其追热点，不如写点自己真的想写的东西。',
      '一个人住久了，会和沉默成为朋友。',
      '重新出发不丢人，停在原地才丢人。',
      '今天的字，是今天活过的证据。',
      '慢一点没关系，只要还在往前走。',
      '把情绪写下来，它就不再是负担，而是素材。',
      '能独处的人，才真正自由。',
      '日子是一天一天过的，不是一天想完的。',
    ],
    en: [
      "Live a little quieter, a little truer.",
      'Loneliness and freedom are two sides of the same thing.',
      "Don't buy gear — just put on your shoes and walk ten minutes.",
      'The miles were never the point; the quiet hour was.',
      'Write what you actually want to write, not what trends demand.',
      'Live alone long enough and silence becomes a friend.',
      'Starting over is not shameful; standing still is.',
      'Today’s words are proof that today was lived.',
      "Slow is fine, as long as you keep moving.",
      'Write the feeling down and it becomes material, not a burden.',
      'Those who can be alone are truly free.',
      'Days are lived one at a time, not planned all at once.',
    ],
  },

  // 倒计时：把 target 改成你的目标日（ISO 本地时间），label 写事件名
  // 例：高考 target:'2027-06-07T09:00:00' label:'高考'
  countdown: { target: '2027-01-01T00:00:00', label: '新年' },

  // 写作后台（顶栏「登录」入口指向这里）
  loginPath: '/login',
};

export function copyrightText() {
  const year = new Date().getFullYear();
  const range = site.startYear ? `${site.startYear}–${year}` : `${year}`;
  return { year: range };
}
