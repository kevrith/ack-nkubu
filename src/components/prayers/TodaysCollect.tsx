import { useState, useEffect } from 'react'
import { Star, Book, ChevronRight } from 'lucide-react'
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
  content: ContentPart[]
}

// ─── Easter date calculator (Anonymous Gregorian) ────────────────────
function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// ─── Map today → BCP slug ────────────────────────────────────────────
function getTodaySlug(today: Date): string {
  const year = today.getFullYear()
  const easter = getEasterDate(year)

  // Key dates
  const christmas = new Date(year, 11, 25)
  const christmasDow = christmas.getDay()
  const advent1 = addDays(christmas, -(christmasDow === 0 ? 28 : christmasDow + 21))
  const epiphany = new Date(year, 0, 6)
  const ashWed = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const goodFriday = addDays(easter, -2)
  const ascension = addDays(easter, 39)
  const pentecost = addDays(easter, 49)
  const trinitySunday = addDays(easter, 56)

  // Advent
  for (let w = 4; w >= 1; w--) {
    const sundayStart = addDays(advent1, (w - 1) * 7)
    const sundayEnd = addDays(sundayStart, 6)
    if (today >= sundayStart && today <= sundayEnd) {
      const labels = ['advent-sunday', 'collect-advent2', 'collect-advent3', 'collect-advent4']
      return labels[w - 1]
    }
  }

  // Christmas Day
  if (today.getMonth() === 11 && today.getDate() === 25) return 'collect-christmas-day'
  // Christmas to Epiphany
  if (today > christmas || (today.getMonth() === 0 && today < epiphany)) {
    const weekInChristmas = Math.floor((today.getTime() - christmas.getTime()) / (7 * 86400000))
    return weekInChristmas <= 0 ? 'collect-christmas-day' : 'collect-christmas1'
  }

  // Epiphany
  if (today.getMonth() === 0 && today.getDate() === 6) return 'collect-epiphany'

  // Ash Wednesday
  if (today.getTime() === ashWed.getTime()) return 'collect-ash-wednesday'

  // Good Friday
  const gfTime = goodFriday.setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === gfTime) return 'collect-good-friday'

  // Palm Sunday
  const psTime = new Date(palmSunday).setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === psTime) return 'collect-palm-sunday'

  // Easter Day
  const easterTime = new Date(easter).setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === easterTime) return 'collect-easter-day'

  // Easter weeks
  if (today > easter && today < pentecost) {
    const weekNum = Math.ceil((today.getTime() - easter.getTime()) / (7 * 86400000))
    const easterSlugs = ['collect-easter1', 'collect-easter2', 'collect-easter3', 'collect-easter4', 'collect-easter5', 'collect-easter5', 'collect-easter5']
    return easterSlugs[Math.min(weekNum - 1, easterSlugs.length - 1)]
  }

  // Ascension
  const ascTime = new Date(ascension).setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === ascTime) return 'collect-ascension'

  // Pentecost
  const pentTime = new Date(pentecost).setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === pentTime) return 'collect-pentecost'

  // Trinity Sunday
  const trinityTime = new Date(trinitySunday).setHours(0, 0, 0, 0)
  if (today.setHours(0, 0, 0, 0) === trinityTime) return 'collect-trinity-sunday'

  // Ordinary Time – count Sundays after Trinity
  if (today > trinitySunday) {
    const weekNum = Math.ceil((today.getTime() - trinitySunday.getTime()) / (7 * 86400000))
    const clamped = Math.min(weekNum, 20)
    return `collect-trinity${clamped}`
  }

  // Lent weeks
  if (today >= ashWed && today < palmSunday) {
    const weekNum = Math.ceil((today.getTime() - ashWed.getTime()) / (7 * 86400000))
    const lentSlugs = ['collect-ash-wednesday', 'collect-lent1', 'collect-lent2', 'collect-lent3', 'collect-lent4', 'collect-lent5', 'collect-palm-sunday']
    return lentSlugs[Math.min(weekNum, lentSlugs.length - 1)]
  }

  // Post-Epiphany / ordinary time before Lent
  if (today >= epiphany && today < ashWed) {
    return 'collect-epiphany'
  }

  return 'collect-trinity-sunday' // fallback
}

