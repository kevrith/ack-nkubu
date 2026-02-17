import { create } from 'zustand'
import { BibleVersion } from '@/types/bible'

interface BibleState {
  version: BibleVersion
  currentBook: string | null
  currentChapter: string | null
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  setVersion: (version: BibleVersion) => void
  setCurrentBook: (bookId: string) => void
  setCurrentChapter: (chapterId: string) => void
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void
}

export const useBibleStore = create<BibleState>((set) => ({
  version: 'KJV',
  currentBook: null,
  currentChapter: null,
  fontSize: 'md',
  setVersion: (version) => set({ version }),
  setCurrentBook: (bookId) => set({ currentBook: bookId }),
  setCurrentChapter: (chapterId) => set({ currentChapter: chapterId }),
  setFontSize: (fontSize) => set({ fontSize }),
}))
