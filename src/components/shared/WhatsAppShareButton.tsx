import { Share2 } from 'lucide-react'
import { shareViaWhatsApp } from '@/lib/whatsapp'

interface WhatsAppShareButtonProps {
  text: string
  url?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WhatsAppShareButton({ text, url, className = '', size = 'md' }: WhatsAppShareButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <button
      onClick={() => shareViaWhatsApp(text, url)}
      className={`flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${sizeClasses[size]} ${className}`}
    >
      <Share2 className={iconSizes[size]} />
      Share via WhatsApp
    </button>
  )
}
