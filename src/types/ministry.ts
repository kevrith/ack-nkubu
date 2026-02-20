export interface Ministry {
  id: string
  name: string
  description?: string
  category: 'fellowship' | 'service' | 'worship' | 'education' | 'outreach'
  leader_id?: string
  assistant_leader_id?: string
  meeting_day?: string
  meeting_time?: string
  location?: string
  is_active: boolean
  created_at: string
  updated_at: string
  leader?: {
    full_name: string
    avatar_url?: string
    phone?: string
  }
  assistant_leader?: {
    full_name: string
    avatar_url?: string
  }
  member_count?: number
}

export interface MinistryMember {
  id: string
  ministry_id: string
  member_id: string
  role: 'member' | 'coordinator' | 'secretary'
  joined_at: string
  is_active: boolean
  member?: {
    full_name: string
    avatar_url?: string
    phone?: string
  }
}

export interface MinistryEvent {
  id: string
  ministry_id: string
  title: string
  description?: string
  event_date: string
  start_time?: string
  end_time?: string
  location?: string
  created_by: string
  created_at: string
}

export interface MinistryAnnouncement {
  id: string
  ministry_id: string
  title: string
  content: string
  created_by: string
  created_at: string
  author?: {
    full_name: string
    avatar_url?: string
  }
}
