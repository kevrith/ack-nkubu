import { useState, useEffect } from 'react'
import { SEO } from '@/components/seo/SEO'
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
import { useAuth } from '@/hooks/useAuth'
import { AVAILABLE_VERSIONS } from '@/services/bible.service'
import { BibleVersion } from '@/types/bible'

export function BiblePage() {
  const [view, setView] = useState<'read' | 'search' | 'bookmarks' | 'plans' | 'compare' | 'offline'>('read')
  const { currentChapter, setVersion } = useBibleStore()
  const { user } = useAuth()

  // Seed version from profile preference the first time this user opens the Bible
  // (only if they haven't manually chosen a version yet — localStorage key absent)
  useEffect(() => {
    const preferred = user?.profile?.preferred_bible_version as BibleVersion | undefined
    if (!preferred) return
    // A stored preference of NIV/NLT is unusable without an api.bible key, so
    // only apply it when that version is actually on offer.
    if (!AVAILABLE_VERSIONS.includes(preferred)) return
    const stored = localStorage.getItem('ack-bible-prefs')
    if (!stored) {
      setVersion(preferred)
    }
  }, [user?.id])

  return (
    <div className="space-y-4">
      <SEO
        title="Bible"
        description="Read the Bible online with ACK St Francis Nkubu — multiple versions, bookmarks and daily reading, from the Anglican Church of Kenya parish in Nkubu, Meru County."
        canonicalPath="/bible"
      />
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-3xl font-playfair text-navy">Bible Reader</h1>
        <VersionSelector />
      </div>

      {/* Tab bar – scrollable on mobile, labels hidden on xs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto pb-px scrollbar-none">
        {([
          { id: 'read',      icon: <BookOpen className="w-4 h-4 flex-shrink-0" />,    label: 'Read' },
          { id: 'search',    icon: <SearchIcon className="w-4 h-4 flex-shrink-0" />,  label: 'Search' },
          { id: 'bookmarks', icon: <Bookmark className="w-4 h-4 flex-shrink-0" />,    label: 'Bookmarks' },
          { id: 'plans',     icon: <Calendar className="w-4 h-4 flex-shrink-0" />,    label: 'Plans' },
          { id: 'compare',   icon: <GitCompare className="w-4 h-4 flex-shrink-0" />,  label: 'Compare' },
          { id: 'offline',   icon: <Download className="w-4 h-4 flex-shrink-0" />,    label: 'Offline' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors text-sm font-medium ${
              view === tab.id ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
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
