-- 在 Supabase 后台 → SQL Editor 中执行本文件
-- 文章表
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null default '',
  excerpt text default '',
  cover text default '',
  published boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  -- 双语 / 分类（新增）
  lang text not null default 'zh',          -- 'zh' 或 'en'
  category text default '',                 -- 分类显示名，如「随笔」「Essays」
  category_slug text default ''             -- 分类 URL 段，如 essays / running
);

alter table posts enable row level security;

-- 读者端：任何人可读已发布文章（构建时拉取用）
create policy "public read published"
  on posts for select
  using (published = true);

-- 写作者端：已登录用户可读写全部
create policy "authenticated write"
  on posts for all
  to authenticated
  using (true) with check (true);

-- 图床：公开读，仅登录用户可上传
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "auth upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

-- ============================================================
-- 评论表（读者端运行时读写，复用同一 Supabase 项目）
-- page = 文章路径，如 /posts/hello/ 或 /en/posts/hello/
-- approved 默认 true 即发即显；若想先审后放，把 default 改为 false
-- ============================================================
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  author text not null default '匿名',
  content text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists comments_page_idx on comments (page, created_at);

alter table comments enable row level security;

-- 任何人可读「已审核」评论
create policy "public read approved comments"
  on comments for select
  using (approved = true);

-- 匿名可插入（带长度校验，防明显刷屏）
create policy "public insert comments"
  on comments for insert
  with check (
    char_length(content) between 1 and 1000
    and char_length(author) between 1 and 40
  );

