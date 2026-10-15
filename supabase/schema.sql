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
drop policy if exists "public read published" on posts;
create policy "public read published"
  on posts for select
  using (published = true);

-- 写作者端：已登录用户可读写全部
drop policy if exists "authenticated write" on posts;
create policy "authenticated write"
  on posts for all
  to authenticated
  using (true) with check (true);

-- 图床：公开读，仅登录用户可上传
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists "auth upload images" on storage.objects;
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
  email text not null default '',
  content text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- 已存在旧表时补列（幂等）
alter table comments add column if not exists email text not null default '';

create index if not exists comments_page_idx on comments (page, created_at);

alter table comments enable row level security;

-- 任何人可读「已审核」评论（email 不对外返回，仅作者本人可在后台查看）
drop policy if exists "public read approved comments" on comments;
create policy "public read approved comments"
  on comments for select
  using (approved = true);

-- 匿名可插入（昵称、邮箱、内容均做基本校验；邮箱不公开显示）
drop policy if exists "public insert comments" on comments;
create policy "public insert comments"
  on comments for insert
  with check (
    char_length(author) between 1 and 40
    and char_length(email) <= 120
    and (email = '' or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
    and char_length(content) between 1 and 1000
  );

-- 开启 Realtime：让新评论无需刷新即出现（幂等，重复执行不报错；
-- 若提示 publication 不存在说明该项目未启用 Realtime，可忽略，评论功能不受影响）
do $$
begin
  alter publication supabase_realtime add table comments;
exception
  when duplicate_object then null;   -- 已在发布中
  when undefined_object then null;   -- 该项目无该 publication
end $$;

-- ============================================================
-- 站点动态配置表（倒计时等由写作后台写入，读者端 SSR 读取）
-- key 为主键；value 为 jsonb，如倒计时 {"name":"元旦","target":"2027-01-01T00:00:00"}
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

-- 读者端：任何人可读（SSR 取倒计时用 anon key）
drop policy if exists "public read settings" on site_settings;
create policy "public read settings"
  on site_settings for select
  using (true);

-- 写作者端：已登录用户可读写
drop policy if exists "authenticated write settings" on site_settings;
create policy "authenticated write settings"
  on site_settings for all
  to authenticated
  using (true) with check (true);

-- ============================================================
-- 自查（可选）：站点配置表策略
--   select policyname from pg_policies where tablename = 'site_settings';
-- ============================================================

