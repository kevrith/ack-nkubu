export type GivingCategory = 'tithe' | 'offering' | 'harambee' | 'building_fund' | 'missions' | 'welfare' | 'other'

export interface GivingRecord {
  id: string
  donor_id?: string
  amount_kes: number
  category: GivingCategory
  description?: string
  is_anonymous: boolean
  receipt_number?: string
  giving_date: string
  created_at: string
}

export interface MpesaTransaction {
  id: string
  giving_record_id?: string
  phone_number: string
  amount_kes: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  mpesa_receipt_number?: string
  created_at: string
}
