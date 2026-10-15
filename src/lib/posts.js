import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { samplePosts } from '../data/sample.js';

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// 构建时（服务端）从 Supabase 拉取已发布文章。
// 未配置或拉取失败则回退到本地示例数据，保证站点始终能构建。
async function fetchAll() {
  if (!URL || !KEY) {
    console.warn('[posts] 未检测到 Supabase 环境变量，使用本地示例数据。');
    return samplePosts;
  }
  const supabase = createClient(URL, KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.warn('[posts] 拉取失败，回退示例数据:', error.message);
    return samplePosts;
  }
  return data ?? [];
}

const byDateDesc = (a, b) =>
  new Date(b.published_at).getTime() - new Date(a.published_at).getTime();

// 兼容 Supabase(下划线字段)与本地示例(camelCase)，统一成 camelCase
function normalize(p) {
  return {
    ...p,
    lang: p.lang || 'zh',
    category: p.category || null,
    categorySlug: p.category_slug || p.categorySlug || 'uncategorized',
  };
}

// 文章为「语言中立」：同一篇文章在所有语言视图下都展示，仅 UI 文案随语言切换。
// 同一篇文章的多个语言版本按「基准 slug」归组（hello / hello-en / hello-ja 的基准都是 hello），
// 每个语言视图只挑选最匹配的一个版本展示，避免列表出现同篇多语言的重复条目。
export async function getPosts(lang = 'zh') {
  const all = (await fetchAll()).map(normalize);
  return pickPerArticle(all, lang);
}

export async function getAllPosts(lang = 'zh') {
  return pickPerArticle((await fetchAll()).map(normalize), lang);
}

// 按基准 slug 归组，每组挑出最符合目标语言的版本；组内排序稳定，结果按发布时间倒序
function pickPerArticle(all, lang) {
  const groups = new Map();
  for (const p of all) {
    const base = baseSlug(p.slug);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(p);
  }
  const out = [];
  for (const versions of groups.values()) out.push(pickLangVersion(versions, lang));
  return out.sort(byDateDesc);
}

// 从同一篇文章的多个语言版本中挑最匹配的一个。优先级：
//   ① 基准 slug 且 lang 字段匹配（「同 slug + lang 区分」约定）
//   ② slug 后缀 base-lang（「hello-en」约定，后台未设语言时 lang 常为默认 'zh'）
//   ③ 任意 slug 但 lang 字段匹配
//   ④ 基准 slug 本身（中文原文）
//   ⑤ 第一个（兜底）
function pickLangVersion(versions, lang) {
  const base = baseSlug(versions[0].slug);
  return (
    versions.find((p) => p.slug === base && (p.lang || 'zh') === lang) ||
    versions.find((p) => p.slug === `${base}-${lang}`) ||
    versions.find((p) => (p.lang || 'zh') === lang) ||
    versions.find((p) => p.slug === base) ||
    versions[0]
  );
}

// 语言无关的文章查找：保证任何语言视图下都能取到内容（中文原文兜底），永不空页。
// 同时兼容两种翻译命名约定：
//   ① 「同 slug + lang 字段」：英文版 slug 与中文版相同，靠 lang='en' 区分
//   ② 「slug 后缀」：英文版 slug 为 base-en（后台未提供语言选择，lang 常为默认 'zh'）
// 中文视图优先解析基准 slug，避免误命中 -en/-ja 版本；非中文视图优先 slug 后缀约定。
export async function getPost(slug, lang = 'zh') {
  const all = (await fetchAll()).map(normalize);
  const base = baseSlug(slug);
  if (lang === 'zh') {
    return (
      all.find((x) => x.slug === base && (x.lang || 'zh') === 'zh') ||
      all.find((x) => x.slug === base) ||
      all.find((x) => x.slug === slug && (x.lang || 'zh') === 'zh') ||
      all.find((x) => x.slug === slug) ||
      null
    );
  }
  return (
    all.find((x) => x.slug === `${base}-${lang}`) ||
    all.find((x) => x.slug === slug && (x.lang || 'zh') === lang) ||
    all.find((x) => x.slug === base) ||
    all.find((x) => x.slug === slug) ||
    null
  );
}

// 读取站点动态配置（如倒计时）。表不存在 / 未配置时返回 null，调用方回退默认值。
export async function getSetting(key) {
  if (!URL || !KEY) return null;
  try {
    const supabase = createClient(URL, KEY, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
}

// 分类列表（含每类文章数）
export async function getCategories(lang = 'zh') {
  const posts = await getPosts(lang);
  const map = new Map();
  for (const p of posts) {
    const name = p.category || null;
    const slug = p.categorySlug || (name ? slugify(name) : 'uncategorized');
    const key = slug;
    if (!map.has(key)) map.set(key, { name, slug, count: 0 });
    map.get(key).count += 1;
    if (name && !map.get(key).name) map.get(key).name = name;
  }
  return [...map.values()];
}

export async function getPostsByCategory(slug, lang = 'zh') {
  const posts = await getPosts(lang);
  return posts.filter((p) => (p.categorySlug || 'uncategorized') === slug);
}

export function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]/g, '');
}

// 去掉语言后缀（-en/-ja）得到基准 slug：hello-en / hello-ja -> hello
export function baseSlug(slug) {
  return String(slug).replace(/-(en|ja)$/, '');
}

// 查找文章在其他语言下的对应版本（用于文章页的语言切换按钮）。
// 与 getPost 保持同一套优先级（同样走 pickLangVersion），确保「切换链接」与
// 「点击后取到的内容」严格一致：链接用返回版本的 slug 生成，getPost 再按该 slug
// 必然解析回同一版本。
// 找不到该文章的任何版本时返回 null，调用方回退该语言首页（避免 404）。
export async function findTranslation(slug, targetLang) {
  const all = (await fetchAll()).map(normalize);
  const base = baseSlug(slug);
  const versions = all.filter((p) => baseSlug(p.slug) === base);
  if (!versions.length) return null;
  return pickLangVersion(versions, targetLang);
}

// 渲染 Markdown，并为 h2/h3 生成锚点 id；返回 { html, headings(用于目录) }
export function renderMarkdown(content = '') {
  const raw = marked.parse(content || '');
  const headings = [];
  const html = String(raw).replace(/<h([23])>(.*?)<\/h\1>/g, (m, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '');
    const id = slugify(text);
    headings.push({ level: Number(lvl), id, text });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html, headings };
}
