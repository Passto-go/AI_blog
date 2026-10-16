// 预计阅读时长：混合检测 CJK 字符与拉丁词，分别按不同速率加权。
// 速率取主流中文博客的常用值：CJK 约 400 字/分钟，拉丁文约 220 词/分钟。
// 代码块/行内代码不计入（读者不会逐行读代码）。

const CJK_RE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;

export function readingMinutes(content) {
  const text = String(content || '')
    .replace(/```[\s\S]*?```/g, ' ') // 围栏代码块
    .replace(/`[^`]*`/g, ' '); // 行内代码

  const cjkCount = (text.match(CJK_RE) || []).length;
  const latinWords = (text
    .replace(CJK_RE, ' ')
    .match(/[A-Za-z0-9''-]+/g) || []).length;

  const minutes = cjkCount / 400 + latinWords / 220;
  return Math.max(1, Math.round(minutes));
}
