/**
 * Search Service
 * 
 * বইয়ের নাম, লেখক ও বইয়ের ভেতরের বাংলা টেক্সট দ্রুত সার্চ করার ইঞ্জিন।
 * search-index.json থেকে প্রি-বিল্ট ইনডেক্স ব্যবহার করে মাত্র কয়েক মিলিসেকেন্ডে রেজাল্ট দেয়।
 */

class SearchService {
  constructor() {
    this.indexData = null;
    this.isLoading = false;
  }

  async loadIndex() {
    if (this.indexData) return this.indexData;
    if (this.isLoading) return null;

    this.isLoading = true;
    try {
      const res = await fetch('/data/search-index.json');
      if (res.ok) {
        this.indexData = await res.json();
      }
    } catch (err) {
      console.warn('Failed to load pre-indexed search data:', err);
    } finally {
      this.isLoading = false;
    }
    return this.indexData;
  }

  /**
   * সার্চ কোয়েরির আশপাশের লেখার স্নsnippet তৈরি করে
   */
  createSnippet(text, query, padding = 50) {
    if (!text || !query) return '';
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const idx = lowerText.indexOf(lowerQuery);
    if (idx === -1) return text.slice(0, 100) + '...';

    const start = Math.max(0, idx - padding);
    const end = Math.min(text.length, idx + lowerQuery.length + padding);

    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';

    return prefix + text.slice(start, end).trim() + suffix;
  }

  /**
   * একটি নির্দিষ্ট বইয়ের ভেতরের লেখা সার্চ করা
   */
  async searchInBook(bookId, query) {
    if (!query || !query.trim()) return [];
    await this.loadIndex();

    if (!this.indexData || !this.indexData[bookId]) {
      return [];
    }

    const pages = this.indexData[bookId];
    const q = query.trim().toLowerCase();
    const results = [];

    for (const p of pages) {
      if (p.text && p.text.toLowerCase().includes(q)) {
        results.push({
          bookId,
          page: p.page,
          snippet: this.createSnippet(p.text, q, 60),
          matchCount: (p.text.toLowerCase().match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        });
      }
    }

    return results;
  }

  /**
   * পুরো লাইব্রেরির সব বই এবং ভেতরের লেখা একসাথে সার্চ করা
   */
  async searchGlobal(books, query) {
    if (!query || !query.trim()) return { bookMatches: [], textMatches: [] };
    const q = query.trim().toLowerCase();

    // ১. বইয়ের নাম, লেখক ও বিবরণে সার্চ
    const bookMatches = books.filter(b => 
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q))
    );

    // ২. বইয়ের ভেতরের পৃষ্ঠাসমূহে সার্চ
    await this.loadIndex();
    const textMatches = [];

    if (this.indexData) {
      for (const book of books) {
        const pages = this.indexData[book.id];
        if (!pages) continue;

        let bookPageMatches = 0;
        for (const p of pages) {
          if (p.text && p.text.toLowerCase().includes(q)) {
            textMatches.push({
              bookId: book.id,
              bookTitle: book.title,
              bookAuthor: book.author,
              bookCover: book.cover,
              page: p.page,
              snippet: this.createSnippet(p.text, q, 50)
            });
            bookPageMatches++;
            if (bookPageMatches >= 5) break; // প্রতি বই থেকে সর্বোচ্চ ৫টি শীর্ষ ম্যাচ নেওয়া হয় যাতে দ্রুত থাকে
          }
        }
      }
    }

    return { bookMatches, textMatches };
  }
}

export const searchService = new SearchService();
