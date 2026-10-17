// 兼容习惯提交 /sitemap.xml 的站长与工具：301 指向真正的 sitemap。
// （此前无此路由时该路径被 Worker 抛成 500，可能影响爬虫信任。）
export async function GET() {
  return new Response(null, {
    status: 301,
    headers: { Location: '/sitemap-index.xml' },
  });
}
