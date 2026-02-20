export type SacramentType = 'baptism' | 'wedding' | 'funeral'

export type SacramentRequestStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'scheduled' 
  | 'completed' 
  | 'rejected'

export interface SacramentRequest {
  id: string
  user_id: string
  sacrament_type: SacramentType
  status: SacramentRequestStatus
  
  // Common fields
  full_name: string
  phone?: string
  email?: string
  
  // Baptism specific
  baptism_candidate_name?: string
  baptism_candidate_dob?: string
  baptism_parent_names?: string
  baptism_godparents?: string
  
  // Wedding specific
  wedding_groom_name?: string
  wedding_groom_dob?: string
  wedding_bride_name?: string
  wedding_bride_dob?: string
  wedding_preferred_date?: string
  wedding_venue_preference?: string
  
  // Funeral specific
  funeral_deceased_name?: string
  funeral_deceased_dob?: string
  funeral_deceased_dod?: string
  funeral_relationship?: string
  funeral_preferred_date?: string
  funeral_venue_preference?: string
  
  // Additional info
  additional_notes?: string
  documents?: any[]
  
  // Clergy processing
  assigned_clergy_id?: string
  clergy_notes?: string
  scheduled_date?: string
  scheduled_location?: string
  
  created_at: string
  updated_at: string
}

export interface SacramentDocument {
  id: string
  request_id: string
  document_type: string
  document_url: string
  file_name: string
  uploaded_by: string
  uploaded_at: string
}

export interface SacramentActivity {
  id: string
  request_id: string
  user_id: string
  action: string
  notes?: string
  created_at: string
}
