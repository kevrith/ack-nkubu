const DB_NAME = 'BibleOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'chapters';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveChapterOffline(chapterId: string, content: any): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  await store.put({
    id: chapterId,
    content,
    savedAt: new Date().toISOString(),
  });
}

export async function getChapterOffline(chapterId: string): Promise<any> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  
  return new Promise((resolve, reject) => {
    const request = store.get(chapterId);
    request.onsuccess = () => resolve(request.result?.content);
    request.onerror = () => reject(request.error);
  });
}

export async function clearOfflineChapters(): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  await store.clear();
}
