import { useMemo } from 'react'

interface LiturgicalSeason {
  name: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  description: string
}

function getEasterDate(year: number): Date {
  // Anonymous Gregorian algorithm
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
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000
  return Math.round((b.getTime() - a.getTime()) / msPerDay)
}

function getCurrentSeason(today: Date): { season: LiturgicalSeason; daysRemaining: number; startDate: Date; endDate: Date } {
  const year = today.getFullYear()
  const easter = getEasterDate(year)
  const easterNext = getEasterDate(year + 1)

  // Key dates for current year
  const adventStart = new Date(year, 11, 25) // Christmas
  // Advent starts 4 Sundays before Christmas
  const christmas = new Date(year, 11, 25)
  const christmasDec = christmas.getDay()
  const advent1 = addDays(christmas, -(christmasDec === 0 ? 28 : christmasDec + 21))

  const epiphany = new Date(year, 0, 6)
  const ashWednesday = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const easterEnd = addDays(easter, 49) // Pentecost
  const christmasEve = new Date(year, 11, 24)

  // Next year's Advent
  const christmasNext = new Date(year + 1, 11, 25)
  const christmasNextDow = christmasNext.getDay()
  const advent1Next = addDays(christmasNext, -(christmasNextDow === 0 ? 28 : christmasNextDow + 21))

  // Previous year's Christmas for Jan dates
  const christmasPrev = new Date(year - 1, 11, 25)

  const seasons: Record<string, LiturgicalSeason> = {
    advent: {
      name: 'Advent',
      color: '#6B21A8',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-600',
      description: 'A season of preparation and expectation for the coming of Christ',
    },
    christmas: {
      name: 'Christmas',
      color: '#D4AF37',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-500',
      description: 'Celebrating the birth of our Lord Jesus Christ',
    },
    epiphany: {
      name: 'Epiphany / Ordinary Time',
      color: '#16A34A',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-600',
      description: 'The manifestation of Christ to the Gentiles and a time of growth in faith',
    },
    lent: {
      name: 'Lent',
      color: '#6B21A8',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-600',
      description: '40 days of penitence, prayer, and fasting in preparation for Easter',
    },
    holyWeek: {
      name: 'Holy Week',
      color: '#991B1B',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-700',
      description: 'The most solemn week of the Christian year, commemorating the Passion of Christ',
    },
    easter: {
      name: 'Easter',
      color: '#D4AF37',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-500',
      description: 'The great 50 days celebrating the Resurrection of our Lord',
    },
    ordinaryTime: {
      name: 'Ordinary Time',
      color: '#16A34A',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-600',
      description: 'A season of growth and discipleship, exploring the teachings of Christ',
    },
  }

  const todayMs = today.getTime()

  // Christmas season (Dec 25 prev year to Jan 5)
  if (today >= christmasPrev && today < epiphany && today.getMonth() === 0) {
    return { season: seasons.christmas, daysRemaining: daysBetween(today, addDays(epiphany, -1)), startDate: christmasPrev, endDate: addDays(epiphany, -1) }
  }

  // Epiphany / After Epiphany (Jan 6 to Ash Wednesday)
  if (today >= epiphany && today < ashWednesday) {
    return { season: seasons.epiphany, daysRemaining: daysBetween(today, addDays(ashWednesday, -1)), startDate: epiphany, endDate: addDays(ashWednesday, -1) }
  }

  // Lent (Ash Wednesday to Palm Sunday)
  if (today >= ashWednesday && today < palmSunday) {
    return { season: seasons.lent, daysRemaining: daysBetween(today, addDays(palmSunday, -1)), startDate: ashWednesday, endDate: addDays(palmSunday, -1) }
  }

  // Holy Week (Palm Sunday to Easter Eve)
  if (today >= palmSunday && today < easter) {
    return { season: seasons.holyWeek, daysRemaining: daysBetween(today, addDays(easter, -1)), startDate: palmSunday, endDate: addDays(easter, -1) }
  }

  // Easter (Easter to Pentecost)
  if (today >= easter && today < easterEnd) {
    return { season: seasons.easter, daysRemaining: daysBetween(today, addDays(easterEnd, -1)), startDate: easter, endDate: addDays(easterEnd, -1) }
  }

  // Ordinary Time after Pentecost (to Advent)
  if (today >= easterEnd && today < advent1) {
    return { season: seasons.ordinaryTime, daysRemaining: daysBetween(today, addDays(advent1, -1)), startDate: easterEnd, endDate: addDays(advent1, -1) }
  }

  // Advent
  if (today >= advent1 && today < christmas) {
    return { season: seasons.advent, daysRemaining: daysBetween(today, addDays(christmas, -1)), startDate: advent1, endDate: addDays(christmas, -1) }
  }

  // Christmas (Dec 25 onward)
  if (today >= christmas) {
    const nextEpiphany = new Date(year + 1, 0, 6)
    return { season: seasons.christmas, daysRemaining: daysBetween(today, addDays(nextEpiphany, -1)), startDate: christmas, endDate: addDays(nextEpiphany, -1) }
  }

  // Fallback
  return { season: seasons.ordinaryTime, daysRemaining: 0, startDate: today, endDate: today }
}

