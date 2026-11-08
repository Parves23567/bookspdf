import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { pdfService } from '../../services/pdfService';

export default function PdfViewer({
  doc,
  pageNum,
  totalPages,
  zoomScale,
  themeFilter,
  onPageChange,
  onToggleToolbars
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Touch Swipe & Pinch-to-zoom handling for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDistance = useRef(0);
  const [pinchScale, setPinchScale] = useState(1);

  // পেজ রেন্ডার করা
  const renderCurrentPage = useCallback(async () => {
    if (!doc || !canvasRef.current || !containerRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const containerWidth = containerRef.current.clientWidth;
      await pdfService.renderPage(
        doc,
        pageNum,
        canvasRef.current,
        zoomScale * pinchScale,
        containerWidth
      );
      setLoading(false);
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PDF render error:', err);
        setError('পৃষ্ঠাটি লোড করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
        setLoading(false);
      }
    }
  }, [doc, pageNum, zoomScale, pinchScale]);

  useEffect(() => {
    renderCurrentPage();

    // উইন্ডো রিসাইজ হলে মোবাইল ফিট অ্যাডজাস্ট করা
    const handleResize = () => {
      renderCurrentPage();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCurrentPage]);

  // মোবাইল সোয়াইপ ও টাচ জেসচার
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistance.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistance.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistance.current;
      const newScale = Math.min(Math.max(pinchScale * factor, 0.8), 3.0);
      setPinchScale(newScale);
      touchDistance.current = dist;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1 && touchDistance.current === 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // আনুভূমিক সোয়াইপ শনাক্তকরণ (কমপক্ষে 60px মুভ এবং উল্লম্বের চেয়ে বেশি)
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0 && pageNum < totalPages) {
          // সোয়াইপ বামে -> পরবর্তী পৃষ্ঠা
          onPageChange(pageNum + 1);
        } else if (deltaX > 0 && pageNum > 1) {
          // সোয়াইপ ডানে -> পূর্ববর্তী পৃষ্ঠা
          onPageChange(pageNum - 1);
        }
      }
    }
    touchDistance.current = 0;
  };

  // থিম অনুযায়ী ফিল্টার ক্লাস
  const filterClass = 
    themeFilter === 'dark' ? 'reader-filter-dark bg-[#121615]' :
    themeFilter === 'sepia' ? 'reader-filter-sepia bg-[#f4ecd8]' :
    'bg-[#f0f0ea] dark:bg-[#151918]';

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // ক্যানভাসে সাধারণ ক্লিকের মাধ্যমে টুলবার অন/অফ
        if (e.target === canvasRef.current || e.target === containerRef.current) {
          onToggleToolbars();
        }
      }}
      className={`relative flex-1 w-full min-h-[calc(100vh-120px)] flex items-center justify-center p-2 sm:p-6 overflow-x-auto overflow-y-auto select-none transition-colors ${filterClass}`}
    >
      {/* লোডিং স্পিনার */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10 dark:bg-black/30 backdrop-blur-sm pointer-events-none">
          <Loader2 className="w-8 h-8 text-library-primary dark:text-library-accent animate-spin" />
          <span className="text-xs font-medium text-library-text dark:text-library-darkText mt-2">
            পৃষ্ঠা {pageNum} লোড হচ্ছে...
          </span>
        </div>
      )}

      {/* এরর মেসেজ */}
      {error && (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800 max-w-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-3">{error}</p>
          <button
            onClick={renderCurrentPage}
            className="px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* PDF রেন্ডারিং ক্যানভাস */}
      <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white max-w-full">
        <canvas
          ref={canvasRef}
          className="block mx-auto max-w-full h-auto shadow-md"
        />
      </div>

      {/* ডেক্সটপ নেভিগেশন ফ্লোটিং বাটন (সহজে ক্লিক করার জন্য) */}
      <button
        onClick={() => pageNum > 1 && onPageChange(pageNum - 1)}
        disabled={pageNum <= 1}
        className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center bg-black/40 hover:bg-black/70 text-white backdrop-blur transition shadow-lg ${
          pageNum <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
        }`}
        title="পূর্ববর্তী পৃষ্ঠা (Keyboard: Arrow Left)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => pageNum < totalPages && onPageChange(pageNum + 1)}
        disabled={pageNum >= totalPages}
        className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center bg-black/40 hover:bg-black/70 text-white backdrop-blur transition shadow-lg ${
          pageNum >= totalPages ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
        }`}
        title="পরবর্তী পৃষ্ঠা (Keyboard: Arrow Right)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

    </div>
  );
}
