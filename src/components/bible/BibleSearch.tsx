import { useState } from 'react'
import { Search } from 'lucide-react'
import { bibleService } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'

export function BibleSearch() {
  const { version } = useBibleStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const data = await bibleService.search(version, query)
      setResults(data.verses || [])
    } catch (error) {
      console.error('Search error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Bible..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {loading && <div className="text-center py-4">Searching...</div>}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="font-medium text-navy mb-1">{result.reference}</div>
              <div className="text-gray-700">{result.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
