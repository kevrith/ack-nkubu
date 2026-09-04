/**
 * Small IndexedDB wrapper used to keep offline Bible books on the device.
 *
 * Everything here awaits transaction completion rather than the individual
 * request, so a caller that awaits a write can trust the data is durable.
 */
const DB_NAME = 'BibleOfflineDB'
const DB_VERSION = 2
export const BOOKS_STORE = 'books'

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = request.result
      // v1 stored api.bible HTML under 'chapters'; the offline reader supersedes
      // it, so drop the old store instead of migrating dead data.
      if (event.oldVersion < 2 && db.objectStoreNames.contains('chapters')) {
        db.deleteObjectStore('chapters')
      }
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        db.createObjectStore(BOOKS_STORE, { keyPath: 'key' })
      }
    }
  })

  // A failed open must not be cached, or every later call fails with it.
  dbPromise.catch(() => {
    dbPromise = null
  })

  return dbPromise
}

/** Resolve once the transaction commits, so writes are durable when awaited. */
function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readonly')
  const record = await req<{ key: string; value: T } | undefined>(
    tx.objectStore(BOOKS_STORE).get(key),
  )
  return record?.value
}

export async function idbPut<T>(key: string, value: T): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readwrite')
  tx.objectStore(BOOKS_STORE).put({ key, value, savedAt: Date.now() })
  await txDone(tx)
}

/** Write many records in one transaction — used when downloading a version. */
export async function idbPutMany<T>(entries: Array<[string, T]>): Promise<void> {
  if (!entries.length) return
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readwrite')
  const store = tx.objectStore(BOOKS_STORE)
  const savedAt = Date.now()
  for (const [key, value] of entries) store.put({ key, value, savedAt })
  await txDone(tx)
}

export async function idbKeys(prefix?: string): Promise<string[]> {
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readonly')
  const keys = await req<IDBValidKey[]>(tx.objectStore(BOOKS_STORE).getAllKeys())
  const asStrings = keys.map(String)
  return prefix ? asStrings.filter((k) => k.startsWith(prefix)) : asStrings
}

export async function idbDeleteByPrefix(prefix: string): Promise<void> {
  const keys = await idbKeys(prefix)
  if (!keys.length) return
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readwrite')
  const store = tx.objectStore(BOOKS_STORE)
  for (const key of keys) store.delete(key)
  await txDone(tx)
}

export async function idbClear(): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(BOOKS_STORE, 'readwrite')
  tx.objectStore(BOOKS_STORE).clear()
  await txDone(tx)
}

/** Rough on-device size of the cached Bible data, in bytes. */
export async function estimateUsage(): Promise<number | null> {
  if (!navigator.storage?.estimate) return null
  const { usage } = await navigator.storage.estimate()
  return usage ?? null
}
