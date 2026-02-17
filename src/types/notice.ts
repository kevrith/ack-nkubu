export type NoticeCategory = 'general' | 'urgent' | 'youth' | 'women' | 'men' | 'choir' | 'ushers'

export interface Notice {
  id: string
  title: string
  content: string
  category: NoticeCategory
  is_urgent: boolean
  is_published: boolean
  publish_date?: string
  expiry_date?: string
  attachment_url?: string
  created_by?: string
  created_at: string
}

export type EventCategory = 'service' | 'fellowship' | 'conference' | 'retreat' | 'youth' | 'outreach' | 'committee'

export interface Event {
  id: string
  title: string
  description?: string
  category: EventCategory
  location?: string
  maps_url?: string
  start_datetime: string
  end_datetime?: string
  cover_image_url?: string
  max_attendees?: number
  rsvp_enabled: boolean
  is_published: boolean
  created_by?: string
  created_at: string
  rsvp_count?: number
}

export interface EventRSVP {
  id: string
  event_id: string
  user_id: string
  status: 'attending' | 'maybe' | 'not_attending'
  created_at: string
}
