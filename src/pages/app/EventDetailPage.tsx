import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/notice'
import { formatDate } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  service:    'bg-navy text-white',
  fellowship: 'bg-green-600 text-white',
  conference: 'bg-purple-600 text-white',
  retreat:    'bg-indigo-600 text-white',
  youth:      'bg-orange-500 text-white',
  outreach:   'bg-teal-600 text-white',
  committee:  'bg-gray-600 text-white',
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [rsvping, setRsvping] = useState(false)

  useEffect(() => {
    if (id) loadEvent(id)
  }, [id])

  async function loadEvent(eventId: string) {
    const { data } = await supabase
      .from('events')
      .select('*, rsvp_count:event_rsvps(count)')
      .eq('id', eventId)
      .eq('is_published', true)
      .single()

    if (!data) {
      navigate('/events')
      return
    }

    setEvent(data)
    setRsvpCount((data.rsvp_count as unknown as { count: number }[])?.[0]?.count ?? 0)

    if (user) {
      const { data: rsvp } = await supabase
        .from('event_rsvps')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single()
      setRsvpStatus(rsvp?.status ?? null)
    }

    setLoading(false)
  }

  async function handleRSVP(status: string) {
    if (!user || !event) return
    setRsvping(true)
    const { error } = await supabase
      .from('event_rsvps')
      .upsert({ event_id: event.id, user_id: user.id, status })
    if (!error) {
      setRsvpStatus(status)
      setRsvpCount(prev => rsvpStatus ? prev : prev + 1)
    }
    setRsvping(false)
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading event...</div>
  }

  if (!event) return null

  const startDate = new Date(event.start_datetime)
  const endDate = event.end_datetime ? new Date(event.end_datetime) : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-navy hover:text-navy/70 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-56 object-cover"
          />
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-playfair text-navy">{event.title}</h1>
            <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-600'}`}>
              {event.category}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-navy shrink-0" />
              <span>{formatDate(event.start_datetime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy shrink-0" />
              <span>
                {startDate.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                {endDate && ` – ${endDate.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-navy shrink-0" />
                <span>{event.location}</span>
                {event.maps_url && (
                  <a
                    href={event.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-gold hover:text-gold/80"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-navy shrink-0" />
              <span>{rsvpCount} attending{event.max_attendees ? ` · ${event.max_attendees} capacity` : ''}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          )}

          {event.rsvp_enabled && user && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Will you attend?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRSVP('attending')}
                  disabled={rsvping}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    rsvpStatus === 'attending'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rsvpStatus === 'attending' ? '✓ Attending' : 'Attending'}
                </button>
                <button
                  onClick={() => handleRSVP('maybe')}
                  disabled={rsvping}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    rsvpStatus === 'maybe'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rsvpStatus === 'maybe' ? '✓ Maybe' : 'Maybe'}
                </button>
                <button
                  onClick={() => handleRSVP('not_attending')}
                  disabled={rsvping}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    rsvpStatus === 'not_attending'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rsvpStatus === 'not_attending' ? '✓ Can\'t Go' : 'Can\'t Go'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
