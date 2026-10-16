// 翻译分段结构完整性测试
// 运行：node scripts/test-translate-split.mjs
import { splitContent } from '../src/lib/translate.js';

let pass = 0, fail = 0;
function check(name, fn) {
  try { fn(); pass++; console.log('PASS ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ' → ' + e.message); }
}

/** 拼接后做结构断言：每片代码围栏必须成对、每个表格片必须有表头 */
function assertStructure(chunks, label) {
  const joined = chunks.join('\n\n');
  // 1) 代码围栏全局成对
  const fences = (joined.match(/^(`{3,}|~{3,})/gm) || []).length;
  if (fences % 2 !== 0) throw new Error(`${label}: 拼接后代码围栏不成对（${fences} 个）`);
  // 2) 每个表格片都有表头行与分隔行
  const blocks = joined.split(/\n\s*\n/);
  let tableBlocks = 0;
  for (const b of blocks) {
    const lines = b.split('\n').filter((l) => l.trim().startsWith('|'));
    if (lines.length < 2) continue;
    tableBlocks++;
    // 表头后必须紧跟分隔行（合法 Markdown 表格的最小要求）
    const sep = lines[1];
    if (!/^\s*\|?[\s:|-]+\|?\s*$/.test(sep)) {
      throw new Error(`${label}: 表格片缺少分隔行（表头被腰斩）→ 首两行: ${lines.slice(0, 2).map((l) => l.slice(0, 30)).join(' / ')}`);
    }
    // 每行列数一致性（容错：允许末列省略，但不得少于表头列数-1）
    const cols = (lines[0].match(/\|/g) || []).length;
    for (const l of lines) {
      const c = (l.match(/\|/g) || []).length;
      if (c < cols - 1) throw new Error(`${label}: 表格行列数畸变 → ${l.slice(0, 40)}`);
    }
  }
  return { joined, tableBlocks, fences };
}

// 1. 12 列大表 + 长文：不再出现 15 字残片，表格片自带表头
check('大表按行切分且每片带表头（无残片）', () => {
  const rows = ['| 日期 | 类别 | 明细 | 日元 | 港币 | 人民币 | 优惠 | 实付 | 汇率 | 支付 | 场所 | 备注 |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (let i = 0; i < 120; i++) {
    rows.push(`| 2026-08-${String((i % 28) + 1).padStart(2, '0')} | 饮食 | 某家店名的消费明细第${i}行 | ${1000 + i} | ${(1000 + i) / 20 | 0} | ${(1000 + i) / 20 * 0.47 | 0} | 0 | ${1000 + i} | 0.047 | 信用卡 | 东京 | 备注${i} |`);
  }
  const content = '# 赴日消费\n\n' + rows.join('\n') + '\n\n## 备注\n\n一些补充说明文字，需要超过二十个字符才算有效段落。';
  const chunks = splitContent(content, 4000);
  const r = assertStructure(chunks, '大表');
  console.log(`   ${chunks.length} 段，表格片 ${r.tableBlocks} 个`);
  // 只拦截结构残片：以表格行开头但内容极短的片（v1 的「| PT |」15 字问题）。
  // 末尾的标题+说明短文是合法单元，不算残片。
  for (const c of chunks) {
    const first = c.split('\n')[0].trim();
    if (first.startsWith('|') && c.length < 200) {
      throw new Error(`出现表格残片（${c.length} 字）：${JSON.stringify(c.slice(0, 40))}`);
    }
  }
  // 顺序不变：标题必须在第一段（曾出现标题被甩到末段的 bug）
  if (!chunks[0].includes('# 赴日消费')) throw new Error('内容顺序错乱：标题不在首段');
  if (r.tableBlocks < 2) throw new Error('预期大表被切成多片（每片带表头）');
});

// 2. 代码块绝不拆散
check('代码块整块进出（不被拆散）', () => {
  const code = Array.from({ length: 80 }, (_, i) => `const step${i} = "执行第${i}步操作，写长一点让代码块超过四千字符阈值";`).join('\n');
  const content = `# 部署教程\n\n前言部分，先交代背景与目标，这一段是正常的散文内容，需要足够长。\n\n\`\`\`bash\n${code}\n\`\`\`\n\n## 后续\n\n结尾说明文字，同样需要超过二十个字符才能通过过短校验。`;
  const chunks = splitContent(content, 4000);
  assertStructure(chunks, '代码块');
  const joined = chunks.join('\n\n');
  const inner = joined.match(/```bash\n[\s\S]*?\n```/);
  if (!inner) throw new Error('代码块不完整（围栏被拆散）');
  if (!inner[0].includes('const step0 =')) throw new Error('代码块开头丢失');
  if (!inner[0].includes('const step79 =')) throw new Error('代码块结尾丢失');
  console.log(`   → ${chunks.length} 段`);
});

// 3. 正常长文：标题边界切分，无结构破坏
check('标题密集长文按 ## 边界切分', () => {
  const secs = Array.from({ length: 12 }, (_, i) =>
    `## 第${i + 1}节标题\n\n` + `这是第${i + 1}节的正文内容，需要写得足够长以触发分段逻辑，多写几个字铺满阈值。`.repeat(20)
  );
  const chunks = splitContent(secs.join('\n\n'), 4000);
  assertStructure(chunks, '标题长文');
  console.log(`   → ${chunks.length} 段`);
  if (chunks.length < 2) throw new Error('长文未触发分段');
  // 每段应以 ## 或正文开头，不应以半个标题开头
  for (const c of chunks) {
    if (/^#\s?\S*$/.test(c.split('\n')[0]) && !/^#{1,6}\s+\S/.test(c.split('\n')[0])) {
      throw new Error(`段首是残缺标题：${JSON.stringify(c.split('\n')[0])}`);
    }
  }
});

// 4. 短文不切
check('短文原样返回（不切分）', () => {
  const c = '# 标题\n\n很短的内容。';
  const r = splitContent(c, 4000);
  if (r.length !== 1) throw new Error(`应返回 1 段，实际 ${r.length}`);
  if (r[0] !== c) throw new Error('内容被改动');
});

// 5. 未闭合代码围栏按散文处理（不吞后续正文）
check('未闭合围栏不吞后续正文', () => {
  const c = `# 标题\n\n开头正文，需要超过二十个字符才能通过过短校验逻辑。\n\n\`\`\`js\nconst x = 1;\n\n后续正文也必须保留，否则说明剥离逻辑有漏洞，多写几个字。`;
  const chunks = splitContent(c, 4000);
  const joined = chunks.join('\n\n');
  if (!joined.includes('后续正文也必须保留')) throw new Error('围栏后正文丢失');
});

// 6. 空内容 / 纯表格 / 纯代码
check('边界输入不崩', () => {
  if (splitContent('', 4000).length !== 1) throw new Error('空内容应返回 1 段');
  const onlyTable = '| a | b |\n|---|---|\n| 1 | 2 |';
  const r = splitContent(onlyTable, 4000);
  if (r[0] !== onlyTable) throw new Error('纯表格被改动');
  const big = '| a | b |\n|---|---|\n' + Array.from({ length: 200 }, (_, i) => `| ${i} | ${'x'.repeat(30)}${i} |`).join('\n');
  const rb = splitContent(big, 2000);
  assertStructure(rb, '纯大表');
  console.log(`   → 纯大表切成 ${rb.length} 片`);
});

// 7. 拼接不变量：总内容不丢失（表格行数守恒）
check('表格行数守恒（无行丢失）', () => {
  const rows = ['| 日期 | 金额 |', '|---|---|'];
  for (let i = 0; i < 300; i++) rows.push(`| 2026-08-${String((i % 28) + 1).padStart(2, '0')} | ${1000 + i} |`);
  const content = '# 表\n\n' + rows.join('\n');
  const chunks = splitContent(content, 3000);
  const joined = chunks.join('\n\n');
  const origRows = rows.filter((r) => r.startsWith('| 2026-08-')).length; // 只数数据行
  const outRows = (joined.match(/^\| 2026-08-/gm) || []).length;
  if (outRows !== origRows) throw new Error(`数据行丢失：原文 ${origRows}，输出 ${outRows}`);
  console.log(`   → 300 行数据完整保留，切成 ${chunks.length} 片`);
});

console.log(`\n结果：${pass} 通过，${fail} 失败`);
process.exit(fail ? 1 : 0);
