import React from 'react';
import { BookOpen, Moon, Sun, ArrowLeft, Download, Wifi, WifiOff, Search, Menu } from 'lucide-react';

export default function Navbar({ 
  currentBook, 
  onBackToLibrary, 
  theme, 
  onToggleTheme, 
  onSelectTheme,
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
              <img src="/favicon.svg" alt="লোগো" className="w-10 h-10 rounded-xl shadow-md object-cover" />
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

          {/* ৩টি মোড: লাইট, সেপিয়া (বই পড়ার মোড), নাইট */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-library-border dark:border-library-darkBorder shadow-2xs">
            <button
              onClick={() => onSelectTheme ? onSelectTheme('light') : onToggleTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${
                theme === 'light' 
                  ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-600/30' 
                  : 'text-library-textMuted hover:text-library-text'
              }`}
              title="দিনের আলো (লাইট মোড)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">লাইট</span>
            </button>

            <button
              onClick={() => onSelectTheme ? onSelectTheme('sepia') : onToggleTheme('sepia')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${
                theme === 'sepia' 
                  ? 'bg-[#f4ecd8] text-[#5c4033] shadow-xs ring-1 ring-amber-600/50' 
                  : 'text-library-textMuted hover:text-library-text'
              }`}
              title="সেপিয়া (চোখ-বান্ধব আই-কেয়ার রিডিং মোড)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">সেপিয়া</span>
            </button>

            <button
              onClick={() => onSelectTheme ? onSelectTheme('dark') : onToggleTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${
                theme === 'dark' 
                  ? 'bg-gray-900 text-yellow-300 shadow-xs ring-1 ring-yellow-400/50' 
                  : 'text-library-textMuted hover:text-library-text'
              }`}
              title="রাতের আঁধার (নাইট / ডার্ক মোড)"
            >
              <Moon className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden md:inline">নাইট</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
