#!/usr/bin/env node

/**
 * AI 科技视频号极简起号流水线 - 自动化素材与公开资讯抓取工具
 * 
 * 强制依赖: opencli (已全局安装)
 * 用法:
 *   node scripts/fetch-content.mjs --url "https://x.com/..." --out-dir "tmp/article_01"
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function printHelp() {
  console.log(`
使用方法:
  node scripts/fetch-content.mjs --url <URL> [选项]

参数说明:
  --url, -u       [必填] 要抓取的公开资讯链接 (如推特推文、技术博客、热点快讯网页)
  --out-dir, -o   [可选] 素材与截图输出目录 (默认: tmp/fast-news-assets)
  --timeout, -t   [可选] 页面加载等待时间毫秒数 (默认: 5000)
  --help, -h      显示本帮助信息
  `);
}

const args = process.argv.slice(2);
let targetUrl = '';
let outDir = 'tmp/fast-news-assets';
let waitMs = 5000;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--url' || arg === '-u') {
    targetUrl = args[++i];
  } else if (arg === '--out-dir' || arg === '-o') {
    outDir = args[++i];
  } else if (arg === '--timeout' || arg === '-t') {
    waitMs = parseInt(args[++i], 10);
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

if (!targetUrl) {
  console.error("❌ 错误: 未指定目标链接！请使用 --url 传入资讯链接。");
  printHelp();
  process.exit(1);
}

// 检查 opencli 是否存在
try {
  execSync('which opencli', { stdio: 'ignore' });
} catch {
  console.error("❌ 错误: 系统中未检测到 opencli！请先执行: npm install -g opencli");
  process.exit(1);
}

const absoluteOutDir = path.resolve(process.cwd(), outDir);
fs.mkdirSync(absoluteOutDir, { recursive: true });

console.log(`>>> [1/3] 正在通过 opencli 启动无感浏览器访问: ${targetUrl}`);
try {
  execSync(`opencli browser open "${targetUrl}"`, { stdio: 'inherit' });
} catch (err) {
  console.error("⚠️ 警告: opencli 页面打开时出现告警，继续尝试后续步骤...");
}

console.log(`>>> [2/3] 等待页面渲染加载 (${waitMs}ms)...`);
try {
  execSync(`opencli browser wait ${waitMs}`, { stdio: 'inherit' });
} catch {}

const screenshotPath = path.join(absoluteOutDir, 'source-long-card.png');
console.log(`>>> [3/3] 正在截取全幅高清推文/长图并保存至: ${screenshotPath}`);
try {
  execSync(`opencli browser screenshot "${screenshotPath}" --full-page`, { stdio: 'inherit' });
} catch (err) {
  console.log("⚠️ 全幅截图异常，尝试常规视窗截取兜底...");
  execSync(`opencli browser screenshot "${screenshotPath}"`, { stdio: 'inherit' });
}

// 尝试提取核心文本并沉淀到 metadata.json
const metadataPath = path.join(absoluteOutDir, 'metadata.json');
try {
  const pageState = execSync(`opencli browser state`, { encoding: 'utf-8' });
  const meta = {
    url: targetUrl,
    fetchedAt: new Date().toISOString(),
    screenshot: screenshotPath,
    title: pageState.slice(0, 100).replace(/\n/g, ' ')
  };
  fs.writeFileSync(metadataPath, JSON.stringify(meta, null, 2), 'utf-8');
  console.log(`✅ 抓取完成！素材已落盘: ${metadataPath}`);
} catch {
  console.log(`✅ 抓取完成！长图素材已保存: ${screenshotPath}`);
}
