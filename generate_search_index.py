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
        "file": "public/books/arober-gotro-o-byaktitto (3).pdf",
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
        "file": "public/books/nobojatoker-1000-nam (2).pdf",
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
        "file": "public/books/makkar-power-politics.pdf",
        "themeColor": "#3c1810",
        "accentColor": "#e5a93b",
        "cover": "/covers/makkar-power-politics.png",
        "category": "রাজনীতি ও ভূরাজনীতি",
        "description": "জাহেলি আরবের কুরাইশ নেতৃত্ব, ক্ষমতার ভারসাম্য, অর্থনৈতিক নিয়ন্ত্রণ ও ইসলামের সূচনালগ্নে রাজনৈতিক পটপরিবর্তনের গভীর বিশ্লেষণ।"
    },
    {
        "id": "poro",
        "title": "পড়ো",
        "subtitle": "আধুনিক মানুষের জন্য কুরআনের সমকালীন উপলব্ধি ও বৈজ্ঞানিক দৃষ্টিকোণ",
        "author": "ওমর আল জাবির",
        "publisher": "সরোবর প্রকাশন",
        "published": "১৪৩৭ হিজরি",
        "pages": 184,
        "file": "public/books/poro.pdf",
        "themeColor": "#064e3b",
        "accentColor": "#10b981",
        "cover": "/covers/poro.png",
        "category": "কুরআন ও সমকালীন চিন্তা",
        "description": "আধুনিক যুগের মানুষের জন্য কুরআনের আয়াতগুলোকে বৈজ্ঞানিক এবং যৌক্তিক দৃষ্টিকোণ থেকে দেখা এবং সমসাময়িক প্রশ্ন, দ্বন্দ্ব ও ঘটনাগুলোর প্রাঞ্জল আলোচনা।"
    }
]

poro_toc = [
    { "title": "প্রচ্ছদ ও পরিচিতি", "page": 1, "level": 1 },
    { "title": "সম্পাদনা ও প্রকাশনা তথ্য", "page": 2, "level": 1 },
    { "title": "প্রকাশকের কথা (শরীফ আবু হায়াত অপু)", "page": 4, "level": 1 },
    { "title": "ভূমিকা (ওমর আল জাবির)", "page": 6, "level": 1 },
    { "title": "রেফারেন্স ও তাফসীর তালিকা", "page": 7, "level": 1 },
    { "title": "সূচিপত্র", "page": 9, "level": 1 },
    { "title": "আমার কাজে লাগবে এমন কিছু কুরআনে আছে কি ?", "page": 10, "level": 1 },
    { "title": "সূরা ফাতিহা: আমরা যা শিখিনি", "page": 15, "level": 1 },
    { "title": "তাঁর মতো আর কেউ নেই", "page": 34, "level": 1 },
    { "title": "কুরআন পড়ে কোনো লাভ হবে না, যদি...", "page": 41, "level": 1 },
    { "title": "যারা অদেখা জগতের কিছু ব্যাপার স্বীকার করে", "page": 47, "level": 1 },
    { "title": "ওরাই শেষ পর্যন্ত সফল হবে", "page": 56, "level": 1 },
    { "title": "ওদের বলে লাভ নেই, ওরা বদলাবে না", "page": 69, "level": 1 },
    { "title": "কিন্তু তারা মোটেও কিছুই স্বীকার করে না", "page": 74, "level": 1 },
    { "title": "আমরা কি বোকাদের মতো বিশ্বাস করব", "page": 80, "level": 1 },
    { "title": "চারদিকে বিভিন্ন গভীরতার অন্ধকার...", "page": 88, "level": 1 },
    { "title": "পৃথিবী বসবাসের জন্য আল্লাহর এক অনিন্দ্য সৃষ্টি", "page": 96, "level": 1 },
    { "title": "যদি পারো তো বানাও এ রকম একটা সূরা", "page": 100, "level": 1 },
    { "title": "এ রকম কিছু আমরা আগেও পেয়েছিলাম", "page": 104, "level": 1 },
    { "title": "এই উদাহরণ দিয়ে আল্লাহ কী বোঝাতে চান", "page": 109, "level": 1 },
    { "title": "আপনি কীভাবে জীবন পেলেন ?", "page": 118, "level": 1 },
    { "title": "সৃষ্টিজগতের শ্রেষ্ঠ সৃষ্টি", "page": 127, "level": 1 },
    { "title": "কিন্তু কখনো এই গাছের কাছেও যাবে না", "page": 140, "level": 1 },
    { "title": "আল্লাহর কাছ থেকে আমরা কী পেয়েছি ?", "page": 150, "level": 1 },
    { "title": "একদিন প্রভুর সাথে দেখা হবেই", "page": 169, "level": 1 },
    { "title": "উপসংহার", "page": 183, "level": 1 }
]

def clean_text(t):
    if not t:
        return ""
    t = t.replace("\x00", "")
    t = re.sub(r'[\r\t]+', ' ', t)
    t = re.sub(r' +', ' ', t)
    return t.strip()

search_index = {}
books_config = []

inspection = {}
if os.path.exists("inspection_report.json"):
    with open("inspection_report.json", "r", encoding="utf-8") as f:
        inspection = json.load(f)

for meta in books_meta:
    pdf_path = meta["file"]
    print(f"Indexing {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    pages_data = []
    
    if meta["id"] == "poro":
        toc = poro_toc
    else:
        raw_fname = os.path.basename(pdf_path)
        raw_outline = inspection.get(raw_fname, {}).get("outline", [])
        
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
    book_entry["file"] = os.path.basename(meta["file"])
    book_entry["toc"] = toc
    book_entry["pagesCount"] = len(reader.pages)
    book_entry["pages"] = len(reader.pages)
    books_config.append(book_entry)

os.makedirs("public/data", exist_ok=True)

with open("public/data/books.json", "w", encoding="utf-8") as out:
    json.dump(books_config, out, ensure_ascii=False, indent=2)

with open("public/data/search-index.json", "w", encoding="utf-8") as out:
    json.dump(search_index, out, ensure_ascii=False)

print("Generated public/data/books.json and public/data/search-index.json successfully!")
