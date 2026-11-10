import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  Type, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  AlertCircle,
  Sun,
  Moon,
  AlignJustify,
  Maximize2
} from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { storageService } from '../../services/storageService';

export default function TextReader({
  doc,
  book,
  pageNum,
  totalPages,
  onPageChange,
  themeFilter = 'light',
  onThemeFilterChange,
  onToggleToolbars,
  onSwitchToPdf
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  // সেটিংস
  const [fontSize, setFontSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [fontFamily, setFontFamily] = useState('hind'); // 'hind' | 'serif'

  // লোড সেটিংস
  useEffect(() => {
    const saved = storageService.getReaderSettings();
    if (saved.fontSize) setFontSize(saved.fontSize);
    if (saved.lineHeight) setLineHeight(saved.lineHeight);
  }, []);

  // টেক্সট এক্সট্রাক্ট করা
  useEffect(() => {
    let isCancelled = false;

    async function loadText() {
      setLoading(true);
      try {
        let extracted = '';
        if (doc) {
          extracted = await pdfService.extractPageText(doc, pageNum);
        }

        // যদি ব্রাউজার রানটাইমে এক্সট্রাকশনে সমস্যা হয়, সার্চ ইনডেক্স থেকে টেক্সট নেওয়ার ব্যাকআপ ব্যবস্থা
        if (!extracted || extracted.trim().length === 0) {
          try {
            const res = await fetch('/data/search-index.json');
            if (res.ok) {
              const index = await res.json();
              const bookPages = index[book.id];
              const pData = bookPages?.find(p => p.page === pageNum);
              if (pData && pData.text) {
                extracted = pData.text;
              }
            }
          } catch (e) {
            console.warn('Backup text fetch failed:', e);
          }
        }

        if (!isCancelled) {
          setText(extracted);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Text extraction failed:', err);
          setText('');
          setLoading(false);
        }
      }
    }

    loadText();
    return () => {
      isCancelled = true;
    };
  }, [doc, book, pageNum]);

  // ফন্ট পরিবর্তন সংরক্ষণ
  const updateFontSize = (delta) => {
    setFontSize(prev => {
      const next = Math.min(34, Math.max(14, prev + delta));
      storageService.saveReaderSettings({ fontSize: next, lineHeight });
      return next;
    });
  };

  const toggleLineHeight = () => {
    setLineHeight(prev => {
      const next = prev === 1.7 ? 2.0 : prev === 2.0 ? 2.3 : 1.7;
      storageService.saveReaderSettings({ fontSize, lineHeight: next });
      return next;
    });
  };

  // থিম ক্লাস নির্বাচন
  const themeStyles = {
    light: 'bg-[#faf8f2] text-[#222725] border-[#eae5d8]',
    sepia: 'bg-[#f4ecd8] text-[#3d2f1f] border-[#e4d6b6]',
    dark: 'bg-[#151918] text-[#e0e6e3] border-[#252f2b]'
  };

  const currentThemeStyle = themeStyles[themeFilter] || themeStyles.light;

  return (
    <div className={`flex-1 flex flex-col w-full min-h-[calc(100vh-120px)] transition-colors ${currentThemeStyle.split(' ')[0]}`}>
      
      {/* ১. শীর্ষ রিডিং মোড কন্ট্রোল বার (মোবাইল ও ডেক্সটপ) */}
      <div className="border-b border-black/10 dark:border-white/10 px-3 sm:px-6 py-2 flex items-center justify-between text-xs backdrop-blur-md sticky top-0 z-20 bg-inherit shadow-2xs">
        
        {/* বাম পাশ: রিডিং মোড ব্যাজ ও মূল PDF সুইচ */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
            <FileText className="w-3.5 h-3.5" />
            <span>রিডিং মোড</span>
          </span>

          {onSwitchToPdf && (
            <button
              onClick={onSwitchToPdf}
              className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition font-medium text-library-textMuted hover:text-library-text flex items-center gap-1"
              title="মূল PDF পৃষ্ঠায় পরিবর্তন করুন"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">মূল PDF</span>
            </button>
          )}
        </div>

        {/* ডান পাশ: ফন্ট সাইজ, স্পেসিং, ফন্ট ফ্যামিলি ও থিম */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* ফন্ট সাইজ কন্ট্রোল */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => updateFontSize(-1)}
              className="px-2 py-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold text-xs"
              title="ফন্ট সাইজ ছোট করুন"
            >
              A-
            </button>
            <span className="px-1 text-[11px] font-mono opacity-80">{fontSize}px</span>
            <button
              onClick={() => updateFontSize(1)}
              className="px-2 py-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold text-xs"
              title="ফন্ট সাইজ বড় করুন"
            >
              A+
            </button>
          </div>

          {/* লাইন স্পেসিং টগল */}
          <button
            onClick={toggleLineHeight}
            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition"
            title={`লাইন স্পেসিং: ${lineHeight} (ক্লিক করে পরিবর্তন করুন)`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          {/* ফন্ট স্টাইল (হিন্দ শিলিগুড়ি / সেরিফ) */}
          <button
            onClick={() => setFontFamily(prev => prev === 'hind' ? 'serif' : 'hind')}
            className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition font-medium text-[11px]"
            title="ফন্ট স্টাইল পরিবর্তন করুন"
          >
            {fontFamily === 'hind' ? 'সেরিফ' : 'স্যান্স'}
          </button>

          {/* থিম পরিবর্তন (Light / Sepia / Dark) */}
          {onThemeFilterChange && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/5 dark:bg-white/10">
              <button
                onClick={() => onThemeFilterChange('light')}
                className={`w-5 h-5 rounded flex items-center justify-center transition ${
                  themeFilter === 'light' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'opacity-60'
                }`}
                title="দিনের আলো (Light)"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => onThemeFilterChange('sepia')}
                className={`w-5 h-5 rounded flex items-center justify-center transition bg-[#e8d8b8] text-[#3d2f1f] ${
                  themeFilter === 'sepia' ? 'ring-1 ring-amber-700 font-bold' : 'opacity-60'
                }`}
                title="সেপিয়া (আই-কেয়ার চোখ-বান্ধব)"
              >
                <span className="text-[9px] font-bold">সে</span>
              </button>
              <button
                onClick={() => onThemeFilterChange('dark')}
                className={`w-5 h-5 rounded flex items-center justify-center transition bg-gray-900 text-yellow-300 ${
                  themeFilter === 'dark' ? 'ring-1 ring-yellow-400' : 'opacity-60'
                }`}
                title="রাতের অন্ধকার (Night)"
              >
                <Moon className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ২. টেক্সট কন্টেইনার (মোবাইল-ফার্স্ট মার্জিত টাইপোগ্রাফি) */}
      <div 
        onClick={onToggleToolbars}
        className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-10 py-8 leading-relaxed select-text cursor-default"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-library-primary dark:text-library-accent animate-spin" />
            <p className="text-xs font-semibold opacity-75">পৃষ্ঠার বাংলা লেখা রিডিং মোডে সাজানো হচ্ছে...</p>
          </div>
        ) : text && text.trim().length > 0 ? (
          <article
            className={`transition-all ${
              fontFamily === 'serif' ? 'font-serif' : 'font-hind'
            }`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight
            }}
          >
            {text.split('\n\n').filter(p => p.trim()).map((para, idx) => (
              <p key={idx} className="mb-6 text-justify" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                {para.trim()}
              </p>
            ))}
          </article>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-90">
            <AlertCircle className="w-10 h-10 text-amber-500" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base">এই পৃষ্ঠায় টেক্সট এক্সট্রাক্ট করা সম্ভব হয়নি</h4>
              <p className="text-xs max-w-sm text-library-textMuted dark:text-library-darkTextMuted">
                পৃষ্ঠাটি সম্ভবত চিত্রবহুল বা বিশেষ প্রচ্ছদ। সম্পূর্ণ নিখুঁতভাবে দেখতে নিচের বাটনে ক্লিক করুন।
              </p>
            </div>
            {onSwitchToPdf && (
              <button
                onClick={onSwitchToPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-library-primary text-white dark:bg-library-accent dark:text-library-primaryDark font-semibold text-xs shadow-sm hover:opacity-90 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>মূল PDF পৃষ্ঠায় দেখুন</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ৩. টেক্সট মোডের বটম পেজার */}
      <div className="border-t border-black/10 dark:border-white/10 px-4 py-3 flex items-center justify-between text-xs bg-inherit max-w-3xl mx-auto w-full">
        <button
          onClick={() => pageNum > 1 && onPageChange(pageNum - 1)}
          disabled={pageNum <= 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition ${
            pageNum <= 1 ? 'opacity-30 pointer-events-none' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 shadow-2xs'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> আগের পৃষ্ঠা
        </button>

        <span className="font-semibold opacity-80 font-mono">
          পৃষ্ঠা {pageNum} / {totalPages}
        </span>

        <button
          onClick={() => pageNum < totalPages && onPageChange(pageNum + 1)}
          disabled={pageNum >= totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition ${
            pageNum >= totalPages ? 'opacity-30 pointer-events-none' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 shadow-2xs'
          }`}
        >
          পরের পৃষ্ঠা <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
