// 今日寄语：接入第三方数据源（一言 hitokoto.cn，免费无需注册），服务端拉取。
// 失败（网络/超时/接口异常）时回退到本地静态寄语，保证页面始终有内容。
import { site } from '../data/site.js';

const ENDPOINT = 'https://v1.hitokoto.cn/?encode=json';
const TIMEOUT = 3000;

export async function getDailyQuote(lang = 'zh') {
  const pool = site.quotes[lang] || site.quotes.zh || [];

  // 兜底：取静态池里「年内第几天」对应的一条，行为稳定、可离线
  const fallback = () => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start) / 86400000);
    return { text: pool[day % pool.length] || pool[0] || '', source: '' };
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
    const res = await fetch(ENDPOINT, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    const text = (data.hitokoto || '').toString().trim();
    if (!text) throw new Error('empty');
    const source = [data.from_who, data.from].filter(Boolean).join(' · ');
    return { text, source: source || '' };
  } catch {
    return fallback();
  }
}
