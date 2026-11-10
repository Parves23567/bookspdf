/**
 * PDF Service using PDF.js
 * 
 * হাই-পারফরম্যান্স PDF লোডিং ও রেন্ডারিং সার্ভিস।
 * ক্যানভাস মেমরি ম্যানেজমেন্ট, দ্রুত পৃষ্ঠা নেভিগেশন ও টেক্সট নিষ্কাশন পরিচালনা করে।
 */

import * as pdfjsLib from 'pdfjs-dist';

// সেটআপ অফলাইন লোকাল সার্ভিস কর্মী
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

class PdfService {
  constructor() {
    this.docCache = new Map();
    this.textCache = new Map();
    this.currentRenderTasks = new Map();
  }

  /**
   * PDF ডকুমেন্ট লোড করে মেমরিতে ক্যাশ রাখে
   */
  async loadDocument(bookId, filePath) {
    if (this.docCache.has(bookId)) {
      return this.docCache.get(bookId);
    }

    try {
      const loadingTask = pdfjsLib.getDocument({
        url: filePath.startsWith('/') ? filePath : `/books/${filePath}`,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
        enableXfa: false
      });

      const doc = await loadingTask.promise;
      this.docCache.set(bookId, doc);
      return doc;
    } catch (err) {
      console.error(`Error loading PDF document (${bookId}):`, err);
      throw err;
    }
  }

