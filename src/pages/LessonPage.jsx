import { Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, ListChecks, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import CourseSidebar from '../components/CourseSidebar'
import ProgressRing from '../components/ProgressRing'
import VideoPlayer from '../components/VideoPlayer'
import { course, getLesson, getLessonNeighbors } from '../data/courseData'
import { useProgress } from '../hooks/useProgress'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = getLesson(lessonId)
  const { completed, percent, loading, error, toggleLesson } = useProgress()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('eagles-sidebar-collapsed') === 'true')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('eagles-sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [lessonId])

  if (!lesson) return <Navigate to={`/curso/${course.id}/leccion/${course.modules[0].lessons[0].id}`} replace />

  const { previous, next } = getLessonNeighbors(lesson.id)
  const isCompleted = completed.has(lesson.id)
  const module = course.modules.find((item) => item.id === lesson.moduleId)
  const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id) + 1

  async function completeAndContinue() {
    if (!isCompleted) {
      const result = await toggleLesson(lesson.id)
      if (!result.success) return
    }
    if (next) navigate(`/curso/${course.id}/leccion/${next.id}`)
  }

  function toggleCourseMenu() {
    if (window.matchMedia('(max-width: 980px)').matches) {
      setMobileMenuOpen((current) => !current)
      return
    }
    setSidebarCollapsed((current) => !current)
  }

  return (
    <main className={`course-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <CourseSidebar completed={completed} percent={percent} collapsed={sidebarCollapsed} open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <section className="lesson-page">
        <header className="lesson-topbar">
          <button className="course-menu-toggle" type="button" onClick={toggleCourseMenu} aria-label={sidebarCollapsed ? 'Mostrar temario' : 'Ocultar temario'}>
            <Menu className="course-menu-toggle__mobile" />
            {sidebarCollapsed ? <PanelLeftOpen className="course-menu-toggle__desktop" /> : <PanelLeftClose className="course-menu-toggle__desktop" />}
            <span>{sidebarCollapsed ? 'Mostrar temario' : 'Ocultar temario'}</span>
          </button>
          <div className="lesson-topbar__title">
            <span className="lesson-topbar__eyebrow">MÓDULO {module.number}</span>
            <strong>{module.title}</strong>
          </div>
          <div className="lesson-topbar__progress"><span>Progreso total</span><ProgressRing value={percent} /></div>
        </header>

        <div className="lesson-content">
          <div className="lesson-breadcrumb"><span>{course.title}</span><ChevronRight /><strong>{lesson.label || `Clase ${lessonIndex}`}</strong></div>
          <div className="lesson-heading">
            <div><span className="lesson-kicker">{lesson.label || `CLASE ${String(lessonIndex).padStart(2, '0')}`}</span><h1>{lesson.title}</h1></div>
            {lesson.duration && <span className="lesson-duration"><Clock3 />{lesson.duration}</span>}
          </div>

          <VideoPlayer videoId={lesson.videoId} title={lesson.title} />

          <div className="lesson-under-video">
            <div className="lesson-summary"><span><ListChecks /></span><div><small>EN ESTA CLASE</small><p>{lesson.summary}</p></div></div>
            <button className={`complete-button ${isCompleted ? 'is-completed' : ''}`} disabled={loading} onClick={() => toggleLesson(lesson.id)}>
              {isCompleted ? <><CheckCircle2 /> Lección completada</> : <><Check /> Marcar como completada</>}
            </button>
          </div>

          {error && <div className="progress-error">{error}</div>}

          <div className="lesson-navigation">
            {previous ? <button onClick={() => navigate(`/curso/${course.id}/leccion/${previous.id}`)}><ChevronLeft /><span><small>ANTERIOR</small><strong>{previous.title}</strong></span></button> : <span />}
            {next ? <button className="next" onClick={completeAndContinue}><span><small>SIGUIENTE</small><strong>{next.title}</strong></span><ChevronRight /></button> : <button className="next" onClick={() => toggleLesson(lesson.id)}><span><small>FINALIZAR</small><strong>Completar el curso</strong></span><CheckCircle2 /></button>}
          </div>
        </div>
      </section>
    </main>
  )
}
