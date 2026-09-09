import { ArrowLeft, CheckCircle2, Sparkles, Trophy, UsersRound } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import LoadingScreen from '../components/LoadingScreen'
import { useAuth } from '../context/auth-context'
import { getCourse, getCourseLessons, getFirstLessonIdForCourse } from '../data/courses'
import { useProgress } from '../hooks/useProgress'

export default function CourseCompletePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const course = getCourse(courseId)
  const lessons = getCourseLessons(courseId)
  const { completed, loading } = useProgress(courseId)

  if (!course) return <Navigate to="/inicio" replace />
  if (loading) return <LoadingScreen />

  const finished = lessons.length > 0 && lessons.every((lesson) => completed.has(lesson.id))

  if (!finished) {
    const pendingLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons.at(-1)
    return pendingLesson
      ? <Navigate to={`/curso/${course.id}/leccion/${pendingLesson.id}`} replace />
      : <Navigate to={`/curso/${course.id}`} replace />
  }

  return (
    <main className="course-complete-page">
      <div className="course-complete-grid" aria-hidden="true" />
      <header className="course-complete-header">
        <BrandMark />
        <span><CheckCircle2 /> 100% completado</span>
      </header>

      <section className="course-complete-card">
        <div className="course-complete-badge" aria-hidden="true"><Trophy /></div>
        <span className="eyebrow"><Sparkles /> PROGRAMA FINALIZADO</span>
        <h1>¡Terminaste<br />el curso!</h1>
        <p className="course-complete-greeting">
          {profile?.full_name ? `${profile.full_name}, has completado` : 'Has completado'} <strong>{course.title}</strong>.
          Gracias por confiar en Eagles Gear Solutions para seguir fortaleciendo tus conocimientos.
        </p>

        <div className="course-complete-next">
          <UsersRound />
          <div>
            <strong>Mantente pendiente de nuestros grupos</strong>
            <p>Ahí compartiremos avisos, contenido nuevo y las próximas capacitaciones disponibles.</p>
          </div>
        </div>

        <button
          type="button"
          className="course-complete-back"
          onClick={() => navigate(`/curso/${course.id}/leccion/${getFirstLessonIdForCourse(course.id)}`)}
        >
          <ArrowLeft /> Volver a revisar las clases
        </button>
      </section>
    </main>
  )
}
