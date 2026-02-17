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
      <main className={`${user ? 'md:ml-64' : ''} pt-4 pb-24 md:pb-8 px-4 max-w-5xl mx-auto`}>
        {children}
      </main>
      {user && <MobileNav />}
    </div>
  )
}
