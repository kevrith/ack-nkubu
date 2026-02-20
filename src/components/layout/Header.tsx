import { Bell, User, Cross } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { DarkModeToggle } from '@/components/shared/DarkModeToggle'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-navy dark:bg-gray-800 text-white shadow-lg transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2">
          <img src="/MERU.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="font-playfair text-xl font-bold hidden sm:inline">ACK St Francis Nkubu</span>
        </Link>

        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {user ? (
            <>
              <Link to="/notifications" className="relative p-2 hover:bg-navy-600 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
              </Link>
              
              <Link to="/profile" className="flex items-center gap-2 hover:bg-navy-600 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                {user.profile.avatar_url ? (
                  <img src={user.profile.avatar_url} alt={user.profile.full_name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-navy" />
                  </div>
                )}
                <span className="hidden md:inline text-sm">{user.profile.full_name}</span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-gold text-navy rounded-lg font-medium hover:bg-gold-400 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
