import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sermon, SermonType } from '@/types/sermon'
import { SermonCard } from '@/components/sermons/SermonCard'
import { SermonPlayer } from '@/components/sermons/SermonPlayer'
import { SermonFilters } from '@/components/sermons/SermonFilters'
import { SermonSeries } from '@/components/sermons/SermonSeries'
import { Folder, Grid } from 'lucide-react'

export function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<SermonType | 'all'>('all')
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null)
  const [view, setView] = useState<'grid' | 'series'>('grid')
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null)

  useEffect(() => {
    fetchSermons()
  }, [selectedType, selectedSeriesId])

  async function fetchSermons() {
    setLoading(true)
    let query = supabase
      .from('sermons')
      .select('*, preacher:profiles(full_name)')
      .eq('is_published', true)
      .order('sermon_date', { ascending: false })

    if (selectedType !== 'all') {
      query = query.eq('type', selectedType)
    }

    if (selectedSeriesId) {
      query = query.eq('series_id', selectedSeriesId)
    }

    const { data } = await query
    setSermons(data || [])
    setLoading(false)
  }

  async function handlePlay(sermon: Sermon) {
    setSelectedSermon(sermon)
    
    await supabase
      .from('sermons')
      .update({ view_count: sermon.view_count + 1 })
      .eq('id', sermon.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Sermon Library</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setView('grid'); setSelectedSeriesId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === 'grid' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Grid className="h-4 w-4" />
            All Sermons
          </button>
          <button
            onClick={() => setView('series')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === 'series' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Folder className="h-4 w-4" />
            Series
          </button>
        </div>
      </div>

      {view === 'series' && !selectedSeriesId ? (
        <SermonSeries onSelectSeries={(id) => { setSelectedSeriesId(id); setView('grid'); }} />
      ) : (
        <>
          {selectedSeriesId && (
            <button
              onClick={() => setSelectedSeriesId(null)}
              className="text-sm text-navy hover:underline"
            >
              ← Back to all sermons
            </button>
          )}
          <SermonFilters selectedType={selectedType} onTypeChange={setSelectedType} />

          {loading ? (
            <div className="text-center py-12">Loading sermons...</div>
          ) : sermons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No sermons available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} onPlay={handlePlay} />
              ))}
            </div>
          )}
        </>
      )}

      {selectedSermon && (
        <SermonPlayer sermon={selectedSermon} onClose={() => setSelectedSermon(null)} />
      )}
    </div>
  )
}
