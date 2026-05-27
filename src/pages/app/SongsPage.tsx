import { useState, useMemo, useRef, useEffect } from 'react'
import { Music, Search, ChevronLeft, ChevronRight, X, BookOpen, Plus, Globe } from 'lucide-react'
import { TENZI_SONGS, TenziSong } from '@/data/tenzi'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hymn {
  id: string
  number: number
  title: string
  chorus: string | null
  full_text: string
  is_published: boolean
  category: string
}

type Tab = 'tenzi' | 'ack_hymnal' | 'golden_bells'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTenziSong(song: TenziSong) {
  const lines = song.fullText.split('\n')
  const chorus: string[] = []
  const verses: { num: number; lines: string[] }[] = []
  let currentVerse: { num: number; lines: string[] } | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line === song.title) continue
    const m = line.match(/^(\d+)[.\t]\s*(.*)/)
    if (m) {
      if (currentVerse) verses.push(currentVerse)
      currentVerse = { num: parseInt(m[1]), lines: m[2] ? [m[2]] : [] }
    } else if (currentVerse) {
      currentVerse.lines.push(line)
    } else {
      chorus.push(line)
    }
  }
  if (currentVerse) verses.push(currentVerse)
  return { chorus, verses }
}

function parseHymnText(text: string, title: string) {
  const lines = text.split('\n')
  const chorus: string[] = []
  const verses: { num: number; lines: string[] }[] = []
  let currentVerse: { num: number; lines: string[] } | null = null
  let inChorus = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line === title) continue
    if (/^(chorus|refrain):?$/i.test(line)) { inChorus = true; continue }
    if (/^verse\s*\d+:?$/i.test(line)) { inChorus = false; continue }
    const m = line.match(/^(\d+)[.\t)]\s*(.*)/)
    if (m) {
      inChorus = false
      if (currentVerse) verses.push(currentVerse)
      currentVerse = { num: parseInt(m[1]), lines: m[2] ? [m[2]] : [] }
    } else if (inChorus || !currentVerse) {
      if (currentVerse && !inChorus) {
        currentVerse.lines.push(line)
      } else {
        chorus.push(line)
      }
    } else {
      currentVerse.lines.push(line)
    }
  }
  if (currentVerse) verses.push(currentVerse)
  return { chorus, verses }
}

// ─── Song Detail (shared for both tabs) ───────────────────────────────────────

