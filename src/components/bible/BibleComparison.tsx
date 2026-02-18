import { useState, useEffect } from 'react'
import { GitCompare, ChevronDown, Loader2, BookOpen } from 'lucide-react'
import { bibleService, AVAILABLE_VERSIONS } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'
import { BibleVersion, BibleChapter } from '@/types/bible'

const VERSION_NAMES: Record<BibleVersion, string> = {
  NIV:  'New International Version',
  NLT:  'New Living Translation',
  KJV:  'King James Version',
}

export function BibleComparison() {
  const { currentChapter } = useBibleStore()
  const [versionA, setVersionA] = useState<BibleVersion>('NIV')
  const [versionB, setVersionB] = useState<BibleVersion>('KJV')
  const [chapterA, setChapterA] = useState<BibleChapter | null>(null)
  const [chapterB, setChapterB] = useState<BibleChapter | null>(null)
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chapterId, setChapterId] = useState(currentChapter || 'JHN.3')
  const [inputChapterId, setInputChapterId] = useState(currentChapter || 'JHN.3')

  useEffect(() => {
    if (chapterId) {
      loadBoth()
    }
  }, [chapterId, versionA, versionB])

  async function loadBoth() {
    setError(null)
    setLoadingA(true)
    setLoadingB(true)
    try {
      const [a, b] = await Promise.all([
        bibleService.getChapter(versionA, chapterId),
        bibleService.getChapter(versionB, chapterId),
      ])
      setChapterA(a)
      setChapterB(b)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load chapters. Check your API key.')
    } finally {
      setLoadingA(false)
      setLoadingB(false)
    }
  }

  const fontClass = 'text-base leading-relaxed font-lora'

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Chapter ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputChapterId}
              onChange={(e) => setInputChapterId(e.target.value)}
              placeholder="e.g. JHN.3 or PSA.23"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <button
              onClick={() => setChapterId(inputChapterId.trim())}
              className="px-4 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy-600"
            >
              Go
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Format: BOOK.CHAPTER (e.g. GEN.1, ROM.8, PSA.119)</p>
        </div>

        <VersionPicker label="Left Version" value={versionA} onChange={setVersionA} exclude={versionB} />
        <VersionPicker label="Right Version" value={versionB} onChange={setVersionB} exclude={versionA} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {!chapterId ? (
        <div className="text-center py-16 text-gray-400">
          <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Enter a chapter ID above to compare versions side by side.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Version A */}
          <ChapterPane
            version={versionA}
            versionName={VERSION_NAMES[versionA]}
            chapter={chapterA}
            loading={loadingA}
            fontClass={fontClass}
          />
          {/* Version B */}
          <ChapterPane
            version={versionB}
            versionName={VERSION_NAMES[versionB]}
            chapter={chapterB}
            loading={loadingB}
            fontClass={fontClass}
          />
        </div>
      )}
    </div>
  )
}

function VersionPicker({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string
  value: BibleVersion
  onChange: (v: BibleVersion) => void
  exclude: BibleVersion
}) {
  return (
    <div className="min-w-[160px]">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as BibleVersion)}
          className="w-full appearance-none border rounded-lg px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/30"
        >
          {AVAILABLE_VERSIONS.filter((v) => v !== exclude).map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

function ChapterPane({
  version,
  versionName,
  chapter,
  loading,
  fontClass,
}: {
  version: BibleVersion
  versionName: string
  chapter: BibleChapter | null
  loading: boolean
  fontClass: string
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="bg-navy text-white px-4 py-2.5 flex items-center justify-between">
        <span className="font-semibold">{version}</span>
        <span className="text-xs text-navy-200 hidden sm:block">{versionName}</span>
      </div>
      <div className="p-5 flex-1 overflow-y-auto max-h-[65vh]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading…
          </div>
        ) : chapter ? (
          <>
            <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-3 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {chapter.reference}
            </p>
            <div
              className={fontClass}
              dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
            />
          </>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            No content loaded yet.
          </div>
        )}
      </div>
    </div>
  )
}
