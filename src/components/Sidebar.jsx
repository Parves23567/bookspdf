import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Bookmark, 
  Home, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  Moon,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  books = [],
  currentBook = null,
  allProgress = {},
  onSelectBook,
  onOpenSearch,
  theme,
  onToggleTheme,
  isOnline
}) {
  // কোন বইয়ের সূচিপত্র প্রসারিত রয়েছে তা ট্র্যাক করতে
  const [expandedBookId, setExpandedBookId] = useState(currentBook?.id || books[0]?.id || null);
  // সূচিপত্র সার্চ ফিল্টার
  const [tocFilter, setTocFilter] = useState('');

  if (!isOpen) return null;

  const toggleBookAccordion = (bookId) => {
    setExpandedBookId(prev => prev === bookId ? null : bookId);
  };

  const handleChapterClick = (book, page) => {
    onSelectBook(book, page);
    onClose();
  };

  const handleBookClick = (book) => {
    onSelectBook(book);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn font-hind">
      {/* ব্যাকড্রপ ওভারলে */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* বাম পাশের মূল সাইডবার প্যানেল */}
      <aside 
        className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md h-full bg-white dark:bg-library-darkCard border-r border-library-border dark:border-library-darkBorder shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0"
      >
        {/* ১. শীর্ষ হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-library-primary to-library-primaryLight dark:from-library-primaryLight dark:to-library-primary flex items-center justify-center text-library-accent shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight text-library-text dark:text-library-darkText">
                লাইব্রেরি মেনু ও সূচিপত্র
              </h2>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                সকল বই ও অধ্যায় এক নজরে
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-200/60 dark:hover:bg-library-darkBorder transition"
            title="মেনু বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ২. দ্রুত অ্যাকশন লিংক */}
        <div className="p-3 border-b border-library-border dark:border-library-darkBorder grid grid-cols-2 gap-2 bg-gray-50/70 dark:bg-gray-900/40 text-xs font-medium">
          <button
            onClick={() => {
              if (currentBook) onSelectBook(null);
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-library-darkCard border border-library-border dark:border-library-darkBorder text-library-text dark:text-library-darkText hover:border-library-accent transition shadow-2xs"
          >
            <Home className="w-3.5 h-3.5 text-library-primary dark:text-library-accent" />
            <span>লাইব্রেরি হোম</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-library-darkCard border border-library-border dark:border-library-darkBorder text-library-text dark:text-library-darkText hover:border-library-accent transition shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-library-primary dark:text-library-accent" />
            <span>বই সার্চ করুন</span>
          </button>
        </div>

        {/* ৩. সূচিপত্র সার্চ ইনপুট */}
        <div className="p-3 border-b border-library-border dark:border-library-darkBorder">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-library-textMuted" />
            <input
              type="text"
              value={tocFilter}
              onChange={(e) => setTocFilter(e.target.value)}
              placeholder="যেকোনো বইয়ের অধ্যায় খুঁজুন..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-transparent focus:border-library-accent text-library-text dark:text-library-darkText placeholder-library-textMuted outline-none transition"
            />
            {tocFilter && (
              <button
                onClick={() => setTocFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-library-textMuted hover:text-library-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ৪. স্ক্রোলেবল বই ও সূচিপত্রের তালিকা */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          <div className="text-[11px] font-bold uppercase tracking-wider text-library-textMuted dark:text-library-darkTextMuted px-1 flex items-center justify-between">
            <span>সকল বই ({books.length}টি)</span>
            <span>সূচিপত্র ব্রাউজ</span>
          </div>

          {books.map((book) => {
            const isSelected = currentBook?.id === book.id;
            const isExpanded = expandedBookId === book.id || !!tocFilter;
            const progress = allProgress[book.id];
            const percent = progress?.percentage || 0;
            const currentPage = progress?.currentPage || 1;

            // যদি সূচিপত্রে সার্চ থাকে তাহলে ফিল্টার হবে
            const filteredToc = (book.toc || []).filter(item => 
              !tocFilter || item.title.toLowerCase().includes(tocFilter.toLowerCase())
            );

            // সার্চ চলাকালীন কোনো অধ্যায় না মিললে বই হাইড হবে
            if (tocFilter && filteredToc.length === 0) {
              return null;
            }

            return (
              <div 
                key={book.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isSelected 
                    ? 'border-library-accent/70 bg-library-accent/5 dark:bg-library-accent/10 shadow-sm' 
                    : 'border-library-border dark:border-library-darkBorder bg-white dark:bg-library-darkCard hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {/* বইয়ের সারাংশ কার্ড */}
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    {/* কাভার ছবি */}
                    <div 
                      onClick={() => handleBookClick(book)}
                      className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0 cursor-pointer shadow-xs hover:opacity-90 transition"
                    >
                      {book.cover ? (
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-library-primary text-white text-[10px] text-center p-1 font-bold">
                          {book.title.slice(0, 8)}
                        </div>
                      )}
                    </div>

                    {/* বইয়ের শিরোনাম ও তথ্য */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            এখন পড়ছেন
                          </span>
                        )}
                        <span className="text-[11px] text-library-textMuted dark:text-library-darkTextMuted">
                          {book.pages} পৃষ্ঠা
                        </span>
                      </div>

                      <h3 
                        onClick={() => handleBookClick(book)}
                        className="font-bold text-sm text-library-text dark:text-library-darkText truncate cursor-pointer hover:text-library-primary dark:hover:text-library-accent transition mt-0.5"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted truncate">
                        {book.author}
                      </p>

                      {/* প্রগ্রেস বার */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-library-primary to-library-accent rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-library-textMuted">
                          {percent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* বইয়ের অ্যাকশন বাটনসমূহ */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleBookClick(book)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark hover:opacity-90 transition shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{percent > 0 ? `পৃষ্ঠা ${currentPage}-এ পড়ুন` : 'পড়ুন'}</span>
                    </button>

                    <button
                      onClick={() => toggleBookAccordion(book.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      title="সূচিপত্র দেখুন বা লুকান"
                    >
                      <span>সূচিপত্র ({filteredToc.length})</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-library-primary dark:text-library-accent" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ৫. এই বইয়ের সূচিপত্র তালিকা (Accordion) */}
                {isExpanded && (
                  <div className="border-t border-library-border dark:border-library-darkBorder bg-gray-50/80 dark:bg-gray-900/60 max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredToc.length === 0 ? (
                      <div className="p-3 text-center text-xs text-library-textMuted">
                        কোনো অধ্যায় পাওয়া যায়নি
                      </div>
                    ) : (
                      filteredToc.map((item, idx) => {
                        const isCurrentChapter = isSelected && progress?.currentPage >= item.page;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleChapterClick(book, item.page)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition group ${
                              item.level === 2 ? 'pl-5 text-library-textMuted text-[11px]' : 'font-medium text-library-text dark:text-library-darkText'
                            } hover:bg-white dark:hover:bg-gray-800 hover:text-library-primary dark:hover:text-library-accent`}
                          >
                            <span className="truncate flex-1 group-hover:translate-x-0.5 transition-transform">
                              {item.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200/70 dark:bg-gray-800 text-library-textMuted group-hover:bg-library-accent/20 group-hover:text-library-primary dark:group-hover:text-library-accent font-mono shrink-0">
                              পৃষ্ঠা {item.page}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ৬. সাইডবার ফুটার */}
        <div className="p-3 border-t border-library-border dark:border-library-darkBorder bg-gray-50 dark:bg-gray-900/60 flex items-center justify-between text-xs">
          {/* অনলাইন স্ট্যাটাস */}
          <div className="flex items-center gap-1.5 text-library-textMuted">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px]">অনলাইন</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">অফলাইন</span>
              </>
            )}
          </div>

          {/* থিম টগল */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-200/60 dark:hover:bg-gray-800 transition"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>লাইট মোড</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-library-primary" />
                  <span>ডার্ক মোড</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
