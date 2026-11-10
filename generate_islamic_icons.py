import fitz
import os

# Create directory if needed
os.makedirs("public/icons", exist_ok=True)

# High Quality, Bright Islamic Religious PWA App Icon
# Featuring:
# - Radiant emerald green background (#047857 to #10B981)
# - Golden Islamic Crescent Moon & 8-pointed Islamic Star (Rub El Hizb)
# - Glowing Open Quran on traditional Rehal (Book Stand)
# - Golden ornamental frame with floral geometric arch (Mihrab)
# - Clean, crisp contrast visible on all phone backgrounds (light/dark/custom wallpapers)

bright_islamic_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Bright Vibrant Emerald) -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="30%" stop-color="#059669" />
      <stop offset="70%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>

    <!-- Radiant Glow in the center -->
    <radialGradient id="centerGlow" cx="50%" cy="52%" r="48%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#10B981" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0" />
    </radialGradient>

    <!-- Pure Shiny 24K Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="20%" stop-color="#FEF08A" />
      <stop offset="45%" stop-color="#FACC15" />
      <stop offset="75%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>

    <!-- Warm Quran Page Gradient -->
    <linearGradient id="quranPageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="50%" stop-color="#FEFCE8" />
      <stop offset="100%" stop-color="#FDF6B2" />
    </linearGradient>

    <!-- Dark Rehal Wood Gradient -->
    <linearGradient id="rehalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#854D0E" />
      <stop offset="50%" stop-color="#713F12" />
      <stop offset="100%" stop-color="#451A03" />
    </linearGradient>

    <!-- Deep Drop Shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.38"/>
    </filter>

    <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- App Rounded Squircle Background (for mobile icon) -->
  <rect x="12" y="12" width="488" height="488" rx="112" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="112" fill="url(#centerGlow)"/>

  <!-- Golden Outer Border -->
  <rect x="24" y="24" width="464" height="464" rx="100" fill="none" stroke="url(#goldGrad)" stroke-width="6" stroke-opacity="0.9"/>
  <rect x="36" y="36" width="440" height="440" rx="88" fill="none" stroke="#FDE047" stroke-width="1.8" stroke-dasharray="10 5" stroke-opacity="0.6"/>

  <!-- Islamic Arch (Mihrab) in Background -->
  <path d="M 120 440 L 120 220 C 120 130 190 90 256 90 C 322 90 392 130 392 220 L 392 440 Z" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-opacity="0.35"/>

  <!-- Top: Majestic Islamic Crescent (Hilal) & 8-pointed Star -->
  <g filter="url(#glowFilter)" transform="translate(256, 118)">
    <!-- Crescent Moon -->
    <path d="M 14 -42 A 40 40 0 1 0 38 32 A 32 32 0 1 1 14 -42 Z" fill="url(#goldGrad)"/>
    <!-- 8-Pointed Star (Khatim / Rub el Hizb) inside crescent -->
    <g transform="translate(18, -4) scale(0.72)">
      <rect x="-16" y="-16" width="32" height="32" rx="3" fill="url(#goldGrad)"/>
      <rect x="-16" y="-16" width="32" height="32" rx="3" fill="url(#goldGrad)" transform="rotate(45)"/>
      <circle cx="0" cy="0" r="6" fill="#047857"/>
    </g>
  </g>

  <!-- Divine Rays radiating from Quran -->
  <g opacity="0.45" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round">
    <line x1="256" y1="210" x2="256" y2="175" />
    <line x1="220" y1="220" x2="190" y2="190" />
    <line x1="292" y1="220" x2="322" y2="190" />
    <line x1="180" y1="245" x2="145" y2="230" />
    <line x1="332" y1="245" x2="367" y2="230" />
  </g>

  <!-- Wooden Rehal (Book Stand) -->
  <g filter="url(#shadow)">
    <!-- Rehal Base Left Leg -->
    <path d="M 140 375 L 210 320 L 235 340 L 175 405 Z" fill="url(#rehalGrad)" stroke="url(#goldGrad)" stroke-width="2"/>
    <!-- Rehal Base Right Leg -->
    <path d="M 372 375 L 302 320 L 277 340 L 337 405 Z" fill="url(#rehalGrad)" stroke="url(#goldGrad)" stroke-width="2"/>
    <!-- Central Rehal joint arch -->
    <path d="M 220 350 Q 256 325 292 350 L 280 370 Q 256 350 232 370 Z" fill="url(#goldGrad)"/>
  </g>

  <!-- The Holy Quran (Open Book on Rehal) -->
  <g filter="url(#shadow)">
    <!-- Left Cover Flap (Green leather with gold edge) -->
    <path d="M 252 230 C 185 210 115 220 70 235 L 70 345 C 115 330 185 320 252 340 Z" fill="#064e3b" stroke="url(#goldGrad)" stroke-width="3"/>
    
    <!-- Right Cover Flap (Green leather with gold edge) -->
    <path d="M 260 230 C 327 210 397 220 442 235 L 442 345 C 397 330 327 320 260 340 Z" fill="#064e3b" stroke="url(#goldGrad)" stroke-width="3"/>

    <!-- Left Book Pages (Cream/Gold) -->
    <path d="M 250 224 C 186 206 120 216 78 230 L 78 338 C 120 324 186 314 250 332 Z" fill="url(#quranPageGrad)" stroke="url(#goldGrad)" stroke-width="2.5"/>

    <!-- Right Book Pages (Cream/Gold) -->
    <path d="M 262 224 C 326 206 392 216 434 230 L 434 338 C 392 324 326 314 262 332 Z" fill="url(#quranPageGrad)" stroke="url(#goldGrad)" stroke-width="2.5"/>

    <!-- Left Page Quranic Calligraphy Lines -->
    <path d="M 105 250 C 145 240 195 240 228 248" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 105 272 C 145 262 195 262 228 270" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 105 294 C 145 284 195 284 228 292" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 125 316 C 160 308 195 308 220 314" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>

    <!-- Right Page Quranic Calligraphy Lines -->
    <path d="M 284 248 C 317 240 367 240 407 250" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 284 270 C 317 262 367 262 407 272" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 284 292 C 317 284 367 284 407 294" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 292 314 C 322 308 357 308 387 316" stroke="#047857" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>

    <!-- Central Gold Bookmark Ribbon hanging down -->
    <path d="M 252 215 L 260 215 L 260 380 L 256 368 L 252 380 Z" fill="url(#goldGrad)" stroke="#B45309" stroke-width="1"/>
  </g>

  <!-- Bottom Elegant Banner: 'আমার বাংলা লাইব্রেরি' -->
  <g transform="translate(256, 442)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#022c22" fill-opacity="0.8" stroke="url(#goldGrad)" stroke-width="2"/>
    <text text-anchor="middle" y="6" font-family="'Hind Siliguri', 'Noto Sans Bengali', Arial, sans-serif" font-size="20" font-weight="bold" fill="url(#goldGrad)" letter-spacing="1.5">আমার বাংলা লাইব্রেরি</text>
  </g>
</svg>'''

# 1. Save SVG
with open("public/icons/icon.svg", "w", encoding="utf-8") as f:
    f.write(bright_islamic_svg)
print("Saved public/icons/icon.svg")

with open("public/favicon.svg", "w", encoding="utf-8") as f:
    f.write(bright_islamic_svg)
print("Saved public/favicon.svg")

# 2. Render 192x192 PNG
doc = fitz.open("public/icons/icon.svg")
page = doc.load_page(0)

scale_192 = 192.0 / page.rect.width
pix192 = page.get_pixmap(matrix=fitz.Matrix(scale_192, scale_192))
pix192.save("public/icons/icon-192.png")
print("Saved public/icons/icon-192.png (192x192)")

# 3. Render 512x512 PNG
scale_512 = 512 / page.rect.width
pix512 = page.get_pixmap(matrix=fitz.Matrix(scale_512, scale_512))
pix512.save("public/icons/icon-512.png")
print("Saved public/icons/icon-512.png (512x512)")

print("All bright Islamic PWA icons generated successfully!")
