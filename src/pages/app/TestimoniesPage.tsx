import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Heart, Plus, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react'
import { Testimony } from '@/types/testimony'
import { MediaUploader } from '@/components/shared/MediaUploader'

export function TestimoniesPage() {
  const { user } = useAuth()
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'my'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestimonies()
  }, [filter])

  async function loadTestimonies() {
    setLoading(true)
    let query = supabase
      .from('testimonies')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (filter === 'my') {
      query = query.eq('author_id', user?.id)
    } else {
      query = query.eq('status', 'approved')
    }

    const { data } = await query
    setTestimonies(data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Testimonies</h1>
          <p className="text-gray-600">Share how God has worked in your life</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Share Testimony
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All Testimonies
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'my' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          My Testimonies
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading testimonies...</div>
      ) : testimonies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No testimonies yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonies.map((testimony) => (
            <TestimonyCard key={testimony.id} testimony={testimony} onUpdate={loadTestimonies} />
          ))}
        </div>
      )}

      {showForm && <TestimonyForm onClose={() => setShowForm(false)} onSubmit={loadTestimonies} />}
    </div>
  )
}

function TestimonyCard({ testimony, onUpdate }: { testimony: Testimony; onUpdate: () => void }) {
  const { user } = useAuth()
  const [reacted, setReacted] = useState(false)

  useEffect(() => {
    checkReaction()
  }, [])

  async function checkReaction() {
    const { data } = await supabase
      .from('testimony_reactions')
      .select('id')
      .eq('testimony_id', testimony.id)
      .eq('user_id', user?.id)
      .maybeSingle()
    setReacted(!!data)
  }

  async function toggleReaction() {
    if (reacted) {
      await supabase
        .from('testimony_reactions')
        .delete()
        .eq('testimony_id', testimony.id)
        .eq('user_id', user?.id)
      setReacted(false)
    } else {
      await supabase
        .from('testimony_reactions')
        .insert({ testimony_id: testimony.id, user_id: user?.id, reaction_type: 'amen' })
      setReacted(true)
    }
    onUpdate()
  }

  const categoryColors: Record<string, string> = {
    answered_prayer: 'bg-blue-100 text-blue-700',
    healing: 'bg-green-100 text-green-700',
    provision: 'bg-purple-100 text-purple-700',
    salvation: 'bg-gold/20 text-gold-700',
    deliverance: 'bg-red-100 text-red-700',
    other: 'bg-gray-100 text-gray-700'
  }

  const statusBadge = testimony.status === 'pending' ? (
    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
      <Clock className="w-3 h-3" />
      Pending Approval
    </span>
  ) : testimony.status === 'approved' ? (
    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
      <CheckCircle className="w-3 h-3" />
      Approved
    </span>
  ) : null

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {testimony.author?.avatar_url ? (
            <img src={testimony.author.avatar_url} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
              {testimony.author?.full_name?.[0]}
            </div>
          )}
          <div>
            <div className="font-semibold text-navy">{testimony.author?.full_name}</div>
            <div className="text-xs text-gray-500">{new Date(testimony.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        {statusBadge}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-navy">{testimony.title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${categoryColors[testimony.category]}`}>
            {testimony.category.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{testimony.content}</p>
      </div>

      {testimony.image_url && (
        <img src={testimony.image_url} alt="" className="w-full rounded-lg" />
      )}

      {testimony.status === 'approved' && (
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            onClick={toggleReaction}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              reacted ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${reacted ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Amen ({testimony.likes_count})</span>
          </button>
        </div>
      )}
    </div>
  )
}

function TestimonyForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<string>('answered_prayer')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    await supabase.from('testimonies').insert({
      author_id: user?.id,
      title,
      content,
      category,
      image_url: imageUrl || null,
      status: 'pending'
    })

    setSubmitting(false)
    onSubmit()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-playfair text-navy mb-4">Share Your Testimony</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="How God answered my prayer..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="answered_prayer">Answered Prayer</option>
              <option value="healing">Healing</option>
              <option value="provision">Provision</option>
              <option value="salvation">Salvation</option>
              <option value="deliverance">Deliverance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-40"
              placeholder="Share how God has worked in your life..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="w-full rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <MediaUploader onUpload={setImageUrl}>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                </div>
              </MediaUploader>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your testimony will be reviewed by clergy before being published. This helps maintain the quality and appropriateness of shared content.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Testimony'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
