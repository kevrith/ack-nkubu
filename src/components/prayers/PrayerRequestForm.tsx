import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function PrayerRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth()
  const [request, setRequest] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !request.trim()) return

    setLoading(true)
    const { error } = await supabase.from('prayer_requests').insert({
      requester_id: user.id,
      request: request.trim(),
      is_anonymous: isAnonymous,
      is_public: isPublic,
    })

    if (!error) {
      setRequest('')
      setIsAnonymous(false)
      setIsPublic(true)
      onSuccess()
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-6 text-center">
        <p className="text-navy">Please sign in to submit a prayer request</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Prayer Request
        </label>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="Share your prayer request..."
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Share publicly (others can pray for you)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Post anonymously</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Prayer Request'}
      </button>
    </form>
  )
}
