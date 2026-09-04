import { useState, useEffect } from 'react'
import { Church, CheckCircle, XCircle, AlertTriangle, CalendarPlus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SacramentRequest, SacramentRequestStatus } from '@/types/sacrament'

/**
 * Which statuses a request may move to next. Without this the dashboard offered
 * "Review" and "Approve" on every request regardless of state, so an already
 * approved request still showed the Approve button.
 */
const NEXT_STATUSES: Record<SacramentRequestStatus, SacramentRequestStatus[]> = {
  pending: ['under_review', 'approved', 'rejected'],
  under_review: ['approved', 'rejected'],
  approved: ['completed', 'rejected'], // plus "schedule", handled separately
  scheduled: ['completed'],
  completed: [],
  rejected: ['under_review'], // allow reopening a rejection
}

const STATUS_STYLE: Record<SacramentRequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  scheduled: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-200 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
}

const ACTION_LABEL: Record<SacramentRequestStatus, string> = {
  pending: 'Reopen as pending',
  under_review: 'Start review',
  approved: 'Approve',
  scheduled: 'Schedule',
  completed: 'Mark complete',
  rejected: 'Decline',
}

const ACTION_STYLE: Record<SacramentRequestStatus, string> = {
  pending: 'bg-yellow-600 hover:bg-yellow-700',
  under_review: 'bg-blue-600 hover:bg-blue-700',
  approved: 'bg-green-600 hover:bg-green-700',
  scheduled: 'bg-purple-600 hover:bg-purple-700',
  completed: 'bg-gray-600 hover:bg-gray-700',
  rejected: 'bg-red-600 hover:bg-red-700',
}

/** Events use a NOT NULL `category` enum; sacraments sit closest to 'service'. */
const SACRAMENT_EVENT_CATEGORY = 'service'

/**
 * Format a stored timestamp for an <input type="datetime-local">, which expects
 * local wall-clock time. Slicing the ISO string would show the UTC time and
 * shift the service by the timezone offset on every save.
 */
