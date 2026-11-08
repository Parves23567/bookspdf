import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/icons", exist_ok=True)

def create_app_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer rounded rectangle (Islamic Green gradient fill or rich dark emerald)
    # Background circle/squircle
    margin = int(size * 0.05)
    corner_radius = int(size * 0.22)
    
    # Gradient background
    bg = Image.new("RGBA", (size, size), (15, 58, 47, 255)) # #0f3a2f
    bg_draw = ImageDraw.Draw(bg)
    
    # Subtle inner accent border
    gold = (212, 175, 55, 255) # Gold #d4af37
    light_gold = (246, 224, 150, 255)
    
    # Mask for rounded rect
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([margin, margin, size - margin, size - margin], corner_radius, fill=255)
    
    # Draw book motif
    book_w = int(size * 0.52)
    book_h = int(size * 0.44)
    cx, cy = size // 2, int(size * 0.50)
    
    # Open book shape
    # Left page
    left_poly = [
        (cx - 4, cy - book_h // 2),
        (cx - book_w // 2, cy - book_h // 2 + int(size * 0.04)),
        (cx - book_w // 2, cy + book_h // 2),
        (cx - 4, cy + book_h // 2 - int(size * 0.04))
    ]
    # Right page
    right_poly = [
        (cx + 4, cy - book_h // 2),
        (cx + book_w // 2, cy - book_h // 2 + int(size * 0.04)),
        (cx + book_w // 2, cy + book_h // 2),
        (cx + 4, cy + book_h // 2 - int(size * 0.04))
    ]
    
    # Draw book pages
    bg_draw.polygon(left_poly, fill=(245, 240, 225, 255), outline=gold, width=max(2, size // 64))
    bg_draw.polygon(right_poly, fill=(255, 253, 245, 255), outline=gold, width=max(2, size // 64))
    
    # Spine center bookmark ribbon
    ribbon = [
        (cx - 3, cy - book_h // 2 - int(size * 0.04)),
        (cx + 3, cy - book_h // 2 - int(size * 0.04)),
        (cx + 3, cy + book_h // 2 + int(size * 0.08)),
        (cx, cy + book_h // 2 + int(size * 0.04)),
        (cx - 3, cy + book_h // 2 + int(size * 0.08))
    ]
    bg_draw.polygon(ribbon, fill=gold)
    
    # Lines on pages (representing text)
    line_color = (180, 160, 130, 200)
    lw = max(2, size // 90)
    for i in range(4):
        y_off = cy - book_h // 4 + i * (book_h // 5)
        # Left page lines
        bg_draw.line([(cx - int(book_w * 0.42), y_off), (cx - int(book_w * 0.12), y_off - int(size*0.01))], fill=line_color, width=lw)
        # Right page lines
        bg_draw.line([(cx + int(book_w * 0.12), y_off - int(size*0.01)), (cx + int(book_w * 0.42), y_off)], fill=line_color, width=lw)
    
    # Star / crescent symbol above book
    star_cy = cy - book_h // 2 - int(size * 0.12)
    r = int(size * 0.045)
    bg_draw.ellipse([cx - r, star_cy - r, cx + r, star_cy + r], fill=gold)

    # Gold circular frame
    bg_draw.rounded_rectangle([margin + 4, margin + 4, size - margin - 4, size - margin - 4], corner_radius - 4, outline=gold, width=max(2, size // 80))

    img.paste(bg, (0, 0), mask)
    return img

create_app_icon(192).save("public/icons/icon-192.png")
create_app_icon(512).save("public/icons/icon-512.png")
create_app_icon(64).save("public/icons/favicon.png")
print("Icons generated: icon-192.png, icon-512.png, favicon.png")
