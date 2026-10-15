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
-- 评论审核 + 本人删除（幂等，重复执行安全）
-- 设计要点：
--   · approved 默认 false → 新评论「先审后放」，通过后才对外展示
--   · rejected 标记「审核未通过」；三态：待审核(approved=f,rejected=f) / 已通过(approved=t) / 未通过(approved=f,rejected=t)
--   · delete_token 为每条评论的随机令牌，匿名用户凭它删除「自己」的评论（存于浏览器 localStorage）
--   · 本人删/查走 security definer 的 RPC，绕过 RLS（匿名无法 SELECT 未通过评论，故用 RPC 取回）
-- ============================================================

-- 新增状态字段（已存在则跳过）
alter table comments add column if not exists rejected boolean not null default false;
alter table comments add column if not exists delete_token text;

-- 为历史评论补一个随机删除令牌（仅用于「删除本人评论」；已通过的评论不受影响）
update comments set delete_token = gen_random_uuid()::text where delete_token is null;

-- 新评论进入「待审核」；已存在的已通过评论保持 approved=true 不变
alter table comments alter column approved set default false;

-- 匿名插入：先审后放（默认 approved=false，且禁止匿名把评论直接设为已通过/未通过）
drop policy if exists "public insert comments" on comments;
create policy "public insert comments"
  on comments for insert
  with check (
    char_length(author) between 1 and 40
    and char_length(email) <= 120
    and (email = '' or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
    and char_length(content) between 1 and 1000
    and (approved is not true)
    and (rejected is not true)
  );

-- 已登录（管理员）：可读全部评论（含待审 / 未通过），用于后台管理
drop policy if exists "authenticated read all comments" on comments;
create policy "authenticated read all comments"
  on comments for select
  to authenticated
  using (true);

-- 已登录（管理员）：可更新评论（审核：通过 / 驳回）
drop policy if exists "authenticated moderate comments" on comments;
create policy "authenticated moderate comments"
  on comments for update
  to authenticated
  using (true) with check (true);

-- 已登录（管理员）：可删除任意评论
drop policy if exists "authenticated delete comments" on comments;
create policy "authenticated delete comments"
  on comments for delete
  to authenticated
  using (true);

-- RPC：匿名提交评论，返回 id 与 delete_token（供本人删除/查询用）。
-- 固定写入 approved=false, rejected=false → 先审后放。security definer 以绕过 RLS，确保能回传令牌。
create or replace function add_comment(
  p_page text, p_author text, p_email text, p_content text
) returns table (id uuid, delete_token text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    insert into comments (page, author, email, content, approved, rejected)
    values (
      p_page,
      left(p_author, 40),
      left(coalesce(nullif(p_email, ''), ''), 120),
      left(p_content, 1000),
      false,
      false
    )
    returning comments.id, comments.delete_token;
end;
$$;

-- RPC：凭令牌取回「本人」在某页面的评论（含待审 / 未通过），用于「我的评论」面板展示状态与删除
create or replace function list_my_comments(p_page text, p_token text)
returns table (id uuid, content text, created_at timestamptz, approved boolean, rejected boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select c.id, c.content, c.created_at, c.approved, c.rejected
    from comments c
    where c.page = p_page and c.delete_token = p_token
    order by c.created_at asc;
end;
$$;

-- RPC：凭令牌删除「本人」的评论（仅匹配同 id + 令牌，互不可删他人）
create or replace function delete_own_comment(p_id uuid, p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from comments where id = p_id and delete_token = p_token;
end;
$$;

-- ============================================================
-- 自查（可选）：
--   select policyname from pg_policies where tablename = 'comments';
--   select column_name, data_type, column_default
--     from information_schema.columns where table_name = 'comments' order by ordinal_position;
-- ============================================================

