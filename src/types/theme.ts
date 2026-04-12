export type ThemeType = 'diocesan' | 'church'

export interface Theme {
  id: string
  title: string
  content: string
  scripture?: string
  type: ThemeType
  image_url?: string
  is_published: boolean
  year: number
  created_by?: string
  created_at: string
  updated_at: string
  author?: {
    full_name: string
    avatar_url?: string
  }
}
