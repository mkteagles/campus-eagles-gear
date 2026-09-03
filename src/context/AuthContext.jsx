import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

const courseId = 'seminario-empresarial'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [hasCourseAccess, setHasCourseAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadCourseAccess = useCallback(async (nextProfile, userId) => {
    if (!nextProfile || !userId) {
      setHasCourseAccess(false)
      return false
    }

    if (nextProfile.role === 'admin' && nextProfile.status === 'active') {
      setHasCourseAccess(true)
      return true
    }

    const { data } = await supabase
      .from('course_enrollments')
      .select('status,expires_at')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .in('status', ['active', 'completed'])
      .maybeSingle()

    const active = Boolean(data && (!data.expires_at || new Date(data.expires_at) > new Date()))
    setHasCourseAccess(active)
    return active
  }, [])

  const refreshProfile = useCallback(async (nextSession = session) => {
    if (!nextSession?.user || !isSupabaseConfigured) {
      setProfile(null)
      setHasCourseAccess(false)
      return null
    }

    const { data } = await supabase
      .from('student_profiles')
      .select('id,email,full_name,role,status,must_change_password')
      .eq('id', nextSession.user.id)
      .single()

    setProfile(data || null)
    await loadCourseAccess(data || null, nextSession.user.id)
    return data || null
  }, [loadCourseAccess, session])

  useEffect(() => {
    let active = true

    async function loadProfile(nextSession) {
      if (!nextSession?.user) {
        if (active) setProfile(null)
        if (active) setHasCourseAccess(false)
        if (active) setLoading(false)
        return
      }

      const { data } = await supabase
        .from('student_profiles')
        .select('id,email,full_name,role,status,must_change_password')
        .eq('id', nextSession.user.id)
        .single()

      if (active) setProfile(data || null)
      if (active) await loadCourseAccess(data || null, nextSession.user.id)
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
  }, [loadCourseAccess])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    hasCourseAccess,
    isAdmin: profile?.role === 'admin' && profile?.status === 'active',
    loading,
    configured: isSupabaseConfigured,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase?.auth.signOut(),
    refreshProfile,
  }), [session, profile, hasCourseAccess, loading, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