  /**
   * নির্দিষ্ট পৃষ্ঠা ক্যানভাসে ড্র করে
   */
  async renderPage(doc, pageNum, canvas, scale = 1.0, containerWidth = null, containerHeight = null) {
    if (!doc || !canvas || pageNum < 1 || pageNum > doc.numPages) return null;

    // পূর্বের কোনো রেন্ডার চালু থাকলে তা বাতিল করুন
    const canvasKey = canvas;
    if (this.currentRenderTasks.has(canvasKey)) {
      try {
        const prevTask = this.currentRenderTasks.get(canvasKey);
        prevTask.cancel();
      } catch (e) {
        // ignore cancellation errors
      }
      this.currentRenderTasks.delete(canvasKey);
    }

    try {
      const page = await doc.getPage(pageNum);
      
      // মোবাইল বা কন্টেইনারের প্রস্থ ও উচ্চতা অনুযায়ী স্কেল হিসেব করা
      let finalScale = scale;
      const initialViewport = page.getViewport({ scale: 1.0 });

      if (containerWidth && containerWidth > 50) {
        const isMobile = containerWidth < 640;
        
        if (containerHeight && containerHeight > 100) {
          const paddingX = isMobile ? 0 : (containerWidth < 1024 ? 12 : 24);
          const paddingY = isMobile ? 0 : 16;
          
          const availWidth = Math.max(containerWidth - paddingX, 50);
          const availHeight = Math.max(containerHeight - paddingY, 100);

          const scaleWidth = availWidth / initialViewport.width;
          const scaleHeight = availHeight / initialViewport.height;

          if (isMobile) {
            // মোবাইল পোর্ট্রেটে স্ক্রিনের সম্পূর্ণ প্রস্থ জুড়ে বড় ও স্পষ্ট পেজ ডিসপ্লে
            finalScale = scaleWidth * scale;
          } else {
            // ট্যাবলেট ও ডেক্সটপে পুরো পেজ স্ক্রিনের বড় অংশ জুড়ে এক নজরে সুন্দরভাবে দৃশ্যমান
            const fitScale = Math.min(scaleWidth, scaleHeight * 0.98);
            finalScale = Math.max(fitScale, 0.6) * scale;
          }
        } else {
          const padding = isMobile ? 0 : (containerWidth < 1024 ? 8 : 16);
          const targetWidth = containerWidth - padding;
          finalScale = (targetWidth / initialViewport.width) * scale;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // খুব বেশি মেমরি ব্যবহার রোধে সর্বোচ্চ ২.৫
      const viewport = page.getViewport({ scale: finalScale });

      // ক্যানভাস সাইজিং ও শার্পনেস
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      this.currentRenderTasks.set(canvasKey, renderTask);

      await renderTask.promise;
      this.currentRenderTasks.delete(canvasKey);

      return {
        viewport,
        pageNumber: pageNum,
        width: viewport.width,
        height: viewport.height
      };
    } catch (err) {
      if (err?.name === 'RenderingCancelledException') {
        // ইউজার দ্রুত পেজ পরিবর্তন করলে রেন্ডারিং বাতিল হওয়া স্বাভাবিক
        return null;
      }
      console.error(`Page render failed for page ${pageNum}:`, err);
      throw err;
    }
  }

  /**
   * টেক্সট রিডার মোডের জন্য পৃষ্ঠা থেকে ফরম্যাটেড টেক্সট রিড করে।
   * Bengali/Indic PDFs-এ প্রতিটি গ্লিফ আলাদা item — তাই x-gap দেখে
   * সঠিকভাবে শব্দ ও প্যারাগ্রাফ গঠন করা হয়।
   */
  async extractPageText(doc, pageNum) {
    const cacheKey = `${doc.fingerprint || 'doc'}_${pageNum}`;
    if (this.textCache.has(cacheKey)) {
      return this.textCache.get(cacheKey);
    }

    try {
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent({ includeMarkedContent: false });

      // ── থ্রেশহোল্ড ─────────────────────────────────────────────────────
      const SAME_LINE_Y   = 4;   // এই পরিমাণ Y-পার্থক্য থাকলে একই লাইন
      const WORD_GAP_MIN  = 2;   // এই পরিমাণ X-ফাঁক থাকলে নতুন শব্দ

      // সব item ফিল্টার
      const items = textContent.items.filter(it => it.str != null && it.str !== '');

      // ── Y অনুযায়ী লাইনে ভাগ করা ──────────────────────────────────────
      const lines = [];
      let currentLine = null;

      for (const item of items) {
        const y = item.transform[5];
        const x = item.transform[4];
        const w = item.width != null ? item.width : (item.str.length * 5); // fallback width

        if (!currentLine || Math.abs(y - currentLine.y) > SAME_LINE_Y) {
          currentLine = { y, segments: [] };
          lines.push(currentLine);
        }
        currentLine.segments.push({ x, w, str: item.str });
      }

      // ── PDF Y-axis উল্টো তাই নিচ থেকে উপরে sort (top-of-page first) ──
      lines.sort((a, b) => b.y - a.y);

      // ── প্রতিটি লাইনের সেগমেন্ট বাম থেকে ডানে merge করা ────────────
      const mergedLines = lines.map(line => {
        line.segments.sort((a, b) => a.x - b.x);
        let result = '';
        let prevRight = null;

        for (const seg of line.segments) {
          if (prevRight === null) {
            result = seg.str;
          } else {
            const gap = seg.x - prevRight;
            if (gap > WORD_GAP_MIN) {
              // সত্যিকারের শব্দ ফাঁক — একটি space যোগ করো
              result += ' ' + seg.str;
            } else {
              // পাশাপাশি গ্লিফ — space ছাড়াই জোড়া লাগাও (Bengali ligature)
              result += seg.str;
            }
          }
          prevRight = seg.x + seg.w;
        }
        return result.trim();
      }).filter(l => l.length > 0);

      // ── লাইনগুলোকে প্যারাগ্রাফে রূপান্তর করা ─────────────────────────
      // নিয়ম: বাক্য-সমাপ্তি চিহ্নে (।  !  ?  .) প্যারাগ্রাফ বিরতি দাও,
      // অন্যথায় একই প্যারাগ্রাফে space দিয়ে জুড়ে দাও।
      let paragraphs = [];
      let currentPara = '';

      for (let i = 0; i < mergedLines.length; i++) {
        const line = mergedLines[i];
        const isEnd = /[।!?.]$/.test(line);

        if (currentPara === '') {
          currentPara = line;
        } else {
          currentPara += ' ' + line;
        }

        if (isEnd) {
          paragraphs.push(currentPara);
          currentPara = '';
        }
      }
      if (currentPara.trim()) {
        paragraphs.push(currentPara);
      }

      const fullText = paragraphs.join('\n\n');
      this.textCache.set(cacheKey, fullText);
      return fullText;
    } catch (err) {
      console.error(`Failed to extract text for page ${pageNum}:`, err);
      return '';
    }
  }

  /**
   * PDF থেকে সূচিপত্র (Outline) বের করা
   */
  async extractOutline(doc) {
    try {
      const outline = await doc.getOutline();
      return outline || [];
    } catch (err) {
      return [];
    }
  }
}

export const pdfService = new PdfService();
