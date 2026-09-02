import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) setMessage('No fue posible cambiar la contraseña. Solicita un enlace nuevo.')
    else navigate('/login', { replace: true })
  }

  return (
    <main className="simple-auth-page">
      <form className="simple-auth-card" onSubmit={handleSubmit}>
        <BrandMark />
        <span className="simple-auth-card__icon"><LockKeyhole /></span>
        <h1>Crea una contraseña nueva</h1>
        <p>Debe contener al menos 8 caracteres.</p>
        <label>Nueva contraseña<div className="input-wrap"><input type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></label>
        {message && <div className="form-message error">{message}</div>}
        <button className="primary-button primary-button--wide" disabled={saving}>Guardar contraseña <ArrowRight /></button>
      </form>
    </main>
  )
}
