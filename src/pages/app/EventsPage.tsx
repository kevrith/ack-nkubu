import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/notice'
import { formatDate } from '@/lib/utils'

export function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
    if (user) fetchUserRSVPs()
  }, [user])

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*, rsvp_count:event_rsvps(count)')
      .eq('is_published', true)
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime', { ascending: true })
    
    setEvents(data || [])
    setLoading(false)
  }

  async function fetchUserRSVPs() {
    if (!user) return
    const { data } = await supabase
      .from('event_rsvps')
      .select('event_id, status')
      .eq('user_id', user.id)
    
    const rsvps: Record<string, string> = {}
    data?.forEach(r => rsvps[r.event_id] = r.status)
    setUserRSVPs(rsvps)
  }

  async function handleRSVP(eventId: string, status: string) {
    if (!user) return

    const { error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        status,
      })

    if (!error) {
      setUserRSVPs({ ...userRSVPs, [eventId]: status })
      fetchEvents()
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading events...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Events Calendar</h1>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No upcoming events.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
              {event.cover_image_url && (
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-navy">{event.title}</h2>
                  <span className="px-2 py-1 bg-navy-50 text-navy text-xs rounded">
                    {event.category}
                  </span>
                </div>

                {event.description && (
                  <p className="text-gray-700 mb-4">{event.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.start_datetime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(event.start_datetime).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.rsvp_count && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{(event.rsvp_count as any)[0]?.count || 0} attending</span>
                    </div>
                  )}
                </div>

                {event.rsvp_enabled && user && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRSVP(event.id, 'attending')}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        userRSVPs[event.id] === 'attending'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Attending
                    </button>
                    <button
                      onClick={() => handleRSVP(event.id, 'maybe')}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        userRSVPs[event.id] === 'maybe'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Maybe
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
