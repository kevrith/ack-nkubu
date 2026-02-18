import jsPDF from 'jspdf'
import { formatKES, formatDate } from './utils'

interface GivingRecord {
  id: string
  category: string
  amount_kes: number | string
  giving_date: string
  receipt_number?: string
  is_anonymous?: boolean
}

interface StatementOptions {
  fullName: string
  email: string
  year: number
  records: GivingRecord[]
}

export async function downloadGivingStatement(opts: StatementOptions): Promise<void> {
  const { fullName, email, year, records } = opts
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const margin = 20

  // ---- Header banner ----
  doc.setFillColor(26, 58, 92) // navy
  doc.rect(0, 0, w, 40, 'F')

  doc.setTextColor(201, 168, 76) // gold
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('ACK St Francis Nkubu Parish', margin, 15)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(220, 220, 220)
  doc.text('Annual Giving Statement', margin, 25)
  doc.text(`Financial Year: ${year}`, margin, 33)

  // ---- Member info ----
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Member Details', margin, 55)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name:  ${fullName}`, margin, 63)
  doc.text(`Email: ${email}`, margin, 70)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, 77)

  // ---- Table header ----
  const tableTop = 90
  const cols = { date: margin, category: 50, receipt: 110, amount: 165 }

  doc.setFillColor(26, 58, 92)
  doc.rect(margin - 2, tableTop - 6, w - (margin - 2) * 2, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Date', cols.date, tableTop)
  doc.text('Category', cols.category, tableTop)
  doc.text('Receipt', cols.receipt, tableTop)
  doc.text('Amount (KES)', cols.amount, tableTop)

  // ---- Rows ----
  let y = tableTop + 8
  let total = 0
  let rowNum = 0

  doc.setTextColor(40, 40, 40)
  doc.setFont('helvetica', 'normal')

  for (const rec of records) {
    if (y > 265) {
      doc.addPage()
      y = 20
    }

    const amount = parseFloat(rec.amount_kes.toString())
    total += amount

    // Alternating row shading
    if (rowNum % 2 === 0) {
      doc.setFillColor(248, 248, 248)
      doc.rect(margin - 2, y - 5, w - (margin - 2) * 2, 7, 'F')
    }

    doc.setFontSize(9)
    doc.text(formatDate(rec.giving_date), cols.date, y)
    doc.text(rec.category.replace(/_/g, ' '), cols.category, y)
    doc.text(rec.receipt_number || '—', cols.receipt, y)
    doc.text(formatKES(amount), cols.amount, y)

    y += 8
    rowNum++
  }

  // ---- Total row ----
  y += 4
  doc.setFillColor(201, 168, 76) // gold
  doc.rect(margin - 2, y - 6, w - (margin - 2) * 2, 9, 'F')
  doc.setTextColor(26, 58, 92)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('TOTAL', cols.date, y)
  doc.text(formatKES(total), cols.amount, y)

  // ---- Footer ----
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.setFont('helvetica', 'normal')
    doc.text(
      'This is an official giving record from ACK St Francis Nkubu Parish. Keep for your records.',
      margin, 290
    )
    doc.text(`Page ${i} of ${pageCount}`, w - margin - 20, 290)
  }

  doc.save(`ACK_Giving_Statement_${year}_${fullName.replace(/\s+/g, '_')}.pdf`)
}

export async function exportChartAsPNG(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas')
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn(`Element #${elementId} not found`)
    return
  }
  const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function exportChartAsPDF(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas')
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pdfW = pdf.internal.pageSize.getWidth()
  const pdfH = (canvas.height * pdfW) / canvas.width
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
  pdf.save(`${filename}.pdf`)
}
