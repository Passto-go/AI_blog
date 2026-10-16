// 摘要功能单元测试（Node 原生 test runner）
// 运行：node --test scripts/test-excerpt.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localExcerpt, markdownToText } from '../src/lib/excerpt.js';

let pass = 0, fail = 0;
function check(name, fn) {
  try { fn(); pass++; console.log('PASS ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ' → ' + e.message); }
}

// 1. 正常长文：截到 ≤ 200 字，停在句界或省略号
check('正常长文截断（≤200字 + 停在句界或省略号）', () => {
  const long = Array.from({ length: 60 }, (_, i) => `这是第${i + 1}句话，用来把文章拉到很长很长。`).join('\n');
  const r = localExcerpt(long, 200);
  assert.ok(r.length <= 200, `长度 ${r.length} 超限`);
  assert.ok(/[。！？；…]$/.test(r), `应在句界或省略号处收尾，实际结尾：${r.slice(-4)}`);
  assert.ok(!r.includes('\n'), '不应含换行');
  assert.ok(!r.endsWith('。…'), '不应出现句号+省略号连用');
});

// 2. 过短：≤ 20 字返回空
check('过短文章（≤20字）返回空', () => {
  assert.equal(localExcerpt('你好世界', 200), '');
  assert.equal(localExcerpt('', 200), '');
  assert.equal(localExcerpt('# 只有标题\n\n```js\ncode\n```', 200), '');
});

// 3. 短于上限：全文作摘要，不加省略号
check('短于上限时全文作摘要（无省略号）', () => {
  const c = '这是一篇很短的文章，全文就这么几十个字，刚好可以做摘要。';
  assert.equal(localExcerpt(c, 200), c);
});

// 4. 首段即代码块 + 表格：必须跳过，从第一个有效叙述句开始
check('跳过代码块与表格，取叙述正文', () => {
  const c = `# 标题

\`\`\`bash
git clone https://example.com/repo.git
npm install
\`\`\`

| 列A | 列B |
|---|---|
| 1 | 2 |

真正的正文从这里开始。这是第二句话，继续补充内容让摘要更完整一些，凑够长度。`;
  const r = localExcerpt(c, 200);
  assert.ok(!r.includes('git clone'), '不应包含代码');
  assert.ok(!r.includes('列A'), '不应包含表格');
  assert.ok(!r.startsWith('标题'), '标题不应进入摘要（避免与正文连读）');
  assert.ok(r.startsWith('真正的正文从这里开始'), `应从叙述正文开始，实际：${r.slice(0, 20)}`);
});

// 5. 未闭合代码围栏（草稿写了一半）：不吞后续正文（刻意偏离 CommonMark，
//    摘要宁可多收一段正文，也不能把正文当代码丢掉；闭合围栏见 5b 仍正常丢弃）
check('未闭合代码围栏不吞掉后续正文', () => {
  const c = `开头的话在这里，先说清楚背景与目的，然后进入正题部分。

\`\`\`js
// 这段代码没有闭合
const x = 1;

后面的正文不应该被当成代码吃掉，这句话必须出现在摘要候选里，否则说明剥离逻辑有漏洞。`;
  const r = localExcerpt(c, 200);
  assert.ok(r.includes('后面的正文'), '围栏后的正文应保留');
  assert.ok(r.includes('开头的话'), '围栏前的正文应保留');
});

// 5b. 闭合代码围栏：内容必须丢弃
check('闭合代码围栏内容被丢弃', () => {
  const c = `开头的话在这里，先说清楚背景与目的，然后进入正题部分。

\`\`\`js
const secret = 'this-is-code';
\`\`\`

后面的正文在这里，需要多写几个字才能超过二十个字符的下限，否则会被当成过短文章返回空。`;
  const r = localExcerpt(c, 200);
  assert.ok(!r.includes('secret'), '闭合围栏内的代码不应出现');
  assert.ok(r.includes('后面的正文'), '围栏后的正文应保留');
});

// 6. 英文文章：空格词界硬截，不切断单词
check('英文硬截在词边界（不切断单词）', () => {
  const c = 'word '.repeat(100); // 500 chars, no sentence enders
  const r = localExcerpt(c, 200);
  assert.ok(r.length <= 201, `长度 ${r.length}`);
  assert.ok(!r.trimEnd().endsWith('wor'), '不应切断单词');
  assert.ok(r.endsWith('…'), '应加省略号');
});

// 7. Markdown 标记剥离：链接/加粗/图片/引用/列表
check('剥离行内 Markdown 标记', () => {
  const c = `> 引用的一句话，带**加粗**和[链接](https://a.com)。

- 列表项一，带\`行内代码\`和~~删除线~~
- 列表项二，带![图](https://a.com/x.png)图片`;
  const txt = markdownToText(c).join('\n');
  assert.ok(!txt.includes('**'), '加粗标记应剥离');
  assert.ok(!txt.includes('](') , '链接语法应剥离');
  assert.ok(!txt.includes('`'), '行内代码标记应剥离');
  assert.ok(!txt.includes('~~'), '删除线标记应剥离');
  assert.ok(!txt.includes('!['), '图片语法应剥离');
  assert.ok(txt.includes('加粗'), '文字内容应保留');
  assert.ok(txt.includes('链接'), '链接文字应保留');
  const r = localExcerpt(c, 200);
  assert.ok(!r.includes('https://'), '摘要不应含 URL');
});

// 8. 中日英三语 + 自定义长度 + 累积补足逻辑
check('日文句子边界与自定义长度生效', () => {
  const ja = 'これはテストです。'.repeat(30);
  const r = localExcerpt(ja, 100);
  assert.ok(r.length <= 100, `长度 ${r.length} 超限`);
  assert.ok(r.endsWith('。') || r.endsWith('…'), '日文应停在句界');
  assert.ok(!r.endsWith('。…'), '不应句号+省略号连用');
});

check('自定义长度 50 生效', () => {
  const c = '一二三四五六七八九十'.repeat(10);
  const r = localExcerpt(c, 50);
  assert.ok(r.length <= 50, `长度 ${r.length}`);
});

// 9. 首句极短时补足到 80%（避免摘要只有 10 个字）
check('首句过短时补足内容', () => {
  const c = '好。\n' + '这是一段用来补足长度的正文内容，需要多写几个字才能让补足逻辑生效。'.repeat(3);
  const r = localExcerpt(c, 200);
  assert.ok(r.length > 40, `摘要过短：${r.length} 字 → ${r}`);
});

console.log(`\n结果：${pass} 通过，${fail} 失败`);
process.exit(fail ? 1 : 0);
