import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import LoadingScreen from './LoadingScreen'

export default function AdminRoute({ children }) {
  const { loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAdmin) return <Navigate to="/inicio" replace />
  return children
}
