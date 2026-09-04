/**
 * Offline Bible reader.
 *
 * Reads the public-domain / openly-licensed translations that
 * `scripts/build-bible.mjs` compiles into public/bible/<VERSION>/<BOOK>.json.
 * Books are fetched once, kept in IndexedDB, and served from there afterwards,
 * so a version the user has opened (or explicitly downloaded) keeps working
 * with no network and no API key — the same behaviour as the official ACK
 * "Kitabu Kipya cha Ibada" app.
 */
import { BibleBook, BibleChapter, BibleVersion } from '@/types/bible'
import { idbGet, idbPutMany, idbKeys, idbDeleteByPrefix } from '@/lib/offlineStorage'

/** Versions bundled with the app. Everything else falls back to api.bible. */
export const OFFLINE_VERSIONS = ['KJV', 'WEB', 'ONEN'] as const
export type OfflineVersion = (typeof OFFLINE_VERSIONS)[number]

export function isOfflineVersion(version: BibleVersion): version is OfflineVersion {
  return (OFFLINE_VERSIONS as readonly string[]).includes(version)
}

// ─── Shapes written by scripts/build-bible.mjs ───────────────────────────────

export interface OfflineVerse {
  /** Verse number. */
  v: number
  /** Verse text; "\n" separates poetic/list lines within one verse. */
  t: string
  /** USFM paragraph style the verse starts in (p, q1, li1, …). */
  s: string
  /** Section headings introduced immediately before this verse. */
  h?: string[]
}

export interface OfflineChapter {
  n: number
  verses: OfflineVerse[]
}

export interface OfflineBook {
  id: string
  name: string
  abbr: string
  chapters: OfflineChapter[]
}

export interface OfflineBookMeta {
  id: string
  name: string
  abbr: string
  chapters: number
  testament: 'OT' | 'NT'
}

export interface OfflineManifest {
  id: OfflineVersion
  name: string
  language: string
  copyright: string
  source: string
  builtAt: string
  books: OfflineBookMeta[]
}

// ─── Fetching + caching ──────────────────────────────────────────────────────

const BASE = `${import.meta.env.BASE_URL}bible`
const bookKey = (version: string, bookId: string) => `${version}:${bookId}`
const manifestKey = (version: string) => `${version}:__manifest`

/** In-flight requests, so concurrent readers of one book share a single fetch. */
const inflight = new Map<string, Promise<unknown>>()

