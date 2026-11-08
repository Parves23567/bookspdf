import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarks,
  onJumpToPage,
  onRemoveBookmark,
  bookTitle
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-library-darkCard h-full flex flex-col shadow-2xl border-l border-library-border dark:border-library-darkBorder"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 border-b border-library-border dark:border-library-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-library-accent fill-library-accent" />
            <div>
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                সংরক্ষিত বুকমার্ক ({bookmarks.length})
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

        {/* বুকমার্কের তালিকা */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length > 0 ? (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="group p-3.5 rounded-xl border border-library-border dark:border-library-darkBorder bg-gray-50/50 dark:bg-library-darkBorder/30 hover:border-library-primary/40 dark:hover:border-library-accent/40 transition flex items-start justify-between gap-3"
              >
                <div 
                  onClick={() => {
                    onJumpToPage(bm.page);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-library-accent/20 text-library-accentDark dark:text-library-accent">
                      পৃষ্ঠা {bm.page}
                    </span>
                    <span className="text-[11px] text-library-textMuted dark:text-library-darkTextMuted">
                      {new Date(bm.createdAt).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {bm.snippet && (
                    <p className="text-xs text-library-text dark:text-library-darkText line-clamp-2 leading-relaxed">
                      "{bm.snippet}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="বুকমার্ক মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onJumpToPage(bm.page);
                      onClose();
                    }}
                    className="p-1.5 text-library-primary dark:text-library-accent rounded-lg hover:bg-gray-100 dark:hover:bg-library-darkBorder/60 transition"
                    title="পৃষ্ঠায় যান"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-library-accent/10 flex items-center justify-center text-library-accent">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-library-text dark:text-library-darkText">
                কোনো বুকমার্ক সংরক্ষিত নেই
              </h4>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted max-w-xs">
                যেকোনো পৃষ্ঠা পড়ার সময় উপরের ফিতা (Bookmark) আইকনে ট্যাপ করে বুকমার্ক করে রাখুন।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
