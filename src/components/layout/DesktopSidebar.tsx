import { Home, BookOpen, Book, HandHeart, Mic, Cross as CrossIcon, Bell, Calendar, Users, Heart, Settings, Plus, Shield, UserCog, BookUser, Image, Send, Clock, FileEdit, FormInput, BarChart2, MessageCircleHeart, UsersRound, Briefcase, Church } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: BookOpen, label: 'Bible', path: '/bible' },
  { icon: Book, label: 'Book of Common Prayer', path: '/bcp' },
  { icon: HandHeart, label: 'Prayers', path: '/prayers' },
  { icon: Mic, label: 'Sermons', path: '/sermons' },
  { icon: CrossIcon, label: "Pastor's Corner", path: '/pastors-corner' },
  { icon: Bell, label: 'Notices', path: '/notices' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Heart, label: 'Giving', path: '/giving' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: MessageCircleHeart, label: 'Testimonies', path: '/testimonies' },
  { icon: Briefcase, label: 'Ministries', path: '/ministries' },
  { icon: UsersRound, label: 'Cell Groups', path: '/cell-groups' },
  { icon: Church, label: 'Sacraments', path: '/sacraments' },
  { icon: HandHeart, label: 'Pastoral Care', path: '/pastoral-care' },
]

export function DesktopSidebar() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-navy dark:bg-gray-800 text-white h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto pb-4 transition-colors">
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
                isActive ? 'bg-navy-800 dark:bg-gray-700 border-l-4 border-gold text-gold' : 'hover:bg-navy-700 dark:hover:bg-gray-700'
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

        {user?.profile.role === 'admin' && (
          <>
            <Link
              to="/admin"
              className={cn(
                'flex items-center gap-3 px-6 py-3 mt-4 border-t border-navy-600 transition-colors',
                location.pathname === '/admin' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Settings className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </Link>
          </>
        )}

        {(user?.profile.role === 'clergy' || user?.profile.role === 'admin') && (
          <>
            <Link
              to="/clergy/dashboard"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/clergy/dashboard' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Shield className="w-5 h-5" />
              <span>Clergy Dashboard</span>
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
                  to="/admin/giving-reports"
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 transition-colors',
                    location.pathname === '/admin/giving-reports' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
                  )}
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>Giving Reports</span>
                </Link>
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
            <Link
              to="/clergy/sacraments"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/clergy/sacraments' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Church className="w-5 h-5" />
              <span>Sacrament Requests</span>
            </Link>
          </>
        )}

        {(user?.profile.role === 'leader' || user?.profile.role === 'clergy' || user?.profile.role === 'admin') && (
          <>
            <Link
              to="/admin/ministries"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/ministries' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Briefcase className="w-5 h-5" />
              <span>Manage Ministries</span>
            </Link>
            <Link
              to="/admin/cell-groups"
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                location.pathname === '/admin/cell-groups' ? 'bg-navy-800 border-l-4 border-gold text-gold' : 'hover:bg-navy-700'
              )}
            >
              <Users className="w-5 h-5" />
              <span>Manage Cell Groups</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  )
}
