import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Church, Plus, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SacramentRequest } from '@/types/sacrament'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  scheduled: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800'
}

const STATUS_ICONS = {
  pending: Clock,
  under_review: Clock,
  approved: CheckCircle,
  scheduled: Calendar,
  completed: CheckCircle,
  rejected: XCircle
}

export function SacramentsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SacramentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    if (!user) return
    const { data } = await supabase
      .from('sacrament_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Church className="w-8 h-8 text-navy" />
          <h1 className="text-3xl font-playfair text-navy">My Sacrament Requests</h1>
        </div>
        <Link
          to="/sacraments/new"
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Church className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Requests Yet</h3>
          <p className="text-gray-500 mb-6">Submit a request for baptism, wedding, or funeral services</p>
          <Link
            to="/sacraments/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-600"
          >
            <Plus className="w-4 h-4" />
            Submit Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => {
            const Icon = STATUS_ICONS[request.status]
            return (
              <Link
                key={request.id}
                to={`/sacraments/${request.id}`}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-navy capitalize">{request.sacrament_type}</h3>
                    <p className="text-sm text-gray-600">{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[request.status]}`}>
                    <Icon className="w-3 h-3" />
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
                
                {request.sacrament_type === 'baptism' && (
                  <p className="text-gray-700">Candidate: {request.baptism_candidate_name}</p>
                )}
                {request.sacrament_type === 'wedding' && (
                  <p className="text-gray-700">{request.wedding_groom_name} & {request.wedding_bride_name}</p>
                )}
                {request.sacrament_type === 'funeral' && (
                  <p className="text-gray-700">Deceased: {request.funeral_deceased_name}</p>
                )}

                {request.scheduled_date && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded">
                    <Calendar className="w-4 h-4" />
                    Scheduled: {new Date(request.scheduled_date).toLocaleString()}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
