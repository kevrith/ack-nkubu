import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Church, Upload, Calendar, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SacramentType } from '@/types/sacrament'
import { MediaUploader } from '@/components/shared/MediaUploader'

export function SacramentRequestPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState<SacramentType>('baptism')
  const [loading, setLoading] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [documents, setDocuments] = useState<string[]>([])

  const [formData, setFormData] = useState({
    full_name: user?.profile.full_name || '',
    phone: user?.profile.phone || '',
    email: user?.email || '',
    
    baptism_candidate_name: '',
    baptism_candidate_dob: '',
    baptism_parent_names: '',
    baptism_godparents: '',
    
    wedding_groom_name: '',
    wedding_groom_dob: '',
    wedding_bride_name: '',
    wedding_bride_dob: '',
    wedding_preferred_date: '',
    wedding_venue_preference: '',
    
    funeral_deceased_name: '',
    funeral_deceased_dob: '',
    funeral_deceased_dod: '',
    funeral_relationship: '',
    funeral_preferred_date: '',
    funeral_venue_preference: '',
    
    additional_notes: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('sacrament_requests')
      .insert({
        user_id: user.id,
        sacrament_type: type,
        ...formData,
        documents: documents.map(url => ({ url }))
      })
      .select()
      .single()

    if (!error && data) {
      await supabase.from('sacrament_request_activity').insert({
        request_id: data.id,
        user_id: user.id,
        action: 'Request submitted'
      })
      navigate('/sacraments')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Church className="w-8 h-8 text-navy" />
        <h1 className="text-3xl font-playfair text-navy">Sacrament Request</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['baptism', 'wedding', 'funeral'] as SacramentType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-4 rounded-lg border-2 capitalize ${
                    type === t ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
              />
            </div>
          </div>

          {/* Baptism Fields */}
          {type === 'baptism' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-navy">Baptism Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
                  <input
                    type="text"
                    value={formData.baptism_candidate_name}
                    onChange={e => setFormData({...formData, baptism_candidate_name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.baptism_candidate_dob}
                    onChange={e => setFormData({...formData, baptism_candidate_dob: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Names</label>
                <input
                  type="text"
                  value={formData.baptism_parent_names}
                  onChange={e => setFormData({...formData, baptism_parent_names: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Godparents</label>
                <input
                  type="text"
                  value={formData.baptism_godparents}
                  onChange={e => setFormData({...formData, baptism_godparents: e.target.value})}
                  placeholder="Names of godparents"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
          )}

          {/* Wedding Fields */}
          {type === 'wedding' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-navy">Wedding Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Groom Name</label>
                  <input
                    type="text"
                    value={formData.wedding_groom_name}
                    onChange={e => setFormData({...formData, wedding_groom_name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Groom DOB</label>
                  <input
                    type="date"
                    value={formData.wedding_groom_dob}
                    onChange={e => setFormData({...formData, wedding_groom_dob: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bride Name</label>
                  <input
                    type="text"
                    value={formData.wedding_bride_name}
                    onChange={e => setFormData({...formData, wedding_bride_name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bride DOB</label>
                  <input
                    type="date"
                    value={formData.wedding_bride_dob}
                    onChange={e => setFormData({...formData, wedding_bride_dob: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.wedding_preferred_date}
                    onChange={e => setFormData({...formData, wedding_preferred_date: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Preference</label>
                  <input
                    type="text"
                    value={formData.wedding_venue_preference}
                    onChange={e => setFormData({...formData, wedding_venue_preference: e.target.value})}
                    placeholder="Main Church / Other"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Funeral Fields */}
          {type === 'funeral' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-navy">Funeral Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deceased Name</label>
                  <input
                    type="text"
                    value={formData.funeral_deceased_name}
                    onChange={e => setFormData({...formData, funeral_deceased_name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.funeral_deceased_dob}
                    onChange={e => setFormData({...formData, funeral_deceased_dob: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Death</label>
                  <input
                    type="date"
                    value={formData.funeral_deceased_dod}
                    onChange={e => setFormData({...formData, funeral_deceased_dod: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Relationship</label>
                  <input
                    type="text"
                    value={formData.funeral_relationship}
                    onChange={e => setFormData({...formData, funeral_relationship: e.target.value})}
                    placeholder="e.g., Son, Daughter, Spouse"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.funeral_preferred_date}
                    onChange={e => setFormData({...formData, funeral_preferred_date: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Preference</label>
                  <input
                    type="text"
                    value={formData.funeral_venue_preference}
                    onChange={e => setFormData({...formData, funeral_venue_preference: e.target.value})}
                    placeholder="Main Church / Home / Other"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
            <p className="text-xs text-gray-500 mb-3">Upload birth certificates, IDs, or other required documents</p>
            {documents.length > 0 && (
              <div className="mb-3 space-y-2">
                {documents.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{url.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
            {showUploader && (
              <div className="mt-3">
                <MediaUploader
                  accept="image/*,application/pdf"
                  resourceType="auto"
                  onUploadComplete={(url) => {
                    setDocuments([...documents, url])
                    setShowUploader(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.additional_notes}
              onChange={e => setFormData({...formData, additional_notes: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-3 rounded-lg hover:bg-navy-600 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
