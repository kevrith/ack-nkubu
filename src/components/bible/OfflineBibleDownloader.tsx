import { useState, useEffect } from 'react'
import { Download, Check, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const BIBLE_BOOKS = [
  { id: 'GEN', name: 'Genesis' }, { id: 'EXO', name: 'Exodus' }, { id: 'LEV', name: 'Leviticus' },
  { id: 'NUM', name: 'Numbers' }, { id: 'DEU', name: 'Deuteronomy' }, { id: 'JOS', name: 'Joshua' },
  { id: 'JDG', name: 'Judges' }, { id: 'RUT', name: 'Ruth' }, { id: '1SA', name: '1 Samuel' },
  { id: '2SA', name: '2 Samuel' }, { id: '1KI', name: '1 Kings' }, { id: '2KI', name: '2 Kings' },
  { id: 'PSA', name: 'Psalms' }, { id: 'PRO', name: 'Proverbs' }, { id: 'ISA', name: 'Isaiah' },
  { id: 'JER', name: 'Jeremiah' }, { id: 'MAT', name: 'Matthew' }, { id: 'MRK', name: 'Mark' },
  { id: 'LUK', name: 'Luke' }, { id: 'JHN', name: 'John' }, { id: 'ACT', name: 'Acts' },
  { id: 'ROM', name: 'Romans' }, { id: '1CO', name: '1 Corinthians' }, { id: '2CO', name: '2 Corinthians' },
  { id: 'GAL', name: 'Galatians' }, { id: 'EPH', name: 'Ephesians' }, { id: 'PHP', name: 'Philippians' },
  { id: 'REV', name: 'Revelation' }
]

export function OfflineBibleDownloader() {
  const { user } = useAuth()
  const [downloads, setDownloads] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    loadDownloads()
  }, [user])

  async function loadDownloads() {
    if (!user) return
    const { data } = await supabase
      .from('offline_bible_downloads')
      .select('book_id')
      .eq('user_id', user.id)
    setDownloads(new Set(data?.map(d => d.book_id) || []))
  }

  async function downloadBook(bookId: string, bookName: string) {
    if (!user) return
    setLoading(bookId)
    try {
      // Simulate download - in production, fetch from API
      const content = { chapters: [] }
      await supabase.from('offline_bible_downloads').upsert({
        user_id: user.id,
        book_id: bookId,
        book_name: bookName,
        version: 'NIV',
        content
      })
      setDownloads(prev => new Set([...prev, bookId]))
    } finally {
      setLoading(null)
    }
  }

  async function deleteBook(bookId: string) {
    if (!user) return
    await supabase
      .from('offline_bible_downloads')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId)
    setDownloads(prev => {
      const next = new Set(prev)
      next.delete(bookId)
      return next
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-navy mb-4">Download for Offline Reading</h3>
      <div className="grid gap-2">
        {BIBLE_BOOKS.map(book => {
          const isDownloaded = downloads.has(book.id)
          const isLoading = loading === book.id
          return (
            <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{book.name}</span>
              {isDownloaded ? (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => downloadBook(book.id, book.name)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-navy hover:text-navy-600 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isLoading ? 'Downloading...' : 'Download'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
