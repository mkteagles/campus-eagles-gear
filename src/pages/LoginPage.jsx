import { ArrowRight, Eye, EyeOff, LoaderCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { useAuth } from '../context/auth-context'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { user, configured, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/inicio'

  if (!configured) return <Navigate to="/configuracion" replace />
  if (user) return <Navigate to={destination} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    const cleanUsername = username.trim().toLowerCase().replace(/@eagles\.com$/, '')
    const email = `${cleanUsername}@eagles.com`
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setMessage({ type: 'error', text: 'El usuario o la contraseña no son correctos.' })
    else navigate(destination, { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-panel__grid" />
        <BrandMark />
        <div className="login-brand-panel__content">
          <span className="eyebrow">FORMACIÓN PARA DUEÑOS DE TALLER</span>
          <h1>Tu negocio puede crecer <em>sin depender de ti.</em></h1>
          <p>Accede a las clases, avanza a tu ritmo y convierte el conocimiento en acciones para tu empresa.</p>
        </div>
        <div className="login-brand-panel__proof"><ShieldCheck /><span><strong>Acceso exclusivo</strong><small>para alumnos de Eagles Digital Solutions</small></span></div>
      </section>

      <section className="login-form-panel">
        <div className="login-box">
          <span className="login-box__number">01</span>
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa con el usuario y la contraseña que te entregó tu asesor.</p>
          <form onSubmit={handleSubmit}>
            <label>Usuario<div className="input-wrap username-input"><UserRound /><input value={username} onChange={(e) => setUsername(e.target.value.replace(/@eagles\.com$/i, ''))} placeholder="nombre.apellido" autoComplete="username" required /><span>@eagles.com</span></div></label>
            <label>Contraseña<div className="input-wrap"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            <p className="forgot-help"><strong>¿Olvidaste tu contraseña?</strong> Solicita una temporal al administrador del campus.</p>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
            <button className="primary-button primary-button--wide" disabled={submitting}>{submitting ? <LoaderCircle className="spin" /> : <>Entrar al campus <ArrowRight /></>}</button>
          </form>
          <small className="support-copy">¿Necesitas ayuda? Contacta a tu asesor de Eagles Gear Solutions.</small>
        </div>
      </section>
    </main>
  )
}
