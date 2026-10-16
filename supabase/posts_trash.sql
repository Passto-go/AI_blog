-- ============================================================================
-- 文章垃圾箱（软删除）
-- 目的：删除文章改为「移入垃圾箱」，保留 5 天后自动彻底删除；
--       垃圾箱内支持手动彻底删除（立即）与恢复。
-- 在 Supabase 后台 → SQL Editor 执行本文件（一次性，幂等，可重复执行）。
--
-- 设计要点：
--   · deleted_at 为 null 表示「未删除」；非 null 即「在垃圾箱中」，值即移入时刻
--   · 读者端 RLS 追加 deleted_at is null 条件 → 垃圾箱文章对前台立刻不可见
--     （列表、文章页、搜索、RSS 全部走同一 RLS，无需改任何前台代码）
--   · 管理员（authenticated）不受影响，可读写全部，含垃圾箱内容
--   · 自动清理（超过 5 天）不依赖任何定时任务：由后台加载垃圾箱列表时
--     顺带调用 purge_expired_posts() 执行物理删除。免费档无需 Cron/Worker。
--     若日后希望「不打开后台也自动清理」，可另配 Supabase Cron 调用该函数。
-- ============================================================================

-- 1) 新增软删除时间戳列（幂等）
alter table posts add column if not exists deleted_at timestamptz;

-- 2) 加速「垃圾箱列表」与「过期清理」两类查询（幂等）
create index if not exists posts_deleted_at_idx on posts (deleted_at);

-- 3) 读者端策略收紧：只有「已发布且不在垃圾箱」的文章对匿名可见
drop policy if exists "public read published" on posts;
create policy "public read published"
  on posts for select
  using (published = true and deleted_at is null);

-- 4) 过期彻底删除函数：物理删除「移入垃圾箱超过 p_days 天」的文章，返回删除条数。
--    security definer：以函数属主身份执行，绕过 RLS（管理员在后台调用即可生效）。
create or replace function purge_expired_posts(p_days int default 5)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  with gone as (
    delete from posts
    where deleted_at is not null
      and deleted_at < now() - make_interval(days => greatest(p_days, 0))
    returning 1
  )
  select count(*) into n from gone;
  return coalesce(n, 0);
end;
$$;

-- 仅允许已登录（管理员）调用。
-- 注意：只写 revoke from public 不够——Supabase 默认会给 anon / authenticated
-- 两个角色单独授权。必须显式从 anon 收回，否则匿名可触发清理（虽无数据危害，
-- 但属越权）。实测：缺少 anon 那一行时，匿名调用返回 200 而非 403。
revoke all on function purge_expired_posts(int) from public;
revoke all on function purge_expired_posts(int) from anon;
grant execute on function purge_expired_posts(int) to authenticated;

-- ============================================================================
-- 自查（可选）：
--   select column_name, data_type from information_schema.columns
--     where table_name = 'posts' and column_name = 'deleted_at';
--   select policyname, qual from pg_policies where tablename = 'posts';
--   -- 手动试跑清理（返回删除条数，0 表示没有过期项）：
--   select purge_expired_posts(5);
-- ============================================================================
