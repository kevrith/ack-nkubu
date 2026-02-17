import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import { bibleService } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'
import { BibleBook } from '@/types/bible'

const OLD_TESTAMENT_END = 39

export function BookNavigator() {
  const { version, setCurrentBook, setCurrentChapter } = useBibleStore()
  const [books, setBooks] = useState<BibleBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [otExpanded, setOtExpanded] = useState(true)
  const [ntExpanded, setNtExpanded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    bibleService.getBooks(version)
      .then((data) => {
        setBooks(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [version])

  const oldTestament = books.slice(0, OLD_TESTAMENT_END)
  const newTestament = books.slice(OLD_TESTAMENT_END)

  const handleBookClick = (book: BibleBook) => {
    setCurrentBook(book.id)
    setCurrentChapter(`${book.id}.1`)
  }

  if (loading) return <div className="p-4 text-gray-600">Loading books...</div>
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium mb-1">API Error</div>
            <div className="text-sm">{error}</div>
            <div className="text-sm mt-2">Please add your api.bible key to .env.local</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOtExpanded(!otExpanded)}
        className="w-full flex items-center gap-2 p-3 bg-navy-50 rounded-lg font-medium text-navy"
      >
        {otExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        Old Testament ({oldTestament.length})
      </button>
      {otExpanded && (
        <div className="grid grid-cols-2 gap-2 pl-4">
          {oldTestament.map((book) => (
            <button
              key={book.id}
              onClick={() => handleBookClick(book)}
              className="text-left p-2 hover:bg-gold-50 rounded text-sm"
            >
              {book.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setNtExpanded(!ntExpanded)}
        className="w-full flex items-center gap-2 p-3 bg-navy-50 rounded-lg font-medium text-navy"
      >
        {ntExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        New Testament ({newTestament.length})
      </button>
      {ntExpanded && (
        <div className="grid grid-cols-2 gap-2 pl-4">
          {newTestament.map((book) => (
            <button
              key={book.id}
              onClick={() => handleBookClick(book)}
              className="text-left p-2 hover:bg-gold-50 rounded text-sm"
            >
              {book.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
