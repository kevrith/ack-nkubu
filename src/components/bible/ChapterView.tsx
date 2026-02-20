import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Type, List, Share2, X } from 'lucide-react'
import { bibleService } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'
import { BibleChapter } from '@/types/bible'
import { shareViaWhatsApp } from '@/lib/whatsapp'

const BOOK_CHAPTER_COUNTS: Record<string, number> = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOS: 24, JDG: 21, RUT: 4,
  '1SA': 31, '2SA': 24, '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36,
  EZR: 10, NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31, ECC: 12, SNG: 8,
  ISA: 66, JER: 52, LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9,
  OBA: 1, JON: 4, MIC: 7, NAM: 3, HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4,
  MAT: 28, MRK: 16, LUK: 24, JHN: 21, ACT: 28, ROM: 16, '1CO': 16, '2CO': 13,
  GAL: 6, EPH: 6, PHP: 4, COL: 4, '1TH': 5, '2TH': 3, '1TI': 6, '2TI': 4,
  TIT: 3, PHM: 1, HEB: 13, JAS: 5, '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1,
  '3JN': 1, JUD: 1, REV: 22,
}

const fontSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

/**
 * Parse a chapter ID like "GEN.1" into { bookId: "GEN", chapterNum: 1 }
 */
function parseChapterId(chapterId: string): { bookId: string; chapterNum: number } | null {
  const lastDot = chapterId.lastIndexOf('.')
  if (lastDot === -1) return null
  const bookId = chapterId.substring(0, lastDot)
  const chapterNum = parseInt(chapterId.substring(lastDot + 1), 10)
  if (isNaN(chapterNum)) return null
  return { bookId, chapterNum }
}

export function ChapterView() {
  const { version, currentChapter, fontSize, setFontSize, setCurrentChapter } = useBibleStore()
  const [chapter, setChapter] = useState<BibleChapter | null>(null)
  const [loading, setLoading] = useState(false)
  const [showChapterSelector, setShowChapterSelector] = useState(false)
  const parsed = parseChapterId(currentChapter ?? '')
  const totalChapters = parsed ? (BOOK_CHAPTER_COUNTS[parsed.bookId] ?? 1) : 1

  useEffect(() => {
    if (!currentChapter) return
    setLoading(true)
    bibleService.getChapter(version, currentChapter).then((data) => {
      setChapter(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [version, currentChapter])

  const navigateChapter = useCallback((direction: 'prev' | 'next') => {
    if (!currentChapter) return
    const parsed = parseChapterId(currentChapter)
    if (!parsed) return

    const newChapterNum = direction === 'next' ? parsed.chapterNum + 1 : parsed.chapterNum - 1
    if (newChapterNum < 1) return

    const newChapterId = `${parsed.bookId}.${newChapterNum}`
    setCurrentChapter(newChapterId)
  }, [currentChapter, setCurrentChapter])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') navigateChapter('prev')
      if (e.key === 'ArrowRight') navigateChapter('next')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateChapter])

  if (!currentChapter) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Select a book to start reading
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    )
  }

  const isFirstChapter = parsed ? parsed.chapterNum <= 1 : true

  const handleChapterSelect = (chapterNum: number) => {
    if (!parsed) return
    setCurrentChapter(`${parsed.bookId}.${chapterNum}`)
    setShowChapterSelector(false)
  }

  return (
    <div className="space-y-4 p-4 md:p-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentChapter('')}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-playfair text-navy">{chapter?.reference}</h2>
          <button
            onClick={() => setShowChapterSelector(!showChapterSelector)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Select chapter"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => shareViaWhatsApp(`Reading ${chapter?.reference} 📖`, window.location.href)}
            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize('sm')}
            className={`p-2 rounded ${fontSize === 'sm' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            <Type className="w-3 h-3" />
          </button>
          <button
            onClick={() => setFontSize('md')}
            className={`p-2 rounded ${fontSize === 'md' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFontSize('lg')}
            className={`p-2 rounded ${fontSize === 'lg' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFontSize('xl')}
            className={`p-2 rounded ${fontSize === 'xl' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            <Type className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showChapterSelector && parsed && (
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-navy">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-navy">Select Chapter</h3>
            <button
              onClick={() => setShowChapterSelector(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handleChapterSelect(num)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  num === parsed.chapterNum
                    ? 'bg-navy text-white'
                    : 'bg-white hover:bg-gold-50 border border-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`font-lora leading-relaxed ${fontSizes[fontSize]} prose max-w-none`}
        dangerouslySetInnerHTML={{ __html: chapter?.content || '' }}
      />

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={() => navigateChapter('prev')}
          disabled={isFirstChapter}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => navigateChapter('next')}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
