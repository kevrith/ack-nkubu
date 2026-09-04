import { useEffect } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'
import { useAuth } from '@/hooks/useAuth'
import { PushNotifications } from '@/components/shared/PushNotifications'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { primeNotificationSound } from '@/lib/notificationSound'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Browsers keep audio suspended until the user interacts; arm it early so the
  // first notification of the session is actually audible.
  useEffect(() => { primeNotificationSound() }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      {user && <DesktopSidebar />}
      <main className={`${
        user ? 'md:ml-64' : ''
      } pt-2 sm:pt-4 pb-20 sm:pb-24 md:pb-8 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)]`}>
        <ErrorBoundary inline>
          {children}
        </ErrorBoundary>
      </main>
      {user && <MobileNav />}
      {user && <PushNotifications />}
    </div>
  )
}
