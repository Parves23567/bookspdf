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
  async renderPage(doc, pageNum, canvas, scale = 1.0, containerWidth = null) {
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
      
      // মোবাইল বা কন্টেইনারের প্রস্থ অনুযায়ী স্কেল হিসেব করা
      let finalScale = scale;
      const initialViewport = page.getViewport({ scale: 1.0 });

      if (containerWidth && containerWidth > 50) {
        // প্রস্থ অনুযায়ী ফিট করা (হালকা মার্জিন রেখে)
        const targetWidth = containerWidth - 16;
        finalScale = (targetWidth / initialViewport.width) * scale;
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
        // ইউজার দ্রুত পেজ পরিবর্তন করলে রেন্ডারিং বাতিল হওয়া স্বাভাবিক
        return null;
      }
      console.error(`Page render failed for page ${pageNum}:`, err);
      throw err;
    }
  }

  /**
   * টেক্সট রিডার মোডের জন্য পৃষ্ঠা থেকে ফরম্যাটেড টেক্সট রিড করে
   */
  async extractPageText(doc, pageNum) {
    const cacheKey = `${doc.fingerprint || 'doc'}_${pageNum}`;
    if (this.textCache.has(cacheKey)) {
      return this.textCache.get(cacheKey);
    }

    try {
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let textLines = [];
      let currentLine = '';

      // লাইন ও প্যারাগ্রাফ বিন্যাস
      for (const item of textContent.items) {
        if (!item.str) continue;
        const currentY = Math.round(item.transform[5]);

        if (lastY === null) {
          lastY = currentY;
          currentLine = item.str;
        } else if (Math.abs(currentY - lastY) > 5) {
          // নতুন লাইন শুরু
          textLines.push(currentLine.trim());
          currentLine = item.str;
          lastY = currentY;
        } else {
          // একই লাইনে স্পেস দিয়ে যুক্ত করা
          currentLine += (item.hasEOL ? '\n' : ' ') + item.str;
        }
      }
      if (currentLine.trim()) {
        textLines.push(currentLine.trim());
      }

      const fullText = textLines.join('\n\n');
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