function getUpcomingDates(today: Date): { name: string; date: Date; color: string }[] {
  const year = today.getFullYear()
  const easter = getEasterDate(year)
  const easterNext = getEasterDate(year + 1)

  const dates = [
    { name: 'Epiphany', date: new Date(year, 0, 6), color: '#16A34A' },
    { name: 'Ash Wednesday', date: addDays(easter, -46), color: '#6B21A8' },
    { name: 'Palm Sunday', date: addDays(easter, -7), color: '#991B1B' },
    { name: 'Maundy Thursday', date: addDays(easter, -3), color: '#991B1B' },
    { name: 'Good Friday', date: addDays(easter, -2), color: '#991B1B' },
    { name: 'Easter Sunday', date: easter, color: '#D4AF37' },
    { name: 'Ascension Day', date: addDays(easter, 39), color: '#D4AF37' },
    { name: 'Pentecost', date: addDays(easter, 49), color: '#DC2626' },
    { name: 'Trinity Sunday', date: addDays(easter, 56), color: '#D4AF37' },
    { name: 'Christmas Day', date: new Date(year, 11, 25), color: '#D4AF37' },
    // Next year
    { name: 'Epiphany', date: new Date(year + 1, 0, 6), color: '#16A34A' },
    { name: 'Ash Wednesday', date: addDays(easterNext, -46), color: '#6B21A8' },
    { name: 'Easter Sunday', date: easterNext, color: '#D4AF37' },
  ]

  return dates
    .filter((d) => d.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 6)
}

export function LiturgicalCalendar() {
  const today = new Date()
  const { season, daysRemaining, startDate, endDate } = useMemo(() => getCurrentSeason(today), [])
  const upcoming = useMemo(() => getUpcomingDates(today), [])

  const totalDays = daysBetween(startDate, endDate)
  const elapsed = totalDays - daysRemaining
  const progress = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Current Season Hero */}
      <div className={`rounded-xl border-l-4 ${season.borderColor} ${season.bgColor} p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Current Liturgical Season</p>
            <h2 className={`text-3xl font-playfair ${season.textColor} mb-2`}>{season.name}</h2>
            <p className="text-gray-700 max-w-md">{season.description}</p>
          </div>
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 shadow-inner"
            style={{ backgroundColor: season.color }}
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            <span>{daysRemaining} days remaining</span>
            <span>{endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: season.color }}
            />
          </div>
        </div>
      </div>

      {/* Season Colors Legend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-playfair text-navy mb-4">Anglican Liturgical Colours</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Advent', color: '#6B21A8', label: 'Purple' },
            { name: 'Christmas', color: '#D4AF37', label: 'White/Gold' },
            { name: 'Epiphany', color: '#16A34A', label: 'Green' },
            { name: 'Lent', color: '#6B21A8', label: 'Purple' },
            { name: 'Holy Week', color: '#991B1B', label: 'Deep Red' },
            { name: 'Easter', color: '#D4AF37', label: 'White/Gold' },
            { name: 'Pentecost', color: '#DC2626', label: 'Red' },
            { name: 'Ordinary Time', color: '#16A34A', label: 'Green' },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <div>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Dates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-playfair text-navy mb-4">Upcoming Holy Days</h3>
        <div className="space-y-3">
          {upcoming.map((item, i) => {
            const daysAway = daysBetween(today, item.date)
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-800">
                    {item.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daysAway === 1 ? 'Tomorrow' : `${daysAway} days away`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
