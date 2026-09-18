import { BookOpen, ChevronRight, Clock3, LogOut, ShieldCheck } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { useAuth } from '../context/auth-context'
import { courses, getCourseLessons } from '../data/courses'

export default function CourseCatalogPage() {
  const { profile, user, isAdmin, accessibleCourseIds, signOut } = useAuth()

  const visibleCourses = courses.filter((course) => (
    isAdmin || accessibleCourseIds.includes(course.id)
  ))

  if (!isAdmin && visibleCourses.length === 0) {
    return <Navigate to="/acceso-pendiente" replace />
  }

  return (
    <main className="course-catalog-page">
      <header className="course-catalog-header">
        <BrandMark />
        <div className="course-catalog-header__actions">
          {isAdmin && (
            <Link className="course-catalog-admin-link" to="/admin">
              <ShieldCheck /> Panel admin
            </Link>
          )}
          <span className="course-catalog-user">
            <strong>{profile?.full_name || 'Usuario'}</strong>
            <small>{user?.email}</small>
          </span>
          <button type="button" onClick={signOut} aria-label="Cerrar sesión"><LogOut /></button>
        </div>
      </header>

      <section className="course-catalog-content">
        <div className="course-catalog-heading">
          <span className="eyebrow">EAGLES GEAR SOLUTIONS</span>
          <h1>{isAdmin ? 'Cursos del campus' : 'Mis cursos'}</h1>
          <p>
            {isAdmin
              ? 'Como administrador puedes entrar a cualquier capacitación, revisar su estructura y regresar al panel de accesos cuando lo necesites.'
              : 'Selecciona la capacitación a la que tienes acceso.'}
          </p>
        </div>

        <div className="course-catalog-grid">
          {visibleCourses.map((course) => {
            const lessonCount = getCourseLessons(course.id).length
            const comingSoon = course.contentStatus === 'coming-soon' || lessonCount === 0

            return (
              <article className={`course-catalog-card course-catalog-card--${course.theme || 'default'} ${comingSoon ? 'is-coming-soon' : ''}`} key={course.id}>
                <div className="course-catalog-card__icon">{comingSoon ? <Clock3 /> : <BookOpen />}</div>
                <div className="course-catalog-card__body">
                  <small>{course.eyebrow || 'CAPACITACIÓN'}</small>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                </div>
                <div className="course-catalog-card__meta">
                  <span>{course.modules.length} {course.modules.length === 1 ? 'módulo' : 'módulos'}</span>
                  <span>{comingSoon ? 'Contenido en preparación' : `${lessonCount} videos`}</span>
                </div>
                <Link to={`/curso/${course.id}`}>
                  {comingSoon ? 'Ver espacio del curso' : 'Entrar al curso'} <ChevronRight />
                </Link>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
