import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { AuthUser } from '@/types/auth'

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const cacheKey = `cached_profile_${userId}`

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      // Offline fallback: restore from localStorage cache
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          const cachedProfile = JSON.parse(cached)
          setUser({
            id: userId,
            email: authUser?.email || cachedProfile._email || '',
            profile: cachedProfile,
          })
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } else {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const authUserObj: AuthUser = {
          id: authUser.id,
          email: authUser.email!,
          profile: data,
        }
        setUser(authUserObj)
        // Cache profile for offline use
        localStorage.setItem(cacheKey, JSON.stringify({ ...data, _email: authUser.email }))
      }
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
