import { useState, useEffect } from 'react'
import { BookOpen, Church } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Theme, ThemeType } from '@/types/theme'

export function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [filter, setFilter] = useState<'all' | ThemeType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThemes()
  }, [filter])

  async function fetchThemes() {
    setLoading(true)
    let query = supabase
      .from('themes')
      .select('*, author:profiles!created_by(full_name, avatar_url)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('type', filter)

    const { data } = await query
    setThemes(data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-navy">Themes</h1>
        <p className="text-gray-600 mt-1">Diocesan and church themes for the year</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'diocesan', 'church'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === f ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'diocesan' ? 'Diocesan' : 'Church'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading themes...</div>
      ) : themes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No themes posted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  )
}

function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
      theme.type === 'diocesan' ? 'border-purple-600' : 'border-navy'
    }`}>
      {theme.image_url && (
        <img src={theme.image_url} alt={theme.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-playfair text-navy">{theme.title}</h2>
          <span className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            theme.type === 'diocesan'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-navy-50 text-navy'
          }`}>
            <Church className="w-3 h-3" />
            {theme.type === 'diocesan' ? 'Diocesan' : 'Church'}
          </span>
        </div>

        {theme.scripture && (
          <div className="bg-gold/10 border-l-4 border-gold px-4 py-3 rounded-r-lg">
            <p className="text-sm font-medium text-gold-700 italic">"{theme.scripture}"</p>
          </div>
        )}

        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{theme.content}</p>

        <div className="flex items-center justify-between pt-2 border-t text-sm text-gray-500">
          <span>Year: {theme.year}</span>
          {theme.author && <span>Posted by {theme.author.full_name}</span>}
        </div>
      </div>
    </div>
  )
}
