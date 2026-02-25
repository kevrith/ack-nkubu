import { useState } from 'react'
import { BookOpen, HandHeart, Calendar, Church, Plus, Download } from 'lucide-react'
import { DailyPrayer } from '@/components/prayers/DailyPrayer'
import { PrayerLibrary } from '@/components/prayers/PrayerLibrary'
import { PrayerWall } from '@/components/prayers/PrayerWall'
import { PrayerRequestForm } from '@/components/prayers/PrayerRequestForm'
import { LiturgicalCalendar } from '@/components/prayers/LiturgicalCalendar'

export function PrayersPage() {
  const [view, setView] = useState<'daily' | 'library' | 'calendar' | 'requests'>('daily')
  const [showRequestForm, setShowRequestForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Prayers & Liturgy</h1>
        {view === 'requests' && (
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setView('daily')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
            view === 'daily' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Daily Prayer
        </button>
        <button
          onClick={() => setView('library')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
            view === 'library' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Prayer Library
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
            view === 'calendar' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Church className="w-4 h-4" />
          Liturgical Calendar
        </button>
        <button
          onClick={() => setView('requests')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
            view === 'requests' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          Prayer Wall
        </button>
      </div>

      <div>
        {view === 'daily' && <DailyPrayer />}
        {view === 'library' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <Download className="w-12 h-12" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Download Book of Common Prayer App</h3>
                  <p className="text-blue-100 mb-4">Get the full Anglican liturgy on your phone - works offline!</p>
                  <a
                    href="/ACK_Kitabu_Kipya_Cha_Ibada_org.worldliturgy.anglicanchurchkenya/ACK_Kitabu_Kipya_Cha_Ibada_base.apk"
                    download="ACK_Kitabu_Kipya_Cha_Ibada.apk"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download APK
                  </a>
                </div>
              </div>
            </div>
            <PrayerLibrary />
          </div>
        )}
        {view === 'calendar' && <LiturgicalCalendar />}
        {view === 'requests' && (
          <div className="space-y-6">
            {showRequestForm && (
              <PrayerRequestForm onSuccess={() => setShowRequestForm(false)} />
            )}
            <PrayerWall />
          </div>
        )}
      </div>
    </div>
  )
}
