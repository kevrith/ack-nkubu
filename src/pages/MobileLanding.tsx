import { Link } from 'react-router-dom'
import { BookOpen, Users, Heart, Calendar, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function MobileLanding() {
  const [churchName, setChurchName] = useState('ACK St Francis Nkubu')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase
      .from('cms_settings')
      .select('*')
      .eq('key', 'church_name')
      .single()
    if (data) setChurchName(data.value)
  }
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Hero */}
      <div className="px-6 pt-12 pb-8 text-center">
        <img src="/MERU.png" alt="Logo" className="w-24 h-24 rounded-3xl mx-auto mb-6" />
        <h1 className="text-3xl font-playfair mb-3">{churchName}</h1>
        <p className="text-navy-100 mb-8">Your spiritual home in your pocket</p>
        <Link to="/login" className="block w-full py-4 bg-gold text-navy font-semibold rounded-xl mb-3">
          Sign In
        </Link>
        <Link to="/register" className="block w-full py-4 bg-white/10 backdrop-blur font-semibold rounded-xl">
          Create Account
        </Link>
      </div>

      {/* Quick Features */}
      <div className="px-6 py-8 space-y-4">
        <QuickFeature icon={<BookOpen />} title="Read Bible" desc="5 versions available" />
        <QuickFeature icon={<Users />} title="Community" desc="Connect with members" />
        <QuickFeature icon={<Heart />} title="Give via M-Pesa" desc="Secure & instant" />
        <QuickFeature icon={<Calendar />} title="Events & RSVP" desc="Never miss a service" />
      </div>

      {/* Install Prompt */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur">
        <div className="flex items-center gap-4">
          <Download className="w-12 h-12 text-gold" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install App</h3>
            <p className="text-sm text-navy-100">Works offline, faster access</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-4">
      <div className="w-12 h-12 bg-gold text-navy rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-navy-100">{desc}</p>
      </div>
    </div>
  )
}
