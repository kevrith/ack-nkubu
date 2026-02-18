import { BCPReader } from '@/components/prayers/BCPReader'
import { TodaysCollect } from '@/components/prayers/TodaysCollect'
import { useState } from 'react'
import { Book, Star, Download, ExternalLink, Smartphone, AlertTriangle } from 'lucide-react'

type Tab = 'reader' | 'today'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=org.worldliturgy.anglicanchurchkenya'

function OfficialAppBanner() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl p-4 shadow-md hover:from-green-800 hover:to-green-700 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-sm">Download Official ACK App</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </div>
          <p className="text-xs text-green-100 leading-snug">
            <strong>Kitabu Kipya Cha Ibada</strong> — the complete, official ACK Book of Common Prayer app. Available free on Google Play.
          </p>
          <div className="mt-2 flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1 w-fit">
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Get it on Google Play</span>
          </div>
        </div>
      </div>
    </a>
  )
}

function ContentDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 leading-snug">
        The prayers below are a reference guide. For the complete and authoritative ACK liturgy, use the official app above or your printed Kitabu Kipya Cha Ibada.
      </p>
    </div>
  )
}

export function BCPPage() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
          <Book className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Book of Common Prayer</h1>
          <p className="text-xs text-gray-500">Anglican Church of Kenya</p>
        </div>
      </div>

      {/* Official app download banner – always visible */}
      <div className="mb-4 space-y-2">
        <OfficialAppBanner />
        <ContentDisclaimer />
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('today')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'today' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-4 h-4" />
          Today's Collect
        </button>
        <button
          onClick={() => setTab('reader')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'reader' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Book className="w-4 h-4" />
          Full BCP
        </button>
      </div>

      {tab === 'today' ? <TodaysCollect /> : <BCPReader />}
    </div>
  )
}
