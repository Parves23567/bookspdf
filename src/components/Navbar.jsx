import React from 'react';
import { BookOpen, Moon, Sun, ArrowLeft, Download, Wifi, WifiOff, Search, Menu } from 'lucide-react';

export default function Navbar({ 
  currentBook, 
  onBackToLibrary, 
  theme, 
  onToggleTheme, 
  isOnline, 
  installPrompt, 
  onInstallApp,
  onOpenSearch,
  onToggleSidebar 
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-library-darkCard/95 backdrop-blur border-b border-library-border dark:border-library-darkBorder transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* বাম পাশ: মেনু বাটন + লোগো বা ব্যাক বাটন */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* মেনু বাটন (সব বই ও সূচিপত্রের সাইডবার) */}
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 rounded-xl text-library-text dark:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder/60 transition flex items-center justify-center"
            title="মেনু ও সূচিপত্র খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          {currentBook ? (
            <button
              onClick={onBackToLibrary}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-library-primary dark:text-library-accent hover:bg-library-border/50 dark:hover:bg-library-darkBorder/60 transition"
              title="লাইব্রেরিতে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">লাইব্রেরি</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={onBackToLibrary}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-library-primary to-library-primaryLight dark:from-library-primaryLight dark:to-library-primary flex items-center justify-center text-library-accent shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg leading-tight text-library-text dark:text-library-darkText">
                  আমার বাংলা লাইব্রেরি
                </h1>
                <p className="text-[11px] text-library-textMuted dark:text-library-darkTextMuted hidden xs:block">
                  ডিজিটাল বই সংকলন
                </p>
              </div>
            </div>
          )}

          {/* বই পড়ার অবস্থায় টাইটেল প্রিভিউ */}
          {currentBook && (
            <div className="max-w-[200px] sm:max-w-sm truncate text-sm font-medium text-library-text dark:text-library-darkText border-l border-library-border dark:border-library-darkBorder pl-3 ml-2">
              {currentBook.title}
            </div>
          )}
        </div>

        {/* ডান পাশ: অ্যাকশন কন্ট্রোলস */}
        <div className="flex items-center space-x-2">
          {/* অনলাইন / অফলাইন ব্যাজ */}
          <div className="flex items-center" title={isOnline ? 'ইন্টারনেট সংযুক্ত' : 'অফলাইন মোড কার্যকর'}>
            {isOnline ? (
              <span className="hidden md:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Wifi className="w-3 h-3" /> অনলাইন
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse font-medium">
                <WifiOff className="w-3.5 h-3.5" /> অফলাইন
              </span>
            )}
          </div>

          {/* সার্চ বাটন (লাইব্রেরিতে থাকলে) */}
          {!currentBook && (
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-library-textMuted hover:text-library-text dark:text-library-darkTextMuted dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder/60 transition"
              title="বই সার্চ করুন"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* ইনস্টল অ্যাপ বাটন (PWA) */}
          {installPrompt && (
            <button
              onClick={onInstallApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-library-accent text-library-primaryDark hover:bg-library-accentLight transition shadow-sm animate-bounce"
              title="মোবাইল বা কম্পিউটারে অ্যাপ ইনস্টল করুন"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ইনস্টল অ্যাপ</span>
            </button>
          )}

          {/* ডার্ক / লাইট মোড টগল */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-library-textMuted hover:text-library-text dark:text-library-darkTextMuted dark:hover:text-library-darkText hover:bg-gray-100 dark:hover:bg-library-darkBorder/60 transition"
            title={theme === 'dark' ? 'লাইট মোডে পরিবর্তন' : 'ডার্ক মোডে পরিবর্তন'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-library-primary" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
