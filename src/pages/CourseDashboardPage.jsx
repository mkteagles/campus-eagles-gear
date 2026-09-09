import { BookOpenCheck, CheckCircle2, ChevronRight, LogOut, PlayCircle, Sparkles } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import LoadingScreen from '../components/LoadingScreen'
import ProgressRing from '../components/ProgressRing'
import { useAuth } from '../context/auth-context'
import { getCourse, getCourseLessons } from '../data/courses'
import { useProgress } from '../hooks/useProgress'

export default function CourseDashboardPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { profile, user, signOut } = useAuth()
  const course = getCourse(courseId)
  const { completed, percent, loading } = useProgress(courseId)

  if (!course) return <Navigate to="/inicio" replace />
  if (loading) return <LoadingScreen />

  const lessons = getCourseLessons(course.id)
  const firstPending = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[0]
  const completedCount = lessons.filter((lesson) => completed.has(lesson.id)).length

  return (
    <main className={`course-dashboard course-dashboard--${course.theme || 'default'}`}>
      <header className="course-dashboard__header">
        <BrandMark />
        <div className="course-dashboard__account">
          <span><strong>{profile?.full_name || 'Alumno'}</strong><small>{user?.email}</small></span>
          <button type="button" onClick={signOut} aria-label="Cerrar sesión"><LogOut /></button>
        </div>
      </header>

      <section className="course-dashboard__hero">
        <div className="course-dashboard__hero-copy">
          <span className="elite-chip"><Sparkles /> PROGRAMA EXCLUSIVO</span>
          <small>{course.eyebrow}</small>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          {firstPending && (
            <button className="primary-button course-dashboard__continue" type="button" onClick={() => navigate(`/curso/${course.id}/leccion/${firstPending.id}`)}>
              <PlayCircle /> {percent === 100 ? 'Revisar curso' : percent > 0 ? 'Continuar capacitación' : 'Comenzar capacitación'}
            </button>
          )}
        </div>

        <div className="course-dashboard__progress-card">
          <ProgressRing value={percent} />
          <div>
            <small>PROGRESO GENERAL</small>
            <strong>{completedCount} de {lessons.length}</strong>
            <span>videos completados</span>
          </div>
        </div>
      </section>

      <section className="course-dashboard__body">
        <div className="course-dashboard__section-heading">
          <div><span className="eyebrow">TU CAPACITACIÓN</span><h2>Módulos del programa</h2></div>
          <span>{course.modules.length} módulos</span>
        </div>

        <div className="elite-module-grid">
          {course.modules.map((module) => {
            const moduleLessons = module.lessons || []
            const doneCount = moduleLessons.filter((lesson) => completed.has(lesson.id)).length
            const moduleComplete = moduleLessons.length > 0 && doneCount === moduleLessons.length
            const destination = moduleLessons.find((lesson) => !completed.has(lesson.id)) || moduleLessons[0]

            return (
              <article className={`elite-module-card ${moduleComplete ? 'is-complete' : ''}`} key={module.id}>
                <div className="elite-module-card__top">
                  <span className="elite-module-card__number">{module.number}</span>
                  {moduleComplete ? <span className="elite-module-card__done"><CheckCircle2 /> COMPLETADO</span> : <BookOpenCheck />}
                </div>
                <small>MÓDULO</small>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="elite-module-card__footer">
                  <span>{doneCount}/{moduleLessons.length} videos</span>
                  {destination && (
                    <button type="button" onClick={() => navigate(`/curso/${course.id}/leccion/${destination.id}`)} aria-label={`Abrir ${module.title}`}><ChevronRight /></button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
