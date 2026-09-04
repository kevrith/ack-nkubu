import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { SEO } from '@/components/seo/SEO'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Members-only pages carry no public search value and often show personal
  // data, so keep them out of the index.
  return (
    <>
      <SEO noIndex />
      {children}
    </>
  )
}
