export type PastoralCareType = 'prayer' | 'counselling' | 'hospital_visit' | 'home_visit' | 'bereavement' | 'marriage' | 'other'
export type PastoralCareStatus = 'pending' | 'acknowledged' | 'in_progress' | 'completed'

export interface PastoralCareRequest {
  id: string
  requester_id: string
  type: PastoralCareType
  details: string
  is_confidential: boolean
  preferred_date?: string
  preferred_time?: string
  contact_phone?: string
  status: PastoralCareStatus
  assigned_clergy_id?: string
  clergy_notes?: string
  completed_at?: string
  created_at: string
  updated_at: string
}
