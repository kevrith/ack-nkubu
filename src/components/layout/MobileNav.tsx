import { Home, BookOpen, Mic, Heart, MoreHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: BookOpen, label: 'Bible', path: '/bible' },
  { icon: Mic, label: 'Sermons', path: '/sermons' },
  { icon: Heart, label: 'Give', path: '/giving' },
  { icon: MoreHorizontal, label: 'More', path: '/more' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-navy' : 'text-gray-500'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'text-gold')} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
