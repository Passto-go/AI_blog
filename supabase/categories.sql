-- ============================================================================
-- 分类注册表（categories）
-- 目的：让「新增分类」即使 0 篇文章，也能在前台 /categories/ 显示分类标签；
--       并把分类名称/Slug 作为权威来源，消除「只填 slug 不填名称导致前台无标签」的脏数据。
-- 在 Supabase SQL Editor 执行本文件（一次性）。
-- ============================================================================

create table if not exists public.categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null,
  created_at  timestamptz not null  default now(),
  constraint  categories_slug_key unique (slug)
);

-- 行级安全：
--   前台（匿名）可读 → 用于展示分类列表
--   后台（已登录）可增删改 → 用于新增/重命名/合并/删除
alter table public.categories enable row level security;

drop policy if exists "categories anon read" on public.categories;
create policy "categories anon read" on public.categories
  for select using (true);

drop policy if exists "categories auth write" on public.categories;
create policy "categories auth write" on public.categories
  for all to authenticated
  using (true) with check (true);

create index if not exists categories_slug_idx    on public.categories (slug);
create index if not exists categories_created_idx on public.categories (created_at);

-- ----------------------------------------------------------------------------
-- 自愈：先把历史脏数据修好，再用现有文章去重分类种子化注册表
-- ----------------------------------------------------------------------------

-- 1) 修复：slug 有值但名称(name)为空的文章 —— 让名称回退为 slug
--    （这正是一条约「只填了分类 Slug、没填分类名」导致的脏数据）
update public.posts
   set category = category_slug
 where (category is null or category = '')
   and category_slug is not null
   and category_slug <> 'uncategorized';

-- 2) 种子化：把现有文章里去重得到的「名称 + Slug」写入注册表
--    （slug 作为唯一键，已存在的跳过）
insert into public.categories (name, slug)
select distinct category, category_slug
from public.posts
where category is not null and category <> ''
  and category_slug is not null and category_slug <> ''
on conflict (slug) do nothing;
