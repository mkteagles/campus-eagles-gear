import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children }) {
  const { user, profile, hasCourseAccess, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />
  if (!configured) return <Navigate to="/configuracion" replace />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!profile) return <Navigate to="/acceso-pendiente" replace />
  if (profile.status !== 'active') return <Navigate to="/acceso-bloqueado" replace />
  if (profile.must_change_password && location.pathname !== '/cambiar-contrasena') {
    return <Navigate to="/cambiar-contrasena" replace />
  }
  if (!hasCourseAccess && location.pathname.startsWith('/curso/')) {
    return <Navigate to="/acceso-pendiente" replace />
  }
  return children
}
