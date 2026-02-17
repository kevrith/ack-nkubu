export interface PastorsCornerPost {
  id: string
  author_id: string
  author?: { full_name: string; avatar_url?: string }
  title: string
  content: string
  excerpt?: string
  cover_image_url?: string
  category: 'message' | 'devotional' | 'reflection' | 'announcement'
  is_published: boolean
  publish_date?: string
  created_at: string
  updated_at: string
}
