import { LockKeyhole, LogOut } from 'lucide-react'
import BrandMark from '../components/BrandMark'
import { useAuth } from '../context/auth-context'

export default function AccessStatusPage({ pending = false }) {
  const { signOut } = useAuth()
  return (
    <main className="simple-auth-page">
      <section className="simple-auth-card access-status-card">
        <BrandMark />
        <span className="simple-auth-card__icon"><LockKeyhole /></span>
        <h1>{pending ? 'Cuenta pendiente' : 'Acceso suspendido'}</h1>
        <p>{pending
          ? 'Tu cuenta existe, pero todavía no tiene un curso activo asignado. Comunícate con el administrador.'
          : 'Tu cuenta no tiene acceso activo al campus. Comunícate con el administrador para revisarla.'}</p>
        <button className="primary-button primary-button--wide" onClick={signOut}>Cerrar sesión <LogOut /></button>
      </section>
    </main>
  )
}
