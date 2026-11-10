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
  const [initialReaderMode, setInitialReaderMode] = useState('pdf');

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
    // ১. থিম ইনিট (৩টি মোড: লাইট, সেপিয়া, নাইট)
    const savedTheme = storageService.getAppTheme();
    setTheme(savedTheme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'sepia') {
      document.documentElement.classList.add('sepia');
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

    // বেস হিস্ট্রি স্টেট ইনিট
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // মোবাইল ব্যাক বাটন / ব্যাক সোয়াইপ / popstate হ্যান্ডলিং (অ্যাপ থেকে বের হওয়া রোধ)
  useEffect(() => {
    const handlePopState = (e) => {
      // ১. যদি সাইডবার খোলা থাকে তা বন্ধ করুন
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return;
      }
      // ২. যদি কোনো মোডাল খোলা থাকে তা বন্ধ করুন
      if (isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
        return;
      }
      if (tocPreviewBook) {
        setTocPreviewBook(null);
        return;
      }

      // ৩. যদি বই পড়া অবস্থায় থাকে তবে ব্যাক দিলে লাইব্রেরিতে ফিরবে (অ্যাপ থেকে বের হবে না)
      if (currentBook) {
        setCurrentBook(null);
        const progressMap = storageService.getAllProgress();
        setAllProgress(progressMap);
        setLastRead(storageService.getLastRead());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // ৪. হোমে থাকলে পুনরায় হিস্ট্রি রেখে দেওয়া যাতে অসাবধানতাবশত বের না হয়
      window.history.pushState({ page: 'home' }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentBook, isSidebarOpen, isGlobalSearchOpen, tocPreviewBook]);

  // গ্লোবাল কীবোর্ড ব্যাকস্পেস কি হ্যান্ডলার (ব্রাউজার এক্সিট রোধ)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) {
        e.preventDefault();
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        } else if (isGlobalSearchOpen) {
          setIsGlobalSearchOpen(false);
        } else if (tocPreviewBook) {
          setTocPreviewBook(null);
        } else if (currentBook) {
          handleBackToLibrary();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentBook, isSidebarOpen, isGlobalSearchOpen, tocPreviewBook]);

  // থিম প্রয়োগ ও পরিবর্তন (৩টি মোড: লাইট, সেপিয়া, নাইট)
  const applyTheme = (targetTheme) => {
    setTheme(targetTheme);
    storageService.saveAppTheme(targetTheme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (targetTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (targetTheme === 'sepia') {
      document.documentElement.classList.add('sepia');
    }
  };

  const handleSelectTheme = (targetTheme) => {
    applyTheme(targetTheme);
  };

  const toggleTheme = (explicitTheme = null) => {
    if (explicitTheme && ['light', 'sepia', 'dark'].includes(explicitTheme)) {
      applyTheme(explicitTheme);
      return;
    }
    const nextTheme = theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light';
    applyTheme(nextTheme);
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
  const handleSelectBook = (book, targetPage = null, mode = 'pdf') => {
    if (!book) {
      handleBackToLibrary();
      return;
    }
    const bookProgress = allProgress[book.id];
    const pageToOpen = targetPage || bookProgress?.currentPage || 1;

    // ব্রাউজার হিস্ট্রিতে পুশ যাতে ব্যাক বাটন চাপলে লাইব্রেরিতে ফেরে (অ্যাপ থেকে বের হবে না)
    window.history.pushState({ page: 'reader', bookId: book.id }, '');

    setCurrentBook(book);
    setInitialReaderPage(pageToOpen);
    setInitialReaderMode(mode || 'pdf');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // লাইব্রেরিতে ফেরা
  const handleBackToLibrary = () => {
    if (window.history.state?.page === 'reader') {
      window.history.back();
    } else {
      setCurrentBook(null);
      const progressMap = storageService.getAllProgress();
      setAllProgress(progressMap);
      setLastRead(storageService.getLastRead());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          onSelectTheme={handleSelectTheme}
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
            initialMode={initialReaderMode}
            onBack={handleBackToLibrary}
            onProgressUpdated={handleProgressUpdated}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            appTheme={theme}
            onAppThemeChange={handleSelectTheme}
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
        onSelectBook={(book, page, mode) => {
          if (!book) {
            handleBackToLibrary();
          } else {
            handleSelectBook(book, page, mode);
          }
        }}
        onOpenSearch={() => handleOpenSearchModal('')}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTheme={handleSelectTheme}
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
