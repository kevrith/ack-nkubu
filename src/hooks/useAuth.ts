import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { AuthUser } from '@/types/auth'

// The auth listener is a process-wide singleton, started when this module is
// first imported. It is deliberately never unsubscribed: previously each
// useAuth() caller raced for ownership of the subscription and tore it down on
// unmount, so every route change unsubscribed and resubscribed — refetching the
// profile each time, and leaving windows with no listener at all.
let started = false
// Guards against refetching the profile for a user we already resolved, since
// TOKEN_REFRESHED / repeated SIGNED_IN events fire on tab focus and on refresh.
let resolvedUserId: string | null = null

async function fetchProfile(userId: string) {
  const { setUser, setLoading } = useAuthStore.getState()
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
        resolvedUserId = userId
      } catch {
        setUser(null)
        resolvedUserId = null
      }
    } else {
      setUser(null)
      resolvedUserId = null
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
      resolvedUserId = userId
      // Cache profile for offline use
      localStorage.setItem(cacheKey, JSON.stringify({ ...data, _email: authUser.email }))
    } else {
      setUser(null)
      resolvedUserId = null
    }
  }
  setLoading(false)
}

function startAuthListener() {
  if (started) return
  started = true

  supabase.auth.onAuthStateChange((_event, session) => {
    const userId = session?.user?.id
    if (userId) {
      // Already resolved this user — a token refresh must not blank the UI or
      // trigger another profiles round-trip.
      if (resolvedUserId === userId && useAuthStore.getState().user) {
        useAuthStore.getState().setLoading(false)
        return
      }
      fetchProfile(userId)
    } else {
      resolvedUserId = null
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setLoading(false)
    }
  })
}

// Start immediately on import so auth resolves even on routes that render no
// auth-aware component (the landing page, where an OAuth redirect can land).
startAuthListener()

export function useAuth() {
  const { user, loading } = useAuthStore()

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
