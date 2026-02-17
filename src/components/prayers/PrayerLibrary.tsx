import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Prayer, PrayerCategory } from '@/types/prayer'

const categories: { value: PrayerCategory; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'intercessory', label: 'Intercessory' },
  { value: 'liturgical', label: 'Liturgical' },
  { value: 'special', label: 'Special' },
]

export function PrayerLibrary() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | 'all'>('all')
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null)

  useEffect(() => {
    fetchPrayers()
  }, [selectedCategory])

  async function fetchPrayers() {
    let query = supabase.from('prayers').select('*').order('created_at', { ascending: false })
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }
    
    const { data } = await query
    setPrayers(data || [])
  }

  const filteredPrayers = prayers

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-navy text-white' : 'bg-gray-100'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg ${selectedCategory === cat.value ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredPrayers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No prayers in this category yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPrayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => setSelectedPrayer(prayer)}
              className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-gold transition-colors"
            >
              <h3 className="font-semibold text-navy mb-1">{prayer.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{prayer.content}</p>
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-navy-50 text-navy rounded">
                {prayer.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedPrayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPrayer(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-playfair text-navy mb-4">{selectedPrayer.title}</h2>
            <div className="font-lora text-lg leading-relaxed whitespace-pre-line mb-4">
              {selectedPrayer.content}
            </div>
            <button
              onClick={() => setSelectedPrayer(null)}
              className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
