import { createClient } from '@supabase/supabase-js'

const allowedRoles = new Set(['admin', 'student'])
const allowedStatuses = new Set(['active', 'inactive', 'blocked'])

function normalizeEaglesEmail(value) {
  const input = String(value || '').trim().toLowerCase()
  if (!input) return ''
  return input.includes('@') ? input : `${input}@eagles.com`
}

function send(res, status, body) {
  res.status(status).json(body)
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function requireAdmin(req, client) {
  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return { error: 'Sesión no válida.', status: 401 }

  const { data: authData, error: authError } = await client.auth.getUser(token)
  if (authError || !authData.user) return { error: 'Sesión no válida.', status: 401 }

  const { data: profile, error: profileError } = await client
    .from('student_profiles')
    .select('id, role, status')
    .eq('id', authData.user.id)
    .single()

  if (profileError || profile?.role !== 'admin' || profile?.status !== 'active') {
    return { error: 'No tienes permisos de administrador.', status: 403 }
  }

  return { user: authData.user, profile }
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, PATCH')
    return send(res, 405, { error: 'Método no permitido.' })
  }

  const client = getServiceClient()
  if (!client) return send(res, 500, { error: 'Falta configurar el acceso privado de Supabase en Vercel.' })

  const admin = await requireAdmin(req, client)
  if (admin.error) return send(res, admin.status, { error: admin.error })

  if (req.method === 'GET') {
    const { data, error } = await client
      .from('student_profiles')
      .select('id,email,full_name,phone,company_name,city,state,country,role,status,must_change_password,created_at')
      .order('created_at', { ascending: false })

    if (error) return send(res, 500, { error: 'No fue posible cargar los usuarios.' })
    return send(res, 200, { users: data })
  }

  if (req.method === 'POST') {
    const { email, password, fullName, phone, companyName, role = 'student' } = req.body || {}
    const cleanEmail = normalizeEaglesEmail(email)

    if (!/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?@eagles\.com$/.test(cleanEmail)) return send(res, 400, { error: 'El usuario solo puede usar letras, números, punto, guion o guion bajo.' })
    if (String(password || '').length < 8) return send(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres.' })
    if (!allowedRoles.has(role)) return send(res, 400, { error: 'El rol seleccionado no es válido.' })

    const { data: created, error: createError } = await client.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: String(fullName || '').trim(),
        phone: String(phone || '').trim(),
        company_name: String(companyName || '').trim(),
      },
    })

    if (createError) {
      const duplicate = /already|registered|exists/i.test(createError.message)
      return send(res, duplicate ? 409 : 400, { error: duplicate ? 'Ya existe una cuenta con ese usuario.' : 'No fue posible crear el usuario.' })
    }

    const { data: profile, error: profileError } = await client
      .from('student_profiles')
      .update({ role, must_change_password: role !== 'admin' })
      .eq('id', created.user.id)
      .select('id,email,full_name,phone,company_name,role,status,must_change_password,created_at')
      .single()

    if (profileError) {
      await client.auth.admin.deleteUser(created.user.id)
      return send(res, 500, { error: 'La cuenta no pudo terminar de configurarse.' })
    }

    return send(res, 201, { user: profile })
  }

  const { userId, role, status, action, password } = req.body || {}
  if (!userId) return send(res, 400, { error: 'Falta seleccionar un usuario.' })

  if (action === 'reset_password') {
    if (String(password || '').length < 8) return send(res, 400, { error: 'La contraseña temporal debe tener al menos 8 caracteres.' })
    const { error: authError } = await client.auth.admin.updateUserById(userId, { password })
    if (authError) return send(res, 400, { error: 'No fue posible restablecer la contraseña.' })

    const { data, error } = await client
      .from('student_profiles')
      .update({ must_change_password: true })
      .eq('id', userId)
      .select('id,email,full_name,phone,company_name,role,status,must_change_password,created_at')
      .single()

    if (error) return send(res, 500, { error: 'La contraseña cambió, pero no se pudo activar el paso obligatorio.' })
    return send(res, 200, { user: data })
  }

  if (role && !allowedRoles.has(role)) return send(res, 400, { error: 'El rol no es válido.' })
  if (status && !allowedStatuses.has(status)) return send(res, 400, { error: 'El estado no es válido.' })
  if (userId === admin.user.id && ((role && role !== 'admin') || (status && status !== 'active'))) {
    return send(res, 400, { error: 'No puedes quitarte tu propio acceso de administrador.' })
  }

  const changes = {}
  if (role) changes.role = role
  if (status) changes.status = status
  if (!Object.keys(changes).length) return send(res, 400, { error: 'No hay cambios para guardar.' })

  const { data, error } = await client
    .from('student_profiles')
    .update(changes)
    .eq('id', userId)
    .select('id,email,full_name,phone,company_name,role,status,must_change_password,created_at')
    .single()

  if (error) return send(res, 500, { error: 'No fue posible actualizar el usuario.' })
  return send(res, 200, { user: data })
}
