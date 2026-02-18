import { useEffect, useState } from 'react'
import { DesktopLanding } from './DesktopLanding'
import { MobileLanding } from './MobileLanding'

export function LandingPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Force desktop for testing - remove this line later
  return <DesktopLanding />
}
