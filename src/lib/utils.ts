import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeKenyanPhone(phone: string): string | null {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '')
  
  if (/^\+254[17]\d{8}$/.test(cleaned)) return cleaned
  if (/^254[17]\d{8}$/.test(cleaned)) return `+${cleaned}`
  if (/^0[17]\d{8}$/.test(cleaned)) return `+254${cleaned.slice(1)}`
  
  return null
}

export function isValidKenyanPhone(phone: string): boolean {
  return normalizeKenyanPhone(phone) !== null
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-KE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}
