import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabase'

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const isFirstAccess = Boolean(profile?.must_change_password)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setMessage('Usa al menos 8 caracteres e incluye mayúscula, minúscula y número.')
      return
    }
    if (password !== confirmation) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    setSaving(true)
    const { error: passwordError } = await supabase.auth.updateUser({ password })
    if (passwordError) {
      setMessage('No fue posible guardar la contraseña. Intenta nuevamente.')
      setSaving(false)
      return
    }

    const { error: profileError } = await supabase.rpc('mark_password_changed')
    if (profileError) {
      setMessage('La contraseña cambió, pero falta ejecutar la migración SQL del primer ingreso.')
      setSaving(false)
      return
    }

    await refreshProfile()
    setSaving(false)
    navigate('/inicio', { replace: true })
  }

  return (
    <main className="simple-auth-page password-page">
      <form className="simple-auth-card password-card" onSubmit={handleSubmit}>
        {!isFirstAccess && <button className="password-back-button" type="button" onClick={() => navigate(-1)}><ArrowLeft /> Regresar al curso</button>}
        <BrandMark />
        <span className="simple-auth-card__icon"><LockKeyhole /></span>
        <span className="eyebrow">{isFirstAccess ? 'PRIMER INGRESO · PASO OBLIGATORIO' : 'SEGURIDAD DE TU CUENTA'}</span>
        <h1>{isFirstAccess ? 'Crea tu contraseña privada' : 'Cambiar contraseña'}</h1>
        <p>{isFirstAccess ? 'La contraseña temporal dejará de funcionar. Solo tú conocerás la nueva.' : 'Actualiza la contraseña de acceso a tu campus.'}</p>

        <label>Nueva contraseña<div className="input-wrap"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Mínimo 8 caracteres" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
        <label>Confirmar contraseña<div className="input-wrap"><input type={showPassword ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" placeholder="Repite tu contraseña" required /></div></label>

        <ul className="password-rules">
          <li className={password.length >= 8 ? 'valid' : ''}><CheckCircle2 /> 8 caracteres o más</li>
          <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'valid' : ''}><CheckCircle2 /> Mayúscula y minúscula</li>
          <li className={/\d/.test(password) ? 'valid' : ''}><CheckCircle2 /> Al menos un número</li>
        </ul>

        {message && <div className="form-message error">{message}</div>}
        <button className="primary-button primary-button--wide" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <>Guardar y continuar <ArrowRight /></>}</button>
      </form>
    </main>
  )
}
