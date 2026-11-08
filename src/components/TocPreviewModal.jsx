import React from 'react';
import { X, Bookmark, ChevronRight } from 'lucide-react';

export default function TocPreviewModal({
  isOpen,
  onClose,
  book,
  onSelectBook
}) {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-library-darkCard rounded-2xl shadow-2xl border border-library-border dark:border-library-darkBorder overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-library-primary dark:text-library-accent" />
            <div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                {book.title} - সূচিপত্র
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                {book.author} | মোট {book.pagesCount || book.pages} পৃষ্ঠা
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

        {/* অধ্যায় তালিকা */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {book.toc && book.toc.length > 0 ? (
            book.toc.map((item, idx) => {
              const isLevel2 = item.level === 2;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectBook(book, item.page);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between text-xs sm:text-sm ${
                    isLevel2 ? 'pl-7 bg-gray-50/50 dark:bg-library-darkBorder/20' : 'hover:bg-gray-100 dark:hover:bg-library-darkBorder/40'
                  } text-library-text dark:text-library-darkText group`}
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="shrink-0 w-2 h-2 rounded-full bg-library-accent/70"></span>
                    <span className="line-clamp-1 group-hover:text-library-primary dark:group-hover:text-library-accent transition">
                      {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold text-library-primary dark:text-library-accent text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 flex items-center gap-1">
                    পৃষ্ঠা {item.page}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-library-textMuted dark:text-library-darkTextMuted text-xs">
              সূচিপত্র পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* ফুটার */}
        <div className="p-3 border-t border-library-border dark:border-library-darkBorder bg-gray-50 dark:bg-library-darkBorder/20 flex justify-between items-center">
          <span className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
            যেকোনো অধ্যায়ে ক্লিক করে সরাসরি পাঠ শুরু করুন
          </span>
          <button
            onClick={() => {
              onSelectBook(book, 1);
              onClose();
            }}
            className="px-4 py-2 bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark rounded-xl text-xs font-semibold hover:opacity-90 transition shadow-sm"
          >
            প্রথম থেকে পড়ুন
          </button>
        </div>

      </div>
    </div>
  );
}
