// 文章翻译服务端库：提示词工程 + 长文分段 + OpenAI 兼容协议调用。
// 仅在 Cloudflare Worker 运行时使用（API key 只存在于服务端环境变量，绝不下发前端）。

// 站点固定术语表：站名、作者、栏目等专有名词的译法，保证全站译文一致。
// 可用环境变量 TRANSLATE_GLOSSARY_JSON 覆盖/扩展（JSON 对象，键为原文）。
const DEFAULT_GLOSSARY = {
  '吾道一以贯之': { en: 'One Thread Through It All', ja: '吾道一以貫之' },
  '老一贯': { en: 'Old Yiguan', ja: '老一貫' },
  '跑步': { en: 'running', ja: 'ランニング' },
};

const LANG_NAMES = { en: '英语（English）', ja: '日语（日本語）' };

// 单次请求的内容上限（约数）：超过则按二级标题分段翻译，避免超出模型输出长度。
const SINGLE_SHOT_MAX_CHARS = 4000;

function glossaryText(targetLang) {
  const entries = Object.entries(DEFAULT_GLOSSARY)
    .map(([zh, map]) => `  ${zh} → ${map[targetLang] || zh}`)
    .join('\n');
  return entries || '  （无）';
}

function buildSystemPrompt(targetLang) {
  return `你是一位资深的中外双语编辑，为一位中文个人博客的作者翻译文章。你的译文会被外国读者直接阅读，质量必须达到「信达雅」：准确传达原意，表达地道流畅，并保留作者的个人风格与语气。

翻译规则：
1. 目标语言：${LANG_NAMES[targetLang] || targetLang}。译文必须达到母语出版级水准，杜绝翻译腔（逐字直译、欧化中文、日式中文等一律禁止）。
2. 完整保留 Markdown 结构：标题层级、有序/无序列表、表格、引用块、分隔线、链接、图片、行内代码、代码块，逐一对应，不得增删、合并或降级。
3. 以下内容保持原样，绝不翻译：
   - 代码块（三个反引号围栏）内的全部内容
   - 行内代码（反引号包裹）内容
   - URL、邮箱地址、HTML 标签
   - 数字与单位（如 5km、10kg、2024年）
4. 专有名词：采用目标语言的通用译名；无通用译名或作者自创的名词保留原文。术语表中的译法必须严格遵守，全文一致。
5. 文化适配：按目标语言读者的习惯归化比喻、俗语、歇后语、网络用语，使译文读起来像母语作者原创，而非翻译作品。
6. 语气与文风和原文保持一致：第一人称、口语化、幽默感等作者特质必须在译文中保留。
7. 日期格式本地化（如 2024年3月5日译为 March 5, 2024 / 2024年3月5日）。
8. 不得添加译注、解释或任何原文没有的内容；不得遗漏任何信息。
9. 若原文含 YAML front matter（--- 之间的内容），原样保留，键名不翻译。

术语表（严格遵守）：
${glossaryText(targetLang)}

输出要求（极其重要）：
- 只输出一个 JSON 对象。不要任何解释文字，不要 Markdown 代码围栏。
- 格式：{"title":"译文标题","excerpt":"译文摘要（一两句话，译自原文摘要）","content":"译文正文"}
- content 是完整 Markdown 字符串，字符串内的换行必须写成 \\n 转义，双引号写成 \\" 转义。`;
}

function buildUserPrompt(title, excerpt, content, targetLang, partInfo) {
  const parts = [];
  if (partInfo) {
    parts.push(
      `【长文分段翻译】本文较长，分 ${partInfo.total} 段发送，当前是第 ${partInfo.index} 段。` +
        `只翻译当前这一部分，保持这部分原有的全部结构与顺序；不要重复翻译其他部分，也不要添加承上启下的过渡句。`
    );
  }
  parts.push(
    `请将下面的中文博客文章翻译成${LANG_NAMES[targetLang] || targetLang}。`,
    `标题：${title}`,
    excerpt ? `摘要：${excerpt}` : '摘要：（无，请根据正文生成一两句话的译文摘要）',
    `正文：\n${content}`,
    '请严格按系统要求输出 JSON：{"title":"...","excerpt":"...","content":"..."}'
  );
  return parts.join('\n\n');
}

