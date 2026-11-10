import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReaderContainer from './components/Reader/ReaderContainer';
import GlobalSearchModal from './components/GlobalSearchModal';
import TocPreviewModal from './components/TocPreviewModal';
import Sidebar from './components/Sidebar';
import { fetchBooksConfig, INITIAL_BOOKS } from './config/booksConfig';
import { storageService } from './services/storageService';
import { BookOpen, Heart, Sparkles, Smartphone } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [currentBook, setCurrentBook] = useState(null);
  const [initialReaderPage, setInitialReaderPage] = useState(1);

  // থিম ও অনলাইন স্টেট
  const [theme, setTheme] = useState('light');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [installPrompt, setInstallPrompt] = useState(null);

  // সাইডবার (মেনু বার ও সূচিপত্র) স্টেট
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // প্রগ্রেস ও বুকমার্ক স্টেট
  const [allProgress, setAllProgress] = useState({});
  const [lastRead, setLastRead] = useState(null);

  // মোডালস
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [tocPreviewBook, setTocPreviewBook] = useState(null);

  // প্রারম্ভিক ইনিশিয়ালাইজেশন
  useEffect(() => {
    // ১. থিম ইনিট
    const savedTheme = storageService.getAppTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // ২. বইয়ের কনফিগ লোড
    fetchBooksConfig().then(data => {
      if (data && data.length > 0) {
        setBooks(data);
      }
    });

    // ৩. পড়ার প্রগ্রেস লোড
    const progressMap = storageService.getAllProgress();
    setAllProgress(progressMap);

    const last = storageService.getLastRead();
    setLastRead(last);

    // ৪. অনলাইন / অফলাইন লিসেনার
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ৫. PWA ইনস্টল প্রম্পট ক্যাপচার
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // থিম টগল
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    storageService.saveAppTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // PWA অ্যাপ ইনস্টল ট্রিগার
  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // বই নির্বাচন ও রিডার ওপেন
  const handleSelectBook = (book, targetPage = 1) => {
    // যদি প্রগ্রেস থাকে তবে আগের পৃষ্ঠা থেকে শুরু
    const bookProgress = allProgress[book.id];
    const pageToOpen = targetPage || bookProgress?.currentPage || 1;

    setCurrentBook(book);
    setInitialReaderPage(pageToOpen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // লাইব্রেরিতে ফেরা
  const handleBackToLibrary = () => {
    setCurrentBook(null);
    // প্রগ্রেস রিফ্রেশ
    const progressMap = storageService.getAllProgress();
    setAllProgress(progressMap);
    setLastRead(storageService.getLastRead());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // প্রগ্রেস আপডেট হ্যান্ডলার
  const handleProgressUpdated = (bookId, newProgress) => {
    setAllProgress(prev => ({
      ...prev,
      [bookId]: newProgress
    }));
    setLastRead(newProgress);
  };

  // গ্লোবাল সার্চ ওপেন
  const handleOpenSearchModal = (query = '') => {
    setSearchInitialQuery(query);
    setIsGlobalSearchOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-library-bg dark:bg-library-darkBg text-library-text dark:text-library-darkText transition-colors selection:bg-library-accent selection:text-library-primaryDark font-hind">
      
      {/* নেভিগেশন বার (রিডারে থাকলে রিডারের নিজস্ব হেডার কাজ করে) */}
      {!currentBook && (
        <Navbar
          currentBook={currentBook}
          onBackToLibrary={handleBackToLibrary}
          theme={theme}
          onToggleTheme={toggleTheme}
          isOnline={isOnline}
          installPrompt={installPrompt}
          onInstallApp={handleInstallApp}
          onOpenSearch={() => handleOpenSearchModal('')}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />
      )}

      {/* মূল বডি */}
      <div className="flex-1 flex flex-col">
        {currentBook ? (
          <ReaderContainer
            book={currentBook}
            initialPage={initialReaderPage}
            onBack={handleBackToLibrary}
            onProgressUpdated={handleProgressUpdated}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          />
        ) : (
          <Dashboard
            books={books}
            allProgress={allProgress}
            lastRead={lastRead}
            onSelectBook={handleSelectBook}
            onOpenToc={(b) => setTocPreviewBook(b)}
            onOpenSearchModal={handleOpenSearchModal}
          />
        )}
      </div>

      {/* ড্যাশবোর্ড ফুটার */}
      {!currentBook && (
        <footer className="mt-auto border-t border-library-border dark:border-library-darkBorder bg-white dark:bg-library-darkCard py-8 px-4 text-center text-xs text-library-textMuted dark:text-library-darkTextMuted space-y-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-library-primary dark:bg-library-accent flex items-center justify-center text-white dark:text-library-primaryDark">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-library-text dark:text-library-darkText">
                আমার বাংলা লাইব্রেরি
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium">
                PWA Ready
              </span>
            </div>

            <p className="text-xs">
              ডিজিটাল বাংলা বই সংকলন | আব্দুল্লাহ ইয়াছিন শরীফী ও সীরাহ পড়ি টিম
            </p>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" /> ১০০% অফলাইন কার্যকর
              </span>
            </div>

          </div>
        </footer>
      )}

      {/* গ্লোবাল সার্চ মোডাল */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        books={books}
        initialQuery={searchInitialQuery}
        onSelectBook={handleSelectBook}
      />

      {/* বাম পাশের সাইডবার (মেনু বার ও সব বইয়ের সূচিপত্র তালিকা) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        books={books}
        currentBook={currentBook}
        allProgress={allProgress}
        onSelectBook={(book, page) => {
          if (!book) {
            handleBackToLibrary();
          } else {
            handleSelectBook(book, page);
          }
        }}
        onOpenSearch={() => handleOpenSearchModal('')}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOnline={isOnline}
      />

      {/* সূচিপত্র প্রিভিউ মোডাল */}
      <TocPreviewModal
        isOpen={!!tocPreviewBook}
        onClose={() => setTocPreviewBook(null)}
        book={tocPreviewBook}
        onSelectBook={handleSelectBook}
      />

    </div>
  );
}
