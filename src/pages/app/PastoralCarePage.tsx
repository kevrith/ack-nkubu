import { useState, useEffect } from 'react'
import { Lock, Calendar, Clock, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { PastoralCareRequest, PastoralCareType, PastoralCareStatus } from '@/types/pastoral'
import { normalizeKenyanPhone } from '@/lib/utils'

const careTypes: { value: PastoralCareType; label: string; icon: string }[] = [
  { value: 'prayer', label: 'Prayer Support', icon: '🙏' },
  { value: 'counselling', label: 'Counselling', icon: '💬' },
  { value: 'hospital_visit', label: 'Hospital Visit', icon: '🏥' },
  { value: 'home_visit', label: 'Home Visit', icon: '🏠' },
  { value: 'bereavement', label: 'Bereavement Support', icon: '✝️' },
  { value: 'marriage', label: 'Marriage Preparation', icon: '💒' },
  { value: 'other', label: 'Other', icon: '❓' },
]

const statusColors: Record<PastoralCareStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  acknowledged: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

export function PastoralCarePage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<PastoralCareRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<PastoralCareType>('prayer')
  const [details, setDetails] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [contactPhone, setContactPhone] = useState(user?.profile.phone || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchRequests()
  }, [user])

  async function fetchRequests() {
    if (!user) return
    const { data } = await supabase
      .from('pastoral_care_requests')
      .select('*')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })
    
    setRequests(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const { error } = await supabase.from('pastoral_care_requests').insert({
      requester_id: user.id,
      type,
      details,
      preferred_date: preferredDate || null,
      preferred_time: preferredTime || null,
      contact_phone: normalizeKenyanPhone(contactPhone) || null,
    })

    if (!error) {
      setDetails('')
      setPreferredDate('')
      setPreferredTime('')
      setShowForm(false)
      fetchRequests()
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-6 text-center">
        <p className="text-navy">Please sign in to request pastoral care</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Pastoral Care</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
          >
            New Request
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Confidential:</strong> All pastoral care requests are private. Only you and authorized clergy can see your requests.
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type of Support Needed
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {careTypes.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setType(ct.value)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    type === ct.value ? 'border-navy bg-navy-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{ct.icon}</div>
                  <div className="text-xs font-medium">{ct.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please share what support you need
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Share your needs confidentially..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time (Optional)
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="">Any time</option>
                <option value="morning">Morning (8-12)</option>
                <option value="afternoon">Afternoon (12-5)</option>
                <option value="evening">Evening (5-8)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="0712345678"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-navy">My Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No requests yet</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-navy capitalize">
                    {careTypes.find(ct => ct.value === request.type)?.label}
                  </h3>
                  <div className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                    {request.preferred_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(request.preferred_date).toLocaleDateString()}
                      </span>
                    )}
                    {request.preferred_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {request.preferred_time}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                  {request.status === 'pending' && '🟡 Pending'}
                  {request.status === 'acknowledged' && '🔵 Acknowledged'}
                  {request.status === 'in_progress' && '🟣 In Progress'}
                  {request.status === 'completed' && '🟢 Completed'}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{request.details}</p>
              {request.status === 'completed' && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Request completed</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
