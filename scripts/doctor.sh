#!/usr/bin/env bash
# AI 科技视频号极简起号流水线 - 自动化工具检测与自愈安装脚本 (Auto-Healing Doctor)

set -e

AUTO_INSTALL=true
if [ "$1" == "--check-only" ]; then
    AUTO_INSTALL=false
fi

echo "=========================================================="
echo "  [ai-tech-fast-growth] 环境就绪自检与工具自愈安装程序"
echo "=========================================================="

MISSING_REQUIRED=0

# 1. 基础运行环境检查
echo -n "1. 检查 Node.js 运行环境 ... "
if command -v node >/dev/null 2>&1; then
    echo "✅ 已就绪 ($(node -v))"
else
    echo "❌ 未检测到 Node.js！"
    echo "   [提示] 运行短视频自动化需要 Node.js (推荐 v18+)，请前往 https://nodejs.org 下载安装。"
    MISSING_REQUIRED=1
fi

echo -n "2. 检查 Python 3 渲染环境 ... "
if command -v python3 >/dev/null 2>&1; then
    echo "✅ 已就绪 (Python $(python3 -V 2>&1 | awk '{print $2}'))"
else
    echo "❌ 未检测到 Python 3！"
    echo "   [提示] 请前往 https://python.org 安装 Python 3。"
    MISSING_REQUIRED=1
fi

echo -n "3. 检查 ffmpeg 多媒体音视频引擎 ... "
if command -v ffmpeg >/dev/null 2>&1; then
    echo "✅ 已就绪"
else
    echo "⚠️ 未安装 ffmpeg (合成高清视频必须)"
    if [ "$AUTO_INSTALL" = true ] && command -v brew >/dev/null 2>&1; then
        echo "   >>> 正在尝试通过 Homebrew 自动为您安装 ffmpeg..."
        brew install ffmpeg || echo "   自动安装受限，请在终端执行: brew install ffmpeg"
    else
        echo "   [提示] macOS 用户请在终端运行: brew install ffmpeg"
        echo "          Windows 用户请前往 https://ffmpeg.org 下载并将 bin 加入系统环境变量。"
    fi
    MISSING_REQUIRED=1
fi

# 2. 核心强制工具：opencli (强依赖 · 自动安装逻辑)
echo -n "4. 检查 opencli (全网资讯与全幅推文长图抓取底座) ... "
if command -v opencli >/dev/null 2>&1; then
    echo "✅ 已就绪 ($(opencli -V 2>/dev/null || echo '最新版'))"
else
    echo "⚠️ 未检测到 opencli (强制核心依赖)"
    if [ "$AUTO_INSTALL" = true ] && command -v npm >/dev/null 2>&1; then
        echo "   >>> 正在自动为您一键安装 opencli，请稍候..."
        npm install -g opencli || {
            echo "   全局安装权限受阻，正在尝试本地免提权安装..."
            npm install opencli
        }
        if command -v opencli >/dev/null 2>&1; then
            echo "   🎉 opencli 自动安装成功！"
        else
            echo "   ❌ 自动安装失败，请手动在终端执行: npm install -g opencli"
            MISSING_REQUIRED=1
        fi
    else
        echo "   [必须执行] 请在终端运行以下单行命令进行安装："
        echo "   npm install -g opencli"
        MISSING_REQUIRED=1
    fi
fi

# 3. 可选增强工具状态与交互提示
echo "----------------------------------------------------------"
echo "5. 可选增强组件状态检测与配置提示 (有则加速，无则平滑降级):"

# Jev 结构化对抗评审模型
echo -n "   - Jev (极速台词对抗评审模型) ... "
if command -v jev >/dev/null 2>&1; then
    echo "✅ 已就绪 (已激活毫秒级台词对抗审查)"
else
    echo "⚪ 未配置"
    echo "     [说明] Jev 为可选增强项。若无需配置，系统将【自动平滑降级】为内置的大模型提示词免费自审，零成本且无需购买任何密钥；"
    echo "     [若需安装] 如需体验极速审查，可运行: npm install -g @typesafe-ai/jev (需自行配置环境变量授权)"
fi

# Ego 真实浏览器自动化驱动
echo -n "   - Ego / ego-browser (真实浏览器会话驱动) ... "
if command -v ego >/dev/null 2>&1 || [ -d "$HOME/.ego" ]; then
    echo "✅ 已就绪 (支持真实用户浏览器会话接管)"
else
    echo "⚪ 未配置"
    echo "     [说明] Ego 为可选增强项。若未配置，系统将【自动平滑降级】为 opencli 的无头静默浏览器模式，完全满足全部公开抓取需求。"
fi

echo "=========================================================="
if [ $MISSING_REQUIRED -ne 0 ]; then
    echo "❌ 检查未通过：存在关键基础依赖缺失，请按照上方提示操作后重新运行本脚本。"
    exit 1
else
    echo "✅ 恭喜！核心环境与 opencli 自动化工具已 100% 准备就绪！"
    echo "   您可以直接下达一条指令，开启极简快讯视频的端到端制作！"
    exit 0
fi
