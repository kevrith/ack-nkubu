export type BibleVersion = 'NIV' | 'NLT' | 'KJV' | 'NRSV' | 'NKJV'

export interface BibleBook {
  id: string
  name: string
  nameLong: string
  abbreviation: string
}

export interface BibleChapter {
  id: string
  number: string
  content: string
  reference: string
}

export interface BibleVerse {
  id: string
  reference: string
  text: string
}

export interface Bookmark {
  id: string
  user_id: string
  version: BibleVersion
  book_id: string
  chapter: number
  verse?: number
  note?: string
  created_at: string
}
