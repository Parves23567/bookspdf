import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, FileText, ArrowRight } from 'lucide-react';
import { searchService } from '../../services/searchService';

export default function InBookSearchModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onJumpToPage,
  initialQuery = ''
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const executeSearch = async (searchTerm) => {
    const term = searchTerm || query;
    if (!term.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const hits = await searchService.searchInBook(bookId, term);
      setResults(hits);
    } catch (e) {
      console.error('In-book search failed:', e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-library-darkCard rounded-2xl shadow-2xl border border-library-border dark:border-library-darkBorder overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-library-primary dark:text-library-accent" />
            <div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                বইয়ের ভেতর সার্চ করুন
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted truncate max-w-[260px]">
                {bookTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-library-textMuted hover:text-library-text dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* সার্চ ফর্ম */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-library-border dark:border-library-darkBorder bg-gray-50/50 dark:bg-library-darkBorder/20">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-gray-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="যেকোনো বাংলা শব্দ লিখে সার্চ করুন..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl text-sm bg-white dark:bg-library-darkCard border border-library-border dark:border-library-darkBorder text-library-text dark:text-library-darkText focus:outline-none focus:ring-2 focus:ring-library-primary dark:focus:ring-library-accent shadow-sm"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'সার্চ'}
            </button>
          </div>
        </form>

        {/* রেজাল্ট তালিকা */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 className="w-6 h-6 text-library-primary dark:text-library-accent animate-spin" />
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">পৃষ্ঠাগুলো খোঁজা হচ্ছে...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-library-textMuted dark:text-library-darkTextMuted px-1">
                {results.length} টি পৃষ্ঠায় পাওয়া গেছে:
              </p>
              {results.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onJumpToPage(res.page);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-library-border dark:border-library-darkBorder bg-gray-50/40 dark:bg-library-darkBorder/30 hover:border-library-primary/40 dark:hover:border-library-accent/40 cursor-pointer transition flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs px-2 py-0.5 rounded bg-library-primary/10 text-library-primary dark:bg-library-accent/20 dark:text-library-accent">
                        পৃষ্ঠা {res.page}
                      </span>
                      {res.matchCount > 1 && (
                        <span className="text-[11px] text-gray-400">
                          ({res.matchCount} বার উল্লেখিত)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-library-text dark:text-library-darkText leading-relaxed">
                      "{res.snippet}"
                    </p>
                  </div>

                  <span className="shrink-0 p-1.5 rounded-lg text-gray-400 group-hover:text-library-primary dark:group-hover:text-library-accent transition">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              "{query}" সম্পর্কিত কোনো লেখা এই বইয়ে পাওয়া যায়নি।
            </div>
          ) : (
            <div className="text-center py-12 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              বইয়ের ভেতরের যেকোনো শব্দ বা বিষয় খুঁজতে উপরে টাইপ করে এন্টার চাপুন।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
