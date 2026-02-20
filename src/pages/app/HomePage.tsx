import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BookOpen, HandHeart, Heart, Users, Calendar, Bell, Book } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function HomePage() {
  const { user } = useAuth()
  const [dailyVerse, setDailyVerse] = useState({ text: '', reference: '' })
  const [latestSermon, setLatestSermon] = useState<any>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [recentNotices, setRecentNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    await Promise.all([
      loadDailyVerse(),
      loadLatestSermon(),
      loadUpcomingEvents(),
      loadRecentNotices()
    ])
    setLoading(false)
  }

  async function loadDailyVerse() {
    const verses = [
      { text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', reference: 'John 3:16' },
      { text: 'Trust in the LORD with all your heart and lean not on your own understanding.', reference: 'Proverbs 3:5' },
      { text: 'I can do all things through Christ who strengthens me.', reference: 'Philippians 4:13' },
      { text: 'The LORD is my shepherd, I lack nothing.', reference: 'Psalm 23:1' },
      { text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', reference: 'Joshua 1:9' },
    ]
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyVerse(verses[dayOfYear % verses.length])
  }

  async function loadLatestSermon() {
    const { data } = await supabase.from('sermons').select('*').eq('is_published', true).order('sermon_date', { ascending: false }).limit(1)
    setLatestSermon(data?.[0] || null)
  }

  async function loadUpcomingEvents() {
    const { data } = await supabase.from('events').select('*').gte('start_datetime', new Date().toISOString()).order('start_datetime').limit(3)
    setUpcomingEvents(data || [])
  }

  async function loadRecentNotices() {
    const { data } = await supabase.from('notices').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3)
    setRecentNotices(data || [])
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gray-200 rounded-lg h-32" />
        <div className="bg-gray-200 rounded-lg h-40" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-200 rounded-lg h-24" />)}
        </div>
        <div className="bg-gray-200 rounded-lg h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-navy to-navy-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-playfair mb-2">
          {getGreeting()}, {user?.profile.full_name.split(' ')[0]} ✝️
        </h1>
        <p className="text-navy-100">Welcome back to your spiritual home</p>
      </div>

      <div className="bg-navy text-white rounded-lg p-6 border-2 border-gold">
        <p className="text-sm text-gold mb-2">Daily Verse</p>
        <p className="font-lora text-lg mb-3 leading-relaxed">{dailyVerse.text}</p>
        <p className="text-sm text-gold">{dailyVerse.reference} (NIV)</p>
      </div>

      <div>
        <h2 className="text-xl font-playfair text-navy mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/bible" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
            <BookOpen className="w-8 h-8 text-navy mx-auto mb-2" />
            <span className="text-sm font-medium">Read</span>
          </Link>
          <Link to="/prayers" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
            <HandHeart className="w-8 h-8 text-navy mx-auto mb-2" />
            <span className="text-sm font-medium">Pray</span>
          </Link>
          <Link to="/giving" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
            <Heart className="w-8 h-8 text-gold mx-auto mb-2" />
            <span className="text-sm font-medium">Give</span>
          </Link>
          <Link to="/community" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
            <Users className="w-8 h-8 text-navy mx-auto mb-2" />
            <span className="text-sm font-medium">Community</span>
          </Link>
          <Link to="/bcp" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
            <Book className="w-8 h-8 text-navy mx-auto mb-2" />
            <span className="text-sm font-medium">BCP</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-playfair text-navy mb-4">Latest Sermon</h2>
        {latestSermon ? (
          <div className="flex gap-4">
            {latestSermon.thumbnail_url && <img src={latestSermon.thumbnail_url} alt="" className="w-32 h-32 bg-gray-200 rounded-lg object-cover flex-shrink-0" />}
            <div>
              <h3 className="font-semibold text-navy mb-1">{latestSermon.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{latestSermon.speaker} • {latestSermon.scripture_reference}</p>
              <Link to={`/sermons/${latestSermon.id}`} className="text-sm text-gold hover:text-gold-600 font-medium">▶ Play Sermon</Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No sermons available</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-navy" />
            <h2 className="text-xl font-playfair text-navy">Sunday Service Times</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-gold bg-gray-50 rounded">
              <div className="font-semibold text-navy">8:30 AM - 9:45 AM</div>
              <div className="text-sm text-gray-600">English Service • Main Church</div>
            </div>
            <div className="p-3 border-l-4 border-gold bg-gray-50 rounded">
              <div className="font-semibold text-navy">10:00 AM - 12:00 PM</div>
              <div className="text-sm text-gray-600">Kiswahili Service • Main Church</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-navy" />
            <h2 className="text-xl font-playfair text-navy">Upcoming Events</h2>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`} className="block p-3 border rounded-lg hover:bg-gray-50">
                  <div className="font-medium text-navy">{event.title}</div>
                  <div className="text-sm text-gray-600">{new Date(event.start_datetime).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-navy" />
            <h2 className="text-xl font-playfair text-navy">Recent Notices</h2>
          </div>
          {recentNotices.length > 0 ? (
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice.id} className="p-3 border rounded-lg">
                  <div className="font-medium text-navy">{notice.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{notice.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent notices</p>
          )}
        </div>
      </div>
    </div>
  )
}
