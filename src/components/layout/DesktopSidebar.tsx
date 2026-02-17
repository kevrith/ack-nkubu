import { Home, BookOpen, HandHeart, Mic, Cross as CrossIcon, Bell, Calendar, Users, Heart, Settings, Plus, Shield, UserCog, BookUser, Image, Send, Clock, FileEdit, FormInput } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: BookOpen, label: 'Bible', path: '/bible' },
  { icon: HandHeart, label: 'Prayers', path: '/prayers' },
  { icon: Mic, label: 'Sermons', path: '/sermons' },
  { icon: CrossIcon, label: "Pastor's Corner", path: '/pastors-corner' },
  { icon: Bell, label: 'Notices', path: '/notices' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Heart, label: 'Giving', path: '/giving' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: HandHeart, label: 'Pastoral Care', path: '/pastoral-care' },
]

export function DesktopSidebar() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-navy text-white h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto pb-4">
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                isActive ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {(user?.profile.role === 'leader' || user?.profile.role === 'clergy' || user?.profile.role === 'admin') && (
          <Link
            to="/directory"
            className={cn(
              'flex items-center gap-3 px-6 py-3 transition-colors',
              location.pathname === '/directory' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
            )}
          >
            <BookUser className="w-5 h-5" />
            <span>Directory</span>
          </Link>
        )}

        {(user?.profile.role === 'admin' || user?.profile.role === 'clergy') && (
          <>
            <Link
              to="/admin"
              className={cn(
                'flex items-center gap-3 px-6 py-3 mt-4 border-t border-navy-600 transition-colors',
                location.pathname === '/admin' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Settings className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/content"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/content' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Plus className="w-5 h-5" />
              <span>Add Content</span>
            </Link>
            {user?.profile.role === 'admin' && (
              <Link
                to="/admin/users"
                className={cn(
                  'flex items-center gap-3 px-6 py-3 transition-colors',
                  location.pathname === '/admin/users' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
                )}
              >
                <UserCog className="w-5 h-5" />
                <span>Manage Users</span>
              </Link>
            )}
            <Link
              to="/admin/media"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/media' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Image className="w-5 h-5" />
              <span>Media Library</span>
            </Link>
            <Link
              to="/admin/scheduled"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/scheduled' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Clock className="w-5 h-5" />
              <span>Scheduled</span>
            </Link>
            <Link
              to="/admin/pages"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/pages' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <FileEdit className="w-5 h-5" />
              <span>Page Editor</span>
            </Link>
            <Link
              to="/admin/forms"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/forms' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <FormInput className="w-5 h-5" />
              <span>Form Builder</span>
            </Link>
            {user?.profile.role === 'admin' && (
              <>
                <Link
                  to="/admin/notifications"
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 transition-colors',
                    location.pathname === '/admin/notifications' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
                  )}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Notification</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 transition-colors',
                    location.pathname === '/admin/settings' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
                  )}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </>
            )}
            {(user?.profile.role === 'clergy' || user?.profile.role === 'admin') && (
              <Link
                to="/clergy/pastoral-care"
                className={cn(
                  'flex items-center gap-3 px-6 py-3 transition-colors',
                  location.pathname === '/clergy/pastoral-care' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
                )}
              >
                <Shield className="w-5 h-5" />
                <span>Pastoral Care</span>
              </Link>
            )}
          </>
        )}
      </nav>
    </aside>
  )
}
