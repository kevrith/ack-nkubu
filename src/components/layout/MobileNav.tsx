import { Home, BookOpen, Mic, Heart, Book, MoreHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: BookOpen, label: 'Bible', path: '/bible' },
  { icon: Book, label: 'BCP', path: '/bcp' },
  { icon: Mic, label: 'Sermons', path: '/sermons' },
  { icon: Heart, label: 'Give', path: '/giving' },
  { icon: MoreHorizontal, label: 'More', path: '/more' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors">
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
                isActive ? 'text-navy dark:text-white' : 'text-gray-500 dark:text-gray-400'
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
