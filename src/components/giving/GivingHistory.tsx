import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Download, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { GivingRecord } from '@/types/giving'
import { formatKES, formatDate } from '@/lib/utils'
import { downloadGivingStatement } from '@/lib/pdfExport'

const CURRENT_YEAR = new Date().getFullYear()

export function GivingHistory() {
  const { user } = useAuth()
  const [records, setRecords] = useState<GivingRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [year, setYear] = useState(CURRENT_YEAR)

  useEffect(() => {
    if (user) fetchHistory()
  }, [user, year])

  async function fetchHistory() {
    if (!user) return
    const start = new Date(year, 0, 1).toISOString()
    const end = new Date(year + 1, 0, 1).toISOString()

    const { data } = await supabase
      .from('giving_records')
      .select('*')
      .eq('donor_id', user.id)
      .gte('giving_date', start)
      .lt('giving_date', end)
      .order('giving_date', { ascending: false })

    setRecords(data || [])
    setTotal(data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0)
    setLoading(false)
  }

  async function handleDownload() {
    if (!user) return
    setExporting(true)
    try {
      await downloadGivingStatement({
        fullName: user.profile.full_name,
        email: user.email,
        year,
        records,
      })
    } finally {
      setExporting(false)
    }
  }

  if (!user) return null
  if (loading) return <div className="text-center py-8">Loading history...</div>

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-navy text-white rounded-lg p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-gold mb-1">Total Given in {year}</div>
          <div className="text-3xl font-bold">{formatKES(total)}</div>
          <div className="text-xs text-navy-200 mt-1">{records.length} transactions</div>
        </div>
        <button
          onClick={handleDownload}
          disabled={exporting || records.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg font-medium text-sm hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <><FileText className="w-4 h-4 animate-pulse" /> Generating…</>
          ) : (
            <><Download className="w-4 h-4" /> Statement PDF</>
          )}
        </button>
      </div>

      {/* Year selector */}
      <div className="flex gap-2">
        {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map((y) => (
          <button
            key={y}
            onClick={() => { setYear(y); setLoading(true) }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              year === y ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
          <p>No giving records for {year}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-navy capitalize">
                    {record.category.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(record.giving_date)}
                  </div>
                  {record.receipt_number && (
                    <div className="text-xs text-gray-400 mt-1">Receipt: {record.receipt_number}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-navy text-lg">
                    {formatKES(parseFloat(record.amount_kes.toString()))}
                  </div>
                  <div className="text-xs text-green-600 flex items-center gap-1 justify-end">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
