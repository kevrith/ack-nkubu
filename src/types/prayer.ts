export type PrayerCategory = 'morning' | 'evening' | 'intercessory' | 'liturgical' | 'special'

export interface Prayer {
  id: string
  title: string
  content: string
  category: PrayerCategory
  liturgical_season?: string
  is_featured: boolean
  created_by?: string
  created_at: string
}

export interface PrayerRequest {
  id: string
  requester_id: string
  requester_name?: string
  request: string
  is_anonymous: boolean
  is_public: boolean
  prayer_count: number
  status: string
  clergy_note?: string
  created_at: string
  updated_at: string
}
