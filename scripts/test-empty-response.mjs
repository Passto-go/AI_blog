// 验证：推理型模型「思考吃光输出预算」导致 content 为空时的自愈能力。
// 复现真实场景：GLM-4.7-Flash 先输出 reasoning_content，max_tokens 不够时
// 返回 HTTP 200 + content:"" + finish_reason:"length"（不报错，最容易误判为端点故障）。
//
// 运行：node scripts/test-empty-response.mjs

import http from 'node:http';
import { chat } from '../src/lib/translate.js';

let pass = 0;
let fail = 0;
function check(name, cond, extra = '') {
  if (cond) {
    pass++;
    console.log(`PASS ${name}${extra ? '  ' + extra : ''}`);
  } else {
    fail++;
    console.log(`FAIL ${name}${extra ? '  ' + extra : ''}`);
  }
}

/** 起一个 mock 服务：按请求体里的 max_tokens 决定「思考占多少、答案有没有」 */
function mockServer(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        const body = JSON.parse(raw || '{}');
        const out = handler(body);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(out));
      });
    });
    srv.listen(0, () => resolve({ srv, port: srv.address().port }));
  });
}

const BASE = { model: 'glm-4.7-flash', messages: [{ role: 'user', content: '写摘要' }] };

// ---------- 场景 1：预算 1024 不足 → 自动翻倍后成功 ----------
{
  const { srv, port } = await mockServer((body) => {
    const mt = body.max_tokens;
    // 模拟：推理需要约 1500 token。预算 > 2000 才有答案
    if (mt <= 2000) {
      return {
        choices: [
          {
            message: { role: 'assistant', content: '', reasoning_content: 'x'.repeat(1500) },
            finish_reason: 'length',
          },
        ],
      };
    }
    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: '{"excerpt":"这是一段摘要。"}',
            reasoning_content: 'x'.repeat(1500),
          },
          finish_reason: 'stop',
        },
      ],
    };
  });
  const t0 = Date.now();
  const out = await chat({
    baseUrl: `http://127.0.0.1:${port}`,
    apiKey: 'k',
    ...BASE,
    maxTokens: 1024,
  });
  check('预算不足时自动提升预算并拿到答案', out.includes('这是一段摘要'), `${Date.now() - t0}ms`);
  srv.close();
}

// ---------- 场景 2：预算翻到上限仍不足 → 报错指明是「预算」问题 ----------
{
  const { srv, port } = await mockServer(() => ({
    choices: [
      { message: { role: 'assistant', content: '', reasoning_content: 'x'.repeat(9999) }, finish_reason: 'length' },
    ],
  }));
  let err = '';
  try {
    await chat({ baseUrl: `http://127.0.0.1:${port}`, apiKey: 'k', ...BASE, maxTokens: 1024 });
  } catch (e) {
    err = e.message;
  }
  check('预算耗尽时报错文案指向「输出预算」', /输出预算|tokens/.test(err), `→ ${err.slice(0, 46)}`);
  check('不再使用笼统的「翻译服务返回为空」', !/翻译服务返回为空/.test(err));
  srv.close();
}

// ---------- 场景 3：只回思考不回答案（finish_reason=stop） ----------
{
  const { srv, port } = await mockServer(() => ({
    choices: [
      { message: { role: 'assistant', content: '', reasoning_content: '想了半天' }, finish_reason: 'stop' },
    ],
  }));
  let err = '';
  try {
    await chat({ baseUrl: `http://127.0.0.1:${port}`, apiKey: 'k', ...BASE, maxTokens: 4096 });
  } catch (e) {
    err = e.message;
  }
  check('只回思考不回答案时提示「只返回了思考过程」', /只返回了思考过程/.test(err), `→ ${err.slice(0, 40)}`);
  srv.close();
}

// ---------- 场景 4：正常返回不受影响 ----------
{
  const { srv, port } = await mockServer(() => ({
    choices: [{ message: { role: 'assistant', content: '{"excerpt":"正常。"}' }, finish_reason: 'stop' }],
  }));
  const out = await chat({ baseUrl: `http://127.0.0.1:${port}`, apiKey: 'k', ...BASE, maxTokens: 4096 });
  check('正常返回直通不重试', out === '{"excerpt":"正常。"}');
  srv.close();
}

// ---------- 场景 5：翻倍重试次数有上限，不会无限循环 ----------
{
  let calls = 0;
  const { srv, port } = await mockServer(() => {
    calls++;
    return {
      choices: [
        { message: { role: 'assistant', content: '', reasoning_content: 'x'.repeat(9999) }, finish_reason: 'length' },
      ],
    };
  });
  try {
    await chat({ baseUrl: `http://127.0.0.1:${port}`, apiKey: 'k', ...BASE, maxTokens: 1000 });
  } catch {
    /* 预期抛错 */
  }
  check('重试次数有界（首次 + 3 次翻倍 = 4 次调用）', calls === 4, `实际 ${calls} 次`);
  srv.close();
}

// ---------- 场景 6：本地截取兜底可用（摘要链路最终防线） ----------
{
  const { localExcerpt } = await import('../src/lib/excerpt.js');
  const doc = '# 标题\n\n' + '这是正文的一段内容，用来验证本地截取兜底逻辑能否正常工作。'.repeat(20);
  const ex = localExcerpt(doc, 200);
  check('AI 全挂时本地截取仍能产出摘要', ex.length > 0 && ex.length <= 200, `${ex.length} 字`);
}

console.log(`\n结果：${pass} 通过，${fail} 失败`);
process.exit(fail ? 1 : 0);
