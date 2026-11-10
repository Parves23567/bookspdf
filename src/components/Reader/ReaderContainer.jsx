import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { storageService } from '../../services/storageService';
import PdfViewer from './PdfViewer';
import TextReader from './TextReader';
import ReaderToolbar from './ReaderToolbar';
import TableOfContentsModal from './TableOfContentsModal';
import BookmarksModal from './BookmarksModal';
import InBookSearchModal from './InBookSearchModal';

export default function ReaderContainer({
  book,
  initialPage = 1,
  initialMode = 'pdf',
  onBack,
  onProgressUpdated,
  onToggleSidebar
}) {
  const [doc, setDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [docError, setDocError] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = book.pagesCount || book.pages || (doc?.numPages) || 1;

  // সেটিংস স্টেট
  const [mode, setMode] = useState(initialMode || 'pdf'); // 'pdf' | 'text'

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [themeFilter, setThemeFilter] = useState('light'); // 'light' | 'sepia' | 'dark'
  const [toolbarsVisible, setToolbarsVisible] = useState(true);

  // মোডাল স্টেট
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // বুকমার্ক ও সূচিপত্র স্টেট
  const [bookmarks, setBookmarks] = useState([]);
  const [currentToc, setCurrentToc] = useState(book.toc || []);

  // ডকুমেন্ট লোড করা
  useEffect(() => {
    let isCancelled = false;
    setLoadingDoc(true);
    setDocError(null);

    // বুকমার্ক লোড
    const savedBookmarks = storageService.getBookmarks(book.id);
    setBookmarks(savedBookmarks);

    // রিডার সেটিংস লোড
    const savedSettings = storageService.getReaderSettings();
    if (savedSettings.mode) setMode(savedSettings.mode);
    if (savedSettings.theme) setThemeFilter(savedSettings.theme);

    async function load() {
      try {
        const loadedDoc = await pdfService.loadDocument(book.id, book.file);
        if (!isCancelled) {
          setDoc(loadedDoc);
          setLoadingDoc(false);

          // যদি বইয়ের কনফিগে TOC না থাকে, PDF থেকে এক্সট্রাক্ট করার চেষ্টা
          if (!book.toc || book.toc.length === 0) {
            const rawOutline = await pdfService.extractOutline(loadedDoc);
            if (rawOutline && rawOutline.length > 0) {
              const formatted = rawOutline.map(item => ({
                title: item.title,
                page: 1, // fallback
                level: 1
              }));
              setCurrentToc(formatted);
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load PDF document:', err);
          setDocError('বইটির PDF লোড করা সম্ভব হয়নি। ফাইলটির অবস্থান বা নেটওয়ার্ক সংযোগ পরীক্ষা করুন।');
          setLoadingDoc(false);
        }
      }
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, [book]);

  // পৃষ্ঠা পরিবর্তন ও অগ্রগতি সংরক্ষণ
  const handlePageChange = useCallback((newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);

    // লোকাল স্টোরেজে পড়ার অগ্রগতি সেভ করা
    const progress = storageService.saveProgress(book.id, validPage, totalPages);
    if (onProgressUpdated && progress) {
      onProgressUpdated(book.id, progress);
    }
  }, [book.id, totalPages, onProgressUpdated]);

  // বুকমার্ক টগল
  const isCurrentBookmarked = bookmarks.some(b => b.page === currentPage);
  const handleToggleBookmark = () => {
    if (isCurrentBookmarked) {
      const updated = storageService.removeBookmark(book.id, currentPage);
      setBookmarks(updated);
    } else {
      const updated = storageService.addBookmark(book.id, currentPage, `পৃষ্ঠা ${currentPage}`);
      setBookmarks(updated);
    }
  };

  const handleRemoveBookmark = (bmId) => {
    const updated = storageService.removeBookmark(book.id, bmId);
    setBookmarks(updated);
  };

  // ম্যানুয়াল অধ্যায় যোগ
  const handleAddManualChapter = (newChapter) => {
    setCurrentToc(prev => [...prev, newChapter].sort((a, b) => a.page - b.page));
  };

  // থিম ফিল্টার পরিবর্তন
  const handleThemeFilterChange = (newTheme) => {
    setThemeFilter(newTheme);
    storageService.saveReaderSettings({ theme: newTheme, mode });
  };

  // মোড পরিবর্তন (PDF ⇋ Text)
  const handleToggleMode = () => {
    const nextMode = mode === 'pdf' ? 'text' : 'pdf';
    setMode(nextMode);
    storageService.saveReaderSettings({ mode: nextMode, theme: themeFilter });
  };

  // কিবোর্ড শর্টকাট
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTocOpen || isBookmarksOpen || isSearchOpen) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handlePageChange(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePageChange(currentPage - 1);
      } else if (e.key === 'Escape') {
        onBack();
      } else if (e.key === 'b' || e.key === 'B') {
        handleToggleBookmark();
      } else if (e.key === 't' || e.key === 'T') {
        handleToggleMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isTocOpen, isBookmarksOpen, isSearchOpen, handlePageChange, onBack, handleToggleBookmark, handleToggleMode]);

  return (
    <div className="relative flex-1 flex flex-col w-full h-full min-h-screen bg-library-bg dark:bg-library-darkBg transition-colors">
      
      {/* শীর্ষ ও নিম্ন টুলবার */}
      <ReaderToolbar
        book={book}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        mode={mode}
        onToggleMode={handleToggleMode}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        themeFilter={themeFilter}
        onThemeFilterChange={handleThemeFilterChange}
        isBookmarked={isCurrentBookmarked}
        onToggleBookmark={handleToggleBookmark}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onBack={onBack}
        visible={toolbarsVisible}
        onToggleSidebar={onToggleSidebar}
      />

      {/* মূল রিডিং এরিয়া (টুলবারের প্যাডিং দিয়ে সেন্টার্ড) */}
      <main className="flex-1 flex flex-col pt-14 pb-14 w-full h-full">
        {loadingDoc ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-10 h-10 text-library-primary dark:text-library-accent animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-library-text dark:text-library-darkText">
                "{book.title}" লোড হচ্ছে...
              </h3>
              <p className="text-xs text-library-textMuted dark:text-library-darkTextMuted">
                অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন
              </p>
            </div>
          </div>
        ) : docError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="font-bold text-lg text-library-text dark:text-library-darkText">
              বইটি লোড করতে সমস্যা হয়েছে
            </h3>
            <p className="text-sm text-library-textMuted dark:text-library-darkTextMuted">
              {docError}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-semibold bg-library-primary text-white rounded-xl shadow-sm"
              >
                আবার চেষ্টা করুন
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold border border-library-border dark:border-library-darkBorder rounded-xl text-library-text dark:text-library-darkText"
              >
                লাইব্রেরিতে ফিরুন
              </button>
            </div>
          </div>
        ) : mode === 'pdf' ? (
          <PdfViewer
            doc={doc}
            pageNum={currentPage}
            totalPages={totalPages}
            zoomScale={zoomScale}
            themeFilter={themeFilter}
            onPageChange={handlePageChange}
            onToggleToolbars={() => setToolbarsVisible(prev => !prev)}
          />
        ) : (
          <TextReader
            doc={doc}
            book={book}
            pageNum={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            themeFilter={themeFilter}
            onThemeFilterChange={handleThemeFilterChange}
            onToggleToolbars={() => setToolbarsVisible(prev => !prev)}
            onSwitchToPdf={() => setMode('pdf')}
          />
        )}
      </main>

      {/* সূচিপত্র মোডাল / ড্রয়ার */}
      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        toc={currentToc}
        currentPage={currentPage}
        onJumpToPage={handlePageChange}
        bookTitle={book.title}
        onAddManualChapter={handleAddManualChapter}
      />

      {/* বুকমার্ক মোডাল / ড্রয়ার */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onJumpToPage={handlePageChange}
        onRemoveBookmark={handleRemoveBookmark}
        bookTitle={book.title}
      />

      {/* বইয়ের ভেতরে সার্চ মোডাল */}
      <InBookSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bookId={book.id}
        bookTitle={book.title}
        onJumpToPage={handlePageChange}
      />

    </div>
  );
}
