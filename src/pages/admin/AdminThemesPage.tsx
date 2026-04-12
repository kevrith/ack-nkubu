import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Theme, ThemeType } from '@/types/theme'
import { MediaUploader } from '@/components/shared/MediaUploader'

export function AdminThemesPage() {
  const { user } = useAuth()
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Theme | null>(null)

  useEffect(() => { fetchThemes() }, [])

  async function fetchThemes() {
    const { data } = await supabase
      .from('themes')
      .select('*, author:profiles!created_by(full_name)')
      .order('created_at', { ascending: false })
    setThemes(data || [])
    setLoading(false)
  }

  async function togglePublish(theme: Theme) {
    await supabase
      .from('themes')
      .update({ is_published: !theme.is_published })
      .eq('id', theme.id)
    fetchThemes()
  }

  async function deleteTheme(id: string) {
    if (!confirm('Delete this theme?')) return
    await supabase.from('themes').delete().eq('id', id)
    fetchThemes()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair text-navy">Manage Themes</h1>
          <p className="text-gray-600 mt-1">Post diocesan and church themes</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Theme
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : themes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow text-gray-500">
          No themes yet. Click "New Theme" to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {themes.map((theme) => (
            <div key={theme.id} className={`bg-white rounded-lg shadow p-5 border-l-4 ${
              theme.type === 'diocesan' ? 'border-purple-600' : 'border-navy'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy text-lg">{theme.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme.type === 'diocesan' ? 'bg-purple-100 text-purple-700' : 'bg-navy-50 text-navy'
                    }`}>
                      {theme.type === 'diocesan' ? 'Diocesan' : 'Church'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {theme.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {theme.scripture && (
                    <p className="text-sm text-gold-700 italic mt-1">"{theme.scripture}"</p>
                  )}
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{theme.content}</p>
                  <p className="text-xs text-gray-400 mt-1">Year: {theme.year}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(theme)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={theme.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {theme.is_published
                      ? <EyeOff className="w-4 h-4 text-gray-500" />
                      : <Eye className="w-4 h-4 text-green-600" />
                    }
                  </button>
                  <button
                    onClick={() => { setEditing(theme); setShowForm(true) }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4 text-navy" />
                  </button>
                  <button
                    onClick={() => deleteTheme(theme.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ThemeForm
          theme={editing}
          userId={user!.id}
          onClose={() => setShowForm(false)}
          onSave={() => { setShowForm(false); fetchThemes() }}
        />
      )}
    </div>
  )
}

function ThemeForm({
  theme, userId, onClose, onSave
}: {
  theme: Theme | null
  userId: string
  onClose: () => void
  onSave: () => void
}) {
  const [title, setTitle] = useState(theme?.title || '')
  const [content, setContent] = useState(theme?.content || '')
  const [scripture, setScripture] = useState(theme?.scripture || '')
  const [type, setType] = useState<ThemeType>(theme?.type || 'church')
  const [year, setYear] = useState(theme?.year || new Date().getFullYear())
  const [imageUrl, setImageUrl] = useState(theme?.image_url || '')
  const [isPublished, setIsPublished] = useState(theme?.is_published || false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title, content, scripture: scripture || null,
      type, year, image_url: imageUrl || null,
      is_published: isPublished, created_by: userId,
    }

    if (theme) {
      await supabase.from('themes').update(payload).eq('id', theme.id)
    } else {
      await supabase.from('themes').insert(payload)
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-playfair text-navy mb-6">
          {theme ? 'Edit Theme' : 'New Theme'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ThemeType)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="church">Church Theme</option>
                <option value="diocesan">Diocesan Theme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
                min={2020}
                max={2100}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Theme title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scripture Reference</label>
            <input
              type="text"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g. John 3:16 - For God so loved the world..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-40"
              placeholder="Describe the theme..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="w-full rounded-lg h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <MediaUploader
                accept="image/*"
                resourceType="image"
                onUploadComplete={(url) => setImageUrl(url)}
                label=""
              />
            )}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Publish immediately</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : theme ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
