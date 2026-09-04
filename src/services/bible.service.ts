import { BibleVersion, BibleBook, BibleChapter } from '@/types/bible'
import { supabase } from '@/lib/supabase'
import * as offline from './offlineBible'

const API_KEY = import.meta.env.VITE_API_BIBLE_KEY
const BASE_URL = 'https://rest.api.bible/v1'

/** api.bible identifiers for the versions we cannot bundle ourselves. */
const VERSION_IDS: Partial<Record<BibleVersion, string>> = {
  NIV: 'de4e12af7f28f599-01',
  NLT: '65eec8e0b60e656b-01',
  KJV: 'de4e12af7f28f599-02',
}

export interface VersionInfo {
  label: string
  description: string
  language: string
  /** True when the text ships with the app and needs no network or API key. */
  offline: boolean
}

/**
 * Single source of truth for the versions the app offers.
 *
 * KJV, WEB and ONEN are compiled into public/bible by scripts/build-bible.mjs
 * and read straight off the device — the same three the official ACK app
 * carries. NIV and NLT are licensed texts, so they stay on api.bible and only
 * appear when a key is configured.
 */
export const VERSION_INFO: Record<BibleVersion, VersionInfo> = {
  KJV:  { label: 'KJV',  description: 'King James Version',      language: 'English',   offline: true },
  WEB:  { label: 'WEB',  description: 'World English Bible',     language: 'English',   offline: true },
  ONEN: { label: 'ONEN', description: 'Neno: Bibilia Takatifu',  language: 'Kiswahili', offline: true },
  NIV:  { label: 'NIV',  description: 'New International Version', language: 'English', offline: false },
  NLT:  { label: 'NLT',  description: 'New Living Translation',  language: 'English',   offline: false },
}

export function hasApiKey(): boolean {
  return !!API_KEY && API_KEY !== 'your-api-bible-key'
}

/**
 * Versions the user can actually read right now: the bundled ones always, plus
 * the api.bible ones when a key is present.
 */
export const AVAILABLE_VERSIONS: BibleVersion[] = (
  ['KJV', 'WEB', 'ONEN', 'NIV', 'NLT'] as BibleVersion[]
).filter((v) => VERSION_INFO[v].offline || hasApiKey())

async function bibleRequest<T>(endpoint: string): Promise<T> {
  if (!hasApiKey()) {
    throw new Error('API key not configured')
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'api-key': API_KEY,
      'Accept': 'application/json'
    },
  })

  if (!res.ok) {
    throw new Error(`Invalid API key. Get a new one from https://scripture.api.bible/admin`)
  }

  const json = await res.json()
  return json.data
}

export const bibleService = {
  getBooks: async (version: BibleVersion): Promise<BibleBook[]> => {
    if (offline.isOfflineVersion(version)) {
      return offline.getBooks(version)
    }
    return bibleRequest(`/bibles/${VERSION_IDS[version]}/books`)
  },

  getChapter: async (version: BibleVersion, chapterId: string): Promise<BibleChapter> => {
    // Bundled versions read from the device — no network, no cache lookup.
    if (offline.isOfflineVersion(version)) {
      return offline.getChapter(version, chapterId)
    }

    // Try cache first
    const { data: cached } = await supabase
      .from('bible_cache')
      .select('*')
      .eq('version', version)
      .eq('chapter_id', chapterId)
      .single();

    if (cached) {
      return { 
        id: cached.chapter_id,
        number: cached.chapter_id,
        content: cached.content, 
        reference: cached.reference 
      };
    }

    // Fetch from API
    const chapter = await bibleRequest<BibleChapter>(
      `/bibles/${VERSION_IDS[version]}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true`
    );

    // Cache it (ignore errors)
    supabase.from('bible_cache').insert({
      version,
      chapter_id: chapterId,
      content: chapter.content,
      reference: chapter.reference
    }).then(() => {}, () => {});

    return chapter;
  },

  search: async (version: BibleVersion, query: string) => {
    if (offline.isOfflineVersion(version)) {
      const hits = await offline.search(version, query)
      // Match the api.bible search envelope the UI already understands.
      return {
        query,
        total: hits.length,
        verses: hits.map((hit) => ({
          id: `${hit.chapterId}.${hit.reference}`,
          reference: hit.reference,
          text: hit.text,
          chapterId: hit.chapterId,
        })),
      }
    }
    return bibleRequest(`/bibles/${VERSION_IDS[version]}/search?query=${encodeURIComponent(query)}&limit=20`)
  },
}
