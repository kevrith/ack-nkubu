import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Type, List } from 'lucide-react'
import { bibleService } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'
import { BibleChapter } from '@/types/bible'

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
  const [totalChapters] = useState(150)

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

  const parsed = parseChapterId(currentChapter)
  const isFirstChapter = parsed ? parsed.chapterNum <= 1 : true

  const handleChapterSelect = (chapterNum: number) => {
    if (!parsed) return
    setCurrentChapter(`${parsed.bookId}.${chapterNum}`)
    setShowChapterSelector(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-playfair text-navy">{chapter?.reference}</h2>
          <button
            onClick={() => setShowChapterSelector(!showChapterSelector)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Select chapter"
          >
            <List className="w-4 h-4" />
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
