import { BookOpen, CheckCircle2, Copy, KeyRound, LoaderCircle, LogOut, Plus, Search, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { course, getFirstLessonId } from '../data/courseData'
import { useAuth } from '../context/auth-context'
import { adminApi } from '../lib/adminApi'

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  password: '',
  role: 'student',
}

function createPassword() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$'
  const values = crypto.getRandomValues(new Uint32Array(12))
  return Array.from(values, (value) => characters[value % characters.length]).join('')
}

export default function AdminPage() {
  const { profile, signOut } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [credentials, setCredentials] = useState(null)

  useEffect(() => {
    let active = true
    adminApi.listUsers()
      .then(({ users: result }) => {
        if (active) setUsers(Array.isArray(result) ? result : [])
      })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : []
    const term = query.trim().toLowerCase()
    if (!term) return safeUsers
    return safeUsers.filter((user) => [user.full_name, user.email, user.company_name, user.phone]
      .some((value) => String(value || '').toLowerCase().includes(term)))
  }, [query, users])

  const stats = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : []
    return {
      total: safeUsers.length,
      active: safeUsers.filter((user) => user.status === 'active').length,
      admins: safeUsers.filter((user) => user.role === 'admin').length,
    }
  }, [users])

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function generatePassword() {
    setField('password', createPassword())
  }

  async function handleCreate(event) {
    event.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const temporaryPassword = form.password
      const { user } = await adminApi.createUser(form)
      setUsers((current) => [user, ...current])
      setMessage({ type: 'success', text: `La cuenta de ${user.full_name || user.email} fue creada correctamente.` })
      setCredentials({ title: 'Cuenta creada', email: user.email, password: temporaryPassword })
      setForm(emptyForm)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleResetPassword(user) {
    const temporaryPassword = createPassword()
    setUpdatingId(user.id)
    setMessage({ type: '', text: '' })
    try {
      const { user: updatedUser } = await adminApi.resetPassword({ userId: user.id, password: temporaryPassword })
      setUsers((current) => current.map((item) => item.id === updatedUser.id ? { ...item, ...updatedUser } : item))
      setCredentials({ title: 'Contraseña restablecida', email: updatedUser.email, password: temporaryPassword })
      setMessage({ type: 'success', text: `Se generó una contraseña temporal para ${updatedUser.full_name || updatedUser.email}.` })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingId('')
    }
  }

  function copyCredentials() {
    if (!credentials) return
    navigator.clipboard?.writeText(`Usuario: ${credentials.email}\nContraseña temporal: ${credentials.password}`)
  }

  async function handleUpdate(userId, field, value) {
    setUpdatingId(userId)
    setMessage({ type: '', text: '' })
    try {
      const { user } = await adminApi.updateUser({ userId, [field]: value })
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...user } : item))
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <BrandMark />
        <nav>
          <Link to={`/curso/${course.id}/leccion/${getFirstLessonId()}`}><BookOpen /> Ver curso</Link>
          <span>{profile?.full_name || profile?.email}</span>
          <button onClick={signOut} aria-label="Cerrar sesión"><LogOut /></button>
        </nav>
      </header>

      <div className="admin-content">
        <div className="admin-title-row">
          <div><span className="eyebrow">CONTROL DE ACCESOS</span><h1>Usuarios del campus</h1><p>Crea cuentas y administra quién puede entrar a la capacitación.</p></div>
          <span className="admin-role-badge"><ShieldCheck /> Administrador</span>
        </div>

        <section className="admin-stats" aria-label="Resumen de usuarios">
          <article><span><UsersRound /></span><div><small>USUARIOS</small><strong>{stats.total}</strong></div></article>
          <article><span><CheckCircle2 /></span><div><small>ACTIVOS</small><strong>{stats.active}</strong></div></article>
          <article><span><ShieldCheck /></span><div><small>ADMINISTRADORES</small><strong>{stats.admins}</strong></div></article>
        </section>

        {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}
        {credentials && (
          <section className="credentials-card" aria-live="polite">
            <div><KeyRound /><span><strong>{credentials.title}</strong><small>Entrega estos datos al alumno. Al entrar tendrá que crear una contraseña nueva.</small></span></div>
            <dl><div><dt>Usuario</dt><dd>{credentials.email}</dd></div><div><dt>Contraseña temporal</dt><dd>{credentials.password}</dd></div></dl>
            <button type="button" onClick={copyCredentials}><Copy /> Copiar accesos</button>
            <button type="button" className="credentials-card__close" onClick={() => setCredentials(null)} aria-label="Ocultar accesos"><X /></button>
          </section>
        )}

        <div className="admin-grid">
          <section className="admin-users-card">
            <div className="admin-card-heading">
              <div><h2>Alumnos registrados</h2><small>{filteredUsers.length} resultados</small></div>
              <label className="admin-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar alumno..." /></label>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Usuario</th><th>Empresa</th><th>Rol</th><th>Acceso</th><th>Contraseña</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="admin-empty"><LoaderCircle className="spin" /> Cargando usuarios...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" className="admin-empty"><UserRound /> No se encontraron usuarios.</td></tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className={updatingId === user.id ? 'is-updating' : ''}>
                      <td><span className="table-user"><span>{(user.full_name || user.email || '?').slice(0, 1).toUpperCase()}</span><span><strong>{user.full_name || 'Sin nombre'}</strong><small>{user.email}</small></span></span></td>
                      <td><strong className="table-company">{user.company_name || '—'}</strong><small className="table-phone">{user.phone || ''}</small></td>
                      <td><select value={user.role} disabled={updatingId === user.id} onChange={(event) => handleUpdate(user.id, 'role', event.target.value)}><option value="student">Alumno</option><option value="admin">Administrador</option></select></td>
                      <td><select className={`status-select status-${user.status}`} value={user.status} disabled={updatingId === user.id} onChange={(event) => handleUpdate(user.id, 'status', event.target.value)}><option value="active">Activo</option><option value="inactive">Inactivo</option><option value="blocked">Bloqueado</option></select></td>
                      <td><button className="reset-password-button" type="button" disabled={updatingId === user.id} onClick={() => handleResetPassword(user)}><KeyRound /> Restablecer</button><small className="password-status">{user.must_change_password ? 'Cambio pendiente' : 'Contraseña privada'}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="create-user-card">
            <div className="admin-card-heading"><div><span className="create-icon"><Plus /></span><h2>Agregar usuario</h2><small>Se inscribirá automáticamente al curso.</small></div></div>
            <form onSubmit={handleCreate}>
              <label>Nombre completo<input value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} placeholder="Nombre del alumno" required /></label>
              <label>Usuario asignado<div className="admin-username"><input value={form.email} onChange={(event) => setField('email', event.target.value.replace(/@eagles\.com$/i, ''))} placeholder="nombre.apellido" autoComplete="off" required /><span>@eagles.com</span></div></label>
              <div className="admin-form-row"><label>Teléfono<input value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="449 000 0000" /></label><label>Rol<select value={form.role} onChange={(event) => setField('role', event.target.value)}><option value="student">Alumno</option><option value="admin">Administrador</option></select></label></div>
              <label>Empresa o taller<input value={form.companyName} onChange={(event) => setField('companyName', event.target.value)} placeholder="Nombre del taller" /></label>
              <label>Contraseña temporal<div className="admin-password"><KeyRound /><input value={form.password} onChange={(event) => setField('password', event.target.value)} placeholder="Mínimo 8 caracteres" minLength="8" required /><button type="button" onClick={generatePassword}>Generar</button><button type="button" onClick={() => navigator.clipboard?.writeText(form.password)} aria-label="Copiar contraseña"><Copy /></button></div></label>
              <button className="primary-button primary-button--wide" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <><Plus /> Crear usuario</>}</button>
              <p className="form-security-note"><ShieldCheck /> Comparte estos datos directamente. El alumno deberá cambiar la contraseña en su primer ingreso.</p>
            </form>
          </aside>
        </div>
      </div>
    </main>
  )
}