const LITURGICAL_COLORS: Record<string, { header: string; dot: string }> = {
  purple: { header: 'from-purple-900 to-purple-700', dot: 'bg-purple-400' },
  white:  { header: 'from-amber-700 to-amber-500',   dot: 'bg-yellow-300' },
  red:    { header: 'from-red-900 to-red-700',        dot: 'bg-red-400' },
  green:  { header: 'from-green-900 to-green-700',    dot: 'bg-green-400' },
  rose:   { header: 'from-pink-900 to-pink-700',      dot: 'bg-pink-400' },
}
const DEFAULT_HEADER = 'from-navy to-navy-700'

const ROLE_STYLES: Record<string, string> = {
  leader:  'text-navy font-semibold',
  people:  'text-gray-700 font-medium',
  all:     'text-gray-800',
  rubric:  'text-red-700 italic text-sm',
  text:    'text-gray-800 leading-loose',
}

export function TodaysCollect() {
  const [collect, setCollect] = useState<BCPSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    loadCollect()
  }, [])

  async function loadCollect() {
    const today = new Date()
    const slug = getTodaySlug(today)

    const { data } = await supabase
      .from('bcp_sections')
      .select('*')
      .eq('slug', slug)
      .single()

    setCollect(data)
    setLoading(false)
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const colorConfig = collect?.liturgical_color
    ? LITURGICAL_COLORS[collect.liturgical_color] ?? { header: DEFAULT_HEADER, dot: 'bg-gold' }
    : { header: DEFAULT_HEADER, dot: 'bg-gold' }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="bg-gray-100 rounded-xl h-40" />
      </div>
    )
  }

  if (!collect) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No collect found for today.</p>
        <p className="text-sm mt-1">Check the full BCP for today's prayers.</p>
      </div>
    )
  }

  // Find the main collect text (first 'text' or 'all' part)
  const mainPart = collect.content.find(p => p.role === 'text' || p.role === 'all')
  const previewText = mainPart?.text ?? ''
  const previewLines = previewText.split('\n').slice(0, 3).join('\n')

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <div className={`bg-gradient-to-br ${colorConfig.header} text-white rounded-2xl overflow-hidden shadow-lg`}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2.5 h-2.5 rounded-full ${colorConfig.dot}`} />
            <span className="text-xs font-medium opacity-80 uppercase tracking-wider">
              Today's Collect
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">{collect.title}</h2>
          <p className="text-xs opacity-70">{dateStr}</p>
        </div>
        <div className="bg-black/20 px-5 py-3">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-gold" />
            <span className="text-xs text-gold">ACK Book of Common Prayer</span>
          </div>
        </div>
      </div>

      {/* Collect text card */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className={`transition-all overflow-hidden ${showFull ? '' : 'max-h-40'}`}>
          {collect.content.map((part, idx) => {
            if (part.role === 'rubric' && !showFull) return null
            return (
              <div key={idx} className="mb-3">
                {(part.role === 'leader' || part.role === 'people') && (
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    {part.role === 'leader' ? 'Leader' : 'People'}
                  </div>
                )}
                <p className={`${ROLE_STYLES[part.role]} whitespace-pre-line`}>
                  {part.text}
                </p>
              </div>
            )
          })}
        </div>

        {!showFull && previewText.split('\n').length > 3 && (
          <div className="mt-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowFull(true)}
              className="flex items-center gap-1 text-navy text-sm font-medium hover:underline"
            >
              Read full collect <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {showFull && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowFull(false)}
              className="text-gray-400 text-sm hover:underline"
            >
              Collapse
            </button>
          </div>
        )}
      </div>

      {/* Encouragement */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-700 font-medium mb-1">A Note on Collects</p>
        <p className="text-sm text-amber-800">
          Collects are short, structured prayers that "collect" the intentions of the congregation.
          They follow the liturgical season and help us pray as one body across time and place.
        </p>
      </div>
    </div>
  )
}
