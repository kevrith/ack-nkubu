import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Church, Clock, CheckCircle, XCircle, Calendar, ArrowLeft } from 'lucide-react'
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

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  )
}

export function SacramentDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [request, setRequest] = useState<SacramentRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && user) loadRequest()
  }, [id, user])

  async function loadRequest() {
    const { data } = await supabase
      .from('sacrament_requests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user!.id)
      .single()
    setRequest(data)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!request) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Request not found.</p>
      <Link to="/sacraments" className="text-navy hover:underline mt-2 inline-block">← Back to requests</Link>
    </div>
  )

  const Icon = STATUS_ICONS[request.status]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/sacraments" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-navy" />
        </Link>
        <div className="flex items-center gap-3">
          <Church className="w-7 h-7 text-navy" />
          <h1 className="text-2xl font-playfair text-navy capitalize">{request.sacrament_type} Request</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Submitted {new Date(request.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[request.status]}`}>
            <Icon className="w-4 h-4" />
            {request.status.replace('_', ' ')}
          </span>
        </div>

        <dl className="space-y-4">
          <Field label="Contact Name" value={request.full_name} />
          <Field label="Phone" value={request.phone} />
          <Field label="Email" value={request.email} />

          {request.sacrament_type === 'baptism' && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-navy mb-3">Baptism Details</p>
              </div>
              <Field label="Candidate Name" value={request.baptism_candidate_name} />
              <Field label="Date of Birth" value={request.baptism_candidate_dob} />
              <Field label="Father's Name" value={request.baptism_father_name} />
              <Field label="Mother's Name" value={request.baptism_mother_name} />
              <Field label="Godparent 1" value={request.baptism_godparent1} />
              <Field label="Godparent 2" value={request.baptism_godparent2} />
            </>
          )}

          {request.sacrament_type === 'wedding' && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-navy mb-3">Wedding Details</p>
              </div>
              <Field label="Groom's Name" value={request.wedding_groom_name} />
              <Field label="Groom's Date of Birth" value={request.wedding_groom_dob} />
              <Field label="Bride's Name" value={request.wedding_bride_name} />
              <Field label="Bride's Date of Birth" value={request.wedding_bride_dob} />
              <Field label="Preferred Date" value={request.wedding_preferred_date} />
              <Field label="Venue Preference" value={request.wedding_venue_preference} />
            </>
          )}

          {request.sacrament_type === 'funeral' && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-navy mb-3">Funeral Details</p>
              </div>
              <Field label="Deceased Name" value={request.funeral_deceased_name} />
              <Field label="Date of Birth" value={request.funeral_deceased_dob} />
              <Field label="Date of Death" value={request.funeral_deceased_dod} />
              <Field label="Your Relationship" value={request.funeral_relationship} />
              <Field label="Preferred Date" value={request.funeral_preferred_date} />
              <Field label="Venue Preference" value={request.funeral_venue_preference} />
            </>
          )}

          {request.additional_notes && (
            <>
              <div className="border-t pt-4" />
              <Field label="Additional Notes" value={request.additional_notes} />
            </>
          )}

          {(request.scheduled_date || request.scheduled_location || request.clergy_notes) && (
            <div className="border-t pt-4 bg-purple-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-purple-800">Church Response</p>
              {request.scheduled_date && (
                <div className="flex items-center gap-2 text-purple-700 text-sm">
                  <Calendar className="w-4 h-4" />
                  Scheduled: {new Date(request.scheduled_date).toLocaleString()}
                </div>
              )}
              {request.scheduled_location && <Field label="Location" value={request.scheduled_location} />}
              {request.clergy_notes && <Field label="Clergy Notes" value={request.clergy_notes} />}
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
