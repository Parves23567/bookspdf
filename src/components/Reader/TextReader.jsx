import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Type, Sliders, ChevronLeft, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { storageService } from '../../services/storageService';

export default function TextReader({
  doc,
  book,
  pageNum,
  totalPages,
  onPageChange,
  themeFilter,
  onToggleToolbars
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTypographyPanel, setShowTypographyPanel] = useState(false);

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
      const next = Math.min(32, Math.max(14, prev + delta));
      storageService.saveReaderSettings({ fontSize: next, lineHeight });
      return next;
    });
  };

  const updateLineHeight = (delta) => {
    setLineHeight(prev => {
      const next = Math.min(2.6, Math.max(1.4, Math.round((prev + delta) * 10) / 10));
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
      
      {/* টাইপোগ্রাফি কন্ট্রোল প্যানেল (মোবাইল ও ডেক্সটপ) */}
      <div className="border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center justify-between text-xs backdrop-blur-sm sticky top-0 z-10 bg-inherit">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-library-primary dark:text-library-accent flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> টেক্সট রিডিং মোড
          </span>
          <span className="text-gray-400">|</span>
          <span className="opacity-75">পৃষ্ঠা {pageNum} / {totalPages}</span>
        </div>

        {/* ফন্ট সাইজ ও স্পেসিং কুইক কন্ট্রোলস */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => updateFontSize(-1)}
              className="px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold"
              title="ফন্ট সাইজ ছোট করুন"
            >
              A-
            </button>
            <span className="px-1 text-[11px] font-mono opacity-80">{fontSize}px</span>
            <button
              onClick={() => updateFontSize(1)}
              className="px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold"
              title="ফন্ট সাইজ বড় করুন"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setFontFamily(prev => prev === 'hind' ? 'serif' : 'hind')}
            className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition font-medium"
            title="ফন্ট স্টাইল পরিবর্তন করুন"
          >
            {fontFamily === 'hind' ? 'সেরিফ' : 'স্যান্স'}
          </button>
        </div>
      </div>

      {/* টেক্সট কন্টেইনার */}
      <div 
        onClick={onToggleToolbars}
        className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-10 py-8 leading-relaxed select-text"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-7 h-7 text-library-primary dark:text-library-accent animate-spin" />
            <p className="text-xs font-medium opacity-70">পৃষ্ঠার বাংলা লেখা সাজানো হচ্ছে...</p>
          </div>
        ) : text && text.trim().length > 0 ? (
          <div
            className={`transition-all whitespace-pre-wrap ${
              fontFamily === 'serif' ? 'font-serif' : 'font-hind'
            }`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight
            }}
          >
            {text.split('\n\n').map((para, idx) => (
              <p key={idx} className="mb-5 text-justify">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-80">
            <AlertCircle className="w-8 h-8 text-amber-500" />
            <h4 className="font-semibold text-sm">এই পৃষ্ঠায় এক্সট্রাক্টযোগ্য টেক্সট সীমিত</h4>
            <p className="text-xs max-w-xs">
              পৃষ্ঠাটি সম্ভবত চিত্র বা বিশেষ প্রচ্ছদ। সম্পূর্ণ নিখুঁত প্রদর্শনের জন্য "মূল PDF ভিউয়ার" ব্যবহার করুন।
            </p>
          </div>
        )}
      </div>

      {/* টেক্সট মোডের বটম পেজার */}
      <div className="border-t border-black/10 dark:border-white/10 px-4 py-3 flex items-center justify-between text-xs bg-inherit max-w-3xl mx-auto w-full">
        <button
          onClick={() => pageNum > 1 && onPageChange(pageNum - 1)}
          disabled={pageNum <= 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition ${
            pageNum <= 1 ? 'opacity-30 pointer-events-none' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> আগের পৃষ্ঠা
        </button>

        <span className="font-semibold opacity-80">
          পৃষ্ঠা {pageNum} / {totalPages}
        </span>

        <button
          onClick={() => pageNum < totalPages && onPageChange(pageNum + 1)}
          disabled={pageNum >= totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition ${
            pageNum >= totalPages ? 'opacity-30 pointer-events-none' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
          }`}
        >
          পরের পৃষ্ঠা <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
