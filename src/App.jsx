import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import HomeRedirect from './components/HomeRedirect'
import { course, getFirstLessonId } from './data/courseData'
import ConfigPage from './pages/ConfigPage'
import LessonPage from './pages/LessonPage'
import LoginPage from './pages/LoginPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import AdminPage from './pages/AdminPage'
import AccessStatusPage from './pages/AccessStatusPage'
import CourseCompletePage from './pages/CourseCompletePage'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const firstLesson = `/curso/${course.id}/leccion/${getFirstLessonId()}`
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/configuracion" element={<ConfigPage />} />
        <Route path="/cambiar-contrasena" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/acceso-pendiente" element={<AccessStatusPage pending />} />
        <Route path="/acceso-bloqueado" element={<AccessStatusPage />} />
        <Route path="/inicio" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />
        <Route path="/curso/:courseId/leccion/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/curso/:courseId/completado" element={<ProtectedRoute><CourseCompletePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={firstLesson} replace />} />
      </Routes>
    </>
  )
}
