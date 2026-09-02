import { useCallback, useEffect, useMemo, useState } from 'react'
import { course, lessons } from '../data/courseData'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/auth-context'

const localKey = 'eagles-course-progress'

export function useProgress() {
  const { user, configured } = useAuth()
  const [completed, setCompleted] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProgress() {
      setLoading(true)
      setError('')

      if (!configured || !user) {
        const saved = JSON.parse(localStorage.getItem(localKey) || '[]')
        if (active) setCompleted(new Set(saved))
        if (active) setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('course_id', course.id)
        .eq('completed', true)

      if (!active) return
      if (fetchError) setError('No pudimos cargar tu progreso. Intenta de nuevo.')
      else setCompleted(new Set(data.map((row) => row.lesson_id)))
      setLoading(false)
    }

    loadProgress()
    return () => { active = false }
  }, [configured, user])

  const toggleLesson = useCallback(async (lessonId) => {
    const wasCompleted = completed.has(lessonId)
    const next = new Set(completed)
    if (wasCompleted) next.delete(lessonId)
    else next.add(lessonId)
    setCompleted(next)
    setError('')

    if (!configured || !user) {
      localStorage.setItem(localKey, JSON.stringify([...next]))
      return { success: true }
    }

    const { error: saveError } = await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      course_id: course.id,
      lesson_id: lessonId,
      completed: !wasCompleted,
      completed_at: !wasCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id,lesson_id' })

    if (saveError) {
      setCompleted(completed)
      setError('No se guardó el cambio. Revisa tu conexión e intenta otra vez.')
      return { success: false }
    }
    return { success: true }
  }, [completed, configured, user])

  const percent = useMemo(() => Math.round((completed.size / lessons.length) * 100), [completed])

  return { completed, percent, loading, error, toggleLesson }
}
