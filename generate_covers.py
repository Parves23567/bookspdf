import os
import fitz # PyMuPDF

os.makedirs("public/covers", exist_ok=True)

books = [
    ("arober-gotro", "public/books/arober-gotro-o-byaktitto (3).pdf"),
    ("nobojatoker-nam", "public/books/nobojatoker-1000-nam (2).pdf"),
    ("makkar-power-politics", "public/books/makkar-power-politics.pdf")
]

for book_id, pdf_path in books:
    print(f"Rendering cover for {book_id} from {pdf_path}...")
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    # Render at 2x resolution (144 dpi) for crisp display on retina and mobile screens
    pix = page.get_pixmap(dpi=150)
    out_path = f"public/covers/{book_id}.png"
    pix.save(out_path)
    print(f"Saved {out_path} ({pix.width}x{pix.height})")

print("All covers rendered successfully!")
