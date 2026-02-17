import { Link } from 'react-router-dom'
import { BookOpen, Users, Heart, Calendar, Bell, Video, HandHeart, Shield, Phone, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DesktopLanding() {
  const [notices, setNotices] = useState<any[]>([])
  const [sermons, setSermons] = useState<any[]>([])
  const [settings, setSettings] = useState({
    church_name: 'ACK St Francis Nkubu',
    church_email: 'info@ackparish.org',
    church_phone: '+254 700 000 000',
    church_address: 'Nkubu, Meru County, Kenya'
  })

  useEffect(() => {
    loadNotices()
    loadSermons()
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase.from('cms_settings').select('*')
    if (data) {
      const settingsObj: any = {}
      data.forEach(s => { settingsObj[s.key] = s.value })
      setSettings(prev => ({ ...prev, ...settingsObj }))
    }
  }

  async function loadNotices() {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
    setNotices(data || [])
  }

  async function loadSermons() {
    const { data } = await supabase
      .from('sermons')
      .select('*')
      .eq('is_published', true)
      .order('sermon_date', { ascending: false })
      .limit(3)
    setSermons(data || [])
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section with Church Image */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/aa.png)',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60"></div>
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/MERU.png" alt="Logo" className="w-12 h-12 rounded-full" />
            <span className="text-2xl font-playfair text-white">{settings.church_name}</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-gold transition">Sign In</Link>
            <Link to="/register" className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-600">Join Us</Link>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 h-[calc(100vh-100px)] flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-playfair text-white mb-6 leading-tight">Welcome to<br />{settings.church_name}</h1>
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">A community of faith, hope, and love. Join us in worship, fellowship, and service.</p>
            <div className="flex gap-4">
              <Link to="/register" className="px-8 py-4 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-600 text-lg">Become a Member</Link>
              <Link to="/bible" className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/20 text-lg">Explore Resources</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair text-navy text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Feature icon={<BookOpen />} title="Bible Reader" desc="Multiple versions with bookmarks" />
            <Feature icon={<Video />} title="Sermons" desc="Audio & video library" />
            <Feature icon={<Users />} title="Community" desc="Connect with members" />
            <Feature icon={<Heart />} title="M-Pesa Giving" desc="Secure digital tithing" />
            <Feature icon={<Calendar />} title="Events" desc="Calendar with RSVP" />
            <Feature icon={<Bell />} title="Notices" desc="Stay updated" />
            <Feature icon={<HandHeart />} title="Prayers" desc="Anglican liturgy" />
            <Feature icon={<Shield />} title="Pastoral Care" desc="Confidential support" />
          </div>
        </div>
      </div>

      {/* Service Times */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair text-navy text-center mb-12">Sunday Service Times</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Service</th>
                  <th className="px-6 py-4 text-left">Place</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">8:30 AM - 9:45 AM</td>
                  <td className="px-6 py-4">English</td>
                  <td className="px-6 py-4">Main Church</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">10:00 AM - 12:00 PM</td>
                  <td className="px-6 py-4">Kiswahili</td>
                  <td className="px-6 py-4">Main Church</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sermons Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Video className="w-8 h-8 text-navy" />
            <h2 className="text-4xl font-playfair text-navy">Latest Sermons</h2>
          </div>
          {sermons.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  {sermon.thumbnail_url && (
                    <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-navy mb-2">{sermon.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{sermon.speaker} • {sermon.scripture_reference}</p>
                    <p className="text-xs text-gray-500">{new Date(sermon.sermon_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No sermons available</p>
          )}
        </div>
      </div>

      {/* Notices Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Bell className="w-8 h-8 text-navy" />
            <h2 className="text-4xl font-playfair text-navy">Latest Notices</h2>
          </div>
          {notices.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-gray-50 rounded-lg p-6 border-l-4 border-gold">
                  <h3 className="font-semibold text-navy mb-2">{notice.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{notice.content}</p>
                  <p className="text-xs text-gray-500">{new Date(notice.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No notices available</p>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-navy text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair mb-6">Join Our Parish Family</h2>
              <p className="text-xl text-navy-100 mb-8">Experience the love of Christ in a welcoming community. Whether you're seeking spiritual growth, fellowship, or a place to serve, you belong here.</p>
              <Link to="/register" className="inline-block px-8 py-4 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-600 text-lg">Get Started Today</Link>
            </div>
            <div className="space-y-4">
              <ContactItem icon={<Phone />} text={settings.church_phone} />
              <ContactItem icon={<Mail />} text={settings.church_email} />
              <ContactItem icon={<MapPin />} text={settings.church_address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4 text-lg">
      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold">{icon}</div>
      <span>{text}</span>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-navy mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}
