import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { supabase } from '@/lib/supabase'
import { formatKES } from '@/lib/utils'
import { Download, FileText, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react'
import { exportChartAsPNG, exportChartAsPDF } from '@/lib/pdfExport'

const COLORS = ['#1a3a5c', '#c9a84c', '#3d6da8', '#a8873a', '#5a83b5', '#82682b', '#9eb7d4']
const CURRENT_YEAR = new Date().getFullYear()

interface TopDonor { name: string; total: number }
interface CategoryTotal { name: string; value: number }
interface MonthlyTotal { month: string; amount: number }

export function GivingReportsPage() {
  const [year, setYear] = useState(CURRENT_YEAR)
  const [totalKes, setTotalKes] = useState(0)
  const [donorCount, setDonorCount] = useState(0)
  const [avgGift, setAvgGift] = useState(0)
  const [monthlyData, setMonthlyData] = useState<MonthlyTotal[]>([])
  const [categoryData, setCategoryData] = useState<CategoryTotal[]>([])
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadReports()
  }, [year])

  async function loadReports() {
    setLoading(true)
    const start = new Date(year, 0, 1).toISOString()
    const end = new Date(year + 1, 0, 1).toISOString()

    const { data: records } = await supabase
      .from('giving_records')
      .select('amount_kes, category, giving_date, donor_id, is_anonymous')
      .gte('giving_date', start)
      .lt('giving_date', end)

    if (!records) { setLoading(false); return }

    // KPI totals
    const total = records.reduce((s, r) => s + parseFloat(r.amount_kes), 0)
    const uniqueDonors = new Set(records.filter(r => !r.is_anonymous).map(r => r.donor_id)).size
    setTotalKes(total)
    setDonorCount(uniqueDonors)
    setAvgGift(records.length ? total / records.length : 0)

    // Monthly
    const byMonth: Record<string, number> = {}
    records.forEach(r => {
      const m = new Date(r.giving_date).toLocaleDateString('en-US', { month: 'short' })
      byMonth[m] = (byMonth[m] || 0) + parseFloat(r.amount_kes)
    })
    const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    setMonthlyData(
      MONTH_ORDER
        .filter(m => m in byMonth)
        .map(m => ({ month: m, amount: Math.round(byMonth[m]) }))
    )

    // Category
    const byCat: Record<string, number> = {}
    records.forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + parseFloat(r.amount_kes) })
    setCategoryData(
      Object.entries(byCat)
        .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
    )

    // Top 5 anonymous-excluded donors
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')

    const profileMap: Record<string, string> = {}
    profiles?.forEach(p => { profileMap[p.id] = p.full_name })

    const byDonor: Record<string, number> = {}
    records.filter(r => !r.is_anonymous && r.donor_id).forEach(r => {
      byDonor[r.donor_id] = (byDonor[r.donor_id] || 0) + parseFloat(r.amount_kes)
    })

    setTopDonors(
      Object.entries(byDonor)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, total]) => ({ name: profileMap[id] || 'Unknown', total: Math.round(total) }))
    )

    setLoading(false)
  }

  async function handleExportCSV() {
    const start = new Date(year, 0, 1).toISOString()
    const end = new Date(year + 1, 0, 1).toISOString()
    const { data } = await supabase
      .from('giving_records')
      .select('giving_date, category, amount_kes, receipt_number, is_anonymous')
      .gte('giving_date', start)
      .lt('giving_date', end)
      .order('giving_date', { ascending: false })

    if (!data) return
    const headers = ['Date', 'Category', 'Amount (KES)', 'Receipt', 'Anonymous']
    const rows = data.map(r => [
      new Date(r.giving_date).toLocaleDateString('en-GB'),
      r.category.replace(/_/g, ' '),
      r.amount_kes,
      r.receipt_number || '',
      r.is_anonymous ? 'Yes' : 'No',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ACK_Giving_Report_${year}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleExportPDF() {
    setExporting(true)
    await exportChartAsPDF('giving-charts', `ACK_Giving_Report_${year}`)
    setExporting(false)
  }

  async function handleExportPNG() {
    setExporting(true)
    await exportChartAsPNG('giving-charts', `ACK_Giving_Report_${year}`)
    setExporting(false)
  }

  if (loading) return <div className="text-center py-12">Loading reports...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Giving Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Financial overview — ACK St Francis Nkubu Parish</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  year === y ? 'bg-white text-navy shadow-sm' : 'text-gray-600'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> PNG
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy-600 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Given', value: formatKES(totalKes), icon: <DollarSign className="w-5 h-5" />, color: 'text-navy' },
          { label: 'Active Donors', value: donorCount.toString(), icon: <Users className="w-5 h-5" />, color: 'text-navy' },
          { label: 'Avg Gift', value: formatKES(avgGift), icon: <TrendingUp className="w-5 h-5" />, color: 'text-gold' },
          { label: 'Year', value: year.toString(), icon: <Calendar className="w-5 h-5" />, color: 'text-navy' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow p-5">
            <div className={`mb-2 ${color}`}>{icon}</div>
            <div className="text-2xl font-bold text-navy">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div id="giving-charts" className="grid md:grid-cols-2 gap-6">
        {/* Monthly trends */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" /> Monthly Giving (KES)
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatKES(Number(v ?? 0))} />
              <Bar dataKey="amount" fill="#c9a84c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-base font-semibold text-navy mb-4">Giving by Category</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatKES(Number(v ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-base font-semibold text-navy mb-4">Category Totals</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => formatKES(Number(v ?? 0))} />
              <Bar dataKey="value" fill="#1a3a5c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top donors (anonymised if needed) */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-base font-semibold text-navy mb-4">Top 5 Donors ({year})</h3>
          {topDonors.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No donor data available.</p>
          ) : (
            <div className="space-y-3">
              {topDonors.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm font-medium text-gray-800 truncate">{d.name}</span>
                      <span className="text-sm font-bold text-navy ml-2 whitespace-nowrap">{formatKES(d.total)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gold"
                        style={{ width: `${(d.total / (topDonors[0]?.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
