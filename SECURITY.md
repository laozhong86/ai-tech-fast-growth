# 安全与数据流说明 · Security & Data Flow

本文件逐条列出本项目会做什么、不会做什么，欢迎用你的智能助手对照 `scripts/` 源码逐条核验。

## 一句话结论

- 视频合成、首帧检测、文案生成全部在你的电脑本地完成。
- 不需要任何商业 API Key、账号密码或 Cookie。
- 没有任何统计上报，不向作者服务器发送任何数据。
- 不做任何自动发布，成片只保存在你本地。

## 会访问的网络地址（穷举）

| 场景 | 地址 | 发送内容 | 来源 |
| --- | --- | --- | --- |
| 拉取 AI 热点资讯 | `https://aihot.news/api/v1/agent/*` | 只有查询参数（关键词或条数），无任何个人信息 | `scripts/fetch-aihot.mjs` |
| 抓取你指定的页面长图 | 你自己传入的网址 | 由本地 opencli 浏览器打开页面并截图，截图只保存在本地 | `scripts/fetch-content.mjs` |
| 安装缺失依赖（可选） | Homebrew / npm 官方源 | 安装 ffmpeg、opencli | `scripts/doctor.sh` |

除上表外，脚本不会主动发起其他网络请求。

## 自动安装行为

`npm run doctor` 发现缺少 ffmpeg 或 opencli 时，会尝试通过 Homebrew / npm 自动安装。
不想自动安装，请使用 `bash scripts/doctor.sh --check-only`，只检查不安装。

## 可选增强组件

Jev、ego-browser 等增强组件默认不启用；未安装时自动降级为内置流程，不会索要任何密钥。
如你自行安装并配置它们，相关数据流以对应工具自己的说明为准。

## 本地文件

- 成片、长图、首帧图写入 `tmp/` / `output/` 目录，已在 `.gitignore` 中排除，不会被误提交。
- `.env`、`*.key`、`*.pem` 等敏感文件同样被 `.gitignore` 排除。

## 报告安全问题

发现安全问题请通过 GitHub 私密漏洞报告提交：
https://github.com/laozhong86/ai-tech-fast-growth/security/advisories/new

请勿在公开 Issue 中披露未修复的漏洞细节。
