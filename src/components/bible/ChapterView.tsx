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
    <div className="space-y-4 p-3 sm:p-4 md:p-0">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: close + title + chapter picker + share */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setCurrentChapter('')}
            className="md:hidden flex-shrink-0 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg sm:text-2xl font-playfair text-navy truncate">{chapter?.reference}</h2>
          <button
            onClick={() => setShowChapterSelector(!showChapterSelector)}
            className="flex-shrink-0 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Select chapter"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => shareViaWhatsApp(`Reading ${chapter?.reference} 📖`, window.location.href)}
            className="flex-shrink-0 p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: font-size selector */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Size</span>
          {(['sm', 'md', 'lg', 'xl'] as const).map((size, i) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`p-1.5 rounded min-w-[32px] flex items-center justify-center ${fontSize === size ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={size.toUpperCase()}
            >
              <Type className={['w-3 h-3', 'w-4 h-4', 'w-5 h-5', 'w-6 h-6'][i]} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Chapter selector grid ── */}
      {showChapterSelector && parsed && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-navy">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-navy text-sm sm:text-base">Select Chapter</h3>
            <button
              onClick={() => setShowChapterSelector(false)}
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-7 xs:grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-52 overflow-y-auto">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handleChapterSelect(num)}
                className={`py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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

      {/* ── Bible text – extra bottom padding on mobile so content clears the fixed nav bar ── */}
      <div
        className={`bible-content font-lora leading-relaxed ${fontSizes[fontSize]} pb-36 md:pb-4`}
        dangerouslySetInnerHTML={{ __html: chapter?.content || '' }}
      />

      {/* ── Navigation ── sits above the app bottom-nav (h-16) on mobile, inline on desktop ── */}
      <div className="fixed bottom-16 left-0 right-0 md:static bg-white flex justify-between gap-3 px-4 py-3 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.10)] md:shadow-none md:px-0 md:pt-4 md:pb-0 z-[60]">
        <button
          onClick={() => navigateChapter('prev')}
          disabled={isFirstChapter}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => navigateChapter('next')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 text-sm font-medium"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
