import { useEffect, useState } from 'react'
import { AppRouter } from './router'
import { OfflineIndicator } from './components/shared/OfflineIndicator'
import { PushNotifications } from './components/shared/PushNotifications'
import { InstallPrompt } from './components/shared/InstallPrompt'
import { OnboardingWizard } from './components/shared/OnboardingWizard'
import { useAuthStore } from './store/authStore'
import './styles/globals.css'

function App() {
  const { user, loading } = useAuthStore()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      const done = localStorage.getItem(`onboarding_done_${user.id}`)
      if (!done) {
        // Delay slightly to let the app settle after login
        const t = setTimeout(() => setShowOnboarding(true), 800)
        return () => clearTimeout(t)
      }
    }
  }, [user, loading])

  return (
    <>
      <OfflineIndicator />
      <PushNotifications />
      <InstallPrompt />
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
      <AppRouter />
    </>
  )
}

export default App
