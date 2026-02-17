import { BibleVersion, BibleBook, BibleChapter } from '@/types/bible'
import { supabase } from '@/lib/supabase'

const API_KEY = import.meta.env.VITE_API_BIBLE_KEY
const BASE_URL = 'https://rest.api.bible/v1'

const VERSION_IDS: Record<BibleVersion, string> = {
  NIV: 'de4e12af7f28f599-01',
  NLT: '65eec8e0b60e656b-01',
  KJV: 'de4e12af7f28f599-02',
  NRSV: 'bba9f40183526463-01',
  NKJV: '9879dbb7cfe39e4d-04',
}

export const AVAILABLE_VERSIONS: BibleVersion[] = ['NIV', 'NLT', 'KJV', 'NRSV', 'NKJV']

async function bibleRequest<T>(endpoint: string): Promise<T> {
  if (!API_KEY || API_KEY === 'your-api-bible-key') {
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
    return bibleRequest(`/bibles/${VERSION_IDS[version]}/books`)
  },

  getChapter: async (version: BibleVersion, chapterId: string): Promise<BibleChapter> => {
    // Try cache first
    const { data: cached } = await supabase
      .from('bible_cache')
      .select('*')
      .eq('version', version)
      .eq('chapter_id', chapterId)
      .single();

    if (cached) {
      return { content: cached.content, reference: cached.reference };
    }

    // Fetch from API
    const chapter = await bibleRequest<BibleChapter>(
      `/bibles/${VERSION_IDS[version]}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true`
    );

    // Cache it
    await supabase.from('bible_cache').insert({
      version,
      chapter_id: chapterId,
      content: chapter.content,
      reference: chapter.reference
    }).catch(() => {}); // Ignore cache errors

    return chapter;
  },

  search: async (version: BibleVersion, query: string) => {
    return bibleRequest(`/bibles/${VERSION_IDS[version]}/search?query=${encodeURIComponent(query)}&limit=20`)
  },
}
