import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { course, getFirstLessonId } from '../data/courseData'

export default function HomeRedirect() {
  const { isAdmin } = useAuth()
  return <Navigate to={isAdmin ? '/admin' : `/curso/${course.id}/leccion/${getFirstLessonId()}`} replace />
}
