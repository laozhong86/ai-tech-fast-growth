#!/usr/bin/env node

/**
 * AI 科技短视频流水线 - 纯轻量 AI HOT 免依赖数据抓取工具 (Lightweight Fetcher)
 * 
 * 核心特性:
 * 1. 零 opencli 依赖：纯 Node.js 原生 fetch，无需安装无头浏览器，零配置运行；
 * 2. 官方接口对齐：直接对接 aihot.news 官方 Agent 匿名免密接口 (/api/v1/agent)；
 * 3. 结构化输出：自动抓取最新热点/关键词搜索，提取标题、摘要与一手配图，并沉淀 metadata.json。
 * 
 * 用法:
 *   node scripts/fetch-aihot.mjs --latest 5 --out-dir "tmp/aihot-test"
 *   node scripts/fetch-aihot.mjs --search "DeepSeek" --out-dir "tmp/aihot-test"
 */

import fs from 'fs';
import path from 'path';

function printHelp() {
  console.log(`
使用方法:
  node scripts/fetch-aihot.mjs [选项]

参数说明:
  --latest, -l    [可选] 抓取过去 24 小时精选前 N 条 (默认: 5)
  --search, -s    [可选] 按关键词搜索最近 7 天一手资讯 (如 --search "DeepSeek")
  --hot           [可选] 抓取当前实时热点排行榜
  --out-dir, -o   [可选] 输出素材与元数据目录 (默认: tmp/aihot-assets)
  --help, -h      显示帮助信息
  `);
}

const args = process.argv.slice(2);
let mode = 'latest';
let limit = 5;
let searchQuery = '';
let outDir = 'tmp/aihot-assets';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--latest' || arg === '-l') {
    mode = 'latest';
    if (args[i + 1] && !args[i + 1].startsWith('-')) {
      limit = parseInt(args[++i], 10);
    }
  } else if (arg === '--search' || arg === '-s') {
    mode = 'search';
    searchQuery = args[++i] || '';
  } else if (arg === '--hot') {
    mode = 'hot';
  } else if (arg === '--out-dir' || arg === '-o') {
    outDir = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

const targetDir = path.resolve(process.cwd(), outDir);
fs.mkdirSync(targetDir, { recursive: true });

let targetUrl = '';
if (mode === 'search') {
  if (!searchQuery) {
    console.error("❌ 错误: --search 模式必须指定搜索关键词！");
    process.exit(1);
  }
  targetUrl = `https://aihot.news/api/v1/agent/search?q=${encodeURIComponent(searchQuery)}`;
} else if (mode === 'hot') {
  targetUrl = `https://aihot.news/api/v1/agent/hot`;
} else {
  targetUrl = `https://aihot.news/api/v1/agent/latest?limit=${limit}`;
}

console.log(`>>> 正在通过原生网络直连 AI HOT 官方数据接口: ${targetUrl}`);

try {
  const resp = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'ai-tech-fast-growth/1.0.0 (https://github.com/laozhong86/ai-tech-fast-growth)'
    }
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
  }

  const markdownText = await resp.text();
  console.log("✅ 成功获取 AI HOT 官方一手资讯！");

  // 解析返回的 Markdown 结构
  const items = [];
  const itemRegex = /\[([^\]]+)\]\((https:\/\/aihot\.news\/items\/[^\)]+)\)\n\s*([^·\n]+)·[^\n]*\n\s*摘要：([^\n]+)(?:\n\s*推荐理由：([^\n]+))?(?:\n\s*原文：([^\n]+))?/g;

  let match;
  while ((match = itemRegex.exec(markdownText)) !== null) {
    items.push({
      title: match[1].trim(),
      aihotUrl: match[2].trim(),
      source: match[3].trim(),
      summary: match[4].trim(),
      reason: match[5] ? match[5].trim() : "",
      originalUrl: match[6] ? match[6].trim() : ""
    });
  }

  const resultData = {
    mode,
    fetchedAt: new Date().toISOString(),
    query: searchQuery || null,
    totalParsed: items.length,
    items: items.length > 0 ? items : [{ rawMarkdown: markdownText.slice(0, 1000) }]
  };

  const jsonOut = path.join(targetDir, 'aihot-feed.json');
  fs.writeFileSync(jsonOut, JSON.stringify(resultData, null, 2), 'utf-8');
  console.log(`📦 结构化资讯已沉淀至: ${jsonOut}`);

  if (items.length > 0) {
    console.log(`\n🎉 解析出 ${items.length} 条一手热点题材：`);
    items.forEach((it, idx) => {
      console.log(`  [${idx + 1}] ${it.title} (${it.source})`);
    });
  }
} catch (err) {
  console.error(`❌ 获取 AI HOT 资讯失败: ${err.message}`);
  process.exit(1);
}