function SongDetail({
  number, title, chorus, verses, onBack, onPrev, onNext, hasPrev, hasNext,
}: {
  number: number | string
  title: string
  chorus: string[]
  verses: { num: number; lines: string[] }[]
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')
  const fontClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg leading-relaxed' : 'text-base'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-navy font-medium hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to songs
        </button>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['sm', 'base', 'lg'] as const).map(s => {
            const cls = s === 'sm' ? 'text-xs' : s === 'lg' ? 'text-base' : 'text-sm'
            return (
              <button key={s} onClick={() => setFontSize(s)}
                className={`px-2.5 py-0.5 rounded font-bold ${cls} ${fontSize === s ? 'bg-white shadow text-navy' : 'text-gray-500'}`}>
                A
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-navy px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-sm">{number}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
          </div>
        </div>

        <div className={`p-5 space-y-5 ${fontClass}`}>
          {chorus.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Chorus / Refrain</p>
              {chorus.map((line, i) => (
                <p key={i} className="text-gray-800 leading-relaxed italic">{line}</p>
              ))}
            </div>
          )}
          {verses.map(v => (
            <div key={v.num} className="space-y-1">
              <p className="text-xs font-bold text-navy/50 uppercase tracking-wider mb-1">{v.num}.</p>
              {v.lines.map((line, i) => (
                <p key={i} className="text-gray-800 leading-relaxed">{line}</p>
              ))}
            </div>
          ))}
          {chorus.length === 0 && verses.length === 0 && (
            <p className="text-gray-400 italic text-center py-4">No lyrics available</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} disabled={!hasPrev}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={onNext} disabled={!hasNext}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Tenzi za Rohoni Tab ───────────────────────────────────────────────────────

function TenziTab() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TenziSong | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return TENZI_SONGS
    return TENZI_SONGS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      String(s.number).includes(q) ||
      s.fullText.toLowerCase().includes(q)
    )
  }, [search])

  useEffect(() => {
    if (!selected) setTimeout(() => searchRef.current?.focus(), 100)
  }, [selected])

  const idx = selected ? filtered.findIndex(s => s.number === selected.number) : -1

  function select(song: TenziSong) {
    setSelected(song)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selected) {
    const { chorus, verses } = parseTenziSong(selected)
    return (
      <SongDetail
        number={selected.number} title={selected.title}
        chorus={chorus} verses={verses}
        onBack={() => setSelected(null)}
        onPrev={() => idx > 0 && select(filtered[idx - 1])}
        onNext={() => idx < filtered.length - 1 && select(filtered[idx + 1])}
        hasPrev={idx > 0} hasNext={idx < filtered.length - 1}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input ref={searchRef} type="text"
          placeholder="Search by title, number, or lyrics…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {search && <p className="text-xs text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</p>}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No songs found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(song => {
            const preview = song.fullText.split('\n').map(l => l.trim())
              .filter(l => l && l !== song.title && !l.match(/^\d+[.\t]/)).slice(0, 1).join(' ')
            return (
              <button key={song.number} onClick={() => select(song)}
                className="w-full text-left bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-navy/20 transition-all flex items-center gap-3">
                <div className="w-10 h-10 bg-navy/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navy font-bold text-sm">{song.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{song.title}</p>
                  {preview && <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Hymns Tab (shared for ACK Hymnal + Golden Bells) ────────────────────────

function HymnsTab({ category, label }: { category: 'ack_hymnal' | 'golden_bells'; label: string }) {
  const { user } = useAuth()
  const [hymns, setHymns] = useState<Hymn[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Hymn | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const isAdmin = ['clergy', 'admin'].includes(user?.profile?.role ?? '')

  useEffect(() => {
    setHymns([])
    setLoading(true)
    setSelected(null)
    setSearch('')
    fetchHymns()
  }, [category])

  useEffect(() => {
    if (!selected) setTimeout(() => searchRef.current?.focus(), 100)
  }, [selected])

  async function fetchHymns() {
    const { data } = await supabase
      .from('hymns')
      .select('*')
      .eq('is_published', true)
      .eq('category', category)
      .order('number')
    setHymns(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return hymns
    return hymns.filter(h =>
      h.title.toLowerCase().includes(q) ||
      String(h.number).includes(q) ||
      h.full_text.toLowerCase().includes(q)
    )
  }, [hymns, search])

  const idx = selected ? filtered.findIndex(h => h.id === selected.id) : -1

  function select(hymn: Hymn) {
    setSelected(hymn)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selected) {
    const { chorus, verses } = parseHymnText(selected.full_text, selected.title)
    return (
      <SongDetail
        number={selected.number} title={selected.title}
        chorus={chorus} verses={verses}
        onBack={() => setSelected(null)}
        onPrev={() => idx > 0 && select(filtered[idx - 1])}
        onNext={() => idx < filtered.length - 1 && select(filtered[idx + 1])}
        hasPrev={idx > 0} hasNext={idx < filtered.length - 1}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-7 h-7 border-3 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (hymns.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto">
          <Globe className="w-8 h-8 text-navy/30" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">No {label} hymns yet</p>
          <p className="text-sm text-gray-400 mt-1">Hymns will appear here once added by an administrator.</p>
        </div>
        {isAdmin && (
          <a href="/admin/hymns"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Hymns
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input ref={searchRef} type="text"
          placeholder="Search hymns by title, number, or lyrics…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {search && <p className="text-xs text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</p>}

      {isAdmin && (
        <a href="/admin/hymns"
          className="flex items-center gap-2 text-xs text-navy font-medium hover:underline">
          <Plus className="w-3.5 h-3.5" /> Manage hymns
        </a>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hymns found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(hymn => {
            const preview = hymn.full_text.split('\n').map(l => l.trim())
              .filter(l => l && l !== hymn.title).slice(0, 1).join(' ')
            return (
              <button key={hymn.id} onClick={() => select(hymn)}
                className="w-full text-left bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-navy/20 transition-all flex items-center gap-3">
                <div className="w-10 h-10 bg-navy/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navy font-bold text-sm">{hymn.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{hymn.title}</p>
                  {preview && <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Songs Page ──────────────────────────────────────────────────────────

export function SongsPage() {
  const [tab, setTab] = useState<Tab>('tenzi')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
          <Music className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Songs</h1>
          <p className="text-xs text-gray-500">Anglican Church of Kenya</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5 gap-1">
        <button
          onClick={() => setTab('tenzi')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'tenzi' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tenzi za Rohoni
          <span className={`ml-1 text-xs px-1 py-0.5 rounded-full ${tab === 'tenzi' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-500'}`}>
            {TENZI_SONGS.length}
          </span>
        </button>
        <button
          onClick={() => setTab('ack_hymnal')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'ack_hymnal' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ACK Hymnal
        </button>
        <button
          onClick={() => setTab('golden_bells')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'golden_bells' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Golden Bells
        </button>
      </div>

      {tab === 'tenzi' && <TenziTab />}
      {tab === 'ack_hymnal' && <HymnsTab category="ack_hymnal" label="ACK Hymnal" />}
      {tab === 'golden_bells' && <HymnsTab category="golden_bells" label="Golden Bells" />}
    </div>
  )
}
