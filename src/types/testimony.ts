export type TestimonyStatus = 'pending' | 'approved' | 'rejected'

export interface Testimony {
  id: string
  author_id: string
  title: string
  content: string
  category: 'answered_prayer' | 'healing' | 'provision' | 'salvation' | 'deliverance' | 'other'
  image_url?: string
  status: TestimonyStatus
  is_featured: boolean
  approved_by?: string
  approved_at?: string
  likes_count: number
  created_at: string
  updated_at: string
  author?: {
    full_name: string
    avatar_url?: string
  }
}

export interface TestimonyReaction {
  id: string
  testimony_id: string
  user_id: string
  reaction_type: 'amen' | 'praise' | 'pray'
  created_at: string
}

export interface CellGroup {
  id: string
  name: string
  description?: string
  leader_id: string
  assistant_leader_id?: string
  meeting_day?: string
  meeting_time?: string
  location?: string
  address?: string
  max_members: number
  is_active: boolean
  whatsapp_enabled?: boolean
  whatsapp_link?: string
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

export interface CellGroupMember {
  id: string
  cell_group_id: string
  member_id: string
  joined_at: string
  is_active: boolean
  member?: {
    full_name: string
    avatar_url?: string
    phone?: string
  }
}

export interface CellGroupMeeting {
  id: string
  cell_group_id: string
  meeting_date: string
  topic?: string
  notes?: string
  attendance_count: number
  created_by: string
  created_at: string
}

export interface CellGroupAttendance {
  id: string
  meeting_id: string
  member_id: string
  was_present: boolean
  notes?: string
  created_at: string
}

export interface CellGroupAnnouncement {
  id: string
  cell_group_id: string
  title: string
  content: string
  created_by: string
  created_at: string
  author?: {
    full_name: string
    avatar_url?: string
  }
}
