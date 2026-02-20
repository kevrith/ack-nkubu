import { useState, useEffect } from 'react'
import { Church, Calendar, User, FileText, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SacramentRequest, SacramentRequestStatus } from '@/types/sacrament'

export function ClergySacramentsDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SacramentRequest[]>([])
  const [filter, setFilter] = useState<SacramentRequestStatus | 'all'>('pending')
  const [selectedRequest, setSelectedRequest] = useState<SacramentRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [filter])

  async function loadRequests() {
    let query = supabase
      .from('sacrament_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: SacramentRequestStatus) {
    await supabase
      .from('sacrament_requests')
      .update({ status, assigned_clergy_id: user?.id })
      .eq('id', id)

    await supabase.from('sacrament_request_activity').insert({
      request_id: id,
      user_id: user?.id,
      action: `Status changed to ${status}`
    })

    loadRequests()
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status })
    }
  }

  async function scheduleRequest(id: string, date: string, location: string) {
    await supabase
      .from('sacrament_requests')
      .update({ 
        status: 'scheduled',
        scheduled_date: date,
        scheduled_location: location,
        assigned_clergy_id: user?.id
      })
      .eq('id', id)

    await supabase.from('sacrament_request_activity').insert({
      request_id: id,
      user_id: user?.id,
      action: `Scheduled for ${new Date(date).toLocaleString()}`
    })

    // Create calendar event
    const request = requests.find(r => r.id === id)
    if (request) {
      const eventTitle = `${request.sacrament_type.charAt(0).toUpperCase() + request.sacrament_type.slice(1)} - ${request.full_name}`
      await supabase.from('events').insert({
        title: eventTitle,
        description: `${request.sacrament_type} service for ${request.full_name}`,
        event_date: date,
        location: location,
        event_type: 'sacrament',
        is_published: true
      })
    }

    loadRequests()
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Church className="w-8 h-8 text-navy" />
        <h1 className="text-3xl font-playfair text-navy">Sacrament Requests</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'under_review', 'approved', 'scheduled', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === f ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {requests.map(request => (
            <div
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition ${
                selectedRequest?.id === request.id ? 'ring-2 ring-navy' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-navy capitalize">{request.sacrament_type}</h3>
                  <p className="text-xs text-gray-500">{new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">{request.status.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-700">{request.full_name}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        {selectedRequest && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-navy capitalize">{selectedRequest.sacrament_type} Request</h2>
                <p className="text-sm text-gray-500">Submitted {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm capitalize">{selectedRequest.status.replace('_', ' ')}</span>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Requester</label>
                <p className="text-gray-900">{selectedRequest.full_name}</p>
                <p className="text-sm text-gray-600">{selectedRequest.email}</p>
                <p className="text-sm text-gray-600">{selectedRequest.phone}</p>
              </div>

              {selectedRequest.sacrament_type === 'baptism' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Candidate</label>
                    <p className="text-gray-900">{selectedRequest.baptism_candidate_name}</p>
                    <p className="text-sm text-gray-600">DOB: {selectedRequest.baptism_candidate_dob}</p>
                  </div>
                  {(selectedRequest.baptism_father_name || selectedRequest.baptism_mother_name) && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Parents</label>
                      {selectedRequest.baptism_father_name && (
                        <p className="text-gray-900">Father: {selectedRequest.baptism_father_name}</p>
                      )}
                      {selectedRequest.baptism_mother_name && (
                        <p className="text-gray-900">Mother: {selectedRequest.baptism_mother_name}</p>
                      )}
                    </div>
                  )}
                  {(selectedRequest.baptism_godparent1 || selectedRequest.baptism_godparent2) && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Godparents</label>
                      {selectedRequest.baptism_godparent1 && (
                        <p className="text-gray-900">1. {selectedRequest.baptism_godparent1}</p>
                      )}
                      {selectedRequest.baptism_godparent2 && (
                        <p className="text-gray-900">2. {selectedRequest.baptism_godparent2}</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {selectedRequest.sacrament_type === 'wedding' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Groom</label>
                    <p className="text-gray-900">{selectedRequest.wedding_groom_name}</p>
                    <p className="text-sm text-gray-600">DOB: {selectedRequest.wedding_groom_dob}</p>
                    {(selectedRequest.wedding_groom_father || selectedRequest.wedding_groom_mother) && (
                      <div className="mt-1">
                        {selectedRequest.wedding_groom_father && (
                          <p className="text-sm text-gray-600">Father: {selectedRequest.wedding_groom_father}</p>
                        )}
                        {selectedRequest.wedding_groom_mother && (
                          <p className="text-sm text-gray-600">Mother: {selectedRequest.wedding_groom_mother}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Bride</label>
                    <p className="text-gray-900">{selectedRequest.wedding_bride_name}</p>
                    <p className="text-sm text-gray-600">DOB: {selectedRequest.wedding_bride_dob}</p>
                    {(selectedRequest.wedding_bride_father || selectedRequest.wedding_bride_mother) && (
                      <div className="mt-1">
                        {selectedRequest.wedding_bride_father && (
                          <p className="text-sm text-gray-600">Father: {selectedRequest.wedding_bride_father}</p>
                        )}
                        {selectedRequest.wedding_bride_mother && (
                          <p className="text-sm text-gray-600">Mother: {selectedRequest.wedding_bride_mother}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedRequest.wedding_preferred_date && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Preferred Date</label>
                      <p className="text-gray-900">{new Date(selectedRequest.wedding_preferred_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </>
              )}

              {selectedRequest.sacrament_type === 'funeral' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Deceased</label>
                    <p className="text-gray-900">{selectedRequest.funeral_deceased_name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.funeral_deceased_dob} - {selectedRequest.funeral_deceased_dod}
                    </p>
                  </div>
                  {selectedRequest.funeral_relationship && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Relationship</label>
                      <p className="text-gray-900">{selectedRequest.funeral_relationship}</p>
                    </div>
                  )}
                </>
              )}

              {selectedRequest.additional_notes && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Notes</label>
                  <p className="text-gray-900">{selectedRequest.additional_notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'under_review')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Review
                </button>
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Approve
                </button>
              </div>
              
              {selectedRequest.status === 'approved' && (
                <div className="space-y-2">
                  <input
                    type="datetime-local"
                    id={`schedule-${selectedRequest.id}`}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    id={`location-${selectedRequest.id}`}
                    placeholder="Location"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      const date = (document.getElementById(`schedule-${selectedRequest.id}`) as HTMLInputElement).value
                      const location = (document.getElementById(`location-${selectedRequest.id}`) as HTMLInputElement).value
                      if (date && location) scheduleRequest(selectedRequest.id, date, location)
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    Schedule
                  </button>
                </div>
              )}

              <button
                onClick={() => updateStatus(selectedRequest.id, 'completed')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Mark Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClergySacramentsDashboard
