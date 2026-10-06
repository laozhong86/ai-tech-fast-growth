#!/usr/bin/env python3
"""Render professional 1080x1920 typography overlay card for ai-tech-fast-growth.

Features:
- 1080x1920 RGBA transparent overlay
- Cutout hole at (72, 560, 936, 526) with 22px rounded corners & warm gold glow
- Headline (78px Bold) with Warm Gold (255, 196, 77) to Amber (245, 158, 11) gradient
- Subtitle (48px Bold) in pure white (250, 248, 245)
- 3 lines of summary bullets:
  * Native Apple Color Emoji (⚡ 💡 🎯)
  * Inline keywords (【...】or **...**) highlighted in Warm Gold (255, 196, 77)
  * Body text in warm white (240, 237, 232)
- Bottom comment hook badge
- Bottom 15% completely clean safe area
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
VIDEO_RECT = (72, 560, 936, 526)  # x, y, w, h
RADIUS = 22

WARM_GOLD = (255, 196, 77)
AMBER_ORANGE = (245, 158, 11)
WARM_WHITE = (240, 237, 232)
PURE_WHITE = (250, 248, 245)

FONT_PATH = "/System/Library/Fonts/Hiragino Sans GB.ttc"
EMOJI_PATH = "/System/Library/Fonts/Apple Color Emoji.ttc"

def get_font(size: int, bold: bool = False):
    return ImageFont.truetype(FONT_PATH, size, index=2 if bold else 0)

def get_emoji_font(size: int = 40):
    return ImageFont.truetype(EMOJI_PATH, size)

def draw_gradient_text(canvas: Image.Image, xy, text: str, font, c1, c2):
    mask = Image.new("L", canvas.size, 0)
    d = ImageDraw.Draw(mask)
    d.text(xy, text, font=font, fill=255, anchor="mm")
    bbox = mask.getbbox()
    if not bbox:
        return
    gx0, gx1 = bbox[0], bbox[2]
    g = np.zeros((canvas.size[1], canvas.size[0], 4), np.uint8)
    t = np.clip((np.arange(canvas.size[0]) - gx0) / max(1, gx1 - gx0), 0, 1)[None, :, None]
    g[..., :3] = (np.array(c1) * (1 - t) + np.array(c2) * t).astype(np.uint8)
    g[..., 3] = np.asarray(mask)
    canvas.alpha_composite(Image.fromarray(g, "RGBA"))

def parse_spans(text: str):
    # Matches either 【keyword】 or **keyword**
    parts = re.split(r"(【.*?】|\*\*.*?\*\*)", text)
    spans = []
    for p in parts:
        if not p:
            continue
        if p.startswith("【") and p.endswith("】"):
            spans.append((p[1:-1], True))
        elif p.startswith("**") and p.endswith("**"):
            spans.append((p[2:-2], True))
        else:
            spans.append((p, False))
    return spans

def render_overlay(article: dict, out_path: str):
    vx, vy, vw, vh = VIDEO_RECT
    box = (vx, vy, vx + vw - 1, vy + vh - 1)

    # Scrim background: dark translucent overlay to ensure contrast
    scrim = np.zeros((H, W, 4), dtype=np.uint8)
    # Top scrim
    for y in range(0, vy):
        a = int(210 - (y / max(1, vy)) * 100)
        scrim[y, :, :3] = [8, 10, 14]
        scrim[y, :, 3] = a
    # Middle zone behind media window
    for y in range(vy, min(H, vy + vh)):
        scrim[y, :, :3] = [8, 10, 14]
        scrim[y, :, 3] = 90
    # Bottom zone behind text
    for y in range(min(H, vy + vh), H):
        a = int(110 + ((y - (vy + vh)) / max(1, H - (vy + vh))) * 115)
        scrim[y, :, :3] = [6, 8, 12]
        scrim[y, :, 3] = a

    overlay = Image.fromarray(scrim, "RGBA")

    # Cut out the media hole completely (alpha = 0)
    hole_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(hole_mask).rounded_rectangle(box, radius=RADIUS, fill=255)
    overlay.putalpha(Image.composite(Image.new("L", (W, H), 0), overlay.getchannel("A"), hole_mask))

    # Soft warm gold glow around media window
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).rounded_rectangle(box, radius=RADIUS, outline=255, width=6)
    glow = glow.filter(ImageFilter.GaussianBlur(14))
    glow_rgba = Image.new("RGBA", (W, H), WARM_GOLD + (0,))
    glow_rgba.putalpha(Image.eval(glow, lambda v: int(v * 0.35)))
    glow_rgba.putalpha(Image.composite(Image.new("L", (W, H), 0), glow_rgba.getchannel("A"), hole_mask))
    overlay.alpha_composite(glow_rgba)

    d = ImageDraw.Draw(overlay)
    # Crisp 3px warm gold border
    d.rounded_rectangle(box, radius=RADIUS, outline=WARM_GOLD + (210,), width=3)

    # 1. Headline 1 (78px Bold with Warm Gold to Amber gradient)
    title_line1 = article.get("titleLine1", "科技前沿突破速递")
    title_fnt = get_font(74, True)
    draw_gradient_text(overlay, (W / 2, 330), title_line1, title_fnt, WARM_GOLD, AMBER_ORANGE)

    # 2. Headline 2 / Subtitle (48px Bold white)
    title_line2 = article.get("titleLine2", "核心技术全景拆解")
    if title_line2:
        sub_fnt = get_font(46, True)
        d.text((W / 2, 424), title_line2, font=sub_fnt, fill=PURE_WHITE, anchor="mm")

    # 3. Bullets (Apple Color Emoji + inline bold warm gold keywords)
    summary_items = article.get("summaryItems", [])
    default_emojis = ["⚡", "💡", "🎯"]
    f_kw = get_font(40, True)
    f_body = get_font(40, False)
    emo_fnt = get_emoji_font(40)

    for i, item in enumerate(summary_items[:3]):
        cy = 1186 + i * 108
        # Extract emoji if present at start
        emo_char = default_emojis[i]
        line_text = item.strip()
        for candidate in ["⚡", "💡", "🎯", "🔥", "🚀", "🤖", "🧠"]:
            if line_text.startswith(candidate):
                emo_char = candidate
                line_text = line_text[len(candidate):].strip()
                break

        # Draw emoji
        d.text((92, cy), emo_char, font=emo_fnt, embedded_color=True, anchor="lm")

        # Parse inline spans
        spans = parse_spans(line_text)
        cur_x = 152
        for chunk, is_kw in spans:
            if not chunk:
                continue
            cur_fnt = f_kw if is_kw else f_body
            cur_fill = WARM_GOLD if is_kw else WARM_WHITE
            d.text((cur_x, cy), chunk, font=cur_fnt, fill=cur_fill, anchor="lm")
            cur_x += d.textlength(chunk, font=cur_fnt)

    # 4. Comment hook at bottom (y ≈ 1520)
    comment_hook = article.get("commentHook", "")
    if comment_hook:
        badge_box = (82, 1495, 998, 1565)
        d.rounded_rectangle(badge_box, radius=12, fill=(20, 22, 28, 180), outline=(255, 196, 77, 80), width=1)
        hook_text = comment_hook.strip()
        has_bubble = False
        if hook_text.startswith("💬"):
            has_bubble = True
            hook_text = hook_text[1:].strip()

        hook_fnt = get_font(30, False)
        text_len = d.textlength(hook_text, font=hook_fnt)
        if has_bubble:
            emo_fnt_sm = get_emoji_font(32)
            total_w = 38 + text_len
            start_x = (W - total_w) / 2
            d.text((start_x, 1530), "💬", font=emo_fnt_sm, embedded_color=True, anchor="lm")
            d.text((start_x + 40, 1530), hook_text, font=hook_fnt, fill=(230, 226, 220), anchor="lm")
        else:
            d.text((W / 2, 1530), hook_text, font=hook_fnt, fill=(230, 226, 220), anchor="mm")

    overlay.save(out_path, "PNG")
    print(f"✅ 专业视觉排版卡已生成: {out_path}")

def main():
    parser = argparse.ArgumentParser(description="Render fast-news overlay card")
    parser.add_argument("--article", required=True, help="Path to article.json")
    parser.add_argument("--out", required=True, help="Path to output overlay-card.png")
    args = parser.parse_args()

    with open(args.article, "r", encoding="utf-8") as f:
        article = json.load(f)

    render_overlay(article, args.out)

if __name__ == "__main__":
    main()
