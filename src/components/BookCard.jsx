import React, { useState } from 'react';
import { BookOpen, User, FileText, CheckCircle2, Bookmark, ChevronRight } from 'lucide-react';

export default function BookCard({ book, progress, onSelectBook, onOpenToc }) {
  const [imageError, setImageError] = useState(false);

  const currentPage = progress?.currentPage || 1;
  const totalPages = book.pagesCount || book.pages || 1;
  const percentage = progress?.percentage || 0;
  const hasStarted = progress && progress.currentPage > 1;

  return (
    <div className="group flex flex-col bg-white dark:bg-library-darkCard rounded-2xl border border-library-border dark:border-library-darkBorder overflow-hidden shadow-book hover:shadow-book-lg transition-all duration-300 transform hover:-translate-y-1">
      
      {/* কার্ডের উপরের অংশ: কাভার ও থিম গ্রেডিয়েন্ট */}
      <div 
        className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-library-primary to-library-primaryDark cursor-pointer flex items-center justify-center p-4"
        onClick={() => onSelectBook(book, currentPage)}
      >
        {!imageError && book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          // যদি কোনো কাভার না থাকে, সুন্দর টাইপোগ্রাফিক কাস্টম কাভার
          <div className="w-full h-full rounded-lg p-5 flex flex-col justify-between text-white border border-library-accent/30 relative overflow-hidden bg-gradient-to-b from-[#164337] to-[#0c2720]">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-library-accent/10 blur-xl"></div>
            
            <div className="space-y-1 relative z-10">
              <span className="inline-block px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-library-accent/20 text-library-accent rounded">
                {book.category || 'বাংলা ই-বুক'}
              </span>
              <h3 className="font-bold text-lg leading-tight mt-2 text-library-accentLight">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-xs text-emerald-200/80 line-clamp-2">
                  {book.subtitle}
                </p>
              )}
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5 text-library-accent" /> {book.author}
              </span>
              <span className="text-xs text-library-accent font-semibold">
                {totalPages} পৃষ্ঠা
              </span>
            </div>
          </div>
        )}

        {/* ক্যাটাগরি বা ব্যাজ */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-library-primaryDark/80 backdrop-blur text-library-accent border border-library-accent/30 shadow-sm">
            {book.category || 'বই'}
          </span>
        </div>

        {/* পড়া সম্পন্ন হলে ব্যাজ */}
        {percentage === 100 && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white rounded-full p-1 shadow-md">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* কার্ডের কনটেন্ট ও মেটাডাটা */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <h2 
            onClick={() => onSelectBook(book, currentPage)}
            className="font-bold text-base sm:text-lg text-library-text dark:text-library-darkText hover:text-library-primaryLight dark:hover:text-library-accent transition-colors line-clamp-1 cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h2>

          <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted flex items-center gap-1.5 mt-1 font-medium">
            <User className="w-3.5 h-3.5 text-library-accent" /> {book.author}
          </p>

          <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted line-clamp-2 mt-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* রিডিং প্রগ্রেস সেকশন */}
        <div className="pt-3 border-t border-library-border dark:border-library-darkBorder">
          <div className="flex items-center justify-between text-xs font-medium text-library-textMuted dark:text-library-darkTextMuted mb-1.5">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-library-primary dark:text-library-accent" />
              {hasStarted ? (
                <span>সর্বশেষ পৃষ্ঠা: <strong className="text-library-text dark:text-library-darkText">{currentPage}</strong> / {totalPages}</span>
              ) : (
                <span>মোট পৃষ্ঠা: {totalPages}</span>
              )}
            </span>
            <span className="font-semibold text-library-primary dark:text-library-accent">
              {percentage}%
            </span>
          </div>

          {/* প্রগ্রেস বার */}
          <div className="w-full h-2 bg-gray-100 dark:bg-library-darkBorder rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-library-primary to-library-accent transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            {book.toc && book.toc.length > 0 && (
              <button
                onClick={() => onOpenToc(book)}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-library-border dark:border-library-darkBorder text-library-text dark:text-library-darkText hover:bg-gray-50 dark:hover:bg-library-darkBorder/40 transition flex items-center justify-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5 text-library-accent" /> সূচিপত্র
              </button>
            )}

            <button
              onClick={() => onSelectBook(book, currentPage, 'text')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition flex items-center justify-center gap-1.5 shadow-2xs"
              title="পরিচ্ছন্ন মোবাইল টেক্সট রিডিং মোডে পড়ুন"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>রিডিং মোড</span>
            </button>
          </div>

          <button
            onClick={() => onSelectBook(book, currentPage, 'pdf')}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 bg-library-primary hover:bg-library-primaryLight text-white dark:bg-library-accent dark:text-library-primaryDark dark:hover:bg-library-accentLight"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{hasStarted ? `পৃষ্ঠা ${currentPage}-এ পড়ুন (PDF)` : 'এখনই পড়ুন (PDF)'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>

      </div>

    </div>
  );
}
