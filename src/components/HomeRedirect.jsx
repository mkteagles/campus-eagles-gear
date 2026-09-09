import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function HomeRedirect() {
  const { isAdmin, accessibleCourseIds } = useAuth()

  if (isAdmin) return <Navigate to="/admin" replace />

  const preferredCourseId = accessibleCourseIds.includes('cvt-elite')
    ? 'cvt-elite'
    : accessibleCourseIds[0]

  if (!preferredCourseId) return <Navigate to="/acceso-pendiente" replace />

  return <Navigate to={`/curso/${preferredCourseId}`} replace />
}
