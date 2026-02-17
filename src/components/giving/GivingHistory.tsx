import { useState, useEffect } from 'react'
import { Calendar, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { GivingRecord } from '@/types/giving'
import { formatKES, formatDate } from '@/lib/utils'

export function GivingHistory() {
  const { user } = useAuth()
  const [records, setRecords] = useState<GivingRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchHistory()
  }, [user])

  async function fetchHistory() {
    if (!user) return

    const { data } = await supabase
      .from('giving_records')
      .select('*')
      .eq('donor_id', user.id)
      .order('giving_date', { ascending: false })
      .limit(20)

    setRecords(data || [])
    setTotal(data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0)
    setLoading(false)
  }

  if (!user) return null

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-navy text-white rounded-lg p-6">
        <div className="text-sm text-gold mb-1">Total Given This Year</div>
        <div className="text-3xl font-bold">{formatKES(total)}</div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No giving history yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-navy capitalize">
                    {record.category.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(record.giving_date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-navy">{formatKES(parseFloat(record.amount_kes.toString()))}</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                </div>
              </div>
              {record.receipt_number && (
                <div className="text-xs text-gray-500">Receipt: {record.receipt_number}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
