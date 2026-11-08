import os
import json
import pypdf

files = [
    "arober-gotro-o-byaktitto (3).pdf",
    "nobojatoker-1000-nam (2).pdf",
    "makkar-power-politics.pdf"
]

results = {}

for f in files:
    if not os.path.exists(f):
        print(f"File not found: {f}")
        continue
    
    reader = pypdf.PdfReader(f)
    num_pages = len(reader.pages)
    
    # Check outlines
    try:
        outlines = reader.outline
    except Exception as e:
        outlines = str(e)
        
    def serialize_outline(outline_list):
        items = []
        if not outline_list:
            return items
        for item in outline_list:
            if isinstance(item, list):
                items.append(serialize_outline(item))
            elif hasattr(item, 'title'):
                page_num = None
                try:
                    page_num = reader.get_destination_page_number(item)
                except Exception:
                    pass
                items.append({'title': item.title, 'page': page_num})
        return items

    serialized_outline = []
    try:
        serialized_outline = serialize_outline(outlines)
    except Exception as e:
        serialized_outline = f"Error: {e}"

    # Sample text extraction from first 10 pages and some middle pages
    pages_sample = {}
    total_text_chars = 0
    scanned_pages_count = 0
    
    for p_idx in range(num_pages):
        page = reader.pages[p_idx]
        text = page.extract_text() or ""
        text_len = len(text.strip())
        total_text_chars += text_len
        if text_len < 20:
            scanned_pages_count += 1
        if p_idx < 8:
            pages_sample[f"page_{p_idx+1}"] = {
                "length": text_len,
                "preview": text.strip()[:300].replace("\n", " ")
            }

    results[f] = {
        "num_pages": num_pages,
        "total_extracted_chars": total_text_chars,
        "low_text_or_scanned_pages": scanned_pages_count,
        "outline": serialized_outline,
        "samples": pages_sample
    }

with open("inspection_report.json", "w", encoding="utf-8") as out:
    json.dump(results, out, ensure_ascii=False, indent=2)
print("Inspection written successfully to inspection_report.json")

