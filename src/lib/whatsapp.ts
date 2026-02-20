export const shareViaWhatsApp = (text: string, url?: string) => {
  const message = url ? `${text}\n\n${url}` : text
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

export const shareToWhatsAppGroup = (groupLink: string) => {
  window.open(groupLink, '_blank')
}