function toDatetimeLocal(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function ClergySacramentsDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SacramentRequest[]>([])
  const [filter, setFilter] = useState<SacramentRequestStatus | 'all'>('pending')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleLocation, setScheduleLocation] = useState('')

  useEffect(() => {
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // Derive the selected request from the list, so it can never show stale
  // status after a reload.
  const selectedRequest = requests.find(r => r.id === selectedId) ?? null

  useEffect(() => {
    setScheduleDate(toDatetimeLocal(selectedRequest?.scheduled_date))
    setScheduleLocation(selectedRequest?.scheduled_location ?? '')
  }, [selectedId, selectedRequest?.scheduled_date, selectedRequest?.scheduled_location])

  async function loadRequests() {
    setLoading(true)
    let query = supabase
      .from('sacrament_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error: loadError } = await query
    if (loadError) {
      setError(`Could not load requests: ${loadError.message}`)
      setRequests([])
    } else {
      setError(null)
      setRequests(data || [])
    }
    setLoading(false)
  }

  async function logActivity(requestId: string, action: string) {
    // Best-effort audit trail: never block the status change on it.
    const { error: logError } = await supabase.from('sacrament_request_activity').insert({
      request_id: requestId,
      user_id: user?.id,
      action,
    })
    if (logError) console.error('Activity log failed:', logError.message)
  }

  async function updateStatus(id: string, status: SacramentRequestStatus) {
    setSaving(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('sacrament_requests')
      .update({ status, assigned_clergy_id: user?.id, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (updateError) {
      setError(`Could not update the request: ${updateError.message}`)
      setSaving(false)
      return
    }
    // RLS denials come back as a successful 0-row update, not an error.
    if (!data || data.length === 0) {
      setError('The update did not apply — your account may not have clergy permission on this request.')
      setSaving(false)
      return
    }

    await logActivity(id, `Status changed to ${status}`)
    setNotice(`Request marked "${status.replace('_', ' ')}".`)
    setSaving(false)
    await loadRequests()
  }

  async function scheduleRequest(request: SacramentRequest) {
    if (!scheduleDate || !scheduleLocation.trim()) {
      setError('Pick a date/time and enter a location before scheduling.')
      return
    }

    setSaving(true)
    setError(null)

    const isoDate = new Date(scheduleDate).toISOString()

    const { data, error: updateError } = await supabase
      .from('sacrament_requests')
      .update({
        status: 'scheduled',
        scheduled_date: isoDate,
        scheduled_location: scheduleLocation.trim(),
        assigned_clergy_id: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', request.id)
      .select()

    if (updateError) {
      setError(`Could not schedule the request: ${updateError.message}`)
      setSaving(false)
      return
    }
    if (!data || data.length === 0) {
      setError('Scheduling did not apply — your account may not have clergy permission on this request.')
      setSaving(false)
      return
    }

    await logActivity(request.id, `Scheduled for ${new Date(isoDate).toLocaleString()} at ${scheduleLocation.trim()}`)

    // Mirror it onto the parish calendar. The previous version wrote
    // `event_date` and `event_type`, neither of which exists on `events` — the
    // insert failed every time and the error was never checked, so scheduling a
    // sacrament silently created no calendar entry.
    const title = `${request.sacrament_type.charAt(0).toUpperCase()}${request.sacrament_type.slice(1)} — ${request.full_name}`
    const { error: eventError } = await supabase.from('events').insert({
      title,
      description: `${request.sacrament_type} service for ${request.full_name}.`,
      category: SACRAMENT_EVENT_CATEGORY,
      location: scheduleLocation.trim(),
      start_datetime: isoDate,
      is_published: true,
      rsvp_enabled: false,
      created_by: user?.id,
    })

    setNotice(
      eventError
        ? `Request scheduled, but the calendar entry failed: ${eventError.message}`
        : 'Request scheduled and added to the parish calendar.',
    )
    setSaving(false)
    await loadRequests()
  }

  const filters: (SacramentRequestStatus | 'all')[] = [
    'all', 'pending', 'under_review', 'approved', 'scheduled', 'completed', 'rejected',
  ]

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Church className="w-8 h-8 text-navy" />
        <h1 className="text-3xl font-playfair text-navy">Sacrament Requests</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-600 text-sm underline">Dismiss</button>
        </div>
      )}
      {notice && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm flex-1">{notice}</p>
          <button onClick={() => setNotice(null)} className="text-green-700 text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize ${
              filter === f ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow text-gray-500">
          No {filter === 'all' ? '' : filter.replace('_', ' ')} requests.
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {requests.map(request => (
            <div
              key={request.id}
              onClick={() => setSelectedId(request.id)}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition ${
                selectedId === request.id ? 'ring-2 ring-navy' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div>
                  <h3 className="font-semibold text-navy capitalize">{request.sacrament_type}</h3>
                  <p className="text-xs text-gray-500">{new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded capitalize ${STATUS_STYLE[request.status]}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{request.full_name}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        {selectedRequest && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4 lg:sticky lg:top-4 self-start">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-navy capitalize">{selectedRequest.sacrament_type} Request</h2>
                <p className="text-sm text-gray-500">Submitted {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm capitalize ${STATUS_STYLE[selectedRequest.status]}`}>
                {selectedRequest.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Requester</label>
                <p className="text-gray-900">{selectedRequest.full_name}</p>
                {selectedRequest.email && <p className="text-sm text-gray-600">{selectedRequest.email}</p>}
                {selectedRequest.phone && <p className="text-sm text-gray-600">{selectedRequest.phone}</p>}
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

              {selectedRequest.sacrament_type === 'confirmation' && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Candidate</label>
                  <p className="text-gray-900">{selectedRequest.confirmation_candidate_name}</p>
                  {selectedRequest.confirmation_candidate_dob && (
                    <p className="text-sm text-gray-600">DOB: {selectedRequest.confirmation_candidate_dob}</p>
                  )}
                  {selectedRequest.confirmation_baptism_parish && (
                    <p className="text-sm text-gray-600">
                      Baptised at {selectedRequest.confirmation_baptism_parish}
                      {selectedRequest.confirmation_baptism_date && ` on ${selectedRequest.confirmation_baptism_date}`}
                    </p>
                  )}
                  {selectedRequest.confirmation_sponsor_name && (
                    <p className="text-sm text-gray-600">Sponsor: {selectedRequest.confirmation_sponsor_name}</p>
                  )}
                </div>
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

              {selectedRequest.scheduled_date && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <label className="text-xs font-semibold text-purple-700 uppercase">Scheduled</label>
                  <p className="text-purple-900">{new Date(selectedRequest.scheduled_date).toLocaleString()}</p>
                  {selectedRequest.scheduled_location && (
                    <p className="text-sm text-purple-800">{selectedRequest.scheduled_location}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions — only the transitions valid from the current status */}
            <div className="border-t pt-4 space-y-3">
              {NEXT_STATUSES[selectedRequest.status].length === 0 && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  This request is complete. No further action needed.
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {NEXT_STATUSES[selectedRequest.status].map(next => (
                  <button
                    key={next}
                    onClick={() => updateStatus(selectedRequest.id, next)}
                    disabled={saving}
                    className={`flex-1 min-w-[120px] px-4 py-2 text-white rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-2 ${ACTION_STYLE[next]}`}
                  >
                    {next === 'rejected' && <XCircle className="w-4 h-4" />}
                    {ACTION_LABEL[next]}
                  </button>
                ))}
              </div>

              {/* Scheduling is only meaningful once the request is approved. */}
              {(selectedRequest.status === 'approved' || selectedRequest.status === 'scheduled') && (
                <div className="space-y-2 border-t pt-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    {selectedRequest.status === 'scheduled' ? 'Reschedule' : 'Schedule service'}
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={scheduleLocation}
                    onChange={e => setScheduleLocation(e.target.value)}
                    placeholder="Location (e.g. Main Church)"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => scheduleRequest(selectedRequest)}
                    disabled={saving || !scheduleDate || !scheduleLocation.trim()}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4" />}
                    {selectedRequest.status === 'scheduled' ? 'Update schedule' : 'Schedule & add to calendar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClergySacramentsDashboard
