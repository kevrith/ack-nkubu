import { Home, BookOpen, HandHeart, Mic, Cross as CrossIcon, Bell, Calendar, Users, Heart, Settings, BookUser, Shield, Plus, UserCog, Image, Send, Clock, FileEdit, FormInput, User, BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function MorePage() {
  const { user } = useAuth()

  const allItems = [
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
    { icon: BellRing, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  const leaderItems = [
    { icon: BookUser, label: 'Member Directory', path: '/directory' },
  ]

  const adminItems = [
    { icon: Settings, label: 'Admin Dashboard', path: '/admin' },
    { icon: Plus, label: 'Add Content', path: '/admin/content' },
    { icon: UserCog, label: 'Manage Users', path: '/admin/users', adminOnly: true },
    { icon: Image, label: 'Media Library', path: '/admin/media' },
    { icon: Clock, label: 'Scheduled Content', path: '/admin/scheduled' },
    { icon: FileEdit, label: 'Page Editor', path: '/admin/pages' },
    { icon: FormInput, label: 'Form Builder', path: '/admin/forms' },
    { icon: Send, label: 'Send Notifications', path: '/admin/notifications', adminOnly: true },
    { icon: Settings, label: 'Settings', path: '/admin/settings', adminOnly: true },
    { icon: Shield, label: 'Pastoral Care Dashboard', path: '/clergy/pastoral-care' },
  ]

  const isLeader = ['leader', 'clergy', 'admin'].includes(user?.profile.role || '')
  const isAdmin = ['clergy', 'admin'].includes(user?.profile.role || '')
  const isSuperAdmin = user?.profile.role === 'admin'

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-playfair font-bold text-navy mb-6">Menu</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-navy mb-3">Main Menu</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-navy transition-colors"
                >
                  <Icon className="w-8 h-8 text-navy" />
                  <span className="text-sm text-center text-gray-700">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </section>

        {isLeader && (
          <section>
            <h2 className="text-lg font-semibold text-navy mb-3">Leadership</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {leaderItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-navy transition-colors"
                  >
                    <Icon className="w-8 h-8 text-navy" />
                    <span className="text-sm text-center text-gray-700">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {isAdmin && (
          <section>
            <h2 className="text-lg font-semibold text-navy mb-3">Administration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {adminItems
                .filter(item => !item.adminOnly || isSuperAdmin)
                .map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-navy transition-colors"
                    >
                      <Icon className="w-8 h-8 text-navy" />
                      <span className="text-sm text-center text-gray-700">{item.label}</span>
                    </Link>
                  )
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
