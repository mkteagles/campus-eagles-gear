import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (nextSession = session) => {
    if (!nextSession?.user || !isSupabaseConfigured) {
      setProfile(null)
      return null
    }

    const { data } = await supabase
      .from('student_profiles')
      .select('id,email,full_name,role,status,must_change_password')
      .eq('id', nextSession.user.id)
      .single()

    setProfile(data || null)
    return data || null
  }, [session])

  useEffect(() => {
    let active = true

    async function loadProfile(nextSession) {
      if (!nextSession?.user) {
        if (active) setProfile(null)
        if (active) setLoading(false)
        return
      }

      const { data } = await supabase
        .from('student_profiles')
        .select('id,email,full_name,role,status,must_change_password')
        .eq('id', nextSession.user.id)
        .single()

      if (active) setProfile(data || null)
      if (active) setLoading(false)
    }

    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      loadProfile(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(true)
      window.setTimeout(() => loadProfile(nextSession), 0)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    isAdmin: profile?.role === 'admin' && profile?.status === 'active',
    loading,
    configured: isSupabaseConfigured,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase?.auth.signOut(),
    refreshProfile,
  }), [session, profile, loading, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
