import os
import json
import re
import pypdf

books_meta = [
    {
        "id": "arober-gotro",
        "title": "আরবের গোত্র ও ব্যক্তিত্ব",
        "subtitle": "ঐতিহাসিক পটভূমি, কুরাইশ বংশ ও বিশিষ্ট ব্যক্তিত্বের পরিচিতি",
        "author": "আব্দুল্লাহ ইয়াছিন শরীফী",
        "publisher": "সীরাহ পড়ি",
        "published": "অক্টোবর ২০২৬",
        "pages": 84,
        "file": "arober-gotro-o-byaktitto (3).pdf",
        "themeColor": "#0f3a2f",
        "accentColor": "#d4af37",
        "cover": "/covers/arober-gotro.png",
        "category": "ইতিহাস ও সীরাহ",
        "description": "মক্কা, মদিনা ও তৎকালীন সমগ্র আরবের গোত্রসমূহ এবং তাদের ঐতিহাসিক ব্যক্তিত্বের প্রামাণ্য পরিচিতি ও বিস্তৃত আলোচনা।"
    },
    {
        "id": "nobojatoker-nam",
        "title": "নবজাতকের ১০০০ নাম",
        "subtitle": "অর্থসহ আধুনিক ও ইসলামী সুন্দর নামসমূহের সংকলন",
        "author": "আব্দুল্লাহ ইয়াছিন শরীফী",
        "publisher": "সীরাহ পড়ি",
        "published": "অক্টোবর ২০২৬",
        "pages": 109,
        "file": "nobojatoker-1000-nam (2).pdf",
        "themeColor": "#1a365d",
        "accentColor": "#f6ad55",
        "cover": "/covers/nobojatoker-nam.png",
        "category": "ইসলামী নামকরণ",
        "description": "নামকরণের গুরুত্ব, শরীয়তের নীতিমালা, ভুল নামের সতর্কতা এবং ছেলে ও মেয়েদের জন্য অর্থসহ এক হাজার বাছাইকৃত ইসলামী নাম।"
    },
    {
        "id": "makkar-power-politics",
        "title": "মক্কার পাওয়ার পলিটিক্স",
        "subtitle": "কুরাইশ ব্যবস্থার পতন ও ইসলামের উত্থান",
        "author": "সীরাহ পড়ি টিম",
        "publisher": "সীরাহ পড়ি",
        "published": "নভেম্বর ২০২৬",
        "pages": 98,
        "file": "makkar-power-politics.pdf",
        "themeColor": "#3c1810",
        "accentColor": "#e5a93b",
        "cover": "/covers/makkar-power-politics.png",
        "category": "রাজনীতি ও ভূরাজনীতি",
        "description": "জাহেলি আরবের কুরাইশ নেতৃত্ব, ক্ষমতার ভারসাম্য, অর্থনৈতিক নিয়ন্ত্রণ ও ইসলামের সূচনালগ্নে রাজনৈতিক পটপরিবর্তনের গভীর বিশ্লেষণ।"
    }
]

# Clean up raw text artifacts while preserving Bengali & Arabic letters
def clean_text(t):
    if not t:
        return ""
    # remove null bytes and weird control characters
    t = t.replace("\x00", "")
    t = re.sub(r'[\r\t]+', ' ', t)
    t = re.sub(r' +', ' ', t)
    return t.strip()

search_index = {}
books_config = []

# Load inspection outline
with open("inspection_report.json", "r", encoding="utf-8") as f:
    inspection = json.load(f)

for meta in books_meta:
    pdf_filename = meta["file"]
    print(f"Indexing {pdf_filename}...")
    reader = pypdf.PdfReader(pdf_filename)
    pages_data = []
    
    # Extract TOC from inspection
    raw_outline = inspection.get(pdf_filename, {}).get("outline", [])
    
    def flatten_toc(items, level=1):
        result = []
        for it in items:
            if isinstance(it, list):
                result.extend(flatten_toc(it, level + 1))
            elif isinstance(it, dict):
                p = it.get("page")
                page_num = (p + 1) if p is not None else 1
                result.append({
                    "title": it.get("title", "").strip(),
                    "page": page_num,
                    "level": level
                })
        return result
        
    toc = flatten_toc(raw_outline)
    
    for idx, page in enumerate(reader.pages):
        page_num = idx + 1
        raw_text = page.extract_text() or ""
        cleaned = clean_text(raw_text)
        pages_data.append({
            "page": page_num,
            "text": cleaned
        })
        
    search_index[meta["id"]] = pages_data
    
    book_entry = dict(meta)
    book_entry["toc"] = toc
    book_entry["pagesCount"] = len(reader.pages)
    books_config.append(book_entry)

os.makedirs("public/data", exist_ok=True)

with open("public/data/books.json", "w", encoding="utf-8") as out:
    json.dump(books_config, out, ensure_ascii=False, indent=2)

with open("public/data/search-index.json", "w", encoding="utf-8") as out:
    json.dump(search_index, out, ensure_ascii=False)

print("Generated public/data/books.json and public/data/search-index.json successfully!")
