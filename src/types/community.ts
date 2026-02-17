export interface CommunityPost {
  id: string
  author_id: string
  author?: { full_name: string; avatar_url?: string; cell_group?: string }
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  is_pinned: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  author?: { full_name: string; avatar_url?: string }
  content: string
  created_at: string
}
