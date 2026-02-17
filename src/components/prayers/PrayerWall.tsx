import { useState, useEffect } from 'react'
import { HandHeart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { PrayerRequest } from '@/types/prayer'
import { formatDate } from '@/lib/utils'

export function PrayerWall() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data } = await supabase
      .from('prayer_requests')
      .select('*, profiles(full_name)')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20)
    
    setRequests(data || [])
    setLoading(false)
  }

  async function handlePray(requestId: string) {
    if (!user) return

    // The insert triggers increment_prayer_count() automatically (migration 004)
    const { error } = await supabase.from('prayer_interactions').insert({
      request_id: requestId,
      user_id: user.id,
    })

    if (error) {
      // Unique constraint violation means user already prayed for this request
      if (error.code === '23505') return
      console.error('Prayer interaction error:', error)
      return
    }

    fetchRequests()
  }

  if (loading) {
    return <div className="text-center py-8">Loading prayer requests...</div>
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <HandHeart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No prayer requests yet. Be the first to share!</p>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-medium text-navy">
                  {request.is_anonymous ? 'Anonymous' : (request as any).profiles?.full_name}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(request.created_at)}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{request.request}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePray(request.id)}
                disabled={!user}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600 disabled:opacity-50"
              >
                <HandHeart className="w-4 h-4" />
                Pray ({request.prayer_count})
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
