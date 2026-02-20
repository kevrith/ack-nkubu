import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      {user && <DesktopSidebar />}
      <main className={`${
        user ? 'md:ml-64' : ''
      } pt-2 sm:pt-4 pb-20 sm:pb-24 md:pb-8 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)]`}>
        {children}
      </main>
      {user && <MobileNav />}
    </div>
  )
}
