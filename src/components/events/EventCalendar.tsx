import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users } from 'lucide-react'
import { Event } from '@/types/notice'
import { useAuth } from '@/hooks/useAuth'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const CATEGORY_COLORS: Record<string, string> = {
  service:    'bg-navy text-white',
  fellowship: 'bg-green-600 text-white',
  conference: 'bg-purple-600 text-white',
  retreat:    'bg-indigo-600 text-white',
  youth:      'bg-orange-500 text-white',
  outreach:   'bg-teal-600 text-white',
  committee:  'bg-gray-600 text-white',
}

interface EventCalendarProps {
  events: Event[]
  userRSVPs: Record<string, string>
  onRSVP: (eventId: string, status: string) => void
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function EventCalendar({ events, userRSVPs, onRSVP }: EventCalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date | null>(null)

  const { user } = useAuth()

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Days array for the calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (Date | null)[] = []

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) days.push(null)

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }

    // Trailing cells to complete last row
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [year, month])

  const eventsOnDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_datetime), day))

  const selectedEvents = selected ? eventsOnDay(selected) : []

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-playfair text-navy">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today) }}
            className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100 text-navy font-medium"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="h-20 border-b border-r border-gray-50 bg-gray-50/40" />
            }

            const dayEvents = eventsOnDay(day)
            const isToday = isSameDay(day, today)
            const isSelected = selected && isSameDay(day, selected)

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelected(day)}
                className={`h-20 p-1 border-b border-r border-gray-100 cursor-pointer transition-colors overflow-hidden
                  ${isSelected ? 'bg-navy-50 ring-2 ring-inset ring-navy' : 'hover:bg-gray-50'}
                `}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                  ${isToday ? 'bg-gold text-navy font-bold' : isSelected ? 'bg-navy text-white' : 'text-gray-700'}
                `}>
                  {day.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={`text-xs px-1 rounded truncate ${CATEGORY_COLORS[e.category] || 'bg-navy text-white'}`}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selected && (
        <div>
          <h3 className="text-base font-semibold text-navy mb-3">
            {selected.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>

          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center bg-white rounded-lg shadow">No events on this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-l-gold">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-navy">{event.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[event.category] || 'bg-gray-200 text-gray-700'}`}>
                      {event.category}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.start_datetime).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      {event.end_datetime && ` – ${new Date(event.end_datetime).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                    {event.rsvp_count !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {(event.rsvp_count as unknown as { count: number }[])?.[0]?.count ?? 0} attending
                      </span>
                    )}
                  </div>

                  {event.rsvp_enabled && user && (
                    <div className="flex gap-2">
                      {(['attending', 'maybe'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => onRSVP(event.id, status)}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                            userRSVPs[event.id] === status
                              ? status === 'attending' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
