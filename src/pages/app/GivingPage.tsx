import { useState } from 'react'
import { Heart, History } from 'lucide-react'
import { GivingForm } from '@/components/giving/GivingForm'
import { GivingHistory } from '@/components/giving/GivingHistory'

export function GivingPage() {
  const [view, setView] = useState<'give' | 'history'>('give')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">M-Pesa Giving</h1>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setView('give')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'give' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          Give
        </button>
        <button
          onClick={() => setView('history')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            view === 'history' ? 'border-navy text-navy' : 'border-transparent text-gray-500'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>

      <div className="max-w-2xl">
        {view === 'give' ? <GivingForm /> : <GivingHistory />}
      </div>
    </div>
  )
}
