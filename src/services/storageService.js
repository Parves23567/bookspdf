/**
 * Storage Service - LocalStorage & Future Firebase Bridge
 * 
 * এই সার্ভিসটি বই পড়ার অগ্রগতি (Reading Progress), বুকমার্ক এবং রিডার সেটিংস
 * ব্রাউজারের LocalStorage-এ নিরাপদে সংরক্ষণ করে।
 * 
 * ভবিষ্যতে Firebase Cloud Firestore যুক্ত করতে চাইলে:
 * নিচে দেওয়া `FirebaseSyncProvider` ইন্টারফেসে Firebase SDK যুক্ত করলেই চলবে।
 */

const STORAGE_KEYS = {
  PROGRESS_PREFIX: 'bangla_library_progress_',
  BOOKMARKS_PREFIX: 'bangla_library_bookmarks_',
  LAST_READ: 'bangla_library_last_read',
  READER_SETTINGS: 'bangla_library_reader_settings',
  APP_THEME: 'bangla_library_theme'
};

class StorageService {
  constructor() {
    this.cloudSyncEnabled = false; // Firebase যুক্ত করলে true করুন
  }

  // --- Reading Progress ---

  saveProgress(bookId, currentPage, totalPages) {
    if (!bookId || !currentPage) return;
    
    const pct = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0;
    const progressData = {
      bookId,
      currentPage,
      totalPages,
      percentage: pct,
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem(`${STORAGE_KEYS.PROGRESS_PREFIX}${bookId}`, JSON.stringify(progressData));
      localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(progressData));
    } catch (e) {
      console.error('Failed to save reading progress locally:', e);
    }

    if (this.cloudSyncEnabled) {
      this.syncProgressToCloud(progressData);
    }

    return progressData;
  }

  getProgress(bookId) {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.PROGRESS_PREFIX}${bookId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  getLastRead() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_READ);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  getAllProgress() {
    const all = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.PROGRESS_PREFIX)) {
          const bookId = key.replace(STORAGE_KEYS.PROGRESS_PREFIX, '');
          const val = JSON.parse(localStorage.getItem(key));
          all[bookId] = val;
        }
      }
    } catch (e) {
      console.error('Error fetching all progress:', e);
    }
    return all;
  }

  // --- Bookmarks ---

  getBookmarks(bookId) {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.BOOKMARKS_PREFIX}${bookId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addBookmark(bookId, page, title = '', snippet = '') {
    const list = this.getBookmarks(bookId);
    // Don't add duplicate for same page
    if (list.some(b => b.page === page)) {
      return list;
    }

    const newBookmark = {
      id: `${bookId}_p${page}_${Date.now()}`,
      bookId,
      page,
      title: title || `পৃষ্ঠা ${page}`,
      snippet: snippet ? snippet.slice(0, 120) : '',
      createdAt: Date.now()
    };

    const updated = [newBookmark, ...list];
    try {
      localStorage.setItem(`${STORAGE_KEYS.BOOKMARKS_PREFIX}${bookId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save bookmark:', e);
    }

    if (this.cloudSyncEnabled) {
      this.syncBookmarksToCloud(bookId, updated);
    }

    return updated;
  }

  removeBookmark(bookId, bookmarkId) {
    const list = this.getBookmarks(bookId);
    const updated = list.filter(b => b.id !== bookmarkId && b.page !== bookmarkId);
    try {
      localStorage.setItem(`${STORAGE_KEYS.BOOKMARKS_PREFIX}${bookId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete bookmark:', e);
    }
    return updated;
  }

  isBookmarked(bookId, page) {
    const list = this.getBookmarks(bookId);
    return list.some(b => b.page === page);
  }

  // --- Reader Settings ---

  getReaderSettings() {
    const defaultSettings = {
      mode: 'pdf', // 'pdf' | 'text'
      theme: 'light', // 'light' | 'sepia' | 'dark'
      fontSize: 18, // px
      lineHeight: 1.8,
      paragraphSpacing: 16
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READER_SETTINGS);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  }

  saveReaderSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.READER_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save reader settings:', e);
    }
  }

  // --- App Theme (Light/Dark) ---

  getAppTheme() {
    return localStorage.getItem(STORAGE_KEYS.APP_THEME) || 'light';
  }

  saveAppTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.APP_THEME, theme);
  }

  // --- Future Firebase Cloud Sync Placeholders ---

  syncProgressToCloud(progressData) {
    // Firebase Firestore Implementation Example:
    // import { doc, setDoc } from "firebase/firestore";
    // import { db, auth } from "./firebase";
    // if (auth.currentUser) {
    //   setDoc(doc(db, "users", auth.currentUser.uid, "progress", progressData.bookId), progressData);
    // }
    console.log('[Future Firebase] Ready to sync reading progress:', progressData);
  }

  syncBookmarksToCloud(bookId, bookmarks) {
    // Firebase Firestore Implementation Example:
    // setDoc(doc(db, "users", auth.currentUser.uid, "bookmarks", bookId), { bookmarks });
    console.log('[Future Firebase] Ready to sync bookmarks for book:', bookId, bookmarks);
  }
}

export const storageService = new StorageService();
