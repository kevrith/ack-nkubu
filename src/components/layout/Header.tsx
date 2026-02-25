import { Bell, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function Header() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
      setUnreadCount(count ?? 0)
    }

    fetchCount()

    // Live updates when notifications table changes for this user
    const channel = supabase
      .channel('header-unread-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        fetchCount,
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2">
          <img src="/MERU.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="font-playfair text-xl font-bold hidden sm:inline">ACK St Francis Nkubu</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/notifications" className="relative p-2 hover:bg-navy-600 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold rounded-full flex items-center justify-center text-navy text-[10px] font-bold px-0.5 leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="flex items-center gap-2 hover:bg-navy-600 px-3 py-2 rounded-lg transition-colors">
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
