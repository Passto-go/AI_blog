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

// 按语言取文章（无 lang 字段视为默认中文）
export async function getPosts(lang = 'zh') {
  const all = (await fetchAll()).map(normalize);
  return all
    .filter((p) => p.lang === lang)
    .sort(byDateDesc);
}

export async function getAllPosts() {
  return (await fetchAll()).map(normalize).sort(byDateDesc);
}

export async function getPost(slug, lang = 'zh') {
  const all = (await getPosts(lang)).map(normalize);
  return all.find((p) => p.slug === slug) || null;
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

// 按约定查找文章在其他语言下的对应版本（文章的 slug 按语言独立命名：
// 如 hello / hello-en / hello-ja 是同一篇的三种语言）。
// 匹配顺序：1) 同 slug（三语言共用 slug 的情况） 2) 基准 slug 或 基准+-lang 后缀。
// 找不到返回 null（调用方回退到目标语言首页，避免 404）。
export async function findTranslation(slug, targetLang) {
  const posts = await getPosts(targetLang);
  const base = baseSlug(slug);
  const candidates =
    targetLang === 'zh' ? [base] : [base, `${base}-${targetLang}`];
  return (
    posts.find((p) => p.slug === slug) ||
    posts.find((p) => candidates.includes(p.slug)) ||
    null
  );
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
