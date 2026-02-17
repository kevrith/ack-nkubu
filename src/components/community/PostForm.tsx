import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Image, X } from 'lucide-react'
import { MediaUploader } from '@/components/shared/MediaUploader'

interface PostFormProps {
  onSuccess: () => void
}

export function PostForm({ onSuccess }: PostFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showUploader, setShowUploader] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    const { error } = await supabase.from('community_posts').insert({
      author_id: user.id,
      content: content.trim(),
      image_url: imageUrl || null,
    })

    if (!error) {
      setContent('')
      setImageUrl('')
      onSuccess()
    }
    setLoading(false)
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your heart?"
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent mb-4"
      />
      {imageUrl && (
        <div className="relative mb-4">
          <img src={imageUrl} alt="Upload" className="w-full max-h-64 object-cover rounded-lg" />
          <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {showUploader && (
        <div className="mb-4">
          <MediaUploader onUploadComplete={(url) => { setImageUrl(url); setShowUploader(false); }} />
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={() => setShowUploader(!showUploader)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Image className="w-5 h-5" />
        </button>
        <button type="submit" disabled={loading || !content.trim()} className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}
