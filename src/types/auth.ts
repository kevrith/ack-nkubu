export type UserRole = 'basic_member' | 'leader' | 'clergy' | 'admin'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  cell_group: string | null
  membership_number: string | null
  date_joined: string | null
  is_active: boolean
  notification_token: string | null
  preferred_bible_version: BibleVersion
  created_at: string
  updated_at: string
}

export type BibleVersion = 'NIV' | 'NLT' | 'KJV' | 'NRSV' | 'NKJV'

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}
