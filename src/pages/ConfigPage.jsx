import { ArrowRight, CheckCircle2, Copy } from 'lucide-react'
import BrandMark from '../components/BrandMark'

export default function ConfigPage() {
  const variables = 'VITE_SUPABASE_URL\nVITE_SUPABASE_ANON_KEY\nSUPABASE_URL\nSUPABASE_SERVICE_ROLE_KEY'
  return (
    <main className="setup-page">
      <div className="setup-card">
        <BrandMark />
        <span className="setup-card__badge">ÚLTIMO PASO</span>
        <h1>Conecta tu campus con Supabase</h1>
        <p>La plataforma está lista. Agrega estas variables en Vercel para activar el acceso de alumnos y el panel administrativo.</p>
        <div className="code-card">
          <pre>{variables}</pre>
          <button onClick={() => navigator.clipboard?.writeText(variables)} aria-label="Copiar variables"><Copy /></button>
        </div>
        <ol className="setup-steps">
          <li><CheckCircle2 /><span><strong>Crea las tablas</strong><small>Ejecuta Base_Datos_Alumnos_Supabase.sql.</small></span></li>
          <li><CheckCircle2 /><span><strong>Agrega las variables</strong><small>En Vercel: Settings → Environment Variables.</small></span></li>
          <li><CheckCircle2 /><span><strong>Vuelve a desplegar</strong><small>El login quedará habilitado automáticamente.</small></span></li>
        </ol>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="primary-button">Abrir Supabase <ArrowRight /></a>
      </div>
    </main>
  )
}