// 按二级标题（## ）把正文切成若干段；尽量在阈值内合并小段，减少上下文断裂。
export function splitContent(content, maxChars = SINGLE_SHOT_MAX_CHARS) {
  const text = String(content || '');
  if (text.length <= maxChars) return [text];

  const lines = text.split('\n');
  const chunks = [];
  let cur = [];
  let curLen = 0;

  const flush = () => {
    if (cur.length) {
      chunks.push(cur.join('\n'));
      cur = [];
      curLen = 0;
    }
  };

  for (const line of lines) {
    // 在二级标题处切分；标题之前的部分若已达阈值也先落地
    if (/^##\s/.test(line) && curLen > maxChars * 0.5) flush();
    cur.push(line);
    curLen += line.length + 1;
    if (curLen >= maxChars) flush();
  }
  flush();

  // 兜底：某一段（如超长无标题段落）仍超限，按句子硬切
  const out = [];
  for (const c of chunks) {
    if (c.length <= maxChars) { out.push(c); continue; }
    for (let i = 0; i < c.length; i += maxChars) out.push(c.slice(i, i + maxChars));
  }
  return out;
}

// 从模型输出中提取 JSON。容错：模型偶尔包裹 ```json 围栏或带前后废话。
export function extractJSON(raw) {
  const text = String(raw || '').trim();
  try {
    return JSON.parse(text);
  } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  throw new Error('模型未返回有效的 JSON');
}

// 校验并规范化模型输出，确保三项齐全。
export function normalizeTranslation(obj) {
  const title = String(obj?.title || '').trim();
  const content = String(obj?.content || '').trim();
  if (!title || !content) {
    throw new Error('翻译结果不完整（缺少标题或正文）');
  }
  return { title, excerpt: String(obj?.excerpt || '').trim(), content };
}

// OpenAI 兼容协议调用（DeepSeek / OpenAI / Moonshot / 智谱 / Gemini 兼容端点均可）。
async function chat({ baseUrl, apiKey, model, messages, maxTokens = 8192, temperature = 0.3 }) {
  const url = String(baseUrl || 'https://api.deepseek.com').replace(/\/+$/, '') + '/chat/completions';
  const payload = { model, messages, max_tokens: maxTokens, temperature };
  const doFetch = (body) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 免费层容量波动（503 "high demand"）与偶发 5xx/429：指数退避重试，最多 4 次尝试。
  // 后台点一次翻译按钮应尽量拿到结果，而不是被瞬时过载打断。
  const RETRY_DELAYS = [3000, 8000, 20000];
  let status = 0;
  let lastDetail = '';

  for (let attempt = 0; ; attempt++) {
    let resp = await doFetch(payload);

    // 容错：部分兼容端点（如 Gemini）对 max_tokens 字段挑剔，报 400 且指向该字段时去掉重试一次
    if (resp.status === 400) {
      const detail = await resp.text().catch(() => '');
      if (/max_tokens|max_completion_tokens|unsupported parameter/i.test(detail)) {
        const retry = { ...payload };
        delete retry.max_tokens;
        resp = await doFetch(retry);
      }
    }

    if (resp.ok) {
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('翻译服务返回为空');
      return text;
    }

    status = resp.status;
    lastDetail = await resp.text().catch(() => '');
    const overloaded = status === 503 || status === 429 || status >= 500;
    if (!overloaded || attempt >= RETRY_DELAYS.length) break;
    await sleep(RETRY_DELAYS[attempt]);
  }

  let msg = `翻译服务返回 ${status}`;
  try {
    const j = JSON.parse(lastDetail);
    if (j?.error?.message) msg += `：${j.error.message}`;
  } catch {
    if (lastDetail) msg += `：${lastDetail.slice(0, 300)}`;
  }
  throw new Error(msg);
}

// 翻译一篇（或一段）文章。env 提供 OpenAI 兼容端点配置。
export async function translateArticle({ title, excerpt, content, targetLang }, env) {
  if (!['en', 'ja'].includes(targetLang)) {
    throw new Error('仅支持翻译为英文(en)或日文(ja)');
  }
  const apiKey = env?.TRANSLATE_API_KEY;
  if (!apiKey) {
    const err = new Error('服务端未配置 TRANSLATE_API_KEY，请在 Cloudflare 添加 secret 后重新部署');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const chunks = splitContent(content);
  const multi = chunks.length > 1;
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const partInfo = multi ? { index: i + 1, total: chunks.length } : null;
    const messages = [
      { role: 'system', content: buildSystemPrompt(targetLang) },
      {
        role: 'user',
        content: buildUserPrompt(title, excerpt, chunks[i], targetLang, partInfo),
      },
    ];
    const raw = await chat({
      baseUrl: env.TRANSLATE_BASE_URL,
      apiKey,
      model: env.TRANSLATE_MODEL || 'deepseek-chat',
      messages,
    });
    results.push(normalizeTranslation(extractJSON(raw)));
  }

  if (results.length === 1) return { ...results[0], parts: 1 };
  return {
    title: results[0].title,
    excerpt: results[0].excerpt,
    content: results.map((r) => r.content).join('\n\n'),
    parts: results.length,
  };
}
