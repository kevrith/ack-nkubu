import { useState, useEffect } from 'react'
import { Download, X, Check } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      const dismissedTime = localStorage.getItem('pwa-install-dismissed-time')
      
      // Show again after 7 days
      if (dismissed && dismissedTime) {
        const daysSince = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
        if (daysSince < 7) return
      }
      
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
    })
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    
    setIsInstalling(true)
    deferredPrompt.prompt()
    
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowPrompt(false)
      localStorage.removeItem('pwa-install-dismissed')
      localStorage.removeItem('pwa-install-dismissed-time')
    }
    
    setIsInstalling(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString())
  }

  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl p-4 border-2 border-navy z-50">
      <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
          {isInstalling ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-navy mb-1">Install ACK St Francis Nkubu App</h3>
          <p className="text-sm text-gray-600 mb-3">Get quick access and offline features</p>
          <button 
            onClick={handleInstall} 
            disabled={isInstalling}
            className="w-full px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInstalling ? 'Installing...' : 'Install Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
