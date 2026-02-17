import { useState } from 'react'
import { BookOpen, HandHeart, Calendar, Plus } from 'lucide-react'
import { DailyPrayer } from '@/components/prayers/DailyPrayer'
import { PrayerLibrary } from '@/components/prayers/PrayerLibrary'
import { PrayerWall } from '@/components/prayers/PrayerWall'
import { PrayerRequestForm } from '@/components/prayers/PrayerRequestForm'

export function PrayersPage() {
  const [view, setView] = useState<'daily' | 'library' | 'requests'>('daily')
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

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setView('daily')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'daily' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Daily Prayer
        </button>
        <button
          onClick={() => setView('library')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'library' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Prayer Library
        </button>
        <button
          onClick={() => setView('requests')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'requests' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          Prayer Wall
        </button>
      </div>

      <div>
        {view === 'daily' && <DailyPrayer />}
        {view === 'library' && <PrayerLibrary />}
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
