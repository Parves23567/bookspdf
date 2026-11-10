"""
Islamic PWA Icon Generator — Pillow-based pixel rendering
Produces vivid emerald green icons with golden crescent, star, and open Quran.
"""

import math
import os
from PIL import Image, ImageDraw, ImageFilter

os.makedirs("public/icons", exist_ok=True)

# ── Colour palette ──────────────────────────────────────────────────────────
BG_TOP       = (4,  120,  87)   # #047857 deep emerald
BG_MID       = (5,  150, 105)   # #059669 emerald
BG_BOT       = (6,   78,  59)   # #064e3b dark emerald
GOLD_LIGHT   = (254, 243, 199)  # #FEF3C7
GOLD_MID     = (251, 191,  36)  # #FBBF24
GOLD_DARK    = (180, 83,   9)   # #B45309
WHITE        = (255, 255, 255)
CREAM        = (255, 253, 240)  # warm page colour
PAGE_LINE    = (5,  120,  87)   # green Quran lines
BORDER_GOLD  = (234, 179,   8)  # #EAB308
REHAL_BROWN  = (120,  53,  15)  # #78350F

def make_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size / 512          # scale factor (all coords designed at 512)

    def px(v): return int(v * s)
    def pt(x, y): return (px(x), px(y))

    # ── 1. Rounded-square background (squircle style) ───────────────────────
    r = px(96)              # corner radius
    # draw vertical + horizontal rects for fill, then circles for corners
    d.rectangle([px(r), 0, size - px(r), size], fill=BG_MID)
    d.rectangle([0, px(r), size, size - px(r)], fill=BG_MID)
    d.ellipse([0, 0, px(r*2), px(r*2)], fill=BG_MID)
    d.ellipse([size - px(r*2), 0, size, px(r*2)], fill=BG_MID)
    d.ellipse([0, size - px(r*2), px(r*2), size], fill=BG_MID)
    d.ellipse([size - px(r*2), size - px(r*2), size, size], fill=BG_MID)

    # Subtle vertical gradient — paint horizontal strips
    for y in range(size):
        t = y / size
        rv = int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t)
        gv = int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t)
        bv = int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t)
        # only paint inside the rounded rect (simple clamp)
        x0 = 0 if px(r) <= y <= size - px(r) else int(px(r) * (1 - abs((y - size/2) / (size/2 - px(r) + 0.01))))
        x0 = max(0, x0)
        if y < px(r):
            chord = int(math.sqrt(max(0, (px(r))**2 - (y - px(r))**2)))
            x0 = px(r) - chord
        elif y > size - px(r):
            chord = int(math.sqrt(max(0, (px(r))**2 - (y - (size - px(r)))**2)))
            x0 = px(r) - chord
        d.line([(x0, y), (size - x0, y)], fill=(rv, gv, bv))

    # ── 2. Golden outer border ──────────────────────────────────────────────
    bw = px(5)
    br = px(90)
    for w in range(bw):
        alpha = int(220 * (1 - w / bw))
        d.rounded_rectangle([w, w, size - w, size - w], radius=br - w,
                             outline=(*GOLD_MID[:3], alpha), width=1)

    # ── 3. Inner dashed border (simulate with dotted rounded rect) ─────────
    d.rounded_rectangle([px(32), px(32), size - px(32), size - px(32)],
                        radius=px(76), outline=(*GOLD_LIGHT, 60), width=px(2))

    # ── 4. Crescent moon ────────────────────────────────────────────────────
    cx, cy, R = px(256), px(130), px(68)   # outer circle centre & radius
    offset_x, offset_y, r2 = px(38), px(-20), px(56)  # inner cut circle

    # outer circle (filled gold)
    d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=GOLD_MID)

    # inner cut-out circle (eraser): slightly shifted right+up → crescent shape
    # We'll overdraw with background colour — sample centre pixel colour
    bg_sample = img.getpixel((cx, cy))[:3]
    # approximate bg at top‑centre
    bg_cut = (int(BG_TOP[0]*0.5 + BG_MID[0]*0.5),
              int(BG_TOP[1]*0.5 + BG_MID[1]*0.5),
              int(BG_TOP[2]*0.5 + BG_MID[2]*0.5))
    d.ellipse([cx + offset_x - r2, cy + offset_y - r2,
               cx + offset_x + r2, cy + offset_y + r2], fill=bg_cut)

    # Thin gold outline on crescent
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=GOLD_LIGHT, width=px(2))

    # ── 5. Eight-pointed Islamic star (Rub el Hizb) ─────────────────────────
    sx, sy = px(324), px(112)
    sr = px(28)
    pts = []
    for i in range(16):
        angle = math.radians(i * 22.5 - 90)
        rr = sr if i % 2 == 0 else int(sr * 0.48)
        pts.append((sx + rr * math.cos(angle), sy + rr * math.sin(angle)))
    d.polygon(pts, fill=GOLD_MID, outline=GOLD_LIGHT)
    # centre dot
    d.ellipse([sx - px(6), sy - px(6), sx + px(6), sy + px(6)], fill=BG_MID)

    # ── 6. Wooden Rehal (book stand) ────────────────────────────────────────
    # Left leg
    d.polygon([pt(155, 395), pt(220, 328), pt(244, 352), pt(185, 420)],
              fill=REHAL_BROWN, outline=GOLD_MID)
    # Right leg
    d.polygon([pt(357, 395), pt(292, 328), pt(268, 352), pt(327, 420)],
              fill=REHAL_BROWN, outline=GOLD_MID)
    # Central connecting arch
    d.polygon([pt(226, 356), pt(256, 335), pt(286, 356), pt(275, 374), pt(256, 356), pt(237, 374)],
              fill=GOLD_MID)

    # ── 7. Open Quran pages ─────────────────────────────────────────────────
    # Green book covers (behind pages)
    d.polygon([pt(255, 240), pt(180, 218), pt(100, 232), pt(68, 348), pt(140, 334), pt(255, 356)],
              fill=(4, 78, 59), outline=GOLD_MID)
    d.polygon([pt(257, 240), pt(332, 218), pt(412, 232), pt(444, 348), pt(372, 334), pt(257, 356)],
              fill=(4, 78, 59), outline=GOLD_MID)

    # Cream/warm-white page faces
    d.polygon([pt(252, 232), pt(180, 212), pt(102, 226), pt(74, 338), pt(148, 324), pt(252, 344)],
              fill=CREAM, outline=GOLD_MID)
    d.polygon([pt(260, 232), pt(332, 212), pt(410, 226), pt(438, 338), pt(364, 324), pt(260, 344)],
              fill=CREAM, outline=GOLD_MID)

    # Quranic script lines on left page
    for i, (ya, yb, xa, xb) in enumerate([
        (256, 258, 112, 234), (276, 278, 112, 234),
        (296, 298, 112, 234), (316, 318, 126, 226)
    ]):
        d.line([pt(xa, ya), pt(xb, yb)], fill=PAGE_LINE, width=px(5))

    # Quranic script lines on right page
    for ya, yb, xa, xb in [
        (256, 258, 278, 400), (276, 278, 278, 400),
        (296, 298, 278, 400), (316, 318, 290, 390)
    ]:
        d.line([pt(xa, ya), pt(xb, yb)], fill=PAGE_LINE, width=px(5))

    # Central gold bookmark ribbon
    d.polygon([pt(252, 222), pt(260, 222), pt(260, 388), pt(256, 376), pt(252, 388)],
              fill=GOLD_MID, outline=GOLD_DARK)

    # ── 8. Divine light rays from Quran ─────────────────────────────────────
    for x2, y2 in [(256, 178), (200, 196), (312, 196), (162, 234), (350, 234)]:
        d.line([pt(256, 220), pt(x2, y2)], fill=(*GOLD_LIGHT, 100), width=px(2))

    # ── 9. Apply gentle vignette / soft blur at icon edges (PWA quality) ─────
    img = img.convert("RGBA")

    # Smooth the icon slightly for crispness
    # (no blur — keep sharp lines for small icon sizes)
    return img


def save_png_icon(size, path):
    icon = make_icon(size)
    icon.save(path, "PNG", optimize=True)
    print(f"Saved {path}  ({size}x{size})")


# ── Generate all PWA icons ──────────────────────────────────────────────────
save_png_icon(192, "public/icons/icon-192.png")
save_png_icon(512, "public/icons/icon-512.png")
save_png_icon(512, "public/icons/icon-maskable-512.png")  # maskable = same art, more padding

print("\nAll Islamic PWA icons generated successfully!")
print("Next: update manifest.webmanifest to reference new maskable icon")
