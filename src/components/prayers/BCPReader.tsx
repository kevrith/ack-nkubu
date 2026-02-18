import { useState, useEffect } from 'react'
import { Book, ChevronLeft, ChevronRight, Search, BookOpen, Music, Church, Heart, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ContentPart {
  role: 'leader' | 'people' | 'all' | 'rubric' | 'text'
  text: string
}

interface BCPSection {
  id: string
  slug: string
  title: string
  season: string | null
  section_type: string
  liturgical_color: string | null
  week_number: number | null
  order_index: number
  content: ContentPart[]
}

const SECTION_TYPES = [
  { key: 'all',               label: 'All',           icon: BookOpen },
  { key: 'service|office',    label: 'Services',      icon: Church },
  { key: 'collect',           label: 'Collects',      icon: Heart },
  { key: 'canticle',          label: 'Canticles',     icon: Music },
  { key: 'litany',            label: 'Prayers',       icon: Book },
]

const SEASONS = [
  { key: 'all',       label: 'All Seasons' },
  { key: 'advent',    label: 'Advent',    color: 'bg-purple-600' },
  { key: 'christmas', label: 'Christmas', color: 'bg-yellow-400' },
  { key: 'epiphany',  label: 'Epiphany',  color: 'bg-yellow-300' },
  { key: 'lent',      label: 'Lent',      color: 'bg-purple-800' },
  { key: 'easter',    label: 'Easter',    color: 'bg-white border border-gray-300' },
  { key: 'ordinary',  label: 'Ordinary Time', color: 'bg-green-600' },
  { key: 'saints',    label: 'Saints\' Days', color: 'bg-red-600' },
]

const ROLE_STYLES: Record<string, string> = {
  leader:  'text-navy font-semibold',
  people:  'text-gray-700 font-medium',
  all:     'text-gray-800',
  rubric:  'text-red-700 italic text-sm',
  text:    'text-gray-800',
}

const ROLE_LABELS: Record<string, string | null> = {
  leader: 'Leader',
  people: 'People',
  all:    'All',
  rubric: null,
  text:   null,
}

const LITURGICAL_COLORS: Record<string, string> = {
  purple: 'border-l-4 border-purple-600 bg-purple-50',
  white:  'border-l-4 border-yellow-300 bg-yellow-50',
  red:    'border-l-4 border-red-600 bg-red-50',
  green:  'border-l-4 border-green-600 bg-green-50',
  rose:   'border-l-4 border-pink-400 bg-pink-50',
}

export function BCPReader() {
  const [sections, setSections] = useState<BCPSection[]>([])
  const [filtered, setFiltered] = useState<BCPSection[]>([])
  const [selected, setSelected] = useState<BCPSection | null>(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [seasonFilter, setSeasonFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')

  useEffect(() => {
    fetchSections()
  }, [])

  useEffect(() => {
    let result = sections

    if (typeFilter !== 'all') {
      const types = typeFilter.split('|')
      result = result.filter(s => types.includes(s.section_type))
    }
    if (seasonFilter !== 'all') {
      result = result.filter(s => s.season === seasonFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.content.some(p => p.text.toLowerCase().includes(q))
      )
    }

    setFiltered(result)
  }, [sections, typeFilter, seasonFilter, search])

  async function fetchSections() {
    const { data } = await supabase
      .from('bcp_sections')
      .select('*')
      .eq('is_active', true)
      .order('order_index')

    setSections(data || [])
    setLoading(false)
  }

  const currentIndex = selected ? filtered.findIndex(s => s.id === selected.id) : -1

  function goPrev() {
    if (currentIndex > 0) setSelected(filtered[currentIndex - 1])
  }

  function goNext() {
    if (currentIndex < filtered.length - 1) setSelected(filtered[currentIndex + 1])
  }

  const colorClass = selected?.liturgical_color
    ? LITURGICAL_COLORS[selected.liturgical_color] ?? ''
    : ''

  const fontSizeClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg leading-relaxed' : 'text-base'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center text-gray-500">
          <Book className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Loading Book of Common Prayer…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-navy text-white rounded-xl p-5">
        <div className="flex items-center gap-3 mb-1">
          <Book className="w-6 h-6 text-gold" />
          <h2 className="text-lg font-bold text-gold">ACK Book of Common Prayer</h2>
        </div>
        <p className="text-sm text-navy-200">Kitabu Kipya Cha Ibada</p>
        <p className="text-xs text-navy-300 mt-1">{sections.length} liturgical sections</p>
      </div>

      {/* Section type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
        {SECTION_TYPES.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => { setTypeFilter(t.key); setSelected(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                typeFilter === t.key
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Season filter (only shown for collects) */}
      {typeFilter === 'collect' && (
        <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
          {SEASONS.map(s => (
            <button
              key={s.key}
              onClick={() => { setSeasonFilter(s.key); setSelected(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                seasonFilter === s.key
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.key !== 'all' && (
                <span className={`w-2 h-2 rounded-full inline-block ${s.color}`} />
              )}
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search prayers, canticles, collects…"
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null) }}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {selected ? (
        /* ─── DETAIL VIEW ─── */
        <div className="space-y-4">
          {/* Navigation bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-navy hover:underline"
            >
              <ChevronLeft className="w-4 h-4" /> Back to list
            </button>
            <div className="flex items-center gap-2">
              {/* Font size controls */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['sm', 'base', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      fontSize === size ? 'bg-white shadow text-navy' : 'text-gray-500'
                    }`}
                  >
                    {size === 'sm' ? 'A' : size === 'base' ? 'A' : 'A'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content card */}
          <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${colorClass}`}>
            <div className="p-5">
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-navy">{selected.title}</h3>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-1 ${
                    selected.slug.endsWith('-sw') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selected.slug.endsWith('-sw') ? 'Swahili' : 'English'}
                  </span>
                </div>
                {selected.season && (
                  <p className="text-xs text-gray-500 capitalize mt-0.5">{selected.season} season</p>
                )}
              </div>

              <div className={`space-y-4 ${fontSizeClass}`}>
                {selected.content.map((part, idx) => {
                  const label = ROLE_LABELS[part.role]
                  return (
                    <div key={idx} className="space-y-0.5">
                      {label && (
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                          {label}
                        </div>
                      )}
                      <p
                        className={`${ROLE_STYLES[part.role]} whitespace-pre-line leading-relaxed`}
                      >
                        {part.text}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Prev/Next navigation */}
          <div className="flex gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === filtered.length - 1}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ─── LIST VIEW ─── */
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Book className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No sections found.</p>
            </div>
          ) : (
            filtered.map(section => {
              const colorDot = section.liturgical_color
                ? { purple: 'bg-purple-600', white: 'bg-yellow-400', red: 'bg-red-600', green: 'bg-green-600', rose: 'bg-pink-400' }[section.liturgical_color]
                : null
              const isSwahili = section.slug.endsWith('-sw')
              const typeLabel: Record<string, string> = {
                service: 'Service', office: 'Daily Office', collect: 'Collect',
                canticle: 'Canticle', litany: 'Prayer',
              }

              return (
                <button
                  key={section.id}
                  onClick={() => setSelected(section)}
                  className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-navy/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {colorDot && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorDot}`} />
                        )}
                        <span className="font-semibold text-navy text-sm truncate">
                          {section.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {typeLabel[section.section_type] ?? section.section_type}
                        </span>
                        {section.season && (
                          <span className="text-xs text-gray-400 capitalize">
                            {section.season}
                          </span>
                        )}
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isSwahili ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {isSwahili ? 'SW' : 'EN'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