function dedupe<T>(key: string, run: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined
  if (existing) return existing
  const promise = run().finally(() => inflight.delete(key))
  inflight.set(key, promise)
  return promise
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`)
  return (await res.json()) as T
}

export function getManifest(version: OfflineVersion): Promise<OfflineManifest> {
  return dedupe(manifestKey(version), async () => {
    const cached = await idbGet<OfflineManifest>(manifestKey(version)).catch(() => undefined)
    if (cached) return cached

    const manifest = await fetchJson<OfflineManifest>(`${BASE}/${version}/manifest.json`)
    await idbPutMany([[manifestKey(version), manifest]]).catch(() => {})
    return manifest
  })
}

export function getBook(version: OfflineVersion, bookId: string): Promise<OfflineBook> {
  const key = bookKey(version, bookId)
  return dedupe(key, async () => {
    const cached = await idbGet<OfflineBook>(key).catch(() => undefined)
    if (cached) return cached

    const book = await fetchJson<OfflineBook>(`${BASE}/${version}/${bookId}.json`)
    await idbPutMany([[key, book]]).catch(() => {})
    return book
  })
}

export async function getBooks(version: OfflineVersion): Promise<BibleBook[]> {
  const manifest = await getManifest(version)
  return manifest.books.map((b) => ({
    id: b.id,
    name: b.name,
    nameLong: b.name,
    abbreviation: b.abbr,
  }))
}

export async function getChapterCounts(version: OfflineVersion): Promise<Record<string, number>> {
  const manifest = await getManifest(version)
  return Object.fromEntries(manifest.books.map((b) => [b.id, b.chapters]))
}

// ─── Rendering ───────────────────────────────────────────────────────────────

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c])
}

/** Map a USFM paragraph marker onto the classes styled in globals.css. */
function styleClass(style: string): string {
  if (style === 'q' || style === 'q1' || style === 'qm' || style === 'qm1') return 'q1'
  if (style === 'q2' || style === 'qm2' || style === 'q3' || style === 'q4') return 'q2'
  if (style === 'li' || style === 'li1' || style === 'lim' || style === 'lim1') return 'li1'
  if (style === 'li2' || style === 'li3' || style === 'li4' || style === 'lim2') return 'li2'
  if (style === 'd') return 'd'
  if (style === 'pi' || style === 'pi1' || style === 'mi') return 'q1'
  if (style === 'pi2') return 'q2'
  return 'p'
}

/**
 * Render one chapter to the HTML string ChapterView renders, reusing the
 * existing .bible-content classes (.v verse numbers, .s1 headings, .q1/.q2
 * poetry indents).
 */
export function renderChapterHtml(chapter: OfflineChapter): string {
  const parts: string[] = []

  for (const verse of chapter.verses) {
    for (const heading of verse.h ?? []) {
      // eBible marks cross-reference lines with surrounding parentheses.
      const isReference = /^\(.*\)$/.test(heading)
      parts.push(
        `<div class="${isReference ? 'r' : 's1'}">${escapeHtml(heading)}</div>`,
      )
    }

    const cls = styleClass(verse.s)
    const lines = verse.t.split('\n').map(escapeHtml).join('<br/>')
    parts.push(`<p class="${cls}"><span class="v">${verse.v}</span>${lines}</p>`)
  }

  return parts.join('\n')
}

/** Plain text of a chapter, for sharing and comparison views. */
export function chapterToText(chapter: OfflineChapter): string {
  return chapter.verses.map((v) => `${v.v} ${v.t.replace(/\n/g, ' ')}`).join('\n')
}

// ─── Public reader API ───────────────────────────────────────────────────────

/** Split "GEN.1" into its book code and chapter number. */
export function parseChapterId(chapterId: string): { bookId: string; chapterNum: number } | null {
  const lastDot = chapterId.lastIndexOf('.')
  if (lastDot === -1) return null
  const bookId = chapterId.substring(0, lastDot)
  const chapterNum = parseInt(chapterId.substring(lastDot + 1), 10)
  if (Number.isNaN(chapterNum)) return null
  return { bookId, chapterNum }
}

export async function getChapter(
  version: OfflineVersion,
  chapterId: string,
): Promise<BibleChapter> {
  const parsed = parseChapterId(chapterId)
  if (!parsed) throw new Error(`Invalid chapter reference: ${chapterId}`)

  const book = await getBook(version, parsed.bookId)
  const chapter = book.chapters.find((c) => c.n === parsed.chapterNum)
  if (!chapter) throw new Error(`${book.name} has no chapter ${parsed.chapterNum}`)

  return {
    id: chapterId,
    number: String(chapter.n),
    content: renderChapterHtml(chapter),
    reference: `${book.name} ${chapter.n}`,
  }
}

export interface OfflineSearchHit {
  reference: string
  chapterId: string
  text: string
}

/**
 * Search the whole translation. Books already in IndexedDB are searched
 * directly; any that are missing are fetched (and cached) as we go, so the
 * first search on a fresh install warms the cache and later ones are instant.
 */
export async function search(
  version: OfflineVersion,
  query: string,
  { limit = 50, signal }: { limit?: number; signal?: AbortSignal } = {},
): Promise<OfflineSearchHit[]> {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const manifest = await getManifest(version)
  const hits: OfflineSearchHit[] = []

  for (const meta of manifest.books) {
    if (signal?.aborted) break

    let book: OfflineBook
    try {
      book = await getBook(version, meta.id)
    } catch {
      continue // A missing book must not abort the whole search.
    }

    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        const flat = verse.t.replace(/\n/g, ' ')
        if (!flat.toLowerCase().includes(needle)) continue
        hits.push({
          reference: `${book.name} ${chapter.n}:${verse.v}`,
          chapterId: `${meta.id}.${chapter.n}`,
          text: flat,
        })
        if (hits.length >= limit) return hits
      }
    }
  }

  return hits
}

// ─── Download management ─────────────────────────────────────────────────────

export interface DownloadProgress {
  done: number
  total: number
  book: string
}

/**
 * Pull every book of a translation into IndexedDB so it reads with no network.
 * Books are written in batches to keep the number of transactions sane.
 */
export async function downloadVersion(
  version: OfflineVersion,
  onProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<void> {
  const manifest = await getManifest(version)
  const existing = new Set(await idbKeys(`${version}:`).catch(() => []))

  const batch: Array<[string, OfflineBook]> = []
  let done = 0

  for (const meta of manifest.books) {
    if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError')

    const key = bookKey(version, meta.id)
    if (!existing.has(key)) {
      const book = await fetchJson<OfflineBook>(`${BASE}/${version}/${meta.id}.json`, signal)
      batch.push([key, book])
      if (batch.length >= 8) {
        await idbPutMany(batch)
        batch.length = 0
      }
    }

    done++
    onProgress?.({ done, total: manifest.books.length, book: meta.name })
  }

  if (batch.length) await idbPutMany(batch)
}

/** How many books of a version are currently stored on the device. */
export async function getDownloadedCount(version: OfflineVersion): Promise<number> {
  const keys = await idbKeys(`${version}:`).catch(() => [])
  return keys.filter((k) => !k.endsWith('__manifest')).length
}

export async function isVersionDownloaded(version: OfflineVersion): Promise<boolean> {
  const [manifest, count] = await Promise.all([
    getManifest(version).catch(() => null),
    getDownloadedCount(version),
  ])
  return !!manifest && count >= manifest.books.length
}

export async function removeVersion(version: OfflineVersion): Promise<void> {
  await idbDeleteByPrefix(`${version}:`)
}
