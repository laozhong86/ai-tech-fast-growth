# 🚀 AI Tech Fast Growth (AI 科技视频号极简起号流水线)

> **面向零基础创作者、个人超级个体与社媒团队的开源产品级起号神器**。  
> 彻底解耦付费会员限制，5 分钟极速出片，依靠 5~13 秒超高完播率撬动视频号公域推流池。

---

## 🌟 为什么要做这个开源项目？

很多创作者想要入局微信视频号，但常遇到两大死穴：
1. **制作太重**：真人出镜要化妆搭光，口播要背台词剪气口，搬砖混剪费时费力，几天就断更；
2. **数据源门槛高**：市面上很多工具依赖付费会员或封闭抓取，普通粉丝无法低成本复现。

**本项目完全打破信息差与会员壁垒**：
* **公开免会员数据源**：接入全网公开免费的一手科技资讯与大佬推文；
* **极简轮播打法**：5~13 秒极短时长，0 露脸、0 配音，完播率天生逼近 100% 甚至自动循环 2~3 轮，直接引爆算法初审池；
* **社交裂变杠杆**：深谙视频号“转发 > 点赞”的生态本质，主打“顺手转到微信好友和朋友圈”的硬核科技谈资；
* **单指令端到端出片**：一条指令全自动完成网页截长图、文案提炼、视窗滚动合成、防黑屏质检到草稿箱就绪；
* **开源绝对零密钥**：全代码零私有凭据，核心依赖自动安装，高级工具零门槛平滑降级，粉丝开箱即用！

---

## 🛠️ 核心架构与黑科技

| 核心模块 | 技术实现 | 创作者收益 |
| :--- | :--- | :--- |
| **全幅抓取底座** | 强制集成 `opencli` 无感命令行浏览器 | 自动抓取目标推文或长文完整高精度截图，杜绝手工拼贴 |
| **视窗动态自适应** | 算法智能识别宽高比，长图长文自动等宽平滑下滚扫视 | 彻底告别长截图等比压缩成细条文字不可读的致命缺陷 |
| **自包含视听资产** | 内置 1080×1920 规则低对比微动态背景 ＋ 优质高保真纯乐 BGM | 纯静态自包含，不依赖任何外部私有素材库，开箱即出片 |
| **首帧多维质检** | 自动抽检第 0 秒画面亮度与色彩丰富度 | 杜绝片头淡入导致的“空洞黑屏封面”，保障信息流点击率 |
| **保命避坑体系** | 内置二级卡审应对法与违规设私防删号降权指南 | 护航账号度过十万、五十万播放复审门槛，保护账号长期权重 |

---

## ⚡ 极速上手 (Quick Start)

### 1. 克隆与环境自检 (一键自愈)
打开终端，进入项目目录执行环境检查：
```bash
npm run doctor
# 或者直接执行
bash scripts/doctor.sh
```
> 💡 **智能自愈**：若检测到核心依赖 `opencli` 未安装，脚本会自动尝试为您一键安装！

### 2. 单指令端到端一键出片
看到任意公开一手推文或前沿热点，只需输入单行指令：
```bash
npm run produce -- --url "https://x.com/username/status/123456"
```
**流水线将在 1 分钟内全自动完成**：
1. 抓取推文并截取超清全幅长图；
2. 提炼双行痛点大字标题与三段式彩色表情摘要；
3. 渲染生成 1080×1920 竖屏自适应滚动高清成片；
4. 完成第 0 秒首帧图防黑屏质检；
5. 生成可直接发布的高清 MP4 与评论区置顶互动钩子！

---

## 📚 核心方法论与参考手册 (References)

项目内置了详尽的一线实操指南，按需阅读即可掌握全部起号精髓：

* 📖 [`references/free-datasources.md`](references/free-datasources.md) —— 免会员公开一手资讯渠道与选题三大原则（大佬、搞钱、反差）
* 📖 [`references/viral-growth-methodology.md`](references/viral-growth-methodology.md) —— 视频号内容供给倒挂与 5~13 秒超高完播率起号底层逻辑
* 📖 [`references/copywriting-and-prompts.md`](references/copywriting-and-prompts.md) —— 爆款文案生成 Prompt 协议与严谨去机器味语言审查表
* 📖 [`references/media-presentation-policy.md`](references/media-presentation-policy.md) —— 视窗智能展示与长图垂直匀速平滑扫视规范
* 📖 [`references/asset-rotator-and-library.md`](references/asset-rotator-and-library.md) —— 资产顺序轮换调度与公共背景/音轨管理规范
* 📖 [`references/first-frame-check.md`](references/first-frame-check.md) —— 首帧图亮度与色彩丰富度多维质检门禁
* 📖 [`references/publishing-and-risk-control.md`](references/publishing-and-risk-control.md) —— 微信视频号黄金发布窗口与二级卡审保命避坑手册
* 📖 [`references/monetization-and-revenue.md`](references/monetization-and-revenue.md) —— 官方创作者分成计划与评论区睡后收入变现指南
* 📖 [`references/tools-and-automation.md`](references/tools-and-automation.md) —— 自动化工具链架构、opencli 强制依赖与平滑降级契约

---

## 🛡️ 开源安全与零密钥承诺

* **绝对零密钥**：本仓库完全不包含任何明文 API 密钥、密码或私有凭据；
* **零消费门槛**：未配置任何商业辅助工具时，全流程自动使用内置的免费规则自审模式，普通用户无需花钱即可跑通完整起号闭环。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。欢迎广大创作者 Star、Fork 并提交优化建议！
