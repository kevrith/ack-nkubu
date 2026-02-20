export type PledgeFrequency = 'one-time' | 'weekly' | 'monthly' | 'quarterly'

export interface PledgeCampaign {
  id: string
  title: string
  description?: string
  goal_amount: number
  start_date: string
  end_date: string
  image_url?: string
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Pledge {
  id: string
  campaign_id: string
  user_id: string
  pledge_amount: number
  frequency: PledgeFrequency
  start_date: string
  end_date?: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface PledgePayment {
  id: string
  pledge_id: string
  user_id: string
  amount: number
  payment_date: string
  payment_method?: string
  transaction_id?: string
  notes?: string
  created_at: string
}

export interface CampaignProgress {
  total_pledged: number
  total_paid: number
  pledge_count: number
  donor_count: number
}
