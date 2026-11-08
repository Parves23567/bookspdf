import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, Clock, ArrowRight, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import BookCard from './BookCard';

export default function Dashboard({ 
  books, 
  allProgress, 
  lastRead, 
  onSelectBook, 
  onOpenToc,
  onOpenSearchModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ক্যাটাগরি তালিকা তৈরি
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return ['all', ...Array.from(set)];
  }, [books]);

  // ফিল্টার করা বই
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // সর্বশেষ পড়া বইয়ের অবজেক্ট
  const lastReadBook = useMemo(() => {
    if (!lastRead || !lastRead.bookId) return null;
    return books.find(b => b.id === lastRead.bookId);
  }, [lastRead, books]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* ১. হিরো ব্যানার ও টাইটেল */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2e25] via-library-primary to-[#061814] text-white p-6 sm:p-10 shadow-book-lg border border-library-accent/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-library-accent/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-library-accent/20 text-library-accent border border-library-accent/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রগ্রেসিভ ডিজিটাল লাইব্রেরি</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            আমার বাংলা লাইব্রেরি
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 font-normal max-w-2xl">
            আপনার পছন্দের বই, আপনার হাতেই — মোবাইল ও কম্পিউটারে আরামদায়ক পঠন অভিজ্ঞতা, অফলাইন সাপোর্ট ও উন্নত বাংলা টাইপোগ্রাফি।
          </p>

          {/* সার্চ ইনপুট */}
          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-emerald-200/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বইয়ের নাম, লেখক বা বিষয় খুঁজুন..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-library-accent focus:bg-white/15 transition text-sm sm:text-base"
              />
              <button
                onClick={() => onOpenSearchModal(searchQuery)}
                className="absolute right-2 px-3.5 py-2 rounded-xl bg-library-accent text-library-primaryDark font-semibold text-xs hover:bg-library-accentLight transition shadow-sm flex items-center gap-1"
              >
                <span>গভীর সার্চ</span>
              </button>
            </div>
          </div>
        </div>

        {/* অ্যাপের তিনটি মূল বৈশিষ্ট্য */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-emerald-100/80">
            <Smartphone className="w-5 h-5 text-library-accent shrink-0" />
            <span className="text-xs sm:text-sm">মোবাইল-বান্ধব ও PWA</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-emerald-100/80">
            <Zap className="w-5 h-5 text-library-accent shrink-0" />
            <span className="text-xs sm:text-sm">অফলাইনেও দ্রুত লোডিং</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-emerald-100/80">
            <ShieldCheck className="w-5 h-5 text-library-accent shrink-0" />
            <span className="text-xs sm:text-sm">অপরিবর্তিত মূল টেক্সট</span>
          </div>
        </div>
      </section>

      {/* ২. Continue Reading Section (পড়া চালিয়ে যান) */}
      {lastReadBook && lastRead && (
        <section className="bg-white dark:bg-library-darkCard rounded-2xl p-5 border border-library-border dark:border-library-darkBorder shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-library-border dark:border-library-darkBorder shadow-sm">
              <img
                src={lastReadBook.cover}
                alt={lastReadBook.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-library-primary dark:text-library-accent uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> সর্বশেষ পড়া
                </span>
                <span className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                  পৃষ্ঠা {lastRead.currentPage} / {lastRead.totalPages || lastReadBook.pagesCount}
                </span>
              </div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText truncate">
                {lastReadBook.title}
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                {lastReadBook.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => onSelectBook(lastReadBook, lastRead.currentPage)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-library-primary hover:bg-library-primaryLight text-white dark:bg-library-accent dark:text-library-primaryDark dark:hover:bg-library-accentLight font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>পড়া চালিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ৩. ক্যাটাগরি ফিল্টার ও সার্চ হেডার */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-library-text dark:text-library-darkText flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-library-primary dark:text-library-accent" />
              <span>লাইব্রেরির বইসমূহ ({filteredBooks.length})</span>
            </h2>
            <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted mt-0.5">
              নিচের যে-কোনো বই বেছে নিয়ে শুরু করুন আপনার পঠন
            </p>
          </div>

          {/* ক্যাটাগরি পিলস */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark'
                    : 'bg-white dark:bg-library-darkCard text-library-textMuted dark:text-library-darkTextMuted border border-library-border dark:border-library-darkBorder hover:border-library-primary/40'
                }`}
              >
                {cat === 'all' ? 'সব বই' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ৪. বইয়ের কার্ড গ্রিড */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                progress={allProgress[book.id]}
                onSelectBook={onSelectBook}
                onOpenToc={onOpenToc}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-library-darkCard rounded-2xl border border-library-border dark:border-library-darkBorder p-8">
            <p className="text-library-textMuted dark:text-library-darkTextMuted text-sm">
              "{searchQuery}" এর সাথে মিলে এমন কোনো বই পাওয়া যায়নি।
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 text-xs font-semibold text-library-primary dark:text-library-accent hover:underline"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
