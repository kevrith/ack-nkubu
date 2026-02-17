export type SermonType = 'audio' | 'video' | 'text'

export interface Sermon {
  id: string
  title: string
  description?: string
  scripture_reference?: string
  sermon_date: string
  preacher_id?: string
  preacher?: { full_name: string }
  series_id?: string
  type: SermonType
  media_url?: string
  media_duration?: number
  thumbnail_url?: string
  pdf_url?: string
  view_count: number
  is_published: boolean
  created_at: string
}

export interface SermonSeries {
  id: string
  title: string
  description?: string
  cover_image_url?: string
  sermon_count?: number
}
