import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Bookmark, Search, List, Sun, Moon, 
  Maximize, Minimize, ZoomIn, ZoomOut, RotateCcw,
  BookOpen, FileText, ChevronLeft, ChevronRight, Sliders
} from 'lucide-react';

export default function ReaderToolbar({
  book,
  currentPage,
  totalPages,
  onPageChange,
  mode,
  onToggleMode,
  zoomScale,
  onZoomChange,
  themeFilter,
  onThemeFilterChange,
  isBookmarked,
  onToggleBookmark,
  onOpenToc,
  onOpenSearch,
  onOpenBookmarks,
  onBack,
  visible
}) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isFullscreen = typeof document !== 'undefined' && !!document.fullscreenElement;

  return (
    <>
      {/* ১. শীর্ষ টুলবার */}
      <div 
        className={`fixed top-0 inset-x-0 z-40 bg-white/95 dark:bg-library-darkCard/95 backdrop-blur border-b border-library-border dark:border-library-darkBorder shadow-sm transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          
          {/* বাম পাশ: ব্যাক বাটন ও বইয়ের নাম */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-library-primary dark:text-library-accent hover:bg-gray-100 dark:hover:bg-library-darkBorder/60 transition"
              title="লাইব্রেরিতে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-xs sm:text-sm text-library-text dark:text-library-darkText truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h2>
              <span className="text-[11px] text-library-textMuted dark:text-library-darkTextMuted hidden xs:block">
                {book.author}
              </span>
            </div>
          </div>

          {/* ডান পাশ: অ্যাকশনস (সূচিপত্র, বুকমার্ক, সার্চ, মোড, থিম) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* মোড সুইচ: PDF ⇋ টেক্সট */}
            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                mode === 'text'
                  ? 'bg-library-accent text-library-primaryDark shadow-sm'
                  : 'bg-library-primary/10 text-library-primary dark:bg-library-accent/15 dark:text-library-accent hover:bg-library-primary/20'
              }`}
              title={mode === 'pdf' ? 'টেক্সট মোডে পড়ুন' : 'মূল PDF ভিউয়ারে দেখুন'}
            >
              {mode === 'pdf' ? (
                <>
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">টেক্সট মোড</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">মূল PDF</span>
                </>
              )}
            </button>

            {/* সার্চ */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder transition"
              title="বইয়ের ভেতরে খুঁজুন"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* সূচিপত্র */}
            <button
              onClick={onOpenToc}
              className="p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder transition"
              title="সূচিপত্র খুলুন"
            >
              <List className="w-4 h-4" />
            </button>

            {/* বুকমার্ক টগল */}
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition ${
                isBookmarked 
                  ? 'text-library-accent bg-library-accent/15' 
                  : 'text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder'
              }`}
              title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'এই পৃষ্ঠা বুকমার্ক করুন'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* বুকমার্ক লিস্ট */}
            <button
              onClick={onOpenBookmarks}
              className="hidden sm:block p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder transition text-xs"
              title="বুকমার্কের তালিকা"
            >
              বুকমার্ক
            </button>

            {/* থিম পরিবর্তন (Light / Sepia / Dark) */}
            <button
              onClick={() => {
                const next = themeFilter === 'light' ? 'sepia' : themeFilter === 'sepia' ? 'dark' : 'light';
                onThemeFilterChange(next);
              }}
              className="p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder transition"
              title="পঠন থিম পরিবর্তন (লাইট / সেপিয়া / নাইট)"
            >
              {themeFilter === 'dark' ? (
                <Moon className="w-4 h-4 text-library-accent" />
              ) : themeFilter === 'sepia' ? (
                <span className="text-xs font-bold text-amber-700">সেপিয়া</span>
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* ফুলস্ক্রিন */}
            <button
              onClick={toggleFullscreen}
              className="hidden md:block p-2 rounded-xl text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder transition"
              title="ফুলস্ক্রিন মোড"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* পাতলা টপ রিডিং প্রগ্রেস বার */}
        <div className="w-full h-1 bg-gray-100 dark:bg-library-darkBorder">
          <div 
            className="h-full bg-gradient-to-r from-library-primary to-library-accent transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* ২. নিম্ন টুলবার (পেজিনেশন ও জুম) */}
      <div 
        className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-library-darkCard/95 backdrop-blur border-t border-library-border dark:border-library-darkBorder shadow-lg transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          
          {/* পূর্ববর্তী পেজ বাটন */}
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium text-xs bg-gray-100 dark:bg-library-darkBorder/60 text-library-text dark:text-library-darkText hover:bg-gray-200 dark:hover:bg-library-darkBorder disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">আগের পৃষ্ঠা</span>
          </button>

          {/* পেজ জাম্প ফর্ম */}
          <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5 text-xs font-medium">
            <span className="text-library-textMuted dark:text-library-darkTextMuted">পৃষ্ঠা</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-14 px-2 py-1 text-center font-bold rounded-lg border border-library-border dark:border-library-darkBorder bg-white dark:bg-library-darkCard text-library-text dark:text-library-darkText focus:outline-none focus:ring-1 focus:ring-library-primary dark:focus:ring-library-accent"
            />
            <span className="text-library-textMuted dark:text-library-darkTextMuted">/ {totalPages}</span>
            <button
              type="submit"
              className="px-2 py-1 rounded-lg bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark font-semibold text-[11px] hover:opacity-90"
            >
              যান
            </button>
          </form>

          {/* জুম কন্ট্রোলস (শুধুমাত্র PDF মোডে) */}
          {mode === 'pdf' && (
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-library-darkBorder/60 rounded-xl p-0.5">
              <button
                onClick={() => onZoomChange(Math.max(0.7, zoomScale - 0.15))}
                className="p-1.5 rounded-lg text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-white dark:hover:bg-library-darkCard transition"
                title="জুম আউট"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onZoomChange(1.0)}
                className="px-1.5 py-1 text-[11px] font-mono text-library-textMuted dark:text-library-darkTextMuted hover:text-library-text"
                title="স্বাভাবিক আকার (Fit Width)"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => onZoomChange(Math.min(2.5, zoomScale + 0.15))}
                className="p-1.5 rounded-lg text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-white dark:hover:bg-library-darkCard transition"
                title="জুম ইন"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* পরবর্তী পেজ বাটন */}
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium text-xs bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
          >
            <span className="hidden sm:inline">পরের পৃষ্ঠা</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </>
  );
}
