import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/auth'

interface RoleGuardProps {
  requiredRole: UserRole | UserRole[]
  fallback?: ReactNode
  children: ReactNode
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  basic_member: 1,
  leader: 2,
  clergy: 3,
  admin: 4,
}

export function RoleGuard({ requiredRole, fallback = null, children }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) return <>{fallback}</>

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const userRoleLevel = ROLE_HIERARCHY[user.profile.role]
  const hasAccess = roles.some(role => userRoleLevel >= ROLE_HIERARCHY[role])

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}
