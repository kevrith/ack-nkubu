import { useState } from 'react'
import { BookOpen, Search as SearchIcon, Bookmark, Calendar, GitCompare, Download } from 'lucide-react'
import { VersionSelector } from '@/components/bible/VersionSelector'
import { BookNavigator } from '@/components/bible/BookNavigator'
import { ChapterView } from '@/components/bible/ChapterView'
import { BibleSearch } from '@/components/bible/BibleSearch'
import { BibleBookmarks } from '@/components/bible/BibleBookmarks'
import { ReadingPlans } from '@/components/bible/ReadingPlans'
import { BibleComparison } from '@/components/bible/BibleComparison'
import { OfflineBibleDownloader } from '@/components/bible/OfflineBibleDownloader'
import { useBibleStore } from '@/store/bibleStore'

export function BiblePage() {
  const [view, setView] = useState<'read' | 'search' | 'bookmarks' | 'plans' | 'compare' | 'offline'>('read')
  const { currentChapter } = useBibleStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Bible Reader</h1>
        <VersionSelector />
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setView('read')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'read' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Read
        </button>
        <button
          onClick={() => setView('search')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'search' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <SearchIcon className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={() => setView('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'bookmarks' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </button>
        <button
          onClick={() => setView('plans')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'plans' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Reading Plans
        </button>
        <button
          onClick={() => setView('compare')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'compare' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Compare
        </button>
        <button
          onClick={() => setView('offline')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'offline' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Download className="w-4 h-4" />
          Offline
        </button>
      </div>

      {view === 'read' ? (
        <>
          <div className="md:grid md:grid-cols-[300px_1fr] gap-6">
            <div className="bg-white rounded-lg shadow p-4 h-fit">
              <BookNavigator />
            </div>
            <div className="hidden md:block bg-white rounded-lg shadow p-6">
              <ChapterView />
            </div>
          </div>
          {currentChapter && (
            <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
              <ChapterView />
            </div>
          )}
        </>
      ) : view === 'search' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <BibleSearch />
        </div>
      ) : view === 'bookmarks' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <BibleBookmarks />
        </div>
      ) : view === 'compare' ? (
        <BibleComparison />
      ) : view === 'offline' ? (
        <OfflineBibleDownloader />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <ReadingPlans />
        </div>
      )}
    </div>
  )
}
