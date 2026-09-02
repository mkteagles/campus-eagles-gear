import { Check, ChevronDown, KeyRound, LayoutDashboard, LockKeyhole, LogOut, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { course } from '../data/courseData'
import { useAuth } from '../context/auth-context'
import BrandMark from './BrandMark'

export default function CourseSidebar({ completed, percent, collapsed, open, onClose }) {
  const [expanded, setExpanded] = useState(() => new Set(course.modules.map((module) => module.id)))
  const { user, isAdmin, signOut } = useAuth()

  const toggleModule = (moduleId) => {
    const next = new Set(expanded)
    if (next.has(moduleId)) next.delete(moduleId)
    else next.add(moduleId)
    setExpanded(next)
  }

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Cerrar temario" />}
      <aside className={`course-sidebar ${collapsed ? 'is-collapsed' : ''} ${open ? 'is-open' : ''}`} aria-hidden={collapsed && !open}>
        <div className="sidebar__top">
          <BrandMark />
          <button className="sidebar__close" onClick={onClose} aria-label="Cerrar temario"><X /></button>
        </div>

        <div className="sidebar__course">
          <span>Tu programa</span>
          <h2>{course.title}</h2>
          <div className="sidebar__progress">
            <div><span>Progreso</span><strong>{percent}%</strong></div>
            <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
          </div>
        </div>

        <nav className="curriculum" aria-label="Temario del curso">
          {course.modules.map((module) => {
            const moduleDone = module.lessons.filter((lesson) => completed.has(lesson.id)).length
            const isExpanded = expanded.has(module.id)
            return (
              <section className="curriculum__module" key={module.id}>
                <button className="module__header" onClick={() => toggleModule(module.id)} aria-expanded={isExpanded}>
                  <span className="module__number">{module.number}</span>
                  <span><small>MÓDULO</small><strong>{module.title}</strong><em>{moduleDone}/{module.lessons.length} clases</em></span>
                  <ChevronDown className={isExpanded ? 'rotate' : ''} />
                </button>
                {isExpanded && (
                  <div className="module__lessons">
                    {module.lessons.map((lesson) => (
                      <NavLink
                        key={lesson.id}
                        to={`/curso/${course.id}/leccion/${lesson.id}`}
                        onClick={onClose}
                        className={({ isActive }) => `lesson-link ${isActive ? 'active' : ''}`}
                      >
                        <span className={`lesson-link__status ${completed.has(lesson.id) ? 'done' : ''}`}>
                          {completed.has(lesson.id) ? <Check /> : <span />}
                        </span>
                        <span><strong>{lesson.title}</strong><small>{lesson.label}{lesson.duration ? ` · ${lesson.duration}` : ''}</small></span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </nav>

        <details className="account-menu">
          <summary className="sidebar__account">
            <span className="avatar">{user?.email?.slice(0, 1).toUpperCase() || <LockKeyhole />}</span>
            <span><strong>Mi cuenta</strong><small>{user?.email}</small></span>
            <ChevronDown className="account-menu__chevron" />
          </summary>
          <div className="account-menu__panel">
            <NavLink to="/cambiar-contrasena" onClick={onClose}><KeyRound /> Cambiar contraseña</NavLink>
            {isAdmin && <NavLink to="/admin" onClick={onClose}><LayoutDashboard /> Panel administrativo</NavLink>}
            <button onClick={signOut}><LogOut /> Cerrar sesión</button>
            <span><UserRound /> Tu usuario es personal e intransferible.</span>
          </div>
        </details>
      </aside>
    </>
  )
}
