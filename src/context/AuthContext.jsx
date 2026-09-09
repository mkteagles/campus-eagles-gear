import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

function enrollmentIsActive(enrollment) {
  if (!enrollment) return false
  if (!['active', 'completed'].includes(enrollment.status)) return false
  return !enrollment.expires_at || new Date(enrollment.expires_at) > new Date()
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEnrollments = useCallback(async (nextProfile, userId) => {
    if (!nextProfile || !userId || !supabase) {
      setEnrollments([])
      return []
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .select('course_id,status,expires_at,enrolled_at')
      .eq('user_id', userId)
      .in('status', ['active', 'completed'])

    if (error) {
      console.error('Error cargando inscripciones:', error)
      setEnrollments([])
      return []
    }

    const activeEnrollments = (data || []).filter(enrollmentIsActive)
    setEnrollments(activeEnrollments)
    return activeEnrollments
  }, [])

  const refreshProfile = useCallback(async (nextSession = session) => {
    if (!nextSession?.user || !isSupabaseConfigured) {
      setProfile(null)
      setEnrollments([])
      return null
    }

    const { data } = await supabase
      .from('student_profiles')
      .select('id,email,full_name,role,status,must_change_password')
      .eq('id', nextSession.user.id)
      .single()

    setProfile(data || null)
    await loadEnrollments(data || null, nextSession.user.id)
    return data || null
  }, [loadEnrollments, session])

  useEffect(() => {
    let active = true

    async function loadProfile(nextSession) {
      if (!nextSession?.user) {
        if (active) setProfile(null)
        if (active) setEnrollments([])
        if (active) setLoading(false)
        return
      }

      const { data } = await supabase
        .from('student_profiles')
        .select('id,email,full_name,role,status,must_change_password')
        .eq('id', nextSession.user.id)
        .single()

      if (!active) return

      setProfile(data || null)
      await loadEnrollments(data || null, nextSession.user.id)
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
  }, [loadEnrollments])

  const isAdmin = profile?.role === 'admin' && profile?.status === 'active'

  const accessibleCourseIds = useMemo(
    () => enrollments.map((item) => item.course_id),
    [enrollments],
  )

  const hasAccessToCourse = useCallback((courseId) => {
    if (!courseId) return false
    if (isAdmin) return true
    return accessibleCourseIds.includes(courseId)
  }, [accessibleCourseIds, isAdmin])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    enrollments,
    accessibleCourseIds,
    hasAccessToCourse,
    // Compatibilidad con componentes antiguos: acceso al curso original.
    hasCourseAccess: hasAccessToCourse('seminario-empresarial'),
    isAdmin,
    loading,
    configured: isSupabaseConfigured,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase?.auth.signOut(),
    refreshProfile,
  }), [session, profile, enrollments, accessibleCourseIds, hasAccessToCourse, isAdmin, loading, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
