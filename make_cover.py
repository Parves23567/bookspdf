import fitz

svg_cover = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="40%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#bg)"/>
  <rect width="800" height="1200" fill="url(#glow)"/>

  <!-- Border -->
  <rect x="35" y="35" width="730" height="1130" rx="20" fill="none" stroke="url(#gold)" stroke-width="3" stroke-opacity="0.6"/>
  <rect x="48" y="48" width="704" height="1104" rx="14" fill="none" stroke="#34D399" stroke-width="1.2" stroke-opacity="0.4"/>

  <!-- Top Badge -->
  <g transform="translate(400, 130)">
    <rect x="-110" y="-20" width="220" height="40" rx="20" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-opacity="0.5"/>
    <text text-anchor="middle" y="6" fill="#6EE7B7" font-family="Arial, sans-serif" font-size="16" font-weight="bold" letter-spacing="2">সরোবর প্রকাশন</text>
  </g>

  <!-- Quranic Verse Motif -->
  <g transform="translate(400, 360)">
    <circle r="130" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.6"/>
    <circle r="110" fill="#022c22" stroke="url(#gold)" stroke-width="2" opacity="0.9"/>
    <text text-anchor="middle" y="18" fill="url(#gold)" font-family="serif" font-size="52" font-weight="bold">اقْرَأْ</text>
  </g>

  <!-- Main Title -->
  <text x="400" y="620" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="96" font-weight="bold" letter-spacing="4">পড়ো</text>
  
  <!-- Subtitle -->
  <text x="400" y="685" text-anchor="middle" fill="url(#gold)" font-family="Arial, sans-serif" font-size="24" font-weight="600">কুরআনের সমকালীন প্রাসঙ্গিক উপলব্ধি</text>

  <!-- Divider -->
  <line x1="260" y1="735" x2="540" y2="735" stroke="url(#gold)" stroke-width="2.5" stroke-opacity="0.8"/>

  <!-- Author Info -->
  <text x="400" y="830" text-anchor="middle" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20">সংকলন</text>
  <text x="400" y="875" text-anchor="middle" fill="#34D399" font-family="Arial, sans-serif" font-size="34" font-weight="bold">ওমর আল জাবির</text>

  <!-- Editor Info -->
  <text x="400" y="935" text-anchor="middle" fill="#94A3B8" font-family="Arial, sans-serif" font-size="18">সম্পাদনা: শরীফ আবু হায়াত অপু</text>
  <text x="400" y="970" text-anchor="middle" fill="#94A3B8" font-family="Arial, sans-serif" font-size="16">শারঈ সম্পাদনা: ড. আবু বকর মুহাম্মাদ যাকারিয়া</text>

  <!-- Bottom Tag -->
  <g transform="translate(400, 1080)">
    <text text-anchor="middle" fill="#64748B" font-family="Arial, sans-serif" font-size="15" letter-spacing="1">১৮৪ পৃষ্ঠা • ডিজিটাল সংস্করণ</text>
  </g>
</svg>'''

with open('public/covers/poro.svg', 'w', encoding='utf-8') as f:
    f.write(svg_cover)

doc = fitz.open('public/covers/poro.svg')
page = doc.load_page(0)
pix = page.get_pixmap(dpi=150)
pix.save('public/covers/poro.png')
print('Cover generated successfully! Dimensions:', pix.width, pix.height)
