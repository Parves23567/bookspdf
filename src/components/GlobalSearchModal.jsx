import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, BookOpen, ArrowRight, User } from 'lucide-react';
import { searchService } from '../services/searchService';

export default function GlobalSearchModal({
  isOpen,
  onClose,
  books,
  initialQuery = '',
  onSelectBook
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ bookMatches: [], textMatches: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSearch = async (term) => {
    const q = term !== undefined ? term : query;
    if (!q.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await searchService.searchGlobal(books, q);
      setResults(res);
    } catch (e) {
      console.error('Global search error:', e);
      setResults({ bookMatches: [], textMatches: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!isOpen) return null;

  const totalMatches = results.bookMatches.length + results.textMatches.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-library-darkCard rounded-2xl shadow-2xl border border-library-border dark:border-library-darkBorder overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-library-primary dark:text-library-accent" />
            <div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                সমগ্র লাইব্রেরি সার্চ
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                সবগুলো বই ও ভেতরের লেখার মধ্যে তাৎক্ষণিক অনুসন্ধান
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

        {/* সার্চ ইনপুট */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-library-border dark:border-library-darkBorder bg-gray-50/50 dark:bg-library-darkBorder/20">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-gray-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="বইয়ের নাম, লেখক, গোত্র বা যেকোনো বাংলা শব্দ..."
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

        {/* রেজাল্ট সেকশন */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2">
              <Loader2 className="w-7 h-7 text-library-primary dark:text-library-accent animate-spin" />
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">বইয়ের পৃষ্ঠাগুলো অনুসন্ধান করা হচ্ছে...</p>
            </div>
          ) : totalMatches > 0 ? (
            <div className="space-y-4">
              
              {/* বইয়ের নাম ম্যাচ */}
              {results.bookMatches.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-library-textMuted dark:text-library-darkTextMuted px-1">
                    বইয়ের তালিকা ({results.bookMatches.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {results.bookMatches.map(b => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onSelectBook(b, 1);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-library-border dark:border-library-darkBorder bg-gray-50/40 dark:bg-library-darkBorder/30 hover:border-library-primary/40 cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded overflow-hidden shrink-0 bg-gray-200">
                            <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-library-text dark:text-library-darkText group-hover:text-library-primary dark:group-hover:text-library-accent transition">
                              {b.title}
                            </h5>
                            <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted flex items-center gap-1">
                              <User className="w-3 h-3 text-library-accent" /> {b.author}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-library-primary dark:text-library-accent flex items-center gap-1">
                          পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ভেতরের লেখার পৃষ্ঠা ম্যাচ */}
              {results.textMatches.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-library-textMuted dark:text-library-darkTextMuted px-1">
                    বইয়ের ভেতরের পৃষ্ঠা ও কনটেন্ট ({results.textMatches.length})
                  </h4>
                  <div className="space-y-2">
                    {results.textMatches.map((m, idx) => {
                      const bookObj = books.find(b => b.id === m.bookId);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (bookObj) {
                              onSelectBook(bookObj, m.page);
                              onClose();
                            }
                          }}
                          className="p-3.5 rounded-xl border border-library-border dark:border-library-darkBorder bg-gray-50/40 dark:bg-library-darkBorder/30 hover:border-library-primary/40 cursor-pointer transition flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-library-text dark:text-library-darkText">
                                {m.bookTitle}
                              </span>
                              <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-library-primary/10 text-library-primary dark:bg-library-accent/20 dark:text-library-accent">
                                পৃষ্ঠা {m.page}
                              </span>
                            </div>
                            <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted leading-relaxed line-clamp-2">
                              "{m.snippet}"
                            </p>
                          </div>
                          <span className="shrink-0 text-gray-400 group-hover:text-library-primary dark:group-hover:text-library-accent transition pt-1">
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          ) : hasSearched ? (
            <div className="text-center py-16 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              "{query}" সম্পর্কিত কোনো তথ্য লাইব্রেরিতে পাওয়া যায়নি।
            </div>
          ) : (
            <div className="text-center py-16 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              উপরের সার্চ বক্সে যেকোনো শব্দ লিখে এন্টার চাপুন।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
