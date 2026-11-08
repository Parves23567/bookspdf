import React, { useState } from 'react';
import { X, Search, Bookmark, ChevronRight, Hash, Plus, Check } from 'lucide-react';

export default function TableOfContentsModal({
  isOpen,
  onClose,
  toc,
  currentPage,
  onJumpToPage,
  bookTitle,
  onAddManualChapter
}) {
  const [filter, setFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPage, setNewPage] = useState('');

  if (!isOpen) return null;

  const filteredToc = (toc || []).filter(item => 
    !filter.trim() || item.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(newPage, 10);
    if (newTitle.trim() && !isNaN(p) && p > 0) {
      if (onAddManualChapter) {
        onAddManualChapter({ title: newTitle.trim(), page: p, level: 1 });
      }
      setNewTitle('');
      setNewPage('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-library-darkCard h-full flex flex-col shadow-2xl border-l border-library-border dark:border-library-darkBorder"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-library-primary dark:text-library-accent" />
            <div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                সূচিপত্র
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted truncate max-w-[240px]">
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

        {/* সার্চ বার */}
        <div className="p-3 border-b border-library-border dark:border-library-darkBorder">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="অধ্যায়ের নাম খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-library-darkBorder/40 border border-library-border dark:border-library-darkBorder text-library-text dark:text-library-darkText focus:outline-none focus:ring-1 focus:ring-library-primary dark:focus:ring-library-accent"
            />
          </div>
        </div>

        {/* অধ্যায় তালিকা */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredToc.length > 0 ? (
            filteredToc.map((item, index) => {
              const isCurrent = currentPage >= item.page;
              const isLevel2 = item.level === 2;

              return (
                <button
                  key={index}
                  onClick={() => {
                    onJumpToPage(item.page);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between text-xs sm:text-sm ${
                    isLevel2 ? 'pl-7 bg-gray-50/50 dark:bg-library-darkBorder/20' : ''
                  } ${
                    currentPage === item.page
                      ? 'bg-library-primary/10 text-library-primary dark:bg-library-accent/15 dark:text-library-accent font-bold border border-library-primary/20 dark:border-library-accent/30'
                      : 'hover:bg-gray-100 dark:hover:bg-library-darkBorder/40 text-library-text dark:text-library-darkText'
                  }`}
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="shrink-0 w-2 h-2 rounded-full bg-library-accent/60"></span>
                    <span className="line-clamp-2">{item.title}</span>
                  </div>
                  <span className="shrink-0 font-semibold text-library-primary dark:text-library-accent text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                    পৃষ্ঠা {item.page}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              কোনো অধ্যায় পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* ম্যানুয়াল অধ্যায় যোগ করার ফর্ম */}
        {showAddForm ? (
          <form onSubmit={handleAddSubmit} className="p-3 bg-gray-50 dark:bg-library-darkBorder/30 border-t border-library-border dark:border-library-darkBorder space-y-2">
            <h4 className="text-xs font-bold text-library-text dark:text-library-darkText">নতুন অধ্যায় সূচিপত্রে যুক্ত করুন:</h4>
            <input
              type="text"
              placeholder="অধ্যায়ের শিরোনাম"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs border border-library-border dark:border-library-darkBorder bg-white dark:bg-library-darkCard text-library-text dark:text-library-darkText focus:outline-none"
              required
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="পৃষ্ঠা নং"
                value={newPage}
                onChange={(e) => setNewPage(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg text-xs border border-library-border dark:border-library-darkBorder bg-white dark:bg-library-darkCard text-library-text dark:text-library-darkText focus:outline-none"
                required
              />
              <button
                type="submit"
                className="flex-1 py-1.5 bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark rounded-lg text-xs font-semibold hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> সংরক্ষণ
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-medium"
              >
                বাতিল
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 border-t border-library-border dark:border-library-darkBorder">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded-xl border border-dashed border-library-border dark:border-library-darkBorder text-library-textMuted dark:text-library-darkTextMuted hover:text-library-text text-xs flex items-center justify-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> ম্যানুয়ালি অধ্যায় যোগ করুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
