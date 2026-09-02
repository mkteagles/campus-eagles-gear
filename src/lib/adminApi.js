import { supabase } from './supabase'

async function request(path, options = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Tu sesión terminó. Vuelve a iniciar sesión.')

  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Para utilizar el panel administrativo local ejecuta “npx vercel dev” en lugar de “npm run dev”.')
  }
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'Ocurrió un error inesperado.')
  return result
}

export const adminApi = {
  listUsers: () => request('/api/admin/users'),
  createUser: (values) => request('/api/admin/users', { method: 'POST', body: JSON.stringify(values) }),
  updateUser: (values) => request('/api/admin/users', { method: 'PATCH', body: JSON.stringify(values) }),
  resetPassword: (values) => request('/api/admin/users', { method: 'PATCH', body: JSON.stringify({ ...values, action: 'reset_password' }) }),
}
