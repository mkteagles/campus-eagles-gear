import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const source = 'eagles-crm'
const allowedCourseIds = new Set(['seminario-empresarial'])

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

function hasValidSecret(req) {
  const expectedSecret = process.env.CAMPUS_PROVISIONING_SECRET || ''
  const authorization = String(req.headers.authorization || '')
  const receivedSecret = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : ''

  if (!expectedSecret || !receivedSecret) return false
  const expected = Buffer.from(expectedSecret)
  const received = Buffer.from(receivedSecret)
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

function slugifyName(value) {
  const parts = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const first = parts[0] || 'alumno'
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return [first, last].filter(Boolean).join('.').slice(0, 34)
}

function buildUsername(fullName, externalId) {
  const suffix = crypto.createHash('sha256').update(externalId).digest('hex').slice(0, 6)
  return `${slugifyName(fullName)}.${suffix}@eagles.com`
}

function createTemporaryPassword() {
  return `Eg!${crypto.randomBytes(9).toString('base64url')}7a`
}

function getCampusLoginUrl(req) {
  const configured = String(process.env.CAMPUS_PUBLIC_URL || '').replace(/\/$/, '')
  if (configured) return `${configured}/login`

  const forwardedHost = req.headers['x-forwarded-host']
  const host = forwardedHost || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  return host ? `${protocol}://${host}/login` : '/login'
}

async function findExistingAuthUser(client, email, externalId) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error

    const match = data.users.find((user) => user.email?.toLowerCase() === email)
    if (match) {
      return match.user_metadata?.crm_external_id === externalId ? match : null
    }
    if (data.users.length < 1000) return null
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'Método no permitido.' })
  }

  if (!hasValidSecret(req)) {
    return send(res, 401, { error: 'Integración no autorizada.' })
  }

  const client = getServiceClient()
  if (!client) {
    return send(res, 500, { error: 'El campus no tiene configurado el acceso privado a Supabase.' })
  }

  const { customerId, fullName, phone, courseId = 'seminario-empresarial' } = req.body || {}
  const numericCustomerId = Number(customerId)
  const cleanExternalId = `crm-customer:${numericCustomerId}`
  const cleanFullName = String(fullName || '').trim()
  const cleanPhone = String(phone || '').trim()

  if (!Number.isSafeInteger(numericCustomerId) || numericCustomerId <= 0) {
    return send(res, 400, { error: 'El customer_id del CRM no es válido.' })
  }
  if (cleanFullName.length < 2 || cleanFullName.length > 120) {
    return send(res, 400, { error: 'El nombre del alumno no es válido.' })
  }
  if (!allowedCourseIds.has(courseId)) {
    return send(res, 400, { error: 'El curso solicitado no está habilitado para esta integración.' })
  }

  const lookup = () => client
    .from('external_enrollments')
    .select('id,user_id,username,status,updated_at')
    .eq('source', source)
    .eq('external_id', cleanExternalId)
    .eq('course_id', courseId)
    .maybeSingle()

  let { data: mapping, error: lookupError } = await lookup()
  if (lookupError) return send(res, 500, { error: 'Falta ejecutar la migración de integración en el campus.' })

  if (mapping?.status === 'active' && mapping.user_id && mapping.username) {
    const { error: profileError } = await client
      .from('student_profiles')
      .update({ status: 'active', crm_customer_id: numericCustomerId })
      .eq('id', mapping.user_id)
    const { error: enrollmentError } = await client.from('course_enrollments').upsert({
      user_id: mapping.user_id,
      course_id: courseId,
      status: 'active',
      expires_at: null,
    }, { onConflict: 'user_id,course_id' })

    if (profileError || enrollmentError) {
      return send(res, 500, { error: 'La cuenta existe, pero no fue posible reactivar su inscripción.' })
    }

    return send(res, 200, {
      created: false,
      userId: mapping.user_id,
      username: mapping.username,
      courseId,
      loginUrl: getCampusLoginUrl(req),
    })
  }

  let ownsReservation = false

  if (!mapping) {
    const { data: inserted, error: insertError } = await client
      .from('external_enrollments')
      .insert({
        source,
        external_id: cleanExternalId,
        course_id: courseId,
        status: 'provisioning',
        metadata: { crm_customer_id: numericCustomerId, full_name: cleanFullName, phone: cleanPhone },
      })
      .select('id,user_id,username,status,updated_at')
      .single()

    if (insertError) {
      const retry = await lookup()
      mapping = retry.data
      if (!mapping) return send(res, 409, { error: 'La solicitud ya está siendo procesada. Intenta nuevamente.' })
    } else {
      mapping = inserted
      ownsReservation = true
    }
  }

  const updatedAt = mapping?.updated_at ? new Date(mapping.updated_at).getTime() : 0
  const recentlyStarted = mapping?.status === 'provisioning' && Date.now() - updatedAt < 90_000

  if (recentlyStarted && !ownsReservation) {
    return send(res, 409, { error: 'El acceso se está generando. Espera unos segundos e intenta otra vez.' })
  }

  await client
    .from('external_enrollments')
    .update({ status: 'provisioning', error_message: null })
    .eq('id', mapping.id)

  const username = buildUsername(cleanFullName, cleanExternalId)
  const temporaryPassword = createTemporaryPassword()
  let user = null
  let createdNow = false

  try {
    const { data: created, error: createError } = await client.auth.admin.createUser({
      email: username,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: cleanFullName,
        phone: cleanPhone,
        created_via: source,
        crm_external_id: cleanExternalId,
        crm_customer_id: numericCustomerId,
      },
    })

    if (createError) {
      const duplicate = /already|registered|exists/i.test(createError.message)
      if (!duplicate) throw createError
      user = await findExistingAuthUser(client, username, cleanExternalId)
      if (!user) throw new Error('El nombre de usuario calculado ya pertenece a otra cuenta.')
    } else {
      user = created.user
      createdNow = true
    }

    const { error: profileError } = await client.from('student_profiles').upsert({
      id: user.id,
      email: username,
      full_name: cleanFullName,
      phone: cleanPhone,
      crm_customer_id: numericCustomerId,
      role: 'student',
      status: 'active',
      must_change_password: true,
    }, { onConflict: 'id' })
    if (profileError) throw profileError

    const { error: enrollmentError } = await client.from('course_enrollments').upsert({
      user_id: user.id,
      course_id: courseId,
      status: 'active',
      expires_at: null,
    }, { onConflict: 'user_id,course_id' })
    if (enrollmentError) throw enrollmentError

    const { error: mappingError } = await client
      .from('external_enrollments')
      .update({
        user_id: user.id,
        username,
        status: 'active',
        error_message: null,
        metadata: { crm_customer_id: numericCustomerId, full_name: cleanFullName, phone: cleanPhone },
      })
      .eq('id', mapping.id)
    if (mappingError) throw mappingError

    return send(res, createdNow ? 201 : 200, {
      created: createdNow,
      userId: user.id,
      username,
      temporaryPassword: createdNow ? temporaryPassword : null,
      courseId,
      loginUrl: getCampusLoginUrl(req),
    })
  } catch (error) {
    if (createdNow && user?.id) await client.auth.admin.deleteUser(user.id)
    await client
      .from('external_enrollments')
      .update({ status: 'failed', error_message: String(error?.message || 'Error desconocido').slice(0, 500) })
      .eq('id', mapping.id)

    return send(res, 500, { error: 'No fue posible generar el acceso. Puedes volver a intentarlo sin crear duplicados.' })
  }
}
